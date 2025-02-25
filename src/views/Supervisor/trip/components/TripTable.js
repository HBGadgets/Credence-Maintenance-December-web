import { useState } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import {
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton,
    CListGroup,
    CListGroupItem,
} from '@coreui/react';

const TripTable = ({ trips, onEdit, onDelete }) => {
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleView = (trip) => {
        setSelectedTrip(trip);
        setShowModal(true);
    };

    const renderTaxiDetails = (trip) => (
        <CListGroup>
            {Object.entries(trip).map(([key, value]) => (
                <CListGroupItem key={key}>
                    <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}
                </CListGroupItem>
            ))}
        </CListGroup>
    );

    const renderTruckDetails = (trip) => (
        <CListGroup>
            {Object.entries(trip).map(([key, value]) => (
                <CListGroupItem key={key}>
                    <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}
                </CListGroupItem>
            ))}
        </CListGroup>
    );

    const renderTaxiTrip = (trip) => (
        <tr key={trip.id}>
            <td>{trip.vehicleId}</td>
            <td>{trip.driverId}</td>
            <td><span className="badge bg-primary">Taxi</span></td>
            <td>{trip.startLocation}</td>
            <td>{trip.endLocation}</td>
            <td>{new Date(trip.startDate).toLocaleDateString()}</td>
            <td>₹{trip.budgetAlloted}</td>
            <td>
                <div className="btn-group">
                    <button onClick={() => handleView(trip)} className="btn btn-sm btn-outline-info">
                        <Eye size={16} />
                    </button>
                    <button onClick={() => onEdit(trip)} className="btn btn-sm btn-outline-primary">
                        <Pencil size={16} />
                    </button>
                    <button onClick={() => onDelete(trip.id)} className="btn btn-sm btn-outline-danger">
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );

    const renderTruckTrip = (trip) => (
        <tr key={trip.id}>
            <td>{trip.vehicleNumber}</td>
            <td>{trip.driverName}</td>
            <td><span className="badge bg-success">Truck</span></td>
            <td>{trip.from}</td>
            <td>{trip.to}</td>
            <td>{new Date(trip.date).toLocaleDateString()}</td>
            <td>₹{trip.totalAmount}</td>
            <td>
                <div className="btn-group">
                    <button onClick={() => handleView(trip)} className="btn btn-sm btn-outline-info">
                        <Eye size={16} />
                    </button>
                    <button onClick={() => onEdit(trip)} className="btn btn-sm btn-outline-primary">
                        <Pencil size={16} />
                    </button>
                    <button onClick={() => onDelete(trip.id)} className="btn btn-sm btn-outline-danger">
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <>
            <div className="table-responsive mt-4">
                <table className="table table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Vehicle</th>
                            <th>Driver</th>
                            <th>Category</th>
                            <th>Start Location</th>
                            <th>End Location</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trips.length > 0 ? trips.map(trip =>
                            'budgetAlloted' in trip ? renderTaxiTrip(trip) : renderTruckTrip(trip)
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center text-muted">No trips available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
                <CModalHeader closeButton>
                    <h5 className="mb-0">
                        {selectedTrip && 'budgetAlloted' in selectedTrip ? 'Taxi Trip Details' : 'Truck Trip Details'}
                    </h5>
                </CModalHeader>
                <CModalBody>
                    {selectedTrip && (
                        'budgetAlloted' in selectedTrip ? renderTaxiDetails(selectedTrip) : renderTruckDetails(selectedTrip)
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default TripTable;
