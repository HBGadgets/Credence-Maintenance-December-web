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
} from '@coreui/react'
import { fetchDrivers } from '../DriverExpert/data/drivers'

const DriverSalaryModal = () => {
  const [visible, setVisible] = useState(false)
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false) // Loading state
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
        .catch((error) => console.error('Error fetching drivers:', error))

      setFormData(initialFormData)
    }
  }, [visible])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    setLoading(true) // Set loading to true when submitting

    setTimeout(() => {
      console.log('Saved Salary Data:', formData)
      setFormData(initialFormData)
      setLoading(false) // Reset loading state
      setVisible(false) // Close modal
    }, 2000) // Simulating a network request
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
              <CFormSelect
                name="driverId"
                value={formData.driverId}
                onChange={handleChange}
                required
              >
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
                required
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
            {loading ? 'Submitting...' : 'Submit'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default DriverSalaryModal
