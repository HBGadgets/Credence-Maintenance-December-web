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

  // Sample trip data
  const sampleServiceRecords = [
    {
      id: '1',
      driverId: 'D1',
      vehicleId: 'V1',
      serviceType: 'Tire Puncture',
      cost: 500,
      date: '2024-03-10',
      location: {
        lat: 19.076,
        lng: 72.8777,
        address: 'Mumbai, Maharashtra',
      },
      serviceProvider: 'Quick Fix Garage',
      receiptImage: 'https://example.com/receipt1.jpg',
    },
    {
      id: '2',
      driverId: 'D1',
      vehicleId: 'V1',
      serviceType: 'Fuel Refill',
      cost: 2000,
      date: '2024-03-11',
      location: {
        lat: 18.5204,
        lng: 73.8567,
        address: 'Pune, Maharashtra',
      },
      serviceProvider: 'Highway Fuel Station',
      receiptImage: 'https://example.com/receipt2.jpg',
    },
  ]

  const sampleTrip = {
    id: 'T1',
    driverId: 'D1',
    vehicleId: 'V1',
    startLocation: 'Mumbai',
    endLocation: 'Bangalore',
    startDate: '2024-03-10',
    endDate: '2024-03-15',
    allocatedBudget: 10000,
    serviceRecords: sampleServiceRecords,
  }

  // Derived data
  const totalSpent = sampleTrip.serviceRecords.reduce((sum, record) => sum + record.cost, 0)
  const remainingBudget = sampleTrip.allocatedBudget - totalSpent
  const spentPercentage = (totalSpent / sampleTrip.allocatedBudget) * 100

  // Sample budget data
  const budgetData = [
    {
      driver: 'D1',
      startDate: sampleTrip.startDate,
      endDate: sampleTrip.endDate,
      allocatedBudget: sampleTrip.allocatedBudget,
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
    // Filter the data based on the "Driver" column (or any column you want)
    const filteredData = budgetData.filter((row) =>
      row.driver.toLowerCase().includes(e.target.value.toLowerCase()),
    )
    setData(filteredData)
    setCurrentPage(1) // reset the current page to 1 when the filter changes
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
                      <CTableDataCell className="text-center">{row.endDate}</CTableDataCell>
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </div>

      {/* Dialog box */}
      <CModal alignment="center" scrollable visible={open} onClose={() => handleClose()} fullscreen>
        <CModalHeader closeButton>
          <CModalTitle>Expenses details for {selectedDriver?.driver}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <ExpenseSheet record={sampleServiceRecords} onSelectRecord={setSelectedRecord} />
          <Budget trip={sampleTrip} />
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
