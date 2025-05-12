/* eslint-disable prettier/prettier */
import React, { use, useState } from 'react'
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
import { addDriver, fetchDrivers } from '../data/drivers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'

function AddDriverModel({ visible, setVisible }) {
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

  const resetForm = () => {
    setFormData({
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
    setErrors({})
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required.'
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required.'
    else if (!/^[0-9]{10}$/.test(formData.contactNumber.trim()))
      newErrors.contactNumber = 'Enter a valid 10-digit number.'
    if (!formData.password.trim()) newErrors.password = 'Password is required.'
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters long.'
    return newErrors
  }

  useQuery({
    queryKey: ['drivers'],
    queryFn: fetchDrivers,
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    const updatedValue = files ? files[0] : value

    setFormData({ ...formData, [name]: updatedValue })

    // Clear error on field change
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const mutation = useMutation({
    mutationFn: (formData) => addDriver(formData),
    onSuccess: (data) => {
      console.log('Driver added:', data)
      queryClient.invalidateQueries(['drivers'])
      setVisible(false)
      resetForm()

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Driver added successfully!',
        timer: 2000,
        showConfirmButton: false,
      })
    },
    onError: (error) => {
      alert(`Failed to add driver: ${error.response?.data?.message || error.message}`)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    // Trim string fields
    const cleanedFormData = { ...formData }
    for (const key in cleanedFormData) {
      if (typeof cleanedFormData[key] === 'string') {
        cleanedFormData[key] = cleanedFormData[key].trim()
      }
    }

    const form = new FormData()
    for (const key in formData) {
      if (formData[key]) form.append(key, formData[key])
    }

    mutation.mutate(form)
  }

  return (
    <CModal
      alignment="center"
      scrollable
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="AddDriverModal"
    >
      <CModalHeader>
        <CModalTitle id="AddDriverModal">Add Driver</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm noValidate onSubmit={handleSubmit}>
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
              <CFormLabel htmlFor="password">Password *</CFormLabel>
              <CFormInput
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                invalid={!!errors.password}
              />
              {errors.password && <CFormText className="text-danger">{errors.password}</CFormText>}
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
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Close
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          Save Driver
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

AddDriverModel.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
}

export default AddDriverModel
