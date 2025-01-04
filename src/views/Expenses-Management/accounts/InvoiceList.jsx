import React,{useEffect} from 'react';
import {
  
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
} from '@coreui/react';
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
<TableContainer style={{border:'1px solid black', borderRadius:'10px'}}>
      <CTable hover striped responsive >
        <CTableHead>
          <CTableRow>
            {columns.map((column, index) => (
              <CTableHeaderCell  key={index} style={{ whiteSpace: 'nowrap' }}>
                {column.label}
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {invoices.slice().reverse().map((invoice) => (
            <CTableRow key={invoice._id} style={{ height: '40px' }}>
              {columns.map((column, index) => {
                const value = column.key === 'status' ? (
                  <CBadge color={invoice[column.key] === 'Paid' ? 'success' : 'warning'} style={{minWidth:'4rem'}}>
                    {invoice[column.key]}
                  </CBadge>
                ) : column.key === 'items' ? (
                  // <ul>
                  //   {invoice[column.key]?.map((item, index) => (
                  //     <li key={index}>
                  //       {item.name}-{item.description} - {item.quantity} x {item.unitPrice} = {item.total}
                  //     </li>
                  //   ))}
                  // </ul>
                  <FormControl fullWidth variant="outlined" margin="normal" sx={{margin:'0'}}>
                <Select
                  // label="Select Item"
                  value={invoice[column.key]?.[0]?.name || ""}
                  onChange={(e) => handleItemChange(invoice._id, e.target.value)}
                  style={{ height: '35px', padding: '0 10px' }}
                >
                  {invoice[column.key]?.map((item, index) => (
                    <MenuItem key={index} value={item.name}>
                      {item.name}- {item.quantity} x {item.unitPrice} = {item.total}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
                ) : column.key === 'actions' ? (
                  <div style={{display:'flex'}}>
                    <CButton
                      color="primary"
                      variant="outline"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(invoice)}
                    >
                      Edit
                    </CButton>
                    <CButton
                      color="danger"
                      variant="outline"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDelete(invoice._id)}
                    >
                      Delete
                    </CButton>
                    <CButton
                      color="info"
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(invoice._id, invoice.status)}
                    >
                      {invoice.status === 'paid' ? 'Mark as Unpaid' : 'Mark as Paid'}
                    </CButton>
                  </div>
                ) : column.key === 'date' || column.key === 'paymentDueDate' ? (
                  new Date(invoice[column.key]).toLocaleDateString()
                ) 
                :
                 (
                  invoice[column.key]
                )
                return <CTableDataCell key={index} style={{ whiteSpace: 'nowrap' }}>{value}</CTableDataCell>;
              })}
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      </TableContainer>
      
  
  );
};

export default InvoiceList;
