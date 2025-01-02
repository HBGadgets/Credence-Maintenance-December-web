import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CButton, CModal, CModalHeader, CModalTitle, CModalBody } from '@coreui/react';
import DateRangeFilter from '../../common/DateRangeFilter';

const TripsTable = ({ trips }) => {
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleOpen = () => {
        setOpen(true);
    }

    // Filter trips based on the date range
    const filteredTrips = trips.filter(trip => {
        if (!startDate || !endDate) return true;
        const date = new Date(trip.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
    });

    // Format the date and time
    const formatDateTime = (dateString) => new Date(dateString).toLocaleString();

    // Table component for displaying trips
    const TripsContent = ({ data }) => (
        <CTable hover responsive bordered>
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Vehicle</CTableHeaderCell>
                    <CTableHeaderCell>Trip Start</CTableHeaderCell>
                    <CTableHeaderCell>Trip End</CTableHeaderCell>
                    <CTableHeaderCell>Log KM</CTableHeaderCell>
                    <CTableHeaderCell>GPS KM</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                {data.map((trip) => (
                    <CTableRow key={trip.id}>
                        <CTableDataCell>{trip.date}</CTableDataCell>
                        <CTableDataCell>{trip.vehicleName}</CTableDataCell>
                        <CTableDataCell>{formatDateTime(trip.tripStart)}</CTableDataCell>
                        <CTableDataCell>{formatDateTime(trip.tripEnd)}</CTableDataCell>
                        <CTableDataCell>{trip.logKm} km</CTableDataCell>
                        <CTableDataCell>
                            <span
                                className={`badge ${Math.abs(trip.logKm - trip.gpsKm) <= 5
                                    ? 'bg-success'
                                    : 'bg-danger'
                                    }`}
                            >
                                {trip.gpsKm} km
                            </span>
                        </CTableDataCell>
                    </CTableRow>
                ))}
            </CTableBody>
        </CTable>
    );

    return (
        <div>
            <div className="overflow-auto">
                <TripsContent data={filteredTrips.slice(0, 5)} />
            </div>
            <div className="mt-4">
                <CButton
                    onClick={handleOpen}
                    color="link"
                    className="d-flex align-items-center text-primary"
                >
                    View All Trips
                    <ChevronRight size={16} />
                </CButton>
            </div>

            <CModal
                alignment="center"
                scrollable
                visible={open}
                onClose={() => setOpen(false)}
                fullscreen
            >

                <CModalHeader>
                    <CModalTitle>All Trips Details</CModalTitle>
                </CModalHeader>

                <CModalBody className="d-flex flex-column gap-3">
                    <DateRangeFilter
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                    />
                    <TripsContent data={filteredTrips} />
                </CModalBody>
            </CModal>
        </div>
    );
};

export default TripsTable;
