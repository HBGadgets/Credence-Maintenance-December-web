import React from 'react';
import { CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/react';

const AttendanceTable = ({ attendanceData }) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'present':
                return 'bg-success text-white';
            case 'absent':
                return 'bg-danger text-white';
            case 'leave-pending':
                return 'bg-warning text-dark';
            case 'leave-approved':
                return 'bg-primary text-white';
            default:
                return '';
        }
    };

    const formatStatus = (status) => {
        switch (status) {
            case 'present':
                return 'Present';
            case 'absent':
                return 'Absent';
            case 'leave-pending':
                return 'Leave Pending';
            case 'leave-approved':
                return 'Leave Approved';
            default:
                return '';
        }
    };

    return (
        <CTable bordered>
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                {attendanceData.map((record) => (
                    <CTableRow key={record.id}>
                        <CTableDataCell>{record.date}</CTableDataCell>
                        <CTableDataCell>
                            <span className={`badge ${getStatusStyle(record.status)}`}>
                                {formatStatus(record.status)}
                            </span>
                        </CTableDataCell>
                    </CTableRow>
                ))}
            </CTableBody>
        </CTable>
    );
};

export default AttendanceTable;
