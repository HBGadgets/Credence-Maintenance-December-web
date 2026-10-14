import React, { useState, useEffect, useMemo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CButton,
  CBadge,
  CFormSelect,
  CFormInput,
  CFormLabel,
  CTooltip,
} from '@coreui/react'
import {
  FaArrowLeft,
  FaRegFilePdf,
  FaPrint,
  FaArrowUp,
  FaClock,
  FaHistory,
  FaUndo,
} from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'

import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import SearchInput from '../../components/SearchInput'
import IconDropdown from '../IconDropdown'
import { TokenContext } from '../../../context/TokenContext'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import useDebounce from '../../customhooks/useDebounce'
import { getVehicleShiftLogsApi } from './data'

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

// Minimum limit for past historical records (cannot select before 2020)
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

function VehicleShiftLogs() {
  const navigate = useNavigate()
  const location = useLocation()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()

  // Parse initial query params from URL
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])

  const initialVehicleId = queryParams.get('vehicleId') || ''
  const initialVehicleName = queryParams.get('vehicleName') || ''
  const initialDriverId = queryParams.get('driverId') || ''
  const initialStatus = queryParams.get('status') || 'all'
  const initialStartDate = queryParams.get('startDate') || ''
  const initialEndDate = queryParams.get('endDate') || ''
  const initialMonth = queryParams.get('month') || ''
  const initialYear = queryParams.get('year') || ''

  // Filter States (Immediate for smooth UI input response)
  const [vehicleId, setVehicleId] = useState(initialVehicleId)
  const [vehicleName, setVehicleName] = useState(initialVehicleName)
  const [driverId, setDriverId] = useState(initialDriverId)
  const [status, setStatus] = useState(initialStatus)
  const [startDate, setStartDate] = useState(initialStartDate)
  const [endDate, setEndDate] = useState(initialEndDate)
  const [month, setMonth] = useState(initialMonth)
  const [year, setYear] = useState(initialYear)
  const [searchQuery, setSearchQuery] = useState('')

  // Max date calculations to prevent selecting future dates
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

  // Debounced Filter Values for API triggering (prevents excess API calls while typing)
  const debouncedSearch = useDebounce(searchQuery, 400)
  const debouncedYear = useDebounce(year, 500)
  const debouncedStartDate = useDebounce(startDate, 400)
  const debouncedEndDate = useDebounce(endDate, 400)

  // Status indicating whether user is actively typing / debounce timer is running
  const isDebouncing =
    searchQuery !== debouncedSearch ||
    year !== debouncedYear ||
    startDate !== debouncedStartDate ||
    endDate !== debouncedEndDate

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Reset to first page automatically whenever any debounced or selected filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [
    debouncedSearch,
    debouncedYear,
    debouncedStartDate,
    debouncedEndDate,
    status,
    month,
    vehicleId,
    driverId,
  ])

  // API Query using Debounced Filter Parameters
  const {
    data: shiftLogsResponse,
    isFetching,
  } = useQuery({
    queryKey: [
      'vehicleShiftLogsAll',
      currentPage,
      itemsPerPage,
      vehicleId,
      driverId,
      status,
      debouncedSearch,
      month,
      debouncedYear,
      debouncedStartDate,
      debouncedEndDate,
    ],
    queryFn: () => {
      const hasDateRange = Boolean(debouncedStartDate || debouncedEndDate)
      return getVehicleShiftLogsApi({
        page: currentPage,
        limit: itemsPerPage,
        vehicleId: vehicleId || undefined,
        driverId: driverId || undefined,
        status: status || undefined,
        search: debouncedSearch || undefined,
        month: !hasDateRange && month ? Number(month) : undefined,
        year: !hasDateRange && debouncedYear ? Number(debouncedYear) : undefined,
        startDate: hasDateRange ? debouncedStartDate || undefined : undefined,
        endDate: hasDateRange ? debouncedEndDate || undefined : undefined,
      })
    },
    staleTime: 1000 * 60 * 2,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const logsList = Array.isArray(shiftLogsResponse?.data) ? shiftLogsResponse.data : []
  const totalCount =
    shiftLogsResponse?.total ??
    shiftLogsResponse?.totalRecords ??
    shiftLogsResponse?.count ??
    logsList.length
  const activeCount = shiftLogsResponse?.activeCount ?? 0
  const completedCount = shiftLogsResponse?.completedCount ?? 0
  const totalPages =
    shiftLogsResponse?.totalPages ?? Math.max(1, Math.ceil(totalCount / itemsPerPage))

  // Reset Filters
  const handleResetFilters = () => {
    setVehicleId('')
    setVehicleName('')
    setDriverId('')
    setStatus('all')
    setStartDate('')
    setEndDate('')
    setMonth('')
    setYear('')
    setSearchQuery('')
    setCurrentPage(1)
  }

  // Columns
  const columns = [
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
        <span className="small text-nowrap text-secondary">
          {row.unassignedAtFormatted && row.unassignedAtFormatted !== 'N/A'
            ? row.unassignedAtFormatted
            : '— (Ongoing)'}
        </span>
      ),
    },
    {
      label: 'Duration',
      key: 'duration',
      sortable: true,
      render: (row) => (
        <CTooltip content={`Duration: ${row.duration || 'N/A'}`} placement="top">
          <span
            className="badge bg-light text-primary border border-primary px-2 py-1 d-inline-flex align-items-center gap-1"
            style={{ fontSize: '12px' }}
          >
            <FaClock size={11} />
            {row.duration || '0m'}
          </span>
        </CTooltip>
      ),
    },
    {
      label: 'Status',
      key: 'status',
      sortable: true,
      render: (row) => {
        const isActive = (row.status || '').toLowerCase() === 'active'
        return (
          <span
            className={`badge ${isActive ? 'bg-success' : 'bg-secondary'
              } px-2 py-1 d-inline-flex align-items-center gap-1 text-capitalize`}
          >
            <span
              className="rounded-circle bg-white"
              style={{ width: '6px', height: '6px', display: 'inline-block' }}
            />
            {isActive ? 'Ongoing' : (row.status || 'completed')}
          </span>
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
  const dropdownItems = useMemo(
    () => [
      {
        icon: FaRegFilePdf,
        label: 'Download PDF',
        onClick: () =>
          exportToPDF({
            title: `Vehicle Shift Logs Report${vehicleName ? ` - ${vehicleName}` : ''}`,
            columns: [
              { label: 'Vehicle', key: 'vehicleName' },
              { label: 'Driver Name', key: 'driverName' },
              { label: 'Contact', key: 'contactNumber' },
              { label: 'Assigned At', key: 'assignedAtFormatted' },
              { label: 'Unassigned At', key: 'unassignedAtFormatted' },
              { label: 'Duration', key: 'duration' },
              { label: 'Status', key: 'status' },
              { label: 'Remarks', key: 'remarks' },
            ],
            data: logsList,
            fileName: `Vehicle_Shift_Logs_Report${vehicleName ? `_${vehicleName}` : ''}`,
          }),
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () =>
          exportToExcel({
            title: `Vehicle Shift Logs Report${vehicleName ? ` - ${vehicleName}` : ''}`,
            columns: [
              { label: 'Vehicle', key: 'vehicleName' },
              { label: 'Driver Name', key: 'driverName' },
              { label: 'Contact', key: 'contactNumber' },
              { label: 'Assigned At', key: 'assignedAtFormatted' },
              { label: 'Unassigned At', key: 'unassignedAtFormatted' },
              { label: 'Duration', key: 'duration' },
              { label: 'Status', key: 'status' },
              { label: 'Remarks', key: 'remarks' },
            ],
            data: logsList,
            fileName: `Vehicle_Shift_Logs_Report${vehicleName ? `_${vehicleName}` : ''}`,
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
    [logsList, vehicleName, exportToPDF, exportToExcel],
  )

  return (
    <>
      <ToastContainer />

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
                Vehicle Shift History Logs
                {vehicleName ? ` : ${vehicleName}` : ''}
              </h5>
            </div>
          </div>
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
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  setCurrentPage(1)
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
            <CCol md={2} sm={6}>
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
                }}
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y.value} value={y.value}>
                    {y.label}
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
                    setMonth('')
                    setYear('')
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
                    setMonth('')
                    setYear('')
                  }
                  if (!val) {
                    setEndDate('')
                    return
                  }
                  const effectiveMin = startDate || MIN_DATE
                  if (val < effectiveMin) {
                    setEndDate(effectiveMin)
                  } else if (val > todayDate) {
                    setEndDate(todayDate)
                  } else {
                    setEndDate(val)
                  }
                }}
              />
            </CCol>
          </CRow>

          {/* Active Filter Badges & Reset Button */}
          {(vehicleName || status !== 'all' || startDate || endDate || month || year || searchQuery) && (
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
                {vehicleName && (
                  <CBadge color="primary" className="d-flex align-items-center gap-1">
                    Vehicle: {vehicleName}
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setVehicleId('')
                        setVehicleName('')
                        setCurrentPage(1)
                      }}
                    >
                      ×
                    </span>
                  </CBadge>
                )}
                {status !== 'all' && (
                  <CBadge color="info" className="d-flex align-items-center gap-1">
                    Status: {status}
                    <span style={{ cursor: 'pointer' }} onClick={() => setStatus('all')}>
                      ×
                    </span>
                  </CBadge>
                )}
                {month && (
                  <CBadge color="secondary" className="d-flex align-items-center gap-1">
                    Month: {MONTH_OPTIONS.find((m) => m.value === month)?.label || month}
                    <span style={{ cursor: 'pointer' }} onClick={() => setMonth('')}>
                      ×
                    </span>
                  </CBadge>
                )}
                {year && (
                  <CBadge color="secondary" className="d-flex align-items-center gap-1">
                    Year: {year}
                    <span style={{ cursor: 'pointer' }} onClick={() => setYear('')}>
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
                <FaUndo size={11} />
                <span>Reset All Filters</span>
              </CButton>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Total Count on top of Table */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="badge bg-light text-dark border px-3 py-2 fs-6 shadow-sm">
          Total Logs: <strong className="text-primary">{totalCount}</strong>
        </span>
      </div>

      {/* Main Table */}
      <Table
        columns={columns}
        filteredData={logsList}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching || isDebouncing}
        viewButton={false}
        editButton={false}
        deleteButton={false}
        showPagination={false}
      />

      {/* Pagination */}
      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value === -1 ? totalCount : value)
          setCurrentPage(1)
        }}
      />

      {/* Floating Action Menu for Export */}
      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default VehicleShiftLogs
