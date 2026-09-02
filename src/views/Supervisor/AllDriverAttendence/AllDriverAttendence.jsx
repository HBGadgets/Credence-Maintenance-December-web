import React, { useState, useEffect } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import SmartPagination from '../../components/SmartPagination'
import Table from '../../components/Table'
import SearchInput from '../../components/SearchInput'
import { ToastContainer } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getAllDriverAttendenceApi } from '../data/data'

const AllDriverAttendance = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState([])

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [year, month] = selectedMonth.split('-')

  const { data, isFetching } = useQuery({
    queryKey: [
      'DriverAttendacne',
      {
        search: searchQuery,
        page: currentPage,
        limit: itemsPerPage,
        month: parseInt(month, 10),
        year: parseInt(year, 10),
      },
    ],
    queryFn: getAllDriverAttendenceApi,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  })

  useEffect(() => {
    if (data?.data) {
      setFilteredData(data.data)
    }
  }, [data])

  const totalPages = data?.totalPages || 1

  const columns = [
    { label: 'Drivers Name', key: 'driverName', sortable: true },
    { label: 'Total Days', key: 'totalDays', sortable: true },
    { label: 'Present Days', key: 'presentCount', sortable: true },
    { label: 'Absent Days', key: 'absentCount', sortable: true },
    { label: 'leave Days', key: 'leaveCount', sortable: true },
  ]

  const handleViewButton = (id) => {
    navigate(`/DriverProfile/${id}`)
  }

  return (
    <div>
      <ToastContainer />

      <div className="mb-3 d-flex justify-content-between align-items-center ">
        {/* Top Left */}
        <DateRangePicker
          value={selectedMonth}
          onMonthChange={setSelectedMonth}
          style={{ width: '230px' }}
          className="p-0 m-0"
        />

        {/* Top Right */}
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <Table
        title="Driver Attendence Details"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={1}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        viewButton={true}
        handleViewButton={handleViewButton}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value === -1 ? filteredData.length : value)
          setCurrentPage(1)
        }}
      />
    </div>
  )
}

export default AllDriverAttendance
