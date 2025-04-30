import React, { useState } from 'react'
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CCol,
  CFormInput,
  CButton,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { AiTwotoneTool } from 'react-icons/ai'
import { FaTruckMoving } from 'react-icons/fa6'
import { BiSolidCategory } from 'react-icons/bi'
import { IoPersonSharp } from 'react-icons/io5'
import { BsCartFill } from 'react-icons/bs'
import { FaPercentage } from 'react-icons/fa'
import { FaCalendarAlt } from 'react-icons/fa'
import { RiBillFill } from 'react-icons/ri'

const EditPurchaseForm = ({
  purchase,
  onEditPurchase,
  onCancel,
  editModalOpen,
  setEditModalOpen,
}) => {
  const [partName, setPartName] = useState(purchase?.partName || '')
  const [vehicle, setVehicle] = useState(purchase?.vehicle || '')
  const [category, setCategory] = useState(purchase?.category || '')
  const [vendor, setVendor] = useState(purchase?.vendor || '')
  const [quantity, setQuantity] = useState(purchase?.quantity || '')
  const [costPerUnit, setCostPerUnit] = useState(purchase?.costPerUnit || '')
  const [purchaseDate, setPurchaseDate] = useState(purchase?.purchaseDate || '')
  const [invoiceNumber, setInvoiceNumber] = useState(purchase?.invoiceNumber || '')
  const [document, setDocument] = useState(purchase?.document || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onEditPurchase({
      ...purchase,
      partName,
      vehicle,
      category,
      vendor,
      quantity,
      costPerUnit,
      purchaseDate,
      invoiceNumber,
      document,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h5> Edit Purchase </h5>
      <CRow className="mb-3">
        <CCol xs={12} md={6}>
          <CInputGroup className="mt-4">
            <CInputGroupText>
              <AiTwotoneTool style={{ fontSize: '22px', color: 'gray' }} />
            </CInputGroupText>
            <CFormInput
              id="partName"
              placeholder="Enter Part Name"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              required
            />
          </CInputGroup>
        </CCol>
        <CCol xs={12} md={6}>
          <CInputGroup className="mt-4">
            <CInputGroupText>
              <FaTruckMoving style={{ fontSize: '22px', color: 'gray' }} />
            </CInputGroupText>
            <CFormInput
              id="vehicle"
              value={vehicle}
              placeholder="Select Vehicle"
              onChange={(e) => setVehicle(e.target.value)}
              required
            />
          </CInputGroup>
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol xs={12} md={6}>
          <CInputGroup className="mt-4">
            <CInputGroupText>
              <BiSolidCategory style={{ fontSize: '22px', color: 'gray' }} />
            </CInputGroupText>
            <CFormInput
              id="category"
              placeholder="Select Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </CInputGroup>
        </CCol>
        <CCol xs={12} md={6}>
          <CInputGroup className="mt-4">
            <CInputGroupText>
              <IoPersonSharp style={{ fontSize: '21px', color: 'gray' }} />
            </CInputGroupText>
            <CFormInput
              id="vendor"
              value={vendor}
              placeholder="Enter Vendor Name"
              onChange={(e) => setVendor(e.target.value)}
              required
            />
          </CInputGroup>
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol xs={12} md={6}>
          <CInputGroup className="mt-4">
            <CInputGroupText>
              <BsCartFill style={{ fontSize: '21px', color: 'gray' }} />
            </CInputGroupText>
            <CFormInput
              id="quantity"
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </CInputGroup>
        </CCol>
        <CCol xs={12} md={6}>
          <CInputGroup className="mt-4">
            <CInputGroupText>
              <FaPercentage style={{ fontSize: '21px', color: 'gray' }} />
            </CInputGroupText>
            <CFormInput
              id="costPerUnit"
              type="number"
              placeholder="Cost Per Unit"
              value={costPerUnit}
              onChange={(e) => setCostPerUnit(e.target.value)}
              required
            />
          </CInputGroup>
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol xs={12} md={6}>
          <CInputGroup className="mt-4">
            <CInputGroupText>
              <FaCalendarAlt style={{ fontSize: '21px', color: 'gray' }} />
            </CInputGroupText>
            <CFormInput
              id="purchaseDate"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />
          </CInputGroup>
        </CCol>
        <CCol xs={12} md={6}>
          <CInputGroup className="mt-4">
            <CInputGroupText>
              <RiBillFill style={{ fontSize: '21px', color: 'gray' }} />
            </CInputGroupText>
            <CFormInput
              id="invoiceNumber"
              placeholder="Enter Invoice/Bill No"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
            />
          </CInputGroup>
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol xs={12}>
          <CInputGroup>
            <CFormInput
              id="document"
              type="file"
              onChange={(e) => setDocument(e.target.files[0]?.name || '')}
            />
          </CInputGroup>
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol xs={12} className="d-flex justify-content-end">
          <CButton color="secondary" onClick={onCancel} className="me-2">
            Cancel
          </CButton>
          <CButton type="submit" color="primary">
            Edit
          </CButton>
        </CCol>
      </CRow>
    </form>
  )
}

export default EditPurchaseForm
