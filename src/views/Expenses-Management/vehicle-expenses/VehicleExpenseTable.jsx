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
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { IconButton } from '@mui/material'
import { MdOutlinePreview } from 'react-icons/md'
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

const ExpenseList = ({ expenses, onExpensesUpdate, filteredExpenses, setFilteredExpenses }) => {
  const columns = [
    { label: 'Vehicle', key: 'vehicleName', sortable: true },
    { label: 'Category', key: 'category', sortable: true },
    { label: 'Amount', key: 'amount', sortable: true },
    { label: 'Vendor', key: 'vendor', sortable: true },
    { label: 'Date', key: 'date', sortable: true },
  ]

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }) // Sorting configuration
  const [currentPage, setCurrentPage] = useState(1) // Pagination state
  const [searchQuery, setSearchQuery] = useState('') // Search state
  const itemsPerPage = 10 // Items per page

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
    setCurrentPage(1) // Reset to the first page when search query changes
  }, [searchQuery, expenses])

  // Sorting logic
  const handleSort = (key) => {
    if (!columns.find((column) => column.key === key && column.sortable)) return // Prevent sorting on non-sortable columns

    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })

    const sorted = [...filteredExpenses].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })

    setFilteredExpenses(sorted)
  }

  // Get sort icon
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
      const headers = columns.map((column) => column.label)

      // Add data rows
      const data = filteredExpenses.map((expense) =>
        columns.map((column) => {
          if (column.key === 'date') {
            return new Date(expense[column.key]).toLocaleDateString()
          }
          return expense[column.key]?.toString() || ''
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
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Vehicle Expenses</strong>
              <div className="d-flex align-items-center gap-3"></div>
            </CCardHeader>
            <CCardBody>
              {filteredExpenses.length === 0 ? (
                <p className="text-center">No Vehicle Expenses available.</p>
              ) : (
                <>
                  <CTable striped hover responsive bordered>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell className="text-center" scope="col">
                          SN
                        </CTableHeaderCell>
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
                        <CTableHeaderCell className="text-center" scope="col">
                          Actions
                        </CTableHeaderCell>
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
                          <CTableDataCell
                            className="text-center"
                            style={{ display: 'flex', justifyContent: 'center' }}
                          >
                            <IconButton
                              aria-label="view"
                              onClick={() => console.log('View:', expense)}
                              style={{ margin: '0 5px', color: 'lightBlue' }}
                            >
                              <MdOutlinePreview />
                            </IconButton>
                            <IconButton
                              aria-label="edit"
                              onClick={() => console.log('Edit:', expense)}
                              style={{ margin: '0 5px', color: 'orange' }}
                            >
                              <AiFillEdit style={{ fontSize: '20px' }} />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDelete(expense._id)}
                              style={{ margin: '0 5px', color: 'red' }}
                            >
                              <AiFillDelete style={{ fontSize: '20px' }} />
                            </IconButton>
                            <IconButton
                              aria-label="print"
                              onClick={() => console.log('Print:', expense)}
                              style={{ margin: '0 5px', color: 'green' }}
                            >
                              <FaPrint style={{ fontSize: '20px' }} />
                            </IconButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center">
                      <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        handlePageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
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

export default ExpenseList
