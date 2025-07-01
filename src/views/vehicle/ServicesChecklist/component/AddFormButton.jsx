import React, { useEffect, useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import Select from 'react-select'

const AddFormButton = ({
  buttonLabel = 'Add New',
  formFields = [],
  onSubmit,
  initialData = null,
  editMode = false,
  showExternally = false,
  onCloseExternal,
  size,
}) => {
  const [show, setShow] = useState(false)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editMode && initialData) {
      setFormData(initialData)
      setShow(true)
    }
  }, [editMode, initialData])

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: null })) // clear error on change
  }

  const validateForm = () => {
    const newErrors = {}
    formFields.forEach((field) => {
      if (field.required) {
        const value = formData[field.name]
        const isEmptyFile = field.type === 'file' && !value
        if (!value || isEmptyFile) {
          newErrors[field.name] = `${field.label} is required`
        }
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return
    onSubmit(formData)
    setShow(false)
    setFormData({})
    setErrors({})
    if (onCloseExternal) onCloseExternal()
  }

  const handleClose = () => {
    setShow(false)
    setFormData({})
    setErrors({})
    if (onCloseExternal) onCloseExternal()
  }

  const renderField = (field) => {
    const value = formData[field.name] || ''
    const error = errors[field.name]
    switch (field.type) {
      case 'text':
      case 'date':
      case 'number':
        return (
          <Form.Group key={field.name} className="mb-3">
            <Form.Label>
              {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
            </Form.Label>
            <Form.Control
              type={field.type}
              name={field.name}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder || ''}
              isInvalid={!!error}
            />
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
          </Form.Group>
        )
      case 'file':
        return (
          <Form.Group key={field.name} className="mb-3">
            <Form.Label>
              {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
            </Form.Label>
            <Form.Control
              type="file"
              name={field.name}
              accept={field.accept || '*'}
              onChange={(e) => handleChange(field.name, e.target.files[0])}
              isInvalid={!!error}
            />
            {formData[field.name] && (
              <div style={{ marginTop: '10px' }}>
                <strong>Selected File:</strong> {formData[field.name].name}
              </div>
            )}
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
          </Form.Group>
        )
      case 'select':
        return (
          <Form.Group key={field.name} className="mb-3">
            <Form.Label>
              {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
            </Form.Label>
            <Select
              options={field.options}
              value={field.options.find((opt) => opt.value === value) || null}
              onChange={(selected) => handleChange(field.name, selected?.value || '')}
              placeholder={field.placeholder || 'Select option'}
              className={error ? 'is-invalid' : ''}
            />
            {error && <div className="text-danger mt-1">{error}</div>}
          </Form.Group>
        )
      case 'multiselect':
        return (
          <Form.Group key={field.name} className="mb-3">
            <Form.Label>
              {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
            </Form.Label>
            <Select
              isMulti
              options={field.options}
              value={field.options.filter((opt) => (value || []).includes(opt.value))}
              onChange={(selected) =>
                handleChange(
                  field.name,
                  selected.map((s) => s.value),
                )
              }
              placeholder={field.placeholder || 'Select multiple'}
              className={error ? 'is-invalid' : ''}
            />
            {error && <div className="text-danger mt-1">{error}</div>}
          </Form.Group>
        )
      default:
        return null
    }
  }

  return (
    <>
      {!editMode && !showExternally && (
        <Button variant="primary" onClick={() => setShow(true)}>
          {buttonLabel}
        </Button>
      )}

      <Modal show={show || showExternally} onHide={handleClose} centered size={size || 'lg'}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Service' : buttonLabel + ' Form'}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <Form>{formFields.map((field) => renderField(field))}</Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            {editMode ? 'Update' : 'Submit'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AddFormButton
