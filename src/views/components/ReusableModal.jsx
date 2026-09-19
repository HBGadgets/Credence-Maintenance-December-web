import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import Select from 'react-select'

const ReusableModal = ({
  show,
  initialData,
  onClose,
  onSubmit,
  title = 'Form',
  fields = [],
  size = 'lg',
  backdrop = 'static',
  keyboard = false,
  isSubmitting = false,
}) => {
  const initialFormState = fields.reduce((acc, field) => {
    if (field.type === 'multiselect') acc[field.name] = []
    else if (field.type === 'select') acc[field.name] = null
    else if (field.type === 'file') acc[field.name] = null
    else acc[field.name] = ''
    return acc
  }, {})

  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (show) {
      if (initialData) {
        const prefilledData = fields.reduce((acc, field) => {
          const value = initialData[field.name]

          if (field.type === 'select') {
            const foundOpt = field.options?.find((opt) => opt.value === value)
            if (foundOpt) {
              acc[field.name] = foundOpt
            } else if (value) {
              const labelKey = `${field.name.replace(/Id$/, '')}Name`
              const label = initialData[labelKey] || value
              acc[field.name] = { value, label }
            } else {
              acc[field.name] = null
            }
          } else if (field.type === 'multiselect') {
            acc[field.name] =
              field.options?.filter((opt) => (value || []).includes(opt.value)) || []
          } else {
            acc[field.name] = value || ''
          }

          return acc
        }, {})
        setFormData(prefilledData)
      } else {
        setFormData(initialFormState)
      }
    }
  }, [show, initialData])

  // Synchronize select fields when options update asynchronously
  useEffect(() => {
    if (show && formData) {
      fields.forEach((field) => {
        if (field.type === 'select' && field.options?.length && formData[field.name]) {
          const currentVal = formData[field.name]?.value || formData[field.name]
          const matched = field.options.find((opt) => opt.value === currentVal)
          if (matched && formData[field.name]?.label !== matched.label) {
            setFormData((prev) => ({ ...prev, [field.name]: matched }))
          }
        }
      })
    }
  }, [fields, show])

  const handleChange = (e) => {
    const { name, value, files, type } = e.target
    const newValue = type === 'file' ? files[0] : value
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))
  }

  const handleSelectChange = (selectedOption, fieldName) => {
    const field = fields.find((f) => f.name === fieldName)
    setFormData((prev) => {
      const next = {
        ...prev,
        [fieldName]: selectedOption,
      }
      if (field?.clearFields && Array.isArray(field.clearFields)) {
        field.clearFields.forEach((cf) => {
          next[cf] = null
        })
      }
      return next
    })

    if (field && typeof field.onChange === 'function') {
      field.onChange(selectedOption)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.name]
        const isEmpty =
          ((field.type === 'text' ||
            field.type === 'number' ||
            field.type === 'date' ||
            field.type === 'password') &&
            !value) ||
          (field.type === 'select' && !value) ||
          (field.type === 'multiselect' && (!value || value.length === 0)) ||
          (field.type === 'file' && !value)

        if (isEmpty) {
          newErrors[field.name] = `${field.label} is required`
        }
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const cleanedData = { ...formData }
    fields.forEach((field) => {
      if (field.type === 'select') {
        cleanedData[field.name] = formData[field.name]?.value || ''
      } else if (field.type === 'multiselect') {
        cleanedData[field.name] = formData[field.name]?.map((item) => item.value) || []
      }
    })

    onSubmit(cleanedData)
    onClose()
  }

  return (
    <Modal show={show} onHide={onClose} size={size} centered backdrop={backdrop} keyboard={keyboard}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: '65vh', overflowY: 'auto' }}>
        <Form>
          {fields.map((field) => (
            <Form.Group className="mb-3" key={field.name}>
              <Form.Label>
                {field.label}
                {field.required && <span style={{ color: 'red' }}> *</span>}
              </Form.Label>

              {/* MULTI SELECT */}
              {field.type === 'multiselect' ? (
                <Select
                  isMulti
                  options={field.options || []}
                  value={formData[field.name]}
                  onChange={(selected) => handleSelectChange(selected, field.name)}
                  menuPortalTarget={document.body}
                  isDisabled={field.disabled || field.readOnly}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              ) : field.type === 'select' ? (
                /* SELECT */
                <Select
                  options={field.options || []}
                  value={formData[field.name]}
                  onChange={(selected) => handleSelectChange(selected, field.name)}
                  menuPortalTarget={document.body}
                  isDisabled={field.disabled || field.readOnly}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              ) : field.type === 'file' ? (
                /* FILE INPUT */
                <>
                  <Form.Control
                    type="file"
                    name={field.name}
                    onChange={handleChange}
                    accept={field.accept || 'image/*'}
                    disabled={field.readOnly}
                  />
                  {formData[field.name] && typeof formData[field.name] === 'object' && (
                    <div className="mt-2">
                      <strong>Selected:</strong> {formData[field.name].name}
                    </div>
                  )}
                </>
              ) : (
                /* NORMAL INPUT */
                <Form.Control
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  readOnly={field.readOnly}
                  disabled={field.disabled}
                />
              )}

              {errors[field.name] && <div className="text-danger">{errors[field.name]}</div>}
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ReusableModal
