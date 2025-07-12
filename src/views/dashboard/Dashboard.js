import React, { useState, useContext, useEffect } from 'react';
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
} from '@coreui/react';
import {
  IoPersonSharp,
  IoSettingsSharp,
  IoAlertCircle,
} from 'react-icons/io5';
import { FaTruckMoving, FaMapLocationDot, FaHandshakeSimple } from 'react-icons/fa6';
import { TbTruckDelivery } from 'react-icons/tb';
import { RiMoneyRupeeCircleFill } from 'react-icons/ri';
import { TokenContext } from '../../context/TokenContext';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from './data/data';
import SingleSelectDropdown from '../components/SingleSelectDropdown';
import { jwtDecode } from 'jwt-decode';
import { fetchSupervisor } from '../DriverExpert/data/drivers';
import { getTripListApi } from '../Supervisor/data/data';
import { getStatusBadge } from '../Supervisor/trip/componets/tripHelpers';
import Table from '../components/Table';
import SearchInput from '../components/SearchInput';
import DateRangeFilterCredence from '../../components/DateRangeFilterCredence'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const token = useContext(TokenContext);
  const navigate = useNavigate()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })
  const [hasValidToken, setHasValidToken] = useState(false);

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
  });

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  // Fetch Trip Data
  const {
    data: TripsList = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['TripsList'],
    queryFn: getTripListApi,
    staleTime: 1000 * 60 * 30,
  })


  // Watch the token and decode it when ready
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setHasValidToken(true); // Token is present and not expired
        } else {
          setHasValidToken(false); // Expired or invalid
        }
      } catch (err) {
        setHasValidToken(false); // Decoding failed
      }
    }
  }, [token]);


  // Use fetched data if available, otherwise fallback to static values
  const dashboardData = data?.data || {};
  const metadata = data?.metadata || {}

  useEffect(() => {
    let filtered = TripsList

    // Filter by supervisor if selected
    if (selectedName?.value) {
      filtered = filtered.filter((trip) => trip.supervisorId === selectedName.value)
    }

    // Filter by date range if available
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.orginalDate)
        return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
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

    // Apply remaining amount calculation and status badge styling
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
    navigate('/DriverExp')
  }

  //handle navigate vehicle
  const handleViewVehicles = () => {
    navigate('/Vehicle')
  }

  //handle navigate servicelogs
  const handleViewServicelog = () => {
    navigate('/AllVehicleServicesData')
  }

  //handle navigate Expenses
  const handleExpenses = () => {
    navigate('/VehicleExpensesBill')
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
  const handleRoadside = () => {
    navigate('/ServiceCall')
  }


  useEffect(() => {
    if (token) {
      console.log('token', token);
    }
  }, [token]);

  return token ? (
    <>
      <style>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 16px;
        }
        .hover-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
        }
        .dashboard-icon { font-size: 26px; color: #000; }
        .card-label { font-weight: 600; font-size: 16px; }
        .card-count { font-size: 17px; font-weight: 600; }
        .card-subtext { font-size: 14px; color: #6c757d; }

        .table-modern {
          border-radius: 10px;
          overflow: hidden;
          border-collapse: separate;
          border-spacing: 0;
          background-color: #fff;
          box-shadow: 0 3px 10px rgba(0,0,0,0.05);
          font-size: 15px;
        }

        .table-modern thead {
          background-color: #f8f9fa;
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: 0.03em;
        }

        .table-modern th,
        .table-modern td {
          padding: 14px 16px;
          vertical-align: middle;
          border-bottom: 1px solid #e9ecef;
        }

        .table-modern tbody tr:nth-child(odd) {
          background-color: #fcfcfc;
        }

        .table-modern tbody tr:hover {
          background-color: #f0f2f5;
          transition: background-color 0.2s ease-in-out;
        }

        .badge {
          font-size: 13px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 20px;
          display: inline-block;
          text-align: center;
        }

        .badge.bg-success {
          background-color: #198754;
          color: white;
        }

        .badge.bg-warning {
          background-color: #ffc107;
          color: #212529;
        }

        .table-modern .small.text-muted {
          font-size: 12px;
          color: #6c757d;
        }
      `}</style>

      <CCard className="mb-4 shadow-sm border-0 bg-white">
        <CCardBody className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between p-4">
          {/* Left side: icon and title */}
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '44px', height: '40px' }}>
              <FaTruckMoving size={20} />
            </div>
            <div>
              <h4 className="mb-1 fw-bold text-dark">Fleets Management Systems</h4>
              <div className="text-muted small">Track, maintain, and manage your entire fleet in real-time</div>
            </div>
          </div>

          {/* Right side: dropdown */}
          {userRole === 'superadmin' && (
            <div style={{ width: '320px' }}>
              <SingleSelectDropdown
                options={supervisorOptions}
                value={selectedName}
                onChange={setSelectedName}
                isClearable
                placeholder="Filter by Supervisor Name..."
              />
            </div>
          )}
        </CCardBody>
      </CCard>

      <CCardGroup className="mb-4">
        <CRow className="g-4">
          {[
            {
              label: 'Drivers',
              icon: <IoPersonSharp className="dashboard-icon" />,
              top: `Available: ${dashboardData?.availableDrivers} | Unavailable: ${dashboardData?.unavailableDrivers}`,
              bottom: `Total: ${dashboardData?.totalDrivers} (${((dashboardData?.availableDrivers / dashboardData?.totalDrivers) * 100).toFixed(0)}% Active)`,
              color: 'text-success',
              onClick: () => handleViewDrives('Drivers'),
            },
            {
              label: 'Vehicles',
              icon: <FaTruckMoving className="dashboard-icon" />,
              top: `Available: ${dashboardData?.availableVehicles} | Unavailable: ${dashboardData?.unavailableVehicles}`,
              bottom: `Total: ${dashboardData?.totalVehicles} (${Math.floor((dashboardData?.availableVehicles / dashboardData?.totalVehicles) * 100)}% Running)`,
              color: 'text-success',
              onClick: () => handleViewVehicles('Vehicles'),
            },
            {
              label: 'Maintenance',
              icon: <IoSettingsSharp className="dashboard-icon" />,
              top: `Good: ${(dashboardData?.totalVehicles ?? 0) - (dashboardData?.vehiclesUnderMaintenance ?? 0)} | Need Services: ${dashboardData?.vehiclesUnderMaintenance ?? 0}`,
              bottom: (() => {
                const total = dashboardData?.totalVehicles ?? 0;
                const under = dashboardData?.vehiclesUnderMaintenance ?? 0;
                const good = total - under;
                const totalChecked = total;
                const healthyPercent = totalChecked ? Math.floor((good / totalChecked) * 100) : 0;
                return `Total Checked: ${totalChecked} (${healthyPercent}% Healthy)`;
              })(),
              color: 'text-success',
              onClick: () => handleViewServicelog('Maintenance'),
            },
            {
              label: 'Expenses',
              icon: <RiMoneyRupeeCircleFill className="dashboard-icon" />,
              top: `Today Expenses: ₹${dashboardData?.expenses?.total.toLocaleString()}`,
              bottom: 'Fleet Expenses',
              color: 'text-primary',
              onClick: () => handleExpenses('Expenses'),
            },
            {
              label: 'Live on Work',
              icon: <TbTruckDelivery className="dashboard-icon" />,
              top: `On Duty: ${dashboardData?.driversLiveOnWork}`,
              bottom: `Total Marked: ${dashboardData?.totalDrivers}`,
              color: 'text-primary',
              onClick: () => handleDriveStatus('Live on Work'),
            },
            {
              label: 'Document Alert',
              icon: <IoAlertCircle className="dashboard-icon" />,
              top: `Expiring: ${dashboardData?.documentAlerts}`,
              bottom: 'Expiring Soon',
              color: 'text-danger',
              onClick: () => handleDocExp('Insurance Alert'),
            },
            {
              label: 'Driver Locations',
              icon: <FaMapLocationDot className="dashboard-icon" />,
              top: `${dashboardData?.driverLocations} Locations`,
              bottom: 'Driver Today Attendances',
              color: 'text-info',
              onClick: () => handleDriverLoc('Driver Attendance Location'),
            },
            {
              label: 'Roadside Assistance',
              icon: <FaHandshakeSimple className="dashboard-icon" />,
              top: `Used: 5`,
              bottom: 'Service Calls',
              color: 'text-primary',
              onClick: () => handleRoadside('Roadside Assistance'),
            },
          ].map((card, idx) => (
            <CCol key={idx} xs="12" sm="6" lg="3">
              <CCard className="hover-card shadow-sm border-0" onClick={card.onClick}>
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    {card.icon}
                    <span className="card-label">{card.label}</span>
                  </div>
                  <div className={`card-count ${card.color}`}>{card.top}</div>
                  <div className="card-subtext">{card.bottom}</div>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      </CCardGroup>

      <br />

      <CCard className="mb-3 shadow-sm border-0" >
        <CCardBody className="p-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">

            {/* Heading */}
            <h5 className="mb-3 mb-md-0 fw-bold text-dark">Trips Details</h5>

            {/* Filters */}
            <div className="d-flex justify-content-end align-items-center gap-3 w-75">
              <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
              <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
            </div>

          </div>
        </CCardBody>
      </CCard>

      <CContainer className="px-2" fluid>
        <Table
          title="All Vehicles Trips"
          columns={columns}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          isFetching={isFetching}
        />

        <div className="text-end mb-4">
          <button
            onClick={() => handleViewDetailedReport()}
            className="rounded ps-3 pe-3 btn btn-outline-primary custom-hover"
          >
            View Detailed Report
          </button>
        </div>
      </CContainer>

    </>
  ) : null;
};

export default Dashboard;