import React, { useState, useEffect } from 'react'
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
import CIcon from '@coreui/icons-react'
import {
  cilCog,
  cilDollar,
  cilGridSlash,
  cilListRich,
  cilMap,
  cilPaintBucket,
  cilPeople,
  cilShieldAlt,
  cilSpeedometer,
  cilTruck,
  cilUser,
  cilWarning,
} from '@coreui/icons'
import { IoPersonSharp } from 'react-icons/io5'
import { FaTruckMoving } from 'react-icons/fa6'
import { IoSettingsSharp } from 'react-icons/io5'
import { RiMoneyRupeeCircleFill } from 'react-icons/ri'
import { TbTruckDelivery } from 'react-icons/tb'
import { IoAlertCircle } from 'react-icons/io5'
import { FaMapLocationDot } from 'react-icons/fa6'
import { FaHandshakeSimple } from 'react-icons/fa6'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import { MdOutlineCurrencyRupee } from 'react-icons/md'
import axios from 'axios'
import Cookies from 'js-cookie'
const Dashboard = () => {
  // Data processing (these should be calculated dynamically based on actual data)
  const activeDrivers = 12
  const inactiveDrivers = 3
  const activeVehicles = 8
  const inactiveVehicles = 2
  const totalExpenses = 15340
  const underMaintenanceVehicles = 2
  const goodConditionVehicles = 6
  const presentDrivers = 10
  const absentDrivers = 5
  const currentLocation = 8
  const roadSide = 5
  const expiringInsurances = [
    { name: 'Vehicle A', insuranceExpiryDate: '2024-12-30' },
    { name: 'Vehicle B', insuranceExpiryDate: '2025-01-15' },
  ]

  // Calculate the count of expiring insurances
  const expiringInsuranceCount = expiringInsurances.length

  const tableData = [
    {
      driver: {
        name: 'Dove Lara',
        avatar: avatar1,
        status: 'success',
      },
      vehicle: {
        model: 'Toyota Camry',
        plate: 'ABC-123',
      },
      route: 'Nagpur → Bhopal',
      date: 'Mar 15, 2024',
      duration: '6 hours',
      totalExpense: 450,
      expenses: {
        driver: 150,
        vehicle: 300,
      },
      status: 'Active',
    },
    {
      driver: {
        name: 'Jane Dom',
        avatar: avatar2,
        status: 'warning',
      },
      vehicle: {
        model: 'Honda Civic',
        plate: 'XYZ-789',
      },
      route: 'Raipur → Mumbai',
      date: 'Mar 10, 2024',
      duration: '5 hours',
      totalExpense: 400,
      expenses: {
        driver: 130,
        vehicle: 270,
      },
      status: 'Active',
    },
    {
      driver: {
        name: 'Stive Smith',
        avatar: avatar3,
        status: 'success',
      },
      vehicle: {
        model: 'Honda Accord',
        plate: 'XYZ-887',
      },
      route: 'Mumbai → Pune',
      date: 'Aug 16, 2024',
      duration: '5 hours',
      totalExpense: 10000,
      expenses: {
        driver: 2500,
        vehicle: 3700,
      },
      status: 'Inactive',
    },
    {
      driver: {
        name: 'July Kim',
        avatar: avatar4,
        status: 'success',
      },
      vehicle: {
        model: 'Honda Civic',
        plate: 'XYZ-789',
      },
      route: 'Raipur → Mumbai',
      date: 'Mar 10, 2024',
      duration: '5 hours',
      totalExpense: 400,
      expenses: {
        driver: 130,
        vehicle: 270,
      },
      status: 'Active',
    },
    {
      driver: {
        name: 'Jurry Atnone',
        avatar: avatar5,
        status: 'warning',
      },
      vehicle: {
        model: 'Honda Civic',
        plate: 'XYZ-789',
      },
      route: 'Raipur → Mumbai',
      date: 'Mar 10, 2024',
      duration: '5 hours',
      totalExpense: 400,
      expenses: {
        driver: 130,
        vehicle: 270,
      },
      status: 'Inactive',
    },
  ]

  const queryParams = new URLSearchParams(window.location.search)
  const token = queryParams.get('token')

  const sendTokenToServerFromURL = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/validate`,
        { token }, // Token sent in POST body
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      console.log('Server response:', response.data)

      // setting cookie in the browser
      Cookies.set('crdnsToken', token, { expires: 7 })
    } catch (error) {
      console.log('Error:', error.response?.data || error.message)
    }
  }

  useEffect(() => {
    sendTokenToServerFromURL()
  }, [])

  // For cart new dialog box open and close.
  const [modalVisible, setModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [showAllLogs, setShowAllLogs] = useState(false)

  const openModal = (cardName) => {
    setModalContent(cardName)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setModalContent('')
  }

  const handleClickView = () => {
    setShowAllLogs(true)
  }
  return (
    <>
      <style>
        {`
          .hover-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          }
          .hover-table tr:hover {
            background-color: #f1f1f1;
          }
        `}
      </style>

      <CCardGroup className="mb-4">
        <CRow className="g-3">
          {/* Active/Inactive Drivers Card */}
          <CCol xs="12" sm="6" lg="3">
            <CCard className="shadow-sm border-0 hover-card" onClick={() => openModal('Drivers')}>
              <CCardHeader className="d-flex align-items-center justify-content-between">
                <IoPersonSharp style={{ fontSize: '21px' }} />
                <span className="font-weight-bold">Drivers</span>
              </CCardHeader>
              <CCardBody>
                <h5 className="mb-2 text-success">Active: {activeDrivers}</h5>
                <h6 className="mb-2 text-danger">Absent: {absentDrivers}</h6>
                <p className="text-muted">Drivers currently available or absent</p>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Active/Inactive Vehicles Card */}
          <CCol xs="12" sm="6" lg="3">
            <CCard className="shadow-sm border-0 hover-card" onClick={() => openModal('Vehicles')}>
              <CCardHeader className="d-flex align-items-center justify-content-between">
                <FaTruckMoving style={{ fontSize: '22px' }} />
                <span className="font-weight-bold">Vehicles</span>
              </CCardHeader>
              <CCardBody>
                <h5 className="mb-2 text-success">Active: {activeVehicles}</h5>
                <h6 className="mb-2 text-danger">Inactive: {inactiveVehicles}</h6>
                <p className="text-muted">Vehicle status and tracking details</p>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Vehicle Maintenance Status Card */}
          <CCol xs="12" sm="6" lg="3">
            <CCard
              className="shadow-sm border-0 hover-card"
              onClick={() => openModal('Maintenance')}
            >
              <CCardHeader className="d-flex align-items-center justify-content-between">
                <IoSettingsSharp style={{ fontSize: '22px' }} />
                <span className="font-weight-bold">Maintenance Status</span>
              </CCardHeader>
              <CCardBody>
                <h5 className="mb-2 text-success">Good to Go: {goodConditionVehicles}</h5>
                <h6 className="mb-2 text-danger">Under Maintenance: {underMaintenanceVehicles}</h6>
                <p className="text-muted">Maintenance status of the fleet</p>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Total Expenses Card */}
          <CCol xs="12" sm="6" lg="3">
            <CCard className="shadow-sm border-0 hover-card" onClick={() => openModal('Expenses')}>
              <CCardHeader className="d-flex align-items-center justify-content-between">
                <RiMoneyRupeeCircleFill style={{ fontSize: '22px' }} />
                <span className="font-weight-bold">Expenses</span>
              </CCardHeader>
              <CCardBody>
                <h5 className="mb-2 text-primary">Total: ₹{totalExpenses.toLocaleString()}</h5>
                <p className="text-muted">
                  Total expenses for the fleet, including driver and vehicle costs
                </p>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Live on Work Card */}
          <CCol xs="12" sm="6" lg="3">
            <CCard
              className="shadow-sm border-0 hover-card"
              onClick={() => openModal('Live on Work')}
            >
              <CCardHeader className="d-flex align-items-center justify-content-between">
                <TbTruckDelivery style={{ fontSize: '23px' }} />
                <span className="font-weight-bold">Live on Work</span>
              </CCardHeader>
              <CCardBody>
                <h5 className="mb-2 text-primary">On Duty: {presentDrivers}</h5>
                <p className="text-muted">Drivers currently on their work duties</p>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Insurance Alert Card */}
          <CCol xs="12" sm="6" lg="3">
            <CCard
              className="shadow-sm border-0 hover-card"
              onClick={() => openModal('Insurance Alert')}
            >
              <CCardHeader className="d-flex align-items-center justify-content-between">
                <IoAlertCircle style={{ fontSize: '23px' }} />
                <span className="font-weight-bold">Insurance Alert</span>
              </CCardHeader>
              <CCardBody>
                <h5 className="mb-2 text-danger">Expiring Soon: {expiringInsuranceCount}</h5>
                <p className="text-muted">Vehicles with insurance expiring soon</p>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Vehicle Location Card */}
          <CCol xs="12" sm="6" lg="3">
            <CCard
              className="shadow-sm border-0 hover-card"
              onClick={() => openModal('Vehicle Location')}
            >
              <CCardHeader className="d-flex align-items-center justify-content-between">
                <FaMapLocationDot style={{ fontSize: '23px' }} />
                <span className="font-weight-bold">Vehicle Location</span>
              </CCardHeader>
              <CCardBody>
                <h5 className="mb-2 text-primary">Current Location: {currentLocation} </h5>
                <p className="text-muted">Real-time location of all live vehicles</p>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Roadside Assistance Card */}
          <CCol xs="12" sm="6" lg="3">
            <CCard
              className="shadow-sm border-0 hover-card"
              onClick={() => openModal('Roadside Assistance')}
            >
              <CCardHeader className="d-flex align-items-center justify-content-between">
                <FaHandshakeSimple style={{ fontSize: '23px' }} />
                <span className="font-weight-bold">Roadside Assitance</span>
              </CCardHeader>
              <CCardBody>
                <h5 className="mb-2 text-primary">Used Service: {roadSide}</h5>
                <p className="text-muted">Vehicles using Roadside Assistance</p>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCardGroup>

      {/* Modals for each card */}
      <CModal visible={modalVisible} onClose={closeModal} size="lg" className="pt-5">
        <CModalHeader>
          <h5>{modalContent} Details</h5>
        </CModalHeader>
        <CModalBody>
          <p>{`Content for ${modalContent} will go here`}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Recent Trips Table */}
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Recent Trips</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
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
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={trip.driver.avatar} status={trip.driver.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{trip.driver.name}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{trip.vehicle.model}</div>
                        <div className="small text-body-secondary">{trip.vehicle.plate}</div>
                      </CTableDataCell>
                      <CTableDataCell>{trip.route}</CTableDataCell>
                      <CTableDataCell>{trip.date}</CTableDataCell>
                      <CTableDataCell>{trip.duration}</CTableDataCell>
                      <CTableDataCell>
                        <div>Total: ₹{trip.totalExpense}</div>
                        <div className="small text-body-secondary">
                          Driver: ₹{trip.expenses.driver}
                        </div>
                        <div className="small text-body-secondary">
                          Vehicle: ₹{trip.expenses.vehicle}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <span
                          className={trip.status === 'Active' ? 'text-success' : 'text-warning'}
                        >
                          {trip.status}
                        </span>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <div className="d-flex justify-content-end mt-3">
                <button type="button" className="btn btn-secondary" onClick={handleClickView}>
                  View More
                </button>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
