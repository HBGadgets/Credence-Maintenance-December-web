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
  closeOnSubmit = false,
  children,
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
          let value = initialData[field.name]

          // Fallback if field name differs by alias or casing
          if (value === undefined || value === null) {
            if (field.name === 'quantityMT') {
              value = initialData.quantity ?? initialData.totalQuantity ?? initialData.quantityKg
            } else if (field.name === 'quantity') {
              value = initialData.quantityMT ?? initialData.totalQuantity ?? initialData.quantityKg
            } else if (field.name === 'totalBags') {
              value = initialData.totalbags ?? initialData.bags ?? initialData.totalBagsCount
            } else if (field.name === 'totalbags' || field.name === 'bags') {
              value = initialData.totalBags ?? initialData.totalBagsCount
            } else if (field.name === 'bagSize') {
              value = initialData.bagWeight ?? initialData.bagSizeKg
            } else {
              const lowerName = field.name.toLowerCase()
              const matchedKey = Object.keys(initialData).find((k) => k.toLowerCase() === lowerName)
              if (matchedKey) {
                value = initialData[matchedKey]
              }
            }
          }

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
            acc[field.name] = value !== undefined && value !== null ? value : ''
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

  const handleKeyDown = (e, field) => {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'Shift',
      'CapsLock',
    ]
    if (
      allowedKeys.includes(e.key) ||
      e.key.length > 1 ||
      ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase()))
    ) {
      return
    }

    if (field?.numericOnly) {
      if (!/^\d$/.test(e.key)) {
        e.preventDefault()
      }
    }

    if (field?.stringOnly || field?.alphaOnly) {
      if (!/^[a-zA-Z\s]$/.test(e.key)) {
        e.preventDefault()
      }
    }
  }

  const handleChange = (e) => {
    const { name, value, files, type } = e.target
    const field = fields.find((f) => f.name === name)
    let newValue = type === 'file' ? files[0] : value

    if (field?.numericOnly && typeof newValue === 'string') {
      newValue = newValue.replace(/\D/g, '')
      if (field.maxLength) {
        newValue = newValue.slice(0, field.maxLength)
      }
    }

    if ((field?.stringOnly || field?.alphaOnly) && typeof newValue === 'string') {
      newValue = newValue.replace(/[^a-zA-Z\s]/g, '')
      if (field.maxLength) {
        newValue = newValue.slice(0, field.maxLength)
      }
    }

    setFormData((prev) => {
      let updated = {
        ...prev,
        [name]: newValue,
      }
      if (field && typeof field.onChange === 'function') {
        const extraUpdates = field.onChange(newValue, updated, (updater) => setFormData(updater), e)
        if (extraUpdates && typeof extraUpdates === 'object') {
          updated = { ...updated, ...extraUpdates }
        }
      }
      return updated
    })
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
          (field.type === 'select' && !value) ||
          (field.type === 'multiselect' && (!value || value.length === 0)) ||
          (field.type === 'file' && !value) ||
          (field.type !== 'select' &&
            field.type !== 'multiselect' &&
            field.type !== 'file' &&
            (value === '' || value === undefined || value === null || (typeof value === 'string' && value.trim() === '')))

        if (isEmpty) {
          newErrors[field.name] = `${field.label} is required`
        }
      }

      if (field.numericOnly && formData[field.name]) {
        const strVal = String(formData[field.name]).trim()
        if (strVal && !/^\d+$/.test(strVal)) {
          newErrors[field.name] = `${field.label} must contain only numbers`
        }
      }

      if ((field.stringOnly || field.alphaOnly) && formData[field.name]) {
        const strVal = String(formData[field.name]).trim()
        if (strVal && !/^[a-zA-Z\s]+$/.test(strVal)) {
          newErrors[field.name] = `${field.label} must contain only letters`
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
    if (closeOnSubmit) {
      onClose()
    }
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
                  onKeyDown={(e) => handleKeyDown(e, field)}
                  readOnly={field.readOnly}
                  disabled={field.disabled}
                  maxLength={field.maxLength}
                  pattern={
                    field.pattern ||
                    (field.numericOnly
                      ? '[0-9]*'
                      : field.stringOnly || field.alphaOnly
                      ? '[a-zA-Z\\s]*'
                      : undefined)
                  }
                  inputMode={
                    field.inputMode ||
                    (field.numericOnly
                      ? 'numeric'
                      : field.stringOnly || field.alphaOnly
                      ? 'text'
                      : undefined)
                  }
                  step={field.step || (field.type === 'number' ? 'any' : undefined)}
                  min={field.min}
                  max={field.max}
                  className={field.readOnly ? 'bg-light' : ''}
                />
              )}

              {field.helperText && (
                <Form.Text className="text-muted d-block mt-1">
                  {typeof field.helperText === 'function' ? field.helperText(formData) : field.helperText}
                </Form.Text>
              )}

              {errors[field.name] && <div className="text-danger mt-1">{errors[field.name]}</div>}
            </Form.Group>
          ))}

          {/* Optional formula display if bagSize and totalBags exist */}
          {formData.bagSize && formData.totalBags && !isNaN(parseFloat(formData.bagSize)) && !isNaN(parseFloat(formData.totalBags)) && parseFloat(formData.totalBags) > 0 && (
            <div className="p-2 bg-light rounded small mt-2">
              <strong>Formula: </strong>
              <span>
                {formData.bagSize} kg × {formData.totalBags} bags ={' '}
                {((parseFloat(formData.bagSize) * parseFloat(formData.totalBags)) / 1000).toFixed(3)} MT
              </span>
            </div>
          )}

          {children}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ReusableModal
