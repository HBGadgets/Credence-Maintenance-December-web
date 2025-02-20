/* eslint-disable prettier/prettier */
import React from 'react'
import { CRow, CCol, CCard, CCardBody, CCardTitle, CModal, CModalBody, CModalFooter, CModalHeader, CButton } from '@coreui/react'
import { CTab, CTabContent, CTabList, CTabPanel, CTabs } from '@coreui/react'
// import VehicleDocuments from './VehicleDocuments'
const VehicleDocuments = React.lazy(() => import('./VehicleDocuments'))
// import VehicleMaintenanceLog from './tabs/VehicleMaintenanceLog'
// import VehicelTripInfo from './tabs/VehicleTripInfo'
import {useParams} from 'react-router-dom'
import { vehicles } from '../views/vehicle/data/data'
import DetailedPage from '../views/Tyre-Management/DetailedPage'
import { useNavigate } from 'react-router-dom'
import "./VehicleProfile.css"
import VehicleDoc from '../views/vehicle/VehicleDocuments'

function VehicleProfile({  }) {
  const navigate = useNavigate()

    const { id } = useParams();
    //
    const vehicle = vehicles.find((v) => v.id === "V001");
  
  const openMaintainancePage = () => {
    navigate(`maintenancelog`)
  }
  const openTripInfoPage = () => {
    navigate(`tripinfo`)
  }
  const openTyrePage = () => {
    navigate(`tyredetails`)
  }
  
  return (
    <>
      
          <div className="p-3">
            <div>
              <span>
                <strong className="fs-4 d-flex flex-column">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </strong>
              </span>
              <div className="d-flex flex-column">
                <span className="text-body-secondary">VIN: {vehicle.id}</span>
                <span className="text-body-secondary">License Plate: {vehicle.licenseNumber}</span>
              </div>
            </div>
            <hr />
            {/**Documents */}
            <VehicleDocuments document={vehicle.documents} />
            <VehicleDoc />
            <hr />
            {/**Maintenance Schedule Remainder */}
            <div className="d-flex flex-column gap-3">
              <div>
                <h5>Maintenance Information</h5>
              </div>
              <div className="d-flex gap-5">
                <div className="d-flex flex-column gap-2">
                  <span>Current Mileage</span>
                  <span>
                    <strong>15,000 km</strong>
                  </span>
                </div>
                <div className="d-flex flex-column gap-2">
                  <span>Last Maintenance</span>
                  <span>
                    <strong>30/12/2024</strong>
                  </span>
                </div>
                <div className="d-flex flex-column gap-2">
                  <span>Next Maintenance</span>
                  <span className="text-danger">
                    <strong>2/1/2025</strong>
                  </span>
                </div>
              </div>
            </div>
            <hr />
            {/* <CRow className="text-center">
  <CCol xs={12} className="mb-3">
    <CButton 
      onClick={openMaintainancePage} 
      className=""
    >
      Maintenance Log
    </CButton>
  </CCol>
  <CCol xs={12} className="mb-3">
    <CButton 
      onClick={openTripInfoPage} 
      className=""
    >
       Trip
    </CButton>
  </CCol>
  <CCol xs={12} className="mb-3">
    <CButton 
      onClick={openTyrePage} 
      className=""
    >
       Tyre Management
    </CButton>
  </CCol>
</CRow> */}

<CRow className="justify-content-between">
  <CCol >
    <CCard className="custom-card">
      <CCardBody className="text-center">
        <h5 className="fw-bold mb-3">Maintenance Log</h5>
        <CButton 
          onClick={openMaintainancePage} 
          className="custom-btn"
        >
          View Details
        </CButton>
      </CCardBody>
    </CCard>
  </CCol>

  <CCol >
    <CCard className="custom-card">
      <CCardBody className="text-center">
        <h5 className="fw-bold mb-3">Trip</h5>
        <CButton 
          onClick={openTripInfoPage} 
          className="custom-btn"
        >
          View Details
        </CButton>
      </CCardBody>
    </CCard>
  </CCol>

  <CCol >
    <CCard className="custom-card">
      <CCardBody className="text-center">
        <h5 className="fw-bold mb-3">Tyre Management</h5>
        <CButton 
          onClick={openTyrePage} 
          className="custom-btn"
        >
          View Details
        </CButton>
      </CCardBody>
    </CCard>
  </CCol>
</CRow>




          </div>
          
    </>
  )
}
export default VehicleProfile
