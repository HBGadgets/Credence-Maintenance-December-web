import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CButton,
} from '@coreui/react'

const UpdateCompanyModal = ({ visible, onClose, initialData = {}, onSave }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    address: initialData.address || '',
    gstin: initialData.gstin || '',
    officeNumber: initialData.officeNumber || '',
    mobileNumber: initialData.mobileNumber || '',
    website: initialData.website || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    if (onSave) {
      onSave(formData)
    }
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static">
      <CModalHeader closeButton>
        <CModalTitle>Edit Company Profile</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div className="mb-3">
            <CFormLabel>Company Name</CFormLabel>
            <CFormInput
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company name"
            />
          </div>

          <div className="mb-3">
            <CFormLabel>Address</CFormLabel>
            <CFormTextarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              rows={2}
            />
          </div>

          <div className="mb-3">
            <CFormLabel>GSTIN</CFormLabel>
            <CFormInput
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              placeholder="Enter GSTIN"
            />
          </div>

          <div className="mb-3">
            <CFormLabel>Office Number</CFormLabel>
            <CFormInput
              name="officeNumber"
              value={formData.officeNumber}
              onChange={handleChange}
              placeholder="Enter office number"
            />
          </div>

          <div className="mb-3">
            <CFormLabel>Mobile Number</CFormLabel>
            <CFormInput
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />
          </div>

          <div className="mb-3">
            <CFormLabel>Website</CFormLabel>
            <CFormInput
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Enter website"
            />
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          Save Changes
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default UpdateCompanyModal
