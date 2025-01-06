import React from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CContainer,
  CButton
} from '@coreui/react';
import { RiEdit2Fill } from 'react-icons/ri';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { FaPrint } from 'react-icons/fa';
import { IconButton, TableContainer } from '@mui/material';
import { Edit, Eye, Trash2 } from 'lucide-react'

function LrTable({ filteredLrs }) {
  const columns = [
    { key: 'lrNumber', label: 'LR Number' },
    { key: 'date', label: 'Date' },
    { key: 'vehicleNumber', label: 'Vehicle Number' },
    { key: 'owner', label: 'Owner' },
    { key: 'consignorName', label: 'Consignor' },
    { key: 'consigneeName', label: 'Consignee' },
    { key: 'from', label: 'From' },
    { key: 'to', label: 'To' },
    { key: 'itemName', label: 'Item Name' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'unit', label: 'Unit' },
    { key: 'actualWeight', label: 'Actual Weight' },
    { key: 'chargedWeight', label: 'Charged Weight' },
    { key: 'customerRate', label: 'Customer Rate' },
    { key: 'customerRateOn', label: 'CRateOn' },
    { key: 'totalAmount', label: 'Total Amount' },
    { key: 'transporterRate', label: 'Transporter Rate' },
    { key: 'transporterRateOn', label: 'TRateOn' },
    { key: 'totalTransporterAmount', label: 'Total Transporter Amount' },
    { key: 'customerFreight', label: 'Customer Freight' },
    { key: 'transporterFreight', label: 'Transporter Freight' },
  ];

  return (
    <>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Lorry Receipt/Challan List</strong>
              {/* <CButton
                color="primary"
                className="float-end"
                onClick={() => setAddModalOpen(true)}
              >
                Add Driver
              </CButton> */}
            </CCardHeader>
            <CCardBody>
              {filteredLrs.length === 0 ? (
                <p className="text-center">No LR available.</p>
              ) : (
                <CTable striped hover responsive bordered>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="text-center" scope="col">
                        SN
                      </CTableHeaderCell>
                      {/* {columns.map((column, index) => (
                        <CTableHeaderCell key={index} className="text-center" scope="col">
                          {column}
                        </CTableHeaderCell>
                      ))} */}
                      {columns.map((col, index) => (
                        <CTableHeaderCell key={index} className="text-center text-nowrap">
                          {col.label}
                        </CTableHeaderCell>
                      ))}
                      <CTableHeaderCell className="text-center" scope="col">
                        Actions
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {/* {data.map((driver, index) => (
                      <CTableRow key={driver.id}>
                        <CTableDataCell className="text-center">{index + 1}</CTableDataCell> 
                        <CTableDataCell className="text-center">{driver.name}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {driver.contactNumber}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{driver.email}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            color="primary"
                            size="sm"
                            onClick={() => handleViewClick(driver)}
                            className="text-center"
                          >
                            <Eye className="me-2" size={16} />
                            View Profile
                          </CButton>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            color="warning"
                            size="sm"
                            onClick={() => handleEditDriver(driver)}
                          >
                            <Edit size={16} />
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => handleDeleteDriver(driver.id)}
                          >
                            <Trash2 size={16} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))} */}
                    {
                      filteredLrs.map((data, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                          {columns.map((col) => (
                            <CTableDataCell
                              key={col.key}
                              className="text-center text-nowrap"

                              style={{
                                borderRight: '1px solid #dee2e6',
                              }}
                            >
                              {col.key === 'date' || col.key === 'paymentDueDate' // Check if the column is a date column
                                ? new Date(data[col.key]).toLocaleDateString() // Format the date
                                : data[col.key]}
                            </CTableDataCell>
                          ))}

                          {/* Actions */}
                          <CTableDataCell
                            className="text-center"
                            style={{
                              display: 'flex',
                            }}
                          >
                            
                            <CButton
                              color="primary"
                              size="sm"
                              onClick={() => handleView(data)}
                              className="text-center ms-2"
                            >
                              <Eye   size={16} />
                              </CButton>
                            
                            <CButton
                              color="warning"
                              size="sm"
                              onClick={() => handleEdit(data)}
                            >
                              <Edit size={16} />
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              className="ms-2"
                              onClick={() => handleDelete(data.id)}
                            >
                              <Trash2 size={16} />
                            </CButton>
                            <IconButton
                              aria-label="print"
                              onClick={() => handlePrint(data)}
                              style={{ margin: '0 5px', color: 'green' }}
                            >
                              <FaPrint style={{ fontSize: '20px' }} />
                            </IconButton>
                          </CTableDataCell>
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
}

export default LrTable;
