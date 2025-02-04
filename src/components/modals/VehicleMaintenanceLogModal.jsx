/* eslint-disable prettier/prettier */
import React, { useState,} from 'react'
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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CButton,
} from '@coreui/react'
const DateRangeFilter = React.lazy(() => import('../DateRangeFilter'))
import {vehicles} from '../../../src/views/vehicle/data/data'
import { useParams } from 'react-router-dom'


function VehicleMaintenanceLogModal({ }) {
  const {id} = useParams()
  const vehicle = vehicles.find((v) => v.id === id)
  const [viewDoc, setViewDoc] = useState(false)
  const [filteredLogs, setFilteredLogs] = useState(vehicle.maintenanceLogs)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const columns = [
    'Service Date',
    'Mileage',
    'Work Performed',
    'Performed By',
    'Cost',
    'Invoice/Receipt',
    'Notes',
  ]

  // Sorting function
  const handleSort = (key) => {
    if (key === 'Invoice/Receipt') return // Skip sorting for non-sortable column

    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })

    const sorted = [...filteredLogs].sort((a, b) => {
      let valueA = a[key]
      let valueB = b[key]

      // Parse dates for comparison
      if (key === 'serviceDate') {
        valueA = new Date(valueA)
        valueB = new Date(valueB)
      }

      // Ensure numbers are compared correctly
      if (key === 'mileage' || key === 'cost') {
        valueA = parseFloat(valueA)
        valueB = parseFloat(valueB)
      }

      // Handle sorting logic
      if (valueA < valueB) return direction === 'asc' ? -1 : 1
      if (valueA > valueB) return direction === 'asc' ? 1 : -1
      return 0
    })

    setFilteredLogs(sorted)
  }

  // Get the sort icon
  const getSortIcon = (key) => {
    if (key === 'Invoice/Receipt') return null // No sort icon for Invoice/Receipt column

    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼'
    }
    return '↕' // Default sort icon when no sorting is applied
  }

  const handleDateFilter = (startDate, endDate) => {
    if (!logs) return
    const filtered = logs.filter((log) => {
      const serviceDate = new Date(log.serviceDate)
      return serviceDate >= new Date(startDate) && serviceDate <= new Date(endDate)
    })
    setFilteredLogs(filtered)
  }

  const handleClearFilter = () => {
    setFilteredLogs(logs)
  }

  return (
    <>
      {/* <CModal
        alignment="center"
        scrollable
        visible={show}
        onClose={() => setShow(false)}
        fullscreen
        className="bg-light"
      >
        <CModalHeader closeButton />
        <CModalBody className="d-flex flex-column gap-3"> */}
          <div className="d-flex gap-3 align-items-end">
            <DateRangeFilter onFilter={handleDateFilter} />
            <button onClick={handleClearFilter} className="btn btn-secondary btn-sm">
              Clear Filter
            </button>
          </div>
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Maintenance Log</strong>
                </CCardHeader>
                <CCardBody>
                  {filteredLogs.length === 0 ? (
                    <p className="text-center">No logs match the filter criteria.</p>
                  ) : (
                    <CTable striped hover responsive bordered>
                      <CTableHead>
                        <CTableRow>
                          {columns.map((column, index) => (
                            <CTableHeaderCell
                              key={index}
                              className="text-center"
                              onClick={() => handleSort(column)}
                              style={{
                                cursor: column === 'Invoice/Receipt' ? 'default' : 'pointer',
                              }}
                            >
                              {column} {getSortIcon(column)}
                            </CTableHeaderCell>
                          ))}
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {filteredLogs.map((row, rowIndex) => (
                          <CTableRow key={rowIndex}>
                            <CTableDataCell className="text-center">
                              {row.serviceDate}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">{row.mileage}</CTableDataCell>
                            <CTableDataCell className="text-center">
                              {row.workPerformed}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              {row.performedBy}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">{row.cost}</CTableDataCell>
                            <CTableDataCell className="text-center">
                              <button className="btn btn-primary" onClick={() => setViewDoc(true)}>
                                View
                              </button>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">{row.notes}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        {/* </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShow(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        alignment="center"
        scrollable
        visible={viewDoc}
        onClose={() => setViewDoc(false)}
        size="md"
      >
        <CModalHeader closeButton />
        <CModalBody className="d-flex flex-column gap-3">receipt</CModalBody>
      </CModal> */}
    </>
  )
}

export default VehicleMaintenanceLogModal
