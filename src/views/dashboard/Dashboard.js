// new code 

import React, { useState, useContext } from 'react'
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
} from '@coreui/react'
import {
  IoPersonSharp,
  IoSettingsSharp,
  IoAlertCircle,
} from 'react-icons/io5'
import { FaTruckMoving, FaMapLocationDot, FaHandshakeSimple } from 'react-icons/fa6'
import { TbTruckDelivery } from 'react-icons/tb'
import { RiMoneyRupeeCircleFill } from 'react-icons/ri'
import { TokenContext } from '../../context/TokenContext'

const Dashboard = () => {
  const token = useContext(TokenContext)

  const activeDrivers = 12
  const inactiveDrivers = 3
  const presentDrivers = 10
  const absentDrivers = 5
  const activeVehicles = 8
  const inactiveVehicles = 2
  const totalExpenses = 15340
  const underMaintenanceVehicles = 2
  const goodConditionVehicles = 6
  const driverLocation = 8
  const roadSide = 5

  const expiringInsurances = [
    { name: 'Vehicle A', insuranceExpiryDate: '2024-12-30' },
    { name: 'Vehicle B', insuranceExpiryDate: '2025-01-15' },
  ]

  const expiringInsuranceCount = expiringInsurances.length
  const totalDrivers = activeDrivers + inactiveDrivers
  const totalVehicles = activeVehicles + inactiveVehicles
  const totalMaintenances = goodConditionVehicles + underMaintenanceVehicles
  const totalAttendance = presentDrivers + absentDrivers

  const [modalVisible, setModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState('')

  const openModal = (cardName) => {
    setModalContent(cardName)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setModalContent('')
  }

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
  ]

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

      <h3>Fleets Management Systems </h3>
      <br />

      <CCardGroup className="mb-4">
        <CRow className="g-4">
          {[
            {
              label: 'Drivers',
              icon: <IoPersonSharp className="dashboard-icon" />,
              top: `Active: ${activeDrivers} | Absent: ${absentDrivers}`,
              bottom: `Total: ${totalDrivers} (${((activeDrivers / totalDrivers) * 100).toFixed(0)}% Active)`,
              color: 'text-success',
              onClick: () => openModal('Drivers'),
            },
            {
              label: 'Vehicles',
              icon: <FaTruckMoving className="dashboard-icon" />,
              top: `Active: ${activeVehicles} | Inactive: ${inactiveVehicles}`,
              bottom: `Total: ${totalVehicles} (${((activeVehicles / totalVehicles) * 100).toFixed(0)}% Running)`,
              color: 'text-success',
              onClick: () => openModal('Vehicles'),
            },
            {
              label: 'Maintenance',
              icon: <IoSettingsSharp className="dashboard-icon" />,
              top: `Good: ${goodConditionVehicles} | Under: ${underMaintenanceVehicles}`,
              bottom: `Total Checked: ${totalMaintenances} (${((goodConditionVehicles / totalMaintenances) * 100).toFixed(0)}% Healthy)`,
              color: 'text-success',
              onClick: () => openModal('Maintenance'),
            },
            {
              label: 'Expenses',
              icon: <RiMoneyRupeeCircleFill className="dashboard-icon" />,
              top: `₹${totalExpenses.toLocaleString()}`,
              bottom: 'Fleet Expenses',
              color: 'text-primary',
              onClick: () => openModal('Expenses'),
            },
            {
              label: 'Live on Work',
              icon: <TbTruckDelivery className="dashboard-icon" />,
              top: `On Duty: ${presentDrivers}`,
              bottom: `Total Marked: ${totalAttendance}`,
              color: 'text-primary',
              onClick: () => openModal('Live on Work'),
            },
            {
              label: 'Insurance Alert',
              icon: <IoAlertCircle className="dashboard-icon" />,
              top: `Expiring: ${expiringInsuranceCount}`,
              bottom: 'Expiring Soon',
              color: 'text-danger',
              onClick: () => openModal('Insurance Alert'),
            },
            {
              label: 'Driver Locations',
              icon: <FaMapLocationDot className="dashboard-icon" />,
              top: `${driverLocation} Tracked`,
              bottom: 'Driver GPS Count',
              color: 'text-info',
              onClick: () => openModal('Driver Attendance Location'),
            },
            {
              label: 'Roadside Assistance',
              icon: <FaHandshakeSimple className="dashboard-icon" />,
              top: `Used: ${roadSide}`,
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
  ) : null
}

export default Dashboard
