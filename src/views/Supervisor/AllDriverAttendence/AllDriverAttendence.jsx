import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DateRangePicker from '../../components/DateRangePicker'
import SmartPagination from '../../components/SmartPagination'
import Table from '../../components/Table'
import SearchInput from '../../components/SearchInput'
import { ToastContainer } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getAllDriverAttendenceApi, getDriverAttendanceDetailedApi } from '../data/data'
import IconDropdown from '../IconDropdown'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import { CTooltip } from '@coreui/react'

const attendanceFilterOptions = [
  { value: 'all', label: 'All Drivers' },
  { value: 'zero_present', label: '0 Present' },
  { value: 'zero_absent', label: '0 Absent' },
]

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
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  })

  // Trigger detailed attendance API on load (/report/driver-attendance-detailed?month=...&year=...&all=true)
  const { data: detailedAttendanceData, isFetching: isDetailedFetching } = useQuery({
    queryKey: [
      'driverAttendanceDetailed',
      month ? String(month).padStart(2, '0') : '10',
      year || '2026',
    ],
    queryFn: () =>
      getDriverAttendanceDetailedApi({
        month: month ? String(month).padStart(2, '0') : '10',
        year: year || '2026',
        all: true,
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
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

  // Global MapTiler reverse geocoding cache
  const maptilerAddressCache = new Map()

  const reverseGeocodeMaptiler = async (lat, long) => {
    if (lat === null || lat === undefined || long === null || long === undefined) return null
    const numLat = Number(lat)
    const numLong = Number(long)
    if (isNaN(numLat) || isNaN(numLong)) return null

    const cacheKey = `${numLat.toFixed(5)},${numLong.toFixed(5)}`
    if (maptilerAddressCache.has(cacheKey)) {
      return maptilerAddressCache.get(cacheKey)
    }

    const apiKey = import.meta.env.VITE_MAP || 'dq5pOnSdxzgtz374VVUb'
    try {
      // MapTiler reverse geocode: https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${apiKey}
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
    }
  }

  // Component to render address converted via MapTiler
  const LocationAddress = ({ location }) => {
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
  }

  // Render nested driver details & daily attendance table
  const renderNestedDriverDetails = (row) => {
    const rowDriverId = String(row.driverId || row.id || row._id || '')
    const driverDetails =
      (detailedAttendanceData?.report || []).find((item) => {
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
      }) || null

    const rawAttendanceDetails = driverDetails?.attendanceDetails || []

    // Build complete daily attendance list including missing previous days as 'Not Marked'
    const targetY = parseInt(detailedAttendanceData?.year || year || new Date().getFullYear(), 10)
    const targetM = parseInt(detailedAttendanceData?.month || month || (new Date().getMonth() + 1), 10)
    const apiTotalDays = detailedAttendanceData?.totalDaysInMonth || row.totalDaysInMonth
    const totalDaysInMonth = apiTotalDays || new Date(targetY, targetM, 0).getDate()

    // Determine how many days have passed
    const today = new Date()
    const isCurrentMonth = today.getFullYear() === targetY && (today.getMonth() + 1) === targetM
    const isPastMonth =
      targetY < today.getFullYear() ||
      (targetY === today.getFullYear() && today.getMonth() + 1 > targetM)

    let effectiveDaysPassed = 0
    if (detailedAttendanceData?.daysPassed && Number(detailedAttendanceData.daysPassed) > 0) {
      effectiveDaysPassed = Number(detailedAttendanceData.daysPassed)
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
                {detailedAttendanceData?.month || month}/{detailedAttendanceData?.year || year}
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
          </div>
        </div>

        {/* Nested Attendance Records Table */}
        {isDetailedFetching && !driverDetails ? (
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

  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () =>
        exportToPDF({
          title: 'Driver Attendance Details',
          columns: columns,
          data: filteredData,
          fileName: 'Driver_Attendance_Report',
        }),
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () =>
        exportToExcel({
          title: 'Driver Attendance Details',
          columns: columns,
          data: filteredData,
          fileName: 'Driver_Attendance_Report',
        }),
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

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </div>
  )
}

export default AllDriverAttendance
