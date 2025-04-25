import React, { useEffect, useState } from 'react'
import { getDriverListApi, markAttendanceBySupervisorApi } from '../data/data'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { useQuery } from '@tanstack/react-query'
import { VscBlank } from 'react-icons/vsc'
import Swal from 'sweetalert2'

const CurrentAttendence = () => {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: driverlist = [], isFetching } = useQuery({
    queryKey: ['driverlist'],
    queryFn: getDriverListApi,
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
  })

  useEffect(() => {
    let filtered = driverlist

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = driverlist.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    setFilteredData(filtered)
  }, [searchQuery, driverlist])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Handle View Button
  const handleViewButton = async (id) => {
    if (isFetching) return // Prevent action while fetching
    try {
      await markAttendanceBySupervisorApi(id)

      setFilteredData((prevData) =>
        prevData.filter((driverlist) => driverlist.id !== id && driverlist._id !== id),
      )

      Swal.fire('Success!', 'Attendance marked successfully.', 'success')
      console.log('Attendance marked and row removed for id:', id)
    } catch (error) {
      Swal.fire('Error', 'Failed to mark attendance.', 'error')
      console.error('Failed to mark attendance:', error)
    }
  }

  // Table columns
  const columns = [
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Contact Number', key: 'contactNumber', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
  ]

  return (
    <>
      <div className="mb-2 d-flex justify-content-end align-items-center">
        <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
      </div>

      <Table
        title="Marks Attendence List"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        viewButton={true}
        viewButtonLabel="Mark Present" //Custom label here
        viewButtonIcon={<VscBlank size={1} />} //Custom icon here
        viewButtonColor={'green'} // Custom green
        handleViewButton={handleViewButton}
        isFetching={isFetching}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value)
          setCurrentPage(1)
          if (value === -1) {
            setItemsPerPage(filteredData.length)
          }
        }}
      />
    </>
  )
}

export default CurrentAttendence
