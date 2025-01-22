import React,{useEffect} from 'react';
import {
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CFormSelect
} from '@coreui/react';
import { Edit, Eye, Trash2 } from 'lucide-react'
import { FormControl, Select, MenuItem,TableContainer,} from '@mui/material';

const InvoiceList = ({ invoices, setCurrentInvoice, setEditModalOpen, setFilteredInvoices }) => {
  const handleDelete = async (invoiceId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this invoice?');
  
  if (!confirmDelete) {
    return; // Exit if the user cancels
  }
    try {
      const response = await fetch(`http://localhost:5000/Invoice/${invoiceId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setFilteredInvoices((prevInvoices) =>
          prevInvoices.filter((invoice) => invoice._id !== invoiceId) // Remove deleted invoice from state
        );
        alert('Invoice deleted successfully');
      } else {
        throw new Error('Failed to delete invoice');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Error deleting invoice');
    }
  };
  

  const handleEdit = (invoice) => {
    console.log("invoince in handleedit",invoice);
    
    setEditModalOpen(true)
    setCurrentInvoice(invoice);
    console.log("yes i am here");
    
  };
  const handleToggleStatus = async (invoiceId, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
    try {
      const response = await fetch(`http://localhost:5000/Invoice/${invoiceId}`, {
        method: 'PUT', // Assuming you're using PUT to update the invoice
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        // Update the status in the local state
        setFilteredInvoices((prevInvoices) =>
          prevInvoices.map((invoice) =>
            invoice._id === invoiceId ? { ...invoice, status: newStatus } : invoice
          )
        );
        alert(`Invoice status updated to ${newStatus}`);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
      alert('Error updating status');
    }
  };

  if (!Array.isArray(invoices) || invoices.length === 0) {
    return <p className="text-center text-muted">No invoices found.</p>;
  }

  const columns = [
    { label: 'Invoice Number', key: 'invoiceNumber' },
    { label: 'Client Name', key: 'clientName' },
    { label: 'Client Email', key: 'clientEmail' },
    { label: 'Client Phone', key: 'clientPhone' },
    { label: 'Date', key: 'date' },
    { label: 'Payment Due Date', key: 'paymentDueDate' },
    { label: 'Status', key: 'status' },
    { label: 'Taxes', key: 'taxes' },
    { label: 'SubTotal', key: 'subTotal' },
    { label: 'Grand Total', key: 'grandTotal' },
    { label: 'Items', key: 'items' },
    { label: 'Actions', key: 'actions' },
  ];
  return (
    <>
      <CRow style={{marginTop:"1rem"}}>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Invoices List</strong>
              {/* <CButton
                color="primary"
                className="float-end"
                onClick={() => setAddModalOpen(true)}
              >
                ADD Invoice
              </CButton> */}
            </CCardHeader>
            <CCardBody>
              {invoices.length === 0 ? (
                <p className="text-center">No Invoive available.</p>
              ) : (
                <CTable striped hover responsive bordered>
                  <CTableHead>
                    <CTableRow className='text-nowrap'>
                      <CTableHeaderCell className="text-center" scope="col">
                        SN
                      </CTableHeaderCell>
                     
                      {columns.map((column, index) => (
              <CTableHeaderCell  key={index} className="text-center" scope="col">
                {column.label}
              </CTableHeaderCell>
            ))}
                      
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
                    {invoices.slice().reverse().map((invoice, index) => (
            <CTableRow key={invoice._id } className='text-nowrap'
            // style={{ height: '40px' }}
            >
              <CTableDataCell className="text-center">{index+1}</CTableDataCell>
              {columns.map((column, index) => {
                const value = column.key === 'status' ? (
                  <span
                    style={{
                      color: invoice[column.key] === "paid" ? "green" : "red",
                      // fontWeight: "bold",
                      minWidth: "4rem",
                    }}
                  >
                    {invoice[column.key]}
                  </span>
                ) : column.key === 'items' ? (
                  <CFormSelect
                  value={invoice[column.key]?.[0]?.name || ""}
                  onChange={(e) => handleItemChange(invoice._id, e.target.value)}
                  style={{ height: "35px", padding: "0 10px", minWidth: "10rem" }}
                >
                  {invoice[column.key]?.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </CFormSelect>
                ) : column.key === 'actions' ? (
                  <div style={{display:'flex'}}>
                    {/* <CButton
                      color="primary"
                      variant="outline"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(invoice)}
                    >
                      Edit
                    </CButton> */}
                    <CButton
                            color="warning"
                            size="sm"
                            onClick={() => handleEdit(invoice)}
                          >
                            <Edit size={16} /> 
                          </CButton>
                    {/* <CButton
                      color="danger"
                      variant="outline"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDelete(invoice._id)}
                    >
                      Delete
                    </CButton> */}
                    <CButton
                            color="danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => handleDelete(invoice.id)}
                          >
                            <Trash2 size={16} /> 
                          </CButton>
                    <CButton
                      color="info"
                      
                      size="sm"
                      onClick={() => handleToggleStatus(invoice._id, invoice.status)}
                      style={{marginLeft:'7px', minWidth:'6.1rem'}}
                    >
                      {invoice.status === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
                    </CButton>
                  </div>
                ) : column.key === 'date' || column.key === 'paymentDueDate' ? (
                  new Date(invoice[column.key]).toLocaleDateString()
                ) 
                :
                 (
                  invoice[column.key]
                )

                return <CTableDataCell key={index} className="text-center">{value}</CTableDataCell>;
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

export default InvoiceList;
