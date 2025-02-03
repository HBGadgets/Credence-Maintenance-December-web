/* eslint-disable prettier/prettier */
import React from 'react'
import { CModal, CModalBody, CModalFooter, CModalHeader } from '@coreui/react'
import { CTab, CTabContent, CTabList, CTabPanel, CTabs } from '@coreui/react'
// import VehicleDocuments from './VehicleDocuments'
const VehicleDocuments = React.lazy(() => import('./VehicleDocuments'))
const VehicleMaintenanceLog = React.lazy(() => import('./tabs/VehicleMaintenanceLog'))
// import VehicleMaintenanceLog from './tabs/VehicleMaintenanceLog'
const VehicleTripInfo = React.lazy(() => import('./tabs/VehicleTripInfo'))
// import VehicelTripInfo from './tabs/VehicleTripInfo'
import {useParams} from 'react-router-dom'
import { vehicles } from '../views/vehicle/data/data'
import DetailedPage from '../views/Tyre-Management/DetailedPage'

function VehicleProfile({ open, setOpen, vehicle }) {

    const { id } = useParams();
    //
     vehicle = vehicles.find((v) => v.id === id);
  
  const handleClose = () => {
    setOpen(false)
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
            {/**Tabs */}
            <CTabs activeItemKey={2}>
              <CTabList variant="underline">
                <CTab aria-controls="maintenance-log" itemKey={1}>
                  Maintenance Log
                </CTab>
                <CTab aria-controls="vehicle-trip" itemKey={2}>
                  Trip
                </CTab>
                <CTab aria-controls="vehicle-tyre" itemKey={3}>
                  Tyre Management
                </CTab>
              </CTabList>
              <CTabContent>
                <CTabPanel className="p-3" aria-labelledby="maintenance-log" itemKey={1}>
                  <VehicleMaintenanceLog logs={vehicle.maintenanceLogs} />
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="vehicle-trip" itemKey={2}>
                  <VehicleTripInfo trips={vehicle.trips} />
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="vehicle-tyre" itemKey={3}>
                  <DetailedPage  vehicle={vehicle}/>
                </CTabPanel>
              </CTabContent>
            </CTabs>
          </div>
          
    </>
  )
}
export default VehicleProfile
