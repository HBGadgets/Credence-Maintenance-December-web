import React, { useState, useContext, useEffect, useMemo, useRef } from 'react'
import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCardHeader,
  CCol,
  CContainer,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { IoPersonSharp, IoSettingsSharp, IoAlertCircle } from 'react-icons/io5'
import { FaTruckMoving, FaMapLocationDot, FaHandshakeSimple, FaCar } from 'react-icons/fa6'
import { TbTruckDelivery } from 'react-icons/tb'
import { RiMoneyRupeeCircleFill } from 'react-icons/ri'
import { TokenContext } from '../../context/TokenContext'
import { useQuery } from '@tanstack/react-query'
import { fetchAllAdmin, fetchDashboardData, getAllTripListApi, getDailyTripLogsApi } from './data/data'
import SingleSelectDropdown from '../components/SingleSelectDropdown'
import { jwtDecode } from 'jwt-decode'
import { getStatusBadge } from '../Supervisor/trip/componets/tripHelpers'
import Table from '../components/Table'
import SearchInput from '../components/SearchInput'
import DateRangeFilterCredence from '../../components/DateRangeFilterCredence'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import logo from 'src/assets/brand/fmslogo.svg'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { socket } from '../customhooks/useSocket'
import { NotificationContext } from '../../context/NotificationContext'
import notificationSound from '../../../mario_up.mp3'
import Cookies from 'js-cookie'
import { BsPassFill } from 'react-icons/bs'
import { PieChart, Pie, Cell, Tooltip, AreaChart, Area, ResponsiveContainer } from 'recharts'
import vehiclesIcon from 'src/assets/images/vehicles-icon.png'
import driversIcon from 'src/assets/images/drivers-icon.png'
import maintenanceIcon from 'src/assets/images/maintenance-icon.png'
import attendanceIcon from 'src/assets/images/attendance-icon.png'
import expenseIcon from 'src/assets/images/expense-icon.png'
import liveOnWorkIcon from 'src/assets/images/live-on-work-icon.png'
import documentAlertIcon from 'src/assets/images/document-alert-icon.png'
import transportReceiptIcon from 'src/assets/images/transport-receipt-icon.png'

