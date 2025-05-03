import React, { useState, useEffect } from 'react'
import Table from '../components/Table'
import SmartPagination from '../components/SmartPagination'
import { fetchDrivers } from './data/drivers'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import SearchInput from '../components/SearchInput'
import { Add } from '@mui/icons-material'
import AddDriverModel from './components/AddDriverModel'

function DriversPage() {
  // const [isFetching, setIsFetching] = useState(true)
  const [filteredData, setFilteredData] = useState([])
  const [visible, setVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const { data: drivers = [], isFetching } = useQuery({
    queryKey: ['drivers'],
    queryFn: fetchDrivers,
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
  })

  useEffect(() => {
    setFilteredData(drivers)
  }, [drivers])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Handle view button click
  const handleViewButton = (id) => {
    navigate(`/DriverProfile/${id}`)
  }

  // Search handler (Filters allData)
  const handleSearch = (query) => {
    setSearchQuery(query)

    if (!query) {
      setFilteredData(drivers) // ← this should be "drivers"
      return
    }

    const filtered = drivers.filter((item) =>
      item.name?.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredData(filtered)
  }

  // Table columns
  const columns = [
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Contact Number', key: 'contactNumber', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Password', key: 'password', sortable: false },
  ]

  const handleEditButton = () => {
    alert('Edit button clicked')
  }

  const handleDeleteButton = () => {
    alert('Delete button clicked')
  }

  const handelAddDriver = () => {
    setVisible(true)
  }

  return (
    <>
      <div className="mb-2 d-flex justify-content-end gap-5 align-items-center">
        <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
        <button
          className="btn text-white"
          style={{ backgroundColor: '#0a2d63' }}
          onClick={handelAddDriver}
        >
          Add Driver
        </button>
      </div>

      <Table
        title="Drivers"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        viewButton={true}
        handleViewButton={handleViewButton}
        isFetching={isFetching}
        editButton={true}
        handleEditButton={handleEditButton}
        deleteButton={true}
        handleDeleteButton={handleDeleteButton}
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
      <AddDriverModel visible={visible} setVisible={setVisible} />
    </>
  )
}

export default DriversPage
