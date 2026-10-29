import React, { useContext, useEffect, useState } from 'react'
import { Trip } from '../../road-side-assistance/types'
import SmartPagination from '../../components/SmartPagination'
import Table from '../../components/Table'
import { getTripListApi } from '../../Supervisor/data/data'
import { getDailyTripLogsApi } from '../data/data'
import { useQuery } from '@tanstack/react-query'
import { TokenContext } from '../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import { ToastContainer } from 'react-toastify'
import SearchInput from '../../components/SearchInput'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import { fetchSupervisor } from '../../DriverExpert/data/drivers'
import { useNavigate } from 'react-router-dom'
import { CNav, CNavItem, CNavLink } from '@coreui/react'
import { FaTruck, FaRoute } from 'react-icons/fa'
import Cookies from 'js-cookie'

const TripPending = () => {
  const [activeTab, setActiveTab] = useState('dailyTrip') // 'dailyTrip' or 'trip'
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })
  const [selectedStatus, setSelectedStatus] = useState(null)
  const navigate = useNavigate()

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // superadmin role
  const contextToken = useContext(TokenContext)
  const token = contextToken || Cookies.get('crdnsMaintToken')
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  const statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Started', value: 'started' },
    { label: 'Cancelled', value: 'cancelled' },
  ]

  const getStatusStyle = (status) => {
    const s = String(status || '').toLowerCase()
    let bg = '#6c757d'
    if (s === 'in-progress' || s === 'started') bg = '#f5a623'
    else if (s === 'completed') bg = '#28a745'
    else if (s === 'cancelled') bg = '#dc3545'

    return {
      display: 'inline-block',
      minWidth: '70px',
      padding: '1px 8px',
      borderRadius: '10px',
      textAlign: 'center',
      textTransform: 'capitalize',
      fontWeight: '400',
      color: 'white',
      backgroundColor: bg,
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      return `${day}/${month}/${year}`
    } catch {
      return dateStr
    }
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    } catch {
      return dateStr
    }
  }

  const formatDateForAPI = (date, isEnd = false) => {
    if (!date) return ''
    const d = new Date(date)
    if (isEnd) d.setHours(23, 59, 59, 999)
    else d.setHours(0, 0, 0, 0)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Fetch Trips List (Tab 1: Trip)
  const {
    data: TripsList = [],
    isFetching: isFetchingTrips,
  } = useQuery({
    queryKey: ['TripsList'],
    queryFn: () => getTripListApi(null, token),
    staleTime: 1000 * 60 * 30,
    enabled: !!token && activeTab === 'trip',
  })

  // Fetch Delivery / Daily Trips (Tab 2: Daily Trip via /daily/tripgetbydriver)
  const {
    data: dailyTripsResponse,
    isFetching: isFetchingDaily,
  } = useQuery({
    queryKey: [
      'dailyTripsPending',
      token,
      currentPage,
      itemsPerPage,
      searchQuery,
      selectedName?.value,
      selectedStatus?.value,
      dateRange.startDate,
      dateRange.endDate,
    ],
    queryFn: () =>
      getDailyTripLogsApi({
        token,
        page: currentPage,
        limit: itemsPerPage === -1 ? 10000 : itemsPerPage,
        search: searchQuery,
        status: selectedStatus?.value || '',
        supervisorId: selectedName?.value || '',
        startDate: dateRange.startDate ? formatDateForAPI(dateRange.startDate) : '',
        endDate: dateRange.endDate ? formatDateForAPI(dateRange.endDate, true) : '',
      }),
    staleTime: 1000 * 60 * 5,
    enabled: !!token && activeTab === 'dailyTrip',
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
    enabled: !!token && !!decodedToken,
  })

  // Handle data for 'trip' tab
  useEffect(() => {
    if (activeTab !== 'trip') return

    if (!TripsList || TripsList.length === 0) {
      setFilteredData([])
      return
    }

    let filtered = [...TripsList]

    // Filter by status if selected
    if (selectedStatus?.value) {
      filtered = filtered.filter(
        (trip) => String(trip.status || '').toLowerCase() === selectedStatus.value.toLowerCase(),
      )
    }

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
  }, [activeTab, TripsList, searchQuery, dateRange, selectedName, selectedStatus])

  // Handle data for 'dailyTrip' tab
  useEffect(() => {
    if (activeTab !== 'dailyTrip') return

    const rawList = dailyTripsResponse?.data || []
    const transformed = rawList.map((item) => ({
      id: item._id,
      _id: item._id,
      date: formatDate(item.createdAt || item.date || item.startTime),
      driverName: item.driverId?.name || item.driverName || 'N/A',
      contactNumber: item.driverId?.contactNumber || item.contactNumber || 'N/A',
      vehicleName:
        item.driverId?.currentVehicleName || item.vehicleNumber || item.vehicleName || 'N/A',
      odometerStart: item.odometerStart ?? '-',
      odometerEnd: item.odometerEnd ?? '-',
      startTime: formatDateTime(item.startTime),
      endTime: item.endTime ? formatDateTime(item.endTime) : '-',
      totalDistance:
        item.totalDistance !== undefined && item.totalDistance !== null
          ? `${item.totalDistance} KM`
          : '-',
      gpsKM: item.gpsKM !== undefined && item.gpsKM !== null ? `${item.gpsKM} KM` : '-',
      status: item.status || 'N/A',
      supervisorId: item.supervisorId || item.driverId?.supervisor || '',
    }))

    setFilteredData(transformed)
  }, [activeTab, dailyTripsResponse])

  const totalPages =
    activeTab === 'dailyTrip'
      ? itemsPerPage === -1
        ? 1
        : dailyTripsResponse?.totalPages ||
          Math.ceil((dailyTripsResponse?.total || 0) / (itemsPerPage > 0 ? itemsPerPage : 10)) ||
          1
      : Math.ceil(filteredData.length / (itemsPerPage > 0 ? itemsPerPage : 10)) || 1

  const totalItems =
    activeTab === 'dailyTrip'
      ? dailyTripsResponse?.total || 0
      : filteredData.length

  const tripColumns = [
    { label: 'Trip ID', key: 'tripId', sortable: false, hidden: true },
    { label: 'Trips Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Company Name', key: 'companyName', sortable: true },
    { label: 'Client Name', key: 'clientName', sortable: true },
    { label: 'Start Location', key: 'startLocation', sortable: true },
    { label: 'End Location', key: 'endLocation', sortable: true },
    {
      label: 'Status',
      key: 'status',
      render: (row) => <span style={getStatusStyle(row.status)}>{row.status}</span>,
      sortable: true,
    },
  ]

  const dailyTripColumns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Contact Number', key: 'contactNumber', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Start Odometer', key: 'odometerStart', sortable: true },
    { label: 'Start Time', key: 'startTime', sortable: true },
    { label: 'End Odometer', key: 'odometerEnd', sortable: true },
    { label: 'End Time', key: 'endTime', sortable: true },
    { label: 'Total Distance', key: 'totalDistance', sortable: true },
    { label: 'GPS KM', key: 'gpsKM', sortable: true },
    {
      label: 'Status',
      key: 'status',
      render: (row) => <span style={getStatusStyle(row.status)}>{row.status}</span>,
      sortable: true,
    },
  ]

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  // Handle Date Range Change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
    setCurrentPage(1)
  }

  // Handle View button (Subtrips)
  const handleViewButton = (id) => {
    console.log('trip id ', id)
    navigate(`/SubTrips/${id}`)
  }

  return (
    <>
      <ToastContainer />

      {/* Navigation Tabs */}
      <CNav variant="tabs" className="mb-3 border-bottom">
        <CNavItem>
          <CNavLink
            active={activeTab === 'dailyTrip'}
            onClick={() => handleTabChange('dailyTrip')}
            style={{ cursor: 'pointer', fontWeight: 600 }}
            className="d-flex align-items-center gap-2"
          >
            <FaRoute size={16} />
            <span>Daily Trip</span>
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === 'trip'}
            onClick={() => handleTabChange('trip')}
            style={{ cursor: 'pointer', fontWeight: 600 }}
            className="d-flex align-items-center gap-2"
          >
            <FaTruck size={16} />
            <span>Trip</span>
          </CNavLink>
        </CNavItem>
      </CNav>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
          {userRole === 'superadmin' && (
            <div style={{ width: '150px' }}>
              <SingleSelectDropdown
                options={supervisorOptions}
                value={selectedName}
                onChange={(selected) => {
                  setSelectedName(selected)
                  setCurrentPage(1)
                }}
                isClearable
                placeholder="Filter by Supervisor..."
              />
            </div>
          )}
          <div style={{ width: '150px' }}>
            <SingleSelectDropdown
              options={statusOptions}
              value={selectedStatus}
              onChange={(selected) => {
                setSelectedStatus(selected)
                setCurrentPage(1)
              }}
              isClearable
              placeholder="Filter by Status..."
            />
          </div>
        </div>

        <div className="d-flex justify-content-end align-items-center gap-2 w-75">
          <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
        </div>
      </div>

      <div>
        <Table
          title={activeTab === 'dailyTrip' ? 'Daily Trips' : 'Live On Duty Trips'}
          columns={activeTab === 'dailyTrip' ? dailyTripColumns : tripColumns}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          isFetching={isFetchingTrips || isFetchingDaily}
          serverPagination={activeTab === 'dailyTrip'}
          totalServerItems={dailyTripsResponse?.total || 0}
          viewButton={activeTab === 'trip'}
          viewButtonLabel="Subtrips"
          handleViewButton={handleViewButton}
        />

        <SmartPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value === -1 ? (activeTab === 'dailyTrip' ? -1 : filteredData.length) : value)
            setCurrentPage(1)
          }}
          totalItems={totalItems}
        />
      </div>
    </>
  )
}

export default TripPending
