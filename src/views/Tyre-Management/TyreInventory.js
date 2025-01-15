import React, { useState } from 'react';
import { CCard, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CButton } from '@coreui/react';

const TyreInventory = () => {
  // Sample tyre data
  const [tyres, setTyres] = useState([
    {
      serialNumber: 'TYR12345',
      vendor: 'Goodyear',
      purchaseDate: '2024-03-15',
      status: 'New',
      distance: 12000,
      document: 'document-link-1.pdf',
    },
    {
      serialNumber: 'TYR12346',
      vendor: 'Michelin',
      purchaseDate: '2023-08-10',
      status: 'In Use',
      distance: 25000,
      document: 'document-link-2.pdf',
    },
    {
      serialNumber: 'TYR12347',
      vendor: 'Pirelli',
      purchaseDate: '2023-01-20',
      status: 'Needs Replacement',
      distance: 30000,
      document: 'document-link-3.pdf',
    },
  ]);

  // Function to view document (e.g., open a link or modal)
  const handleDocumentClick = (doc) => {
    console.log('Viewing document:', doc);
    // Implement document viewing logic here
  };

  return (
    <CCard>
      <CCardBody>
        <h4>Tyre Inventory</h4>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Serial Number</CTableHeaderCell>
              <CTableHeaderCell>Vendor</CTableHeaderCell>
              <CTableHeaderCell>Purchase Date</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Distance (km)</CTableHeaderCell>
              <CTableHeaderCell>Document</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <tbody>
            {tyres.map((tyre, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{tyre.serialNumber}</CTableDataCell>
                <CTableDataCell>{tyre.vendor}</CTableDataCell>
                <CTableDataCell>{new Date(tyre.purchaseDate).toLocaleDateString()}</CTableDataCell>
                <CTableDataCell>{tyre.status}</CTableDataCell>
                <CTableDataCell>{tyre.distance}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="info" onClick={() => handleDocumentClick(tyre.document)}>
                    View Document
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </tbody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default TyreInventory;
