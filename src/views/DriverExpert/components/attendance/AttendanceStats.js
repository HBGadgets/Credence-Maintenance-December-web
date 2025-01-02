import React from 'react';
import { CCard, CCardBody, CRow, CCol } from '@coreui/react';

const AttendanceStats = ({ attendanceData }) => {
    const stats = {
        present: attendanceData.filter((a) => a.status === 'present').length,
        absent: attendanceData.filter((a) => a.status === 'absent').length,
        leavePending: attendanceData.filter((a) => a.status === 'leave-pending').length,
        leaveApproved: attendanceData.filter((a) => a.status === 'leave-approved').length,
    };

    return (
        <CRow className="mb-4">
            <CCol xs="12" sm="6" lg="3">
                <CCard color="success" textColor="white">
                    <CCardBody>
                        <h3>Present</h3>
                        <p className="fs-3 fw-bold">{stats.present}</p>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs="12" sm="6" lg="3">
                <CCard color="danger" textColor="white">
                    <CCardBody>
                        <h3>Absent</h3>
                        <p className="fs-3 fw-bold">{stats.absent}</p>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs="12" sm="6" lg="3">
                <CCard color="warning" textColor="dark">
                    <CCardBody>
                        <h3>Pending Leaves</h3>
                        <p className="fs-3 fw-bold">{stats.leavePending}</p>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs="12" sm="6" lg="3">
                <CCard color="primary" textColor="white">
                    <CCardBody>
                        <h3>Approved Leaves</h3>
                        <p className="fs-3 fw-bold">{stats.leaveApproved}</p>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default AttendanceStats;
