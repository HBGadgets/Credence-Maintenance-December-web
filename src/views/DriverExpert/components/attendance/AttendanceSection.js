import React, { useState } from 'react';
import { attendance } from '../../data/attendance';
import DateRangeFilter from '../attendance/DateRangeFilter';
import AttendanceStats from '../attendance/AttendanceStats';
import LeaveRequests from '../attendance/LeaveRequests';
import AttendanceTable from '../attendance/AttendanceTable';
import { CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react';

const AttendanceSection = ({ driverId }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filteredAttendance = attendance
        .filter((a) => a.driverId === driverId)
        .filter((a) => {
            if (!startDate || !endDate) return true;
            const date = new Date(a.date);
            return date >= new Date(startDate) && date <= new Date(endDate);
        });

    const handleApproveLeave = (id) => {
        console.log('Approving leave:', id);
    };

    const handleDenyLeave = (id) => {
        console.log('Denying leave:', id);
    };

    return (
        <CCard className="mb-4">
            <CCardHeader>
                <h2>Attendance</h2>
            </CCardHeader>
            <CCardBody>
                <CRow>
                    <CCol xs="12" sm="6" md="4">
                        <DateRangeFilter
                            startDate={startDate}
                            endDate={endDate}
                            onStartDateChange={setStartDate}
                            onEndDateChange={setEndDate}
                        />
                    </CCol>
                </CRow>
                <AttendanceStats attendanceData={filteredAttendance} />
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Leave Requests</h3>
                    <LeaveRequests
                        requests={filteredAttendance}
                        onApprove={handleApproveLeave}
                        onDeny={handleDenyLeave}
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Attendance Records</h3>
                    <AttendanceTable attendanceData={filteredAttendance} />
                </div>
            </CCardBody>
        </CCard>
    );
};

export default AttendanceSection;
