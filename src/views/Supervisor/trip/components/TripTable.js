import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell, CBadge, CButton, CButtonGroup } from '@coreui/react';

const TripTable = ({ trips, onEdit, onDelete }) => {
    if (trips.length === 0) {
        return (
            <div className="text-center p-4 bg-light rounded">
                <p className="text-muted mb-0">No trips have been added yet.</p>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <CTable hover responsive>
                <CTableHead color="light">
                    <CTableRow>
                        <CTableHeaderCell>Vehicle</CTableHeaderCell>
                        <CTableHeaderCell>Driver</CTableHeaderCell>
                        <CTableHeaderCell>Category</CTableHeaderCell>
                        <CTableHeaderCell>Start Location</CTableHeaderCell>
                        <CTableHeaderCell>End Location</CTableHeaderCell>
                        <CTableHeaderCell>Start Date</CTableHeaderCell>
                        <CTableHeaderCell>Budget</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {trips.map((trip) => (
                        <CTableRow key={trip.id}>
                            <CTableDataCell>{trip.vehicleId}</CTableDataCell>
                            <CTableDataCell>{trip.driverId}</CTableDataCell>
                            <CTableDataCell>
                                <CBadge color={trip.categoryId === 'Taxi' ? 'primary' : 'success'}>
                                    {trip.categoryId}
                                </CBadge>
                            </CTableDataCell>
                            <CTableDataCell>{trip.startLocation}</CTableDataCell>
                            <CTableDataCell>{trip.endLocation}</CTableDataCell>
                            <CTableDataCell>{new Date(trip.startDate).toLocaleDateString()}</CTableDataCell>
                            <CTableDataCell>₹{trip.budgetAlloted}</CTableDataCell>
                            <CTableDataCell>
                                <CButtonGroup>
                                    <CButton color="primary" variant="outline" size="sm" onClick={() => onEdit(trip)} title="Edit">
                                        <Pencil size={16} />
                                    </CButton>
                                    <CButton color="danger" variant="outline" size="sm" onClick={() => onDelete(trip.id)} title="Delete">
                                        <Trash2 size={16} />
                                    </CButton>
                                </CButtonGroup>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </div>
    );
};

export default TripTable;
