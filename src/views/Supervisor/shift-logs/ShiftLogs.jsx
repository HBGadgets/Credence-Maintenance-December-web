import React, { useState, useEffect, useMemo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  CBadge,
  CTooltip,
  CNav,
  CNavItem,
  CNavLink,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CFormSelect,
  CFormInput,
  CFormLabel,
  CButton,
} from '@coreui/react'
import {
  FaClock,
  FaRegFilePdf,
  FaPrint,
  FaArrowUp,
  FaTruck,
  FaUserTie,
  FaUndo,
} from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import { jwtDecode } from 'jwt-decode'

import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import IconDropdown from '../IconDropdown'
import FilterShiftHistoryModal from './components/FilterShiftHistoryModal'
import { TokenContext } from '../../../context/TokenContext'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import useDebounce from '../../customhooks/useDebounce'
import { fetchSupervisor, fetchDrivers } from '../../DriverExpert/data/drivers'
import { fetchVehicles } from '../../vehicle/data/VehicleListData'
import { getVehicleShiftLogsApi, getDriverShiftLogsApi } from './data'

const MONTH_OPTIONS = [
  { value: '', label: 'All Months' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

const MIN_PAST_YEAR = 2020
const MIN_DATE = '2020-01-01'

const YEAR_OPTIONS = [
  { value: '', label: 'All' },
  ...Array.from(
    { length: Math.max(1, new Date().getFullYear() - MIN_PAST_YEAR + 1) },
    (_, i) => {
      const y = String(new Date().getFullYear() - i)
      return { value: y, label: y }
    },
  ),
]

function ShiftLogs() {
  const navigate = useNavigate()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()

  const [activeTab, setActiveTab] = useState('vehicle') // 'vehicle' | 'driver'

  // Pagination for Vehicle tab
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Pagination for Driver tab
  const [driverCurrentPage, setDriverCurrentPage] = useState(1)
  const [driverItemsPerPage, setDriverItemsPerPage] = useState(10)

  // Filter States
  const [status, setStatus] = useState('all') // 'all' | 'active' | 'completed'
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedSupervisor, setSelectedSupervisor] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [selectedDriver, setSelectedDriver] = useState(null)

  // Modal for Driver Shift History
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [selectedRowForHistory, setSelectedRowForHistory] = useState(null)

  // Auth & Roles
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // Date constraints
  const todayDate = useMemo(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }, [])

  const currentYear = useMemo(() => new Date().getFullYear(), [])
  const currentMonth = useMemo(() => new Date().getMonth() + 1, [])

  const availableMonthOptions = useMemo(() => {
    const isCurrentOrFutureYear = !year || Number(year) >= currentYear
    return MONTH_OPTIONS.map((m) => {
      const isFutureMonth = isCurrentOrFutureYear && m.value !== '' && Number(m.value) > currentMonth
      return {
        ...m,
        disabled: isFutureMonth,
      }
    })
  }, [year, currentYear, currentMonth])

  // Reset month if user changes year to current year and the selected month is in the future
  useEffect(() => {
    const isCurrentOrFutureYear = !year || Number(year) >= currentYear
    if (isCurrentOrFutureYear && month && Number(month) > currentMonth) {
      setMonth('')
    }
  }, [year, month, currentYear, currentMonth])

  // Debounced Filter Values for typing inputs
  const debouncedYear = useDebounce(year, 500)
  const debouncedStartDate = useDebounce(startDate, 400)
  const debouncedEndDate = useDebounce(endDate, 400)

  const hasDateRange = Boolean(debouncedStartDate || debouncedEndDate)
  const effectiveMonth = !hasDateRange && month ? Number(month) : undefined
  const effectiveYear = !hasDateRange && debouncedYear ? Number(debouncedYear) : undefined
  const effectiveStartDate = hasDateRange ? debouncedStartDate || undefined : undefined
  const effectiveEndDate = hasDateRange ? debouncedEndDate || undefined : undefined
  const effectiveStatus = status && status !== 'all' ? status : undefined
  const effectiveSupervisor = selectedSupervisor?.value || undefined

  // Fetch Vehicle Shift Logs (Endpoint 5)
  const {
    data: vehicleShiftLogsResponse,
    isFetching: isFetchingVehicleLogs,
  } = useQuery({
    queryKey: [
      'vehicleShiftLogsAll',
      currentPage,
      itemsPerPage,
      effectiveStatus,
      effectiveMonth,
      effectiveYear,
      effectiveStartDate,
      effectiveEndDate,
      effectiveSupervisor,
      selectedVehicle?.value,
    ],
    queryFn: () =>
      getVehicleShiftLogsApi({
        page: currentPage,
        limit: itemsPerPage,
        status: effectiveStatus,
        month: effectiveMonth,
        year: effectiveYear,
        startDate: effectiveStartDate,
        endDate: effectiveEndDate,
        supervisorId: effectiveSupervisor,
        vehicleId: selectedVehicle?.value || undefined,
      }),
    enabled: activeTab === 'vehicle',
    staleTime: 1000 * 60 * 2,
    retry: false,
    refetchOnWindowFocus: false,
  })

  // Fetch Driver Shift Logs (Endpoint 6)
  const {
    data: driverShiftLogsResponse,
    isFetching: isFetchingDriverLogs,
  } = useQuery({
    queryKey: [
      'driverShiftLogsAll',
      driverCurrentPage,
      driverItemsPerPage,
      effectiveStatus,
      effectiveMonth,
      effectiveYear,
      effectiveStartDate,
      effectiveEndDate,
      effectiveSupervisor,
      selectedDriver?.value,
    ],
    queryFn: () =>
      getDriverShiftLogsApi({
        page: driverCurrentPage,
        limit: driverItemsPerPage,
        status: effectiveStatus,
        month: effectiveMonth,
        year: effectiveYear,
        startDate: effectiveStartDate,
        endDate: effectiveEndDate,
        supervisorId: effectiveSupervisor,
        driverId: selectedDriver?.value || undefined,
      }),
    enabled: activeTab === 'driver',
    staleTime: 1000 * 60 * 2,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const vehicleLogsList = Array.isArray(vehicleShiftLogsResponse?.data)
    ? vehicleShiftLogsResponse.data
    : []
  const vehicleTotalCount =
    vehicleShiftLogsResponse?.total ??
    vehicleShiftLogsResponse?.totalRecords ??
    vehicleShiftLogsResponse?.count ??
    vehicleLogsList.length
  const vehicleTotalPages =
    vehicleShiftLogsResponse?.totalPages ??
    Math.max(1, Math.ceil(vehicleTotalCount / itemsPerPage))

  const driverLogsList = Array.isArray(driverShiftLogsResponse?.data)
    ? driverShiftLogsResponse.data
    : []
  const driverTotalCount =
    driverShiftLogsResponse?.total ??
    driverShiftLogsResponse?.totalRecords ??
    driverShiftLogsResponse?.count ??
    driverLogsList.length
  const driverTotalPages =
    driverShiftLogsResponse?.totalPages ??
    Math.max(1, Math.ceil(driverTotalCount / driverItemsPerPage))

  // Fetch Supervisors for superadmin filter
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
    enabled: userRole === 'superadmin',
  })

  // Fetch Vehicles for Vehicle Tab filter
  const { data: vehiclesData = [] } = useQuery({
    queryKey: ['vehiclesList'],
    queryFn: () => fetchVehicles(),
    staleTime: 1000 * 60 * 5,
  })

  const vehicleOptions = useMemo(() => {
    if (!Array.isArray(vehiclesData)) return []
    return vehiclesData.map((v) => ({
      value: v.id || v._id,
      label: v.name || 'Unknown Vehicle',
    }))
  }, [vehiclesData])

  // Fetch Drivers for Driver Tab filter
  const { data: driversData = [] } = useQuery({
    queryKey: ['driversList'],
    queryFn: fetchDrivers,
    staleTime: 1000 * 60 * 5,
  })

  const driverOptions = useMemo(() => {
    if (!Array.isArray(driversData)) return []
    return driversData.map((d) => ({
      value: d.id || d._id,
      label: d.name ? (d.contactNumber ? `${d.name} (${d.contactNumber})` : d.name) : 'Unknown Driver',
    }))
  }, [driversData])

  // Reset page whenever filters change
  useEffect(() => {
    setCurrentPage(1)
    setDriverCurrentPage(1)
  }, [
    status,
    month,
    debouncedYear,
    debouncedStartDate,
    debouncedEndDate,
    selectedSupervisor?.value,
    selectedVehicle?.value,
    selectedDriver?.value,
  ])

  // Open parameter prompt modal for viewing driver shift history
  const handleViewDetailLogs = (row) => {
    setSelectedRowForHistory(row)
    setFilterModalVisible(true)
  }

  // Navigate to DriverShiftLogs with confirmed parameters
  const handleConfirmHistoryFilters = (params) => {
    const searchParams = new URLSearchParams()
    if (params.driverId) searchParams.set('driverId', params.driverId)
    if (params.driverName) searchParams.set('driverName', params.driverName)
    if (params.status && params.status !== 'all') searchParams.set('status', params.status)
    if (params.startDate) searchParams.set('startDate', params.startDate)
    if (params.endDate) searchParams.set('endDate', params.endDate)
    if (params.month) searchParams.set('month', params.month)
    if (params.year) searchParams.set('year', params.year)

    navigate(`/DriverShiftLogs?${searchParams.toString()}`)
  }

  const hasActiveFilters = Boolean(
    (status && status !== 'all') ||
    month ||
    year ||
    startDate ||
    endDate ||
    selectedSupervisor ||
    selectedVehicle ||
    selectedDriver
  )

  // Handle Date Range (single date or range) from unified calendar button
  const handleDateRangeChange = (start, end) => {
    if (!start && !end) {
      setStartDate('')
      setEndDate('')
      setCurrentPage(1)
      setDriverCurrentPage(1)
      return
    }

    const formatDateToYMD = (date) => {
      if (!date) return ''
      const d = new Date(date)
      if (isNaN(d.getTime())) return ''
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    }

    const formattedStart = formatDateToYMD(start)
    const formattedEnd = formatDateToYMD(end || start)

    setStartDate(formattedStart)
    setEndDate(formattedEnd)
    if (formattedStart || formattedEnd) {
      setMonth('')
      setYear('')
    }
    setCurrentPage(1)
    setDriverCurrentPage(1)
  }

  const handleResetFilters = () => {
    setStatus('all')
    setMonth('')
    setYear('')
    setStartDate('')
    setEndDate('')
    setSelectedSupervisor(null)
    setSelectedVehicle(null)
    setSelectedDriver(null)
    setCurrentPage(1)
    setDriverCurrentPage(1)
  }

  // Columns for Vehicle Shift Logs
  const vehicleColumns = [
    {
      label: 'Vehicle',
      key: 'vehicleName',
      sortable: true,
      render: (row) => (
        <span className="fw-semibold text-dark">{row.vehicleName}</span>
      ),
    },
    {
      label: 'Driver Name',
      key: 'driverName',
      sortable: true,
      render: (row) => (
        <span className="fw-semibold text-dark">{row.driverName}</span>
      ),
    },
    {
      label: 'Contact Number',
      key: 'contactNumber',
      sortable: true,
      render: (row) => (
        <span className="text-secondary">
          {row.contactNumber && row.contactNumber !== 'N/A' ? row.contactNumber : '—'}
        </span>
      ),
    },
    {
      label: 'Assigned At',
      key: 'assignedAtFormatted',
      sortable: true,
      render: (row) => (
        <span className="small text-nowrap">
          {row.assignedAtFormatted || '—'}
        </span>
      ),
    },
    {
      label: 'Unassigned At',
      key: 'unassignedAtFormatted',
      sortable: true,
      render: (row) => (
        <span className="small text-nowrap">
          {row.unassignedAtFormatted ? (
            row.unassignedAtFormatted
          ) : (
            <span className="text-muted">— (Ongoing)</span>
          )}
        </span>
      ),
    },
    {
      label: 'Duration',
      key: 'duration',
      sortable: true,
      render: (row) => (
        <CTooltip
          content={
            row.status === 'active'
              ? `Ongoing since ${row.assignedAtFormatted || 'assignment'}`
              : `Total Duration: ${row.duration}`
          }
          placement="top"
        >
          <span
            className="badge bg-light text-primary border border-primary px-2 py-1 d-inline-flex align-items-center gap-1"
            style={{ cursor: 'pointer', fontSize: '12px' }}
          >
            <FaClock size={11} />
            {row.duration}
          </span>
        </CTooltip>
      ),
    },
    {
      label: 'Status',
      key: 'status',
      sortable: true,
      render: (row) => {
        const isOngoing = row.status === 'active'
        return (
          <CBadge
            color={isOngoing ? 'success' : 'secondary'}
            className="d-inline-flex align-items-center gap-1 px-2 py-1 text-capitalize"
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isOngoing ? '#2eb85c' : '#8a93a2',
              }}
            />
            {isOngoing ? 'Ongoing' : 'Completed'}
          </CBadge>
        )
      },
    },
    {
      label: 'Remarks',
      key: 'remarks',
      sortable: false,
      render: (row) => (
        <span className="text-secondary small">
          {row.remarks || '—'}
        </span>
      ),
    },
  ]

  // Columns for Driver Shift Logs
  const driverColumns = [
    {
      label: 'Driver Name',
      key: 'driverName',
      sortable: true,
      render: (row) => (
        <span className="fw-semibold text-dark">{row.driverName}</span>
      ),
    },
    {
      label: 'Contact Number',
      key: 'contactNumber',
      sortable: true,
      render: (row) => (
        <span className="text-secondary">
          {row.contactNumber && row.contactNumber !== 'N/A' ? row.contactNumber : '—'}
        </span>
      ),
    },
    {
      label: 'Assigned Vehicle',
      key: 'vehicleName',
      sortable: true,
      render: (row) => (
        <span className="fw-semibold text-dark">{row.vehicleName}</span>
      ),
    },
    {
      label: 'Assigned At',
      key: 'assignedAtFormatted',
      sortable: true,
      render: (row) => (
        <span className="small text-nowrap">
          {row.assignedAtFormatted || '—'}
        </span>
      ),
    },
    {
      label: 'Unassigned At',
      key: 'unassignedAtFormatted',
      sortable: true,
      render: (row) => (
        <span className="small text-nowrap">
          {row.unassignedAtFormatted ? (
            row.unassignedAtFormatted
          ) : (
            <span className="text-muted">— (Ongoing)</span>
          )}
        </span>
      ),
    },
    {
      label: 'Duration',
      key: 'duration',
      sortable: true,
      render: (row) => (
        <CTooltip
          content={
            row.status === 'active'
              ? `Ongoing since ${row.assignedAtFormatted || 'assignment'}`
              : `Total Duration: ${row.duration}`
          }
          placement="top"
        >
          <span
            className="badge bg-light text-primary border border-primary px-2 py-1 d-inline-flex align-items-center gap-1"
            style={{ cursor: 'pointer', fontSize: '12px' }}
          >
            <FaClock size={11} />
            {row.duration}
          </span>
        </CTooltip>
      ),
    },
    {
      label: 'Status',
      key: 'status',
      sortable: true,
      render: (row) => {
        const isOngoing = row.status === 'active'
        return (
          <CBadge
            color={isOngoing ? 'success' : 'secondary'}
            className="d-inline-flex align-items-center gap-1 px-2 py-1 text-capitalize"
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isOngoing ? '#2eb85c' : '#8a93a2',
              }}
            />
            {isOngoing ? 'Ongoing' : 'Completed'}
          </CBadge>
        )
      },
    },
    {
      label: 'Remarks',
      key: 'remarks',
      sortable: false,
      render: (row) => (
        <span className="text-secondary small">
          {row.remarks || '—'}
        </span>
      ),
    },
  ]

  // Logout
  const handleLogout = () => {
    sessionStorage.clear()
    localStorage.clear()
    document.cookie.split(';').forEach((c) => {
      const base = c.trim().split('=')[0]
      document.cookie = `${base}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    })
    window.location.href = import.meta.env.VITE_API_CREDENCE_URL || '/'
  }

  // Floating Dropdown Items
  const currentLogsList = activeTab === 'vehicle' ? vehicleLogsList : driverLogsList
  const dropdownItems = useMemo(
    () => [
      {
        icon: FaRegFilePdf,
        label: 'Download PDF',
        onClick: () =>
          exportToPDF({
            title: `${activeTab === 'vehicle' ? 'Vehicle' : 'Driver'} Shift Logs Report`,
            columns: [
              ...(activeTab === 'vehicle'
                ? [
                    { label: 'Vehicle', key: 'vehicleName' },
                    { label: 'Driver Name', key: 'driverName' },
                  ]
                : [
                    { label: 'Driver Name', key: 'driverName' },
                    { label: 'Vehicle', key: 'vehicleName' },
                  ]),
              { label: 'Contact', key: 'contactNumber' },
              { label: 'Assigned At', key: 'assignedAtFormatted' },
              { label: 'Unassigned At', key: 'unassignedAtFormatted' },
              { label: 'Duration', key: 'duration' },
              { label: 'Status', key: 'status' },
              { label: 'Remarks', key: 'remarks' },
            ],
            data: currentLogsList,
            fileName: `${activeTab === 'vehicle' ? 'Vehicle' : 'Driver'}_Shift_Logs_Report`,
          }),
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () =>
          exportToExcel({
            title: `${activeTab === 'vehicle' ? 'Vehicle' : 'Driver'} Shift Logs Report`,
            columns: [
              ...(activeTab === 'vehicle'
                ? [
                    { label: 'Vehicle', key: 'vehicleName' },
                    { label: 'Driver Name', key: 'driverName' },
                  ]
                : [
                    { label: 'Driver Name', key: 'driverName' },
                    { label: 'Vehicle', key: 'vehicleName' },
                  ]),
              { label: 'Contact', key: 'contactNumber' },
              { label: 'Assigned At', key: 'assignedAtFormatted' },
              { label: 'Unassigned At', key: 'unassignedAtFormatted' },
              { label: 'Duration', key: 'duration' },
              { label: 'Status', key: 'status' },
              { label: 'Remarks', key: 'remarks' },
            ],
            data: currentLogsList,
            fileName: `${activeTab === 'vehicle' ? 'Vehicle' : 'Driver'}_Shift_Logs_Report`,
          }),
      },
      {
        icon: FaPrint,
        label: 'Print Page',
        onClick: () => window.print(),
      },
      {
        icon: HiOutlineLogout,
        label: 'Logout',
        onClick: handleLogout,
      },
      {
        icon: FaArrowUp,
        label: 'Scroll To Top',
        onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      },
    ],
    [currentLogsList, activeTab, exportToPDF, exportToExcel],
  )

  return (
    <>
      {/* Shift Logs Navigation Tabs */}
      <CNav variant="tabs" className="mb-3 border-bottom">
        <CNavItem>
          <CNavLink
            active={activeTab === 'vehicle'}
            onClick={() => {
              setActiveTab('vehicle')
              setCurrentPage(1)
            }}
            style={{ cursor: 'pointer', fontWeight: 600 }}
            className="d-flex align-items-center gap-2"
          >
            <FaTruck size={15} />
            <span>Vehicle Shift Logs</span>
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === 'driver'}
            onClick={() => {
              setActiveTab('driver')
              setDriverCurrentPage(1)
            }}
            style={{ cursor: 'pointer', fontWeight: 600 }}
            className="d-flex align-items-center gap-2"
          >
            <FaUserTie size={15} />
            <span>Driver Shift Logs</span>
          </CNavLink>
        </CNavItem>
      </CNav>

      {/* Filter Parameters Card */}
      <CCard className="border-0 shadow-sm mb-3">
        <CCardBody className="p-3">
          <CRow className="g-2 align-items-end">
            {/* Supervisor Filter (for superadmin) */}
            {userRole === 'superadmin' && supervisorOptions.length > 0 && (
              <CCol md={2} sm={6}>
                <CFormLabel className="small mb-1 fw-semibold">Supervisor</CFormLabel>
                <SingleSelectDropdown
                  options={supervisorOptions}
                  value={selectedSupervisor}
                  onChange={(val) => {
                    setSelectedSupervisor(val)
                    setCurrentPage(1)
                    setDriverCurrentPage(1)
                  }}
                  isClearable
                  placeholder="Filter by Supervisor..."
                />
              </CCol>
            )}

            {/* Vehicle Filter (when on Vehicle Shift Logs tab) */}
            {activeTab === 'vehicle' && (
              <CCol md={userRole === 'superadmin' ? 2 : 3} sm={6}>
                <CFormLabel className="small mb-1 fw-semibold">Vehicle</CFormLabel>
                <SingleSelectDropdown
                  options={vehicleOptions}
                  value={selectedVehicle}
                  onChange={(val) => {
                    setSelectedVehicle(val)
                    setCurrentPage(1)
                  }}
                  isClearable
                  placeholder="Filter by Vehicle..."
                />
              </CCol>
            )}

            {/* Driver Filter (when on Driver Shift Logs tab) */}
            {activeTab === 'driver' && (
              <CCol md={userRole === 'superadmin' ? 2 : 3} sm={6}>
                <CFormLabel className="small mb-1 fw-semibold">Driver</CFormLabel>
                <SingleSelectDropdown
                  options={driverOptions}
                  value={selectedDriver}
                  onChange={(val) => {
                    setSelectedDriver(val)
                    setDriverCurrentPage(1)
                  }}
                  isClearable
                  placeholder="Filter by Driver..."
                />
              </CCol>
            )}

            {/* Status */}
            <CCol md={2} sm={6}>
              <CFormLabel className="small mb-1 fw-semibold">Status</CFormLabel>
              <CFormSelect
                size="sm"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  setCurrentPage(1)
                  setDriverCurrentPage(1)
                }}
              >
                <option value="all">All Statuses</option>
                <option value="active">Ongoing Only</option>
                <option value="completed">Completed Only</option>
              </CFormSelect>
            </CCol>

            {/* Month */}
            <CCol md={2} sm={6}>
              <CFormLabel className="small mb-1 fw-semibold">Month</CFormLabel>
              <CFormSelect
                size="sm"
                value={month}
                onChange={(e) => {
                  const val = e.target.value
                  setMonth(val)
                  if (val) {
                    setStartDate('')
                    setEndDate('')
                  }
                  setCurrentPage(1)
                  setDriverCurrentPage(1)
                }}
              >
                {availableMonthOptions.map((m) => (
                  <option key={m.value} value={m.value} disabled={m.disabled}>
                    {m.label} {m.disabled ? '(Future)' : ''}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {/* Year */}
            <CCol md={userRole === 'superadmin' ? 1 : 2} sm={6}>
              <CFormLabel className="small mb-1 fw-semibold">Year</CFormLabel>
              <CFormSelect
                size="sm"
                value={year}
                onChange={(e) => {
                  const val = e.target.value
                  setYear(val)
                  if (val) {
                    setStartDate('')
                    setEndDate('')
                  }
                  setCurrentPage(1)
                  setDriverCurrentPage(1)
                }}
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y.value} value={y.value}>
                    {y.label}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {/* Unified Calendar Button (Select Single Date or Range) */}
            <CCol md={userRole === 'superadmin' ? 2 : 2} sm={6}>
              <CFormLabel className="small mb-1 fw-semibold">Date / Date Range</CFormLabel>
              <div>
                <DateRangeFilterCredence
                  title="Select Date or Range"
                  onDateRangeChange={handleDateRangeChange}
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={new Date()}
                  dropdownAlign="right"
                  buttonClassName="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-between text-truncate bg-white"
                />
              </div>
            </CCol>

            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <CCol xs="auto" className="ms-auto">
                <CButton
                  color="secondary"
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="d-flex align-items-center gap-1"
                >
                  <FaUndo size={11} />
                  <span>Reset Filters</span>
                </CButton>
              </CCol>
            )}
          </CRow>
        </CCardBody>
      </CCard>

      {/* Total Count Badge on Top of Table */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="badge bg-light text-dark border px-3 py-2 fs-6 shadow-sm">
          Total Logs:{' '}
          <strong className="text-primary">
            {activeTab === 'vehicle' ? vehicleTotalCount : driverTotalCount}
          </strong>
        </span>
      </div>

      {/* Main Table */}
      <Table
        columns={activeTab === 'vehicle' ? vehicleColumns : driverColumns}
        filteredData={activeTab === 'vehicle' ? vehicleLogsList : driverLogsList}
        currentPage={activeTab === 'vehicle' ? currentPage : driverCurrentPage}
        itemsPerPage={activeTab === 'vehicle' ? itemsPerPage : driverItemsPerPage}
        isFetching={activeTab === 'vehicle' ? isFetchingVehicleLogs : isFetchingDriverLogs}
        viewButton={false}
        editButton={false}
        deleteButton={false}
        showPagination={false}
      />

      {/* Pagination */}
      <SmartPagination
        totalPages={activeTab === 'vehicle' ? vehicleTotalPages : driverTotalPages}
        currentPage={activeTab === 'vehicle' ? currentPage : driverCurrentPage}
        onPageChange={activeTab === 'vehicle' ? setCurrentPage : setDriverCurrentPage}
        itemsPerPage={activeTab === 'vehicle' ? itemsPerPage : driverItemsPerPage}
        onItemsPerPageChange={(value) => {
          if (activeTab === 'vehicle') {
            setItemsPerPage(value === -1 ? vehicleTotalCount : value)
            setCurrentPage(1)
          } else {
            setDriverItemsPerPage(value === -1 ? driverTotalCount : value)
            setDriverCurrentPage(1)
          }
        }}
      />

      {/* Filter Parameters Modal for Driver Details */}
      <FilterShiftHistoryModal
        visible={filterModalVisible}
        setVisible={setFilterModalVisible}
        selectedRow={selectedRowForHistory}
        onConfirm={handleConfirmHistoryFilters}
        mode="driver"
      />

      {/* Export / Quick Actions floating dropdown */}
      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default ShiftLogs
