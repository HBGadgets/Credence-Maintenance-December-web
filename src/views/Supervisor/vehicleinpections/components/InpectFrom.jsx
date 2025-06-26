import React, { useEffect } from 'react'
import { Modal, Button, Card, Row, Col, Badge, Form } from 'react-bootstrap'
import { CheckCircle, XCircle, AlertTriangle, Camera } from 'lucide-react'
import Select from 'react-select'

const InspectionForm = ({
  show,
  onClose,
  inspectionItems,
  onStatusChange,
  onDescriptionChange,
  onImageUpload,
  onSubmit,
  isEditMode,
  inspectionData,
}) => {
  const renderStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return (
          <Badge bg="success">
            <CheckCircle size={16} className="me-1" /> Pass
          </Badge>
        )
      case 'fail':
        return (
          <Badge bg="danger">
            <XCircle size={16} className="me-1" /> Fail
          </Badge>
        )
      default:
        return (
          <Badge bg="warning" text="dark">
            <AlertTriangle size={16} className="me-1" /> Pending
          </Badge>
        )
    }
  }

  useEffect(() => {
    if (isEditMode && inspectionData) {
      document.title = `Editing Inspection #${inspectionData.id}`
    } else {
      document.title = 'New Inspection'
    }
  }, [isEditMode, inspectionData])

  // Extract the select field (vehicle selector)
  const vehicleField = inspectionItems.find((item) => item.type === 'select')

  return (
    <Modal show={show} onHide={onClose} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{isEditMode ? `Edit Inspection ` : 'New Inspection Checklist'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* VEHICLE SELECT FIELD */}
        {vehicleField && (
          <Form.Group className="mb-4" controlId="vehicleSelect">
            <Form.Label className="fw-semibold">{vehicleField.label}</Form.Label>
            <Select
              options={vehicleField.options}
              value={vehicleField.options.find((opt) => opt.value === vehicleField.value)}
              isDisabled={isEditMode}
              onChange={(option) => {
                const selectedValue = option ? option.value : null
                const updatedItems = inspectionItems.map((item) =>
                  item.id === vehicleField.id ? { ...item, value: selectedValue } : item,
                )
                onStatusChange('__vehicle_select__', updatedItems)
              }}
              placeholder={vehicleField.Placeholder || 'Select a vehicle...'}
              isClearable
            />
            {isEditMode && (
              <Form.Text className="text-muted">
                Vehicle cannot be changed for existing inspections
              </Form.Text>
            )}
          </Form.Group>
        )}

        {/* INSPECTION CHECKLIST */}
        {Object.entries(
          inspectionItems
            .filter((item) => item.type !== 'select') // exclude vehicle field
            .reduce((groups, item) => {
              const section = item.section || 'General'
              if (!groups[section]) groups[section] = []
              groups[section].push(item)
              return groups
            }, {}),
        ).map(([sectionName, items]) => (
          <div key={sectionName} className="mb-4">
            <h5 className="fw-bold text-primary mb-3">{sectionName}</h5>

            {items.map((item) => (
              <Card key={item.id} className="mb-3 shadow-sm">
                <Card.Body>
                  <Row className="align-items-start">
                    <Col md={10}>
                      <h6 className="fw-bold mb-1">{item.item}</h6>
                      <p className="text-muted mb-2">{item.description}</p>
                    </Col>
                    <Col md={2} className="text-end">
                      {renderStatusIcon(item.status)}
                    </Col>
                  </Row>

                  <Row className="mt-2">
                    <Col>
                      <Form.Check
                        inline
                        label={<span className="text-success">Pass</span>}
                        type="radio"
                        id={`pass-${item.id}`}
                        name={`status-${item.id}`}
                        value="pass"
                        checked={item.status === 'pass'}
                        onChange={() => onStatusChange(item.id, 'pass')}
                      />
                      <Form.Check
                        inline
                        label={<span className="text-danger">Fail</span>}
                        type="radio"
                        id={`fail-${item.id}`}
                        name={`status-${item.id}`}
                        value="fail"
                        checked={item.status === 'fail'}
                        onChange={() => onStatusChange(item.id, 'fail')}
                      />
                    </Col>
                  </Row>

                  {item.status === 'fail' && (
                    <div className="mt-3">
                      <Form.Group className="mb-3" controlId={`desc-${item.id}`}>
                        <Form.Label className="fw-semibold">Failure Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Describe the issue..."
                          value={item.failureDescription || ''}
                          onChange={(e) => onDescriptionChange(item.id, e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group controlId={`img-${item.id}`}>
                        <Form.Label className="fw-semibold">Upload Image</Form.Label>
                        <div className="d-flex align-items-center gap-2">
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) onImageUpload(item.id, file)
                            }}
                          />
                          <Camera size={20} />
                        </div>
                        {item.failureImage && (
                          <img
                            src={
                              item.failureImage instanceof File
                                ? URL.createObjectURL(item.failureImage)
                                : item.failureImage
                            }
                            className="mt-2"
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 4,
                              border: '1px solid #ccc',
                            }}
                          />
                        )}
                      </Form.Group>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        ))}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Submit All
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default InspectionForm
