import React, { useEffect } from 'react'
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
  CFormSelect,
} from '@coreui/react'
import { FaUserEdit } from 'react-icons/fa'
import { IoTrashBin } from 'react-icons/io5'
import { FormControl, Select, MenuItem, TableContainer } from '@mui/material'
import IconDropdown from '../IconDropdown'
import { FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import { FaPrint } from 'react-icons/fa'
import { FaArrowUp } from 'react-icons/fa'
import { toast } from 'react-toastify'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const InvoiceList = ({ invoices, setCurrentInvoice, setEditModalOpen, setFilteredInvoices }) => {
  const handleDelete = async (invoiceId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this invoice?')

    if (!confirmDelete) {
      return // Exit if the user cancels
    }
    try {
      const response = await fetch(`http://localhost:5000/Invoice/${invoiceId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFilteredInvoices(
          (prevInvoices) => prevInvoices.filter((invoice) => invoice._id !== invoiceId), // Remove deleted invoice from state
        )
        alert('Invoice deleted successfully')
      } else {
        throw new Error('Failed to delete invoice')
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      alert('Error deleting invoice')
    }
  }

  const handleEdit = (invoice) => {
    console.log('invoice in handleEdit', invoice)

    setEditModalOpen(true)
    setCurrentInvoice(invoice)
    console.log('yes i am here')
  }

  const handleToggleStatus = async (invoiceId, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid'
    try {
      const response = await fetch(`http://localhost:5000/Invoice/${invoiceId}`, {
        method: 'PUT', // Assuming you're using PUT to update the invoice
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        // Update the status in the local state
        setFilteredInvoices((prevInvoices) =>
          prevInvoices.map((invoice) =>
            invoice._id === invoiceId ? { ...invoice, status: newStatus } : invoice,
          ),
        )
        alert(`Invoice status updated to ${newStatus}`)
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating invoice status:', error)
      alert('Error updating status')
    }
  }

  if (!Array.isArray(invoices) || invoices.length === 0) {
    return <p className="text-center text-muted">No invoices found.</p>
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
  ]

  // Export to PDF function
  const exportToPDF = () => {
    try {
      if (!Array.isArray(invoices) || invoices.length === 0) {
        throw new Error('No data available for PDF export')
      }

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      // Add headers
      const headers = columns.map((column) => column.label)

      // Add data rows
      const data = invoices.map((invoice) =>
        columns.map((column) => {
          if (column.key === 'date' || column.key === 'paymentDueDate') {
            return new Date(invoice[column.key]).toLocaleDateString()
          }
          return invoice[column.key]?.toString() || ''
        }),
      )

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
      const filename = `Invoices_List_${new Date().toISOString().split('T')[0]}.pdf`
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
      if (!Array.isArray(invoices) || invoices.length === 0) {
        throw new Error('No data available for Excel export')
      }

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Invoices')

      // Add headers
      worksheet.addRow(columns.map((column) => column.label))

      // Add data rows
      invoices.forEach((invoice) => {
        worksheet.addRow(
          columns.map((column) => {
            if (column.key === 'date' || column.key === 'paymentDueDate') {
              return new Date(invoice[column.key]).toLocaleDateString()
            }
            return invoice[column.key]?.toString() || ''
          }),
        )
      })

      // Save Excel file
      workbook.xlsx.writeBuffer().then((buffer) => {
        const filename = `Invoices_List_${new Date().toISOString().split('T')[0]}.xlsx`
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
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Invoices List</strong>
            </CCardHeader>
            <CCardBody>
              {invoices.length === 0 ? (
                <p className="text-center">No Invoice available.</p>
              ) : (
                <CTable striped hover responsive bordered>
                  <CTableHead>
                    <CTableRow className="text-nowrap">
                      <CTableHeaderCell className="text-center" scope="col">
                        SN
                      </CTableHeaderCell>

                      {columns.map((column, index) => (
                        <CTableHeaderCell key={index} className="text-center" scope="col">
                          {column.label}
                        </CTableHeaderCell>
                      ))}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {invoices
                      .slice()
                      .reverse()
                      .map((invoice, index) => (
                        <CTableRow key={invoice._id} className="text-nowrap">
                          <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                          {columns.map((column, index) => {
                            const value =
                              column.key === 'status' ? (
                                <span
                                  style={{
                                    color: invoice[column.key] === 'paid' ? 'green' : 'red',
                                    minWidth: '4rem',
                                  }}
                                >
                                  {invoice[column.key]}
                                </span>
                              ) : column.key === 'items' ? (
                                <CFormSelect
                                  value={invoice[column.key]?.[0]?.name || ''}
                                  onChange={(e) => handleItemChange(invoice._id, e.target.value)}
                                  style={{ height: '35px', padding: '0 10px', minWidth: '10rem' }}
                                >
                                  {invoice[column.key]?.map((item, index) => (
                                    <option key={index} value={item.name}>
                                      {item.name}
                                    </option>
                                  ))}
                                </CFormSelect>
                              ) : column.key === 'actions' ? (
                                <div style={{ display: 'flex' }}>
                                  <CButton
                                    color="warning"
                                    size="sm"
                                    onClick={() => handleEdit(invoice)}
                                  >
                                    <FaUserEdit size={20} />
                                  </CButton>
                                  <CButton
                                    color="danger"
                                    size="sm"
                                    className="ms-2"
                                    onClick={() => handleDelete(invoice._id)}
                                  >
                                    <IoTrashBin size={20} />
                                  </CButton>
                                  <CButton
                                    color="info"
                                    size="sm"
                                    onClick={() => handleToggleStatus(invoice._id, invoice.status)}
                                    style={{ marginLeft: '7px', minWidth: '6.1rem' }}
                                  >
                                    {invoice.status === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
                                  </CButton>
                                </div>
                              ) : column.key === 'date' || column.key === 'paymentDueDate' ? (
                                new Date(invoice[column.key]).toLocaleDateString()
                              ) : (
                                invoice[column.key]
                              )

                            return (
                              <CTableDataCell key={index} className="text-center">
                                {value}
                              </CTableDataCell>
                            )
                          })}
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
    </>
  )
}

export default InvoiceList
