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
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import BranchList from "./BranchList"
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
import { IoPerson } from 'react-icons/io5'
import { IoCall } from 'react-icons/io5'
import { MdEmail } from 'react-icons/md'
import { IoDocumentText } from 'react-icons/io5'
import { FaAddressCard } from 'react-icons/fa'
import { RiLockPasswordFill } from 'react-icons/ri'

const compainesExp = ({ setselectedCompanyId }) => {
  const columns = [
    { label: 'SN', key: 'sn', sortable: true },
    { label: 'Company Name', key: 'name', sortable: true },
    { label: 'Contact', key: 'contact', sortable: true },
    { label: 'Address', key: 'address', sortable: true },
    { label: 'View Profile', key: 'profile', sortable: true },
    { label: 'Action', key: 'action', sortable: false },
  ]
  // const columns = ['Comapny Name', 'Contact', 'Address', 'Profile']
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

  const [data, setData] = useState(compaines) // Assuming compaines are available
  const [filter, setFilter] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }) // Sorting configuration

  // Logic for Filter
  const debouncedFilterChange = debounce((value) => {
    const filteredData = compaines.filter((row) =>
      row.name.toLowerCase().includes(value.toLowerCase()),
    )
    setData(filteredData)
  }, 300)

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
    debouncedFilterChange(e.target.value)
  }

  const handleSort = (key) => {
    if (!columns.find((column) => column.key === key && column.sortable)) return // Prevent sorting on non-sortable columns

    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })

    const sorted = [...filteredVehicles].sort((a, b) => {
      if (['sn', 'name', 'contact', 'address'].includes(key)) {
        const aIndex = vehicles.indexOf(a)
        const bIndex = vehicles.indexOf(b)
        return direction === 'asc' ? aIndex - bIndex : bIndex - aIndex
      }

      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })

    setFilteredVehicles(sorted)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼'
    }
    return '↕'
  }

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
    setcompaines(compaines.filter((compaines) => compaines.id !== compainesId))
  }

  const handleEditcompaines = (compaines) => {
    setcompainesToEdit(compaines)
    setEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    setcompaines(
      compaines.map((compaines) =>
        compaines.id === compainesToEdit.id ? compainesToEdit : compaines,
      ),
    )
    setEditModalOpen(false)
    alert('compaines updated successfully!')
  }

  return (
    <>
      <CRow>
        <div>
          {' '}
          <CButton color="primary" className="float-end mb-2" onClick={() => setAddModalOpen(true)}>
            Add Company
          </CButton>
        </div>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Compaines List</strong>
              <CFormInput
                type="text"
                placeholder="Search Company..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-25"
                style={{
                  boxShadow: filter ? '0 0 8px rgba(0, 123, 255, 0.75)' : 'none',
                  borderColor: filter ? '#007bff' : undefined,
                }}
              />
            </CCardHeader>

            <CCardBody>
              {data.length === 0 ? (
                <p className="text-center">No compaines available.</p>
              ) : (
                <CTable striped hover responsive bordered>
                  <CTableHead>
                    <CTableRow>
                      {columns.map((column, index) => (
                        <CTableHeaderCell
                          key={index}
                          className="text-center"
                          onClick={() => column.sortable && handleSort(column.key)}
                          style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                        >
                          {column.label} {column.sortable && getSortIcon(column.key)}
                        </CTableHeaderCell>
                      ))}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {data.map((compaines, index) => (
                      <CTableRow key={compaines.id}>
                        <CTableDataCell className="text-center">{index + 1}</CTableDataCell>{' '}
                        {/* Serial Number */}
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
            <CModalTitle className="d-flex align-items-center">
              <h5>{selectedCompany.name}</h5>
            </CModalTitle>
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
            {/* <CTabs activeItemKey={1}>
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
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="expenses" itemKey={2}>
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="trip-details" itemKey={3}>
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="salary-slips" itemKey={4}>
                </CTabPanel>
              </CTabContent>
            </CTabs> */}
            <BranchList />
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
                  onChange={(e) =>
                    setcompainesToEdit({ ...compainesToEdit, contactNumber: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <CFormLabel>Address</CFormLabel>
                <CFormInput
                  type="text"
                  value={compainesToEdit.address}
                  onChange={(e) =>
                    setcompainesToEdit({ ...compainesToEdit, address: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <CFormLabel>GST Number</CFormLabel>
                <CFormInput
                  type="text"
                  value={compainesToEdit.gstNumber}
                  onChange={(e) =>
                    setcompainesToEdit({ ...compainesToEdit, gstNumber: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <CFormLabel>Password</CFormLabel>
                <CFormInput
                  type="password"
                  value={compainesToEdit.password}
                  onChange={(e) =>
                    setcompainesToEdit({ ...compainesToEdit, password: e.target.value })
                  }
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
      <CModal
        alignment="center"
        visible={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Add Companies</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm style={{ width: '100%' }}>
            <div
              className="flex-wrap gap-2"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
            >
              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <IoPerson style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    name="Enter Name"
                    placeholder="Enter Name"
                    value={newcompaines.name}
                    onChange={(e) => setNewcompaines({ ...newcompaines, name: e.target.value })}
                  />
                </CInputGroup>
              </CCol>

              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <IoCall style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    placeholder="Enter Contact No"
                    value={newcompaines.contactNumber}
                    // style={{ flex: 1 }}
                    onChange={(e) =>
                      setNewcompaines({ ...newcompaines, contactNumber: e.target.value })
                    }
                  />
                </CInputGroup>
              </CCol>
            </div>
            <div
              className="flex-wrap gap-2"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <FaAddressCard style={{ fontSize: '20px', color: 'gray' }} />
                  </CInputGroupText>

                  <CFormInput
                    type="text"
                    placeholder="Enter Address"
                    value={newcompaines.address}
                    onChange={(e) => setNewcompaines({ ...newcompaines, address: e.target.value })}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <IoDocumentText style={{ fontSize: '20px', color: 'gray' }} />
                  </CInputGroupText>

                  <CFormInput
                    type="text"
                    placeholder="Enter GST Number"
                    value={newcompaines.gstNumber}
                    onChange={(e) =>
                      setNewcompaines({ ...newcompaines, gstNumber: e.target.value })
                    }
                  />
                </CInputGroup>
              </CCol>
              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <RiLockPasswordFill style={{ fontSize: '20px', color: 'gray' }} />
                  </CInputGroupText>

                  <CFormInput
                    type="password"
                    placeholder="Enter Password"
                    value={newcompaines.password}
                    onChange={(e) => setNewcompaines({ ...newcompaines, password: e.target.value })}
                  />
                </CInputGroup>
              </CCol>
            </div>
            <div className="text-end mt-3">
              <CButton color="primary" onClick={() => handleAddcompaines(newcompaines)}>
                Submit
              </CButton>
            </div>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

export default compainesExp
