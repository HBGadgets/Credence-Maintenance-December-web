import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import {
  CButton,
  CPagination,
  CPaginationItem,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CImage,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CCardHeader,
  CFormInput,
  CCard,
} from '@coreui/react'
import DateRangeFilter from '../../common/DateRangeFilter'
import IconDropdown from '../../IconDropdown'
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

export default function ExpensesTable({ expenses }) {
  const [open, setOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filteredExpenses, setFilteredExpenses] = useState(expenses)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const itemsPerPage = 10 // Number of items per page in modal table

  const handleOpen = () => {
    setCurrentPage(1) // Reset to the first page when opening modal
    setOpen(true)
  }

  // Sort expenses by date (descending) for the latest 5 entries
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))
  const latestExpenses = sortedExpenses.slice(0, 5)

  // Apply filter button handler
  const handleApplyFilter = () => {
    const filtered = expenses.filter((expense) => {
      if (!startDate || !endDate) return true
      const date = new Date(expense.date)
      return date >= new Date(startDate) && date <= new Date(endDate)
    })
    setFilteredExpenses(filtered)
    setCurrentPage(1) // Reset to the first page after filtering
  }

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query)
    const filtered = expenses.filter(
      (expense) =>
        expense.vehicleName.toLowerCase().includes(query.toLowerCase()) ||
        expense.expenseType.toLowerCase().includes(query.toLowerCase()) ||
        expense.paymentType.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredExpenses(filtered)
    setCurrentPage(1) // Reset to the first page after filtering
  }

  // Pagination logic for modal table
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage)

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

  // Table component for displaying expenses
  const ExpensesContent = ({ data }) => {
    if (data.length === 0) {
      return (
        <div className="text-center my-4">
          <h5>No results found for "{searchQuery}"</h5>
        </div>
      )
    }

    return (
      <CTable hover responsive bordered striped>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Date</CTableHeaderCell>
            <CTableHeaderCell>Vehicle</CTableHeaderCell>
            <CTableHeaderCell>Type</CTableHeaderCell>
            <CTableHeaderCell>Amount</CTableHeaderCell>
            <CTableHeaderCell>Payment</CTableHeaderCell>
            <CTableHeaderCell>Bill</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.map((expense) => (
            <CTableRow key={expense.id}>
              <CTableDataCell>{expense.date}</CTableDataCell>
              <CTableDataCell>{expense.vehicleName}</CTableDataCell>
              <CTableDataCell>
                <span className="badge bg-primary text-white">{expense.expenseType}</span>
              </CTableDataCell>
              <CTableDataCell>₹{expense.amount}</CTableDataCell>
              <CTableDataCell>{expense.paymentType}</CTableDataCell>
              <CTableDataCell>
                <CImage
                  src={expense.billImage}
                  alt="Bill"
                  className="img-thumbnail"
                  style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                  onClick={() => window.open(expense.billImage, '_blank')}
                />
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    )
  }

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Expenses</strong>
        </CCardHeader>
        <div className="overflow-auto">
          <ExpensesContent data={latestExpenses} />
        </div>
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-secondary m-1" onClick={handleOpen}>
            View More
          </button>
        </div>

        <CModal
          alignment="center"
          scrollable
          visible={open}
          onClose={() => setOpen(false)}
          fullscreen
        >
          <CModalHeader>
            <CModalTitle>All Expenses</CModalTitle>
            {/* Add the IconDropdown inside the modal header */}
          </CModalHeader>

          <CModalBody className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center justify-content-between gap-3">
              {/* Left-aligned date range and button */}
              <div className="d-flex align-items-center gap-3">
                <DateRangeFilter
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                />
                <CButton
                  className="bg-success text-white p-1"
                  onClick={handleApplyFilter}
                  color="primary"
                >
                  Apply Filter
                </CButton>
              </div>

              {/* Right-aligned search bar */}
              <CFormInput
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  width: '200px',
                  boxShadow: searchQuery ? '0 0 8px rgba(0, 123, 255, 0.75)' : 'none',
                  borderColor: searchQuery ? '#007bff' : undefined,
                }}
              />
            </div>

            <ExpensesContent data={currentExpenses} />
            {totalPages > 1 && filteredExpenses.length > itemsPerPage && (
              <CPagination align="center" className="mt-4">
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </CPaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <CPaginationItem
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            )}
          </CModalBody>
          <div className="ms-auto">
            <IconDropdown items={dropdownItems} />
          </div>
        </CModal>
      </CCard>
    </div>
  )
}
