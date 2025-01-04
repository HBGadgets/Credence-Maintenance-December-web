/* eslint-disable prettier/prettier */

import React, { useState, useEffect, useMemo } from 'react'
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
const Pagination = React.lazy(() => import('../../../base/paginations/Pagination'))
const ExpenseSheet = React.lazy(() => import('./ExpenseSheet'))
const Budget = React.lazy(() => import('./Budget'))
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

  // Memoized calculations for budget
  const { totalSpent, remainingBudget, spentPercentage } = useMemo(() => {
    const totalSpent = Math.min(
      trip.serviceRecords.reduce((sum, record) => sum + record.cost, 0),
      trip.allocatedBudget,
    )
    const remainingBudget = Math.max(trip.allocatedBudget - totalSpent, 0)
    const spentPercentage = trip.allocatedBudget > 0 ? (totalSpent / trip.allocatedBudget) * 100 : 0

    return { totalSpent, remainingBudget, spentPercentage }
  }, [trip])

  // State management
  const [data, setData] = useState([
    {
      driver: trip.driverId,
      startDate: trip.startDate,
      endDate: trip.endDate || 'Pending...',
      allocatedBudget: trip.allocatedBudget,
      spentBudget: totalSpent,
      remainingBudget,
      percentageSpent: spentPercentage.toFixed(1),
    },
  ])
  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalState, setModalState] = useState({ open: false, selectedRecord: null })
  const itemsPerPage = 10

  // Update data when memoized values change
  useEffect(() => {
    setData([
      {
        driver: trip.driverId,
        startDate: trip.startDate,
        endDate: trip.endDate || 'Pending...',
        allocatedBudget: trip.allocatedBudget,
        spentBudget: totalSpent,
        remainingBudget,
        percentageSpent: spentPercentage.toFixed(1),
      },
    ])
  }, [trip, totalSpent, remainingBudget, spentPercentage]) // This is a dependency array

  // Handlers
  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase().trim()
    setFilter(value)
    setData((prevData) => prevData.filter((row) => row.driver.toLowerCase().includes(value)))
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage(page)
    }
  }

  const handleOpenModal = (record) => setModalState({ open: true, selectedRecord: record })
  const handleCloseModal = () => setModalState({ open: false, selectedRecord: null })

  // Pagination calculation
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <>
      {/* Filter Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filter by Driver"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      {/* Budget Table */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{title}</strong>
            </CCardHeader>
            <CCardBody>
              <CTable striped hover responsive bordered>
                <CTableHead>
                  <CTableRow>
                    {columns.map((column, index) => (
                      <CTableHeaderCell key={index} className="text-center">
                        {column}
                      </CTableHeaderCell>
                    ))}
                    <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentData.map((row, index) => (
                    <CTableRow key={index}>
                      {Object.values(row)
                        .slice(0, 7)
                        .map((value, idx) => (
                          <CTableDataCell key={idx} className="text-center">
                            {value}
                          </CTableDataCell>
                        ))}
                      <CTableDataCell className="text-center">
                        <CButton color="primary" onClick={() => handleOpenModal(row)}>
                          View
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
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
      {totalPages > 1 && (
        <div className="d-flex justify-content-center">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            disablePrev={currentPage === 1}
            disableNext={currentPage === totalPages}
          />
        </div>
      )}

      {/* Modal */}
      <CModal
        alignment="center"
        scrollable
        visible={modalState.open}
        onClose={handleCloseModal}
        fullscreen
      >
        <CModalHeader closeButton>
          <CModalTitle>Expenses Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <ExpenseSheet record={serviceRecords} />
          <Budget trip={trip} />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default BudgetAllocation
