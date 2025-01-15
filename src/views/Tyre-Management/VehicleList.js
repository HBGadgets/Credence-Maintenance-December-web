import React, { useState } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CButton } from '@coreui/react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const VehicleList = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Sample vehicle data
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      name: 'Vehicle 1',
      category: 'Car',
      licensePlate: 'ABC123',
    },
    {
      id: 2,
      name: 'Vehicle 2',
      category: 'Bus',
      licensePlate: 'XYZ456',
    },
    {
      id: 3,
      name: 'Vehicle 3',
      category: 'Truck',
      licensePlate: 'LMN789',
    },
  ]);

  // Function to navigate to the Detailed Page of a vehicle
  const handleVehicleClick = (vehicleId) => {
    navigate(`/vehicle-details`); // Using navigate instead of history.push
  };

  return (
    <div>
      <h4>Vehicle List</h4>
      <CTable hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Vehicle Name</CTableHeaderCell>
            <CTableHeaderCell>Category</CTableHeaderCell>
            <CTableHeaderCell>License Plate</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <tbody>
          {vehicles.map((vehicle) => (
            <CTableRow key={vehicle.id}>
              <CTableDataCell>{vehicle.name}</CTableDataCell>
              <CTableDataCell>{vehicle.category}</CTableDataCell>
              <CTableDataCell>{vehicle.licensePlate}</CTableDataCell>
              <CTableDataCell>
                <CButton color="primary" onClick={() => handleVehicleClick(vehicle.id)}>
                  View Details
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </tbody>
      </CTable>
    </div>
  );
};

export default VehicleList;
