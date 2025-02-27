import React, { useState } from 'react'
import {
  CPagination,
  CPaginationItem,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CImage,
  CCardHeader,
  CFormInput,
  CCard,
  CButton,
} from '@coreui/react'
import DateRangeFilter from '../../common/DateRangeFilter'

// Temporary Expense Data
const tempExpenses = [
  {
    id: '1',
    driverId: '1',
    date: '2024-03-10',
    vehicleName: 'Toyota Hilux',
    expenseType: 'Fuel',
    description: 'Fuel for the trip',
    amount: 5000,
    paymentType: 'Cash',
    billImage: 'https://images.unsplash.com/photo-1572314493295-09c6d5ec3cdf?w=400',
  },
  {
    id: '2',
    driverId: '1',
    date: '2024-03-11',
    vehicleName: 'Honda Civic',
    expenseType: 'Maintenance',
    description: 'Vehicle maintenance',
    amount: 2000,
    paymentType: 'UPI',
    billImage: 'https://images.unsplash.com/photo-1554774853-719586f82d77?w=400',
  },
]

export default function ExpensesTable() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredExpenses, setFilteredExpenses] = useState(tempExpenses)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Apply Date Filter
  const handleApplyFilter = () => {
    const filtered = tempExpenses.filter((expense) => {
      if (!startDate || !endDate) return true
      const date = new Date(expense.date)
      return date >= new Date(startDate) && date <= new Date(endDate)
    })
    setFilteredExpenses(filtered)
    setCurrentPage(1)
  }

  // Search Functionality
  const handleSearch = (query) => {
    setSearchQuery(query)
    const filtered = tempExpenses.filter(
      (expense) =>
        expense.vehicleName.toLowerCase().includes(query.toLowerCase()) ||
        expense.expenseType.toLowerCase().includes(query.toLowerCase()) ||
        expense.paymentType.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredExpenses(filtered)
    setCurrentPage(1)
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Expenses</strong>
        </CCardHeader>
        <div className="p-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
            <CButton className="bg-success text-white p-1" onClick={handleApplyFilter}>
              Apply Filter
            </CButton>
          </div>

          <CFormInput
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '200px',
              boxShadow: searchQuery ? '0 0 8px rgba(0, 123, 255, 0.75)' : 'none',
              borderColor: searchQuery ? '#007bff' : undefined,
            }}
          />
        </div>

        <div className="overflow-auto">
          {filteredExpenses.length === 0 ? (
            <div className="text-center my-4">
              <h5>No results found for "{searchQuery}"</h5>
            </div>
          ) : (
            <CTable hover responsive bordered striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>SrNo</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Vehicle</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Payment</CTableHeaderCell>
                  <CTableHeaderCell>Bill</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentExpenses.map((expense, index) => (
                  <CTableRow key={expense.id}>
                    <CTableDataCell>{startIndex + index + 1}</CTableDataCell> {/* SrNo Column */}
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
          )}
        </div>

        {totalPages > 1 && (
          <CPagination align="center" className="mt-4">
            <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Previous
            </CPaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <CPaginationItem key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </CPaginationItem>
          </CPagination>
        )}
      </CCard>
    </div>
  )
}
