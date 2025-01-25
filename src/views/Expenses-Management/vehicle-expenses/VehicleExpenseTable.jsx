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
import { FaPrint } from 'react-icons/fa'
import { IconButton } from '@mui/material'
import { MdOutlinePreview } from 'react-icons/md'
// import Pagination from '../views/base/paginations/Pagination' // Assuming you have a Pagination component

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

  return (
    <>
      <CRow style={{ marginTop: '1rem' }}>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Vehicle Expenses</strong>
              <CFormInput
                type="text"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-25"
                style={{
                  boxShadow: searchQuery ? '0 0 8px rgba(0, 123, 255, 0.75)' : 'none',
                  borderColor: searchQuery ? '#007bff' : undefined,
                }}
              />
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
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default ExpenseList
