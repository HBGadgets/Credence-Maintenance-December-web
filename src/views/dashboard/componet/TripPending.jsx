import React, { useContext, useEffect, useState } from 'react'
import { Trip } from '../../road-side-assistance/types'
import SmartPagination from '../../components/SmartPagination'
import Table from '../../components/Table'
import { getTripListApi } from '../../Supervisor/data/data'
import { useQuery } from '@tanstack/react-query'
import { TokenContext } from '../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import { ToastContainer } from 'react-toastify'
import SearchInput from '../../components/SearchInput'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import { fetchSupervisor } from '../../DriverExpert/data/drivers'
import { useNavigate } from 'react-router-dom'

const TripPending = () => {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state
  const navigate = useNavigate()

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  const getStatusStyle = (status) => {
    return {
      display: 'inline-block',
      minWidth: '70px',
      padding: '1px 8px',
      borderRadius: '10px',
      textAlign: 'center',
      textTransform: 'capitalize',
      fontWeight: '400',
      color: 'white',
      backgroundColor: status === 'in-progress' ? '#f5a623' : '#6c757d', // default gray for all others
    }
  }

  // Fetch Data
  const {
    data: TripsList = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['TripsList'],
    queryFn: () => getTripListApi(null, token),
    staleTime: 1000 * 60 * 30,
    enabled: !!token, //  only run if token is available
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
    enabled: !!token && !!decodedToken,
  })

  useEffect(() => {
    if (!TripsList || TripsList.length === 0) return

    // Start with only in-progress trips
    let filtered = TripsList.filter((trip) => trip.status === 'in-progress')

    // Filter by supervisor if selected
    if (selectedName?.value) {
      filtered = filtered.filter((trip) => trip.supervisorId === selectedName.value)
    }

    // Filter by date range if available
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date || item.orginalDate)
        return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
      })
    }

    // Apply search query filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    setFilteredData(filtered)
  }, [TripsList, searchQuery, dateRange, selectedName])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const columns = [
    { label: 'Trip ID', key: 'tripId', sortable: false, hidden: true },
    { label: 'Trips Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Current Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Start Location', key: 'startLocation', sortable: true },
    { label: 'End Location', key: 'endLocation', sortable: true },
    {
      label: 'Status',
      key: 'status',
      render: (row) => <span style={getStatusStyle(row.status)}>{row.status}</span>,
      sortable: true,
    },
  ]

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Handle Date Range Change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }

  // Handle View button
  const handleViewButton = (id) => {
    console.log('trip id ', id)
    navigate(`/SubTrips/${id}`)
  }

  return (
    <>
      <ToastContainer />

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
          {userRole === 'superadmin' && (
            <div style={{ width: '150px' }}>
              <SingleSelectDropdown
                options={supervisorOptions}
                value={selectedName}
                onChange={setSelectedName}
                isClearable
                placeholder="Filter by Supervisor Name..."
              />
            </div>
          )}
        </div>

        <div className="d-flex justify-content-end align-items-center gap-2 w-75">
          <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
        </div>
      </div>

      <div>
        <Table
          title="Live On Duty Trips"
          columns={columns}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          isFetching={isFetching}
          viewButton={true}
          viewButtonLabel="Subtrips"
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
    </>
  )
}

export default TripPending
