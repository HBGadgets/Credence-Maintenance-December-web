/* eslint-disable prettier/prettier */

import React, { useState, useMemo, useEffect } from 'react'
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
  CFormInput,
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
      trip.serviceRecords.reduce((sum, record) => sum + (record.cost || 0), 0),
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
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filtered data based on search query
  const filteredData = useMemo(() => {
    const search = searchQuery.toLowerCase().trim()
    return data.filter(
      (row) =>
        row.driver.toLowerCase().includes(search) || // Search by driver
        row.startDate.toLowerCase().includes(search) || // Search by start date
        row.endDate.toLowerCase().includes(search), // Search by end date
    )
  }, [searchQuery, data])

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // Handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleOpenModal = (record) => setModalState({ open: true, selectedRecord: record })
  const handleCloseModal = () => setModalState({ open: false, selectedRecord: null })

  const [modalState, setModalState] = useState({ open: false, selectedRecord: null })

  // useEffect(() => {
  //   setData([
  //     {
  //       driver: trip.driverId,
  //       startDate: trip.startDate,
  //       endDate: trip.endDate || 'Pending...',
  //       allocatedBudget: trip.allocatedBudget,
  //       spentBudget: totalSpent,
  //       remainingBudget,
  //       percentageSpent: spentPercentage.toFixed(1),
  //     },
  //   ])
  // }, [trip, totalSpent, remainingBudget, spentPercentage]) // Dependency array

  return (
    <>
      {/* Budget Table */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>{title}</strong>
              <CFormInput
                type="text"
                placeholder="Search..."
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
              {filteredData.length === 0 && (
                <div className="text-center text-muted">
                  No results found for &quot;{searchQuery}&quot;
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
