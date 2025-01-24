import React, { useState, useEffect } from "react";
import {
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormSelect
} from "@coreui/react";

const InvoiceForm = () => {
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    date: "",
    customerName: "",
    customerContact: "",
    startLocation: "",
    destination: "",
    distance: "",
    duration: "",
    startDateTime: "",
    endDateTime: "",
    vehicleDetails: "",
    driverName: "",
    driverContact: "",
    baseFare: "",
    distanceFare: "",
    durationFare: "",
    otherCharges: [{ description: "", amount: "" }],    taxType: "",
    taxRate: "",
    customTaxRate: "",
    tollCharges: [],
    total: "",
  });

  useEffect(() => {
    // Set the invoice number (could be a timestamp or a generated ID)
    const invoiceNumber = "INV" + new Date().getTime();
    const currentDate = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

    setFormData((prevData) => ({
      ...prevData,
      invoiceNumber,
      date: currentDate,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTollChange = (e, index) => {
    const updatedTolls = formData.tollCharges.map((toll, i) =>
      i === index ? e.target.value : toll
    );
    setFormData({ ...formData, tollCharges: updatedTolls });
  };

  const handleAddToll = () => {
    setFormData({ ...formData, tollCharges: [...formData.tollCharges, ""] });
  };

  const handleRemoveToll = (index) => {
    const updatedTolls = formData.tollCharges.filter((_, i) => i !== index);
    setFormData({ ...formData, tollCharges: updatedTolls });
  };
  const handleOtherChargeChange = (e, index) => {
    const { name, value } = e.target;
    const updatedCharges = formData.otherCharges.map((charge, i) =>
      i === index ? { ...charge, [name]: value } : charge
    );
    setFormData({ ...formData, otherCharges: updatedCharges });
  };

  const handleAddOtherCharge = () => {
    setFormData({
      ...formData,
      otherCharges: [...formData.otherCharges, { description: "", amount: "" }],
    });
  };
  const handleRemoveOtherCharge = (index) => {
    const updatedCharges = formData.otherCharges.filter((_, i) => i !== index);
    setFormData({ ...formData, otherCharges: updatedCharges });
  };

  const calculateTotal = () => {
    const total =
      parseFloat(formData.baseFare || 0) +
      parseFloat(formData.distanceFare || 0) +
      parseFloat(formData.durationFare || 0) +
      parseFloat(formData.taxRate || 0) +
      formData.otherCharges.reduce(
        (sum, charge) => sum + parseFloat(charge.amount || 0),
        0
      ) +
      formData.tollCharges.reduce((sum, toll) => sum + parseFloat(toll || 0), 0);
    setFormData({ ...formData, total: total.toFixed(2) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Send formData to backend for processing
  };

  return (
    <CContainer>
      
          
            
           
              <CForm onSubmit={handleSubmit}>
                {/* Invoice Header */}
                <h5>Invoice Details</h5>
                <CRow>
                  <CCol>
                    <CFormLabel>Invoice Number</CFormLabel>
                    <CFormInput
                      type="text"
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      readOnly
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormLabel>Date</CFormLabel>
                    <CFormInput
                      type="date"
                      name="date"
                      value={formData.date}
                      readOnly
                    />
                  </CCol>
                </CRow>

                {/* Customer Details */}
                <h5 className="mt-4">Customer Details</h5>
                <CRow>
                  <CCol md="6">
                    <CFormLabel>Customer Name</CFormLabel>
                    <CFormInput
                      type="text"
                      name="customerName"
                      placeholder="Enter customer name"
                      value={formData.customerName}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormLabel>Customer Contact</CFormLabel>
                    <CFormInput
                      type="text"
                      name="customerContact"
                      placeholder="Enter customer contact"
                      value={formData.customerContact}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>

                {/* Trip Details */}
                <h5 className="mt-4">Trip Details</h5>
                <CRow>
                  <CCol md="6">
                    <CFormLabel>Start Location</CFormLabel>
                    <CFormInput
                      type="text"
                      name="startLocation"
                      placeholder="Enter start location"
                      value={formData.startLocation}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormLabel>Destination</CFormLabel>
                    <CFormInput
                      type="text"
                      name="destination"
                      placeholder="Enter destination"
                      value={formData.destination}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-3">
                  <CCol md="6">
                    <CFormLabel>Distance (km)</CFormLabel>
                    <CFormInput
                      type="number"
                      name="distance"
                      placeholder="Enter distance"
                      value={formData.distance}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormLabel>Duration (hours)</CFormLabel>
                    <CFormInput
                      type="number"
                      name="duration"
                      placeholder="Enter duration"
                      value={formData.duration}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-3">
                  <CCol md="6">
                    <CFormLabel>Start Date & Time</CFormLabel>
                    <CFormInput
                      type="datetime-local"
                      name="startDateTime"
                      value={formData.startDateTime}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormLabel>End Date & Time</CFormLabel>
                    <CFormInput
                      type="datetime-local"
                      name="endDateTime"
                      value={formData.endDateTime}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>

                {/* Taxi Details */}
                <h5 className="mt-4">Taxi Details</h5>
                <CRow>
                  <CCol md="6">
                    <CFormLabel>Vehicle Details</CFormLabel>
                    <CFormInput
                      type="text"
                      name="vehicleDetails"
                      placeholder="Enter vehicle type/number"
                      value={formData.vehicleDetails}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormLabel>Driver Name</CFormLabel>
                    <CFormInput
                      type="text"
                      name="driverName"
                      placeholder="Enter driver name"
                      value={formData.driverName}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-3">
                  <CCol md="6">
                    <CFormLabel>Driver Contact</CFormLabel>
                    <CFormInput
                      type="text"
                      name="driverContact"
                      placeholder="Enter driver contact"
                      value={formData.driverContact}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>

                {/* Cost Breakdown */}
                <h5 className="mt-4">Cost Breakdown</h5>
                <CRow>
                  <CCol md="6">
                    <CFormLabel>Base Fare ($)</CFormLabel>
                    <CFormInput
                      type="number"
                      name="baseFare"
                      placeholder="Enter base fare"
                      value={formData.baseFare}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormLabel>Distance Fare ($)</CFormLabel>
                    <CFormInput
                      type="number"
                      name="distanceFare"
                      placeholder="Enter distance fare"
                      value={formData.distanceFare}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-3">
                  <CCol md="6">
                    <CFormLabel>Duration Fare ($)</CFormLabel>
                    <CFormInput
                      type="number"
                      name="durationFare"
                      placeholder="Enter duration fare"
                      value={formData.durationFare}
                      onChange={handleChange}
                    />
                  </CCol>
                  
                </CRow>
                <CRow className="mt-3">
                 

                {/* Toll Charges */}
                <h5 className="mt-4">Toll Charges</h5>
                {formData.tollCharges.map((toll, index) => (
                  <CRow key={index}>
                    <CCol md="6">
                      <CFormLabel style={{textAlign:'cenetr'}}>Toll {index + 1} ($)</CFormLabel>
                      <CFormInput
                        type="number"
                        value={toll}
                        onChange={(e) => handleTollChange(e, index)}
                        placeholder={`Toll ${index + 1}`}
                      />
                    </CCol>
                    <CCol md="6">
                      <CButton
                        type="button"
                        color="red"
                        onClick={() => handleRemoveToll(index)}
                        className="mt-4"
                      >
                        Remove Toll
                      </CButton>
                    </CCol>
                  </CRow>
                ))}
                <CButton
                  type="button"
                  color="primary"
                  onClick={handleAddToll}
                  className="mt-3"
                  style={{marginLeft:'12px',width:'6rem'}}
                >
                  Add Toll
                </CButton>

                {/* Total */}
                
                  
                </CRow>


                {/* Other Charges with Description */}
                <h5 className="mt-4">Other Charges</h5>
                {formData.otherCharges.map((charge, index) => (
                  <CRow key={index}>
                    <CCol md="5">
                      <CFormLabel>Description</CFormLabel>
                      <CFormInput
                        type="text"
                        name="description"
                        value={charge.description}
                        onChange={(e) => handleOtherChargeChange(e, index)}
                        placeholder={`Charge ${index + 1} description`}
                      />
                    </CCol>
                    <CCol md="5">
                      <CFormLabel>Amount ($)</CFormLabel>
                      <CFormInput
                        type="number"
                        name="amount"
                        value={charge.amount}
                        onChange={(e) => handleOtherChargeChange(e, index)}
                        placeholder={`Charge ${index + 1} amount`}
                      />
                    </CCol>
                    <CCol md="2" className="d-flex align-items-end">
                      <CButton
                        type="button"
                        color="danger"
                        onClick={() => handleRemoveOtherCharge(index)}
                      >
                        Remove
                      </CButton>
                    </CCol>
                  </CRow>
                ))}
                <CButton
                  type="button"
                  color="primary"
                  onClick={handleAddOtherCharge}
                  className="mt-3"
                >
                  Add Another Charge
                </CButton>


                 {/* Tax Type and Rate */}
                 <h5 className="mt-4">Tax Details</h5>
                <CRow>
                  <CCol md="6">
                    <CFormLabel>Tax Type</CFormLabel>
                    <CFormSelect
                      name="taxType"
                      value={formData.taxType}
                      onChange={handleChange}
                    >
                      <option value="">Select Tax Type</option>
                      <option value="VAT">VAT</option>
                      <option value="GST">GST</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md="6">
                    <CFormLabel>Tax Rate</CFormLabel>
                    <CFormSelect
                      name="taxRate"
                      value={formData.taxRate}
                      onChange={handleChange}
                    >
                      <option value="">Select Tax Rate</option>
                      <option value="18">18%</option>
                      <option value="5">5%</option>
                      <option value="custom">Custom</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
                {formData.taxRate === "custom" && (
                  <CRow className="mt-3">
                    <CCol md="6">
                      <CFormLabel>Custom Tax Rate (%)</CFormLabel>
                      <CFormInput
                        type="number"
                        name="customTaxRate"
                        value={formData.customTaxRate}
                        onChange={handleChange}
                        placeholder="Enter custom tax rate"
                      />
                    </CCol>
                  </CRow>
                )}

                <CCol md="6">
                    <CFormLabel>Total ($)</CFormLabel>
                    <CFormInput
                      type="number"
                      name="total"
                      placeholder="Total amount"
                      value={formData.total}
                      readOnly
                    />
                  </CCol>

                <CButton type="submit" color="primary" className="mt-4" block>
                  Generate Invoice
                </CButton>
              </CForm>
           
        
      
    </CContainer>
  );
};

export default InvoiceForm;
