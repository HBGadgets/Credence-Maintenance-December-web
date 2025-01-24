/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
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

function TripAssignmentTable({ trip }) {
  const columns = [
    { label: 'Vehicle ID', key: 'vehicleId' },
    { label: 'Driver ID', key: 'driverId' },
    { label: 'Route', key: 'route' },
    { label: 'Start Date', key: 'startDate' },
    { label: 'Budget Alloted', key: 'budgetAlloted' },
    { label: 'Distance', key: 'distance' },
  ]

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [sortedData, setSortedData] = useState(trip)

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })

    const sorted = [...sortedData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })

    setSortedData(sorted)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼'
    }
    return '↕'
  }

  return (
    <CRow className="mt-4">
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Assigned Trip</strong>
          </CCardHeader>
          <CCardBody>
            {sortedData.length === 0 ? (
              <p className="text-center">No vehicles available.</p>
            ) : (
              <CTable striped hover responsive bordered>
                <CTableHead>
                  <CTableRow>
                    {columns.map((column, index) => (
                      <CTableHeaderCell
                        key={index}
                        className="text-center"
                        onClick={() => handleSort(column.key)}
                        style={{ cursor: 'pointer' }}
                      >
                        {column.label} {getSortIcon(column.key)}
                      </CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {sortedData.map((row, rowIndex) => (
                    <CTableRow key={rowIndex}>
                      <CTableDataCell className="text-center">{row.vehicleId}</CTableDataCell>
                      <CTableDataCell className="text-center">{row.driverId}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {row.startLocation} &rarr; {row.endLocation}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{row.startDate}</CTableDataCell>
                      <CTableDataCell className="text-center">{row.budgetAlloted}</CTableDataCell>
                      <CTableDataCell className="text-center">{row.distance}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default TripAssignmentTable
