import React from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol, CButton } from '@coreui/react'
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaAddressCard,
  FaPhoneAlt,
  FaMobileAlt,
  FaGlobe,
} from 'react-icons/fa'

const iconStyle = {
  fontSize: '1.2rem',
  color: '#0d6efd',
  backgroundColor: '#e9f3ff',
  padding: '10px',
  borderRadius: '10px',
  minWidth: '42px',
  textAlign: 'center',
}

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#6c757d',
  marginBottom: '2px',
}

const valueStyle = {
  fontSize: '1rem',
  fontWeight: '500',
  color: '#212529',
}

const CompanyProfileCard = ({ company, onEdit }) => {
  return (
    <CCard className="shadow rounded-4 border-0">
      <CCardHeader className="bg-primary text-white d-flex justify-content-between align-items-center rounded-top-4 px-4 py-3">
        <h5 className="mb-0 fw-semibold">Company Profile</h5>
        <CButton color="light" size="sm" onClick={onEdit}>
          <i className="bi bi-pencil me-1"></i> Edit Profile
        </CButton>
      </CCardHeader>

      <CCardBody className="px-4 py-4">
        <CRow className="gy-4">
          {[
            { label: 'Company Name', value: company.name, icon: <FaBuilding /> },
            { label: 'Address', value: company.address, icon: <FaMapMarkerAlt /> },
            { label: 'GSTIN', value: company.gstin, icon: <FaAddressCard /> },
            { label: 'Office Number', value: company.officeNumber, icon: <FaPhoneAlt /> },
            { label: 'Mobile Number', value: company.mobileNumber, icon: <FaMobileAlt /> },
            { label: 'Website', value: company.website, icon: <FaGlobe /> },
          ].map((field, index) => (
            <CCol md={6} key={index}>
              <div className="d-flex align-items-start gap-3 border rounded-3 p-3 bg-white shadow-sm h-100">
                <div style={iconStyle}>{field.icon}</div>
                <div>
                  <div style={labelStyle}>{field.label}</div>
                  <div style={valueStyle}>{field.value}</div>
                </div>
              </div>
            </CCol>
          ))}
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default CompanyProfileCard
