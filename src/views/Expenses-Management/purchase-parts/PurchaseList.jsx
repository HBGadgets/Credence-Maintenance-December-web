import React, { useState } from 'react'
import {
  CCard,
  CCol,
  CRow,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react'

import { FaEye, FaUserEdit, FaPrint, FaRegFilePdf, FaArrowUp } from 'react-icons/fa'
import { IoTrashBin } from 'react-icons/io5'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import { toast } from 'react-toastify'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import IconDropdown from '../IconDropdown'

// Define the column structure
const columns = [
  { label: 'Part Name', key: 'partName', sortable: true },
  { label: 'Vehicle', key: 'vehicle', sortable: true },
  { label: 'Category', key: 'category', sortable: true },
  { label: 'Vendor', key: 'vendor', sortable: true },
  { label: 'Quantity', key: 'quantity', sortable: true },
  { label: 'Cost Per Unit', key: 'costPerUnit', sortable: true },
  { label: 'Purchase Date', key: 'purchaseDate', sortable: true },
  { label: 'Invoice/Bill Number', key: 'invoiceNumber', sortable: true },
  { label: 'Document', key: 'document', sortable: true },
  { label: 'Actions', key: 'actions', sortable: false },
]

const PurchaseList = ({
  purchases,
  searchTerm,
  onView,
  onEdit,
  onDelete,
  onPrint,
  decodedToken,
  selectedUserName,
  selectedGroupName,
  selectedFromDate,
  selectedToDate,
  getDateRangeFromPeriod,
  selectedDeviceName,
  newAddressData,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  // Filter purchases based on the search term
  const filteredPurchases = purchases.filter((purchase) =>
    purchase.partName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle sorting logic
  const handleSort = (key) => {
    if (!columns.find((column) => column.key === key && column.sortable)) return

    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })

    filteredPurchases.sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })
  }

  // Get sorting icon
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼'
    }
    return '↕'
  }

  // Reusable action buttons
  const ActionButtons = ({ purchase }) => (
    <div style={{ display: 'flex' }}>
      <CButton onClick={() => onView(purchase)} color="warning" size="sm">
        <FaEye size={18} />
      </CButton>
      <CButton className="ms-2" color="info" size="sm" onClick={() => onEdit(purchase)}>
        <FaUserEdit style={{ fontSize: '18px' }} />
      </CButton>
      <CButton color="danger" size="sm" className="ms-2" onClick={() => onDelete(purchase)}>
        <IoTrashBin style={{ fontSize: '18px' }} />
      </CButton>
      <CButton color="success" size="sm" className="ms-2" onClick={() => onPrint(purchase)}>
        <FaPrint style={{ fontSize: '18px' }} />
      </CButton>
    </div>
  )

  // Export to PDF function
  const exportToPDF = () => {
    try {
      // Validate data before proceeding
      if (!Array.isArray(filteredPurchases) || filteredPurchases.length === 0) {
        throw new Error('No data available for PDF export')
      }

      // Configuration for styling and layout
      const CONFIG = {
        colors: {
          primary: [10, 45, 99],
          secondary: [70, 70, 70],
          border: [220, 220, 220],
          background: [249, 250, 251],
        },
        company: {
          name: 'Credence Maintenance',
          logo: { x: 15, y: 15, size: 8 },
        },
        layout: {
          margin: 15,
          lineHeight: 6,
        },
        fonts: {
          primary: 'helvetica',
        },
      }

      // Create a new jsPDF instance (landscape A4)
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      // --- Header Section ---
      doc.setFillColor(...CONFIG.colors.primary)
      doc.rect(
        CONFIG.company.logo.x,
        CONFIG.company.logo.y,
        CONFIG.company.logo.size,
        CONFIG.company.logo.size,
        'F',
      )

      doc.setFont(CONFIG.fonts.primary, 'bold')
      doc.setFontSize(16)
      doc.text(CONFIG.company.name, 28, 21)

      doc.setDrawColor(...CONFIG.colors.primary)
      doc.setLineWidth(0.5)
      doc.line(CONFIG.layout.margin, 25, doc.internal.pageSize.width - CONFIG.layout.margin, 25)

      // --- Title & Generation Date ---
      doc.setFontSize(24)
      doc.text('Purchase Expenses Report', CONFIG.layout.margin, 35)

      const currentDate = new Date().toLocaleDateString('en-GB')
      const dateText = `Generated: ${currentDate}`
      doc.setFontSize(10)
      doc.text(
        dateText,
        doc.internal.pageSize.width - CONFIG.layout.margin - doc.getTextWidth(dateText),
        21,
      )

      // --- Table Data Preparation ---
      const headers = [
        'SN',
        'Part Name',
        'Vehicle',
        'Category',
        'Vendor',
        'Quantity',
        'Cost Per Unit',
        'Purchase Date',
        'Invoice/Bill Number',
        'Document',
      ]

      const data = filteredPurchases.map((purchase, index) => [
        index + 1,
        purchase.partName || '--',
        purchase.vehicle || '--',
        purchase.category || '--',
        purchase.vendor || '--',
        purchase.quantity !== undefined ? purchase.quantity.toString() : '--',
        purchase.costPerUnit !== undefined ? purchase.costPerUnit.toString() : '--',
        purchase.purchaseDate || '--',
        purchase.invoiceNumber || '--',
        purchase.document || '--',
      ])

      // --- Generate Table using autoTable ---
      doc.autoTable({
        startY: 45,
        head: [headers],
        body: data,
        theme: 'grid',
        styles: {
          fontSize: 10,
          halign: 'center',
          cellPadding: 2,
          lineColor: CONFIG.colors.border,
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: CONFIG.colors.primary,
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: CONFIG.colors.background,
        },
        margin: { left: CONFIG.layout.margin, right: CONFIG.layout.margin },
        didDrawPage: (dataArg) => {
          if (doc.getCurrentPageInfo().pageNumber > 1) {
            doc.setFontSize(15)
            doc.setFont(CONFIG.fonts.primary, 'bold')
            doc.text('Purchase Expenses Report', CONFIG.layout.margin, 10)
          }
        },
      })

      // --- Footer Section ---
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setDrawColor(...CONFIG.colors.border)
        doc.setLineWidth(0.5)
        doc.line(
          CONFIG.layout.margin,
          doc.internal.pageSize.height - 15,
          doc.internal.pageSize.width - CONFIG.layout.margin,
          doc.internal.pageSize.height - 15,
        )
        doc.setFontSize(9)
        doc.text(
          `© ${CONFIG.company.name}`,
          CONFIG.layout.margin,
          doc.internal.pageSize.height - 10,
        )
        const pageNumber = `Page ${i} of ${pageCount}`
        const pageNumberWidth = doc.getTextWidth(pageNumber)
        doc.text(
          pageNumber,
          doc.internal.pageSize.width - CONFIG.layout.margin - pageNumberWidth,
          doc.internal.pageSize.height - 10,
        )
      }

      // --- Save the PDF ---
      const filename = `Purchase_List_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(filename)
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('PDF Export Error:', error)
      toast.error(error.message || 'Failed to export PDF')
    }
  }

  // Export to Excel function
  const exportToExcel = async () => {
    try {
      // Validate data before proceeding
      if (!Array.isArray(filteredPurchases) || filteredPurchases.length === 0) {
        throw new Error('No data available for Excel export')
      }

      // Initialize workbook and worksheet
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Purchases')

      // Add headers
      const headers = columns.map((column) => column.label)
      worksheet.addRow(headers)

      // Add data rows
      filteredPurchases.forEach((purchase) => {
        const row = columns.map((column) => purchase[column.key] || '')
        worksheet.addRow(row)
      })

      // Generate and save file
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const filename = `Purchases_${new Date().toISOString().split('T')[0]}.xlsx`
      saveAs(blob, filename)

      toast.success('Excel file downloaded successfully')
    } catch (error) {
      console.error('Excel Export Error:', error)
      toast.error(error.message || 'Failed to export Excel file')
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
    <CRow style={{ marginTop: '1rem' }}>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Purchase Expenses</strong>
          </CCardHeader>
          <CCardBody>
            {filteredPurchases.length === 0 ? (
              <p className="text-center">No purchases available.</p>
            ) : (
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    {columns.map((column, index) => (
                      <CTableHeaderCell
                        key={index}
                        className="text-center"
                        onClick={() => column.sortable && handleSort(column.key)}
                        style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                        role="columnheader"
                        aria-sort={sortConfig.key === column.key ? sortConfig.direction : 'none'}
                      >
                        {column.label} {column.sortable && getSortIcon(column.key)}
                      </CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredPurchases.map((purchase) => (
                    <CTableRow key={purchase.id}>
                      {columns.map((column) => {
                        if (column.key === 'actions') {
                          return (
                            <CTableDataCell
                              key={column.key}
                              className="text-center text-nowrap"
                              style={{ paddingLeft: '15px', paddingRight: '15px' }}
                            >
                              <ActionButtons purchase={purchase} />
                            </CTableDataCell>
                          )
                        }
                        return (
                          <CTableDataCell
                            key={column.key}
                            className="text-center text-nowrap"
                            style={{ paddingLeft: '15px', paddingRight: '15px' }}
                          >
                            {purchase[column.key]?.toString() || ''}
                          </CTableDataCell>
                        )
                      })}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
        <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
          <IconDropdown items={dropdownItems} />
        </div>
      </CCol>
    </CRow>
  )
}

export default PurchaseList
