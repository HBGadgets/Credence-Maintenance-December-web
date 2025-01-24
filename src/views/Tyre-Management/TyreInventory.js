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
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

import { tyreMange } from '../Tyre-Management/Data'

// **********icons**********
import { PiListNumbersFill } from 'react-icons/pi'
import { IoPerson } from 'react-icons/io5'
import { TbBrandBebo } from 'react-icons/tb'
import { FaHandshake } from 'react-icons/fa6'
import { IoMdResize } from 'react-icons/io'
import { TbArrowAutofitWidth } from 'react-icons/tb'
import { MdOutlineAir } from 'react-icons/md'
import { FaCalendarAlt } from 'react-icons/fa'
import { GrStatusDisabledSmall } from 'react-icons/gr'
import { FaTruckMoving } from 'react-icons/fa'
import { GiCarWheel } from 'react-icons/gi'
import { IoFileTrayFull } from 'react-icons/io5'

const TyreInventory = () => {
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
    { label: 'Action', key: 'action' },
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
  const [tyres, setTyres] = useState(tyreMange)

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
                  <CTableRow className="text-nowrap text-center">
                    <CTableHeaderCell>Sr. No.</CTableHeaderCell> {/* For Actions */}
                    {columns.map((col) => (
                      <CTableHeaderCell key={col.key}>{col.label}</CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((tyre, index) => (
                      <CTableRow key={index} className="text-nowrap text-center">
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
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '20px',
                marginTop: '20px',
              }}
            >
              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <PiListNumbersFill style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="serialNumber"
                    value={newTyre.serialNumber}
                    onChange={handleInputChange}
                    placeholder="Enter Serial Number"
                  />
                </CInputGroup>
              </CCol>

              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <IoPerson style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="vendor"
                    value={newTyre.vendor}
                    onChange={handleInputChange}
                    placeholder="Enter Vendor Name"
                  />
                </CInputGroup>
              </CCol>

              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <TbBrandBebo style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="brand"
                    value={newTyre.brand}
                    onChange={handleInputChange}
                    placeholder="Enter Tyre Brand"
                  />
                </CInputGroup>
              </CCol>
            </div>

            {/* Pattern, Size, and Tread Depth */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '20px',
                marginTop: '25px',
              }}
            >
              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <FaHandshake style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="pattern"
                    value={newTyre.pattern}
                    onChange={handleInputChange}
                    placeholder="Enter Tyre Pattern"
                  />
                </CInputGroup>
              </CCol>

              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <IoMdResize style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="size"
                    value={newTyre.size}
                    onChange={handleInputChange}
                    placeholder="Enter Tyre Size"
                  />
                </CInputGroup>
              </CCol>

              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <TbArrowAutofitWidth style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="treadDepth"
                    value={newTyre.treadDepth}
                    onChange={handleInputChange}
                    placeholder="Enter Tread Depth"
                  />
                </CInputGroup>
              </CCol>
            </div>
            {/* Pressure, Purchase Date, and Status */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '20px',
                marginTop: '25px',
              }}
            >
              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <MdOutlineAir style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="pressure"
                    value={newTyre.pressure}
                    onChange={handleInputChange}
                    placeholder="Enter Pressure (e.g., 35psi)"
                  />
                </CInputGroup>
              </CCol>

              <CCol md={15} style={{ marginTop: '25px' }}>
                <CInputGroup>
                  <CInputGroupText className="border-end">
                    <FaCalendarAlt style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="date"
                    name="purchaseDate"
                    value={newTyre.purchaseDate}
                    onChange={handleInputChange}
                  />
                </CInputGroup>
              </CCol>

              <CCol md={15} style={{ marginTop: '25px' }}>
                <CInputGroup>
                  <CInputGroupText className="border-end">
                    <GrStatusDisabledSmall style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormSelect name="status" value={newTyre.status} onChange={handleInputChange}>
                    <option value="">Select Status</option>
                    <option value="New">New</option>
                    <option value="In Use">In Use</option>
                    <option value="Needs Replacement">Needs Replacement</option>
                  </CFormSelect>
                </CInputGroup>
              </CCol>
            </div>

            {/* Assigned Vehicle, Wheel Position, and Document Link */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '20px',
                marginTop: '25px',
              }}
            >
              <CCol md={15} style={{ marginTop: '25px', marginBottom: '25px' }}>
                <CInputGroup>
                  <CInputGroupText className="border-end">
                    <FaTruckMoving style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="assignedToVeicle"
                    value={newTyre.assignedToVeicle}
                    onChange={handleInputChange}
                    placeholder="Enter Vehicle ID"
                  />
                </CInputGroup>
              </CCol>

              <CCol md={15} style={{ marginTop: '25px', marginBottom: '25px' }}>
                <CInputGroup>
                  <CInputGroupText className="border-end">
                    <GiCarWheel style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="wheelPosition"
                    value={newTyre.wheelPosition}
                    onChange={handleInputChange}
                    placeholder="Enter Wheel Position (e.g., Front-Left)"
                  />
                </CInputGroup>
              </CCol>

              <CCol md={15} style={{ marginTop: '25px', marginBottom: '25px' }}>
                <CInputGroup>
                  <CInputGroupText className="border-end">
                    <IoFileTrayFull style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="document"
                    value={newTyre.document}
                    onChange={handleInputChange}
                    placeholder="Enter Document Link"
                  />
                </CInputGroup>
              </CCol>
            </div>
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
