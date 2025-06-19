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
}) => {
  const [show, setShow] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (editMode && initialData) {
      setFormData(initialData)
      setShow(true)
    }
  }, [editMode, initialData])

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
    setShow(false)
    setFormData({})
    if (onCloseExternal) onCloseExternal()
  }

  const handleClose = () => {
    setShow(false)
    setFormData({})
    if (onCloseExternal) onCloseExternal()
  }

  const renderField = (field) => {
    const value = formData[field.name] || ''
    switch (field.type) {
      case 'text':
      case 'date':
      case 'number':
        return (
          <Form.Group key={field.name} className="mb-3">
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              type={field.type}
              name={field.name}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder || ''}
            />
          </Form.Group>
        )
      case 'select':
        return (
          <Form.Group key={field.name} className="mb-3">
            <Form.Label>{field.label}</Form.Label>
            <Select
              options={field.options}
              value={field.options.find((opt) => opt.value === value) || null}
              onChange={(selected) => handleChange(field.name, selected?.value || '')}
              placeholder={field.placeholder || 'Select option'}
            />
          </Form.Group>
        )
      case 'multiselect':
        return (
          <Form.Group key={field.name} className="mb-3">
            <Form.Label>{field.label}</Form.Label>
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
            />
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

      <Modal show={show || showExternally} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Service' : buttonLabel + ' Form'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
