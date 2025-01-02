import React from 'react';
import { CRow, CCol } from '@coreui/react';

const SalaryDetail = ({ label, amount, className = '' }) => (
    <CRow className={`py-2 ${className}`}>
        <CCol className="text-muted">{label}</CCol>
        <CCol className="font-weight-semibold">₹{amount.toLocaleString()}</CCol>
    </CRow>
);

export default SalaryDetail;
