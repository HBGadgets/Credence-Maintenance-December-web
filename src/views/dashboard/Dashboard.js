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
import { fetchAllAdmin, fetchDashboardData, getAllTripListApi } from './data/data';
import SingleSelectDropdown from '../components/SingleSelectDropdown';
import { jwtDecode } from 'jwt-decode';
import { getStatusBadge } from '../Supervisor/trip/componets/tripHelpers';
import Table from '../components/Table';
import SearchInput from '../components/SearchInput';
import DateRangeFilterCredence from '../../components/DateRangeFilterCredence'
import { useNavigate } from 'react-router-dom';
import logo from 'src/assets/brand/fms.jpg'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Dashboard = () => {
  const token = useContext(TokenContext);
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
  });

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchAllAdmin,
    staleTime: 1000 * 60 * 10,
  })

  // Fetch Trip Data
  const {
    data: TripsList = [],
    isFetching,
  } = useQuery({
    queryKey: ['TripsList', token],
    queryFn: getAllTripListApi,
    staleTime: 1000 * 60 * 30,
    enabled: !!token && !!decodedToken,
  });


  // Use fetched data if available, otherwise fallback to static values
  const dashboardData = data?.data || {};
  const metadata = data?.metadata || {}

  useEffect(() => {
    if (token) {
      console.log('token', token);
    }
  }, [token]);


  useEffect(() => {
    if (!TripsList || TripsList.length === 0) return;

    let filtered = TripsList;

    // Filter by supervisor if selected
    if (selectedName?.value) {
      filtered = filtered.filter((trip) => trip.supervisorId === selectedName.value);
    }

    // Filter by date range if available
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.orginalDate);
        return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate);
      });
    }

    // Apply search query filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery)
        )
      );
    }

    // Add calculated fields
    const styledData = filtered.map((data) => {
      const budgetAllocated = Number(data.budgetAllocated) || 0;
      const subTripBudgetAllocated = Number(data.subTripBudgetAllocated) || 0;
      const spentAmount = Number(data.spentAmount) || 0;
      const remaining = budgetAllocated + subTripBudgetAllocated - spentAmount;

      return {
        ...data,
        remainingAmount: (
          <span style={{ color: remaining < 0 ? 'red' : 'inherit' }}>{remaining.toFixed(2)}</span>
        ),
        status: <span className={getStatusBadge(data.status)}>{data.status}</span>,
      };
    });

    setFilteredData(styledData);
  }, [TripsList, selectedName, searchQuery, dateRange]);



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

  // cards container

  const [isStatic, setIsStatic] = useState(false);


  const scrollContainer = (direction) => {
    const container = document.getElementById('dashboard-scroll');
    const scrollAmount = 300;
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };


  // cards details

  const cards = [
    {
      label: 'Drivers',
      icon: <IoPersonSharp className="dashboard-icon" />,
      top: (
        <>
          Available: {dashboardData?.availableDrivers} |{' '}
          <span className="text-danger">
            Unavailable: {dashboardData?.unavailableDrivers}
          </span>
        </>
      ),
      bottom: `Total: ${dashboardData?.totalDrivers} (${((dashboardData?.availableDrivers / dashboardData?.totalDrivers) * 100).toFixed(0)}% Active)`,
      color: 'text-success',
      onClick: () => handleViewDrives('Drivers'),
    },
    {
      label: 'Vehicles',
      icon: <FaTruckMoving className="dashboard-icon" />,
      top: (
        <>
          Available: {dashboardData?.availableVehicles} |{' '}
          <span className="text-danger">
            Unavailable: {dashboardData?.unavailableVehicles}
          </span>
        </>
      ),
      bottom: `Total: ${dashboardData?.totalVehicles} (${Math.floor((dashboardData?.availableVehicles / dashboardData?.totalVehicles) * 100)}% Running)`,
      color: 'text-success',
      onClick: () => handleViewVehicles('Vehicles'),
    },
    {
      label: 'Maintenance',
      icon: <IoSettingsSharp className="dashboard-icon" />,
      top: (
        <>
          Good: {(dashboardData?.totalVehicles ?? 0) - (dashboardData?.vehiclesUnderMaintenance ?? 0)} |{' '}
          <span className="text-danger">
            Need Services: {dashboardData?.vehiclesUnderMaintenance ?? 0}
          </span>
        </>
      ),

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
      top: `Locations : ${dashboardData?.driverLocations}`,
      bottom: 'Driver Today Attendances',
      color: 'text-primary',
      onClick: () => handleDriverLoc('Driver Attendance Location'),
    },
    {
      label: 'Roadside Assistance',
      icon: <FaHandshakeSimple className="dashboard-icon" />,
      top: `Used: 0`,
      bottom: 'Service Calls',
      color: 'text-primary',
      onClick: () => handleRoadside('Roadside Assistance'),
    },
  ];


  // useeffect for scrolling card
  useEffect(() => {
    let interval;
    const scrollAmount = 300;

    const setupAutoScroll = () => {
      const container = document.getElementById('dashboard-scroll');
      if (!container) return;

      const autoScroll = () => {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft + 5 >= maxScrollLeft) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      };

      // Start scrolling
      interval = setInterval(autoScroll, 5000);

      // Pause on hover
      container.addEventListener('mouseenter', pauseScroll);
      container.addEventListener('mouseleave', resumeScroll);
    };

    const pauseScroll = () => clearInterval(interval);

    const resumeScroll = () => {
      interval = setInterval(() => {
        const container = document.getElementById('dashboard-scroll');
        if (!container) return;

        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft + 5 >= maxScrollLeft) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }, 5000);
    };

    const waitForElementAndStart = () => {
      const check = setInterval(() => {
        const container = document.getElementById('dashboard-scroll');
        if (container) {
          clearInterval(check);
          setupAutoScroll();
        }
      }, 100);
    };

    waitForElementAndStart();

    return () => {
      clearInterval(interval);
      const container = document.getElementById('dashboard-scroll');
      if (container) {
        container.removeEventListener('mouseenter', pauseScroll);
        container.removeEventListener('mouseleave', resumeScroll);
      }
    };
  }, []);






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

