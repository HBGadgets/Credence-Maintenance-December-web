import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import DateRangePicker from '../../components/DateRangePicker'
import SmartPagination from '../../components/SmartPagination'
import Table from '../../components/Table'
import SearchInput from '../../components/SearchInput'
import { toast, ToastContainer } from 'react-toastify'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  getAllDriverAttendenceApi,
  getDriverAttendanceDetailedApi,
  editAttendanceBySupervisorApi,
} from '../data/data'
import IconDropdown from '../IconDropdown'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf, FaEdit } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import {
  CTooltip,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CFormLabel,
  CRow,
  CCol,
  CSpinner,
} from '@coreui/react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const attendanceFilterOptions = [
  { value: 'all', label: 'All Drivers' },
  { value: 'zero_present', label: '0 Present' },
  { value: 'zero_absent', label: '0 Absent' },
]

// Global MapTiler reverse geocoding cache & in-flight requests (module level)
const maptilerAddressCache = new Map()
const maptilerPendingRequests = new Map()

const reverseGeocodeMaptiler = async (lat, long) => {
  if (lat === null || lat === undefined || long === null || long === undefined) return null
  const numLat = Number(lat)
  const numLong = Number(long)
  if (isNaN(numLat) || isNaN(numLong)) return null

  const cacheKey = `${numLat.toFixed(5)},${numLong.toFixed(5)}`
  if (maptilerAddressCache.has(cacheKey)) {
    return maptilerAddressCache.get(cacheKey)
  }

  if (maptilerPendingRequests.has(cacheKey)) {
    return maptilerPendingRequests.get(cacheKey)
  }

  const apiKey = import.meta.env.VITE_MAP || 'dq5pOnSdxzgtz374VVUb'
  const promise = (async () => {
    try {
      const response = await axios.get(
        `https://api.maptiler.com/geocoding/${numLong},${numLat}.json?key=${apiKey}`,
      )
      if (response.data?.features?.length > 0) {
        const address =
          response.data.features[0].place_name ||
          response.data.features[0].text ||
          `${numLat.toFixed(4)}, ${numLong.toFixed(4)}`
        maptilerAddressCache.set(cacheKey, address)
        return address
      }
      const fallback = `${numLat.toFixed(4)}, ${numLong.toFixed(4)}`
      maptilerAddressCache.set(cacheKey, fallback)
      return fallback
    } catch (err) {
      console.warn('MapTiler Geocoding Error:', err?.message)
      const fallback = `${numLat.toFixed(4)}, ${numLong.toFixed(4)}`
      maptilerAddressCache.set(cacheKey, fallback)
      return fallback
    } finally {
      maptilerPendingRequests.delete(cacheKey)
    }
  })()

  maptilerPendingRequests.set(cacheKey, promise)
  return promise
}

