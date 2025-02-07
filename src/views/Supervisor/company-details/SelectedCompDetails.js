import React, { useState } from 'react'
import { compaines } from './data/compaines'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CImage,
  CForm,
  CFormLabel,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { Eye } from 'lucide-react'
import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { IoCall } from 'react-icons/io5'
import { MdEmail } from 'react-icons/md'
import { IoPerson } from 'react-icons/io5'
import { FaTruckMoving } from 'react-icons/fa'
import { FaAddressCard } from 'react-icons/fa'

function SelectedCompDetails() {
  const { id } = useParams()
  const selectedCompany = compaines.find((c) => c.id === id)
  const navigate = useNavigate()

  // Branch Data State

  const [branches, setBranches] = useState([
    {
      id: 1,
      name: 'Nagpur',
      address: '123 Main St, Nagpur, 12345',
      manager: 'Manager A',
      phone: '1234567890',
      email: 'branch1@example.com',
      totalVehicle: '20',
    },
    {
      id: 2,
      name: 'Pune',
      address: '456 Oak Rd, Pune, 67890',
      manager: 'Manager B',
      phone: '9876543210',
      email: 'branch2@example.com',
      totalVehicle: '24',
    },
    {
      id: 3,
      name: 'Mumbai',
      address: '789 Pine Ave, Mumbai, 11223',
      manager: 'Manager C',
      phone: '4564564564',
      email: 'branch3@example.com',
      totalVehicle: '70',
    },
  ])

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Branch Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'manager', label: 'Manager' },
    { key: 'totalVehicle', label: 'Total Vehicles' },
  ]

  // Form State for New Branch
  const [newBranch, setNewBranch] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    manager: '',
    totalVehicle: '',
  })

  // Modal State
  const [visible, setVisible] = useState(true)

  const handleInputChange = (e) => {
    setNewBranch({ ...newBranch, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      !newBranch.name ||
      !newBranch.phone ||
      !newBranch.email ||
      !newBranch.address ||
      !newBranch.manager ||
      !newBranch.totalVehicle
    ) {
      toast.error('All fields are required!', { position: toast.POSITION.TOP_CENTER })
      return
    }

    // Add the new branch to the branches state
    setBranches([
      ...branches,
      {
        id: branches.length + 1,
        ...newBranch,
      },
    ])

    // Show success toast
    // toast.success('Branch Added Successfully!', {
    //   position: toast.POSITION.TOP_CENTER,
    //   autoClose: 2000,
    // })

    // Clear the form
    setNewBranch({
      name: '',
      phone: '',
      email: '',
      address: '',
      manager: '',
      totalVehicle: '',
    })

    // Close the modal
    setVisible(false)
  }

  return (
    <>
      {/* ToastContainer renders the toast notifications */}
      <ToastContainer />

      {/* Company Details */}
      <div className="d-flex gap-3">
        <CImage
          src={selectedCompany?.profileImage || '/default-avatar.png'}
          alt={selectedCompany?.name || 'Company'}
          className="img-thumbnail rounded-circle me-3"
          width="120"
          height="120"
        />
        <div>
          <h2 className="py-2">{selectedCompany?.name}</h2>
          <h6>GST Number: {selectedCompany?.gstNumber}</h6>
          <h6>Contact: {selectedCompany?.contactNumber}</h6>
          <h6>Address: {selectedCompany?.address}</h6>
        </div>
      </div>
      <hr />

      {/* Search Bar */}
      <CInputGroup className="w-25 mb-3" style={{ marginLeft: 'auto' }}>
        <CInputGroupText>
          <CIcon icon={cilSearch} />
        </CInputGroupText>
        <CFormInput placeholder="Search..." />
      </CInputGroup>

      {/* Branch Table */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Branch List</strong>
              <CButton color="primary" onClick={() => setVisible(true)}>
                Add Branch
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CTable striped hover responsive bordered>
                <CTableHead>
                  <CTableRow>
                    {columns.map((column, index) => (
                      <CTableHeaderCell key={index} className="text-center">
                        {column.label}
                      </CTableHeaderCell>
                    ))}
                    <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {branches.map((row, rowIndex) => (
                    <CTableRow key={rowIndex}>
                      {columns.map((column, cellIndex) => (
                        <CTableDataCell key={cellIndex} className="text-center">
                          {row[column.key]}
                        </CTableDataCell>
                      ))}
                      <CTableDataCell className="text-center">
                        <CButton
                          color="primary"
                          size="sm"
                          onClick={() => navigate(`branch-details/${row.id}`)}
                        >
                          <Eye className="me-2" size={16} />
                          View Profile
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Add Branch Modal */}
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)} size="xl">
        <CModalHeader>
          <CModalTitle>Add New Branch</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <div
              className="flex-wrap gap-5"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
            >
              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <MdDriveFileRenameOutline style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    name="name"
                    value={newBranch.name}
                    placeholder="Enter Branch Name"
                    onChange={handleInputChange}
                    required
                  />
                </CInputGroup>
              </CCol>
              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <IoCall style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    name="phone"
                    value={newBranch.phone}
                    placeholder="Enter Phone Number"
                    onChange={handleInputChange}
                    required
                  />
                </CInputGroup>
              </CCol>
            </div>

            <div
              className="flex-wrap gap-5"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
            >
              <CCol md={15}>
                <CInputGroup className="mt-5">
                  <CInputGroupText className="border-end">
                    <MdEmail style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    name="email"
                    value={newBranch.email}
                    placeholder="Enter Email Id"
                    onChange={handleInputChange}
                    required
                  />
                </CInputGroup>
              </CCol>
              <CCol md={15}>
                <CInputGroup className="mt-5">
                  <CInputGroupText className="border-end">
                    <FaAddressCard style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    name="address"
                    value={newBranch.address}
                    placeholder="Enter Address"
                    onChange={handleInputChange}
                    required
                  />
                </CInputGroup>
              </CCol>
            </div>

            <div
              className="flex-wrap gap-5"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
            >
              <CCol md={15}>
                <CInputGroup className="mt-5">
                  <CInputGroupText className="border-end">
                    <IoPerson style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    name="manager"
                    placeholder="Enter Manager Name"
                    value={newBranch.manager}
                    onChange={handleInputChange}
                    required
                  />
                </CInputGroup>
              </CCol>
              <CCol md={15}>
                <CInputGroup className="mt-5">
                  <CInputGroupText className="border-end">
                    <FaTruckMoving style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    name="totalVehicle"
                    placeholder="Enter Total Vehicles"
                    value={newBranch.totalVehicle}
                    onChange={handleInputChange}
                    required
                  />
                </CInputGroup>
              </CCol>
            </div>
            <div className="d-flex justify-content-end">
              <CButton color="primary" type="submit" className="mt-3">
                Add Branch
              </CButton>
            </div>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

export default SelectedCompDetails
