import React, { useState } from 'react';
import { attendance } from '../../data/attendance';
import DateRangeFilter from '../attendance/DateRangeFilter';
import AttendanceStats from '../attendance/AttendanceStats';
import LeaveRequests from '../attendance/LeaveRequests';
import AttendanceTable from '../attendance/AttendanceTable';
import { ChevronRight } from 'lucide-react';
import { CButton, CCard, CCardBody, CCol, CModal, CModalBody, CModalHeader, CModalTitle, CRow } from '@coreui/react';

const AttendanceSection = ({ driverId }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }
    const filteredAttendance = attendance
        .filter(a => a.driverId === driverId)
        .filter(a => {
            if (!startDate || !endDate) return true;
            const date = new Date(a.date);
            return date >= new Date(startDate) && date <= new Date(endDate);
        });

    return (
        <div>
            <CCard>
                <CCardBody>
                    <CRow>
                        <CCol xs="12" md="6" lg="4">
                            <DateRangeFilter
                                startDate={startDate}
                                endDate={endDate}
                                onStartDateChange={setStartDate}
                                onEndDateChange={setEndDate}
                            />
                        </CCol>
                    </CRow>

                    <AttendanceStats attendanceData={filteredAttendance} />
                    <LeaveRequests
                        requests={filteredAttendance}
                        onApprove={(id) => console.log('Approve:', id)}
                        onDeny={(id) => console.log('Deny:', id)}
                    />

                    <div className="mt-4">
                        <CButton
                            onClick={handleOpen}
                            color="link"
                            className="d-flex align-items-center text-primary"
                        >
                            View Full Attendance History
                            <ChevronRight size={16} />
                        </CButton>
                    </div>
                </CCardBody>
            </CCard>

            <CModal
                alignment="center"
                scrollable
                visible={open}
                onClose={() => setOpen(false)}
                fullscreen
            >
                <CModalHeader>
                    <CModalTitle>Full Attendance History</CModalTitle>
                </CModalHeader>

                <CModalBody className="d-flex flex-column gap-3">
                    <DateRangeFilter
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                    />
                    <AttendanceTable attendanceData={filteredAttendance} />
                </CModalBody>
            </CModal>
        </div>
    );
};

export default AttendanceSection;
