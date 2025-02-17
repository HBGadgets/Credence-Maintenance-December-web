import React, { useState, useEffect } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CFormInput,
  CButton,
} from '@coreui/react'

import { FaUserEdit, FaEye, FaRegFilePdf, FaPrint, FaArrowUp } from 'react-icons/fa'
import { IoTrashBin } from 'react-icons/io5'
import { HiOutlineLogout } from 'react-icons/hi'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import IconDropdown from '../IconDropdown'
import { toast } from 'react-toastify'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const ExpenseList = ({ expenses, onExpensesUpdate, filteredExpenses, setFilteredExpenses }) => {
  const columns = [
    { label: 'Vehicle', key: 'vehicleName', sortable: true },
    { label: 'Category', key: 'category', sortable: true },
    { label: 'Amount', key: 'amount', sortable: true },
    { label: 'Vendor', key: 'vendor', sortable: true },
    { label: 'Date', key: 'date', sortable: true },
  ]

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const itemsPerPage = 10

  // Filter expenses based on search query
  useEffect(() => {
    const filtered = expenses.filter((expense) => {
      const search = searchQuery.toLowerCase().trim()
      return (
        expense.vehicleName.toLowerCase().includes(search) ||
        expense.category.toLowerCase().includes(search) ||
        expense.amount.toString().includes(search) ||
        expense.vendor.toLowerCase().includes(search) ||
        new Date(expense.date).toLocaleDateString().includes(search)
      )
    })
    setFilteredExpenses(filtered)
    setCurrentPage(1)
  }, [searchQuery, expenses, setFilteredExpenses])

  // Sorting logic
  const handleSort = (key) => {
    if (!columns.find((column) => column.key === key && column.sortable)) return

    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })

    const sorted = [...filteredExpenses].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })
    setFilteredExpenses(sorted)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼'
    }
    return '↕'
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = filteredExpenses.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Handle delete expense
  const handleDelete = async (expenseId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this expense?')
    if (!confirmDelete) return

    try {
      const response = await fetch(`http://localhost:5000/expenses/${expenseId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFilteredExpenses((prevExpenses) =>
          prevExpenses.filter((expense) => expense._id !== expenseId),
        )
        alert('Expense deleted successfully')
      } else {
        alert('Failed to delete expense')
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('Error deleting expense')
    }
  }

  // Export to PDF function (updated)
  const exportToPDF = () => {
    try {
      if (!Array.isArray(filteredExpenses) || filteredExpenses.length === 0) {
        throw new Error('No data available for PDF export')
      }

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

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      // Header Section
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

      // Title & Generation Date
      doc.setFontSize(24)
      doc.text('Vechile Expenses', CONFIG.layout.margin, 35)
      const currentDate = new Date().toLocaleDateString('en-GB')
      const dateText = `Generated: ${currentDate}`
      doc.setFontSize(10)
      doc.text(
        dateText,
        doc.internal.pageSize.width - CONFIG.layout.margin - doc.getTextWidth(dateText),
        21,
      )

      // Table Data Preparation
      const headers = ['SN', 'Vehicle', 'Category', 'Amount', 'Vendor', 'Date']
      const data = filteredExpenses.map((expense, index) => [
        index + 1,
        expense.vehicleName || '--',
        expense.category || '--',
        expense.amount !== undefined ? expense.amount.toString() : '--',
        expense.vendor || '--',
        expense.date ? new Date(expense.date).toLocaleDateString() : '--',
      ])

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
            doc.text('Vehicle Expense', CONFIG.layout.margin, 10)
          }
        },
      })

      // Footer Section
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

      const filename = `Expense_Report_${new Date().toISOString().split('T')[0]}.pdf`
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

      // Add headers (using the same columns as the table)
      worksheet.addRow(columns.map((column) => column.label))

      // Add data rows
      filteredExpenses.forEach((expense) => {
        worksheet.addRow(
          columns.map((column) => {
            if (column.key === 'date') {
              return new Date(expense[column.key]).toLocaleDateString()
            }
            return expense[column.key]?.toString() || ''
          }),
        )
      })

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
    console.log('Logout clicked')
  }

  // Dropdown items for export
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: exportToPDF,
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: exportToExcel,
    },
    {
      icon: FaPrint,
      label: 'Print Page',
      onClick: () => window.print(),
    },
    {
      icon: HiOutlineLogout,
      label: 'Logout',
      onClick: handleLogout,
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
        <CCol xs={15}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Vehicle Expenses</strong>
              <div className="d-flex align-items-center gap-3">
                <CFormInput
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-25"
                />
              </div>
            </CCardHeader>
            <CCardBody>
              {filteredExpenses.length === 0 ? (
                <p className="text-center">No Vehicle Expenses available.</p>
              ) : (
                <>
                  <CTable striped hover responsive bordered>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell className="text-center">SN</CTableHeaderCell>
                        {columns.map((column) => (
                          <CTableHeaderCell
                            key={column.key}
                            className="text-center"
                            onClick={() => column.sortable && handleSort(column.key)}
                            style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                          >
                            {column.label} {column.sortable && getSortIcon(column.key)}
                          </CTableHeaderCell>
                        ))}
                        <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {currentData.map((expense, index) => (
                        <CTableRow key={expense._id}>
                          <CTableDataCell className="text-center">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </CTableDataCell>
                          {columns.map((column) => (
                            <CTableDataCell key={column.key} className="text-center text-nowrap">
                              {column.key === 'date'
                                ? new Date(expense[column.key]).toLocaleDateString()
                                : expense[column.key]}
                            </CTableDataCell>
                          ))}
                          <CTableDataCell style={{ display: 'flex', justifyContent: 'center' }}>
                            <CButton
                              color="warning"
                              size="sm"
                              onClick={() => console.log('View:', expense)}
                            >
                              <FaEye size={18} />
                            </CButton>
                            <CButton
                              className="ms-2"
                              color="info"
                              size="sm"
                              onClick={() => console.log('Edit:', expense)}
                            >
                              <FaUserEdit style={{ fontSize: '20px' }} />
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              className="ms-2"
                              onClick={() => handleDelete(expense._id)}
                            >
                              <IoTrashBin style={{ fontSize: '20px' }} />
                            </CButton>
                            <CButton
                              color="success"
                              size="sm"
                              className="ms-2"
                              onClick={() => console.log('Print:', expense)}
                            >
                              <FaPrint style={{ fontSize: '20px' }} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center">
                      {/* Your Pagination component here */}
                    </div>
                  )}
                </>
              )}
            </CCardBody>
          </CCard>
          <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
            <IconDropdown items={dropdownItems} />
          </div>
        </CCol>
      </CRow>
    </>
  )
}

export default ExpenseList
