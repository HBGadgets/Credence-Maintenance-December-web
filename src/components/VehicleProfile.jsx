/* eslint-disable prettier/prettier */
import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
function VehicleProfile({ open, setOpen, vehicle }) {
  return (
    <>
      <CModal
        alignment="center"
        scrollable
        visible={open}
        onClose={() => setOpen(false)}
        fullscreen
        className="bg-light"
      >
        <CModalHeader closeButton />
        <CModalBody>
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
            {/**Maintenance Log */}
            <div>
              <div>
                <h5>Maintenance Log</h5>
              </div>
              <div></div>
              {/* <div>
              <VehicleMaintenanceModal
                selectedVehicle={selectedVehicle}
                handleDateFilter={handleDateFilter}
                open={open}
                setOpen={setOpen}
                filteredLogs={filteredLogs}
              />
            </div> */}
            </div>
          </div>
        </CModalBody>
      </CModal>
    </>
  )
}
export default VehicleProfile
