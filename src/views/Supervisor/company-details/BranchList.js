import React from "react";
import { useNavigate } from "react-router-dom";
import {CRow,CCol,CCard, CCardHeader,CCardBody, CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell, CButton, CFormInput, CInputGroup, CInputGroupText} from "@coreui/react";
import { Eye } from 'lucide-react'
import { cilSearch } from '@coreui/icons';  // CoreUI icon library
import CIcon from '@coreui/icons-react';
const CompanyDetails = () => {
  const navigate = useNavigate();

  const branches = [
    { id: 1, name: "Nagpur", address: "123 Main St, Nagpur, 12345", manager: "Manager A", phone: "1234567890", email: "branch1@example.com", totalVehicle: '20' },
    { id: 2, name: "Pune", address: "456 Oak Rd, Pune, 67890", manager: "Manager B", phone: "9876543210", email: "branch1@example.com", totalVehicle: '24'},
    { id: 3, name: "Mumbai", address: "789 Pine Ave, Mumbai, 11223", manager: "Manager C", phone: "4564564564", email: "branch1@example.com", totalVehicle: '70' },
  ];

  const columns = [
    {key: 'id', label: 'ID'},
    {key: 'name', label: 'Branch Name'},
    {key: 'phone', label: 'Phone'},
    {key: 'email', label: 'Email'},
    {key: 'address', label: 'Address'},
    {key: 'manager', label: 'Manager'},
    {key: 'totalVehicle', label: 'Total Vehicles'},
  ]

  return (
    <div>
        <CInputGroup className="w-25 mb-3" style={{marginLeft:'auto'}} >
            <CInputGroupText>
                <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput placeholder="Search..." />
        </CInputGroup>
      
       <CRow>
              <CCol xs={12}>
                <CCard className="mb-4">
                  <CCardHeader className="d-flex justify-content-between align-items-center">
                    <strong>Branch List</strong>
                    
                    
                  </CCardHeader>
                  <CCardBody>
                    <CTable striped hover responsive bordered>
                      <CTableHead>
                        <CTableRow>
                        {columns.map((column, index) => (
                            <CTableHeaderCell key={index} className="text-center" scope="col">
                            {column.label}
                            </CTableHeaderCell>
                        ))}
                        <CTableHeaderCell  className="text-center" scope="col">
                            Actions
                        </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                      {branches.map((row, rowIndex) => (
                        <CTableRow key={rowIndex}>
                        {columns.map((column, cellIndex) => (
                            <CTableDataCell key={cellIndex} className="text-center">
                            {row[column.key]}
                            </CTableDataCell>
                        ))}
                        <CTableDataCell className="text-center">
                          <CButton
                            color="primary"
                            size="sm"
                            onClick={() => navigate(`/branch-details/${row.id}`)}
                            className="text-center"
                          >
                            <Eye className="me-2" size={16} />
                            View Profile
                          </CButton>
                        </CTableDataCell>
                        </CTableRow>
                     ))}

                      </CTableBody>
                    </CTable>
                    {/* No results message */}
                    {branches.length === 0 && (
                      <div className="text-center text-muted">
                        No results found for &quot;{filter}&quot;
                      </div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
    </div>
  );
};

export default CompanyDetails;
