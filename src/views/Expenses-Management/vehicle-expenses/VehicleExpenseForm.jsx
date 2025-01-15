import React, { useState, useEffect } from "react";
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
} from "@coreui/react";
import { Car, DollarSign, File, Tag } from "lucide-react"; // Import icons from lucide-react

const ExpenseForm = ({ onExpensesUpdate, openModal, handleCloseModal }) => {
  const [formData, setFormData] = useState({
    vehicleId: "",
    category: "",
    amount: "",
    vendor: "",
    receipt: null,
  });
  const [vehicles, setVehicles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, receipt: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("vehicleId", formData.vehicleId);
    data.append("category", formData.category);
    data.append("amount", formData.amount);
    data.append("vendor", formData.vendor);
    // data.append("receipt", formData.receipt);
  };

  return (
    <CModal visible={openModal} onClose={handleCloseModal} alignment="center">
      <CModalHeader>Log Expense</CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            {/* Vehicle */}
            <CCol md={6}>
              <CFormLabel htmlFor="vehicleId">
                <Car className="me-2" />
                Vehicle
              </CFormLabel>
              <CFormSelect
                id="vehicleId"
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {/* Category */}
            <CCol md={6}>
              <CFormLabel htmlFor="category">
                <Tag className="me-2" />
                Category
              </CFormLabel>
              <CFormSelect
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Fuel">Fuel</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Tolls">Tolls</option>
                <option value="Insurance">Insurance</option>
                <option value="Licensing">Licensing</option>
                <option value="Parts">Parts</option>
                <option value="Accident">Accident</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            {/* Amount */}
            <CCol md={6}>
              <CFormLabel htmlFor="amount">
                <DollarSign className="me-2" />
                Amount
              </CFormLabel>
              <CFormInput
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </CCol>

            {/* Vendor */}
            <CCol md={6}>
              <CFormLabel htmlFor="vendor">
                <Tag className="me-2" />
                Vendor
              </CFormLabel>
              <CFormInput
                type="text"
                id="vendor"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            {/* Receipt */}
            <CCol md={6}>
              <CFormLabel htmlFor="receipt">
                <File className="me-2" />
                Receipt
              </CFormLabel>
              <CFormInput
                type="file"
                id="receipt"
                onChange={handleFileChange}
              />
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
  );
};

export default ExpenseForm;
