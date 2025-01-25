/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Calendar, MapPin, Truck, User, IndianRupee, Navigation } from 'lucide-react'

import { BiSolidCategoryAlt } from 'react-icons/bi'
import { FaTruckMoving } from 'react-icons/fa'
import { IoPersonSharp } from 'react-icons/io5'
import { TiLocation } from 'react-icons/ti'
import { FaCalendarAlt } from 'react-icons/fa'

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
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import LRForm from '../views/Expenses-Management/LR/LRFormCoreUi'
import LR from '../views/Expenses-Management/LR/Lr'
import { Category } from '@mui/icons-material'
import { grey } from '@mui/material/colors'
const TripAssignmentTable = React.lazy(() => import('./TripAssignmentTable'))

function TripAssignmentForm() {
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    categoryId: '',
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

  const categorys = [
    { id: 'c1', name: 'Car' },
    { id: 'c2', name: 'Truck' },
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

  //Form LR function
  // const [formData, setFormData] = useState([])
  const [allLrs, setAllLrs] = useState([]) // All invoices
  const [filteredLrs, setFilteredLrs] = useState([]) // Filtered invoices for display
  const [searchTerm, setSearchTerm] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [currentLr, setCurrentLr] = useState(null) // For editing

  // Close both modals
  const handleModalClose = () => {
    setAddModalOpen(false)
    setEditModalOpen(false)
    setCurrentInvoice(null) // Clear the current invoice
  }
  const handleAddModalClose = () => {
    setAddModalOpen(false)
  }
  const handleCreateLR = () => {
    setAddModalOpen(true)
  }

  const handleSaveLR = (data) => {
    setFormData([...formData, data])
    setShowModal(false)
  }

  //LR From end functions

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
                    <CInputGroup className="mt-4">
                      <CInputGroupText>
                        <FaTruckMoving style={{ fontSize: '22px', color: 'gray' }} />
                      </CInputGroupText>
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
                    </CInputGroup>
                  </CCol>

                  {/* Category */}
                  <CCol md={6}>
                    <CInputGroup className="mt-4">
                      <CInputGroupText className="border-end">
                        <BiSolidCategoryAlt style={{ fontSize: '20px', color: 'gray' }} />
                      </CInputGroupText>
                      <CFormSelect
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                      >
                        <option className="border-end">Choose a Category</option>
                        {categorys.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                  </CCol>

                  {/**Driver */}
                  <CCol md={6}>
                    <CInputGroup className="mt-4">
                      <CInputGroupText className="border-end">
                        <IoPersonSharp style={{ fontSize: '20px', color: 'gray' }} />
                      </CInputGroupText>
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
                    </CInputGroup>
                  </CCol>
                  {/**Start Location */}
                  <CCol md={6}>
                    <CInputGroup className="mt-4">
                      <CInputGroupText className="border-end">
                        <TiLocation style={{ fontSize: '20px', color: 'gray' }} />
                      </CInputGroupText>

                      <CFormInput
                        name="startLocation"
                        onChange={handleChange}
                        placeholder="Enter Start Location"
                        required
                      />
                    </CInputGroup>
                  </CCol>
                  {/**End Location/Destination*/}
                  <CCol md={6}>
                    <CInputGroup className="mt-4">
                      <CInputGroupText className="border-end">
                        <TiLocation style={{ fontSize: '20px', color: 'gray' }} />
                      </CInputGroupText>

                      <CFormInput
                        name="endLocation"
                        value={formData.endLocation}
                        onChange={handleChange}
                        placeholder="Enter End Destination"
                        required
                      />
                    </CInputGroup>
                  </CCol>
                  {/**Start Date */}
                  <CCol md={4}>
                    <CInputGroup className="mt-4">
                      <CInputGroupText className="border-end">
                        <FaCalendarAlt style={{ fontSize: '21px', color: 'gray' }} />
                      </CInputGroupText>
                      <CFormInput
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        type="date"
                        required
                      />
                    </CInputGroup>
                  </CCol>
                  {/**Budget Alloted */}
                  <CCol md={4}>
                    <CInputGroup className="mt-4">
                      <CInputGroupText className="border-end">
                        <IndianRupee style={{ fontSize: '21px', color: 'gray' }} />
                      </CInputGroupText>
                      <CFormInput
                        name="budgetAlloted"
                        value={formData.budgetAlloted}
                        onChange={handleChange}
                        placeholder="Enter Budget"
                        type="number"
                        required
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol xs={6}>
                    <CButton type="submit" className="btn-primary mt-4">
                      Submit
                    </CButton>
                  </CCol>
                </CForm>
              </CCard>
            </CCol>
          </CRow>
          {formData.categoryId == 'Truck' ? (
            <LRForm
              onSave={handleSaveLR}
              handleAddModalClose={handleAddModalClose}
              addModalOpen="true"
              setAddModalOpen={setAddModalOpen}
            />
          ) : (
            'false'
          )}
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
