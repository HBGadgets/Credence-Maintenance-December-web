import React, { useState, useContext, useEffect } from 'react';
import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCardHeader,
  CCol,
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
const Dashboard = () => {
  const token = useContext(TokenContext);

  // Static values as per original code
  const activeDrivers = 12;
  const inactiveDrivers = 3;
  const presentDrivers = 10;
  const absentDrivers = 5;
  const activeVehicles = 8;
  const inactiveVehicles = 2;
  const totalExpenses = 15340;
  const underMaintenanceVehicles = 2;
  const goodConditionVehicles = 6;
  const driverLocation = 8;
  const roadSide = 5;

  const expiringInsurances = [
    { name: 'Vehicle A', insuranceExpiryDate: '2024-12-30' },
    { name: 'Vehicle B', insuranceExpiryDate: '2025-01-15' },
  ];

  // Fetch dashboard data using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData', token],
    queryFn: () => fetchDashboardData(),// give supervisor id here
    enabled: !!token,
  });

  // Use fetched data if available, otherwise fallback to static values
  const dashboardData = data?.data || {};
const metadata = data?.metadata || {}
console.log("metadata", metadata);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const openModal = (cardName) => {
    setModalContent(cardName);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent('');
  };

  const tableData = [
    {
      driver: { name: 'Dove Lara' },
      vehicle: { model: 'Toyota Camry', plate: 'ABC-123' },
      route: 'Nagpur → Bhopal',
      date: 'Mar 15, 2024',
      duration: '6 hours',
      totalExpense: 450,
      expenses: { driver: 150, vehicle: 300 },
      status: 'Active',
    },
    {
      driver: { name: 'Jane Dom' },
      vehicle: { model: 'Honda Civic', plate: 'XYZ-789' },
      route: 'Raipur → Mumbai',
      date: 'Mar 10, 2024',
      duration: '5 hours',
      totalExpense: 400,
      expenses: { driver: 130, vehicle: 270 },
      status: 'Active',
    },
    {
      driver: { name: 'Stive Smith' },
      vehicle: { model: 'Honda Accord', plate: 'XYZ-887' },
      route: 'Mumbai → Pune',
      date: 'Aug 16, 2024',
      duration: '5 hours',
      totalExpense: 10000,
      expenses: { driver: 2500, vehicle: 3700 },
      status: 'Inactive',
    },
    {
      driver: { name: 'July Kim' },
      vehicle: { model: 'Honda Civic', plate: 'XYZ-789' },
      route: 'Raipur → Mumbai',
      date: 'Mar 10, 2024',
      duration: '5 hours',
      totalExpense: 400,
      expenses: { driver: 130, vehicle: 270 },
      status: 'Active',
    },
    {
      driver: { name: 'Jurry Atnone' },
      vehicle: { model: 'Honda Civic', plate: 'XYZ-789' },
      route: 'Raipur → Mumbai',
      date: 'Mar 10, 2024',
      duration: '5 hours',
      totalExpense: 400,
      expenses: { driver: 130, vehicle: 270 },
      status: 'Inactive',
    },
  ];

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
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '44px', height: '40px' }}>
              <FaTruckMoving size={20} />
            </div>
            <div>
              <h4 className="mb-1 fw-bold text-dark">Fleets Management Systems</h4>
              <div className="text-muted small">Track, maintain, and manage your entire fleet in real-time</div>
            </div>
          </div>
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
              onClick: () => openModal('Drivers'),
            },
            {
              label: 'Vehicles',
              icon: <FaTruckMoving className="dashboard-icon" />,
              top: `Active: ${dashboardData?.availableVehicles} | Inactive: ${dashboardData?.unavailableVehicles}`,
              bottom: `Total: ${dashboardData?.totalVehicles} (${((dashboardData?.availableVehicles / dashboardData?.totalVehicles) * 100).toFixed(0)}% Running)`,
              color: 'text-success',
              onClick: () => openModal('Vehicles'),
            },
            {
              label: 'Maintenance',
              icon: <IoSettingsSharp className="dashboard-icon" />,
              top: `Good: ${dashboardData?.totalVehicles} | Under: ${dashboardData?.vehiclesUnderMaintenance}`,
              // bottom: `Total Checked: ${totalMaintenances} (${((fetchedAvailableVehicles / totalMaintenances) * 100).toFixed(0)}% Healthy)`,
              color: 'text-success',
              onClick: () => openModal('Maintenance'),
            },
            {
              label: 'Expenses',
              icon: <RiMoneyRupeeCircleFill className="dashboard-icon" />,
              top: `₹${dashboardData?.expenses?.total.toLocaleString()}`,
              bottom: 'Fleet Expenses',
              color: 'text-primary',
              onClick: () => openModal('Expenses'),
            },
            {
              label: 'Live on Work',
              icon: <TbTruckDelivery className="dashboard-icon" />,
              top: `On Duty: ${dashboardData?.driversLiveOnWork}`,
              bottom: `Total Marked: ${dashboardData?.totalDrivers}`,
              color: 'text-primary',
              onClick: () => openModal('Live on Work'),
            },
            {
              label: 'Document Alert',
              icon: <IoAlertCircle className="dashboard-icon" />,
              top: `Expiring: ${dashboardData?.documentAlerts}`,
              bottom: 'Expiring Soon',
              color: 'text-danger',
              onClick: () => openModal('Insurance Alert'),
            },
            {
              label: 'Driver Locations',
              icon: <FaMapLocationDot className="dashboard-icon" />,
              top: `${dashboardData?.driverLocations} Tracked`,
              bottom: 'Driver GPS Count',
              color: 'text-info',
              onClick: () => openModal('Driver Attendance Location'),
            },
            {
              label: 'Roadside Assistance',
              icon: <FaHandshakeSimple className="dashboard-icon" />,
              top: `Used: 5`,
              bottom: 'Service Calls',
              color: 'text-primary',
              onClick: () => openModal('Roadside Assistance'),
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

      <CModal visible={modalVisible} onClose={closeModal} size="lg">
        <CModalHeader><h5>{modalContent} Details</h5></CModalHeader>
        <CModalBody>
          <p>{`More details about ${modalContent} will be displayed here.`}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>Close</CButton>
        </CModalFooter>
      </CModal>
      <br />

      <CRow>
        <CCol xs>
          <CCard className="mb-4 shadow-sm">
            <CCardHeader className="fw-bold d-flex justify-content-between align-items-center">
              <span>Recent Trips Overview</span>
              <CButton size="sm" color="dark" variant="ghost">Export Report</CButton>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 table-modern" hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Driver</CTableHeaderCell>
                    <CTableHeaderCell>Vehicle</CTableHeaderCell>
                    <CTableHeaderCell>Route</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Duration</CTableHeaderCell>
                    <CTableHeaderCell>Expenses</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableData.map((trip, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{trip.driver.name}</CTableDataCell>
                      <CTableDataCell>
                        <div>{trip.vehicle.model}</div>
                        <div className="small text-muted">{trip.vehicle.plate}</div>
                      </CTableDataCell>
                      <CTableDataCell>{trip.route}</CTableDataCell>
                      <CTableDataCell>{trip.date}</CTableDataCell>
                      <CTableDataCell>{trip.duration}</CTableDataCell>
                      <CTableDataCell>
                        <div>Total: ₹{trip.totalExpense}</div>
                        <div className="small text-muted">Driver: ₹{trip.expenses.driver}</div>
                        <div className="small text-muted">Vehicle: ₹{trip.expenses.vehicle}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <span className={`badge ${trip.status === 'Active' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {trip.status}
                        </span>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <div className="d-flex justify-content-end mt-3">
                <CButton color="dark" className="px-4 rounded-pill shadow-sm">View More</CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  ) : null;
};

export default Dashboard;