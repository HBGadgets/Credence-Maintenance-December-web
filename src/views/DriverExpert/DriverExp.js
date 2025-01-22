import React, { useState } from 'react'
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
  CModalHeader,
  CModalTitle,
  CImage,
  CForm,
  CFormInput,
  CFormLabel,
  CTab,
  CTabList,
  CTabPanel,
  CTabContent,
  CTabs,
} from '@coreui/react'
import { Edit, Eye, Trash2 } from 'lucide-react'
import { drivers as initialDrivers } from '../DriverExpert/data/drivers' // Import drivers data
import { drivers } from '../DriverExpert/data/drivers' // Ensure this import is correct
import { trips } from '../DriverExpert/data/trips' // Ensure this import is correct
import { expenses } from '../DriverExpert/data/expenses' // Import expenses
import { salaries } from '../DriverExpert/data/salaries' // Import salaries
import TripsTable from '../DriverExpert/components/trips/TripsTable' // Ensure this import is correct
import ExpensesTable from '../DriverExpert/components/expenses/ExpensesTable' // Ensure this import is correct
import SalarySlipTable from '../DriverExpert/components/salary/SalarySlipTable' // Import the SalarySlipTable component
import AttendanceSection from '../DriverExpert/components/attendance/AttendanceSection' // Import AttendanceSection component
import { debounce } from 'lodash'
import { Select } from '@mui/material'
import { useEffect } from 'react'
import { IoPerson } from 'react-icons/io5'
import { IoCall } from 'react-icons/io5'
import { MdEmail } from 'react-icons/md'
import { IoDocumentText } from 'react-icons/io5'
import { RiLockPasswordFill } from 'react-icons/ri'
import { AiFillPicture } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const DriversExp = ({ setSelectedDriverId }) => {
  const columns = ['Name', 'Contact', 'Email', 'Profile']
  const [drivers, setDrivers] = useState(initialDrivers) // Use state for the driver list
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [open, setOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [newDriver, setNewDriver] = useState({
    name: '',
    contactNumber: '',
    email: '',
    licenseNumber: '',
    aadharNumber: '',
    password: '',
    profileImage: null, // State to store the selected image
  })
  const [editModalOpen, setEditModalOpen] = useState(false) // State for edit modal
  const [driverToEdit, setDriverToEdit] = useState(null) // State for the driver being edited

  const [data, setData] = useState(drivers) // Assuming drivers are available
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // Number of items per page

  const debouncedFilterChange = debounce((value) => {
    const filteredData = drivers.filter((row) =>
      row.name.toLowerCase().includes(value.toLowerCase()),
    )
    setData(filteredData)
    setCurrentPage(1) // Reset to the first page on filter change
  }, 300)

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
    debouncedFilterChange(e.target.value)
  }

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)

  // Handle file input change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewDriver({ ...newDriver, profileImage: file })
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Group trips by driverId
  const groupedTrips = trips.reduce((acc, trip) => {
    if (!acc[trip.driverId]) {
      acc[trip.driverId] = []
    }
    acc[trip.driverId].push(trip)
    return acc
  }, {})

  // Group expenses by driverId
  const groupedExpenses = expenses.reduce((acc, expense) => {
    if (!acc[expense.driverId]) {
      acc[expense.driverId] = []
    }
    acc[expense.driverId].push(expense)
    return acc
  }, {})

  // Group salaries by driverId (assuming you have a similar salaries data)
  const groupedSalaries = salaries.reduce((acc, salary) => {
    if (!acc[salary.driverId]) {
      acc[salary.driverId] = []
    }
    acc[salary.driverId].push(salary)
    return acc
  }, {})

  const handleViewClick = (driver) => {
    setSelectedDriver(driver)
    setOpen(true)
  }

  const handleAddDriver = () => {
    // Add new driver logic here (e.g., send to API or update state)
    setDrivers([...drivers, newDriver])
    setAddModalOpen(false)
    alert('New driver added!')
  }

  const handleDeleteDriver = (driverId) => {
    // Delete the driver by filtering it out from the state
    setDrivers(drivers.filter((driver) => driver.id !== driverId))
  }

  const handleEditDriver = (driver) => {
    setDriverToEdit(driver)
    setEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    setDrivers(drivers.map((driver) => (driver.id === driverToEdit.id ? driverToEdit : driver)))
    setEditModalOpen(false)
    alert('Driver updated successfully!')
  }

  return (
    <>
      {/* Filter */}
      <CRow>
        <div>
          <CButton color="primary" className="float-end mb-2" onClick={() => setAddModalOpen(true)}>
            Add Driver
          </CButton>
        </div>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Vehicles</strong>
              <CFormInput
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-25"
                style={{
                  boxShadow: searchQuery ? '0 0 8px rgba(0, 123, 255, 0.75)' : 'none',
                  borderColor: searchQuery ? '#007bff' : undefined,
                }}
              />
            </CCardHeader>

            <CCardBody>
              {data.length === 0 ? (
                <p className="text-center">No drivers available.</p>
              ) : (
                <CTable striped hover responsive bordered>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="text-center" scope="col">
                        SN
                      </CTableHeaderCell>
                      {columns.map((column, index) => (
                        <CTableHeaderCell key={index} className="text-center" scope="col">
                          {column}
                        </CTableHeaderCell>
                      ))}
                      <CTableHeaderCell className="text-center" scope="col">
                        Actions
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentItems.map((driver, index) => (
                      <CTableRow key={driver.id}>
                        <CTableDataCell className="text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </CTableDataCell>{' '}
                        {/* Serial Number */}
                        <CTableDataCell className="text-center">{driver.name}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {driver.contactNumber}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{driver.email}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            color="primary"
                            size="sm"
                            onClick={() => handleViewClick(driver)}
                            className="text-center"
                          >
                            <Eye className="me-2" size={16} />
                            View Profile
                          </CButton>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            color="warning"
                            size="sm"
                            onClick={() => handleEditDriver(driver)}
                          >
                            <Edit size={16} /> {/* Edit Icon */}
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => handleDeleteDriver(driver.id)}
                          >
                            <Trash2 size={16} /> {/* Delete Icon */}
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}

              {/* Pagination Buttons */}
              <div className="d-flex justify-content-center align-items-center mt-3">
                <CButton color="primary" disabled={currentPage === 1} onClick={handlePreviousPage}>
                  Previous
                </CButton>
                {Array.from({ length: totalPages }, (_, index) => (
                  <CButton
                    key={index}
                    color={currentPage === index + 1 ? 'primary' : 'secondary'}
                    className="mx-1"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </CButton>
                ))}
                <CButton
                  color="primary"
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                >
                  Next
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* View Profile Modal */}
      {selectedDriver && (
        <CModal
          alignment="center"
          scrollable
          visible={open}
          onClose={() => setOpen(false)}
          fullscreen
        >
          <CModalHeader>
            <CModalTitle className="d-flex align-items-center">
              <h5>Driver Profile</h5>
            </CModalTitle>
          </CModalHeader>
          <CModalBody className="shadow-md rounded-lg p-6 mb-6">
            <div className="d-flex gap-3">
              <CImage
                src={selectedDriver.profileImage || '/default-avatar.png'} // Default image fallback
                alt={selectedDriver.name}
                className="img-thumbnail rounded-circle me-3"
                width="120" // Set the desired width
                height="120" // Set the desired height
              />
              <div>
                <div className="py-2">
                  <h2>{selectedDriver.name}</h2>
                </div>
                <div>
                  <h6>License: {selectedDriver.licenseNumber}</h6>
                </div>
                <div>
                  <h6>Aadhar: {selectedDriver.aadharNumber}</h6>
                </div>
                <div>
                  <h6>Contact: {selectedDriver.contactNumber}</h6>
                </div>
                <div>
                  <h6>Email: {selectedDriver.email}</h6>
                </div>
              </div>
            </div>
            <hr />
            {/* Tabs */}
            <CTabs activeItemKey={1}>
              <CTabList variant="underline">
                <CTab aria-controls="attendance" itemKey={1}>
                  Attendances
                </CTab>
                <CTab aria-controls="expenses" itemKey={2}>
                  Expenses
                </CTab>
                <CTab aria-controls="trip-details" itemKey={3}>
                  Logbook Details
                </CTab>
                <CTab aria-controls="salary-slips" itemKey={4}>
                  Salary Slips
                </CTab>
              </CTabList>
              <CTabContent>
                <CTabPanel className="p-3" aria-labelledby="attendance" itemKey={1}>
                  {/* Replace with actual attendance details */}
                  <AttendanceSection driverId={selectedDriver.id} />
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="expenses" itemKey={2}>
                  {/* Replace with actual expenses table */}
                  <ExpensesTable expenses={groupedExpenses[selectedDriver.id] || []} />
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="trip-details" itemKey={3}>
                  {/* Replace with actual trips table */}
                  <TripsTable trips={groupedTrips[selectedDriver.id] || []} />
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="salary-slips" itemKey={4}>
                  {/* Replace with actual salary slips */}
                  <SalarySlipTable salaries={groupedSalaries[selectedDriver.id] || []} />
                </CTabPanel>
              </CTabContent>
            </CTabs>
          </CModalBody>
        </CModal>
      )}

      {/* Edit Driver Modal */}
      {editModalOpen && driverToEdit && (
        <CModal alignment="center" visible={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <CModalHeader>
            <CModalTitle>Edit Driver</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <div className="mb-2">
                <CFormLabel>Name</CFormLabel>
                <CFormInput
                  type="text"
                  value={driverToEdit.name}
                  onChange={(e) => setDriverToEdit({ ...driverToEdit, name: e.target.value })}
                />
              </div>
              <div className="mb-2">
                <CFormLabel>Contact Number</CFormLabel>
                <CFormInput
                  type="text"
                  value={driverToEdit.contactNumber}
                  onChange={(e) =>
                    setDriverToEdit({ ...driverToEdit, contactNumber: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <CFormLabel>Email</CFormLabel>
                <CFormInput
                  type="email"
                  value={driverToEdit.email}
                  onChange={(e) => setDriverToEdit({ ...driverToEdit, email: e.target.value })}
                />
              </div>
              <div className="mb-2">
                <CFormLabel>License Number</CFormLabel>
                <CFormInput
                  type="text"
                  value={driverToEdit.licenseNumber}
                  onChange={(e) =>
                    setDriverToEdit({ ...driverToEdit, licenseNumber: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <CFormLabel>Aadhar Number</CFormLabel>
                <CFormInput
                  type="text"
                  value={driverToEdit.aadharNumber}
                  onChange={(e) =>
                    setDriverToEdit({ ...driverToEdit, aadharNumber: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <CFormLabel>Password</CFormLabel>
                <CFormInput
                  type="password"
                  value={driverToEdit.password}
                  onChange={(e) => setDriverToEdit({ ...driverToEdit, password: e.target.value })}
                />
              </div>
              <CButton color="primary" onClick={handleSaveEdit}>
                Save Changes
              </CButton>
            </CForm>
          </CModalBody>
        </CModal>
      )}

      {/* Add Driver Modal */}
      <CModal
        alignment="center"
        visible={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>Add Driver</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {/* Flexbox container for a landscape layout */}
            <div
              className=" flex-wrap gap-10"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
            >
              {/* Name field */}
              <div className="mb-2 d-flex align-items-center flex-grow-1">
                <IoPerson className="me-2 mb-auto mt-1" /> {/* Person Icon */}
                <div className="w-100">
                  <CFormLabel>Name</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Contact Number field */}
              <div className="mb-2 d-flex align-items-center flex-grow-1">
                <IoCall className="me-2 mb-auto mt-1" /> {/* Call Icon */}
                <div className="w-100">
                  <CFormLabel>Contact Number</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newDriver.contactNumber}
                    onChange={(e) => setNewDriver({ ...newDriver, contactNumber: e.target.value })}
                  />
                </div>
              </div>

              {/* Email field */}
              <div className="mb-2 d-flex align-items-center flex-grow-1">
                <MdEmail className="me-2 mb-auto mt-1" />
                {/* Email Icon */}
                <div className="w-100">
                  <CFormLabel>Email</CFormLabel>
                  <CFormInput
                    type="email"
                    value={newDriver.email}
                    onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                  />
                </div>
              </div>

              {/* License Number field */}
              <div className="mb-2 d-flex align-items-center flex-grow-1">
                <IoDocumentText className="me-2 mb-auto mt-1" /> {/* Document Icon */}
                <div className="w-100">
                  <CFormLabel>License Number</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newDriver.licenseNumber}
                    onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
              {/* Aadhar Number field */}
              <div className="mb-2 d-flex align-items-center flex-grow-1">
                <IoDocumentText className="me-2 mb-auto mt-1" /> {/* Document Icon */}
                <div className="w-100">
                  <CFormLabel>Aadhar Number</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newDriver.aadharNumber}
                    onChange={(e) => setNewDriver({ ...newDriver, aadharNumber: e.target.value })}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="mb-2 d-flex align-items-center flex-grow-1">
                <RiLockPasswordFill className="me-2 mb-auto mt-1" /> {/* Password Icon */}
                <div className="w-100">
                  <CFormLabel>Password</CFormLabel>
                  <CFormInput
                    type="password"
                    value={newDriver.password}
                    onChange={(e) => setNewDriver({ ...newDriver, password: e.target.value })}
                  />
                </div>
              </div>

              {/* Profile Picture field */}
              <div className="mb-2 d-flex align-items-center flex-grow-1">
                <AiFillPicture className="me-4  mb-auto mt-1 " /> {/* Image Icon */}
                <div className="w-100">
                  <CFormLabel>Profile Picture</CFormLabel>
                  <CFormInput type="file" onChange={handleProfileImageChange} />
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div className="d-flex justify-content-end">
              <CButton color="primary" className="mt-3 " onClick={() => handleAddDriver(newDriver)}>
                Submit
              </CButton>
            </div>
          </CForm>
        </CModalBody>
        <ToastContainer />
      </CModal>
    </>
  )
}

export default DriversExp
