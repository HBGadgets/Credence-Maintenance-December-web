import React, { useState, useEffect } from 'react';
import InvoiceForm from './InvoiceForm';
import InvoiceList from './InvoiceList';
// import InvoiceSummary from './InvoiceSummary';
// import axios from 'axios';
import { Button , Modal, Box, TextField, InputAdornment} from '@mui/material';
import fileData from "./data"
import DistanceInvoice from "./DistanceInvoive"
import { CModal, CModalHeader, CModalBody, CModalFooter,CTabContent, CTabPane, CNav, CNavItem, CNavLink, CRow, CCol, CButton } from '@coreui/react';
// import '@coreui/coreui/dist/css/coreui.min.css';
import { CFormInput, CInputGroup, CInputGroupText } from '@coreui/react';
import { cilSearch } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';

import NewInvoiceForm from './NewInvoiceForm';
import { Search } from '@mui/icons-material';


const style = {
  position: 'absolute',
  top: '60%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  height: '90vh',
  maxHeight: '90vh',
  bgcolor: 'white',
  boxShadow: 24,
  
  overflowY: 'auto', // Enable vertical scrolling
  display: 'flex',
  flexDirection: 'column',
  
  
}


function Invoices() {
  const [invoices, setInvoices] = useState([]); // All invoices
  const [filteredInvoices, setFilteredInvoices] = useState([]); // Filtered invoices for display
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null); // For editing
  const [activeTab, setActiveTab] = useState('load');// for invoice tabs
  const [tabOpen, setTabOpen] = useState(false); // for invoice tabs
  
  // Close both modals
  const handleModalClose = () => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setCurrentInvoice(null); // Clear the current invoice
  };
  const handleCloseModalTab=()=>{
    setTabOpen(false);
  }
  
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
    setTabOpen(true)
    // setAddModalOpen(true)
  };

 

  return (
    <div>
      <header style={{display:'flex', justifyContent:'space-between'}}>
        <h1> </h1>
      <div style={{display:'flex', gap:'0.5rem'}}>
          <CInputGroup className=" ">
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={handleSearch }
            />
        </CInputGroup>
        
     
        <Button variant="contained" onClick={handleCreateNewInvoice} style={{ background:'black', color:'orange', width:'11rem'}}>
              Add Invoice
        </Button>

      </div>
      </header>

      {/* <InvoiceForm invoiceToEdit={currentInvoice} addModalOpen={addModalOpen} setAddModalOpen={setAddModalOpen} editModalOpen={editModalOpen} setEditModalOpen={setEditModalOpen} setFilteredInvoices={setFilteredInvoices} handleModalClose={handleModalClose} fetchInvoices={fetchInvoices}/> */}
      {/* <InvoiceSummary invoices={filteredInvoices} /> */}
      <InvoiceList
        invoices={filteredInvoices}
        setFilteredInvoices={setFilteredInvoices}
        setEditModalOpen={setEditModalOpen}
        setCurrentInvoice={setCurrentInvoice}
      />


      
      
        {/* <Modal
        open={tabOpen}
        onClose={handleCloseModalTab}
        style={{
          height:'80vh',
          
        }}
        >
          <Box
        sx={{
          ...style,
          backgroundColor: '#f7f9fc',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          
        }}
      >
       
      <div className="tabs-container container mt-4">
      <CRow>
        <CCol>
          <CNav variant="tabs" className="custom-nav">
            <CNavItem>
              <CNavLink
                active={activeTab === 'load'}
                onClick={() => setActiveTab('load')}
                className="custom-tab-link"
              >
                Load Wise
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'distance'}
                onClick={() => setActiveTab('distance')}
                className="custom-tab-link"
              >
                Distance Wise
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'third'}
                onClick={() => setActiveTab('third')}
                className="custom-tab-link"
              >
                Third Tab
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent className="custom-tab-content" >
            <CTabPane visible={activeTab === 'load'} className="tab-pane-content" >
              <NewInvoiceForm  />
              </CTabPane>
            <CTabPane visible={activeTab === 'distance'} className="tab-pane-content">
             <DistanceInvoice />
            </CTabPane>
            <CTabPane visible={activeTab === 'third'} className="tab-pane-content">
              <h5>Third Tab Content</h5>
              <p>Additional content goes here.</p>
            </CTabPane>
          </CTabContent>
        </CCol>
      </CRow>
    </div>
    </Box>
    </Modal> */}
     <CModal visible={tabOpen} onClose={handleCloseModalTab} size="lg" >
      
      <CModalBody
        // style={{
        //   backgroundColor: '#f7f9fc',
        //   boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        //   borderRadius: '12px',
        // }}
      >
        <div className="tabs-container container ">
          <CRow>
            <CCol>
              <CNav variant="tabs" className="custom-nav">
                <CNavItem>
                  <CNavLink
                    active={activeTab === 'load'}
                    onClick={() => setActiveTab('load')}
                    className="custom-tab-link"
                  >
                    Load Wise
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeTab === 'distance'}
                    onClick={() => setActiveTab('distance')}
                    className="custom-tab-link"
                  >
                    Distance Wise
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeTab === 'third'}
                    onClick={() => setActiveTab('third')}
                    className="custom-tab-link"
                  >
                    Third Tab
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent className="custom-tab-content mt-4" >
                <CTabPane visible={activeTab === 'load'} className="tab-pane-content">
                  <NewInvoiceForm />
                </CTabPane>
                <CTabPane visible={activeTab === 'distance'} className="tab-pane-content">
                  <DistanceInvoice />
                </CTabPane>
                <CTabPane visible={activeTab === 'third'} className="tab-pane-content">
                  <h5>Third Tab Content</h5>
                  <p>Additional content goes here.</p>
                </CTabPane>
              </CTabContent>
            </CCol>
          </CRow>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={handleCloseModalTab}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
   
    
    </div>
  );
}

export default Invoices;
