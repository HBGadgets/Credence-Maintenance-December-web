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
// import { trips } from '../compainesExpert/data/trips' // Ensure this import is correct
// import { expenses } from '../compainesExpert/data/expenses' // Import expenses
// import { salaries } from '../compainesExpert/data/salaries' // Import salaries
// import TripsTable from '../compainesExpert/components/trips/TripsTable' // Ensure this import is correct
// import ExpensesTable from '../compainesExpert/components/expenses/ExpensesTable' // Ensure this import is correct
// import SalarySlipTable from '../compainesExpert/components/salary/SalarySlipTable' // Import the SalarySlipTable component
// import AttendanceSection from '../compainesExpert/components/attendance/AttendanceSection' // Import AttendanceSection component
import { debounce } from 'lodash'
import { Select } from '@mui/material'

const compainesExp = ({ setselectedCompanyId }) => {
  const columns = ['Comapny Name', 'Contact', 'Address', 'Profile']
  const [compaines, setcompaines] = useState(initialcompaines) // Use state for the compaines list
  const [selectedCompany, setselectedCompany] = useState(null)
  const [open, setOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [newcompaines, setNewcompaines] = useState({
    name: '',
    contactNumber: '',
    address: '',
    gstNumber: '',
    password: '',
    // profileImage: null,  // State to store the selected image
  })
  const [editModalOpen, setEditModalOpen] = useState(false) // State for edit modal
  const [compainesToEdit, setcompainesToEdit] = useState(null) // State for the compaines being edited

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
  // const handleProfileImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setNewcompaines({ ...newcompaines, profileImage: file });
  //   }
  // };

  // Group trips by compainesId
  // const groupedTrips = trips.reduce((acc, trip) => {
  //   if (!acc[trip.compainesId]) {
  //     acc[trip.compainesId] = []
  //   }
  //   acc[trip.compainesId].push(trip)
  //   return acc
  // }, {})

  // Group expenses by compainesId
  // const groupedExpenses = expenses.reduce((acc, expense) => {
  //   if (!acc[expense.compainesId]) {
  //     acc[expense.compainesId] = []
  //   }
  //   acc[expense.compainesId].push(expense)
  //   return acc
  // }, {})

  // Group salaries by compainesId (assuming you have a similar salaries data)
  // const groupedSalaries = salaries.reduce((acc, salary) => {
  //   if (!acc[salary.compainesId]) {
  //     acc[salary.compainesId] = []
  //   }
  //   acc[salary.compainesId].push(salary)
  //   return acc
  // }, {})

  const handleViewClick = (compaines) => {
    setselectedCompany(compaines)
    setOpen(true)
  }

  const handleAddcompaines = () => {
    // Add new compaines logic here (e.g., send to API or update state)
    setcompaines([...compaines, newcompaines])
    setAddModalOpen(false)
    alert('New compaines added!')
  }

  const handleDeletecompaines = (compainesId) => {
    // Delete the compaines by filtering it out from the state
    setcompaines(compaines.filter(compaines => compaines.id !== compainesId))
  }

  const handleEditcompaines = (compaines) => {
    setcompainesToEdit(compaines)
    setEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    setcompaines(compaines.map(compaines =>
      compaines.id === compainesToEdit.id ? compainesToEdit : compaines
    ))
    setEditModalOpen(false)
    alert('compaines updated successfully!')
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
                    {data.map((compaines, index) => (
                      <CTableRow key={compaines.id}>
                        <CTableDataCell className="text-center">{index + 1}</CTableDataCell> {/* Serial Number */}
                        <CTableDataCell className="text-center">{compaines.name}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {compaines.contactNumber}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{compaines.address}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            color="primary"
                            size="sm"
                            onClick={() => handleViewClick(compaines)}
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
                            onClick={() => handleEditcompaines(compaines)}
                          >
                            <Edit size={16} /> {/* Edit Icon */}
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => handleDeletecompaines(compaines.id)}
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
            <CModalTitle className="d-flex align-items-center"><h5>{selectedCompany.name}</h5></CModalTitle>
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
                  Branches
                </CTab>
                <CTab aria-controls="expenses" itemKey={2}>
                  Vehicles
                </CTab>
                <CTab aria-controls="trip-details" itemKey={3}>
                  Drivers
                </CTab>
                <CTab aria-controls="salary-slips" itemKey={4}>
                  Total Bugets
                </CTab>
              </CTabList>
              <CTabContent>
                <CTabPanel className="p-3" aria-labelledby="attendance" itemKey={1}>
                  {/* Replace with actual attendance details */}
                  {/* <AttendanceSection compainesId={selectedCompany.id} /> */}
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

      {/* Edit compaines Modal */}
      {editModalOpen && compainesToEdit && (
        <CModal alignment="center" visible={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <CModalHeader>
            <CModalTitle>Edit compaines</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <div className="mb-2">
                <CFormLabel>Name</CFormLabel>
                <CFormInput
                  type="text"
                  value={compainesToEdit.name}
                  onChange={(e) => setcompainesToEdit({ ...compainesToEdit, name: e.target.value })}
                />
              </div>
              <div className="mb-2">
                <CFormLabel>Contact Number</CFormLabel>
                <CFormInput
                  type="text"
                  value={compainesToEdit.contactNumber}
                  onChange={(e) => setcompainesToEdit({ ...compainesToEdit, contactNumber: e.target.value })}
                />
              </div>
              <div className="mb-2">
                <CFormLabel>Address</CFormLabel>
                <CFormInput
                  type="text"
                  value={compainesToEdit.address}
                  onChange={(e) => setcompainesToEdit({ ...compainesToEdit, address: e.target.value })}
                />
              </div>
              <div className="mb-2">
                <CFormLabel>GST Number</CFormLabel>
                <CFormInput
                  type="text"
                  value={compainesToEdit.gstNumber}
                  onChange={(e) => setcompainesToEdit({ ...compainesToEdit, gstNumber: e.target.value })}
                />
              </div>
              <div className="mb-2">
                <CFormLabel>Password</CFormLabel>
                <CFormInput
                  type="password"
                  value={compainesToEdit.password}
                  onChange={(e) => setcompainesToEdit({ ...compainesToEdit, password: e.target.value })}
                />
              </div>
              <CButton color="primary" onClick={handleSaveEdit}>
                Save Changes
              </CButton>
            </CForm>
          </CModalBody>
        </CModal>
      )}

      {/* Add compaines Modal */}
      <CModal alignment="center" visible={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>Add compaines</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-2">
              <CFormLabel>Name</CFormLabel>
              <CFormInput
                type="text"
                value={newcompaines.name}
                onChange={(e) => setNewcompaines({ ...newcompaines, name: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <CFormLabel>Contact Number</CFormLabel>
              <CFormInput
                type="text"
                value={newcompaines.contactNumber}
                onChange={(e) => setNewcompaines({ ...newcompaines, contactNumber: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <CFormLabel>Address</CFormLabel>
              <CFormInput
                type="text"
                value={newcompaines.address}
                onChange={(e) => setNewcompaines({ ...newcompaines, address: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <CFormLabel>GST Number</CFormLabel>
              <CFormInput
                type="text"
                value={newcompaines.gstNumber}
                onChange={(e) => setNewcompaines({ ...newcompaines, gstNumber: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <CFormLabel>Password</CFormLabel>
              <CFormInput
                type="Password"
                value={newcompaines.password}
                onChange={(e) => setNewcompaines({ ...newcompaines, password: e.target.value })}
              />
            </div>
            {/* <div className="mb-2">
              <CFormLabel>Profile Picture</CFormLabel>
              <CFormInput
                type="file"
                onChange={handleProfileImageChange}
              />
            </div> */}
            <CButton color="primary" onClick={() => handleAddcompaines(newcompaines)}>
              Submit
            </CButton>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

export default compainesExp
