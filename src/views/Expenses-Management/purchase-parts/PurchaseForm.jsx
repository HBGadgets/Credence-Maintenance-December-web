import React, { useState } from 'react';
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CCol,
  CFormInput,
  CFormLabel,
  CButton,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import { cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const PurchaseForm = ({ addModalOpen, setAddModalOpen, handleAddModalClose }) => {
  const [partName, setPartName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [category, setCategory] = useState('');
  const [vendor, setVendor] = useState('');
  const [quantity, setQuantity] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [document, setDocument] = useState('');


  return (
    <CModal visible={addModalOpen} onClose={handleAddModalClose} size="lg" centered alignment='center'>
      <CModalHeader closeButton>
        <CModalTitle>ADD EXPENSE OF NEW PARTS</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <form >
          <CRow className="mb-3">
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="partName">Part Name</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  id="partName"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  required
                />
              </CInputGroup>
            </CCol>
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="vehicle">Select Vehicle</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  id="vehicle"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  required
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="category">Category</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </CInputGroup>
            </CCol>
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="vendor">Vendor</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  id="vendor"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  required
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="quantity">Quantity</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </CInputGroup>
            </CCol>
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="costPerUnit">Cost Per Unit</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  id="costPerUnit"
                  type="number"
                  value={costPerUnit}
                  onChange={(e) => setCostPerUnit(e.target.value)}
                  required
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="purchaseDate">Purchase Date</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
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
              <CFormLabel htmlFor="invoiceNumber">Invoice/Bill Number</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  id="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  required
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol xs={12}>
              <CFormLabel htmlFor="document">Select Document</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
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
              <CButton color="secondary" onClick={handleAddModalClose} className="me-2">
                Cancel
              </CButton>
              <CButton type="submit" color="primary">
                Add
              </CButton>
            </CCol>
          </CRow>
        </form>
      </CModalBody>
    </CModal>
  );
};

export default PurchaseForm;
