// TripsTable.js
import React from 'react';
import { CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/react';

const TripsTable = ({ trips }) => {
    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="overflow-x-auto">
            <CTable bordered responsive>
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
                    {trips.map((trip) => (
                        <CTableRow key={trip.id}>
                            <CTableDataCell>{formatDateTime(trip.date)}</CTableDataCell>
                            <CTableDataCell>{trip.vehicleName}</CTableDataCell>
                            <CTableDataCell>{formatDateTime(trip.tripStart)}</CTableDataCell>
                            <CTableDataCell>{formatDateTime(trip.tripEnd)}</CTableDataCell>
                            <CTableDataCell>{trip.logKm} km</CTableDataCell>
                            <CTableDataCell>
                                <span
                                    className={`px-2 py-1 rounded-full ${Math.abs(trip.logKm - trip.gpsKm) <= 5
                                        ? 'bg-success text-white'
                                        : 'bg-danger text-white'
                                        }`}
                                >
                                    {trip.gpsKm} km
                                </span>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </div>
    );
};

export default TripsTable;