const FleetAnalyticsChart = ({ data, tripsData, dailyTripsData }) => {
  const [overviewMode, setOverviewMode] = useState('Resource Overview')
  const [filterCategory, setFilterCategory] = useState('All')
  const [tripCategory, setTripCategory] = useState('Trip')

  const tripStats = useMemo(() => {
    let pending = 0, started = 0, completed = 0;
    (tripsData || []).forEach(trip => {
      const st = trip.status?.toLowerCase() || '';
      if (st.includes('pending')) pending++;
      else if (st.includes('start') || st.includes('live') || st.includes('ongoing')) started++;
      else if (st.includes('complete') || st.includes('finish')) completed++;
      else pending++; // fallback
    })
    return { pending, started, completed }
  }, [tripsData])

  const dailyTripStats = useMemo(() => {
    let started = 0, completed = 0;
    (dailyTripsData || []).forEach(trip => {
      const st = trip.status?.toLowerCase() || '';
      if (st.includes('complete') || st.includes('finish')) {
        completed++;
      } else {
        started++; // 'started' hi 'pending' h
      }
    })
    return { started, completed }
  }, [dailyTripsData])

  const pieData = useMemo(() => {
    if (overviewMode === 'Trips Overview') {
      if (tripCategory === 'Trip') {
        return [
          { name: 'Pending', value: tripStats.pending, color: '#ffc107' },
          { name: 'Started', value: tripStats.started, color: '#17a2b8' },
          { name: 'Completed', value: tripStats.completed, color: '#28a745' },
        ]
      } else {
        return [
          { name: 'Started Logs', value: dailyTripStats.started, color: '#17a2b8' },
          { name: 'Completed Logs', value: dailyTripStats.completed, color: '#28a745' },
        ]
      }
    } else {
      switch (filterCategory) {
        case 'Vehicles':
          return [
            { name: 'Available', value: data?.availableVehicles || 0, color: '#17a2b8' },
            { name: 'Unavailable', value: data?.unavailableVehicles || 0, color: '#dc3545' },
            { name: 'Maintenance', value: data?.vehiclesUnderMaintenance || 0, color: '#fd7e14' },
          ]
        case 'Drivers':
          return [
            { name: 'Available', value: data?.availableDrivers || 0, color: '#28a745' },
            { name: 'Unavailable', value: data?.unavailableDrivers || 0, color: '#dc3545' },
            { name: 'Live on Work', value: data?.driversLiveOnWork || 0, color: '#008080' },
          ]
        case 'Documents':
          return [
            { name: 'Alerts', value: data?.documentAlerts || 0, color: '#dc3545' },
            { name: 'Safe', value: Math.max(0, (data?.totalVehicles || 0) - (data?.documentAlerts || 0)), color: '#28a745' },
          ]
        case 'All':
        default:
          return [
            { name: 'Vehicles', value: data?.totalVehicles || 0, color: '#17a2b8' },
            { name: 'Drivers', value: data?.totalDrivers || 0, color: '#28a745' },
            { name: 'Doc Alerts', value: data?.documentAlerts || 0, color: '#dc3545' },
          ]
      }
    }
  }, [overviewMode, filterCategory, tripCategory, data, tripStats, dailyTripStats])

  const areaData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

    // Deterministic random so the dummy graph doesn't change on re-render
    const seedRandom = (seed) => {
      let x = Math.sin(seed++) * 10000
      return x - Math.floor(x)
    }

    return months.map((month, mIdx) => {
      let obj = { name: month }
      pieData.forEach((item, kIdx) => {
        const currentValue = item.value || 0
        if (currentValue === 0) {
          obj[item.name] = 0
        } else {
          // fluctuate between 70% and 130% of the current value
          const fluctuation = 0.7 + seedRandom(mIdx * 10 + kIdx) * 0.6
          obj[item.name] = Math.max(0, Math.floor(currentValue * fluctuation))
        }
      })
      return obj
    })
  }, [pieData])

  return (
    <div className="w-100 h-100 d-flex flex-column">
      {/* Filter Dropdowns */}
      <div className="d-flex justify-content-end gap-2 mb-2 px-2">
        <select
          className="form-select form-select-sm shadow-sm"
          style={{ width: '160px', fontWeight: '500' }}
          value={overviewMode}
          onChange={(e) => setOverviewMode(e.target.value)}
        >
          <option value="Resource Overview">Resource Overview</option>
          <option value="Trips Overview">Trips Overview</option>
        </select>

        {overviewMode === 'Resource Overview' ? (
          <select
            className="form-select form-select-sm shadow-sm"
            style={{ width: '150px' }}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Overview</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Drivers">Drivers</option>
            <option value="Documents">Documents</option>
          </select>
        ) : (
          <select
            className="form-select form-select-sm shadow-sm"
            style={{ width: '150px' }}
            value={tripCategory}
            onChange={(e) => setTripCategory(e.target.value)}
          >
            <option value="Trip">Trips</option>
            <option value="Daily Trip">Daily Trips Logs</option>
          </select>
        )}
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 w-100" style={{ flex: 1 }}>
        <div style={{ width: '100%', height: '180px', flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: '100%', height: '200px', flex: 1.5, display: 'flex', flexDirection: 'column' }}>
          <div className="d-flex justify-content-center flex-wrap gap-3 mb-2" style={{ fontSize: '12px', fontWeight: '500' }}>
            {pieData.map((item) => (
              <div key={item.name} className="d-flex align-items-center gap-1">
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: item.color,
                    borderRadius: '2px',
                  }}
                ></div>
                <span>
                  {item.name}: <span style={{ color: '#666' }}>{item.value}</span>
                </span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                {pieData.map((item, index) => (
                  <Area
                    key={index}
                    type="monotone"
                    dataKey={item.name}
                    stroke={item.color}
                    fill={item.color}
                    fillOpacity={0.3}
                  />
                ))}
                <Tooltip />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const token = Cookies.get('crdnsMaintToken') || useContext(TokenContext)
  // if (!socket.connected) socket.connect();
  console.log('Socket connected:', socket.connected)

  const sidebarShow = useSelector((state) => state.sidebarShow)
  const activeSection = useSelector((state) => state.activeSection || 'Dashboard')
  // The sidebar is rendered only when sidebarShow is true AND the active section has sub-items (i.e. not Dashboard)
  const isSidebarOpen = Boolean(sidebarShow && activeSection && activeSection.trim().toLowerCase() !== 'dashboard')

  const [splitView, setSplitView] = useState('both')
  const [messages, setMessages] = useState({})
  const { notifications, addNotification, unreadCounts, setUnreadCounts } =
    useContext(NotificationContext)
  const [selectedContact, setSelectedContact] = useState(null)

  const [userInteracted, setUserInteracted] = useState(false)

  console.log(unreadCounts, notifications)

  // Function to clear notifications
  const handleClearNotifications = () => {
    setNotifications([]) // Clears all notifications
  }

  const navigate = useNavigate()
  const [tableMode, setTableMode] = useState('Trip')
  const [filteredData, setFilteredData] = useState([])

  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const dragDistanceRef = useRef(0)

  const checkScroll = () => {
    const el = scrollContainerRef.current
    if (!el) return
    const hasScroll = el.scrollWidth > el.clientWidth + 5
    setCanScrollLeft(hasScroll && el.scrollLeft > 10)
    setCanScrollRight(hasScroll && el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return

    checkScroll()
    const handleScrollEvent = () => checkScroll()
    el.addEventListener('scroll', handleScrollEvent, { passive: true })

    const observer = new ResizeObserver(() => checkScroll())
    observer.observe(el)

    return () => {
      el.removeEventListener('scroll', handleScrollEvent)
      observer.disconnect()
    }
  }, [isSidebarOpen])

  const handleScroll = (direction) => {
    const el = scrollContainerRef.current
    if (!el) return
    const scrollAmount = Math.max(el.clientWidth * 0.7, 300)
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const handleWheel = (e) => {
    const el = scrollContainerRef.current
    if (!el) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && el.scrollWidth > el.clientWidth) {
      el.scrollLeft += e.deltaY
      checkScroll()
    }
  }

  const handleMouseDown = (e) => {
    const el = scrollContainerRef.current
    if (!el) return
    isDraggingRef.current = true
    dragDistanceRef.current = 0
    startXRef.current = e.pageX - el.offsetLeft
    scrollLeftRef.current = el.scrollLeft
  }

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return
    const el = scrollContainerRef.current
    if (!el) return
    e.preventDefault()
    const x = e.pageX - el.offsetLeft
    const walk = (x - startXRef.current) * 1.2
    dragDistanceRef.current = Math.abs(walk)
    el.scrollLeft = scrollLeftRef.current - walk
    checkScroll()
  }

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // superadmin role

  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  const isWorker = !!(
    sessionStorage.getItem('workerInfo') ||
    localStorage.getItem('workerInfo') ||
    decodedToken?.worker ||
    decodedToken?.role === 'worker'
  )

  // Fetch dashboard data using React Query
  const { data } = useQuery({
    queryKey: ['dashboardData', token, selectedName?.value],
    queryFn: () => fetchDashboardData(selectedName?.value),
    enabled: !!token && !isWorker,
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchAllAdmin,
    staleTime: 1000 * 60 * 10,
    enabled: !!token && !isWorker,
  })

  // Fetch Trip Data
  const { data: TripsList = [], isFetching } = useQuery({
    queryKey: ['TripsList', token],
    queryFn: getAllTripListApi,
    staleTime: 1000 * 60 * 30,
    enabled: !!token && !!decodedToken && !isWorker,
  })

  // Fetch Daily Trip Logs
  const { data: DailyTripLogsResponse, isFetching: isFetchingDailyLogs } = useQuery({
    queryKey: ['DailyTripLogs', token, currentPage, itemsPerPage, searchQuery],
    queryFn: getDailyTripLogsApi,
    staleTime: 1000 * 60 * 30,
    enabled: !!token && !!decodedToken && tableMode === 'Daily Trip Logs' && !isWorker,
  })

  const DailyTripLogsList = DailyTripLogsResponse?.data || []
  const totalDailyTripLogs = DailyTripLogsResponse?.total || 0

  // Fetch Daily Trip Logs for Analytics (All logs)
  const { data: DailyTripLogsAnalyticsData } = useQuery({
    queryKey: ['DailyTripLogsAnalytics', token, 1, 10000, ''],
    queryFn: getDailyTripLogsApi,
    staleTime: 1000 * 60 * 30,
    enabled: !!token && !!decodedToken && !isWorker,
  })

  const dailyTripsAnalyticsList = DailyTripLogsAnalyticsData?.data || []

  // Use fetched data if available, otherwise fallback to static values
  const dashboardData = data?.data || {}
  const metadata = data?.metadata || {}

  useEffect(() => {
    if (token) {
      console.log('token', token)
    }
  }, [token])

  // Add this useEffect for initial interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      setUserInteracted(true)
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('keydown', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [])

  // notification alerts
  useEffect(() => {
    if (!socket) return

    const handleReceiveMessage = (msg) => {
      // Add notification
      addNotification(msg)

      // Play sound only if user interacted
      if (userInteracted) {
        const audio = new Audio(notificationSound)
        audio.play().catch((e) => console.log('Audio play error:', e))
      }

      // Update unread counts only if the message is from another contact
      setUnreadCounts((prev) => {
        if (selectedContact?.id === msg.senderId) return prev
        return {
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1,
        }
      })

      // Append message
      setMessages((prev) => {
        const prevMsgs = prev[msg.senderId] || []
        return {
          ...prev,
          [msg.senderId]: [...prevMsgs, msg],
        }
      })
    }

    socket.on('receiveMessage', handleReceiveMessage)

    return () => {
      socket.off('receiveMessage', handleReceiveMessage)
    }

    //  Only depend on things that won't change on every render
  }, [socket, userInteracted, selectedContact?.id, addNotification, setUnreadCounts])

  useEffect(() => {
    const activeList = tableMode === 'Trip' ? TripsList : DailyTripLogsList
    
    if (!activeList || activeList.length === 0) {
      setFilteredData([])
      return
    }

    let filtered = activeList

    // Filter by supervisor if selected
    if (selectedName?.value) {
      filtered = filtered.filter((trip) => trip.supervisorId === selectedName.value)
    }

    // Filter by date range if available
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate)
      start.setHours(0, 0, 0, 0)
      const end = new Date(dateRange.endDate)
      end.setHours(23, 59, 59, 999)

      filtered = filtered.filter((item) => {
        const dateStr = item.date || item.orginalDate || item.createdAt || item.startDate
        if (!dateStr) return false
        
        const itemDate = new Date(dateStr)
        return itemDate >= start && itemDate <= end
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

    // Add calculated fields
    const styledData = filtered.map((data) => {
      if (tableMode === 'Daily Trip Logs') {
        return {
          ...data,
          status: data.status ? <span className={getStatusBadge(data.status)}>{data.status}</span> : data.status,
          driverName: data.driverId?.name || 'N/A',
          contactNumber: data.driverId?.contactNumber || 'N/A',
          vehicleName: data.driverId?.currentVehicleName || 'N/A',
          startTime: data.startTime ? new Date(data.startTime).toLocaleString() : 'N/A'
        }
      }

      const budgetAllocated = Number(data.budgetAllocated) || 0
      const subTripBudgetAllocated = Number(data.subTripBudgetAllocated) || 0
      const spentAmount = Number(data.spentAmount) || 0
      const remaining = budgetAllocated + subTripBudgetAllocated - spentAmount

      return {
        ...data,
        remainingAmount: (
          <span style={{ color: remaining < 0 ? 'red' : 'inherit' }}>{remaining.toFixed(2)}</span>
        ),
        status: <span className={getStatusBadge(data.status)}>{data.status}</span>,
      }
    })

    setFilteredData(styledData)
  }, [TripsList, DailyTripLogsList, selectedName, searchQuery, dateRange, tableMode])

  // Table view
  const baseTripColumns = [
    { label: 'Trip ID', key: 'tripId', sortable: false, hidden: true },
    { label: 'Start Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Start Location', key: 'startLocation', sortable: true },
    { label: 'End Location', key: 'endLocation', sortable: true },
    { label: 'Supervisor Budget', key: 'budgetAllocated', sortable: true },
    { label: 'SubTrip Amount', key: 'subTripBudgetAllocated', sortable: true },
    { label: 'Spent Amount', key: 'spentAmount', sortable: true },
    { label: 'Remaining Amount', key: 'remainingAmount', sortable: true },
    { label: 'Material Type', key: 'materialType', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
  ]

  const dailyTripColumns = [
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Contact Number', key: 'contactNumber', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Odometer Start', key: 'odometerStart', sortable: true },
    { label: 'Start Time', key: 'startTime', sortable: true },
    { label: 'Total Distance', key: 'totalDistance', sortable: true },
    { label: 'GPS KM', key: 'gpsKM', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
  ]

  const columns = tableMode === 'Trip' ? baseTripColumns : dailyTripColumns

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Handle Date Range Change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }

  // handle navigate
  const handleViewDetailedReport = () => {
    if (tableMode === 'Daily Trip Logs') {
      navigate('/DailyTrips')
    } else {
      navigate('/Trip')
    }
  }

  //handle navigate driver
  const handleViewDrives = () => {
    navigate('/TripPending')
  }

  //handle navigate vehicle
  const handleViewVehicles = () => {
    navigate('/VehicleAssign')
  }

  //handle navigate servicelogs
  const handleViewServicelog = () => {
    navigate('/AllVehicleServicesData')
  }

  //handle navigate Expenses
  const handleExpenses = () => {
    navigate('/AllExpenses')
  }

  //handle navigate Expenses
  const handleDriveStatus = () => {
    navigate('/DriverStatus')
  }

  //handle navigate Doc exp
  const handleDocExp = () => {
    navigate('/DocumentAlert')
  }

  // handle navigate driver loc
  const handleDriverLoc = () => {
    navigate('/DriverLocation')
  }

  // handle navigate roadside assit
  const handleTP = () => {
    navigate('/GodownLr')
  }

  // cards details

  const cards = [
    {
      label: 'Drivers',
      icon: <img src={driversIcon} alt="Drivers" style={{ width: '46px', height: '46px', objectFit: 'contain' }} />,
      subtext: (
        <>
          <span style={{ color: '#28a745', fontSize: '10px' }}>●</span> Avail : {dashboardData?.availableDrivers ?? 0}
          <br />
          <span style={{ color: '#dc3545', fontSize: '10px' }}>●</span> Unavail : {dashboardData?.unavailableDrivers ?? 0}
        </>
      ),
      count: dashboardData?.totalDrivers ?? 0,
      borders: {
        borderTop: '2px solid #28a745',
        borderLeft: '2px solid #28a745',
        borderBottom: '2px solid #dc3545',
        borderRight: '2px solid #dc3545',
      },
      shadow: 'inset 0 0 20px rgba(40, 167, 69, 0.4)',
      onClick: () => handleDriveStatus('Drivers Aavailablity'),
    },
    {
      label: 'Vehicles',
      icon: <img src={vehiclesIcon} alt="Vehicles" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />,
      subtext: (
        <>
          <span style={{ color: '#17a2b8', fontSize: '10px' }}>●</span> Avail : {dashboardData?.availableVehicles ?? 0}
          <br />
          <span style={{ color: '#dc3545', fontSize: '10px' }}>●</span> Unavail : {dashboardData?.unavailableVehicles ?? 0}
        </>
      ),
      count: dashboardData?.totalVehicles ?? 0,
      borders: { border: '2px solid #17a2b8' },
      shadow: 'inset 0 0 20px rgba(23, 162, 184, 0.5)',
      onClick: () => handleViewVehicles('Vehicles'),
    },
    {
      label: 'Maintenance',
      icon: <img src={maintenanceIcon} alt="Maintenance" style={{ width: '46px', height: '46px', objectFit: 'contain' }} />,
      subtext: (
        <>
          <span style={{ color: '#28a745', fontSize: '10px' }}>●</span> Healthy: {(dashboardData?.totalVehicles ?? 0) - (dashboardData?.vehiclesUnderMaintenance ?? 0)}
          <br />
          <span style={{ color: '#dc3545', fontSize: '10px' }}>●</span> Alert: {dashboardData?.vehiclesUnderMaintenance ?? 0}
        </>
      ),
      count: dashboardData?.totalVehicles ?? 0,
      borders: { border: '2px solid #2b5c8c' },
      shadow: 'inset 0 0 20px rgba(43, 92, 140, 0.5)',
      onClick: () => handleViewServicelog('Maintenance'),
    },
    {
      label: 'Attendance',
      icon: <img src={attendanceIcon} alt="Attendance" style={{ width: '46px', height: '46px', objectFit: 'contain' }} />,
      subtext: (
        <>
          <span style={{ color: '#4b2c82', fontSize: '10px' }}>●</span> Present: {dashboardData?.driverLocations ?? 0}
        </>
      ),
      count: dashboardData?.driverLocations ?? 0,
      borders: { border: '2px solid #4b2c82' },
      shadow: 'inset 0 0 20px rgba(75, 44, 130, 0.5)',
      onClick: () => handleDriverLoc('Driver Attendance Location'),
    },
    {
      label: 'Expenses',
      icon: <img src={expenseIcon} alt="Expenses" style={{ width: '46px', height: '46px', objectFit: 'contain' }} />,
      subtext: (
        <>
          <span style={{ color: '#fd7e14', fontSize: '10px' }}>●</span> Today: ₹{dashboardData?.expenses?.total?.toLocaleString() ?? 0}
        </>
      ),
      count: dashboardData?.expenses?.total >= 1000
        ? `₹${(dashboardData.expenses.total / 1000).toFixed(1)}K`
        : `₹${dashboardData?.expenses?.total ?? 0}`,
      borders: { border: '2px solid #fd7e14' },
      shadow: 'inset 0 0 20px rgba(253, 126, 20, 0.5)',
      onClick: () => handleExpenses('Expenses'),
    },
    {
      label: 'Live on Work',
      icon: <img src={liveOnWorkIcon} alt="Live on Work" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />,
      subtext: (
        <>
          <span style={{ color: '#008080', fontSize: '10px' }}>●</span> On Duty: {dashboardData?.driversLiveOnWork ?? 0}
          <br />
          <span style={{ color: '#6c757d', fontSize: '10px' }}>●</span> Total: {dashboardData?.totalDrivers ?? 0}
        </>
      ),
      count: dashboardData?.driversLiveOnWork ?? 0,
      borders: { border: '2px solid #008080' },
      shadow: 'inset 0 0 20px rgba(0, 128, 128, 0.5)',
      onClick: () => handleViewDrives('Live on Work'),
    },
    {
      label: 'Document Alert',
      icon: <img src={documentAlertIcon} alt="Document Alert" style={{ width: '46px', height: '46px', objectFit: 'contain' }} />,
      subtext: (
        <>
          <span style={{ color: '#dc3545', fontSize: '10px' }}>●</span> Expiring Soon
        </>
      ),
      count: dashboardData?.documentAlerts ?? 0,
      borders: { border: '2px solid #dc3545' },
      shadow: 'inset 0 0 20px rgba(220, 53, 69, 0.5)',
      onClick: () => handleDocExp('Insurance Alert'),
    },
    {
      label: 'Transport Receipt',
      icon: <img src={transportReceiptIcon} alt="Transport Receipt" style={{ width: '46px', height: '46px', objectFit: 'contain' }} />,
      subtext: (
        <>
          <span style={{ color: '#0d6efd', fontSize: '10px' }}>●</span> Today Pass: {dashboardData?.todayGodownLorryReceiptCount || '0'}
        </>
      ),
      count: dashboardData?.totalGodownLorryReceiptCount || '0',
      borders: { border: '2px solid #0d6efd' },
      shadow: 'inset 0 0 20px rgba(13, 110, 253, 0.5)',
      onClick: () => handleTP('Transport Receipt'),
    },
  ]



  // ── Worker Dashboard ─────────────────────────────────────────────
  if (isWorker) {
    const workerInfo = (() => {
      try {
        const raw = sessionStorage.getItem('workerInfo') || localStorage.getItem('workerInfo')
        return raw ? JSON.parse(raw) : null
      } catch {
        return null
      }
    })()

    return (
      <>
        <style>{`
          .worker-welcome-card {
            background: linear-gradient(135deg, #0a2d63 0%, #1a4a8a 100%);
            border-radius: 20px;
            color: #fff;
            padding: 40px;
            margin-bottom: 24px;
            box-shadow: 0 8px 32px rgba(10,45,99,0.18);
          }
          .worker-welcome-card h2 { font-weight: 700; margin-bottom: 6px; }
          .worker-welcome-card p { opacity: 0.8; margin: 0; }
          .worker-info-card {
            border-radius: 16px;
            border: none;
            box-shadow: 0 4px 16px rgba(0,0,0,0.07);
            padding: 28px;
          }
          .worker-info-row { display: flex; gap: 12px; align-items: center; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
          .worker-info-row:last-child { border-bottom: none; }
          .worker-info-label { font-weight: 600; min-width: 140px; color: #0a2d63; }
          .worker-info-value { color: #555; }
        `}</style>

        {/* Welcome Banner */}
        <div className="worker-welcome-card">
          <h2>👋 Welcome, {workerInfo?.name || 'Worker'}!</h2>
          <p>
            You are logged in as a Worker. Use the sidebar menu to access your permitted modules.
          </p>
        </div>

        {/* Worker Info Card */}
        {workerInfo && (
          <CCard className="worker-info-card mb-4">
            <CCardBody>
              <h5 className="fw-bold mb-4" style={{ color: '#0a2d63' }}>
                👤 Your Profile
              </h5>
              {workerInfo.name && (
                <div className="worker-info-row">
                  <span className="worker-info-label">Name</span>
                  <span className="worker-info-value">{workerInfo.name}</span>
                </div>
              )}
              {workerInfo.email && (
                <div className="worker-info-row">
                  <span className="worker-info-label">Email</span>
                  <span className="worker-info-value">{workerInfo.email}</span>
                </div>
              )}
              {workerInfo.role && (
                <div className="worker-info-row">
                  <span className="worker-info-label">Role</span>
                  <span className="worker-info-value" style={{ textTransform: 'capitalize' }}>
                    {workerInfo.role}
                  </span>
                </div>
              )}
              {workerInfo.phone && (
                <div className="worker-info-row">
                  <span className="worker-info-label">Phone</span>
                  <span className="worker-info-value">{workerInfo.phone}</span>
                </div>
              )}
              {workerInfo.department && (
                <div className="worker-info-row">
                  <span className="worker-info-label">Department</span>
                  <span className="worker-info-value">{workerInfo.department}</span>
                </div>
              )}
            </CCardBody>
          </CCard>
        )}

        <CCard
          className="worker-info-card"
          style={{ background: '#fffbe6', border: '1px solid #f3c100' }}
        >
          <CCardBody>
            <p className="mb-0" style={{ color: '#856404' }}>
              ℹ️ Your access is permission-based. If you need access to more modules, please contact
              your administrator.
            </p>
          </CCardBody>
        </CCard>
      </>
    )
  }

  return token ? (
    <div className="dashboard-wrapper">
      <style>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 12px;
          background-color: #fff;
        }

        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08), var(--hover-shadow, transparent) !important;
        }

        .card-label {
          font-weight: 700;
          font-size: 13px;
          color: #1a1a1a;
          margin-bottom: 2px;
          line-height: 1.2;
        }

        .card-count {
          font-size: 20px;
          font-weight: 800;
          color: #000;
          line-height: 1.2;
        }

        .card-subtext {
          font-size: 11px;
          color: #555;
          margin-bottom: 4px;
          line-height: 1.3;
        }

        .side-handle-btn {
          background-color: #fff !important;
          color: #1a1a1a !important;
          border: 1px solid #ddd !important;
          transition: all 0.2s ease-in-out;
        }

        .side-handle-btn:hover {
          background-color: #fd7e14 !important;
          color: #fff !important;
          border-color: #fd7e14 !important;
        }

        .dashboard-scroll-container {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          gap: 0.85rem;
          padding: 0.35rem 0.5rem 0.85rem 0.5rem;
          -ms-overflow-style: none;
          scrollbar-width: none;
          user-select: none;
        }

        .dashboard-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .dashboard-card-wrapper {
          flex: 0 0 210px;
          min-width: 210px;
        }

        /* When sidebar is closed on desktop: display all 8 cards in a single line */
        @media (min-width: 1100px) {
          .dashboard-scroll-container.sidebar-closed {
            overflow-x: visible;
            flex-wrap: nowrap;
            gap: 0.5rem;
            padding-bottom: 0.5rem;
          }

          .dashboard-scroll-container.sidebar-closed .dashboard-card-wrapper {
            flex: 1 1 0;
            min-width: 0;
            max-width: none;
          }

          .dashboard-scroll-container.sidebar-closed .hover-card .p-2 {
            padding: 0.5rem 0.35rem !important;
          }

          .dashboard-scroll-container.sidebar-closed .card-label {
            font-size: 11.5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .dashboard-scroll-container.sidebar-closed .card-count {
            font-size: 16px;
          }

          .dashboard-scroll-container.sidebar-closed .card-subtext {
            font-size: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .dashboard-scroll-container.sidebar-closed img {
            width: 38px !important;
            height: 38px !important;
          }
        }

        /* Auto-adjusting full screen layout for Table and Analytics */
        @media (min-width: 1200px) {
          .dashboard-wrapper {
             display: flex;
             flex-direction: column;
             height: calc(100vh - 110px);
          }
          .dashboard-main-container {
             flex: 1;
             min-height: 0;
          }
          .dashboard-main-col {
             height: 100%;
          }
        }
        @media (max-width: 1199px) {
          .dashboard-main-col {
             height: 550px;
             margin-bottom: 1.5rem;
          }
        }
      `}</style>

      {/*  cards */}

      <CCard className="mb-4 border-0 shadow-sm mt-2">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 px-3 pt-3 gap-3">
          <div className="d-flex align-items-center gap-3">
            <h5 className="fw-bold text-dark mb-0">Fleet Overview</h5>
            {userRole === 'superadmin' && (
              <div style={{ width: '250px' }}>
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
          {(canScrollLeft || canScrollRight) && (
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px', padding: 0 }}
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                title="Scroll left"
              >
                <IoIosArrowBack size={18} />
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px', padding: 0 }}
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                title="Scroll right"
              >
                <IoIosArrowForward size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="position-relative w-100 px-3 pb-3 pt-1">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="btn btn-light shadow border rounded-circle d-flex align-items-center justify-content-center"
              style={{
                position: 'absolute',
                top: '50%',
                left: '8px',
                transform: 'translateY(-50%)',
                width: '36px',
                height: '36px',
                zIndex: 10,
                padding: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
              }}
              title="Scroll left"
              aria-label="Scroll left"
            >
              <IoIosArrowBack size={20} />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            id="dashboard-scroll"
            className={`dashboard-scroll-container ${!isSidebarOpen ? 'sidebar-closed' : ''}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            style={{ cursor: isDraggingRef.current ? 'grabbing' : 'grab' }}
          >
            {cards.map((card, idx) => (
              <div className="dashboard-card-wrapper" key={idx}>
                <CCard
                  className="hover-card shadow-sm h-100"
                  style={{ cursor: 'pointer', ...card.borders, '--hover-shadow': card.shadow }}
                  onClick={() => {
                    if (dragDistanceRef.current < 5) {
                      card.onClick()
                    }
                  }}
                >
                  <CCardBody className="p-2 d-flex align-items-center">
                    <div className="me-2 flex-shrink-0">
                      {card.icon}
                    </div>
                    <div className="card-details overflow-hidden">
                      <div className="card-label">{card.label}</div>
                      <div className="card-subtext">{card.subtext}</div>
                      <div className="card-count">{card.count}</div>
                    </div>
                  </CCardBody>
                </CCard>
              </div>
            ))}
          </div>

          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="btn btn-light shadow border rounded-circle d-flex align-items-center justify-content-center"
              style={{
                position: 'absolute',
                top: '50%',
                right: '8px',
                transform: 'translateY(-50%)',
                width: '36px',
                height: '36px',
                zIndex: 10,
                padding: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
              }}
              title="Scroll right"
              aria-label="Scroll right"
            >
              <IoIosArrowForward size={20} />
            </button>
          )}
        </div>
      </CCard>

      {/* trips table */}

      <CContainer className="px-2 dashboard-main-container pb-3" fluid>
        <div className="row h-100">
          {splitView !== 'analytics' && (
            <div className={`position-relative dashboard-main-col ${splitView === 'table' ? "col-12" : "col-12 col-xl-7"}`}>
              {/* Expand Handle */}
              {splitView === 'both' && (
                <button
                  className="btn btn-sm rounded-circle shadow d-none d-xl-flex align-items-center justify-content-center side-handle-btn"
                  style={{
                    position: 'absolute', top: 'calc(50% + 18px)', right: '-15px', transform: 'translateY(-50%)',
                    zIndex: 10, width: '32px', height: '32px'
                  }}
                  onClick={() => setSplitView('table')}
                  title="Expand Table"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-right"><path d="m6 17 5-5-5-5"></path><path d="m13 17 5-5-5-5"></path></svg>
                </button>
              )}
              {splitView === 'table' && (
                <button
                  className="btn btn-sm rounded-circle shadow d-flex align-items-center justify-content-center side-handle-btn"
                  style={{
                    position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)',
                    zIndex: 10, width: '32px', height: '32px'
                  }}
                  onClick={() => setSplitView('both')}
                  title="Collapse Table"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-left"><path d="m11 17-5-5 5-5"></path><path d="m18 17-5-5 5-5"></path></svg>
                </button>
              )}

              <Table
                title={
                  <div className="d-flex w-100 flex-column flex-xl-row justify-content-between align-items-xl-center gap-3 pe-4">
                    <div className="d-flex align-items-center gap-2">
                      <select 
                        className="form-select form-select-sm shadow-sm bg-light"
                        style={{ width: '160px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.05rem', border: '1px solid #ccc' }}
                        value={tableMode}
                        onChange={(e) => {
                          setTableMode(e.target.value)
                          setCurrentPage(1)
                        }}
                      >
                        <option value="Trip">Trips Details</option>
                        <option value="Daily Trip Logs">Daily Trip Logs</option>
                      </select>
                    </div>
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                      <DateRangeFilterCredence
                        title="Date Range"
                        onDateRangeChange={handleDateRangeChange}
                      />
                      <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
                    </div>
                  </div>
                }
                columns={columns}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                isFetching={tableMode === 'Trip' ? isFetching : isFetchingDailyLogs}
                onViewReport={() => handleViewDetailedReport()}
                serverPagination={tableMode === 'Daily Trip Logs'}
                totalServerItems={tableMode === 'Daily Trip Logs' ? totalDailyTripLogs : filteredData.length}
              />
            </div>
          )}

          {splitView !== 'table' && (
            <div className={`position-relative dashboard-main-col ${splitView === 'analytics' ? "col-12" : "col-12 col-xl-5"}`}>
              {/* Expand Handle */}
              {splitView === 'both' && (
                <button
                  className="btn btn-sm rounded-circle shadow d-none d-xl-flex align-items-center justify-content-center side-handle-btn"
                  style={{
                    position: 'absolute', top: 'calc(50% - 18px)', left: '-15px', transform: 'translateY(-50%)',
                    zIndex: 10, width: '32px', height: '32px'
                  }}
                  onClick={() => setSplitView('analytics')}
                  title="Expand Analytics"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-left"><path d="m11 17-5-5 5-5"></path><path d="m18 17-5-5 5-5"></path></svg>
                </button>
              )}
              {splitView === 'analytics' && (
                <button
                  className="btn btn-sm rounded-circle shadow d-flex align-items-center justify-content-center side-handle-btn"
                  style={{
                    position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)',
                    zIndex: 10, width: '32px', height: '32px'
                  }}
                  onClick={() => setSplitView('both')}
                  title="Collapse Analytics"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-right"><path d="m6 17 5-5-5-5"></path><path d="m13 17 5-5-5-5"></path></svg>
                </button>
              )}

              <CCard className="mb-4 shadow-sm border-0 h-100">
                <CCardHeader className="bg-white border-0 pt-3 px-4">
                  <strong>Fleet Analytics</strong>
                </CCardHeader>
                <CCardBody className="px-4 pb-4 d-flex flex-column justify-content-center">
                  <FleetAnalyticsChart data={dashboardData} tripsData={TripsList} dailyTripsData={dailyTripsAnalyticsList} />
                </CCardBody>
              </CCard>
            </div>
          )}
        </div>
      </CContainer>
    </div>
  ) : null
}

export default Dashboard