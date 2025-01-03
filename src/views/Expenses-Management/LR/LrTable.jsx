import React from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CContainer,
} from '@coreui/react';
import { RiEdit2Fill } from 'react-icons/ri';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { FaPrint } from 'react-icons/fa';
import { IconButton, TableContainer} from '@mui/material';

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
    <TableContainer style={{border:'1px solid black', borderRadius:'10px'}}>
      <CTable
        
        bordered
        align="middle"
        className="mb-0"
        hover
        responsive
        striped
      >
        {/* Table Head */}
        <CTableHead className="text-nowrap">
          <CTableRow
          
          >
            {columns.map((col, index) => (
              <CTableHeaderCell
                key={index}
                className="text-center "
                
               
              >
                {col.label}
              </CTableHeaderCell>
            ))}
            {/* Actions column */}
            <CTableHeaderCell
              className="text-center bg-body-secondary"
              style={{
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #dee2e6',
                borderTopRightRadius: '10px',  // Rounded top-right corner for the Actions column
              }}
            >
              <strong>Actions</strong>
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        {/* Table Body */}
        <CTableBody>
          {filteredLrs.length > 0 ? (
            filteredLrs.map((data, index) => (
              <CTableRow
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                  borderBottom: '1px solid #dee2e6',
                  borderLeft: '1px solid #dee2e6',
                  borderRight: '1px solid #dee2e6',
                }}
              >
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
                    justifyContent: 'center',
                    borderRight: '1px solid #dee2e6',
                    borderBottomRightRadius: index === filteredLrs.length - 1 ? '10px' : '', // Rounded bottom-right corner for last row
                  }}
                >
                  <IconButton
                    aria-label="view"
                    onClick={() => handleView(data)}
                    style={{ margin: '0 5px', color: 'lightBlue' }}
                  >
                    <RiEdit2Fill style={{ fontSize: '20px' }} />
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleEdit(data)}
                    style={{ margin: '0 5px', color: 'orange' }}
                  >
                    <AiFillEdit style={{ fontSize: '20px' }} />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(data)}
                    style={{ margin: '0 5px', color: 'red' }}
                  >
                    <AiFillDelete style={{ fontSize: '20px' }} />
                  </IconButton>
                  <IconButton
                    aria-label="print"
                    onClick={() => handlePrint(data)}
                    style={{ margin: '0 5px', color: 'green' }}
                  >
                    <FaPrint style={{ fontSize: '20px' }} />
                  </IconButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={columns.length + 1} className="text-center text-muted">
                No results found for "lrs"
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
      </TableContainer>
    

   
  );
}

export default LrTable;
