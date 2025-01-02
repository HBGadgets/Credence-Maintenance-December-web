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
import PropTypes from 'prop-types'
import { Vehicle } from '../types'
import VehicleMaintenanceLogs from '../vehicle-Maintenance-Log/VehicleMaintenanceLogs'

const VehicleProfileModal = ({ selectedVehicle, open, setOpen }) => {
  const handleViewClick = (vehicle) => {
    setSelectedVehicle(vehicle)
    setFilteredLogs(vehicle.maintenanceLogs) // Initialize with all logs
    setOpen(true)
  }

  const handleDateFilter = (startDate, endDate) => {
    if (!selectedVehicle) return
    const filtered = selectedVehicle.maintenanceLogs.filter((log) => {
      const serviceDate = new Date(log.serviceDate)
      return serviceDate >= new Date(startDate) && serviceDate <= new Date(endDate)
    })
    setFilteredLogs(filtered)
  }
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
                  {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                </strong>
              </span>
              <div className="d-flex flex-column">
                <span className="text-body-secondary">VIN: {selectedVehicle.id}</span>
                <span className="text-body-secondary">
                  License Plate: {selectedVehicle.licenseNumber}
                </span>
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
              <div>
                <VehicleMaintenanceLogs />
              </div>
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

VehicleProfileModal.propTypes = {
  selectedVehicle: Vehicle,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  vehicles: Vehicle,
}

export default VehicleProfileModal