// Component to render address converted via MapTiler (memoized & module level)
const LocationAddress = React.memo(({ location }) => {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const lat = location?.lat !== undefined ? location.lat : location?.latitude
  const long = location?.long !== undefined ? location.long : location?.longitude

  useEffect(() => {
    if (lat === null || lat === undefined || long === null || long === undefined) {
      setAddress('')
      return
    }

    const numLat = Number(lat)
    const numLong = Number(long)
    if (isNaN(numLat) || isNaN(numLong)) {
      setAddress(typeof location === 'string' ? location : '')
      return
    }

    const cacheKey = `${numLat.toFixed(5)},${numLong.toFixed(5)}`
    if (maptilerAddressCache.has(cacheKey)) {
      setAddress(maptilerAddressCache.get(cacheKey))
      return
    }

    let isMounted = true
    setLoading(true)

    reverseGeocodeMaptiler(numLat, numLong)
      .then((addr) => {
        if (isMounted) {
          setAddress(addr || `${numLat.toFixed(4)}, ${numLong.toFixed(4)}`)
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [lat, long, location])

  if (!location) return <span className="text-muted">-</span>

  if (typeof location === 'string' && location.trim()) {
    return (
      <CTooltip content={location} placement="top">
        <span
          className="small text-truncate d-inline-block"
          style={{ maxWidth: '240px', cursor: 'pointer' }}
        >
          {location}
        </span>
      </CTooltip>
    )
  }

  const numLat = Number(lat)
  const numLong = Number(long)
  if (isNaN(numLat) || isNaN(numLong)) {
    return <span className="text-muted">-</span>
  }

  if (loading && !address) {
    return (
      <span className="small text-muted d-inline-flex align-items-center gap-1">
        <span
          className="spinner-border spinner-border-sm text-secondary"
          role="status"
          style={{ width: '10px', height: '10px' }}
        />
        <span style={{ fontSize: '11px' }}>Resolving address...</span>
      </span>
    )
  }

  const displayAddress = address || `${numLat.toFixed(4)}, ${numLong.toFixed(4)}`

  return (
    <CTooltip content={`${displayAddress} (Click to open map)`} placement="top">
      <a
        href={`https://www.google.com/maps?q=${numLat},${numLong}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary text-decoration-none small d-inline-flex align-items-center gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <span role="img" aria-label="pin">
          📍
        </span>
        <span
          className="text-truncate d-inline-block text-start"
          style={{ maxWidth: '240px', verticalAlign: 'middle' }}
        >
          {displayAddress}
        </span>
      </a>
    </CTooltip>
  )
})

import EditAttendanceModal, {
  formatTimeTo12Hour,
  formatTimeTo24Hour,
  getTodayLocalDate,
} from './EditAttendanceModal'

const AllDriverAttendance = () => {
  const navigate = useNavigate()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [attendanceFilter, setAttendanceFilter] = useState(null)

  // Export loading & progress state
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState('')
  const [exportProgress, setExportProgress] = useState({
    percent: 0,
    message: '',
    current: 0,
    total: 0,
    driverName: '',
  })

  const [selectedMonth, setSelectedMonth] = useState(() => {
    return sessionStorage.getItem('allDriverAttendanceMonth') || new Date().toISOString().slice(0, 7)
  })

  useEffect(() => {
    sessionStorage.setItem('allDriverAttendanceMonth', selectedMonth)
  }, [selectedMonth])

  const [year, month] = selectedMonth.split('-')

  const selectedFilterValue =
    attendanceFilter?.value && attendanceFilter.value !== 'all' ? attendanceFilter.value : undefined

  // Existing summary query
  const { data, isFetching } = useQuery({
    queryKey: [
      'DriverAttendacne',
      {
        search: searchQuery,
        page: currentPage,
        limit: itemsPerPage === -1 ? (totalRecords || 10) : itemsPerPage,
        month: parseInt(month, 10),
        year: parseInt(year, 10),
        filter: selectedFilterValue,
      },
    ],
    queryFn: getAllDriverAttendenceApi,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (data?.total !== undefined) {
      setTotalRecords(data.total)
    }
    if (data?.data) {
      setFilteredData(data.data)
    }
  }, [data])

  const totalPages =
    itemsPerPage === -1
      ? 1
      : data?.total && itemsPerPage > 0
        ? Math.ceil(data.total / itemsPerPage)
        : data?.totalPages || 1

  const columns = [
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Total Days In Month', key: 'totalDaysInMonth', sortable: true },
    { label: 'Total Days', key: 'totalDays', sortable: true },
    { label: 'Total Marked Days', key: 'totalMarkedDays', sortable: true },
    { label: 'Not Marked Days', key: 'notMarkedDays', sortable: true },
    { label: 'Present Days', key: 'presentDays', sortable: true },
    { label: 'Absent Days', key: 'absentDays', sortable: true },
    { label: 'Leave Days', key: 'leaveDays', sortable: true },
  ]

  const handleViewButton = (id) => {
    navigate(`/DriverAttendance/${id}`, { state: { selectedMonth } })
  }

  const queryClient = useQueryClient()

  // State for Edit Attendance Modal
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editInitialData, setEditInitialData] = useState(null)

  // Open modal handler
  const handleOpenEditModal = (driver, attendanceRecord = null) => {
    const driverId = String(driver?.driverId || driver?.id || driver?._id || '')
    const driverName = driver?.driverName || driver?.name || 'Driver'

    const maxDate = getTodayLocalDate()
    let dateStr = ''
    if (attendanceRecord?.date) {
      const recDate = attendanceRecord.date.split('T')[0]
      dateStr = recDate > maxDate ? maxDate : recDate
    } else {
      if (maxDate.startsWith(selectedMonth)) {
        dateStr = maxDate
      } else {
        const firstOfMonth = `${selectedMonth}-01`
        dateStr = firstOfMonth > maxDate ? maxDate : firstOfMonth
      }
    }

    const rawStatus = attendanceRecord?.status || 'Present'
    const status = rawStatus === 'Not Marked' ? 'Present' : rawStatus

    const inTime24 = attendanceRecord?.checkInTime
      ? formatTimeTo24Hour(attendanceRecord.checkInTime)
      : '09:30'
    const outTime24 = attendanceRecord?.checkoutTime
      ? formatTimeTo24Hour(attendanceRecord.checkoutTime)
      : '18:30'

    const recordId =
      attendanceRecord?._id && !String(attendanceRecord._id).startsWith('not-marked-')
        ? attendanceRecord._id
        : null

    setEditInitialData({
      driverId,
      driverName,
      attendanceId: recordId,
      date: dateStr,
      status: ['Present', 'Absent', 'Leave'].includes(status) ? status : 'Present',
      punchInTime: inTime24,
      punchOutTime: outTime24,
      supervisorComment: attendanceRecord?.supervisorComment || '',
    })
    setEditModalVisible(true)
  }

  // Format date DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      const parts = dateString.split('T')[0].split('-')
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString
      const day = String(date.getDate()).padStart(2, '0')
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const y = date.getFullYear()
      return `${day}/${m}/${y}`
    } catch {
      return dateString
    }
  }

  // Format raw time HH:MM:SS AM/PM without adding timezone offset
  const formatTime = (timeString) => {
    if (!timeString) return '-'
    try {
      if (typeof timeString === 'string' && timeString.includes('T')) {
        const timePart = timeString.split('T')[1].split('.')[0].replace('Z', '')
        const [hStr, mStr, sStr] = timePart.split(':')
        const h = parseInt(hStr, 10)
        const m = parseInt(mStr || '0', 10)
        const s = parseInt(sStr || '0', 10)
        if (!isNaN(h) && !isNaN(m)) {
          const ampm = h >= 12 ? 'PM' : 'AM'
          const h12 = h % 12 || 12
          const hh = String(h12).padStart(2, '0')
          const mm = String(m).padStart(2, '0')
          const ss = String(s).padStart(2, '0')
          return `${hh}:${mm}:${ss} ${ampm}`
        }
      }

      const date = new Date(timeString)
      if (isNaN(date.getTime())) return String(timeString)
      return date.toLocaleTimeString([], {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
    } catch {
      return String(timeString || '-')
    }
  }

  // Render nested driver details & daily attendance table
  const renderNestedDriverDetails = (row) => {
    const rowDriverId = String(row.driverId || row.id || row._id || '')
    const driverDetails =
      (row.attendanceDetails && row.attendanceDetails.length > 0 ? row : null) ||
      (data?.report || []).find((item) => {
        const itemId = String(item.driverId || item.id || item._id || '')
        if (rowDriverId && itemId && rowDriverId === itemId) return true
        if (
          item.driverName &&
          row.driverName &&
          item.driverName.trim().toLowerCase() === row.driverName.trim().toLowerCase()
        ) {
          return true
        }
        return false
      }) ||
      row ||
      null

    const rawAttendanceDetails = driverDetails?.attendanceDetails || row.attendanceDetails || []

    // Build complete daily attendance list including missing previous days as 'Not Marked'
    const targetY = parseInt(data?.year || year || new Date().getFullYear(), 10)
    const targetM = parseInt(data?.month || month || (new Date().getMonth() + 1), 10)
    const apiTotalDays = data?.totalDaysInMonth || row.totalDaysInMonth
    const totalDaysInMonth = apiTotalDays || new Date(targetY, targetM, 0).getDate()

    // Determine how many days have passed
    const today = new Date()
    const isCurrentMonth = today.getFullYear() === targetY && (today.getMonth() + 1) === targetM
    const isPastMonth =
      targetY < today.getFullYear() ||
      (targetY === today.getFullYear() && today.getMonth() + 1 > targetM)

    let effectiveDaysPassed = 0
    if (data?.daysPassed && Number(data.daysPassed) > 0) {
      effectiveDaysPassed = Number(data.daysPassed)
    } else if (isCurrentMonth) {
      effectiveDaysPassed = today.getDate()
    } else if (isPastMonth) {
      effectiveDaysPassed = totalDaysInMonth
    } else {
      effectiveDaysPassed = 0
    }

    // Map existing records by YYYY-MM-DD
    const existingRecordsMap = new Map()
    let maxDayFound = 0
    rawAttendanceDetails.forEach((entry) => {
      if (entry?.date) {
        const dateKey = entry.date.split('T')[0]
        existingRecordsMap.set(dateKey, entry)
        const parts = dateKey.split('-')
        if (parts.length === 3) {
          const d = parseInt(parts[2], 10)
          if (!isNaN(d) && d > maxDayFound) {
            maxDayFound = d
          }
        }
      }
    })

    const daysLimit = Math.max(effectiveDaysPassed, maxDayFound)
    const attendanceDetails = []

    for (let d = 1; d <= daysLimit; d++) {
      const dayStr = String(d).padStart(2, '0')
      const monthStr = String(targetM).padStart(2, '0')
      const dateKey = `${targetY}-${monthStr}-${dayStr}`

      if (existingRecordsMap.has(dateKey)) {
        attendanceDetails.push(existingRecordsMap.get(dateKey))
      } else {
        attendanceDetails.push({
          _id: `not-marked-${dateKey}`,
          date: dateKey,
          status: 'Not Marked',
          checkInTime: null,
          checkoutTime: null,
          duration: null,
          checkInLocation: null,
          checkOutLocation: null,
          imageId: null,
          isNotMarked: true,
        })
      }
    }

    // Retain any extra records from raw data that might not match standard date pattern
    rawAttendanceDetails.forEach((entry) => {
      if (entry?.date) {
        const key = entry.date.split('T')[0]
        if (!attendanceDetails.some((item) => item.date && item.date.split('T')[0] === key)) {
          attendanceDetails.push(entry)
        }
      }
    })

    const contactNumber = driverDetails?.contactNumber || row.contactNumber || 'N/A'
    const presentCount = driverDetails?.presentCount ?? row.presentDays ?? 0
    const absentCount = driverDetails?.absentCount ?? row.absentDays ?? 0
    const leaveCount = driverDetails?.leaveCount ?? row.leaveDays ?? 0
    const totalMarked = driverDetails?.totalMarked ?? row.totalMarkedDays ?? 0
    const notMarkedCount = driverDetails?.notMarkedCount ?? row.notMarkedDays ?? 0
    const totalDays = driverDetails?.totalDaysInMonth ?? row.totalDaysInMonth ?? 31

    return (
      <div className="p-3 bg-light border-top border-bottom" style={{ cursor: 'default' }}>
        {/* Driver Summary Bar */}
        <div className="bg-white p-3 rounded shadow-sm border mb-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <div>
              <div
                className="text-muted text-uppercase fw-semibold"
                style={{ fontSize: '11px', letterSpacing: '0.5px' }}
              >
                Driver Name
              </div>
              <div className="fw-bold text-dark fs-6">
                {driverDetails?.driverName || row.driverName || 'N/A'}
              </div>
            </div>
            <div className="border-start ps-3">
              <div
                className="text-muted text-uppercase fw-semibold"
                style={{ fontSize: '11px', letterSpacing: '0.5px' }}
              >
                Contact Number
              </div>
              <div className="fw-semibold text-secondary">{contactNumber}</div>
            </div>
            <div className="border-start ps-3">
              <div
                className="text-muted text-uppercase fw-semibold"
                style={{ fontSize: '11px', letterSpacing: '0.5px' }}
              >
                Month & Year
              </div>
              <div className="fw-semibold text-secondary">
                {data?.month || month}/{data?.year || year}
              </div>
            </div>
          </div>

          {/* Attendance Breakdown Badges */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <CTooltip content="Total Present Days in Month" placement="top">
              <span
                className="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1"
                style={{ cursor: 'pointer' }}
              >
                Present: <strong>{presentCount}</strong>
              </span>
            </CTooltip>
            <CTooltip content="Total Absent Days in Month" placement="top">
              <span
                className="badge bg-danger bg-opacity-10 text-danger border border-danger px-2 py-1"
                style={{ cursor: 'pointer' }}
              >
                Absent: <strong>{absentCount}</strong>
              </span>
            </CTooltip>
            <CTooltip content="Total Approved Leave Days in Month" placement="top">
              <span
                className="badge bg-warning bg-opacity-10 text-warning border border-warning px-2 py-1"
                style={{ cursor: 'pointer' }}
              >
                On Leave: <strong>{leaveCount}</strong>
              </span>
            </CTooltip>
            <CTooltip content="Total Marked Days vs Total Days in Month" placement="top">
              <span
                className="badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1"
                style={{ cursor: 'pointer' }}
              >
                Marked: <strong>{totalMarked} / {totalDays}</strong>
              </span>
            </CTooltip>
            <CTooltip content="Total Not Marked Days (Elapsed days with no attendance record)" placement="top">
              <span
                className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-2 py-1"
                style={{ cursor: 'pointer' }}
              >
                Not Marked: <strong>{notMarkedCount}</strong>
              </span>
            </CTooltip>

            <button
              type="button"
              className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1 shadow-sm px-2 py-1 ms-1"
              style={{ fontSize: '12px' }}
              onClick={(e) => {
                e.stopPropagation()
                handleOpenEditModal(driverDetails || row, null)
              }}
            >
              <FaEdit size={12} />
              <span>Mark / Edit Attendance</span>
            </button>
          </div>
        </div>

        {/* Nested Attendance Records Table */}
        {isFetching && !driverDetails ? (
          <div className="text-center py-4 bg-white rounded border shadow-sm text-muted">
            <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
            <span>Loading driver attendance details...</span>
          </div>
        ) : attendanceDetails.length === 0 ? (
          <div className="text-center py-4 bg-white rounded border shadow-sm text-muted fst-italic">
            No detailed daily attendance records found for this driver in this month.
          </div>
        ) : (
          <div className="bg-white rounded border shadow-sm overflow-hidden">
            <div className="table-responsive" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <table
                className="table table-hover table-striped align-middle mb-0"
                style={{ fontSize: '13px' }}
              >
                <thead className="table-light sticky-top" style={{ zIndex: 1 }}>
                  <tr>
                    <th className="text-center">Date</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Check-In Time</th>
                    <th className="text-center">Check-In Address</th>
                    <th className="text-center">Check-Out Time</th>
                    <th className="text-center">Check-Out Address</th>
                    <th className="text-center">Duration</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceDetails.map((item, idx) => {
                    const status = item.status || 'Not Marked'
                    const statusLower = status.toLowerCase()
                    const badgeClass =
                        statusLower === 'present'
                        ? 'bg-success bg-opacity-10 text-success border-success'
                        : statusLower === 'absent'
                        ? 'bg-danger bg-opacity-10 text-danger border-danger'
                        : statusLower.includes('leave')
                        ? 'bg-warning bg-opacity-10 text-warning border-warning'
                        : 'bg-secondary bg-opacity-10 text-secondary border-secondary'

                    return (
                      <tr key={item._id || idx}>
                        <td className="text-center fw-semibold text-nowrap">
                          {formatDate(item.date)}
                        </td>
                        <td className="text-center">
                          <span className={`badge border px-2 py-1 ${badgeClass}`}>
                            {status}
                          </span>
                        </td>
                        <td className="text-center text-nowrap">
                          {formatTime(item.checkInTime)}
                        </td>
                        <td className="text-center">
                          <LocationAddress location={item.checkInLocation} />
                        </td>
                        <td className="text-center text-nowrap">
                          {formatTime(item.checkoutTime)}
                        </td>
                        <td className="text-center">
                          <LocationAddress location={item.checkOutLocation} />
                        </td>
                        <td className="text-center text-nowrap">{item.duration || '-'}</td>
                        <td className="text-center text-nowrap">
                          <CTooltip content="Edit Attendance Record" placement="top">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary py-0 px-2 d-inline-flex align-items-center gap-1"
                              style={{ fontSize: '11px', height: '26px' }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleOpenEditModal(driverDetails || row, item)
                              }}
                            >
                              <FaEdit size={11} />
                              <span>Edit</span>
                            </button>
                          </CTooltip>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Format Date and Time for Excel Export (DD-MM-YYYY HH:mm:ss)
  const formatCheckinDateTimeForExport = (dateStr, timeStr) => {
    if (timeStr) {
      try {
        if (typeof timeStr === 'string' && timeStr.includes('T')) {
          const [dPart, tPart] = timeStr.split('T')
          const [y, m, d] = dPart.split('-')
          const cleanTime = tPart.split('.')[0].replace('Z', '')
          const [hh, mm, ss] = cleanTime.split(':')
          return `${d}-${m}-${y} ${hh || '00'}:${mm || '00'}:${ss || '00'}`
        }
        const dt = new Date(timeStr)
        if (!isNaN(dt.getTime())) {
          const day = String(dt.getUTCDate()).padStart(2, '0')
          const mon = String(dt.getUTCMonth() + 1).padStart(2, '0')
          const yr = dt.getUTCFullYear()
          const hh = String(dt.getUTCHours()).padStart(2, '0')
          const mm = String(dt.getUTCMinutes()).padStart(2, '0')
          const ss = String(dt.getUTCSeconds()).padStart(2, '0')
          return `${day}-${mon}-${yr} ${hh}:${mm}:${ss}`
        }
      } catch (err) {
        console.warn('Error formatting checkin date time:', err)
      }
    }

    if (dateStr) {
      try {
        const cleanDate = dateStr.split('T')[0]
        const parts = cleanDate.split('-')
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]} 23:59:00`
        }
      } catch (err) {
        console.warn('Error formatting date:', err)
      }
    }

    return '--'
  }

  const formatCheckoutDateTimeForExport = (timeStr) => {
    if (!timeStr) return '--'
    try {
      if (typeof timeStr === 'string' && timeStr.includes('T')) {
        const [dPart, tPart] = timeStr.split('T')
        const [y, m, d] = dPart.split('-')
        const cleanTime = tPart.split('.')[0].replace('Z', '')
        const [hh, mm, ss] = cleanTime.split(':')
        return `${d}-${m}-${y} ${hh || '00'}:${mm || '00'}:${ss || '00'}`
      }
      const dt = new Date(timeStr)
      if (!isNaN(dt.getTime())) {
        const day = String(dt.getUTCDate()).padStart(2, '0')
        const mon = String(dt.getUTCMonth() + 1).padStart(2, '0')
        const yr = dt.getUTCFullYear()
        const hh = String(dt.getUTCHours()).padStart(2, '0')
        const mm = String(dt.getUTCMinutes()).padStart(2, '0')
        const ss = String(dt.getUTCSeconds()).padStart(2, '0')
        return `${day}-${mon}-${yr} ${hh}:${mm}:${ss}`
      }
    } catch (err) {
      console.warn('Error formatting checkout date time:', err)
    }
    return '--'
  }

  const resolveAddressForExport = async (loc) => {
    if (!loc) return '--'
    if (typeof loc === 'string') {
      const s = loc.trim()
      return s ? s : '--'
    }
    if (loc.address && typeof loc.address === 'string' && loc.address.trim()) {
      return loc.address.trim()
    }
    const lat = loc.lat !== undefined ? loc.lat : loc.latitude
    const long = loc.long !== undefined ? loc.long : loc.longitude
    if (lat === null || lat === undefined || long === null || long === undefined) return '--'
    const numLat = Number(lat)
    const numLong = Number(long)
    if (isNaN(numLat) || isNaN(numLong)) return '--'

    try {
      const addr = await reverseGeocodeMaptiler(numLat, numLong)
      return addr || `${numLat.toFixed(4)}, ${numLong.toFixed(4)}`
    } catch {
      return `${numLat.toFixed(4)}, ${numLong.toFixed(4)}`
    }
  }

  // Shared data preparation for Excel and PDF exports with live progress reporting
  const prepareAttendanceExportData = async (onProgress, exportTypeLabel = 'report') => {
    onProgress?.({ percent: 10, message: `Fetching detailed attendance records for ${exportTypeLabel}...` })
    let detailedData = null
    try {
      detailedData = await getDriverAttendanceDetailedApi({
        month: month ? String(month).padStart(2, '0') : '10',
        year: year || '2026',
        all: true,
      })
    } catch {
      detailedData = data
    }

    const allReports = detailedData?.report || []
    if (allReports.length === 0 && (!filteredData || filteredData.length === 0)) {
      throw new Error('No driver attendance records found to export.')
    }

    const driversToExport =
      filteredData && filteredData.length > 0
        ? filteredData.map((row) => {
            const rowId = String(row.driverId || row.id || row._id || '')
            const matched = allReports.find((item) => {
              const itemId = String(item.driverId || item.id || item._id || '')
              if (rowId && itemId && rowId === itemId) return true
              if (
                item.driverName &&
                row.driverName &&
                item.driverName.trim().toLowerCase() === row.driverName.trim().toLowerCase()
              ) {
                return true
              }
              return false
            })
            return matched || row
          })
        : allReports

    let tokenUsername = ''
    let tokenCompany = ''
    let tokenBranch = ''
    try {
      const rawToken = Cookies.get('crdnsMaintToken')
      if (rawToken) {
        const decoded = jwtDecode(rawToken)
        tokenUsername = decoded?.username || ''
        tokenCompany = decoded?.companyName || decoded?.company || ''
        tokenBranch = decoded?.branch || ''
      }
    } catch (e) {
      console.warn('Token decode error:', e)
    }

    const targetY = parseInt(detailedData?.year || year || new Date().getFullYear(), 10)
    const targetM = parseInt(detailedData?.month || month || (new Date().getMonth() + 1), 10)
    const apiTotalDays = detailedData?.totalDaysInMonth
    const today = new Date()
    const isCurrentMonth = today.getFullYear() === targetY && (today.getMonth() + 1) === targetM
    const isPastMonth =
      targetY < today.getFullYear() ||
      (targetY === today.getFullYear() && today.getMonth() + 1 > targetM)

    const preparedDrivers = []
    const totalDrivers = driversToExport.length

    for (let i = 0; i < totalDrivers; i++) {
      const driver = driversToExport[i]
      const rawAttendance = driver.attendanceDetails || []
      const totalDaysInMonth =
        driver.totalDaysInMonth || apiTotalDays || new Date(targetY, targetM, 0).getDate()

      let effectiveDaysPassed = 0
      if (detailedData?.daysPassed && Number(detailedData.daysPassed) > 0) {
        effectiveDaysPassed = Number(detailedData.daysPassed)
      } else if (isCurrentMonth) {
        effectiveDaysPassed = today.getDate()
      } else if (isPastMonth) {
        effectiveDaysPassed = totalDaysInMonth
      } else {
        effectiveDaysPassed = 0
      }

      const existingRecordsMap = new Map()
      let maxDayFound = 0
      rawAttendance.forEach((entry) => {
        if (entry?.date) {
          const dateKey = entry.date.split('T')[0]
          existingRecordsMap.set(dateKey, entry)
          const parts = dateKey.split('-')
          if (parts.length === 3) {
            const d = parseInt(parts[2], 10)
            if (!isNaN(d) && d > maxDayFound) {
              maxDayFound = d
            }
          }
        }
      })

      const daysLimit = Math.max(effectiveDaysPassed, maxDayFound)
      const dailyRecords = []

      for (let d = 1; d <= daysLimit; d++) {
        const dayStr = String(d).padStart(2, '0')
        const monthStr = String(targetM).padStart(2, '0')
        const dateKey = `${targetY}-${monthStr}-${dayStr}`

        if (existingRecordsMap.has(dateKey)) {
          dailyRecords.push(existingRecordsMap.get(dateKey))
        } else {
          dailyRecords.push({
            date: dateKey,
            status: 'Not Marked',
            checkInTime: null,
            checkoutTime: null,
            checkInLocation: null,
            checkOutLocation: null,
            isNotMarked: true,
          })
        }
      }

      rawAttendance.forEach((entry) => {
        if (entry?.date) {
          const key = entry.date.split('T')[0]
          if (!dailyRecords.some((item) => item.date && item.date.split('T')[0] === key)) {
            dailyRecords.push(entry)
          }
        }
      })

      const employeeName = driver.driverName || driver.name || 'Driver'
      const role = driver.role || 'Driver'

      const currentDriverNum = i + 1
      const progressPercent = Math.min(
        88,
        Math.round(15 + (i / totalDrivers) * 73)
      )
      onProgress?.({
        percent: progressPercent,
        message: `Resolving location addresses for ${employeeName} (${currentDriverNum} of ${totalDrivers})...`,
        current: currentDriverNum,
        total: totalDrivers,
        driverName: employeeName,
      })

      const workingDays = totalDaysInMonth
      const presentDays = driver.presentCount ?? driver.presentDays ?? 0
      const absentDays = driver.absentCount ?? driver.absentDays ?? 0
      const halfDays = driver.halfDays ?? driver.leaveCount ?? driver.leaveDays ?? 0
      const lateIns = driver.lateIns ?? driver.notMarkedCount ?? driver.notMarkedDays ?? 0

      const processedDaily = []
      for (const record of dailyRecords) {
        const dateCol = formatDate(record.date) || '--'
        const checkinCol = formatCheckinDateTimeForExport(record.date, record.checkInTime)
        const checkoutCol = formatCheckoutDateTimeForExport(record.checkoutTime)

        // Resolve start and end location addresses concurrently
        const [startLocCol, endLocCol] = await Promise.all([
          resolveAddressForExport(record.checkInLocation),
          resolveAddressForExport(record.checkOutLocation),
        ])
        const statusCol = record.status || (record.isNotMarked ? 'Not Marked' : 'Absent')

        processedDaily.push({
          date: dateCol,
          checkin: checkinCol,
          startLoc: startLocCol,
          checkout: checkoutCol,
          endLoc: endLocCol,
          status: statusCol,
        })
      }

      preparedDrivers.push({
        index: i + 1,
        employeeName,
        role,
        workingDays,
        presentDays,
        absentDays,
        halfDays,
        lateIns,
        dailyRecords: processedDaily,
      })
    }

    onProgress?.({ percent: 90, message: 'Compiling report data...' })

    return {
      targetM,
      targetY,
      drivers: preparedDrivers,
    }
  }

  // Handle detailed Excel export matching requested multi-driver layout
  const handleDownloadExcel = async () => {
    if (isExporting) return
    setIsExporting(true)
    setExportType('Excel')
    setExportProgress({ percent: 5, message: 'Initializing Excel export...' })

    try {
      toast.info('Preparing detailed attendance sheet for export...')
      const { targetM, targetY, drivers } = await prepareAttendanceExportData(setExportProgress, 'Excel')

      setExportProgress({ percent: 92, message: 'Generating Excel workbook...' })
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Attendance Report')

      worksheet.views = [{ showGridLines: true }]

      // Define column widths
      worksheet.columns = [
        { key: 'date', width: 16 },
        { key: 'checkin', width: 24 },
        { key: 'startLoc', width: 60 },
        { key: 'checkout', width: 24 },
        { key: 'endLoc', width: 60 },
        { key: 'status', width: 20 },
      ]

      const thinBorder = {
        top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        right: { style: 'thin', color: { argb: 'FFD3D3D3' } },
      }

      // Top Sheet Header
      const topHeaderRow = worksheet.addRow([
        'Date',
        'Checkin Time / Metric',
        'Start Location / Detail',
        'CheckOut Time',
        'End Location',
        'Attendance Status',
      ])
      topHeaderRow.font = { bold: true, size: 10, name: 'Calibri' }
      topHeaderRow.alignment = { vertical: 'middle', horizontal: 'left' }
      topHeaderRow.eachCell((cell) => {
        cell.border = thinBorder
      })

      // Iterate through each driver
      for (const d of drivers) {
        // Row 1: Employee Header (Only Employee Name without company/branch/supervisor)
        const employeeRow = worksheet.addRow([
          `${d.index}. Employee: ${d.employeeName}${d.role ? ` (${d.role})` : ''}`,
          '',
          '',
          '',
          '',
          '',
        ])
        employeeRow.font = { bold: true, size: 10, name: 'Calibri' }
        employeeRow.alignment = { vertical: 'middle', horizontal: 'left' }
        employeeRow.eachCell((cell) => {
          cell.border = thinBorder
        })

        // Row 2: Summary Metrics
        const metricsRow = worksheet.addRow([
          'SUMMARY METRICS',
          `Working Days: ${d.workingDays}`,
          `Present: ${d.presentDays}`,
          `Absent: ${d.absentDays}`,
          `Half Days: ${d.halfDays}`,
          `Late Ins: ${d.lateIns}`,
        ])
        metricsRow.font = { bold: true, size: 10, name: 'Calibri' }
        metricsRow.alignment = { vertical: 'middle', horizontal: 'left' }
        metricsRow.eachCell((cell) => {
          cell.border = thinBorder
        })

        // Row 3: Subheader Row
        const subheaderRow = worksheet.addRow([
          'Date',
          'CheckIn Time',
          'Start Location',
          'CheckOut Time',
          'End Location',
          'Attendance Status',
        ])
        subheaderRow.font = { bold: true, size: 10, name: 'Calibri' }
        subheaderRow.alignment = { vertical: 'middle', horizontal: 'left' }
        subheaderRow.eachCell((cell) => {
          cell.border = thinBorder
        })

        // Daily Rows
        for (const record of d.dailyRecords) {
          const dRow = worksheet.addRow([
            record.date,
            record.checkin,
            record.startLoc,
            record.checkout,
            record.endLoc,
            record.status,
          ])
          dRow.font = { size: 10, name: 'Calibri' }
          dRow.alignment = { vertical: 'middle', horizontal: 'left' }
          dRow.eachCell((cell) => {
            cell.border = thinBorder
          })
        }

        // Empty row spacer between employees
        worksheet.addRow([])
      }

      // Write and trigger download
      setExportProgress({ percent: 98, message: 'Finalizing Excel file download...' })
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      saveAs(blob, `Driver_Attendance_Report_${targetM}_${targetY}.xlsx`)
      toast.success('Excel sheet exported successfully!')
    } catch (error) {
      console.error('Error exporting Excel sheet:', error)
      toast.error('Failed to export Excel sheet: ' + (error?.message || 'Unknown error'))
    } finally {
      setIsExporting(false)
      setExportProgress({ percent: 0, message: '', current: 0, total: 0, driverName: '' })
    }
  }

  // Handle detailed PDF export matching the multi-driver sheet layout
  const handleDownloadPDF = async () => {
    if (isExporting) return
    setIsExporting(true)
    setExportType('PDF')
    setExportProgress({ percent: 5, message: 'Initializing PDF export...' })

    try {
      toast.info('Preparing detailed attendance PDF for export...')
      const { targetM, targetY, drivers } = await prepareAttendanceExportData(setExportProgress, 'PDF')

      setExportProgress({ percent: 92, message: 'Formatting PDF document...' })
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      // Title & Header info
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(10, 45, 99)
      doc.text('FMS - Driver Attendance Detailed Report', 14, 14)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(100)
      doc.text(
        `Month & Year: ${String(targetM).padStart(2, '0')}/${targetY}  |  Generated on: ${new Date().toLocaleDateString('en-GB')}`,
        14,
        20
      )

      const tableHead = [
        [
          'Date',
          'Checkin Time / Metric',
          'Start Location / Detail',
          'CheckOut Time',
          'End Location',
          'Attendance Status',
        ],
      ]

      const bodyRows = []

      for (const d of drivers) {
        // Row 1: Employee Header (Only Employee Name across 6 columns)
        bodyRows.push([
          {
            content: `${d.index}. Employee: ${d.employeeName}${d.role ? ` (${d.role})` : ''}`,
            colSpan: 6,
            styles: { fontStyle: 'bold', fillColor: [240, 243, 246], textColor: [20, 20, 20] },
          },
        ])

        // Row 2: Summary Metrics
        bodyRows.push([
          {
            content: 'SUMMARY METRICS',
            styles: { fontStyle: 'bold', fillColor: [248, 249, 250], textColor: [40, 40, 40] },
          },
          {
            content: `Working Days: ${d.workingDays}`,
            styles: { fontStyle: 'bold', fillColor: [248, 249, 250], textColor: [40, 40, 40] },
          },
          {
            content: `Present: ${d.presentDays}`,
            styles: { fontStyle: 'bold', fillColor: [248, 249, 250], textColor: [40, 40, 40] },
          },
          {
            content: `Absent: ${d.absentDays}`,
            styles: { fontStyle: 'bold', fillColor: [248, 249, 250], textColor: [40, 40, 40] },
          },
          {
            content: `Half Days: ${d.halfDays}`,
            styles: { fontStyle: 'bold', fillColor: [248, 249, 250], textColor: [40, 40, 40] },
          },
          {
            content: `Late Ins: ${d.lateIns}`,
            styles: { fontStyle: 'bold', fillColor: [248, 249, 250], textColor: [40, 40, 40] },
          },
        ])

        // Row 3: Subheader Row
        bodyRows.push([
          {
            content: 'Date',
            styles: { fontStyle: 'bold', fillColor: [232, 238, 248], textColor: [10, 45, 99], halign: 'center' },
          },
          {
            content: 'CheckIn Time',
            styles: { fontStyle: 'bold', fillColor: [232, 238, 248], textColor: [10, 45, 99] },
          },
          {
            content: 'Start Location',
            styles: { fontStyle: 'bold', fillColor: [232, 238, 248], textColor: [10, 45, 99] },
          },
          {
            content: 'CheckOut Time',
            styles: { fontStyle: 'bold', fillColor: [232, 238, 248], textColor: [10, 45, 99] },
          },
          {
            content: 'End Location',
            styles: { fontStyle: 'bold', fillColor: [232, 238, 248], textColor: [10, 45, 99] },
          },
          {
            content: 'Attendance Status',
            styles: { fontStyle: 'bold', fillColor: [232, 238, 248], textColor: [10, 45, 99], halign: 'center' },
          },
        ])

        // Daily records
        for (const record of d.dailyRecords) {
          const statusLower = (record.status || '').toLowerCase()
          const statusColor =
            statusLower === 'present'
              ? [40, 167, 69]
              : statusLower === 'absent'
              ? [220, 53, 69]
              : statusLower.includes('leave')
              ? [255, 153, 0]
              : [108, 117, 125]

          bodyRows.push([
            {
              content: record.date,
              styles: { halign: 'center', fontStyle: 'bold' },
            },
            record.checkin,
            record.startLoc,
            record.checkout,
            record.endLoc,
            {
              content: record.status,
              styles: { textColor: statusColor, fontStyle: 'bold', halign: 'center' },
            },
          ])
        }

        // Spacer row between drivers
        bodyRows.push([
          {
            content: '',
            colSpan: 6,
            styles: { minCellHeight: 4, fillColor: [255, 255, 255], lineColor: [255, 255, 255] },
          },
        ])
      }

      doc.autoTable({
        startY: 24,
        head: tableHead,
        body: bodyRows,
        theme: 'grid',
        styles: {
          fontSize: 7.5,
          cellPadding: 1.8,
          lineColor: [215, 215, 215],
          lineWidth: 0.1,
          overflow: 'linebreak',
          valign: 'middle',
        },
        headStyles: {
          fillColor: [10, 45, 99],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'left',
          fontSize: 8,
        },
        columnStyles: {
          0: { cellWidth: 22, halign: 'center' },
          1: { cellWidth: 32, halign: 'left' },
          2: { cellWidth: 84, halign: 'left' },
          3: { cellWidth: 32, halign: 'left' },
          4: { cellWidth: 75, halign: 'left' },
          5: { cellWidth: 24, halign: 'center' },
        },
        margin: { left: 14, right: 14, top: 14, bottom: 14 },
      })

      // Number pages
      const totalPagesCount = doc.internal.getNumberOfPages()
      for (let p = 1; p <= totalPagesCount; p++) {
        doc.setPage(p)
        doc.setFontSize(8)
        doc.setTextColor(130)
        const pageText = `Page ${p} of ${totalPagesCount}`
        doc.text(
          pageText,
          doc.internal.pageSize.width - 14 - doc.getTextWidth(pageText),
          doc.internal.pageSize.height - 6
        )
      }

      setExportProgress({ percent: 98, message: 'Finalizing PDF file download...' })
      doc.save(`Driver_Attendance_Report_${targetM}_${targetY}.pdf`)
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast.error('Failed to export PDF: ' + (error?.message || 'Unknown error'))
    } finally {
      setIsExporting(false)
      setExportProgress({ percent: 0, message: '', current: 0, total: 0, driverName: '' })
    }
  }

  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: handleDownloadPDF,
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: handleDownloadExcel,
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
    <div>
      <ToastContainer />

      <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
        {/* Top Left */}
        <div className="d-flex align-items-center flex-wrap gap-2">
          <DateRangePicker
            value={selectedMonth}
            onMonthChange={(newMonth) => {
              setSelectedMonth(newMonth)
              setCurrentPage(1)
            }}
            style={{ width: '230px' }}
            className="p-0 m-0"
          />
          <div style={{ width: '220px' }}>
            <SingleSelectDropdown
              options={attendanceFilterOptions}
              value={attendanceFilter}
              onChange={(selected) => {
                setAttendanceFilter(selected)
                setCurrentPage(1)
              }}
              isClearable
              placeholder="Filter Attendance..."
            />
          </div>
        </div>

        {/* Top Right */}
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={(query) => {
            setSearchQuery(query)
            setCurrentPage(1)
          }}
        />
      </div>

      <Table
        title="Driver Attendence Details"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        serverPagination={true}
        totalServerItems={data?.total || filteredData.length}
        showPagination={false}
        viewButton={true}
        handleViewButton={handleViewButton}
        editButton={true}
        handleEditButton={(id) => {
          const matchedDriver = filteredData.find(
            (d) => String(d.driverId || d.id || d._id) === String(id),
          )
          if (matchedDriver) {
            handleOpenEditModal(matchedDriver, null)
          }
        }}
        renderRowDetails={renderNestedDriverDetails}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value)
          setCurrentPage(1)
        }}
      />

      {/* Edit Attendance Modal */}
      <EditAttendanceModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        initialData={editInitialData}
        onSuccess={() => queryClient.invalidateQueries(['DriverAttendacne'])}
      />

      {/* Exporting Progress Loader Modal */}
      <CModal
        visible={isExporting}
        backdrop="static"
        keyboard={false}
        alignment="center"
        className="shadow-lg border-0"
      >
        <CModalBody className="p-4 text-center">
          <div className="d-flex flex-column align-items-center justify-content-center py-2">
            <div className="mb-3 position-relative d-inline-flex align-items-center justify-content-center">
              <CSpinner color="primary" style={{ width: '3.2rem', height: '3.2rem' }} />
            </div>

            <h5 className="fw-bold mb-1 text-dark">
              Preparing {exportType ? `${exportType} ` : ''}Report to Export
            </h5>
            <p className="text-muted small mb-3">
              Please wait while attendance records and location addresses are being fetched.
            </p>

            {/* Progress bar */}
            <div className="w-100 px-3 mb-2">
              <div
                className="progress"
                style={{ height: '8px', borderRadius: '4px', backgroundColor: '#e9ecef' }}
              >
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                  role="progressbar"
                  style={{
                    width: `${exportProgress.percent || 0}%`,
                    transition: 'width 0.3s ease',
                  }}
                  aria-valuenow={exportProgress.percent || 0}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
            </div>

            <div
              className="d-flex justify-content-between align-items-center w-100 px-3 text-muted"
              style={{ fontSize: '12px' }}
            >
              <span className="text-truncate text-start" style={{ maxWidth: '80%' }}>
                {exportProgress.message || 'Fetching addresses and preparing report...'}
              </span>
              <span className="fw-semibold text-primary ms-2">
                {exportProgress.percent || 0}%
              </span>
            </div>

            <div className="mt-3 text-muted" style={{ fontSize: '11px' }}>
              Please do not close or navigate away from this page.
            </div>
          </div>
        </CModalBody>
      </CModal>

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </div>
  )
}

export default AllDriverAttendance
