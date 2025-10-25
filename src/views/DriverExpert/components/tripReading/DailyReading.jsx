import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import SearchInput from '../../../components/SearchInput'
import DateRangeFilterCredence from '../../../../components/DateRangeFilterCredence'
import { getDailyReadingApi } from '../../data/drivers'
import { CContainer } from '@coreui/react'
import IconDropdown from '../../../Supervisor/IconDropdown'
import { useNavigate } from 'react-router-dom'

const DailyReading = ({ id }) => {
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })

  console.log(' Driver ID in component:', id)

  // Format date to ISO string for API
  const formatDateForAPI = (date, isEnd = false) => {
    if (!date) return ''
    const d = new Date(date)
    if (isEnd) d.setHours(23, 59, 59, 999)
    else d.setHours(0, 0, 0, 0)
    return d.toISOString()
  }

  const { data: apiResponse = { data: [], total: 0, totalPages: 1 }, isFetching } = useQuery({
    queryKey: [
      'dailyTrips',
      id,
      currentPage,
      itemsPerPage,
      searchQuery,
      dateRange.startDate,
      dateRange.endDate,
    ],
    queryFn: () => {
      if (!id) return { data: [], total: 0, totalPages: 1 }

      const payload = {
        driverId: id,
        search: searchQuery,
        page: currentPage,
        limit: itemsPerPage,
      }

      if (dateRange.startDate) payload.startDate = formatDateForAPI(dateRange.startDate)
      if (dateRange.endDate) payload.endDate = formatDateForAPI(dateRange.endDate, true)

      console.log('📤 Sending payload to API:', payload)
      return getDailyReadingApi(payload)
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  })

  const dailyTrips = apiResponse.data || []
  const totalItems = apiResponse.total || 0
  const totalPages = apiResponse.totalPages || 1

  const handleDateRangeChange = (start, end) => {
    setDateRange({ startDate: start, endDate: end })
    setCurrentPage(1)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const getStatusStyle = (status) => ({
    display: 'inline-block',
    minWidth: '70px',
    padding: '1px 8px',
    borderRadius: '10px',
    textAlign: 'center',
    textTransform: 'capitalize',
    fontWeight: '400',
    backgroundColor:
      status === 'started'
        ? '#f5a623'
        : status === 'completed'
          ? '#28a745'
          : status === 'cancelled'
            ? '#dc3545'
            : '#6c757d',
    color: 'white',
  })

  const columns = [
    { label: 'Date', key: 'createdAt', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Vehicle', key: 'vehicleNumber', sortable: true },
    { label: 'Start Trip', key: 'startTime', sortable: true },
    { label: 'Start Odometer', key: 'odometerStart', sortable: true },
    { label: 'End Trip', key: 'endTime', sortable: true },
    { label: 'End Odometer', key: 'odometerEnd', sortable: true },
    { label: 'Total KM', key: 'totalDistance', sortable: true },
    { label: 'GPS Km', key: 'gpsKM', sortable: true },
    {
      label: 'Status',
      key: 'status',
      render: (row) => <span style={getStatusStyle(row.status)}>{row.status}</span>,
    },
  ]

  // handle navigate
  const handleViewDetailedReport = (id) => {
    navigate(`/FullDailyReading/${id}`)
  }

  return (
    <>
      <ToastContainer />
      <CContainer className="px-2" fluid>
        {/* Top filters row */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <div className="me-2">
            <DateRangeFilterCredence
              title="Date Range"
              onDateRangeChange={handleDateRangeChange}
              value={dateRange}
            />
          </div>

          <div className="ms-2 flex-grow-1" style={{ maxWidth: '300px' }}>
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={handleSearch}
              placeholder="Search by driver name or vehicle number..."
            />
          </div>
        </div>

        {/* Table */}
        <Table
          title="All Drivers Daily Logs"
          columns={columns}
          filteredData={dailyTrips}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          isFetching={isFetching}
        />

        {/* Button at bottom right */}
        <div className="mt-3 text-end">
          <button
            onClick={() => handleViewDetailedReport(id)}
            className="rounded ps-3 pe-3 btn btn-outline-primary custom-hover"
          >
            View Detailed Report
          </button>
        </div>
      </CContainer>
    </>
  )
}

export default DailyReading
