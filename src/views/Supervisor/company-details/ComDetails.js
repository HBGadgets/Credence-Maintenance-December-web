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
  CTabs
} from '@coreui/react'
import { Edit, Eye, Trash2 } from 'lucide-react'
import { compaines as initialcompaines } from '../company-details/data/compaines' // Import compaines data
import { compaines } from '../company-details/data/compaines' // Ensure this import is correct
// import { trips } from '../DriverExpert/data/trips' // Ensure this import is correct
// import { expenses } from '../DriverExpert/data/expenses' // Import expenses
// import { salaries } from '../DriverExpert/data/salaries' // Import salaries
// import TripsTable from '../DriverExpert/components/trips/TripsTable' // Ensure this import is correct
// import ExpensesTable from '../DriverExpert/components/expenses/ExpensesTable' // Ensure this import is correct
// import SalarySlipTable from '../DriverExpert/components/salary/SalarySlipTable' // Import the SalarySlipTable component
// import AttendanceSection from '../DriverExpert/components/attendance/AttendanceSection' // Import AttendanceSection component
import { debounce } from 'lodash'
import { Select } from '@mui/material'

const compainesExp = ({ setselectedCompanyId }) => {
  const columns = ['Comapny Name', 'Contact', 'Address', 'Profile']
  const [compaines, setcompaines] = useState(initialcompaines) // Use state for the driver list
  const [selectedCompany, setselectedCompany] = useState(null)
  const [open, setOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [newDriver, setNewDriver] = useState({
    name: '',
    contactNumber: '',
    address: '',
    gstNumber: '',
    password: '',
    profileImage: null,  // State to store the selected image
  })
  const [editModalOpen, setEditModalOpen] = useState(false) // State for edit modal
  const [driverToEdit, setDriverToEdit] = useState(null) // State for the driver being edited

  const [data, setData] = useState(compaines); // Assuming compaines are available
  const [filter, setFilter] = useState('');

  // Logic for Filter
  const debouncedFilterChange = debounce((value) => {
    const filteredData = compaines.filter(
      (row) =>
        row.name.toLowerCase().includes(value.toLowerCase())
    );
    setData(filteredData);
  }, 300);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    debouncedFilterChange(e.target.value);
  };

  // Handle file input change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDriver({ ...newDriver, profileImage: file });
    }
  };

  // Group trips by driverId
  // const groupedTrips = trips.reduce((acc, trip) => {
  //   if (!acc[trip.driverId]) {
  //     acc[trip.driverId] = []
  //   }
  //   acc[trip.driverId].push(trip)
  //   return acc
  // }, {})

  // Group expenses by driverId
  // const groupedExpenses = expenses.reduce((acc, expense) => {
  //   if (!acc[expense.driverId]) {
  //     acc[expense.driverId] = []
  //   }
  //   acc[expense.driverId].push(expense)
  //   return acc
  // }, {})

  // Group salaries by driverId (assuming you have a similar salaries data)
  // const groupedSalaries = salaries.reduce((acc, salary) => {
  //   if (!acc[salary.driverId]) {
  //     acc[salary.driverId] = []
  //   }
  //   acc[salary.driverId].push(salary)
  //   return acc
  // }, {})

  const handleViewClick = (driver) => {
    setselectedCompany(driver)
    setOpen(true)
  }

  const handleAddDriver = () => {
    // Add new driver logic here (e.g., send to API or update state)
    setcompaines([...compaines, newDriver])
    setAddModalOpen(false)
    alert('New driver added!')
  }

  const handleDeleteDriver = (driverId) => {
    // Delete the driver by filtering it out from the state
    setcompaines(compaines.filter(driver => driver.id !== driverId))
  }

  const handleEditDriver = (driver) => {
    setDriverToEdit(driver)
    setEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    setcompaines(compaines.map(driver =>
      driver.id === driverToEdit.id ? driverToEdit : driver
    ))
    setEditModalOpen(false)
    alert('Driver updated successfully!')
  }

  return (
    <>

      {/* Filter */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filter by Company Name"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Compaines List</strong>
              <CButton
                color="primary"
                className="float-end"
                onClick={() => setAddModalOpen(true)}
              >
                Add Company
              </CButton>
            </CCardHeader>
            <CCardBody>
              {data.length === 0 ? (
                <p className="text-center">No compaines available.</p>
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
                    {data.map((driver, index) => (
                      <CTableRow key={driver.id}>
                        <CTableDataCell className="text-center">{index + 1}</CTableDataCell> {/* Serial Number */}
                        <CTableDataCell className="text-center">{driver.name}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {driver.contactNumber}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{driver.address}</CTableDataCell>
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* View Profile Modal */}
      {selectedCompany && (
        <CModal
          alignment="center"
          scrollable
          visible={open}
          onClose={() => setOpen(false)}
          fullscreen
        >
          <CModalHeader>
            <CModalTitle className="d-flex align-items-center"><h5>Comapny Profile</h5></CModalTitle>
          </CModalHeader>
          <CModalBody className="shadow-md rounded-lg p-6 mb-6">
            <div className="d-flex gap-3">
              <CImage
                src={selectedCompany.profileImage || '/default-avatar.png'} // Default image fallback
                alt={selectedCompany.name}
                className="img-thumbnail rounded-circle me-3"
                width="120" // Set the desired width
                height="120" // Set the desired height
              />
              <div>
                <div className="py-2">
                  <h2>{selectedCompany.name}</h2>
                </div>
                <div>
                  <h6>GST Number: {selectedCompany.gstNumber}</h6>
                </div>
                <div>
                  <h6>Contact: {selectedCompany.contactNumber}</h6>
                </div>
                <div>
                  <h6>Address: {selectedCompany.address}</h6>
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
                  Trip Details
                </CTab>
                <CTab aria-controls="salary-slips" itemKey={4}>
                  Salary Slips
                </CTab>
              </CTabList>
              <CTabContent>
                <CTabPanel className="p-3" aria-labelledby="attendance" itemKey={1}>
                  {/* Replace with actual attendance details */}
                  {/* <AttendanceSection driverId={selectedCompany.id} /> */}
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="expenses" itemKey={2}>
                  {/* Replace with actual expenses table */}
                  {/* <ExpensesTable expenses={groupedExpenses[selectedCompany.id] || []} /> */}
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="trip-details" itemKey={3}>
                  {/* Replace with actual trips table */}
                  {/* <TripsTable trips={groupedTrips[selectedCompany.id] || []} /> */}
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="salary-slips" itemKey={4}>
                  {/* Replace with actual salary slips */}
                  {/* <SalarySlipTable salaries={groupedSalaries[selectedCompany.id] || []} /> */}
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
                  onChange={(e) => setDriverToEdit({ ...driverToEdit, contactNumber: e.target.value })}
                />
              </div>
              <div className="mb-2">
                <CFormLabel>address</CFormLabel>
                <CFormInput
                  type="text"
                  value={driverToEdit.address}
                  onChange={(e) => setDriverToEdit({ ...driverToEdit, address: e.target.value })}
                />
              </div>
              <div className="mb-2">
                <CFormLabel>GST Number</CFormLabel>
                <CFormInput
                  type="text"
                  value={driverToEdit.gstNumber}
                  onChange={(e) => setDriverToEdit({ ...driverToEdit, gstNumber: e.target.value })}
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
      <CModal alignment="center" visible={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>Add Driver</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-2">
              <CFormLabel>Name</CFormLabel>
              <CFormInput
                type="text"
                value={newDriver.name}
                onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <CFormLabel>Contact Number</CFormLabel>
              <CFormInput
                type="text"
                value={newDriver.contactNumber}
                onChange={(e) => setNewDriver({ ...newDriver, contactNumber: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <CFormLabel>address</CFormLabel>
              <CFormInput
                type="text"
                value={newDriver.address}
                onChange={(e) => setNewDriver({ ...newDriver, address: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <CFormLabel>GST Number</CFormLabel>
              <CFormInput
                type="text"
                value={newDriver.gstNumber}
                onChange={(e) => setNewDriver({ ...newDriver, gstNumber: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <CFormLabel>Password</CFormLabel>
              <CFormInput
                type="Password"
                value={newDriver.password}
                onChange={(e) => setNewDriver({ ...newDriver, password: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <CFormLabel>Profile Picture</CFormLabel>
              <CFormInput
                type="file"
                onChange={handleProfileImageChange}
              />
            </div>
            <CButton color="primary" onClick={() => handleAddDriver(newDriver)}>
              Submit
            </CButton>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

export default compainesExp
