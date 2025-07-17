import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { getInpectionVehicleIdApi } from '../data/VehicleListData'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import SearchInput from '../../components/SearchInput'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'

const InpectionList = () => {
  const { id } = useParams()
  console.log(id)
  const navigate = useNavigate()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state

  //  Status style
  const getStatusStyle = (status) => {
    return {
      display: 'inline-block',
      minWidth: '70px',
      padding: '1px 8px',
      borderRadius: '10px',
      textAlign: 'center',
      textTransform: 'capitalize',
      fontWeight: '400',
      backgroundColor:
        status === 'in-progress'
          ? '#f5a623'
          : status === 'completed'
            ? '#28a745'
            : status === 'cancelled'
              ? '#dc3545'
              : '#6c757d',
      color: 'white',
    }
  }

  // Fetch Data
  const {
    data: vehicleinpection,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['vehicleinpection', id],
    queryFn: () => getInpectionVehicleIdApi(id),
    enabled: !!id, // only run if `id` exists
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60,
  })

  console.log(vehicleinpection)

  useEffect(() => {
    if (!vehicleinpection) return

    let filtered = [...vehicleinpection] // Start with a copy of the data

    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    // Apply date range filter
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate)
      const end = new Date(dateRange.endDate)
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.orignalDate)
        return itemDate >= start && itemDate <= end
      })
    }

    setFilteredData(filtered)
  }, [vehicleinpection, searchQuery, dateRange])

  // table data columns
  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Trips Start', key: 'startLocation', sortable: true },
    { label: 'Trips End', key: 'endLocation', sortable: true },
    {
      label: 'Trip Status',
      key: 'status',
      render: (row) => <span style={getStatusStyle(row.status)}>{row.status}</span>,
      sortable: true,
    },
    { label: 'Inpections Pass', key: 'inpectionPass', sortable: true },
    { label: 'Inpections Fail', key: 'inpectionFail', sortable: true },
  ]

  // Handle Search
  const handleSearch = (query) => setSearchQuery(query)

  // Handle Date Range Change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }

  // handle view button

  const handleViewButton = (id) => {
    console.log('idzzz ', id)
    navigate(`/AnalayisInpection/${id}`)
  }

  return (
    <div>
      <ToastContainer />

      <div>
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
          </div>
          <div className="d-flex justify-content-end align-items-center gap-2 w-75">
            <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
          </div>
        </div>
      </div>

      <Table
        title="All Vehicle Inpections"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        isError={isError}
        viewButton={true}
        handleViewButton={handleViewButton}
        action="Details"
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

export default InpectionList
