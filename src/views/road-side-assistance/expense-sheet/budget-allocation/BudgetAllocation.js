/* eslint-disable prettier/prettier */

import React, { useState } from 'react'
import Pagination from '../../../base/paginations/Pagination'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import ExpenseSheet from './ExpenseSheet'
import Budget from './Budget'
import { serviceRecords, trip } from '../../data'

const BudgetAllocation = () => {
  const title = 'Budget Allocation'
  const columns = [
    'Driver',
    'Start Date',
    'End Date',
    'Allocated Budget (₹)',
    'Spent Budget (₹)',
    'Remaining Budget (₹)',
    'Percentage Spent (%)',
  ]

  // Calculate budget details for the trip
  const totalSpent = Math.min(
    trip.serviceRecords.reduce((sum, record) => sum + record.cost, 0),
    trip.allocatedBudget,
  )
  const remainingBudget = Math.max(trip.allocatedBudget - totalSpent, 0)
  const spentPercentage = trip.allocatedBudget > 0 ? (totalSpent / trip.allocatedBudget) * 100 : 0

  const budgetData = [
    {
      driver: trip.driverId,
      startDate: trip.startDate,
      endDate: trip.endDate,
      allocatedBudget: trip.allocatedBudget,
      spentBudget: totalSpent,
      remainingBudget: remainingBudget,
      percentageSpent: spentPercentage.toFixed(1),
    },
  ]

  const [data, setData] = useState(budgetData)
  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const itemsPerPage = 10
  const [selectedRecord, setSelectedRecord] = useState(null)

  const handleClickOpen = (driver) => {
    setSelectedDriver(driver)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedDriver(null)
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
    // Filter the data based on the "Driver" column
    const filteredData = budgetData.filter((row) =>
      row.driver.toLowerCase().includes(e.target.value.toLowerCase()),
    )
    setData(filteredData)
    setCurrentPage(1) // Reset the current page to 1 when the filter changes
  }

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = data.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <>
      {/* Filter */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filter by Driver"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      {/* Table */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{title}</strong>
            </CCardHeader>
            <CCardBody>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    {columns.map((column, index) => (
                      <CTableHeaderCell key={index} className="text-center" scope="col">
                        {column}
                      </CTableHeaderCell>
                    ))}
                    <CTableHeaderCell className="text-center" scope="col">
                      Actions
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentData.map((row, rowIndex) => (
                    <CTableRow key={rowIndex}>
                      <CTableDataCell className="text-center">{row.driver}</CTableDataCell>
                      <CTableDataCell className="text-center">{row.startDate}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {row.endDate ? row.endDate : 'Pending...'}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{row.allocatedBudget}</CTableDataCell>
                      <CTableDataCell className="text-center">{row.spentBudget}</CTableDataCell>
                      <CTableDataCell className="text-center">{row.remainingBudget}</CTableDataCell>
                      <CTableDataCell className="text-center">{row.percentageSpent}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton onClick={() => handleClickOpen(row)} color="primary">
                          View
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              {/* No results message */}
              {data.length === 0 && (
                <div className="text-center text-muted">
                  No results found for &quot;{filter}&quot;
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        {totalPages >= 2 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            disablePrev={currentPage === 1}
            disableNext={currentPage === totalPages}
          />
        )}
      </div>

      {/* Dialog box */}
      <CModal alignment="center" scrollable visible={open} onClose={() => handleClose()} fullscreen>
        <CModalHeader closeButton>
          <CModalTitle>Expenses details for {selectedDriver?.driver}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Expense Sheet */}
          <ExpenseSheet record={serviceRecords} onSelectRecord={setSelectedRecord} />

          {/* Trip Budget */}
          <Budget trip={trip} />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setOpen(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default BudgetAllocation
