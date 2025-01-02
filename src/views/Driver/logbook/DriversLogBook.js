import React from 'react';
import { useNavigate } from 'react-router-dom';
import { drivers } from './data';
import { CButton, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CContainer, CRow, CCol } from '@coreui/react';
import { Eye } from 'lucide-react';

const DriversTable = () => {
  const navigate = useNavigate();

  return (
    <CContainer className="mt-4">
      <CRow>
        <CCol>
          <h2 className="mb-4">Drivers List</h2>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CTable striped hover responsive bordered>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Contact</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {drivers.map((driver) => (
                <CTableRow key={driver.id}>
                  <CTableDataCell>{driver.name}</CTableDataCell>
                  <CTableDataCell>{driver.contactNumber}</CTableDataCell>
                  <CTableDataCell>{driver.email}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      size="sm"
                      onClick={() => navigate(`/driver/${driver.id}`)}
                      className="d-flex align-items-center"
                    >
                      <Eye className="me-2" size={16} />
                      View Profile
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default DriversTable;
