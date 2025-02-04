import React, { useState } from 'react'
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
  CButton,
} from '@coreui/react'
import { FaTruckMoving } from 'react-icons/fa'

import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { FaPrint } from 'react-icons/fa'
import { colors, IconButton, TableContainer } from '@mui/material'
import { Edit, Eye, Trash2 } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import './lr.css'
import { Box, Modal } from '@mui/material'
import IconDropdown from '../IconDropdown'
import { FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import { FaArrowUp } from 'react-icons/fa'
import { toast } from 'react-toastify'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100vh',
  boxShadow: 24,
  p: 4,

  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
  margintop: '8px',
}

function LrTable({ filteredLrs }) {
  const [showReceipt, setShowReceipt] = useState({ show: false, data: null })

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
  ]

  const handlePrint = (formData) => {
    const doc = new jsPDF()

    // Add Company Header
    doc.setFont('Helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('RAJ KUMAR GULATI', 105, 10, { align: 'center' })
    doc.setFontSize(10)
    doc.text(
      'FLEET OWNER, AUTHORISED CIL, Kribhco, PPL, ZUARI, IFFCO & NFCL TRANSPORTER',
      105,
      15,
      { align: 'center' },
    )
    doc.text('114, Sadoday Enclave, Kadbi Chowk, NAGPUR - 440 004', 105, 20, { align: 'center' })
    doc.text('e-mail: rajkumargulati94@rediffmail.com', 105, 25, {
      align: 'center',
    })

    doc.setFontSize(10)
    doc.text('Off.: 2533094', 10, 30)
    doc.text('Mobile: 8830534212, 9822139994', 50, 30)
    doc.text('GST No.: 27ABDPG3199E1ZQ', 150, 30)
    doc.line(10, 35, 200, 35) // Horizontal line separator

    // Add Lorry Receipt Details
    doc.setFontSize(10)
    doc.text(`L.R. No.: ${formData.lrNumber || ''}`, 150, 40)
    doc.text(`Date: ${formData.date || ''}`, 150, 45)
    doc.text(`From: ${formData.from || ''}`, 150, 50)
    doc.text(`To: ${formData.to || ''}`, 150, 55)

    // Add Material Owner & Vehicle Details
    doc.text('Material Owner: ' + (formData.materialOwner || ''), 10, 40)
    doc.text('Vehicle No.: ' + (formData.vehicleNumber || ''), 10, 45)

    // Add Consignor & Consignee Details
    doc.text("Consignor's Name & Address:", 10, 55)
    doc.text(formData.consignorName || '', 10, 60)
    doc.text(formData.consignorAddress || '', 10, 65)

    doc.text("Consignee's Name & Address:", 10, 75)
    doc.text(formData.consigneeName || '', 10, 80)
    doc.text(formData.consigneeAddress || '', 10, 85)

    // Add Table for Cargo Details
    const tableBody = formData?.items?.map((item) => [
      item.noOfPackages || 'N/A',
      item.description || 'N/A',
      item.weight || 'N/A',
      item.rate || 'N/A',
      item.amount || 'N/A',
    ])

    doc.autoTable({
      startY: 95,
      head: [['No. of Packages', 'Description', 'Weight (IN M.T.)', 'Rate', 'Amount']],
      body: tableBody,
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 60 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
      },
    })

    // Footer - Terms and Conditions
    const terms = `
1) All Liquids Oil, Ghee, Edin, Fruits, Vegetables fresh & fragile goods be carried at consignor's Risk.
2) Company shall not be responsible for any damage by Accident, Fire & Riot.
3) Delay of the goods, should be intimated within 7 days.
4) Insurance are to be borne by consignor otherwise goods will be transported, entirely of consignor Risk.
5) Consignor is liable for all consequences arising out incorrect declaration of the contents of the consignment.
  `
    doc.setFontSize(8)
    doc.text(terms, 10, doc.lastAutoTable.finalY + 10)

    // Add Signatures
    doc.text('Party Sign: ____________________', 10, doc.lastAutoTable.finalY + 50)
    doc.text('For RAJ KUMAR GULATI', 150, doc.lastAutoTable.finalY + 50)

    // Save PDF
    doc.save('LorryReceipt.pdf')
  }

  // Export to PDF function
  const exportToPDF = () => {
    try {
      if (!Array.isArray(filteredExpenses) || filteredExpenses.length === 0) {
        throw new Error('No data available for PDF export')
      }

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      // Add headers
      const headers = ['Date', 'Vehicle', 'Type', 'Amount', 'Payment', 'Bill']

      // Add data rows
      const data = filteredExpenses.map((expense, index) => [
        expense.date,
        expense.vehicleName,
        expense.expenseType,
        `₹${expense.amount}`,
        expense.paymentType,
        expense.billImage,
      ])

      // Generate table
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 20,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [10, 45, 99], textColor: 255, fontStyle: 'bold' },
      })

      // Save PDF
      const filename = `Expenses_List_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(filename)
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('PDF Export Error:', error)
      toast.error(error.message || 'Failed to export PDF')
    }
  }

  // Export to Excel function
  const exportToExcel = () => {
    try {
      if (!Array.isArray(filteredExpenses) || filteredExpenses.length === 0) {
        throw new Error('No data available for Excel export')
      }

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Expenses')

      // Add headers
      worksheet.addRow(['Date', 'Vehicle', 'Type', 'Amount', 'Payment', 'Bill'])

      // Add data rows
      filteredExpenses.forEach((expense) => {
        worksheet.addRow([
          expense.date,
          expense.vehicleName,
          expense.expenseType,
          `₹${expense.amount}`,
          expense.paymentType,
          expense.billImage,
        ])
      })

      // Save Excel file
      workbook.xlsx.writeBuffer().then((buffer) => {
        const filename = `Expenses_List_${new Date().toISOString().split('T')[0]}.xlsx`
        saveAs(new Blob([buffer]), filename)
        toast.success('Excel file downloaded successfully')
      })
    } catch (error) {
      console.error('Excel Export Error:', error)
      toast.error(error.message || 'Failed to export Excel')
    }
  }

  // Handle logout function
  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked')
  }

  // Dropdown items for export
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () => exportToPDF(),
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () => exportToExcel(),
    },
    {
      icon: FaPrint,
      label: 'Print Page',
      onClick: () => window.print(),
    },
    {
      icon: HiOutlineLogout,
      label: 'Logout',
      onClick: () => handleLogout(),
    },
    {
      icon: FaArrowUp,
      label: 'Scroll To Top',
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
  ]

  return (
    <>
      <CRow style={{ marginTop: '1rem' }}>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Lorry Receipt/Challan List</strong>
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
                    {filteredLrs.map((data, index) => (
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
                            <Eye size={16} />
                          </CButton>

                          <CButton color="warning" size="sm" onClick={() => handleEdit(data)}>
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
            <div className="ms-auto">
              <IconDropdown items={dropdownItems} />
            </div>
          </CCard>
        </CCol>
      </CRow>

      <Modal
        open={showReceipt.show}
        onClose={handleViewClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        size="lg"
      >
        <Box
          sx={{
            ...style,

            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '1100px',
            margin: 'auto',
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
                  // backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>

              <CContainer>
                {/* Company Header */}
                <CCard style={{ border: 'none', width: '100%', fontFamily: 'serif' }}>
                  <CCardHeader>
                    <CRow className="align-items-center">
                      {/* Left Column: Logo or Icon */}
                      <CCol xs={2} className="text-start">
                        {/* <FaTruckMoving size={40} /> */}
                      </CCol>

                      {/* Center Column: Name, Designation, and Address */}
                      <CCol xs={8} className="text-center">
                        <h3 style={{ fontFamily: 'serif', marginBottom: '0.5rem', color: 'red' }}>
                          RAJ KUMAR GULATI
                        </h3>
                        <p style={{ marginBottom: '0.25rem', fontSize: '14px' }}>
                          FLEET OWNER, AUTHORISED CIL, Kribhco, PPL, ZUARI, IFFCO & NFCL TRANSPORTER
                        </p>
                        <p style={{ marginBottom: '0.25rem', fontSize: '14px' }}>
                          114, Sadoday Enclave, Kadbi Chowk, Nagpur - 440004
                        </p>
                        <p style={{ marginBottom: '0', fontSize: '14px' }}>
                          Email: rajkumargulati94@rediffmail.com
                        </p>
                      </CCol>

                      {/* Right Column: Contact Information */}
                      <div
                        style={{ display: 'inline-block', fontFamily: 'serif' }}
                        className="text-end"
                      >
                        <div>
                          <span
                            style={{
                              fontSize: '12px',
                            }}
                          >
                            Off.: 2533094
                          </span>
                        </div>
                        <div style={{ fontSize: '12px' }}>
                          <p style={{ margin: 0 }}>Mobile: 8830534212, 9822139994</p>
                        </div>
                        <div style={{ fontSize: '12px' }}>
                          <span>GST No.: 27ABDPG3199E1ZQ</span>
                        </div>
                      </div>
                    </CRow>
                  </CCardHeader>
                  <CCardBody>
                    <hr className="my-3" />

                    <CRow>
                      {/* Material Owner & Vehicle Details */}
                      <CCol>
                        <p>
                          <strong>Material Owner:</strong> {showReceipt.data.owner}
                        </p>
                        <p>
                          <strong>Vehicle No.:</strong> {showReceipt.data.vehicleNumber}
                        </p>
                        <p>
                          <strong>Consignor's Name:</strong> {showReceipt.data.consignorName}
                        </p>
                        <p>
                          <strong>Consignee's Name:</strong> {showReceipt.data.consigneeName}
                        </p>
                      </CCol>

                      {/* Lorry Receipt Details */}
                      <CCol className="text-end">
                        <p>
                          <strong>L.R. No.:</strong> {showReceipt.data.lrNumber}
                        </p>
                        <p>
                          <strong>Date:</strong> {showReceipt.data.date}
                        </p>
                        <p>
                          <strong>From:</strong> {showReceipt.data.from}
                        </p>
                        <p>
                          <strong>To:</strong> {showReceipt.data.to}
                        </p>
                      </CCol>
                    </CRow>

                    {/* Cargo Table */}
                    <CTable striped bordered responsive className="mt-4">
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>No. of Packages</CTableHeaderCell>
                          <CTableHeaderCell>Description</CTableHeaderCell>
                          <CTableHeaderCell>Weight (IN M.T.)</CTableHeaderCell>
                          <CTableHeaderCell>Rate</CTableHeaderCell>
                          <CTableHeaderCell>Amount</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow>
                          <CTableDataCell>{showReceipt.data.quantity || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{showReceipt.data.description || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{showReceipt.data.actualWeight || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{showReceipt.data.customerRate || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{showReceipt.data.totalAmount || 'N/A'}</CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                    <hr className="my-3" />
                    <CRow className="mt-4">
                      {/* Terms and Conditions */}
                      <CCol>
                        <p className="text-muted">
                          <strong style={{ color: 'lightblue' }}>Terms & Conditions:</strong>
                          <div style={{ fontSize: '9px' }}>
                            <br />
                            1) All Liquids Oil, Ghee, Edin, Fruits, Vegetables fresh & fragile goods
                            be carried at consignor's Risk.
                            <br />
                            2) Company shall not be responsible for any damage by Accident, Fire &
                            Riot.
                            <br />
                            3) Delay of the goods should be intimated within 7 days.
                            <br />
                            4) Insurance is to be borne by consignor; otherwise, goods will be
                            transported entirely at consignor's risk.
                            <br />
                            5) Consignor is liable for all consequences arising out of incorrect
                            declaration of the contents of the consignment.
                          </div>
                        </p>
                      </CCol>

                      {/* Signature */}
                      <CCol className="text-end mt-5 " style={{ fontSize: '15px' }}>
                        <p>
                          <strong>Party Sign:</strong> __________________________
                        </p>
                        <p style={{ color: 'red' }}>For RAJ KUMAR GULATI</p>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CContainer>
            </div>
          )}
        </Box>
      </Modal>
    </>
  )
}

export default LrTable
