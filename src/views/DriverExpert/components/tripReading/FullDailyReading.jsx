import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import SearchInput from '../../../components/SearchInput'
import DateRangeFilterCredence from '../../../../components/DateRangeFilterCredence'
import { getDailyReadingApi } from '../../data/drivers'
import { CContainer } from '@coreui/react'
import IconDropdown from '../../../Supervisor/IconDropdown'
import { useNavigate, useParams } from 'react-router-dom'
import usePdfExporter from '../../../customhooks/usePdfExporter'
import useExcelExporter from '../../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import SingleSelectDropdown from '../../../components/SingleSelectDropdown'

const FullDailyReading = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })
  // for status filter
  const [selectedStatus, setSelectedStatus] = useState(null)

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
      selectedStatus?.value,
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
      if (selectedStatus?.value) {
        payload.status = selectedStatus.value
      }

      console.log('📤 Sending payload to API:', payload)
      return getDailyReadingApi(payload)
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
    retry: 0,
  })

  const dailyTrips = apiResponse.data || []
  const totalItems = apiResponse.total || 0
  const totalPages = apiResponse.totalPages || 1

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedStatus, searchQuery, dateRange])

  // Status options for dropdown
  const statusOptions = [
    { label: 'Started', value: 'started' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ]

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

  // Dropdown items for export
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () => {
        const cleanedData = dailyTrips.map(({ status, ...rest }) => ({
          ...rest,
          status: typeof status === 'string' ? status : status?.props?.children || '',
        }))

        exportToPDF({
          title: 'Daily Trips Report',
          columns: columns,
          data: cleanedData,
          fileName: 'Daily_Trips_Report',
        })
      },
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () => {
        const cleanedData = dailyTrips.map(({ status, ...rest }) => ({
          ...rest,
          status: typeof status === 'string' ? status : status?.props?.children || '',
        }))

        exportToExcel({
          title: 'Daily Trips Report',
          columns: columns,
          data: cleanedData,
          fileName: 'Daily_Trips_Report',
        })
      },
    },
    {
      icon: FaPrint,
      label: 'Print Page',
      onClick: () => window.print(),
    },
    {
      icon: FaArrowUp,
      label: 'Scroll To Top',
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
  ]

  return (
    <>
      <ToastContainer />
      {/* Top filters row */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
        <div className="d-flex align-items-center" style={{ gap: '20px' }}>
          <div>
            <DateRangeFilterCredence
              title="Date Range"
              onDateRangeChange={handleDateRangeChange}
              value={dateRange}
            />
          </div>

          <div style={{ minWidth: '180px' }}>
            <SingleSelectDropdown
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              isClearable
              placeholder="Filter Status..."
            />
          </div>
        </div>

        <div style={{ maxWidth: '300px' }}>
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

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default FullDailyReading
