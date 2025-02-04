import React, { useEffect } from 'react'
import {compaines} from  "./data/compaines"
import { useParams, useNavigate } from 'react-router-dom'
import {CRow,CCol,CCard, CCardHeader,CCardBody, CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell, CButton, CFormInput, CInputGroup, CInputGroupText, CImage} from "@coreui/react";
import { Eye } from 'lucide-react'
import { cilSearch } from '@coreui/icons';  // CoreUI icon library
import CIcon from '@coreui/icons-react';

function SelectedCompDetails() {
    const { id } = useParams()
    const selectedCompany = compaines.find((c) => c.id === id)
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
    <>
         
        <div className="d-flex gap-3">
            <CImage
            src={selectedCompany.profileImage || '/default-avatar.png'} // Default image fallback
            alt={selectedCompany.name}
            className="img-thumbnail rounded-circle me-3"
            width="120" // Set the desired width
            height="120" // Set the desired height
            />
            <div>
            <div className="py-2">
                <h2>{selectedCompany.name}</h2>
            </div>
            <div>
                <h6>GST Number: {selectedCompany.gstNumber}</h6>
            </div>
            <div>
                <h6>Contact: {selectedCompany.contactNumber}</h6>
            </div>
            <div>
                <h6>Address: {selectedCompany.address}</h6>
            </div>
            </div>
        </div>
        <hr />
        <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
            {/* <IconDropdown items={dropdownItems} /> */}
        </div>
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
                            onClick={() => navigate(`branch-details/${row.id}`)}
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
              
        
    </>
  )
}

export default SelectedCompDetails