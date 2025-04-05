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
import { fetchDrivers } from '../DriverExpert/data/drivers'
import { useQueryClient } from '@tanstack/react-query' // Import useQueryClient

const SalaryAddButton = ({ onSubmit, month }) => {
  const [visible, setVisible] = useState(false)
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient() // React Query client for refetching data

  const initialFormData = {
    driverId: '',
    basicPay: '',
    overtime: '',
    incentives: '',
    deductions: '',
  }
  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    if (visible) {
      fetchDrivers()
        .then(setDrivers)
        .catch((error) => {
          console.error('Error fetching drivers:', error)
          toast.error('Failed to fetch drivers')
        })
      setFormData(initialFormData) // Reset form when modal opens
    }
  }, [visible])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!formData.driverId) {
      toast.error('Driver selection is required!')
      return
    }
    if (!formData.basicPay || Number(formData.basicPay) <= 0) {
      toast.error('Basic Pay must be greater than 0!')
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData) // Call the function from parent

      // Invalidate and refetch salary list
      await queryClient.invalidateQueries(['driverSalaries', month])
      queryClient.refetchQueries(['driverSalaries', month]) // Force refetch if needed
      // toast.success('Salary created successfully!')
      setFormData(initialFormData) // Reset form
    } catch (error) {
      toast.error('Failed to create salary')
    }
    setLoading(false)
    setVisible(false) // Close modal after successful submission
  }

  return (
    <div className="container mt-4">
      <CButton color="primary" onClick={() => setVisible(true)}>
        Create Driver Salary
      </CButton>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Driver Salary Details</CModalTitle>
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
          <CButton color="secondary" onClick={() => setVisible(false)} disabled={loading}>
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

export default SalaryAddButton
