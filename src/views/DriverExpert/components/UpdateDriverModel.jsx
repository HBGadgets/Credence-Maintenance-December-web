/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { updateDriver } from '../data/drivers'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function UpdateDriverModel({ visible, setVisible, driver }) {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    password: '',
    licenseNumber: '',
    aadharNumber: '',
    profileImage: null,
    licenseImage: null,
    aadharImage: null,
  })

  const [errors, setErrors] = useState({})
  const queryClient = useQueryClient()

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name || '',
        contactNumber: driver.contactNumber || '',
        email: driver.email || '',
        password: '',
        licenseNumber: driver.licenseNumber || '',
        aadharNumber: driver.aadharNumber || '',
        profileImage: null,
        licenseImage: null,
        aadharImage: null,
      })
    }
  }, [driver])

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.'
    }

    const contactStr = String(formData.contactNumber || '').trim()
    if (!contactStr) {
      newErrors.contactNumber = 'Contact number is required.'
    } else if (!/^[0-9]{10}$/.test(contactStr)) {
      newErrors.contactNumber = 'Enter a valid 10-digit number.'
    }

    return newErrors
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const mutation = useMutation({
    mutationFn: ({ id, data }) => updateDriver(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['drivers'])
      setVisible(false)
    },
    onError: (error) => {
      console.error('Update failed:', error.message)
      alert(error.message || 'Failed to update driver.')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const form = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, value)
      }
    })

    console.log('driver:', driver)

    mutation.mutate({ id: driver.id, data: form })
  }

  return (
    <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>Edit Driver</CModalTitle>
      </CModalHeader>
      <CForm noValidate onSubmit={handleSubmit}>
        <CModalBody>
          <CRow className="mb-2">
            <CCol md={6}>
              <CFormLabel htmlFor="name">Name *</CFormLabel>
              <CFormInput
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                invalid={!!errors.name}
              />
              {errors.name && <CFormText className="text-danger">{errors.name}</CFormText>}
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="contactNumber">Contact Number *</CFormLabel>
              <CFormInput
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                invalid={!!errors.contactNumber}
              />
              {errors.contactNumber && (
                <CFormText className="text-danger">{errors.contactNumber}</CFormText>
              )}
            </CCol>
          </CRow>

          <CRow className="mb-2">
            <CCol md={6}>
              <CFormLabel htmlFor="email">Email</CFormLabel>
              <CFormInput
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="password">Password</CFormLabel>
              <CFormInput
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </CCol>
          </CRow>

          <CRow className="mb-2">
            <CCol md={6}>
              <CFormLabel htmlFor="licenseNumber">License Number</CFormLabel>
              <CFormInput
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="aadharNumber">Aadhar Number</CFormLabel>
              <CFormInput
                type="text"
                id="aadharNumber"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
              />
            </CCol>
          </CRow>

          <CRow className="mb-2">
            <CCol md={4}>
              <CFormLabel htmlFor="profileImage">Profile Image</CFormLabel>
              <CFormInput
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="licenseImage">License Image</CFormLabel>
              <CFormInput
                type="file"
                id="licenseImage"
                name="licenseImage"
                accept="image/*"
                onChange={handleChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="aadharImage">Aadhar Image</CFormLabel>
              <CFormInput
                type="file"
                id="aadharImage"
                name="aadharImage"
                accept="image/*"
                onChange={handleChange}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" type="submit">
            Update Driver
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

UpdateDriverModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  driver: PropTypes.object,
}

export default UpdateDriverModel
