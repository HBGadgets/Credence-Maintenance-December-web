import React, { useState } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { FaUserPlus } from 'react-icons/fa'

const AddConsignorConsigneeModal = ({
  show,
  onHide,
  type = 'consignor',
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  })
  const [errors, setErrors] = useState({})

  // Modal form fields based on type
  const fields = [
    {
      name: 'name',
      label: type === 'consignor' ? 'Consignor Name' : 'Consignee Name',
      type: 'text',
      placeholder: type === 'consignor' ? 'Enter consignor name' : 'Enter consignee name',
      required: true,
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      placeholder: 'Enter address',
      required: true,
    },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    fields.forEach((field) => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Prepare payload
    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
    }

    onSubmit(payload)
  }

  const handleClose = () => {
    // Reset form
    setFormData({
      name: '',
      address: '',
    })
    setErrors({})
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          <FaUserPlus className="me-2" />
          Add New {type === 'consignor' ? 'Consignor' : 'Consignee'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <Form.Group key={field.name} className="mb-3">
              <Form.Label>
                {field.label} {field.required && <span className="text-danger">*</span>}
              </Form.Label>
              <Form.Control
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                isInvalid={!!errors[field.name]}
                disabled={isLoading}
              />
              {errors[field.name] && (
                <Form.Control.Feedback type="invalid">{errors[field.name]}</Form.Control.Feedback>
              )}
            </Form.Group>
          ))}

          <div className="text-end mt-4">
            <Button variant="secondary" onClick={handleClose} className="me-2" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Creating...
                </>
              ) : (
                `Create ${type === 'consignor' ? 'Consignor' : 'Consignee'}`
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default AddConsignorConsigneeModal
