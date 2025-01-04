import React, { useState, useEffect } from 'react';
import InvoiceForm from './InvoiceForm';
import InvoiceList from './InvoiceList';
// import InvoiceSummary from './InvoiceSummary';
// import axios from 'axios';
import { Button } from '@mui/material';
import fileData from "./data"

function Invoices() {
  const [invoices, setInvoices] = useState([]); // All invoices
  const [filteredInvoices, setFilteredInvoices] = useState([]); // Filtered invoices for display
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null); // For editing
  
  // Close both modals
  const handleModalClose = () => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setCurrentInvoice(null); // Clear the current invoice
  };
  
  const fetchInvoices = async () => {
    try {
      // const response = await axios.get('http://localhost:5000/Invoice'); // Adjust endpoint as needed
      // setInvoices(response.data);
      // setFilteredInvoices(response.data); // Initialize filtered invoices with all invoices
      setInvoices(fileData)
      setFilteredInvoices(fileData)
    } catch (err) {
      console.error('Error fetching invoices:', err);
      alert('Error fetching invoices');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  
    if (!term) {
      setFilteredInvoices(invoices);
    } else {
      const filtered = invoices.filter((invoice) => {
        return (
          (invoice.invoiceNumber && invoice.invoiceNumber.toLowerCase().includes(term)) ||
          (invoice.clientName && invoice.clientName.toLowerCase().includes(term)) ||
          (invoice.clientEmail && invoice.clientEmail.toLowerCase().includes(term)) ||
          (invoice.clientPhone && invoice.clientPhone.toLowerCase().includes(term))
        );
      });
      setFilteredInvoices(filtered);
    }
  };
  

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreateNewInvoice = () => {
    setAddModalOpen(true)
  };

 

  return (
    <div>
      <header style={{display:'flex', justifyContent:'space-between'}}>
        <h1>Invoices</h1>
      <div style={{display:'flex'}}>
        <input
          type="text"
          id="search"
          placeholder="Search by invoice number, client name, or email"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            width: "300px",
            padding: "10px",
            fontSize: "16px",
            border: "none",
            borderRadius: "6px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            marginRight: "10px",
            height: "40px",
            outline: "none",
          }}
        />
              <Button variant="contained" color="primary" onClick={handleCreateNewInvoice} style={{height: "40px"}}>
                    Add Invoice
                </Button>

      </div>
      </header>

      <InvoiceForm invoiceToEdit={currentInvoice} addModalOpen={addModalOpen} setAddModalOpen={setAddModalOpen} editModalOpen={editModalOpen} setEditModalOpen={setEditModalOpen} setFilteredInvoices={setFilteredInvoices} handleModalClose={handleModalClose} fetchInvoices={fetchInvoices}/>
      {/* <InvoiceSummary invoices={filteredInvoices} /> */}
      <InvoiceList
        invoices={filteredInvoices}
        setFilteredInvoices={setFilteredInvoices}
        setEditModalOpen={setEditModalOpen}
        setCurrentInvoice={setCurrentInvoice}
      />
    </div>
  );
}

export default Invoices;
