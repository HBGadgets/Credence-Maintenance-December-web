/* eslint-disable prettier/prettier */

import React, { useState } from 'react'
import Pagination from '../../../base/paginations/Pagination'
import { serviceRecords } from '../../data'
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
} from '@coreui/react'

const TotalExpenses = () => {
  const title = 'Total Expenses'
  const columns = [
    'Vehicle No.',
    'Driver',
    'Date',
    'Location',
    'Issue Type',
    'Cost (₹)',
    'Service Provider',
  ]

  const initialData = serviceRecords

  const [data, setData] = useState(initialData)
  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
    // Filter the data based on the "Driver" & "Vehicle" column
    const filteredData = initialData.filter(
      (row) =>
        row.driverId.toLowerCase().includes(e.target.value.toLowerCase()) ||
        row.vehicleId.toLowerCase().includes(e.target.value.toLowerCase()),
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

  const tableData = currentData.map((record) => ({
    vehicleNo: record.vehicleId,
    driver: record.driverId,
    date: record.date,
    location: record.location.address,
    serviceType: record.serviceType,
    cost: record.cost,
    serviceProvider: record.serviceProvider,
  }))

  const handleView = (row) => {
    console.log('Viewing record:', row)
    // Add logic to view detailed record
  }

  return (
    <>
      {/* Filter */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filter by Driver or Vehicle"
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
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableData.map((row, rowIndex) => (
                    <CTableRow key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <CTableDataCell key={cellIndex} className="text-center">
                          {cell}
                        </CTableDataCell>
                      ))}
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
          />
        )}
      </div>
    </>
  )
}

export default TotalExpenses
