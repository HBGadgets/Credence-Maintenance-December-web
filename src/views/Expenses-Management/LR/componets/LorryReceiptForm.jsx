import React, { useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { FaEdit } from 'react-icons/fa'

const defaultFormData = {
  companyName: '',
  companyAddress: '',
  gstin: '',
  officeNumber: '',
  mobileNumber: '',
  lrNumber: '',
  date: '',
  vehicleNumber: '',
  owner: '',
  consignorName: '',
  consignorAddress: '',
  consigneeName: '',
  consigneeAddress: '',
  customer: '',
  startLocation: '',
  endLocation: '',
  driverName: '',
  driverContact: '',
  containerNumber: '',
  sealNumber: '',
  itemName: '',
  quantity: '',
  unit: '',
  actualWeight: '',
  chargedWeight: '',
  customerRate: '',
  totalAmount: '',
  transporterRate: '',
  totalTransporterAmount: '',
  transporterRateOn: '',
  customerRateOn: '',
  customerFreight: '',
  transporterFreight: '',
}

const LorryReceiptForm = ({ show, handleClose, handleSubmit, initialData = {}, mode = 'add' }) => {
  const [formData, setFormData] = useState(defaultFormData)

  useEffect(() => {
    if (mode === 'edit') {
      setFormData({ ...defaultFormData, ...initialData })
    } else {
      setFormData(defaultFormData)
    }
  }, [initialData, mode, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    handleSubmit(formData)
  }

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">{mode === 'edit' ? 'Edit' : 'Add'} Lorry Receipt</h4>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={handleClose}
          ></button>
        </div>

        <Form onSubmit={onSubmit}>
          {/* Company Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Company Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Company Address</Form.Label>
              <Form.Control
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>GST IN</Form.Label>
              <Form.Control name="gstin" value={formData.gstin} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <Form.Label>Office Number</Form.Label>
              <Form.Control
                name="officeNumber"
                value={formData.officeNumber}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Basic Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Basic Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Label>LR Number</Form.Label>
              <Form.Control name="lrNumber" value={formData.lrNumber} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <Form.Label>Vehicle Number</Form.Label>
              <Form.Control
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Owner</Form.Label>
              <Form.Control name="owner" value={formData.owner} onChange={handleChange} />
            </div>
          </div>

          {/* Consignor Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Consignor Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Label>Consignor Name</Form.Label>
              <Form.Control
                name="consignorName"
                value={formData.consignorName}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Consignor Address</Form.Label>
              <Form.Control
                name="consignorAddress"
                value={formData.consignorAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Consignee Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Consignee Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Label>Consignee Name</Form.Label>
              <Form.Control
                name="consigneeName"
                value={formData.consigneeName}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Consignee Address</Form.Label>
              <Form.Control
                name="consigneeAddress"
                value={formData.consigneeAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Route Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Route Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Label>Start Location</Form.Label>
              <Form.Control name="from" value={formData.startLocation} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <Form.Label>End Location</Form.Label>
              <Form.Control name="to" value={formData.endLocation} onChange={handleChange} />
            </div>
          </div>

          {/* Cargo Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Cargo Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <Form.Label>Item Name</Form.Label>
              <Form.Control name="itemName" value={formData.itemName} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Unit</Form.Label>
              <Form.Control name="unit" value={formData.unit} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <Form.Label>Actual Weight</Form.Label>
              <Form.Control
                type="number"
                name="actualWeight"
                value={formData.actualWeight}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Charged Weight</Form.Label>
              <Form.Control
                type="number"
                name="chargedWeight"
                value={formData.chargedWeight}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Freight Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Freight Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <Form.Label>Customer Rate</Form.Label>
              <Form.Control
                name="customerRate"
                value={formData.customerRate}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Total Amount</Form.Label>
              <Form.Control
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Transporter Rate</Form.Label>
              <Form.Control
                name="transporterRate"
                value={formData.transporterRate}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Total Transporter Rate On</Form.Label>
              <Form.Control
                name="transporterRateOn"
                value={formData.transporterRateOn}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Customer Rate On</Form.Label>
              <Form.Control
                name="customerRateOn"
                value={formData.customerRateOn}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Customer Freight</Form.Label>
              <Form.Control
                name="customerFreight"
                value={formData.customerFreight}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Transporter Freight</Form.Label>
              <Form.Control
                name="transporterFreight"
                value={formData.transporterFreight}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="text-end mt-4">
            <Button type="submit">
              {mode === 'edit' ? <>Update Receipt</> : 'Create Receipt'}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default LorryReceiptForm
