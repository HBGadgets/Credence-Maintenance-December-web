import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CSpinner,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { fetchDrivers } from '../../../DriverExpert/data/drivers'
import { useQueryClient } from '@tanstack/react-query' // Import useQueryClient

const SalaryFrom = ({ onSubmit, month, visible, onClose, initialData }) => {
  // const [visible, setVisible] = useState(false)
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient() // React Query client for refetching data

  const initialFormData = {
    driverId: '',
    basicPay: '',
    overtime: '',
    incentives: '',
    deductions: '',
    _id: '', // Add _id for edit mode
  }

  const [formData, setFormData] = useState(initialFormData)
  const [initialValues, setInitialValues] = useState({})

  useEffect(() => {
    if (visible) {
      // Fetch drivers
      fetchDrivers()
        .then(setDrivers)
        .catch((error) => {
          console.error('Error fetching drivers:', error)
          toast.error('Failed to fetch drivers')
        })

      // If editing (initialData provided)
      if (initialData) {
        const formattedData = {
          driverId: initialData.driverId?._id || initialData.driverId,
          basicPay: initialData.basicPay?.toString() || '',
          overtime: initialData.overtime?.toString() || '',
          incentives: initialData.incentives?.toString() || '',
          deductions: initialData.deductions?.toString() || '',
          _id: initialData._id,
        }

        setFormData(formattedData)
        setInitialValues(formattedData)
      } else {
        setFormData(initialFormData) // Reset to empty/default form
      }
    }
  }, [visible, initialData])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    // Get changed fields only
    const changedFields = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== initialValues[key]) {
        acc[key] = formData[key]
      }
      return acc
    }, {})

    if (Object.keys(changedFields).length === 0) {
      toast.error('No changes detected')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        ...changedFields,
        _id: formData._id, // Include ID for edit mode
      })
      onClose()
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to save changes.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-4">
      {/* <CButton color="primary" onClick={() => setVisible(true)}>
        Create Driver Salary
      </CButton> */}
      <CModal visible={visible} onClose={onClose}>
        <CModalHeader closeButton>
          <CModalTitle>{formData._id ? 'Edit' : 'Create'} Driver Salary</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Driver Name</CFormLabel>
              <CFormSelect name="driverId" value={formData.driverId} onChange={handleChange}>
                <option value="">Select Driver</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </CFormSelect>
            </div>

            {/* Rest of the form inputs */}
            <div className="mb-3">
              <CFormLabel>Basic Pay</CFormLabel>
              <CFormInput
                type="number"
                name="basicPay"
                value={formData.basicPay}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <CFormLabel>Overtime</CFormLabel>
              <CFormInput
                type="number"
                name="overtime"
                value={formData.overtime}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <CFormLabel>Incentives</CFormLabel>
              <CFormInput
                type="number"
                name="incentives"
                value={formData.incentives}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <CFormLabel>Deductions</CFormLabel>
              <CFormInput
                type="number"
                name="deductions"
                value={formData.deductions}
                onChange={handleChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Submit'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default SalaryFrom
