import React, { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  CButton,
  CSpinner,
  CBadge,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CFormSelect,
  CFormInput,
  CFormLabel,
  CNav,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import {
  FaArrowLeft,
  FaUserTie,
  FaPhoneAlt,
  FaIdCard,
  FaTruck,
  FaCalendarAlt,
  FaClock,
  FaGasPump,
  FaPrint,
  FaHistory,
  FaUndo,
  FaArrowUp,
  FaRegFilePdf,
  FaRoute,
  FaRoad,
} from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import SearchInput from '../../components/SearchInput'
import IconDropdown from '../IconDropdown'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import useDebounce from '../../customhooks/useDebounce'
import { getDriverFullReportApi } from './data'

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

const MIN_PAST_YEAR = 2020
const MIN_DATE = '2020-01-01'
const currentYearNum = new Date().getFullYear()
const YEARS = Array.from(
  { length: Math.max(1, currentYearNum - MIN_PAST_YEAR + 1) },
  (_, i) => currentYearNum - i,
)

function DriverShiftLogs() {
  const navigate = useNavigate()
  const location = useLocation()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()

  // Parse query params
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const driverId = queryParams.get('driverId') || ''
  const initialDriverName = queryParams.get('driverName') || ''
  const initialStartDate = queryParams.get('startDate') || ''
  const initialEndDate = queryParams.get('endDate') || ''
  const hasInitialDateRange = Boolean(initialStartDate || initialEndDate)

  const initialMonth = queryParams.get('month')
    ? Number(queryParams.get('month'))
    : hasInitialDateRange
      ? ''
      : new Date().getMonth() + 1
  const initialYear = queryParams.get('year')
    ? Number(queryParams.get('year'))
    : hasInitialDateRange
      ? ''
      : new Date().getFullYear()

  const initialStatus = queryParams.get('status') || 'all'

  const [selectedMonth, setSelectedMonth] = useState(initialMonth)
  const [selectedYear, setSelectedYear] = useState(initialYear)
  const [startDate, setStartDate] = useState(initialStartDate)
  const [endDate, setEndDate] = useState(initialEndDate)
  const [selectedStatus, setSelectedStatus] = useState(initialStatus)
  const [searchQuery, setSearchQuery] = useState('')
  const [showProfileCard, setShowProfileCard] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState('shifts') // 'shifts' | 'regularTrips' | 'dailyTrips' | 'attendance' | 'leaves' | 'expenses'

  // Current real-time bounds to disallow future dates
  const todayDate = useMemo(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }, [])

  const currentYear = useMemo(() => new Date().getFullYear(), [])
  const currentMonth = useMemo(() => new Date().getMonth() + 1, [])

  // Month options with future months disabled for current/future year
  const availableMonthOptions = useMemo(() => {
    const isCurrentOrFutureYear = !selectedYear || Number(selectedYear) >= currentYear
    return MONTHS.map((m) => {
      const isFutureMonth = isCurrentOrFutureYear && m.value !== '' && Number(m.value) > currentMonth
      return {
        ...m,
        disabled: isFutureMonth,
      }
    })
  }, [selectedYear, currentYear, currentMonth])

  // Reset month if user changes year to current year and the selected month is in the future
  useEffect(() => {
    const isCurrentOrFutureYear = !selectedYear || Number(selectedYear) >= currentYear
    if (isCurrentOrFutureYear && selectedMonth && Number(selectedMonth) > currentMonth) {
      setSelectedMonth('')
    }
  }, [selectedYear, selectedMonth, currentYear, currentMonth])

  // Debounced Filter Inputs for smooth responsive typing
  const debouncedSearch = useDebounce(searchQuery, 400)
  const debouncedStartDate = useDebounce(startDate, 400)
  const debouncedEndDate = useDebounce(endDate, 400)

  const isDebouncing =
    searchQuery !== debouncedSearch ||
    startDate !== debouncedStartDate ||
    endDate !== debouncedEndDate

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedStatus('all')
    setSelectedMonth(currentMonth)
    setSelectedYear(currentYear)
    setStartDate('')
    setEndDate('')

    const newParams = new URLSearchParams()
    if (driverId) newParams.set('driverId', driverId)
    if (initialDriverName) newParams.set('driverName', initialDriverName)
    navigate({ search: newParams.toString() }, { replace: true })
  }

  // Fetch Driver Full Report (Endpoint 7)
  const {
    data: reportData,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['driverFullReport', driverId, selectedMonth, selectedYear, debouncedStartDate, debouncedEndDate],
    queryFn: () => {
      const hasDateRange = Boolean(debouncedStartDate || debouncedEndDate)
      return getDriverFullReportApi(driverId, {
        month: !hasDateRange && selectedMonth ? selectedMonth : undefined,
        year: !hasDateRange && selectedYear ? selectedYear : undefined,
        startDate: hasDateRange ? debouncedStartDate || undefined : undefined,
        endDate: hasDateRange ? debouncedEndDate || undefined : undefined,
      })
    },
    enabled: Boolean(driverId),
    staleTime: 1000 * 60 * 2,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const driverDetails = reportData?.driverDetails || {}
  const monthlySummary = reportData?.monthlySummary || {}
  const shiftsHistory = Array.isArray(reportData?.vehiclesShiftingHistory)
    ? reportData.vehiclesShiftingHistory
    : []

  const filteredShiftsHistory = useMemo(() => {
    let list = shiftsHistory
    if (selectedStatus && selectedStatus !== 'all') {
      list = list.filter(
        (s) => (s.status || '').toLowerCase() === selectedStatus.toLowerCase(),
      )
    }
    if (debouncedSearch && debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim()
      list = list.filter((s) => {
        const vehicleName = (s.vehicleName || '').toLowerCase()
        const remarks = (s.remarks || '').toLowerCase()
        const startLoc = (s.startLocationName || '').toLowerCase()
        const endLoc = (s.endLocationName || '').toLowerCase()
        const statusStr = (s.status || '').toLowerCase()
        return (
          vehicleName.includes(q) ||
          remarks.includes(q) ||
          startLoc.includes(q) ||
          endLoc.includes(q) ||
          statusStr.includes(q)
        )
      })
    }
    return list
  }, [shiftsHistory, selectedStatus, debouncedSearch])

  const attendanceRecords = Array.isArray(reportData?.attendanceRecords)
    ? reportData.attendanceRecords
    : []
  const leaveRecords = Array.isArray(reportData?.leaveRecords)
    ? reportData.leaveRecords
    : []
  const expenseRecords = Array.isArray(reportData?.expenseRecords)
    ? reportData.expenseRecords
    : []
  const allDailyTrips = Array.isArray(reportData?.allDailyTrips)
    ? reportData.allDailyTrips
    : []
  const allRegularTrips = Array.isArray(reportData?.allRegularTrips)
    ? reportData.allRegularTrips
    : []

  const driverDisplayName = driverDetails.name || initialDriverName || 'Driver'

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      const str = String(dateStr).trim()
      // Extract YYYY-MM-DD directly from response string to preserve exact date
      const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/)
      if (isoMatch) {
        const year = isoMatch[1]
        const monthNum = parseInt(isoMatch[2], 10) - 1
        const day = parseInt(isoMatch[3], 10)
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ]
        return `${String(day).padStart(2, '0')} ${months[monthNum] || isoMatch[2]} ${year}`
      }

      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    } catch {
      return dateStr
    }
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

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

  const periodLabel = useMemo(() => {
    if (startDate || endDate) {
      return `(${startDate || 'Start'} to ${endDate || 'Today'})`
    }
    const mLabel = MONTHS.find((m) => m.value === selectedMonth)?.label
    if (mLabel && selectedYear) return `(${mLabel} ${selectedYear})`
    if (selectedYear) return `(${selectedYear})`
    return ''
  }, [startDate, endDate, selectedMonth, selectedYear])

  // Floating Dropdown Items
  const dropdownItems = useMemo(
    () => [
      {
        icon: FaRegFilePdf,
        label: 'Download PDF',
        onClick: () =>
          exportToPDF({
            title: `Driver Report - ${driverDisplayName} ${periodLabel}`,
            columns: [
              { label: 'Vehicle', key: 'vehicleName' },
              { label: 'Assigned At', key: 'assignedAt' },
              { label: 'Unassigned At', key: 'unassignedAt' },
              { label: 'Duration', key: 'duration' },
              { label: 'Status', key: 'status' },
            ],
            data: filteredShiftsHistory.map((s) => ({
              vehicleName: s.vehicleName || '—',
              assignedAt: formatDateTime(s.assignedAt),
              unassignedAt: formatDateTime(s.unassignedAt),
              duration: s.duration || '—',
              status: s.status || '—',
            })),
            fileName: `Driver_Report_${driverDisplayName}_${selectedMonth || 'custom'}_${selectedYear || 'period'}`,
          }),
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () =>
          exportToExcel({
            title: `Driver Report - ${driverDisplayName} ${periodLabel}`,
            columns: [
              { label: 'Vehicle', key: 'vehicleName' },
              { label: 'Assigned At', key: 'assignedAt' },
              { label: 'Unassigned At', key: 'unassignedAt' },
              { label: 'Duration', key: 'duration' },
              { label: 'Status', key: 'status' },
            ],
            data: filteredShiftsHistory.map((s) => ({
              vehicleName: s.vehicleName || '—',
              assignedAt: formatDateTime(s.assignedAt),
              unassignedAt: formatDateTime(s.unassignedAt),
              duration: s.duration || '—',
              status: s.status || '—',
            })),
            fileName: `Driver_Report_${driverDisplayName}_${selectedMonth || 'custom'}_${selectedYear || 'period'}`,
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
    [filteredShiftsHistory, driverDisplayName, selectedMonth, selectedYear, periodLabel, exportToPDF, exportToExcel],
  )

  return (
    <>
      {/* Top Navigation & Title Bar */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <CButton
            color="secondary"
            variant="outline"
            size="sm"
            onClick={() => navigate('/ShiftLogs')}
            className="d-flex align-items-center gap-1 shadow-sm"
          >
            <FaArrowLeft size={13} />
            <span>Back to Ongoing Shifts</span>
          </CButton>
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded p-2 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px' }}
            >
              <FaHistory size={18} />
            </div>
            <div>
              <h5 className="mb-0 fw-bold text-dark">
                Driver Shift History Logs
                {driverDisplayName ? ` : ${driverDisplayName}` : ''}
              </h5>
            </div>
          </div>
        </div>

        {/* Top Right: Driver Profile Icon with Hover Card */}
        <div
          className="position-relative"
          onMouseEnter={() => setShowProfileCard(true)}
          onMouseLeave={() => setShowProfileCard(false)}
        >
          <div
            className="d-flex align-items-center gap-2 px-3 py-1 bg-white border rounded-pill shadow-sm"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
          >
            <div
              className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
              style={{ width: '30px', height: '30px' }}
            >
              <FaUserTie size={15} />
            </div>
            <div className="text-start pe-1">
              <div className="fw-bold small text-dark lh-1">
                {driverDetails.name || driverDisplayName}
              </div>
              <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                Driver Profile
              </div>
            </div>
          </div>

          {/* Hover Card */}
          {showProfileCard && (
            <div
              className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border p-3"
              style={{
                width: '320px',
                zIndex: 1050,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="d-flex align-items-center gap-2 pb-2 mb-2 border-bottom">
                <div
                  className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '38px', height: '38px' }}
                >
                  <FaUserTie size={18} />
                </div>
                <div className="overflow-hidden">
                  <div className="fw-bold text-dark text-truncate">
                    {driverDetails.name || driverDisplayName}
                  </div>
                  <div className="small text-muted">Driver Details</div>
                </div>
              </div>

              <div className="d-flex flex-column gap-2 small">
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted d-flex align-items-center gap-1">
                    <FaPhoneAlt className="text-success" size={11} /> Contact Number:
                  </span>
                  <span className="fw-semibold text-dark">
                    {driverDetails.contactNumber || '—'}
                  </span>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted d-flex align-items-center gap-1">
                    <FaIdCard className="text-info" size={12} /> License Number:
                  </span>
                  <span className="fw-semibold text-dark">
                    {driverDetails.licenseNumber || '—'}
                  </span>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted d-flex align-items-center gap-1">
                    <FaTruck className="text-primary" size={12} /> Current Vehicle:
                  </span>
                  <span className="fw-bold text-primary">
                    {driverDetails.currentVehicleName || 'None assigned'}
                  </span>
                </div>

                {driverDetails.email && (
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted">Email:</span>
                    <span className="fw-semibold text-dark text-truncate" style={{ maxWidth: '170px' }}>
                      {driverDetails.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Parameters Card */}
      <CCard className="border-0 shadow-sm mb-4">
        <CCardBody className="p-3">
          <CRow className="g-2 align-items-end">
            {/* Search (Temporarily commented out) */}
            {/* <CCol md={3} sm={6}>
              <CFormLabel className="small mb-1 fw-semibold">Search</CFormLabel>
              <SearchInput
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                debounceDelay={0}
                placeholder="Search vehicle or driver..."
              />
            </CCol> */}

            {/* Status */}
            <CCol md={2} sm={6}>
              <CFormLabel className="small mb-1 fw-semibold">Status</CFormLabel>
              <CFormSelect
                size="sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
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
                value={selectedMonth}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : ''
                  setSelectedMonth(val)
                  if (val) {
                    setStartDate('')
                    setEndDate('')
                    if (!selectedYear) {
                      setSelectedYear(currentYear)
                    }
                  }
                }}
              >
                <option value="">All Months</option>
                {availableMonthOptions.map((m) => (
                  <option key={m.value} value={m.value} disabled={m.disabled}>
                    {m.label} {m.disabled ? '(Future)' : ''}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {/* Year */}
            <CCol md={2} sm={6}>
              <CFormLabel className="small mb-1 fw-semibold">Year</CFormLabel>
              <CFormSelect
                size="sm"
                value={selectedYear}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : ''
                  setSelectedYear(val)
                  if (val) {
                    setStartDate('')
                    setEndDate('')
                  }
                }}
              >
                <option value="">All</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {/* Start Date */}
            <CCol md={3} sm={6}>
              <CFormLabel className="small mb-1 fw-semibold">From Date</CFormLabel>
              <CFormInput
                size="sm"
                type="date"
                value={startDate}
                min={MIN_DATE}
                max={endDate && endDate < todayDate ? endDate : todayDate}
                onChange={(e) => {
                  const val = e.target.value
                  if (val) {
                    setSelectedMonth('')
                    setSelectedYear('')
                  }
                  if (!val) {
                    setStartDate('')
                    return
                  }
                  let finalStart = val
                  if (val < MIN_DATE) {
                    finalStart = MIN_DATE
                  } else if (val > todayDate) {
                    finalStart = todayDate
                  }
                  setStartDate(finalStart)

                  // Automatically ensure To Date is not less than From Date
                  if (endDate && finalStart > endDate) {
                    setEndDate(finalStart)
                  }
                }}
              />
            </CCol>

            {/* End Date */}
            <CCol md={3} sm={6}>
              <CFormLabel className="small mb-1 fw-semibold">To Date</CFormLabel>
              <CFormInput
                size="sm"
                type="date"
                value={endDate}
                min={startDate || MIN_DATE}
                max={todayDate}
                onChange={(e) => {
                  const val = e.target.value
                  if (val) {
                    setSelectedMonth('')
                    setSelectedYear('')
                  }
                  if (!val) {
                    setEndDate('')
                    return
                  }
                  const effectiveMin = startDate || MIN_DATE
                  let finalEnd = val
                  if (val < effectiveMin) {
                    finalEnd = effectiveMin
                  } else if (val > todayDate) {
                    finalEnd = todayDate
                  }
                  setEndDate(finalEnd)
                }}
              />
            </CCol>
          </CRow>

          {/* Active Filter Badges & Reset Button */}
          {(driverDisplayName || (selectedStatus && selectedStatus !== 'all') || startDate || endDate || selectedMonth || selectedYear || searchQuery) && (
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3 pt-2 border-top">
              <div className="d-flex align-items-center flex-wrap gap-1">
                <span className="small text-muted me-1">Active Filters:</span>
                {isDebouncing && (
                  <span className="badge bg-warning bg-opacity-25 text-dark border border-warning px-2 py-1 d-inline-flex align-items-center gap-1 small me-1">
                    <span
                      className="spinner-border spinner-border-sm text-warning"
                      role="status"
                      style={{ width: '10px', height: '10px' }}
                    />
                    Updating...
                  </span>
                )}
                {driverDisplayName && (
                  <CBadge color="primary" className="d-flex align-items-center gap-1">
                    Driver: {driverDisplayName}
                  </CBadge>
                )}
                {selectedStatus && selectedStatus !== 'all' && (
                  <CBadge color="info" className="d-flex align-items-center gap-1">
                    Status: {selectedStatus}
                    <span style={{ cursor: 'pointer' }} onClick={() => setSelectedStatus('all')}>
                      ×
                    </span>
                  </CBadge>
                )}
                {selectedMonth && (
                  <CBadge color="secondary" className="d-flex align-items-center gap-1">
                    Month: {MONTHS.find((m) => m.value === selectedMonth)?.label || selectedMonth}
                    <span style={{ cursor: 'pointer' }} onClick={() => setSelectedMonth('')}>
                      ×
                    </span>
                  </CBadge>
                )}
                {selectedYear && (
                  <CBadge color="secondary" className="d-flex align-items-center gap-1">
                    Year: {selectedYear}
                    <span style={{ cursor: 'pointer' }} onClick={() => setSelectedYear('')}>
                      ×
                    </span>
                  </CBadge>
                )}
                {(startDate || endDate) && (
                  <CBadge color="dark" className="d-flex align-items-center gap-1">
                    Date: {startDate || 'Start'} to {endDate || 'End'}
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setStartDate('')
                        setEndDate('')
                      }}
                    >
                      ×
                    </span>
                  </CBadge>
                )}
              </div>
              <CButton
                color="secondary"
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="d-flex align-items-center gap-1"
              >
                <FaUndo size={11} className="me-1" />
                <span className="small">Reset All Filters</span>
              </CButton>
            </div>
          )}
        </CCardBody>
      </CCard>

      {isFetching ? (
        <div className="text-center py-5 bg-white rounded shadow-sm border p-4 my-3">
          <CSpinner color="primary" />
          <div className="mt-2 text-muted small">Loading driver report...</div>
        </div>
      ) : isError ? (
        <div className="alert alert-danger d-flex align-items-center justify-content-between shadow-sm my-3">
          <div>{error?.message || 'Failed to load driver report'}</div>
          <CButton color="danger" size="sm" variant="outline" onClick={() => refetch()}>
            Retry
          </CButton>
        </div>
      ) : (
        <>
          {/* Monthly KPI Summary Cards */}
          <CRow className="g-3 mb-4">
            {/* Shifts & Vehicles */}
            <CCol md={3} sm={6}>
              <div
                className={`p-3 rounded border bg-white shadow-sm h-100 ${
                  activeSubTab === 'shifts' ? 'border-primary' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveSubTab('shifts')}
                title="Click to view shifting history"
              >
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="small text-muted fw-semibold">Total Shifts</span>
                  <span className="badge bg-primary bg-opacity-10 text-primary">
                    {monthlySummary.totalVehiclesCount ?? 0} Vehicles
                  </span>
                </div>
                <h4 className="fw-bold text-primary mb-1">
                  {monthlySummary.totalShifts ?? 0}
                </h4>
                <div
                  className="small text-muted text-truncate"
                  title={(monthlySummary.distinctVehiclesDriven || []).join(', ')}
                >
                  {monthlySummary.distinctVehiclesDriven?.length
                    ? monthlySummary.distinctVehiclesDriven.join(', ')
                    : 'No vehicles driven'}
                </div>
              </div>
            </CCol>

            {/* Attendance */}
            <CCol md={3} sm={6}>
              <div
                className={`p-3 rounded border bg-white shadow-sm h-100 ${
                  activeSubTab === 'attendance' ? 'border-success' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveSubTab('attendance')}
                title="Click to view attendance records"
              >
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="small text-muted fw-semibold">Attendance</span>
                  <span className="badge bg-success bg-opacity-10 text-success">
                    {monthlySummary.attendance?.totalMarked ?? 0} Days
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge bg-success px-2 py-1">
                    P: {monthlySummary.attendance?.Present ?? 0}
                  </span>
                  <span className="badge bg-danger px-2 py-1">
                    A: {monthlySummary.attendance?.Absent ?? 0}
                  </span>
                  <span className="badge bg-warning text-dark px-2 py-1">
                    L: {monthlySummary.attendance?.['On Leave'] ?? 0}
                  </span>
                </div>
                <div className="small text-muted">Present, Absent & Leaves</div>
              </div>
            </CCol>

            {/* Trips Summary */}
            <CCol md={3} sm={6}>
              <div
                className={`p-3 rounded border bg-white shadow-sm h-100 ${
                  activeSubTab === 'regularTrips' || activeSubTab === 'dailyTrips'
                    ? 'border-info'
                    : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveSubTab('regularTrips')}
                title="Click to view trips"
              >
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="small text-muted fw-semibold">Total Trips</span>
                  <span className="badge bg-info bg-opacity-10 text-info">
                    {monthlySummary.trips?.totalTrips ?? 0} Total
                  </span>
                </div>
                <h4 className="fw-bold text-dark mb-1">
                  {monthlySummary.trips?.totalDistanceKm ?? 0}{' '}
                  <span className="fs-6 fw-normal text-muted">KM</span>
                </h4>
                <div className="small text-muted">
                  Daily: {monthlySummary.trips?.totalDailyTrips ?? 0} • Regular:{' '}
                  {monthlySummary.trips?.totalRegularTrips ?? 0}
                </div>
              </div>
            </CCol>

            {/* Expenses */}
            <CCol md={3} sm={6}>
              <div
                className={`p-3 rounded border bg-white shadow-sm h-100 ${
                  activeSubTab === 'expenses' ? 'border-warning' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveSubTab('expenses')}
                title="Click to view expenses"
              >
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="small text-muted fw-semibold">Expenses</span>
                  <span className="badge bg-warning bg-opacity-25 text-dark">
                    {monthlySummary.expenses?.totalCount ?? 0} Receipts
                  </span>
                </div>
                <h4 className="fw-bold text-success mb-1">
                  ₹{(monthlySummary.expenses?.totalAmount ?? 0).toLocaleString()}
                </h4>
                <div className="small text-muted">
                  Total approved reimbursement amount
                </div>
              </div>
            </CCol>
          </CRow>

          {/* Sub-Tabs for Detailed Records */}
          <CNav variant="tabs" className="mb-3">
            <CNavItem>
              <CNavLink
                active={activeSubTab === 'shifts'}
                onClick={() => setActiveSubTab('shifts')}
                style={{ cursor: 'pointer', fontWeight: 600 }}
                className="d-flex align-items-center gap-1"
              >
                <FaHistory size={13} />
                <span>Vehicles Shifting ({filteredShiftsHistory.length})</span>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeSubTab === 'regularTrips'}
                onClick={() => setActiveSubTab('regularTrips')}
                style={{ cursor: 'pointer', fontWeight: 600 }}
                className="d-flex align-items-center gap-1"
              >
                <FaRoute size={13} />
                <span>Regular Trips ({allRegularTrips.length})</span>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeSubTab === 'dailyTrips'}
                onClick={() => setActiveSubTab('dailyTrips')}
                style={{ cursor: 'pointer', fontWeight: 600 }}
                className="d-flex align-items-center gap-1"
              >
                <FaRoad size={13} />
                <span>Daily Trips ({allDailyTrips.length})</span>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeSubTab === 'attendance'}
                onClick={() => setActiveSubTab('attendance')}
                style={{ cursor: 'pointer', fontWeight: 600 }}
                className="d-flex align-items-center gap-1"
              >
                <FaCalendarAlt size={13} />
                <span>Attendance Records ({attendanceRecords.length})</span>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeSubTab === 'leaves'}
                onClick={() => setActiveSubTab('leaves')}
                style={{ cursor: 'pointer', fontWeight: 600 }}
                className="d-flex align-items-center gap-1"
              >
                <FaClock size={13} />
                <span>Leave Records ({leaveRecords.length})</span>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeSubTab === 'expenses'}
                onClick={() => setActiveSubTab('expenses')}
                style={{ cursor: 'pointer', fontWeight: 600 }}
                className="d-flex align-items-center gap-1"
              >
                <FaGasPump size={13} />
                <span>Expense Records ({expenseRecords.length})</span>
              </CNavLink>
            </CNavItem>
          </CNav>

          {/* TAB 1: VEHICLES SHIFTING HISTORY */}
          {activeSubTab === 'shifts' && (
            <div className="table-responsive bg-white rounded border shadow-sm">
              <table className="table table-hover table-bordered mb-0 align-middle">
                <thead className="table-light small text-center text-secondary">
                  <tr>
                    <th>#</th>
                    <th>Vehicle</th>
                    <th>Assigned At</th>
                    <th>Unassigned At</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Trips (KM)</th>
                  </tr>
                </thead>
                <tbody className="small text-center">
                  {filteredShiftsHistory.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 text-muted">
                        No vehicle shift logs found for this period.
                      </td>
                    </tr>
                  ) : (
                    filteredShiftsHistory.map((shift, idx) => (
                      <tr key={shift.shiftId || idx}>
                        <td>{idx + 1}</td>
                        <td className="fw-semibold text-primary">
                          {shift.vehicleName || '—'}
                        </td>
                        <td>{formatDateTime(shift.assignedAt)}</td>
                        <td>{formatDateTime(shift.unassignedAt)}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {shift.duration || '—'}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              (shift.status || '').toLowerCase() === 'active'
                                ? 'bg-success'
                                : 'bg-secondary'
                            } text-capitalize`}
                          >
                            {(shift.status || '').toLowerCase() === 'active'
                              ? 'Ongoing'
                              : shift.status || 'Completed'}
                          </span>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">
                            {shift.tripsSummary?.totalTripsCount ?? 0} Trips
                          </div>
                          <div className="small text-muted">
                            {shift.tripsSummary?.totalDistanceKm ?? 0} KM
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: REGULAR TRIPS */}
          {activeSubTab === 'regularTrips' && (
            <div className="table-responsive bg-white rounded border shadow-sm">
              <table className="table table-hover table-bordered mb-0 align-middle">
                <thead className="table-light small text-center text-secondary">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Vehicle</th>
                    <th>Route (From → To)</th>
                    <th>Allocated Budget</th>
                    <th>Spent Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="small text-center">
                  {allRegularTrips.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 text-muted">
                        No regular trips found for this period.
                      </td>
                    </tr>
                  ) : (
                    allRegularTrips.map((trip, idx) => (
                      <tr key={trip._id || idx}>
                        <td>{idx + 1}</td>
                        <td>{formatDate(trip.date || trip.createdAt)}</td>
                        <td className="fw-semibold text-primary">
                          {trip.vehicleName || trip.vehicleId || '—'}
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">
                            {trip.startLocation || '—'}{' '}
                            <span className="text-muted">→</span>{' '}
                            {trip.endLocation || '—'}
                          </div>
                        </td>
                        <td className="text-success fw-semibold">
                          ₹{Number(trip.budgetAllocated ?? 0).toLocaleString()}
                        </td>
                        <td className="text-secondary">
                          ₹{Number(trip.spentAmount ?? 0).toLocaleString()}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              (trip.status || '').toLowerCase() === 'completed'
                                ? 'bg-success'
                                : (trip.status || '').toLowerCase() === 'in-progress' ||
                                  (trip.status || '').toLowerCase() === 'active'
                                ? 'bg-primary'
                                : 'bg-secondary'
                            } text-capitalize px-2 py-1`}
                          >
                            {trip.status || '—'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: DAILY TRIPS */}
          {activeSubTab === 'dailyTrips' && (
            <div className="table-responsive bg-white rounded border shadow-sm">
              <table className="table table-hover table-bordered mb-0 align-middle">
                <thead className="table-light small text-center text-secondary">
                  <tr>
                    <th>#</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Odometer (Start → End)</th>
                    <th>Total Distance</th>
                    <th>GPS Distance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="small text-center">
                  {allDailyTrips.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 text-muted">
                        No daily trips found for this period.
                      </td>
                    </tr>
                  ) : (
                    allDailyTrips.map((trip, idx) => (
                      <tr key={trip._id || idx}>
                        <td>{idx + 1}</td>
                        <td>{formatDateTime(trip.startTime)}</td>
                        <td>{formatDateTime(trip.endTime)}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {trip.odometerStart?.toLocaleString() ?? '—'}{' '}
                            <span className="text-muted">→</span>{' '}
                            {trip.odometerEnd?.toLocaleString() ?? '—'}
                          </span>
                        </td>
                        <td className="fw-bold text-dark">
                          {Number(trip.totalDistance ?? 0).toLocaleString()} KM
                        </td>
                        <td className="text-muted">
                          {Number(trip.gpsKM ?? 0).toLocaleString()} KM
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              (trip.status || '').toLowerCase() === 'completed'
                                ? 'bg-success'
                                : (trip.status || '').toLowerCase() === 'active' ||
                                  (trip.status || '').toLowerCase() === 'in-progress'
                                ? 'bg-primary'
                                : 'bg-secondary'
                            } text-capitalize px-2 py-1`}
                          >
                            {trip.status || '—'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: ATTENDANCE RECORDS */}
          {activeSubTab === 'attendance' && (
            <div className="table-responsive bg-white rounded border shadow-sm">
              <table className="table table-hover table-bordered mb-0 align-middle">
                <thead className="table-light small text-center text-secondary">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Status</th>
                    {/* <th>Checkout Time</th> */}
                  </tr>
                </thead>
                <tbody className="small text-center">
                  {attendanceRecords.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-muted">
                        No attendance records found for this period.
                      </td>
                    </tr>
                  ) : (
                    attendanceRecords.map((att, idx) => {
                      const isPresent = att.status === 'Present'
                      const isAbsent = att.status === 'Absent'
                      return (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{formatDate(att.date || att.attendanceDate || att.createdAt)}</td>
                          <td>
                            <span
                              className={`badge ${
                                isPresent
                                  ? 'bg-success'
                                  : isAbsent
                                    ? 'bg-danger'
                                    : 'bg-warning text-dark'
                              } px-2 py-1`}
                            >
                              {att.status || '—'}
                            </span>
                          </td>
                          {/* <td>{att.checkoutTime || '—'}</td> */}
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: LEAVE RECORDS */}
          {activeSubTab === 'leaves' && (
            <div className="table-responsive bg-white rounded border shadow-sm">
              <table className="table table-hover table-bordered mb-0 align-middle">
                <thead className="table-light small text-center text-secondary">
                  <tr>
                    <th>#</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="small text-center">
                  {leaveRecords.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-muted">
                        No leave records found for this period.
                      </td>
                    </tr>
                  ) : (
                    leaveRecords.map((lv, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{formatDate(lv.startDate)}</td>
                        <td>{formatDate(lv.endDate)}</td>
                        <td className="text-start">{lv.description || '—'}</td>
                        <td>
                          <span
                            className={`badge ${
                              lv.status === 'Approved'
                                ? 'bg-success'
                                : lv.status === 'Rejected'
                                  ? 'bg-danger'
                                  : 'bg-warning text-dark'
                            }`}
                          >
                            {lv.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: EXPENSES RECORDS */}
          {activeSubTab === 'expenses' && (
            <div className="table-responsive bg-white rounded border shadow-sm">
              <table className="table table-hover table-bordered mb-0 align-middle">
                <thead className="table-light small text-center text-secondary">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Vehicle</th>
                    <th>Shop / Vendor</th>
                    <th>Location</th>
                    <th>Description</th>
                    <th>Mode</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody className="small text-center">
                  {expenseRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-4 text-muted">
                        No expense records found for this period.
                      </td>
                    </tr>
                  ) : (
                    expenseRecords.map((exp, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{formatDate(exp.date)}</td>
                        <td className="fw-semibold text-primary">
                          {exp.vehicleName || '—'}
                        </td>
                        <td>{exp.shopName || '—'}</td>
                        <td>{exp.location || '—'}</td>
                        <td className="text-start">{exp.description || '—'}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {exp.paymentMode || 'Cash'}
                          </span>
                        </td>
                        <td className="fw-bold text-success">
                          ₹{(exp.amount ?? 0).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Floating Action Menu for Export */}
      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default DriverShiftLogs
