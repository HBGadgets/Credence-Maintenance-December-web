import React, { useState, useContext, useEffect, useMemo } from 'react'
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
import { fetchAllAdmin, fetchDashboardData, getAllTripListApi } from './data/data'
import SingleSelectDropdown from '../components/SingleSelectDropdown'
import { jwtDecode } from 'jwt-decode'
import { getStatusBadge } from '../Supervisor/trip/componets/tripHelpers'
import Table from '../components/Table'
import SearchInput from '../components/SearchInput'
import DateRangeFilterCredence from '../../components/DateRangeFilterCredence'
import { useNavigate } from 'react-router-dom'
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

const FleetAnalyticsChart = ({ data }) => {
  const [filterCategory, setFilterCategory] = useState('All')

  const pieData = useMemo(() => {
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
  }, [filterCategory, data])

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
      {/* Filter Dropdown */}
      <div className="d-flex justify-content-end mb-2 px-2">
        <select
          className="form-select form-select-sm"
          style={{ width: '150px' }}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All Overview</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Drivers">Drivers</option>
          <option value="Documents">Documents</option>
        </select>
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

  const [splitView, setSplitView] = useState('both')
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
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // superadmin role

  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // Fetch dashboard data using React Query
  const { data } = useQuery({
    queryKey: ['dashboardData', token, selectedName?.value],
    queryFn: () => fetchDashboardData(selectedName?.value),
    enabled: !!token,
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchAllAdmin,
    staleTime: 1000 * 60 * 10,
  })

  // Fetch Trip Data
  const { data: TripsList = [], isFetching } = useQuery({
    queryKey: ['TripsList', token],
    queryFn: getAllTripListApi,
    staleTime: 1000 * 60 * 30,
    enabled: !!token && !!decodedToken,
  })

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
    if (!TripsList || TripsList.length === 0) return

    let filtered = TripsList

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
  }, [TripsList, selectedName, searchQuery, dateRange])

  // Table view
  const columns = [
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
    navigate(`/Trip`)
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
      icon: <img src={driversIcon} alt="Drivers" style={{ width: '64px', height: '54px', objectFit: 'contain' }} />,
      subtext: (
        <>
          <span style={{ color: '#28a745', fontSize: '10px' }}>●</span> Avail : {dashboardData?.availableDrivers ?? 0}
          <br />
          <span style={{ color: '#dc3545', fontSize: '10px' }}>●</span> Unavail : {dashboardData?.unavailableDrivers ?? 0}
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
      onClick: () => handleDriveStatus('Drivers Aavailablity'),
    },
    {
      label: 'Vehicles',
      icon: <img src={vehiclesIcon} alt="Vehicles" style={{ width: '64px', height: '54px', objectFit: 'contain' }} />,
      subtext: (
        <>
          <span style={{ color: '#17a2b8', fontSize: '10px' }}>●</span> Avail : {dashboardData?.availableVehicles ?? 0}
          <br />
          <span style={{ color: '#dc3545', fontSize: '10px' }}>●</span> Unavail : {dashboardData?.unavailableVehicles ?? 0}
          <span style={{ color: '#17a2b8', fontSize: '10px' }}>●</span> Avail : {dashboardData?.availableVehicles ?? 0}
          <br />
          <span style={{ color: '#dc3545', fontSize: '10px' }}>●</span> Unavail : {dashboardData?.unavailableVehicles ?? 0}
        </>
      ),
      count: dashboardData?.totalVehicles ?? 0,
      borders: { border: '2px solid #17a2b8' },
      onClick: () => handleViewVehicles('Vehicles'),
    },
    {
      label: 'Maintenance',
      icon: <img src={maintenanceIcon} alt="Maintenance" style={{ width: '64px', height: '54px', objectFit: 'contain' }} />,
      subtext: (
        <>
          <span style={{ color: '#28a745', fontSize: '10px' }}>●</span> Healthy: {(dashboardData?.totalVehicles ?? 0) - (dashboardData?.vehiclesUnderMaintenance ?? 0)}
          <br />
          <span style={{ color: '#dc3545', fontSize: '10px' }}>●</span> Alert: {dashboardData?.vehiclesUnderMaintenance ?? 0}
          <span style={{ color: '#28a745', fontSize: '10px' }}>●</span> Healthy: {(dashboardData?.totalVehicles ?? 0) - (dashboardData?.vehiclesUnderMaintenance ?? 0)}
          <br />
          <span style={{ color: '#dc3545', fontSize: '10px' }}>●</span> Alert: {dashboardData?.vehiclesUnderMaintenance ?? 0}
        </>
      ),
      count: dashboardData?.totalVehicles ?? 0,
      borders: { border: '2px solid #2b5c8c' },
      onClick: () => handleViewServicelog('Maintenance'),
    },
    {
      label: 'Attendance',
      icon: <img src={attendanceIcon} alt="Attendance" style={{ width: '64px', height: '54px', objectFit: 'contain' }} />,
      subtext: (
        <>
          <span style={{ color: '#4b2c82', fontSize: '10px' }}>●</span> Present: {dashboardData?.driverLocations ?? 0}
        </>
      ),
      count: dashboardData?.driverLocations ?? 0,
      borders: { border: '2px solid #4b2c82' },
      onClick: () => handleDriverLoc('Driver Attendance Location'),
    },
    {
      label: 'Expenses',
      icon: <img src={expenseIcon} alt="Expenses" style={{ width: '64px', height: '54px', objectFit: 'contain' }} />,
      subtext: (
        <>
          <span style={{ color: '#fd7e14', fontSize: '10px' }}>●</span> Today: ₹{dashboardData?.expenses?.total?.toLocaleString() ?? 0}
        </>
      ),
      count: dashboardData?.expenses?.total >= 1000
        ? `₹${(dashboardData.expenses.total / 1000).toFixed(1)}K`
        : `₹${dashboardData?.expenses?.total ?? 0}`,
      borders: { border: '2px solid #fd7e14' },
      onClick: () => handleExpenses('Expenses'),
    },
    {
      label: 'Live on Work',
      icon: <img src={liveOnWorkIcon} alt="Live on Work" style={{ width: '64px', height: '54px', objectFit: 'contain' }} />,
      subtext: (
        <>
          <span style={{ color: '#008080', fontSize: '10px' }}>●</span> On Duty: {dashboardData?.driversLiveOnWork ?? 0}
          <br />
          <span style={{ color: '#6c757d', fontSize: '10px' }}>●</span> Total: {dashboardData?.totalDrivers ?? 0}
        </>
      ),
      count: dashboardData?.driversLiveOnWork ?? 0,
      borders: { border: '2px solid #008080' },
      onClick: () => handleViewDrives('Live on Work'),
    },
    {
      label: 'Document Alert',
      icon: <img src={documentAlertIcon} alt="Document Alert" style={{ width: '64px', height: '54px', objectFit: 'contain' }} />,
      subtext: (
        <>
          <span style={{ color: '#dc3545', fontSize: '10px' }}>●</span> Expiring Soon
        </>
      ),
      count: dashboardData?.documentAlerts ?? 0,
      borders: { border: '2px solid #dc3545' },
      onClick: () => handleDocExp('Insurance Alert'),
    },
    {
      label: 'Transport Receipt',
      icon: <img src={transportReceiptIcon} alt="Transport Receipt" style={{ width: '64px', height: '54px', objectFit: 'contain' }} />,
      subtext: (
        <>
          <span style={{ color: '#0d6efd', fontSize: '10px' }}>●</span> Today Pass: {dashboardData?.todayGodownLorryReceiptCount || '0'}
        </>
      ),
      count: dashboardData?.totalGodownLorryReceiptCount || '0',
      borders: { border: '2px solid #0d6efd' },
      onClick: () => handleTP('Transport Receipt'),
    },
  ]




  return token ? (
    <>
      <style>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 12px;
          background-color: #fff;
        }
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 12px;
          background-color: #fff;
        }

        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
        }

        .card-label {
          font-weight: 700;
          font-size: 13px;
          color: #1a1a1a;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-count {
          font-size: 20px;
          font-weight: 800;
          color: #000;
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
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
          flex-wrap: wrap;
          padding: 0.5rem 1rem 1.5rem 1rem;
          gap: 1rem;
        }
        .dashboard-scroll-container {
          display: flex;
          flex-wrap: wrap;
          padding: 0.5rem 1rem 1.5rem 1rem;
          gap: 1rem;
        }

        /* Responsive card width: 8 cards per row on large screens */
        .dashboard-card-wrapper {
          flex: 0 0 calc(12.5% - 0.875rem);
          max-width: calc(12.5% - 0.875rem);
          min-width: 130px;
        }

        @media (max-width: 1400px) {
          .dashboard-card-wrapper {
            flex: 0 0 calc(16.666% - 0.85rem);
            max-width: calc(16.666% - 0.85rem);
          }
        }
        /* Responsive card width: 8 cards per row on large screens */
        .dashboard-card-wrapper {
          flex: 0 0 calc(12.5% - 0.875rem);
          max-width: calc(12.5% - 0.875rem);
          min-width: 130px;
        }

        @media (max-width: 1400px) {
          .dashboard-card-wrapper {
            flex: 0 0 calc(16.666% - 0.85rem);
            max-width: calc(16.666% - 0.85rem);
          }
        }

        @media (max-width: 1200px) {
          .dashboard-card-wrapper {
            flex: 0 0 calc(20% - 0.8rem);
            max-width: calc(20% - 0.8rem);
          }
        }
        @media (max-width: 1200px) {
          .dashboard-card-wrapper {
            flex: 0 0 calc(20% - 0.8rem);
            max-width: calc(20% - 0.8rem);
          }
        }

        @media (max-width: 992px) {
          .dashboard-card-wrapper {
            flex: 0 0 calc(25% - 0.75rem);
            max-width: calc(25% - 0.75rem);
          }
        }

        @media (max-width: 768px) {
          .dashboard-card-wrapper {
            flex: 0 0 calc(33.333% - 0.66rem);
            max-width: calc(33.333% - 0.66rem);
          }
        }
        @media (max-width: 992px) {
          .dashboard-card-wrapper {
            flex: 0 0 calc(25% - 0.75rem);
            max-width: calc(25% - 0.75rem);
          }
        }

        @media (max-width: 768px) {
          .dashboard-card-wrapper {
            flex: 0 0 calc(33.333% - 0.66rem);
            max-width: calc(33.333% - 0.66rem);
          }
        }

        @media (max-width: 576px) {
          .dashboard-card-wrapper {
            flex: 0 0 calc(50% - 0.5rem);
            max-width: calc(50% - 0.5rem);
          }
        }

        /* Auto-adjusting full screen layout for Table and Analytics */
        @media (min-width: 1200px) {
          .dashboard-main-container {
             height: calc(100vh - 280px);
             min-height: 450px;
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
        @media (max-width: 576px) {
          .dashboard-card-wrapper {
            flex: 0 0 calc(50% - 0.5rem);
            max-width: calc(50% - 0.5rem);
          }
        }

        /* Auto-adjusting full screen layout for Table and Analytics */
        @media (min-width: 1200px) {
          .dashboard-main-container {
             height: calc(100vh - 280px);
             min-height: 450px;
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
        </div>

        <div
          className="dashboard-scroll-container"
          className="dashboard-scroll-container"
          id="dashboard-scroll"
        >
          {cards.map((card, idx) => (
            <div className="dashboard-card-wrapper" key={idx}>
              <CCard
                className="hover-card shadow-sm h-100"
                style={{ cursor: 'pointer', ...card.borders }}
                onClick={card.onClick}
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
                    <h5 className="fw-bold text-dark mb-0">Trips Details</h5>
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
                isFetching={isFetching}
                onViewReport={() => handleViewDetailedReport()}
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
                  <FleetAnalyticsChart data={dashboardData} />
                </CCardBody>
              </CCard>
            </div>
          )}
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
                    <h5 className="fw-bold text-dark mb-0">Trips Details</h5>
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
                isFetching={isFetching}
                onViewReport={() => handleViewDetailedReport()}
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
                  <FleetAnalyticsChart data={dashboardData} />
                </CCardBody>
              </CCard>
            </div>
          )}
        </div>
      </CContainer>
    </>
  ) : null
}

export default Dashboard
