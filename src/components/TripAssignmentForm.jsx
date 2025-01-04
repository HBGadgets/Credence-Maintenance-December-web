/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Calendar, MapPin, Truck, User, IndianRupee, Navigation } from 'lucide-react'
import {
  CCard,
  CForm,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CButton,
  CFormSelect,
  CFormInput,
  CFormLabel,
} from '@coreui/react'
const TripAssignmentTable = React.lazy(() => import('./TripAssignmentTable'))

function TripAssignmentForm() {
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    startLocation: '',
    endLocation: '',
    startDate: '',
    budgetAlloted: '',
    distance: '',
  })

  const [trip, setTrip] = useState([])
  const [open, setOpen] = useState(false)

  //mock data
  const vehicles = [
    { id: 'v1', name: 'Toyota Hiace - KXA 123' },
    { id: 'v2', name: 'Ford Transit - KYB 456' },
    { id: 'v3', name: 'Mercedes Sprinter - KZC 789' },
  ]

  const drivers = [
    { id: 'd1', name: 'John Smith' },
    { id: 'd2', name: 'Sarah Johnson' },
    { id: 'd3', name: 'Michael Brown' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSumbit = (e) => {
    e.preventDefault()
    setTrip((prevTrips) => [...prevTrips, formData])
    console.log(trip)
    setOpen(false)
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        {' '}
        Assign New Trip
      </button>
      <CModal alignment="center" scrollable visible={open} onClose={() => setOpen(false)} size="xl">
        <CModalHeader closeButton></CModalHeader>
        <CModalBody>
          <CRow className="mt-4">
            <CCol md={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Assign Trip</strong>
                </CCardHeader>
                <CForm className="row g-3 p-3" onSubmit={handleSumbit}>
                  {/**Vehicle */}
                  <CCol md={6}>
                    <CFormLabel className="d-flex align-items-center gap-2">
                      <Truck size={22} />
                      Select Vehicle
                    </CFormLabel>
                    <CFormSelect
                      name="vehicleId"
                      value={formData.vehicleId}
                      onChange={handleChange}
                      required
                    >
                      <option>Choose a Vehicle</option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.name}>
                          {vehicle.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  {/**Driver */}
                  <CCol md={6}>
                    <CFormLabel className="d-flex align-items-center gap-2">
                      <User size={22} />
                      Select Driver
                    </CFormLabel>
                    <CFormSelect
                      name="driverId"
                      value={formData.driverId}
                      onChange={handleChange}
                      required
                    >
                      <option>Choose a Driver</option>
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.name}>
                          {driver.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  {/**Start Location */}
                  <CCol md={6}>
                    <CFormLabel className="d-flex align-items-center gap-2">
                      <MapPin size={22} />
                      Start Location
                    </CFormLabel>
                    <CFormInput
                      name="startLocation"
                      value={formData.startLocation}
                      onChange={handleChange}
                      placeholder="Enter Start Location"
                      required
                    />
                  </CCol>
                  {/**End Location/Destination*/}
                  <CCol md={6}>
                    <CFormLabel className="d-flex align-items-center gap-2">
                      <MapPin size={22} />
                      End Location
                    </CFormLabel>
                    <CFormInput
                      name="endLocation"
                      value={formData.endLocation}
                      onChange={handleChange}
                      placeholder="Enter Destination"
                      required
                    />
                  </CCol>
                  {/**Start Date */}
                  <CCol md={4}>
                    <CFormLabel className="d-flex align-items-center gap-2">
                      <Calendar size={22} />
                      Start Date
                    </CFormLabel>
                    <CFormInput
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      type="date"
                      required
                    />
                  </CCol>
                  {/**Budget Alloted */}
                  <CCol md={4}>
                    <CFormLabel className="d-flex align-items-center gap-2">
                      <IndianRupee size={22} />
                      Budget Alloted (₹)
                    </CFormLabel>
                    <CFormInput
                      name="budgetAlloted"
                      value={formData.budgetAlloted}
                      onChange={handleChange}
                      placeholder="Enter Destination"
                      type="number"
                      required
                    />
                  </CCol>
                  <CCol xs={6}>
                    <CButton type="submit" className="btn-primary">
                      Submit
                    </CButton>
                  </CCol>
                </CForm>
              </CCard>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setOpen(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <TripAssignmentTable trip={trip} />
    </>
  )
}

TripAssignmentForm.propTypes = {
  vehicleId: PropTypes.string,
  driverId: PropTypes.string,
  startLocation: PropTypes.string,
  endLocation: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  estimateDuration: PropTypes.string,
  distance: PropTypes.number,
}

export default TripAssignmentForm
