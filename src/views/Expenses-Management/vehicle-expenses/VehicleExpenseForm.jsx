import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CInputGroup,
  CInputGroupText,
  CFormTextarea
} from '@coreui/react'
import { FaCarSide, FaIndianRupeeSign, FaFileLines } from 'react-icons/fa6'
import { BiSolidCategory } from 'react-icons/bi'
import { IoPerson } from 'react-icons/io5'
import { MdPayment } from 'react-icons/md'
import { BsCalendarDate } from 'react-icons/bs'

const ExpenseForm = ({ onExpensesUpdate, openModal, handleCloseModal }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    expenseType: '',
    amount: '',
    vendor: '',
    payType: '',
    description: '',
    documents: [],
    date: '',
    receipt: null,
    receiptPreview: null
  })
  const [vehicles, setVehicles] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedDocuments = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedDocuments.push({
          filename: file.name,
          contentType: file.type,
          base64: reader.result.split(',')[1] // Extract base64 data
        });

        if (updatedDocuments.length === files.length) {
          setFormData((prevState) => ({
            ...prevState,
            documents: [...prevState.documents, ...updatedDocuments]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append('vehicleId', formData.vehicleId)
    data.append('expenseType', formData.expenseType)
    data.append('amount', formData.amount)
    data.append('vendor', formData.vendor)
    data.append('payType', formData.payType)
    data.append('description', formData.description)
    data.append('date', formData.date)
    if (formData.receipt) {
      data.append('receipt', formData.receipt)
    }
    // Convert base64 document to Blob and append it
    if (formData.document?.base64) {
      const byteCharacters = atob(formData.document.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const file = new Blob([byteArray], { type: formData.document.contentType });
      data.append('document', file, formData.document.filename);
    }

    // Submit form data
    console.log([...data])
  }

  return (
    <CModal visible={openModal} onClose={handleCloseModal} alignment="center" size="lg">
      <CModalHeader>Log Expense</CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            {/* Vehicle */}
            <CCol md={6}>
              <CInputGroup className="mt-4">
                <CInputGroupText>
                  <FaCarSide style={{ fontSize: '22px', color: 'gray' }} />
                </CInputGroupText>
                <CFormSelect
                  id="vehicleId"
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}

                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.name}
                    </option>
                  ))}
                </CFormSelect>
              </CInputGroup>
            </CCol>

            {/* Expense Type */}
            <CCol md={6}>
              <CInputGroup className="mt-4">
                <CInputGroupText>
                  <BiSolidCategory style={{ fontSize: '22px', color: 'gray' }} />
                </CInputGroupText>
                <CFormInput
                  type='text'
                  id="expenseType"
                  name="expenseType"
                  placeholder="Enter Expense Type"
                  value={formData.expenseType}
                  onChange={handleChange}
                  required
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            {/* Amount */}
            <CCol md={6}>
              <CInputGroup className="mt-4">
                <CInputGroupText>
                  <FaIndianRupeeSign style={{ fontSize: '22px', color: 'gray' }} />
                </CInputGroupText>
                <CFormInput
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="Enter Amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </CInputGroup>
            </CCol>

            {/* Vendor */}
            <CCol md={6}>
              <CInputGroup className="mt-4">
                <CInputGroupText>
                  <IoPerson style={{ fontSize: '22px', color: 'gray' }} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  id="vendor"
                  name="vendor"
                  placeholder="Enter Vendor Name"
                  value={formData.vendor}
                  onChange={handleChange}
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            {/* Payment Type */}
            <CCol md={6}>
              <CInputGroup className="mt-4">
                <CInputGroupText>
                  <MdPayment style={{ fontSize: '22px', color: 'gray' }} />
                </CInputGroupText>
                <CFormSelect
                  id="payType"
                  name="payType"
                  value={formData.payType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Payment Type</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </CFormSelect>
              </CInputGroup>
            </CCol>

            {/* Date */}
            <CCol md={6}>
              <CInputGroup className="mt-4">
                <CInputGroupText>
                  <BsCalendarDate style={{ fontSize: '22px', color: 'gray' }} />
                </CInputGroupText>
                <CFormInput
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            {/* Description */}
            <CCol md={12}>
              <CFormLabel>Description</CFormLabel>
              <CFormTextarea
                id="description"
                name="description"
                rows="3"
                placeholder="Enter expense description"
                value={formData.description}
                onChange={handleChange}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            {/* Document Upload */}
            <CCol md={6}>
              <CFormLabel htmlFor="document">
                <FaFileLines style={{ fontSize: '22px', color: 'gray' }} /> Upload Documents
              </CFormLabel>
              <CFormInput type="file" id="document" multiple onChange={handleFileChange} />
            </CCol>

            {/* Document Previews */}
            <CCol md={6} className="mt-4">
              {formData.documents.length > 0 && (
                <div className="d-flex flex-wrap gap-2">
                  {formData.documents.map((doc, index) => (
                    <div key={index} className="d-flex flex-column align-items-center">
                      {doc.contentType.startsWith('image/') ? (
                        <img
                          src={`data:${doc.contentType};base64,${doc.base64}`}
                          alt={doc.filename}
                          style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '5px' }}
                        />
                      ) : (
                        <a
                          href={`data:${doc.contentType};base64,${doc.base64}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View {doc.filename}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CCol>
          </CRow>

        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" type="submit" onClick={handleSubmit}>
          Submit
        </CButton>
        <CButton color="secondary" onClick={handleCloseModal}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ExpenseForm
