import React, { useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CCol,
  CInputGroup,
  CInputGroupText,
  
} from '@coreui/react';
import { cilCalendar, cilUser, cilHome, cilMoney, cilCarAlt, cilLocationPin,cilDollar, cilTruck,      } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const LRForm = ({ handleAddModalClose, addModalOpen }) => {
  const [formData, setFormData] = useState({
      lrNumber: '',
      date: '',
      vehicleNumber: '',
      owner: '',
      consignorName: '',
      consignorAddress: '',
      consigneeName: '',
      consigneeAddress: '',
      customer: '',
      from: '',
      to: '',
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
      transporterFreight: ''
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    handleAddModalClose();
  };

  return (
    <CModal
      visible={addModalOpen}
      onClose={handleAddModalClose}
      size="lg"
      className="dark-modal"
    >
      <CModalHeader closeButton>Lorry Receipt (LR) Form</CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit}>
          {/* Basic Details */}
          <h5>Basic Details</h5>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="lrNumber">LR Number</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  id="lrNumber"
                  name="lrNumber"
                  value={formData.lrNumber}
                  onChange={handleChange}
                />
              </CInputGroup>
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="date">Date</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilCalendar} />
                </CInputGroupText>
                <CFormInput
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow className="mb-3">
      <CCol md={6}>
        <CFormLabel htmlFor="vehicleNumber">Vehicle Number</CFormLabel>
        <CInputGroup>
          <CInputGroupText>
            <CIcon icon={cilCarAlt} />
          </CInputGroupText>
          <CFormInput
            id="vehicleNumber"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            placeholder="Enter Vehicle Number"
          />
        </CInputGroup>
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="owner">Owner</CFormLabel>
        <CInputGroup>
          <CInputGroupText>
            <CIcon icon={cilUser} />
          </CInputGroupText>
          <CFormInput
            id="owner"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            placeholder="Enter Owner Name"
          />
        </CInputGroup>
      </CCol>
    </CRow>


          {/* Consignor Details */}
          <h5>Consignor Details</h5>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="consignorName">Consignor Name</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  id="consignorName"
                  name="consignorName"
                  value={formData.consignorName}
                  onChange={handleChange}
                />
              </CInputGroup>
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="consignorAddress">Consignor Address</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilHome} />
                </CInputGroupText>
                <CFormInput
                  id="consignorAddress"
                  name="consignorAddress"
                  value={formData.consignorAddress}
                  onChange={handleChange}
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <h5>Consignee Details</h5>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="consigneeName">Consignee Name</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  id="consigneeName"
                  name="consigneeName"
                  value={formData.consigneeName}
                  onChange={handleChange}
                />
              </CInputGroup>
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="consigneeAddress">Consignee Address</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilHome} />
                </CInputGroupText>
                <CFormInput
                  id="consigneeAddress"
                  name="consigneeAddress"
                  value={formData.consigneeAddress}
                  onChange={handleChange}
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <h5>Customer Details</h5>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="customerName">Customer Name</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                />
              </CInputGroup>
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="customerAddress">Customer Address</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilHome} />
                </CInputGroupText>
                <CFormInput
                  id="customerAddress"
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleChange}
                />
              </CInputGroup>
            </CCol>
          </CRow>


      <h5>Route Details</h5>
      <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel htmlFor="from">From</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilLocationPin} />
            </CInputGroupText>
            <CFormInput
              id="from"
              name="from"
              value={formData.from}
              onChange={handleChange}
              placeholder="Enter From Location"
            />
          </CInputGroup>
        </CCol>
        <CCol md={6}>
          <CFormLabel htmlFor="to">To</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilLocationPin} />
            </CInputGroupText>
            <CFormInput
              id="to"
              name="to"
              value={formData.to}
              onChange={handleChange}
              placeholder="Enter To Location"
            />
          </CInputGroup>
        </CCol>
      </CRow>
      <h5>Cargo Details</h5>
      <CRow className="mb-3">
        <CCol  md={6}>
          <CFormLabel htmlFor="itemName">Item Name</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="Enter Item Name"
            />
          </CInputGroup>
        </CCol>
        <CCol md={6}>
          <CFormLabel htmlFor="quantity">Quantity</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              id="quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter Quantity"
            />
          </CInputGroup>
        </CCol>
        </CRow>
        <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel htmlFor="unit">Unit</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="Enter Unit"
            />
          </CInputGroup>
        </CCol>
        <CCol md={6}>
          <CFormLabel htmlFor="actualWeight">Actual Weight</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              id="actualWeight"
              type="number"
              name="actualWeight"
              value={formData.actualWeight}
              onChange={handleChange}
              placeholder="Enter Actual Weight"
            />
          </CInputGroup>
        </CCol>
        </CRow>
      
      
      <CRow className="mb-3">
        
        <CCol md={6}>
          <CFormLabel htmlFor="chargedWeight">Charged Weight</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              id="chargedWeight"
              type="number"
              name="chargedWeight"
              value={formData.chargedWeight}
              onChange={handleChange}
              placeholder="Enter Charged Weight"
            />
          </CInputGroup>
        </CCol>
      </CRow>

          {/* Freight Details */}
          <h5>Freight Details</h5>
          <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel htmlFor="customerRate">Customer Rate</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilDollar} />
            </CInputGroupText>
            <CFormInput
              id="customerRate"
              type="number"
              name="customerRate"
              value={formData.customerRate}
              onChange={handleChange}
              placeholder="Enter Customer Rate"
            />
          </CInputGroup>
        </CCol>
        <CCol md={6}>
          <CFormLabel htmlFor="totalAmount">Total Amount</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilDollar} />
            </CInputGroupText>
            <CFormInput
              id="totalAmount"
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              placeholder="Enter Total Amount"
            />
          </CInputGroup>
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel htmlFor="transporterRate">Transporter Rate</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilTruck} />
            </CInputGroupText>
            <CFormInput
              id="transporterRate"
              type="number"
              name="transporterRate"
              value={formData.transporterRate}
              onChange={handleChange}
              placeholder="Enter Transporter Rate"
            />
          </CInputGroup>
        </CCol>
        <CCol md={6}>
          <CFormLabel htmlFor="totalTransporterAmount">Total Transporter Amount</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilDollar} />
            </CInputGroupText>
            <CFormInput
              id="totalTransporterAmount"
              type="number"
              name="totalTransporterAmount"
              value={formData.totalTransporterAmount}
              onChange={handleChange}
              placeholder="Enter Total Transporter Amount"
            />
          </CInputGroup>
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel htmlFor="transporterRateOn">Transporter Rate On</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              id="transporterRateOn"
              name="transporterRateOn"
              value={formData.transporterRateOn}
              onChange={handleChange}
              placeholder="Enter Transporter Rate On"
            />
          </CInputGroup>
        </CCol>
        <CCol md={6}>
          <CFormLabel htmlFor="customerRateOn">Customer Rate On</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              id="customerRateOn"
              name="customerRateOn"
              value={formData.customerRateOn}
              onChange={handleChange}
              placeholder="Enter Customer Rate On"
            />
          </CInputGroup>
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel htmlFor="customerFreight">Customer Freight</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              id="customerFreight"
              type="number"
              name="customerFreight"
              value={formData.customerFreight}
              onChange={handleChange}
              placeholder="Enter Customer Freight"
            />
          </CInputGroup>
        </CCol>
        <CCol md={6}>
          <CFormLabel htmlFor="transporterFreight">Transporter Freight</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              id="transporterFreight"
              type="number"
              name="transporterFreight"
              value={formData.transporterFreight}
              onChange={handleChange}
              placeholder="Enter Transporter Freight"
            />
          </CInputGroup>
        </CCol>
      </CRow>

          <CButton type="submit" color="primary">
            Submit
          </CButton>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={handleAddModalClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default LRForm;
