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
import {vehicles} from '../../views/vehicle/data/data'
import { useParams } from 'react-router-dom'
import Pagination from "../../views/base/paginations/Pagination"
import DateRangeFilterCredence from "../DateRangeFilterCredence"


function VehicleMaintenanceLogModal({ }) {
  const {id} = useParams()
  const vehicle = vehicles.find((v) => v.id === "V001")
  const [viewDoc, setViewDoc] = useState(false)
  const [logs, setLogs] = useState(vehicle.maintenanceLogs)
  const [filteredLogs, setFilteredLogs] = useState(vehicle.maintenanceLogs)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

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

  // Pagination logic
    const [itemsPerPage, setItemsPerPage] = useState(10); 
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentItems  = filteredLogs.slice(startIndex, startIndex + itemsPerPage)
    const handlePageChange = (page) => {
      setCurrentPage(page)
    }
    const handleItemsPerPageChange = (newItemsPerPage) => {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);  // Reset to first page when changing items per page
    };

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
    setFilteredLogs(vehicle.maintenanceLogs)
  }
  const handleDateRangeChange = (startDate, endDate) => {
    console.log('Date range changed:', { startDate, endDate })
    setStartDate(startDate)
    setEndDate(endDate)
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
          <DateRangeFilterCredence 
            onDateRangeChange={handleDateRangeChange}
            title="Date Filter"
          />
          <CRow className='mt-3'>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Maintenance Log</strong>
                </CCardHeader>
                <CCardBody>
                  {currentItems.length === 0 ? (
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
                        {currentItems.map((row, rowIndex) => (
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
        
          <div className="d-flex justify-content-center">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              handleItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
    </>
  )
}

export default VehicleMaintenanceLogModal