.dashboard-icon {
  font-size: 26px;
  color: #000;
}

.card-label {
  font-weight: 600;
  font-size: 16px;
}

.card-count {
  font-size: 17px;
  font-weight: 600;
}

.card-subtext {
  font-size: 14px;
  color: #6c757d;
}

.dashboard-scroll-container {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0 1rem 1rem 1rem;
  gap: 1rem;
}

.dashboard-scroll-container::-webkit-scrollbar {
  display: none;
}

.dashboard-scroll-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Static mode — grid layout */
.dashboard-scroll-container.static-mode {
  overflow-x: hidden !important;
  flex-wrap: wrap;
  justify-content: flex-start;
}

/* Responsive card width */
.dashboard-card-wrapper {
  flex: 0 0 calc(25% - 1rem);
  max-width: calc(25% - 1rem);
}

@media (max-width: 1200px) {
  .dashboard-card-wrapper {
    flex: 0 0 calc(33.333% - 1rem);
    max-width: calc(33.333% - 1rem);
  }
}

@media (max-width: 992px) {
  .dashboard-card-wrapper {
    flex: 0 0 calc(50% - 1rem);
    max-width: calc(50% - 1rem);
  }
}

@media (max-width: 576px) {
  .dashboard-card-wrapper {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

/* Button improvements */
.scroll-buttons .btn {
  min-width: 34px;
  height: 34px;
  font-size: 14px;
  padding: 0;
  line-height: 1;
}



      `}</style>

      <CCard className="mb-4 shadow-sm border-0 bg-white">
        <CCardBody className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between p-4">
          {/* Left side: icon and title */}
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px', overflow: 'hidden' }}>
              <img
                src={logo}
                alt="Fleet Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
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

      {/*  cards */}

      <CCard className="mb-4 border-0 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3 px-3">
          <h5 className="fw-bold text-dark">Fleet Overview</h5>
          <div className="scroll-buttons d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-primary rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              style={{ width: '34px', height: '34px' }}
              onClick={() => scrollContainer('left')}
            >
              <IoIosArrowBack />
            </button>
            <button
              className="btn btn-sm btn-outline-primary rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              style={{ width: '34px', height: '34px' }}
              onClick={() => scrollContainer('right')}
            >
              <IoIosArrowForward />
            </button>
            <button
              className="btn btn-sm btn-primary d-flex align-items-center justify-content-center"
              style={{ height: '34px', padding: '0 12px', fontSize: '14px' }}
              onClick={() => setIsStatic((prev) => !prev)}
            >
              {isStatic ? 'Scroll' : 'Expand'}
            </button>

          </div>

        </div>

        <div
          className={`dashboard-scroll-container ${isStatic ? 'static-mode' : ''}`}
          id="dashboard-scroll"
        >
          {cards.map((card, idx) => (
            <div className="dashboard-card-wrapper" key={idx}>
              <CCard className="hover-card shadow-sm border-0 h-100" onClick={card.onClick}>
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    {card.icon}
                    <span className="card-label">{card.label}</span>
                  </div>
                  <div className={`card-count ${card.color}`}>{card.top}</div>
                  <div className="card-subtext">{card.bottom}</div>
                </CCardBody>
              </CCard>
            </div>
          ))}
        </div>
      </CCard>


      {/* trips table */}

      <CCard className="mb-3 shadow-sm border-0">
        <CCardBody className="p-3">
          <div className="row align-items-center gy-3">

            {/* Heading */}
            <div className="col-12 col-md-3">
              <h5 className="fw-bold text-dark mb-0">Trips Details</h5>
            </div>

            {/* Filters */}
            <div className="col-12 col-md-9">
              <div className="d-flex flex-column flex-sm-row justify-content-end align-items-start align-items-sm-center gap-3">
                <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
                <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
              </div>
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