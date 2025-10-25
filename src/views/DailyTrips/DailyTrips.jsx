import React, { useState, useEffect, useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Table from '../components/Table'
import SmartPagination from '../components/SmartPagination'
import ReusableModal from '../components/ReusableModal'
import AddButton from '../components/AddButton'
import { getAllDailyReadingApi, postDailyReadingApi, patchDailyReadingApi } from './data'
import { fetchDrivers, fetchSupervisor } from '../DriverExpert/data/drivers'
import DateRangeFilterCredence from '../../components/DateRangeFilterCredence'
import SearchInput from '../components/SearchInput'
import { TokenContext } from '../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import SingleSelectDropdown from '../components/SingleSelectDropdown'

const DailyTrips = () => {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })

  const [selectedDriverId, setSelectedDriverId] = useState(null)
  const [showModalFrom, setShowModalFrom] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)
  const [filteredTrips, setFilteredTrips] = useState([])

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // Debug effect to track dateRange changes
  useEffect(() => {
    console.log('🔄 dateRange state updated:', dateRange)
  }, [dateRange])

  // Format date for API (start or end of day)
  const formatDateForAPI = (date, isEnd = false) => {
    if (!date) return ''
    const d = new Date(date)
    if (isEnd) {
      d.setHours(23, 59, 59, 999)
    } else {
      d.setHours(0, 0, 0, 0)
    }

    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Fetch daily trips with filters
  const {
    data: apiResponse = { data: [], total: 0, totalPages: 1 },
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      'dailyTrips',
      currentPage,
      itemsPerPage,
      searchQuery,
      dateRange.startDate,
      dateRange.endDate,
    ],
    queryFn: () => {
      const payload = {
        search: searchQuery,
        page: currentPage,
        limit: itemsPerPage,
      }

      // Only add date filters if they have values
      if (dateRange.startDate) {
        payload.startDate = formatDateForAPI(dateRange.startDate)
      }
      if (dateRange.endDate) {
        payload.endDate = formatDateForAPI(dateRange.endDate, true)
      }

      console.log('📡 Sending payload to API:', payload)

      return getAllDailyReadingApi(payload)
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  })

  const dailyTrips = apiResponse.data || []
  const totalItems = apiResponse.total || 0
  const totalPages = apiResponse.totalPages || 1

  // Fetch driver list
  const { data: drivers = [] } = useQuery({
    queryKey: ['drivers'],
    queryFn: fetchDrivers,
    staleTime: 1000 * 60 * 30,
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  // filtered supervisor data
  useEffect(() => {
    let filtered = dailyTrips

    // Filter by supervisor if selected
    if (selectedName?.value) {
      filtered = filtered.filter((dailyTrip) => dailyTrip.supervisorId === selectedName.value)
    }

    setFilteredTrips(filtered)
  }, [selectedName, dailyTrips])

  // Handle Date Range Change
  const handleDateRangeChange = (start, end) => {
    console.log('📅 Received from picker:', start, end)

    const normalizedRange = {
      startDate: start || null,
      endDate: end || null,
    }

    console.log('📅 Normalized date range:', normalizedRange)
    setDateRange(normalizedRange)
    setCurrentPage(1)
  }

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  // Handle Add/Edit Submit
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true)
      if (editMode) {
        await patchDailyReadingApi(editingUser.id, editingUser.driverId, formData)
        toast.success('Trip End Reading Updated Successfully')
      } else {
        const driverId = selectedDriverId || formData.driverId
        await postDailyReadingApi(driverId, formData)
        toast.success('Trip Started Successfully')
      }
      await refetch()
      queryClient.invalidateQueries(['dailyTrips'])
      setShowModalFrom(false)
      setEditMode(false)
      setEditingUser(null)
      setSelectedDriverId(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Edit Button
  const handleEditButton = (id) => {
    const record = dailyTrips.find((item) => item.id === id)
    if (record) {
      const driver = drivers.find((d) => d.name === record.driverName)
      setEditMode(true)
      setEditingUser({
        ...record,
        driverId: driver?.id || record.driverId || '',
        odometerEnd: record.odometerEnd || '',
      })
      setShowModalFrom(true)
    }
  }

  // Dynamic Form Fields
  const fields = [
    {
      name: 'driverId',
      label: 'Driver Name',
      type: 'select',
      options: drivers?.map((drv) => ({ label: drv.name, value: drv.id })) || [],
      required: true,
      disabled: editMode,
      onChange: (e) => setSelectedDriverId(e.target.value),
    },
    ...(!editMode
      ? [
          {
            name: 'odometerStart',
            label: 'Start Odometer Reading',
            type: 'number',
            placeholder: 'Enter Start Odometer',
            required: true,
            min: 0,
          },
        ]
      : [
          {
            name: 'odometerEnd',
            label: 'End Odometer Reading',
            type: 'number',
            placeholder: 'Enter End Odometer',
            required: true,
            min: 0,
          },
        ]),
  ]

  // status color
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
        status === 'started'
          ? '#f5a623'
          : status === 'completed'
            ? '#28a745'
            : status === 'cancelled'
              ? '#dc3545'
              : '#6c757d',
      color: 'white',
    }
  }

  // Table Columns
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

  return (
    <>
      <ToastContainer />

      <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <DateRangeFilterCredence
            title="Date Range"
            onDateRangeChange={handleDateRangeChange}
            value={dateRange}
          />
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
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={handleSearch}
            placeholder="Search by driver name or vehicle number..."
          />
          <AddButton
            label="Add Daily Log"
            onClick={() => {
              setEditMode(false)
              setEditingUser(null)
              setSelectedDriverId(null)
              setShowModalFrom(true)
            }}
          />
        </div>
      </div>

      <ReusableModal
        show={showModalFrom}
        title={editMode ? 'End Trip Reading' : 'Start Trip Reading'}
        initialData={editMode ? editingUser : null}
        onClose={() => {
          setShowModalFrom(false)
          setEditMode(false)
          setEditingUser(null)
          setSelectedDriverId(null)
        }}
        onSubmit={handleFormSubmit}
        fields={fields}
        isSubmitting={isSubmitting}
      />

      <Table
        title="All Drivers Daily Logs"
        columns={columns}
        // filteredData={dailyTrips}
        filteredData={filteredTrips}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        editButton={true}
        handleEditButton={handleEditButton}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value === -1 ? totalItems : value)
          setCurrentPage(1)
        }}
        totalItems={totalItems}
      />
    </>
  )
}

export default DailyTrips
