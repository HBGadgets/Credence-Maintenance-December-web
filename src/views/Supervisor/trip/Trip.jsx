import React, { useState } from 'react';
import { CContainer, CNavbar, CNavbarBrand, CCard, CCardBody, CCardTitle, CRow, CCol } from '@coreui/react';
import TripTable from './components/TripTable';
import TripForm from './components/TripForm';


const Trip = () => {
  const [trips, setTrips] = useState([]);

  const handleAddTrip = (trip) => {
    setTrips([...trips, { ...trip, id: Date.now().toString() }]);
  };

  const handleEdit = (trip) => {
    setTrips(trips.map((t) => (t.id === trip.id ? trip : t)));
  };

  const handleDelete = (id) => {
    setTrips(trips.filter((trip) => trip.id !== id));
  };

  return (
    <div>
      <CRow>
        <CCol xs="12">
          {/* Trip Management Form */}
          <CCard className="shadow-sm mb-4">
            <CCardBody style={{ height: "63px" }}>
              <CCardTitle className="h4 mb-4 d-flex  justify-content-between">
                <span>Trip Management</span>
                <TripForm onAddTrip={handleAddTrip} className="ms-2" />
              </CCardTitle>
            </CCardBody>
          </CCard>


          {/* Trip Records Table */}
          <CCard className="shadow-sm">
            <CCardBody>
              <CCardTitle className="h4 mb-4">Trip Records</CCardTitle>
              <TripTable trips={trips} onEdit={handleEdit} onDelete={handleDelete} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Trip;
