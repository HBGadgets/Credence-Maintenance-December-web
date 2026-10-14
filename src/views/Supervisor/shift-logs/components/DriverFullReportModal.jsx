import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CSpinner,
  CBadge,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import {
  FaUserTie,
  FaPhoneAlt,
  FaIdCard,
  FaTruck,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaGasPump,
  FaRoad,
  FaEnvelope,
  FaPrint,
  FaHistory,
  FaRoute,
} from 'react-icons/fa'
import { getDriverFullReportApi } from '../data'

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
const currentYearNum = new Date().getFullYear()
const YEARS = Array.from(
  { length: Math.max(1, currentYearNum - MIN_PAST_YEAR + 1) },
  (_, i) => currentYearNum - i,
)

function DriverFullReportModal({ visible, setVisible, driver }) {
  const driverId = driver?.driverId || driver?.id || driver?._id
  const driverName = driver?.driverName || driver?.name || 'Driver'

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [activeSubTab, setActiveSubTab] = useState('shifts') // 'shifts' | 'attendance' | 'leaves' | 'expenses'

  // Fetch Driver Full Report
  const {
    data: reportData,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['driverFullReport', driverId, selectedMonth, selectedYear],
    queryFn: () =>
      getDriverFullReportApi(driverId, {
        month: selectedMonth,
        year: selectedYear,
      }),
    enabled: Boolean(visible && driverId),
    staleTime: 1000 * 60 * 2,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const driverDetails = reportData?.driverDetails || {}
  const monthlySummary = reportData?.monthlySummary || {}
  const shiftsHistory = Array.isArray(reportData?.vehiclesShiftingHistory)
    ? reportData.vehiclesShiftingHistory
    : []
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

  return (
    <CModal
      size="xl"
      visible={visible}
      onClose={() => setVisible(false)}
      backdrop="static"
      className="modal-fullscreen-lg-down"
    >
      <CModalHeader closeButton className="border-bottom bg-light py-2 px-3">
        <div className="d-flex align-items-center justify-content-between w-100 flex-wrap gap-2 pe-3">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded p-2 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px' }}
            >
              <FaUserTie size={18} />
            </div>
            <div>
              <CModalTitle className="fs-5 fw-bold text-dark mb-0">
                Driver Complete Monthly Report : {driverDetails.name || driverName}
              </CModalTitle>
              <div className="small text-muted">
                Detailed shifting history, attendance, leaves, expenses, and trips
              </div>
            </div>
          </div>

          {/* Month / Year Pickers */}
          <div className="d-flex align-items-center gap-2">
            <CFormSelect
              size="sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              style={{ width: '130px' }}
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </CFormSelect>

            <CFormSelect
              size="sm"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{ width: '90px' }}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </CFormSelect>
          </div>
        </div>
      </CModalHeader>

      <CModalBody className="p-3" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
        {isFetching ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <div className="mt-2 text-muted small">Loading driver report...</div>
          </div>
        ) : isError ? (
          <div className="alert alert-danger d-flex align-items-center justify-content-between">
            <div>{error?.message || 'Failed to load driver report'}</div>
            <CButton color="danger" size="sm" variant="outline" onClick={() => refetch()}>
              Retry
            </CButton>
          </div>
        ) : (
          <>
            {/* Driver Profile Bar */}
            <CCard className="border-0 shadow-sm mb-3 bg-light">
              <CCardBody className="p-3">
                <CRow className="g-3 align-items-center">
                  <CCol md={3} sm={6}>
                    <div className="text-muted small">Driver Name</div>
                    <div className="fw-bold text-dark fs-6 d-flex align-items-center gap-1">
                      <FaUserTie className="text-primary" size={13} />
                      {driverDetails.name || driverName}
                    </div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <div className="text-muted small">Contact Number</div>
                    <div className="fw-semibold text-dark d-flex align-items-center gap-1">
                      <FaPhoneAlt className="text-success" size={12} />
                      {driverDetails.contactNumber || driver?.contactNumber || '—'}
                    </div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <div className="text-muted small">License Number</div>
                    <div className="fw-semibold text-dark d-flex align-items-center gap-1">
                      <FaIdCard className="text-info" size={13} />
                      {driverDetails.licenseNumber || '—'}
                    </div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <div className="text-muted small">Current Vehicle</div>
                    <div className="fw-bold text-primary d-flex align-items-center gap-1">
                      <FaTruck size={13} />
                      {driverDetails.currentVehicleName || driver?.vehicleName || 'None assigned'}
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>

            {/* Monthly KPI Summary Cards */}
            <CRow className="g-2 mb-3">
              {/* Shifts & Vehicles */}
              <CCol md={3} sm={6}>
                <div className="p-3 rounded border bg-white shadow-sm h-100">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="small text-muted fw-semibold">Total Shifts</span>
                    <span className="badge bg-primary bg-opacity-10 text-primary">
                      {monthlySummary.totalVehiclesCount ?? 0} Vehicles
                    </span>
                  </div>
                  <h4 className="fw-bold text-primary mb-1">
                    {monthlySummary.totalShifts ?? 0}
                  </h4>
                  <div className="small text-muted text-truncate" title={(monthlySummary.distinctVehiclesDriven || []).join(', ')}>
                    {monthlySummary.distinctVehiclesDriven?.length
                      ? monthlySummary.distinctVehiclesDriven.join(', ')
                      : 'No vehicles driven'}
                  </div>
                </div>
              </CCol>

              {/* Attendance */}
              <CCol md={3} sm={6}>
                <div className="p-3 rounded border bg-white shadow-sm h-100">
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
                    {monthlySummary.trips?.totalDistanceKm ?? 0} <span className="fs-6 fw-normal text-muted">KM</span>
                  </h4>
                  <div className="small text-muted">
                    Daily: {monthlySummary.trips?.totalDailyTrips ?? 0} • Regular: {monthlySummary.trips?.totalRegularTrips ?? 0}
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
                  <span>Vehicles Shifting ({shiftsHistory.length})</span>
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
              <div className="table-responsive bg-white rounded border">
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
                    {shiftsHistory.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-4 text-muted">
                          No vehicle shift logs found for this period.
                        </td>
                      </tr>
                    ) : (
                      shiftsHistory.map((shift, idx) => (
                        <tr key={shift.shiftId || idx}>
                          <td>{idx + 1}</td>
                          <td className="fw-semibold text-primary">{shift.vehicleName || '—'}</td>
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
              <div className="table-responsive bg-white rounded border">
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
              <div className="table-responsive bg-white rounded border">
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
              <div className="table-responsive bg-white rounded border">
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
              <div className="table-responsive bg-white rounded border">
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
              <div className="table-responsive bg-white rounded border">
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
                          <td className="fw-semibold text-primary">{exp.vehicleName || '—'}</td>
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
      </CModalBody>

      <CModalFooter className="border-top py-2 px-3">
        <CButton color="secondary" variant="outline" size="sm" onClick={() => setVisible(false)}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default DriverFullReportModal
