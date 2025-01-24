import React, { useState, useEffect } from 'react'
// import axios from 'axios';

import {
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CButton,
  CInputGroup,
  CInputGroupText,
  CFormLabel,
  CFormCheck,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'
import {
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Edit,
  Trash,
  PlusCircle,
  Tag,
  Info,
  DollarSign,
  Percent,
} from 'lucide-react'

import { IoFileTrayFull } from 'react-icons/io5'
import { IoPersonSharp } from 'react-icons/io5'
import { MdAlternateEmail } from 'react-icons/md'
import { FaPhoneAlt } from 'react-icons/fa'
import { FaCalendarAlt } from 'react-icons/fa'
import { MdOutlineCurrencyRupee } from 'react-icons/md'

const initialFormState = {
  invoiceNumber: '',
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  date: '',
  paymentDueDate: '',
  status: 'unpaid',
  taxes: '',
  subTotal: '',
  grandTotal: '',
  items: [{ name: '', description: '', unitPrice: '', quantity: '', total: '' }],
}

const NewInvoiceForm = () => {
  const [invoiceData, setInvoiceData] = useState(initialFormState)
  const [customRate, setCustomRate] = useState(false)
  const [taxRate, setTaxRate] = useState(18)

  const taxTypes = [
    { value: 'GST', label: 'GST' },
    { value: 'CGST', label: 'CGST' },
    { value: 'SGST', label: 'SGST' },
    { value: 'IGST', label: 'IGST' },
  ]

  const taxRates = [
    { value: 18, label: '18%' },

    { value: 5, label: '5%' },
    { value: 12, label: '12%' },
    { value: 28, label: '28%' },
    { value: 'custom', label: 'Custom' },
  ]

  const handleTaxRateChange = (event) => {
    const value = event.target.value
    if (value === 'custom') {
      setCustomRate(true)
      setTaxRate('') // Reset the value for custom input
    } else {
      setCustomRate(false)
      setTaxRate(value)
    }
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setInvoiceData({
      ...invoiceData,
      [name]: value,
    })
  }

  // Handle items' field changes
  const handleItemChange = (index, e) => {
    const { name, value } = e.target
    const updatedItems = [...invoiceData.items]
    updatedItems[index][name] = value
    updatedItems[index].total = updatedItems[index].unitPrice * updatedItems[index].quantity
    setInvoiceData({
      ...invoiceData,
      items: updatedItems,
    })
  }

  // Add new item to the list
  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        { name: '', description: '', unitPrice: '', quantity: '', total: '' },
      ],
    })
  }
  const handleAddModalClose = () => {
    setAddModalOpen(false)
    setInvoiceData(initialFormState)
  }
  const handleEditModalClose = () => {
    setEditModalOpen(false)
    setInvoiceData(initialFormState)
  }

  // Remove item from the list
  const removeItem = (index) => {
    const updatedItems = invoiceData.items.filter((_, i) => i !== index)
    setInvoiceData({
      ...invoiceData,
      items: updatedItems,
    })
  }

  return (
    <>
      {/* // +++++++++++++++++ ADD MODAL - CREATE INVOICE ++++++++++++++++++++++++++++++= */}
      <div style={{ overflow: 'auto' }}>
        <form>
          <div className="d-grid" style={{ gridTemplateColumns: '1fr 1fr', gridGap: '0rem 2rem' }}>
            <CCol>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <IoFileTrayFull style={{ fontSize: '22px', color: 'gray' }} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="Invoice Number"
                  name="invoiceNumber"
                  value={invoiceData.invoiceNumber}
                  onChange={handleChange}
                  required
                />
              </CInputGroup>
            </CCol>

            <CCol>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <IoPersonSharp style={{ fontSize: '22px', color: 'gray' }} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="Client Name"
                  name="clientName"
                  value={invoiceData.clientName}
                  onChange={handleChange}
                  required
                />
              </CInputGroup>
            </CCol>

            <CCol>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <MdAlternateEmail style={{ fontSize: '22px', color: 'gray' }} />
                </CInputGroupText>
                <CFormInput
                  type="email"
                  placeholder="Client Email"
                  name="clientEmail"
                  value={invoiceData.clientEmail}
                  onChange={handleChange}
                  required
                />
              </CInputGroup>
            </CCol>

            <CCol>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <FaPhoneAlt style={{ fontSize: '22px', color: 'gray' }} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="Client Phone"
                  name="clientPhone"
                  value={invoiceData.clientPhone}
                  onChange={handleChange}
                  required
                />
              </CInputGroup>
            </CCol>

            <CCol>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <FaCalendarAlt style={{ fontSize: '22px', color: 'gray' }} />
                </CInputGroupText>
                <CFormInput
                  type="date"
                  placeholder="Date"
                  name="date"
                  value={invoiceData.date}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </CInputGroup>
            </CCol>

            <CCol>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <FaCalendarAlt style={{ fontSize: '22px', color: 'gray' }} />
                </CInputGroupText>
                <CFormInput
                  type="date"
                  placeholder="Payment Due Date"
                  name="paymentDueDate"
                  value={invoiceData.paymentDueDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </CInputGroup>
            </CCol>

            <CCol>
              <CFormLabel>Status</CFormLabel>
              <CFormSelect name="status" value={invoiceData.status} onChange={handleChange}>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </CFormSelect>
            </CCol>
          </div>
          {/* Items Section */}
          <h5>Items</h5>
          {invoiceData.items.map((item, index) => (
            <CCard key={index} className="mb-3">
              <CCardBody>
                <CRow>
                  {/* Item Name */}
                  <CCol xs={12} sm={6}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <Tag style={{ fontSize: '22px', color: 'gray' }} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Item name"
                        name="name"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, e)}
                        required
                      />
                    </CInputGroup>
                  </CCol>

                  {/* Item Description */}
                  <CCol xs={12} sm={6}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <Info style={{ fontSize: '22px', color: 'gray' }} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Description"
                        name="description"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, e)}
                        required
                      />
                    </CInputGroup>
                  </CCol>

                  {/* Unit Price */}
                  <CCol xs={12} sm={6}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <MdOutlineCurrencyRupee style={{ fontSize: '22px', color: 'gray' }} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Unit Price"
                        name="unitPrice"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, e)}
                        type="number"
                        required
                      />
                    </CInputGroup>
                  </CCol>

                  {/* Quantity */}
                  <CCol xs={12} sm={6}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <PlusCircle style={{ fontSize: '22px', color: 'gray' }} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Quantity"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, e)}
                        type="number"
                        required
                      />
                    </CInputGroup>
                  </CCol>

                  {/* Total */}
                  <CCol xs={12} sm={6}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <MdOutlineCurrencyRupee style={{ fontSize: '22px', color: 'gray' }} />
                      </CInputGroupText>
                      <CFormInput placeholder="Total" name="total" value={item.total} disabled />
                    </CInputGroup>
                  </CCol>

                  {/* Remove Item Button */}
                  <CCol xs={12} sm={6}>
                    <CButton color="danger" onClick={() => removeItem(index)} fullWidth>
                      <Trash className="me-2" />
                      Remove Item
                    </CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          ))}

          {/* Add Item Button */}
          <CButton color="primary" onClick={addItem} className="w-100">
            <PlusCircle className="me-2" />
            Add Item
          </CButton>

          <CRow
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridGap: '0rem 2rem',
              marginTop: '1rem',
            }}
          >
            {/* Subtotal */}

            {/* Tax Type */}
            <CCol>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <Percent />
                </CInputGroupText>
                <CFormSelect
                  placeholder="Tax Type"
                  name="taxType"
                  value={invoiceData.taxType}
                  onChange={handleChange}
                  required
                >
                  {taxTypes.map((tax) => (
                    <option key={tax.value} value={tax.value}>
                      {tax.label}
                    </option>
                  ))}
                </CFormSelect>
              </CInputGroup>
            </CCol>

            {/* Tax Rate */}
            <CCol>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <Percent />
                </CInputGroupText>
                {!customRate ? (
                  <CFormSelect
                    placeholder="Tax Rate"
                    value={invoiceData.taxRate}
                    onChange={handleTaxRateChange}
                    required
                  >
                    {taxRates.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </CFormSelect>
                ) : (
                  <CFormInput
                    placeholder="Custom Tax Rate"
                    type="number"
                    value={invoiceData.taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    required
                  />
                )}
              </CInputGroup>
            </CCol>

            {/* Tax Amount */}
            <CCol>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <User />
                </CInputGroupText>
                <CFormInput
                  placeholder="Tax Amount"
                  name="taxAmount"
                  value={invoiceData.taxAmount} // Calculate based on taxable value * tax rate
                  disabled
                />
              </CInputGroup>
            </CCol>

            <CCol>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <User />
                </CInputGroupText>
                <CFormInput
                  placeholder="Subtotal"
                  name="subTotal"
                  value={invoiceData.subTotal}
                  onChange={handleChange}
                  type="number"
                  disabled
                />
              </CInputGroup>
            </CCol>

            {/* Grand Total */}
            <CCol>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <User />
                </CInputGroupText>
                <CFormInput
                  placeholder="Grand Total"
                  name="grandTotal"
                  value={invoiceData.grandTotal}
                  onChange={handleChange}
                  type="number"
                  disabled
                />
              </CInputGroup>
            </CCol>
          </CRow>

          {/* Submit Button */}
          <div style={{ marginTop: '1.5rem' }}>
            <CButton color="primary" type="submit">
              Submit
            </CButton>
          </div>
        </form>
      </div>

      {/* // +++++++++++++++++ EDIT MODAL - UPDATE INVOICE ++++++++++++++++++++++++++++++= */}
    </>
  )
}

export default NewInvoiceForm
