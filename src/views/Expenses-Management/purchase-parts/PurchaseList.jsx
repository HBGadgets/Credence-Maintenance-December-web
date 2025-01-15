import React from 'react';
import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, IconButton } from '@mui/material';
import { CCard, CCol, CRow, CCardBody,CCardHeader,CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CButtonGroup } from '@coreui/react';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { FaPrint } from 'react-icons/fa';
import { MdOutlinePreview } from "react-icons/md";
// Define the column structure
const columns = [
    { label: 'Part Name', key: 'partName' },
    { label: 'Vehicle', key: 'vehicle' },
    { label: 'Category', key: 'category' },
    { label: 'Vendor', key: 'vendor' },
    { label: 'Quantity', key: 'quantity' },
    { label: 'Cost Per Unit', key: 'costPerUnit' },
    { label: 'Purchase Date', key: 'purchaseDate' },
    { label: 'Invoice/Bill Number', key: 'invoiceNumber' },
    { label: 'Document', key: 'document' },
    { label: 'Actions', key: 'actions' },
];
const PurchaseList = ({ purchases, searchTerm, onView, onEdit, onDelete, onPrint }) => {
    const filteredPurchases = purchases.filter((purchase) =>
        purchase.partName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
        <CRow style={{marginTop:'1rem'}}>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Purchase Expenses</strong>
              {/* <CButton
                color="primary"
                className="float-end"
                onClick={() => setAddModalOpen(true)}
              >
                Add Driver
              </CButton> */}
            </CCardHeader>
            <CCardBody>
              {filteredPurchases.length === 0 ? (
                <p className="text-center">No drivers available.</p>
              ) : (
        <CTable striped hover responsive >
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell className="text-center" scope="col" style={{ paddingLeft: '15px', paddingRight: '15px' }} >
                                            SN
                    </CTableHeaderCell>
                    {columns.map((column) => (
                        <CTableHeaderCell className="text-center text-nowrap" key={column.key} style={{ paddingLeft: '15px', paddingRight: '15px' }}  >{column.label}</CTableHeaderCell>
                    ))}
                </CTableRow>
            </CTableHead>
            <CTableBody>
                {filteredPurchases.map((purchase, index) => (
                    <CTableRow key={purchase.id}>
                        <CTableDataCell style={{ paddingLeft: '15px', paddingRight: '15px' }} >{index+1} </CTableDataCell>
                        {columns.map((column) => {
                            if (column.key === 'actions') {
                                return (
                                    <CTableDataCell key={column.key} className="text-center text-nowrap" style={{ paddingLeft: '15px', paddingRight: '15px' }}  >
                                        <CButtonGroup>
                                            
                                            
                                            
                                            <IconButton
                              aria-label="view"
                             
                              onClick={() => onView(purchase)}
                              style={{ margin: '0 5px', color: "#1976d2" }}
                            >
                              <MdOutlinePreview />
                            </IconButton>
                            <IconButton
                              aria-label="edit"
                              onClick={() => onEdit(purchase)}
                              style={{ margin: '0 5px', color: 'orange' }}
                            >
                              <AiFillEdit style={{ fontSize: '20px' }} />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              onClick={() => onDelete(purchase)}
                              style={{ margin: '0 5px', color: 'red' }}
                            >
                              <AiFillDelete style={{ fontSize: '20px' }} />
                            </IconButton>
                            <IconButton
                              aria-label="print"
                              onClick={() => onPrint(purchase)}
                              style={{ margin: '0 5px', color: 'green' }}
                            >
                              <FaPrint style={{ fontSize: '20px' }} />
                            </IconButton>
                                        </CButtonGroup>
                                    </CTableDataCell>
                                );
                            }
                            return (
                                <CTableDataCell key={column.key} className='text-center text-nowrap' style={{ paddingLeft: '15px', paddingRight: '15px' }} >
                                    {purchase[column.key]}
                                </CTableDataCell>
                            );
                        })}
                    </CTableRow>
                ))}
            </CTableBody>
        </CTable>
        )}
        </CCardBody>
          </CCard>
        </CCol>
      </CRow>
        </>
        
    );
};

export default PurchaseList;
