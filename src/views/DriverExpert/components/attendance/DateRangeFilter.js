import React from 'react';
import { CForm, CFormLabel, CFormInput, CButton } from '@coreui/react';

const DateRangeFilter = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {

    const clearDateFilter = () => {
        onStartDateChange('');
        onEndDateChange('');
    };
    return (
        <CForm>
            <div className="d-flex gap-3">
                <div className="mb-3">
                    <CFormLabel htmlFor="startDate">From Date</CFormLabel>
                    <CFormInput
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => onStartDateChange(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <CFormLabel htmlFor="endDate">To Date</CFormLabel>
                    <CFormInput
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => onEndDateChange(e.target.value)}
                    />
                </div>
                <CButton color="secondary" className="mt-auto mb-3" onClick={clearDateFilter}>
                    Clear
                </CButton>
            </div>
        </CForm>
    );
};

export default DateRangeFilter;
