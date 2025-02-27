/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CRow, CCol, CCard, CCardBody, CButton } from '@coreui/react'
import { useParams, useNavigate } from 'react-router-dom'
import VehicleDoc from '../views/vehicle/VehicleDocuments'
import "./VehicleProfile.css"

function VehicleProfile() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [vehicles, setVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [filteredLogs, setFilteredLogs] = useState([])

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/credence`)
        console.log('Devices from credence:', response.data)
        setVehicles(response.data.devices)

        // Find the selected vehicle by ID
        const vehicleData = response.data.devices.find((v) => v._id === id)
        setSelectedVehicle(vehicleData || null)
        if (vehicleData) setFilteredLogs(vehicleData.maintenanceLogs || [])
      } catch (error) {
        console.error('Error fetching vehicles:', error)
      }
    }

    fetchVehicles()
  }, [id])

  const handleViewClick = (vehicle) => {
    setSelectedVehicle(vehicle)
    setFilteredLogs(vehicle.maintenanceLogs || [])
    navigate(`/VehicleProfile/${vehicle._id}`)
  }

  if (!selectedVehicle) {
    return <p>Loading vehicle data...</p>
  }

  return (
    <div className="p-3">
      <div>
        <span>
          <strong className="fs-4 d-flex flex-column">
            {selectedVehicle.name}
          </strong>
        </span>
        <div className="d-flex flex-column">
          <span className="text-body-secondary">Device Model: {selectedVehicle.model}</span>
          <span className="text-body-secondary">Category: {selectedVehicle.category}</span>
        </div>
      </div>
      <hr />
      <VehicleDoc />
      <hr />
      <div className="d-flex flex-column gap-3">
        <div>
          <h5>Services Information</h5>
        </div>
        <div className="d-flex gap-5">
          <div className="d-flex flex-column gap-2">
            <span>Current Mileage</span>
            <span><strong>{selectedVehicle.mileage || 'N/A'} km</strong></span>
          </div>
          <div className="d-flex flex-column gap-2">
            <span>Last Maintenance</span>
            <span><strong>{selectedVehicle.lastMaintenance || 'N/A'}</strong></span>
          </div>
          <div className="d-flex flex-column gap-2">
            <span>Next Maintenance</span>
            <span className="text-danger"><strong>{selectedVehicle.nextMaintenance || 'N/A'}</strong></span>
          </div>
        </div>
      </div>
      <hr />

      <CRow className="justify-content-between">
        <CCol>
          <CCard className="custom-card">
            <CCardBody className="text-center">
              <h5 className="fw-bold mb-3">Maintenance Log</h5>
              <CButton onClick={() => navigate('maintenancelog')} className="custom-btn">
                View Details
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol>
          <CCard className="custom-card">
            <CCardBody className="text-center">
              <h5 className="fw-bold mb-3">Trip</h5>
              <CButton onClick={() => navigate('tripinfo')} className="custom-btn">
                View Details
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol>
          <CCard className="custom-card">
            <CCardBody className="text-center">
              <h5 className="fw-bold mb-3">Tyre Management</h5>
              <CButton onClick={() => navigate('tyredetails')} className="custom-btn">
                View Details
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default VehicleProfile
