import React, { useEffect, useState } from 'react'
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
import { FaEye } from 'react-icons/fa'

import { IoTrashBin } from 'react-icons/io5'

import { cilSearch } from '@coreui/icons'
import { FaUserEdit } from 'react-icons/fa'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// import { tyreMange } from '../Tyre-Management/Data'

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
  const navigate = useNavigate()
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
    { label: 'Tread Pattern', key: 'treadPattern' },
    { label: 'Construction Type', key: 'constructionType' },
    { label: 'Vehicle', key: 'assignedToVehicle' },
    { label: 'Position', key: 'wheelPosition' },
    { label: 'Document', key: 'documents' },
    { label: 'Action', key: 'action' },
  ]

  const [modalVisible, setModalVisible] = useState(false)
  const [newTyre, setNewTyre] = useState({
    serialNumber: '',
    vendor: '',
    brand: '',
    treadPattern: '',
    constructionType: '',
    size: '',
    treadDepth: '',
    pressure: '',
    purchaseDate: '',
    status: '',
    distance: '',
    documents: [],
  })
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [tyres, setTyres] = useState([])

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

  const handleFileChange = (event) => {
    const files = event.target.files
    setSelectedFiles(files)
  }

  const fetchTyres = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tyre`)
      const data = await response.json()
      setTyres(data)
    } catch (error) {
      console.error('Error fetching tyres:', error)
    }
  }

  useEffect(() => {
    fetchTyres()
  }, [])

  const handleAddTyre = () => {
    setIsEditing(false)
    setNewTyre({
      serialNumber: '',
      vendor: '',
      brand: '',
      treadPattern: '',
      constructionType: '',
      size: '',
      treadDepth: '',
      pressure: '',
      purchaseDate: '',
      status: '',
      distance: '',
      documents: [],
    })
    setModalVisible(true)
  }

  const handleEditTyre = (index) => {
    setIsEditing(true)
    setNewTyre({ ...tyres[index] })
    setEditIndex(tyres[index]._id)
    setModalVisible(true)
  }

  const handleDeleteTyre = async (tyreId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/tyre/${tyreId}`)
      console.log('Tyre deleted:', response.data)
      const updatedTyres = tyres.filter((tyre) => tyre._id !== tyreId)
      setTyres(updatedTyres)
    } catch (error) {
      console.error('Error deleting tyre:', error)
    }
  }

  const handleSaveTyre = async () => {
    console.log('newTyre', newTyre)

    const formData = new FormData()
    Object.keys(newTyre).forEach((key) => {
      if (newTyre[key]) {
        // Ensure only defined values are appended
        formData.append(key, newTyre[key])
      }
    })

    // Append selected files
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('documents', selectedFiles[i])
    }

    console.log('formData', formData)

    try {
      let response
      if (isEditing) {
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/tyre/${editIndex}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } },
        )
      } else {
        response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tyre`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      if (response.status === 200 || response.status === 201) {
        alert('Tyre saved successfully!')

        try {
          setModalVisible(false)
          await fetchTyres() // Refresh tyre list

          setNewTyre({
            serialNumber: '',
            vendor: '',
            brand: '',
            treadPattern: '',
            constructionType: '',
            size: '',
            treadDepth: '',
            pressure: '',
            purchaseDate: '',
            status: '',
            distance: '',
            documents: [],
          })
          setIsEditing(false)
          setEditIndex(null)
        } catch (postSuccessError) {
          console.error('Error after saving tyre:', postSuccessError)
        }
      }
    } catch (error) {
      console.error('Error saving tyre:', error)
      alert('Failed to save tyre. Please try again.')
    }
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
                            ) : col.key === 'documents' ? ( // Render View button only in Document column
                              <CButton
                                color="info"
                                size="sm"
                                // onClick={() => console.log('Viewing document:', tyre.documents)}
                                onClick={() => navigate(`${tyre._id}`)}
                              >
                                <FaEye size={18} /> View
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
                              <FaUserEdit style={{ fontSize: '18px' }} />
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => handleDeleteTyre(tyre._id)}
                            >
                              <IoTrashBin style={{ fontSize: '18px' }} />
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
                {' '}
                {/* Fixed grid issue */}
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <FaHandshake style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormSelect
                    name="treadPattern"
                    value={newTyre.treadPattern}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Tyre Pattern</option>
                    <option value="rib">Rib</option>
                    <option value="lug">Lug</option>
                    <option value="block">Block</option>
                    <option value="mixed">Mixed</option>
                    <option value="directional">Directional</option>
                    <option value="asymmetric">Asymmetric</option>
                  </CFormSelect>
                </CInputGroup>
              </CCol>

              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <FaHandshake style={{ fontSize: '22px', color: 'gray' }} />{' '}
                    {/* Gear icon for construction type */}
                  </CInputGroupText>
                  <CFormSelect
                    name="constructionType"
                    value={newTyre.constructionType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Tyre Construction Type</option>
                    <option value="radial">Radial</option>
                    <option value="bias">Bias-Ply (Cross-Ply)</option>
                    <option value="axial">Axial</option>
                  </CFormSelect>
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
              {/* <CCol md={15} style={{ marginTop: '25px', marginBottom: '25px' }}>
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
              </CCol> */}

              {/* <CCol md={15} style={{ marginTop: '25px', marginBottom: '25px' }}>
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
              </CCol> */}
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

              <CCol md={15} style={{ marginTop: '25px', marginBottom: '25px' }}>
                <CInputGroup>
                  <CInputGroupText className="border-end">
                    <IoFileTrayFull style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="file"
                    name="documents"
                    accept="image/*,application/pdf" // Allows images & PDFs
                    onChange={handleFileChange}
                    multiple
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
