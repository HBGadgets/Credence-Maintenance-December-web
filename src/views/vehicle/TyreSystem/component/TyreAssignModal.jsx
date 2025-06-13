import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const TyreAssignModal = ({
  show,
  onClose,
  onAssign,
  tyreLabel,
  size = 'lg', // You can pass 'sm', 'lg', or 'xl' from parent
}) => {
  const [formData, setFormData] = useState({
    serialNo: '',
    brandName: '',
    status: '',
    installationDate: '',
    purchaseDate: '',
    shopName: '',
    vendorName: '',
    location: '',
    tyreSize: '',
    billImage: null,
    amount: '',
    paymentMode: '',
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'billImage') {
      setFormData({ ...formData, billImage: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = () => {
    const fullData = { ...formData, tyreLabel }
    onAssign(fullData)
  }

  return (
    <Modal show={show} onHide={onClose} centered scrollable size={size}>
      <Modal.Header closeButton>
        <Modal.Title>Assign Tyre</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Tyre Position</Form.Label>
            <Form.Control type="text" value={tyreLabel} disabled />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Serial No.</Form.Label>
            <Form.Control
              type="text"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Brand Name</Form.Label>
            <Form.Control
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={formData.status} onChange={handleChange}>
              <option value="" disabled hidden>
                -- Select Status --
              </option>
              <option value="new">New</option>
              <option value="in-use">In Use</option>
              <option value="need-replacement">Need Replacement</option>
              <option value="second-hand">Second Hand</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Installation Date</Form.Label>
            <Form.Control
              type="date"
              name="installationDate"
              value={formData.installationDate}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Purchase Date</Form.Label>
            <Form.Control
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Shop Name</Form.Label>
            <Form.Control
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Vendor Name</Form.Label>
            <Form.Control
              type="text"
              name="vendorName"
              value={formData.vendorName}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Tyre Size</Form.Label>
            <Form.Control
              type="text"
              name="tyreSize"
              value={formData.tyreSize}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Bill Image</Form.Label>
            <Form.Control type="file" name="billImage" accept="image/*" onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Payment Mode</Form.Label>
            <Form.Select name="paymentMode" value={formData.paymentMode} onChange={handleChange}>
              <option value="" disabled hidden>
                -- Select Payment Mode --
              </option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Assign
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default TyreAssignModal
