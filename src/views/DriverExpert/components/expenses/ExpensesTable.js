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
  CCard,
} from '@coreui/react'
import DateRangeFilter from '../../common/DateRangeFilter'

export default function ExpensesTable({ expenses }) {
  const [open, setOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // Number of items per page in modal table

  const handleOpen = () => {
    setCurrentPage(1) // Reset to the first page when opening modal
    setOpen(true)
  }

  // Sort expenses by date (descending) for the latest 5 entries
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))
  const latestExpenses = sortedExpenses.slice(0, 5)

  // Filter expenses based on the date range
  const filteredExpenses = expenses.filter((expense) => {
    if (!startDate || !endDate) return true
    const date = new Date(expense.date)
    return date >= new Date(startDate) && date <= new Date(endDate)
  })

  // Pagination logic for modal table
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage)

  // Table component for displaying expenses
  const ExpensesContent = ({ data }) => (
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

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Expenses</strong>
        </CCardHeader>
        <div className="overflow-auto">
          <ExpensesContent data={latestExpenses} />
        </div>
        <div className="mt-4">
          <CButton
            onClick={handleOpen}
            color="link"
            className="d-flex align-items-center text-primary"
          >
            View All Expenses
            <ChevronRight size={16} />
          </CButton>
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
          </CModalHeader>

          <CModalBody className="d-flex flex-column gap-3">
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
            <ExpensesContent data={currentExpenses} />
            {/* Pagination for modal table */}
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
        </CModal>
      </CCard>
    </div>
  )
}
