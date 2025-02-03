import React, { useState } from 'react';
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
import { FaTruckMoving } from "react-icons/fa";

import { RiEdit2Fill } from 'react-icons/ri';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { FaPrint } from 'react-icons/fa';
import { IconButton, TableContainer } from '@mui/material';
import { Edit, Eye, Trash2 } from 'lucide-react'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import "./lr.css"
import {Box,Modal} from "@mui/material"
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  height: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto', // Enable vertical scrolling
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
  margintop: '8px',
}

function LrTable({ filteredLrs }) {
  const [showReceipt, setShowReceipt] = useState({ show: false, data: null });

  const handleViewClose = () => {
    setShowReceipt({ show: false, data: null })
  }

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

  
//   const handlePrint = (formData) => {
//     const doc = new jsPDF();
  
//     // Add Company Header
//     doc.setFont("Helvetica", "bold");
//     doc.setFontSize(14);
//     doc.text("RAJ KUMAR GULATI", 105, 10, { align: "center" });
//     doc.setFontSize(10);
//     doc.text(
//       "FLEET OWNER, AUTHORISED CIL, Kribhco, PPL, ZUARI, IFFCO & NFCL TRANSPORTER",
//       105,
//       15,
//       { align: "center" }
//     );
//     doc.text(
//       "114, Sadoday Enclave, Kadbi Chowk, NAGPUR - 440 004",
//       105,
//       20,
//       { align: "center" }
//     );
//     doc.text("e-mail: rajkumargulati94@rediffmail.com", 105, 25, {
//       align: "center",
//     });

//     doc.setFontSize(10);
// doc.text("Off.: 2533094", 150, 15);
// doc.text("Mobile: 8830534212", 150, 20);
// doc.text("9822139994", 150, 25);
// doc.text("GST No.: 27ABDPG3199E1ZQ", 150, 30);
//     doc.line(10, 30, 200, 30); // Horizontal line
  
//     // Add Lorry Receipt Details
//     doc.setFontSize(10);
//     doc.text(`L.R. No.: ${formData.lrNumber || ""}`, 150, 35);
//     doc.text(`Date: ${formData.date || ""}`, 150, 40);
//     doc.text(`From: ${formData.from || ""}`, 150, 45);
//     doc.text(`To: ${formData.to || ""}`, 150, 50);
  
//     // Add Material Owner & Vehicle Details
//     doc.text("Material Owner: " + (formData.materialOwner || ""), 10, 35);
//     doc.text("Vehicle No.: " + (formData.vehicleNumber || ""), 10, 40);
  
//     // Add Consignor & Consignee Details
//     doc.text("Consignor's Name & Address:", 10, 50);
//     doc.text(formData.consignorName || "", 10, 55);
//     doc.text(formData.consignorAddress || "", 10, 60);
  
//     doc.text("Consignee's Name & Address:", 10, 70);
//     doc.text(formData.consigneeName || "", 10, 75);
//     doc.text(formData.consigneeAddress || "", 10, 80);
  
//     // Add Table for Cargo Details
//     const tableBody = [
//       [
//         formData.noOfPackages || "N/A",
//         formData.description || "N/A",
//         formData.weight || "N/A",
//         formData.rate || "N/A",
//         formData.amount || "N/A",
//       ],
//     ];
  
//     doc.autoTable({
//       startY: 90,
//       head: [["No. of Packages", "Description", "Weight (IN M.T.)", "Rate", "Amount"]],
//       body: tableBody,
//     });
  
//     // Footer - Terms and Conditions
//     const terms = `
//   1) All Liquids Oil, Ghee, Edin, Fruits, Vegetables fresh & fragile goods be carried at consignor's Risk.
//   2) Company shall not be responsible for any damage by Accident, Fire & Riot.
//   3) Delay of the goods, should be intimated within 7 days.
//   4) Insurance are to be borne by consignor otherwise goods will be transported, entirely of consignor Risk.
//   5) Consignor is liable for all consequences arising out incorrect declaration of the contents of the consignment.
//   `;
  
//     doc.setFontSize(8);
//     doc.text(terms, 10, doc.lastAutoTable.finalY + 10);
  
//     // Add Signatures
//     doc.text("Party Sign: ____________________", 10, doc.lastAutoTable.finalY + 50);
//     doc.text("For RAJ KUMAR GULATI", 150, doc.lastAutoTable.finalY + 50);
  
//     // Save PDF
//     doc.save("LorryReceipt.pdf");
//   };
  


const handlePrint = (formData) => {
  const doc = new jsPDF();

  // Add Company Header
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text("RAJ KUMAR GULATI", 105, 10, { align: "center" });
  doc.setFontSize(10);
  doc.text(
    "FLEET OWNER, AUTHORISED CIL, Kribhco, PPL, ZUARI, IFFCO & NFCL TRANSPORTER",
    105,
    15,
    { align: "center" }
  );



  
  doc.text(
    "114, Sadoday Enclave, Kadbi Chowk, NAGPUR - 440 004",
    105,
    20,
    { align: "center" }
  );
  doc.text("e-mail: rajkumargulati94@rediffmail.com", 105, 25, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.text("Off.: 2533094", 10, 30);
  doc.text("Mobile: 8830534212, 9822139994", 50, 30);
  doc.text("GST No.: 27ABDPG3199E1ZQ", 150, 30);
  doc.line(10, 35, 200, 35); // Horizontal line separator

  // Add Lorry Receipt Details
  doc.setFontSize(10);
  doc.text(`L.R. No.: ${formData.lrNumber || ""}`, 150, 40);
  doc.text(`Date: ${formData.date || ""}`, 150, 45);
  doc.text(`From: ${formData.from || ""}`, 150, 50);
  doc.text(`To: ${formData.to || ""}`, 150, 55);

  // Add Material Owner & Vehicle Details
  doc.text("Material Owner: " + (formData.materialOwner || ""), 10, 40);
  doc.text("Vehicle No.: " + (formData.vehicleNumber || ""), 10, 45);

  // Add Consignor & Consignee Details
  doc.text("Consignor's Name & Address:", 10, 55);
  doc.text(formData.consignorName || "", 10, 60);
  doc.text(formData.consignorAddress || "", 10, 65);

  doc.text("Consignee's Name & Address:", 10, 75);
  doc.text(formData.consigneeName || "", 10, 80);
  doc.text(formData.consigneeAddress || "", 10, 85);

  // Add Table for Cargo Details
  const tableBody = formData?.items?.map((item) => [
    item.noOfPackages || "N/A",
    item.description || "N/A",
    item.weight || "N/A",
    item.rate || "N/A",
    item.amount || "N/A",
  ]);

  doc.autoTable({
    startY: 95,
    head: [["No. of Packages", "Description", "Weight (IN M.T.)", "Rate", "Amount"]],
    body: tableBody,
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 60 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
    },
  });

  // Footer - Terms and Conditions
  const terms = `
1) All Liquids Oil, Ghee, Edin, Fruits, Vegetables fresh & fragile goods be carried at consignor's Risk.
2) Company shall not be responsible for any damage by Accident, Fire & Riot.
3) Delay of the goods, should be intimated within 7 days.
4) Insurance are to be borne by consignor otherwise goods will be transported, entirely of consignor Risk.
5) Consignor is liable for all consequences arising out incorrect declaration of the contents of the consignment.
  `;
  doc.setFontSize(8);
  doc.text(terms, 10, doc.lastAutoTable.finalY + 10);

  // Add Signatures
  doc.text("Party Sign: ____________________", 10, doc.lastAutoTable.finalY + 50);
  doc.text("For RAJ KUMAR GULATI", 150, doc.lastAutoTable.finalY + 50);

  // Save PDF
  doc.save("LorryReceipt.pdf");
};

  

  return (
    <>

      <CRow style={{marginTop:'1rem'}}>
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
                              onClick={() => setShowReceipt({ show: true, data: data })}
                              
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
      {/* <Modal
      open={showReceipt.show}
      onClose={handleViewClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          ...style,
          backgroundColor: '#f7f9fc',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          padding: '30px',
        }}
      >
      {showReceipt.show && showReceipt.data && (
  <div  >
    <div >
      <button onClick={() => setShowReceipt({ show: false, data: null })} style={{position:'absolute',right:'0'}}>Close</button>
      <div >
        
        <header style={{display:'grid', gridTemplateColumns:'5fr 1fr'}}> 
        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
          <h1>RAJ KUMAR GULATI</h1>
          <p>FLEET OWNER, AUTHORISED CIL, Kribhco, PPL, ZUARI, IFFCO & NFCL TRANSPORTER</p>
          <p>114, Sadoday Enclave, Kadbi Chowk, Nagpur - 440004</p>
          <p>Email: rajkumargulati94@rediffmail.com</p>
        </div>

        <div style={{ fontSize: '10px', textAlign: 'right' }}>
          <p>Off.: 2533094</p>
          <p>Mobile: 8830534212, 9822139994</p>
          <p>GST No.: 27ABDPG3199E1ZQ</p>
        </div>
        </header>

        <hr style={{ borderTop: '1px solid rgb(97, 99, 102)' }} />

        <div style={{display:'flex', justifyContent:'space-between'}}>
        <div style={{textAlign:"left"}}>
          
        <div style={{ fontSize: '10px' }}>
          <p><strong>Material Owner:</strong> {showReceipt.data.owner}</p>
          <p><strong>Vehicle No.:</strong> {showReceipt.data.vehicleNumber}</p>
        </div>

       
        <div style={{ fontSize: '10px' }}>
          <p><strong>Consignor's Name:</strong> {showReceipt.data.consignorName}</p>
          <p><strong>Consignee's Name:</strong> {showReceipt.data.consigneeName}</p>
        </div>

        </div>
        
        
        <div style={{ fontSize: '10px', textAlign:'left' }}>
          <p><strong>L.R. No.:</strong> {showReceipt.data.lrNumber}</p>
          <p><strong>Date:</strong> {showReceipt.data.date}</p>
          <p><strong>From:</strong> {showReceipt.data.from}</p>
          <p><strong>To:</strong> {showReceipt.data.to}</p>
        </div>
        </div>


       

       
        <table style={{ width: '100%', border: '1px solid #dee2e6', marginTop: '15px' }}>
          <thead>
            <tr>
              <th>No. of Packages</th>
              <th>Description</th>
              <th>Weight (IN M.T.)</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
              <tr >
                <td>{showReceipt.data.quantity || 'N/A'}</td>
                <td>{showReceipt.data.description || 'N/A'}</td>
                <td>{showReceipt.data.actualWeight || 'N/A'}</td>
                <td>{showReceipt.data.customerRate || 'N/A'}</td>
                <td>{showReceipt.data.totalAmount || 'N/A'}</td>
              </tr>
             
          </tbody>
        </table>
        <div style={{display:'flex', justifyContent:'space-between',marginTop:'15px'}}>

        <p style={{ fontSize: '12px', textAlign:'left' }}>
          <strong>Terms & Conditions:</strong>
          <br />
          1) All Liquids Oil, Ghee, Edin, Fruits, Vegetables fresh & fragile goods be carried at consignor's Risk.
          <br />
          2) Company shall not be responsible for any damage by Accident, Fire & Riot.
          <br />
          3) Delay of the goods should be intimated within 7 days.
          <br />
          4) Insurance is to be borne by consignor; otherwise, goods will be transported entirely at consignor's risk.
          <br />
          5) Consignor is liable for all consequences arising out of incorrect declaration of the contents of the consignment.
        </p>

        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p><strong>Party Sign:</strong> __________________________</p>
          <p>For RAJ KUMAR GULATI</p>
        </div>
        </div>

      </div>
    </div>
  </div>
)}
</Box>
      </Modal> */}

<Modal
  open={showReceipt.show}
  onClose={handleViewClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box
    sx={{
      ...style,
      backgroundColor: '#ffffff',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      padding: '30px',
      maxWidth: '900px',
      margin: 'auto',
      overflowY: 'auto',
    }}
  >
    {showReceipt.show && showReceipt.data && (
      <div>
        <button
          onClick={() => setShowReceipt({ show: false, data: null })}
          style={{
            position: 'absolute',
            top: '15px',
            right: '20px',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        <div>
          {/* Company Header */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
            {/* <FaTruckMoving /> */}
            </div>
            <div style={{ fontWeight: 'bold', textAlign:'center', fontSize:'15px' }}>
              <h3>RAJ KUMAR GULATI</h3>
              <p>FLEET OWNER, AUTHORISED CIL, Kribhco, PPL, ZUARI, IFFCO & NFCL TRANSPORTER</p>
              <p>114, Sadoday Enclave, Kadbi Chowk, Nagpur - 440004</p>
              <p>Email: rajkumargulati94@rediffmail.com</p>
            </div>

            <div style={{ fontSize: '12px', textAlign: 'right', color: '#555' }}>
              <strong>Off.: 2533094</strong>
              <br />
              <strong>Mobile: 8830534212, 9822139994</strong>
              <br />
              <strong>GST No.: 27ABDPG3199E1ZQ</strong>
            </div>
          </header>

          <hr style={{ borderTop: '1px solid #e0e0e0', marginTop: '15px', marginBottom: '20px' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Material Owner & Vehicle Details */}
            <div style={{ flex: 1, fontSize: '12px' }}>
              <p><strong>Material Owner:</strong> {showReceipt.data.owner}</p>
              <p><strong>Vehicle No.:</strong> {showReceipt.data.vehicleNumber}</p>

              {/* Consignor & Consignee Details */}
              <p><strong>Consignor's Name:</strong> {showReceipt.data.consignorName}</p>
              <p><strong>Consignee's Name:</strong> {showReceipt.data.consigneeName}</p>
            </div>

            {/* Lorry Receipt Details */}
            <div style={{ flex: 1, fontSize: '12px', textAlign: 'right' }}>
              <p><strong>L.R. No.:</strong> {showReceipt.data.lrNumber}</p>
              <p><strong>Date:</strong> {showReceipt.data.date}</p>
              <p><strong>From:</strong> {showReceipt.data.from}</p>
              <p><strong>To:</strong> {showReceipt.data.to}</p>
            </div>
          </div>

          {/* Cargo Table */}
          <table
            style={{
              width: '100%',
              border: '1px solid #dee2e6',
              marginTop: '20px',
              borderCollapse: 'collapse',
            }}
          >
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '8px', textAlign: 'left' }}>No. of Packages</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Weight (IN M.T.)</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Rate</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px' }}>{showReceipt.data.quantity || 'N/A'}</td>
                <td style={{ padding: '8px' }}>{showReceipt.data.description || 'N/A'}</td>
                <td style={{ padding: '8px' }}>{showReceipt.data.actualWeight || 'N/A'}</td>
                <td style={{ padding: '8px' }}>{showReceipt.data.customerRate || 'N/A'}</td>
                <td style={{ padding: '8px' }}>{showReceipt.data.totalAmount || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
          <div style={{display:'flex'}}>

          {/* Terms and Conditions */}
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '12px', textAlign: 'left', color: '#555' }}>
              <strong>Terms & Conditions:</strong>
              <br />
              1) All Liquids Oil, Ghee, Edin, Fruits, Vegetables fresh & fragile goods be carried at consignor's Risk.
              <br />
              2) Company shall not be responsible for any damage by Accident, Fire & Riot.
              <br />
              3) Delay of the goods should be intimated within 7 days.
              <br />
              4) Insurance is to be borne by consignor; otherwise, goods will be transported entirely at consignor's risk.
              <br />
              5) Consignor is liable for all consequences arising out of incorrect declaration of the contents of the consignment.
            </p>
          </div>

          {/* Signature */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p><strong>Party Sign:</strong> __________________________</p>
            <p>For RAJ KUMAR GULATI</p>
          </div>
          </div>
        </div>
      </div>
    )}
  </Box>
</Modal>




    </>



  );
}

export default LrTable;
