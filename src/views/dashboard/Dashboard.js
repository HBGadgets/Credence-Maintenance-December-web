import React from 'react';
import {
  CAvatar,
  CCard,
  CCardBody,
  CCardGroup,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCog, cilDollar, cilGridSlash, cilListRich, cilMap, cilPaintBucket, cilPeople, cilShieldAlt, cilSpeedometer, cilTruck, cilUser, cilWarning } from '@coreui/icons';

import avatar1 from 'src/assets/images/avatars/1.jpg';
import avatar2 from 'src/assets/images/avatars/2.jpg';

const Dashboard = () => {
  // Data processing (these should be calculated dynamically based on actual data)
  const activeDrivers = 12;
  const inactiveDrivers = 3;
  const activeVehicles = 8;
  const inactiveVehicles = 2;
  const totalExpenses = 15340;
  const underMaintenanceVehicles = 2;
  const goodConditionVehicles = 6;
  const presentDrivers = 10;
  const absentDrivers = 5;
  const currentLocation = 8;
  const roadSide = 5;
  const expiringInsurances = [
    { name: 'Vehicle A', insuranceExpiryDate: '2024-12-30' },
    { name: 'Vehicle B', insuranceExpiryDate: '2025-01-15' }
  ];

  // Calculate the count of expiring insurances
  const expiringInsuranceCount = expiringInsurances.length;

  const tableData = [
    {
      driver: {
        name: 'John Doe',
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
        name: 'Jane Smith',
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
      status: 'Inactive',
    },
  ];

  return (
    <>
      <CCardGroup className="mb-4">
        <CRow className="g-3">
          {/* Active/Inactive Drivers Card */}
          <CCol xs="12" sm="6" lg="3">
            <CCard className="shadow-sm border-0">
              <CCardHeader className="d-flex align-items-center justify-content-between">
                <CIcon icon={cilUser} size="lg" />
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
            <CCard className="shadow-sm border-0">
              <CCardHeader className="d-flex align-items-center justify-content-between">
                <CIcon icon={cilTruck} size="lg" />
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
            <CCard className="shadow-sm border-0">
              <CCardHeader className="d-flex align-items-center justify-content-between">
                <CIcon icon={cilCog} size="lg" />
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
            <CCard className="shadow-sm border-0">
              <CCardHeader className="d-flex align-items-center justify-content-between">
                <CIcon icon={cilDollar} size="lg" />
                <span className="font-weight-bold">Expenses</span>
              </CCardHeader>
              <CCardBody>
                <h5 className="mb-2 text-primary">Total: ₹{totalExpenses.toLocaleString()}</h5>
                <p className="text-muted">Total expenses for the fleet, including driver and vehicle costs</p>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Live on Work Card */}
          <CCol xs="12" sm="6" lg="3">
            <CCard className="shadow-sm border-0">
              <CCardHeader className="d-flex align-items-center justify-content-between">
                <CIcon icon={cilListRich} size="lg" />
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
            <CCard className="shadow-sm border-0">
              <CCardHeader className="d-flex align-items-center justify-content-between">
                <CIcon icon={cilShieldAlt} size="lg" />
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
            <CCard className="shadow-sm border-0">
              <CCardHeader className="d-flex align-items-center justify-content-between">
                <CIcon icon={cilMap} size="lg" />
                <span className="font-weight-bold">Vehicle Location</span>
              </CCardHeader>
              <CCardBody>
                <h5 className="mb-2 text-primary">Current Location: {currentLocation} </h5>
                <p className="text-muted">Real-time location of all the transports vehicles</p>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Roadside Assitance  Card (New Feature) */}
          <CCol xs="12" sm="6" lg="3">
            <CCard className="shadow-sm border-0">
              <CCardHeader className="d-flex align-items-center justify-content-between">
                <CIcon icon={cilWarning} size="lg" />
                <span className="font-weight-bold">Roadside Assitance</span>
              </CCardHeader>
              <CCardBody>
                <h5 className="mb-2 text-primary">Used Service: {roadSide}</h5>
                <p className="text-muted">Total vehicles used this Roadside Assitance services</p>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCardGroup>


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
                        <span className={trip.status === 'Active' ? 'text-success' : 'text-warning'}>
                          {trip.status}
                        </span>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;
