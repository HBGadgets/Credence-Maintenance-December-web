import React, { useState } from 'react'
import './TyreInventoryCSS.css'
import {
  CCol,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CRow,
  CCardHeader,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CTableBody,
  CInputGroup, CInputGroupText
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react';
import { cilSearch } from '@coreui/icons';

const TyreInventory = () => {
  const [tyres, setTyres] = useState([
    {
      id: 1,
      serialNumber: 'TYR12345',
      vendor: 'Goodyear',
      brand: 'MRF',
      pattern: 'Radial',
      size: '18',
      treadDepth: '10mm',
      pressure: '35psi',
      purchaseDate: '2024-03-15',
      status: 'New',
      distance: 12000,
      document: 'document-link-1.pdf',
      assignedToVehicle: 'MH34522',
      wheelPosition: 'Front-Left',
    },
    {
      id: 2,
      serialNumber: 'TYR12346',
      vendor: 'Michelin',
      brand: 'MRF',
      pattern: 'Radial',
      size: '18',
      treadDepth: '10mm',
      pressure: '35psi',
      purchaseDate: '2023-08-10',
      status: 'In Use',
      distance: 25000,
      document: 'document-link-2.pdf',
      assignedToVehicle: 'MH45697',
      wheelPosition: 'Front-Right',
    },
    {
      id: 3,
      serialNumber: 'TYR12347',
      vendor: 'Pirelli',
      brand: 'MRF',
      pattern: 'Radial',
      size: '18',
      treadDepth: '10mm',
      pressure: '35psi',
      purchaseDate: '2023-01-20',
      status: 'Needs Replacement',
      distance: 30000,
      document: 'document-link-3.pdf',
      assignedToVehicle: 'MH23476',
      wheelPosition: 'Rear-Right',
    },
    {
      id: 4,
      serialNumber: 'TYR12348',
      vendor: 'Pirelli',
      brand: 'MRF',
      pattern: 'Radial',
      size: '18',
      treadDepth: '10mm',
      pressure: '35psi',
      purchaseDate: '2023-01-20',
      status: 'Needs Replacement',
      distance: 30000,
      document: 'document-link-3.pdf',
      assignedToVehicle: 'MH45675',
      wheelPosition: 'Rear-Left',
    },
  ])

  const columns = [
    { label: 'Serial Number', key: 'serialNumber' },
    { label: 'Vendor', key: 'vendor' },
    { label: 'Purchase Date', key: 'purchaseDate' },
    { label: 'Status', key: 'status' },
    { label: 'Distance (km)', key: 'distance' },
    { label: 'Size', key: 'size' },
    { label: 'Brand', key: 'brand' },
    { label: 'Pressure', key: 'pressure' },
    { label: 'Tread Depth', key: 'treadDepth' },
    { label: 'Vehicle', key: 'assignedToVehicle' },
    { label: 'Position', key: 'wheelPosition' },
    { label: 'Document', key: 'document' },
  ]

  const [modalVisible, setModalVisible] = useState(false)
  const [newTyre, setNewTyre] = useState({
    serialNumber: '',
    vendor: '',
    purchaseDate: '',
    status: '',
    distance: '',
    document: '',
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Filtered Data
  const filteredInventory = tyres.filter(
    (tyre) =>
      Object.values(tyre)
        .join(' ') // Combine all values into a single string
        .toLowerCase()
        .includes(searchQuery.toLowerCase()), // Check if search query matches any value
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTyre({ ...newTyre, [name]: value })
  }

  const handleAddTyre = () => {
    setIsEditing(false)
    setNewTyre({
      serialNumber: '',
      vendor: '',
      purchaseDate: '',
      status: '',
      distance: '',
      document: '',
    })
    setModalVisible(true)
  }

  const handleEditTyre = (index) => {
    setIsEditing(true)
    setEditIndex(index)
    setNewTyre({ ...tyres[index] })
    setModalVisible(true)
  }

  const handleDeleteTyre = (index) => {
    const updatedTyres = tyres.filter((_, i) => i !== index)
    setTyres(updatedTyres)
  }

  const handleSaveTyre = () => {
    if (isEditing) {
      const updatedTyres = [...tyres]
      updatedTyres[editIndex] = newTyre
      setTyres(updatedTyres)
    } else {
      setTyres([...tyres, newTyre])
    }
    setModalVisible(false)
  }

  return (
    <>
      <nav style={{ display: 'flex', justifyContent: 'end', gap: '0.6rem' }}>
        {/* <CFormInput
          type="text"
          placeholder="Search Tyres..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-3 w-25"
        /> */}
        <CInputGroup className="mb-3 w-25">
          <CInputGroupText>
            <CIcon icon={cilSearch} />
          </CInputGroupText>
          <CFormInput
            type="text"
            placeholder="Search Tyres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CInputGroup>
        <CButton
          onClick={handleAddTyre}
          className="mb-3 "
          style={{ background: '#e37c0e', color: 'white' }}
        >
          Add Tyre
        </CButton>
      </nav>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <strong>Tyre Inventory</strong>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive striped bordered>
                <CTableHead>
                  <CTableRow className='text-nowrap text-center'>
                    <CTableHeaderCell>Sr. No.</CTableHeaderCell> {/* For Actions */}
                    {columns.map((col) => (
                      <CTableHeaderCell key={col.key}>{col.label}</CTableHeaderCell>
                    ))}
                    <CTableHeaderCell>Actions</CTableHeaderCell> {/* For Actions */}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((tyre, index) => (
                      <CTableRow key={index} className='text-nowrap text-center'>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        {columns.map((col) => (
                          <CTableDataCell key={col.key}>
                            {col.key === 'purchaseDate' ? (
                              new Date(tyre[col.key]).toLocaleDateString()
                            ) : col.key === 'document' ? ( // Render View button only in Document column
                              <CButton
                                color="info"
                                size="sm"
                                onClick={() => console.log('Viewing document:', tyre.document)}
                              >
                                View
                              </CButton>
                            ) : (
                              tyre[col.key]
                            )}
                          </CTableDataCell>
                        ))}
                        <CTableDataCell>
                          <div className="d-flex gap-2">
                            <CButton
                              color="warning"
                              size="sm"
                              onClick={() => handleEditTyre(index)}
                            >
                              Edit
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => handleDeleteTyre(index)}
                            >
                              Delete
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={columns.length + 1}>
                        No matching results found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
              
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal for Adding/Editing Tyre */}
      <CModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        className="my-custom-modal"
        alignment="center"
      >
        <CModalHeader>{isEditing ? 'Edit Tyre' : 'Add New Tyre'}</CModalHeader>
        <CModalBody>
          <CForm>
            {/* Serial Number, Vendor, and Brand */}
            <CRow>
              <CCol sm={4}>
                <div className="mb-3">
                  <CFormLabel>Serial Number</CFormLabel>
                  <CFormInput
                    type="text"
                    name="serialNumber"
                    value={newTyre.serialNumber}
                    onChange={handleInputChange}
                    placeholder="Enter Serial Number"
                  />
                </div>
              </CCol>
              <CCol sm={4}>
                <div className="mb-3">
                  <CFormLabel>Vendor</CFormLabel>
                  <CFormInput
                    type="text"
                    name="vendor"
                    value={newTyre.vendor}
                    onChange={handleInputChange}
                    placeholder="Enter Vendor Name"
                  />
                </div>
              </CCol>
              <CCol sm={4}>
                <div className="mb-3">
                  <CFormLabel>Brand</CFormLabel>
                  <CFormInput
                    type="text"
                    name="brand"
                    value={newTyre.brand}
                    onChange={handleInputChange}
                    placeholder="Enter Tyre Brand"
                  />
                </div>
              </CCol>
            </CRow>

            {/* Pattern, Size, and Tread Depth */}
            <CRow>
              <CCol sm={4}>
                <div className="mb-3">
                  <CFormLabel>Pattern</CFormLabel>
                  <CFormInput
                    type="text"
                    name="pattern"
                    value={newTyre.pattern}
                    onChange={handleInputChange}
                    placeholder="Enter Tyre Pattern"
                  />
                </div>
              </CCol>
              <CCol sm={4}>
                <div className="mb-3">
                  <CFormLabel>Size</CFormLabel>
                  <CFormInput
                    type="text"
                    name="size"
                    value={newTyre.size}
                    onChange={handleInputChange}
                    placeholder="Enter Tyre Size"
                  />
                </div>
              </CCol>
              <CCol sm={4}>
                <div className="mb-3">
                  <CFormLabel>Tread Depth</CFormLabel>
                  <CFormInput
                    type="text"
                    name="treadDepth"
                    value={newTyre.treadDepth}
                    onChange={handleInputChange}
                    placeholder="Enter Tread Depth"
                  />
                </div>
              </CCol>
            </CRow>

            {/* Pressure, Purchase Date, and Status */}
            <CRow>
              <CCol sm={4}>
                <div className="mb-3">
                  <CFormLabel>Pressure</CFormLabel>
                  <CFormInput
                    type="text"
                    name="pressure"
                    value={newTyre.pressure}
                    onChange={handleInputChange}
                    placeholder="Enter Pressure (e.g., 35psi)"
                  />
                </div>
              </CCol>
              <CCol sm={4}>
                <div className="mb-3">
                  <CFormLabel>Purchase Date</CFormLabel>
                  <CFormInput
                    type="date"
                    name="purchaseDate"
                    value={newTyre.purchaseDate}
                    onChange={handleInputChange}
                  />
                </div>
              </CCol>
              <CCol sm={4}>
                <div className="mb-3">
                  <CFormLabel>Status</CFormLabel>
                  <CFormSelect name="status" value={newTyre.status} onChange={handleInputChange}>
                    <option value="">Select Status</option>
                    <option value="New">New</option>
                    <option value="In Use">In Use</option>
                    <option value="Needs Replacement">Needs Replacement</option>
                  </CFormSelect>
                </div>
              </CCol>
            </CRow>

            {/* Assigned Vehicle, Wheel Position, and Document Link */}
            <CRow>
              <CCol sm={4}>
                <div className="mb-3">
                  <CFormLabel>Assigned to Vehicle</CFormLabel>
                  <CFormInput
                    type="text"
                    name="assignedToVeicle"
                    value={newTyre.assignedToVeicle}
                    onChange={handleInputChange}
                    placeholder="Enter Vehicle ID"
                  />
                </div>
              </CCol>
              <CCol sm={4}>
                <div className="mb-3">
                  <CFormLabel>Wheel Position</CFormLabel>
                  <CFormInput
                    type="text"
                    name="wheelPosition"
                    value={newTyre.wheelPosition}
                    onChange={handleInputChange}
                    placeholder="Enter Wheel Position (e.g., Front-Left)"
                  />
                </div>
              </CCol>
              <CCol sm={4}>
                <div className="mb-3">
                  <CFormLabel>Document Link</CFormLabel>
                  <CFormInput
                    type="text"
                    name="document"
                    value={newTyre.document}
                    onChange={handleInputChange}
                    placeholder="Enter Document Link"
                  />
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSaveTyre}>
            {isEditing ? 'Save Changes' : 'Add Tyre'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default TyreInventory
