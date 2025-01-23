/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { vehicles } from '../views/vehicle/data/data'
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
  CFormInput,
} from '@coreui/react'

const VehicleProfile = React.lazy(() => import('./VehicleProfile'))
const Pagination = React.lazy(() => import('../views/base/paginations/Pagination'))

const VehicleList = () => {
  const columns = [
    { label: 'SN', key: 'sn', sortable: true },
    { label: 'Vehicle ID', key: 'id', sortable: true },
    { label: 'Make', key: 'make', sortable: true },
    { label: 'Year', key: 'year', sortable: true },
    { label: 'Model', key: 'model', sortable: true },
    { label: 'License Number', key: 'licenseNumber', sortable: true },
    { label: 'Action', key: 'action', sortable: false },
  ]
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [open, setOpen] = useState(false)
  const [filteredLogs, setFilteredLogs] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('') // Search state
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles) // Filtered list for display
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }) // Sorting configuration
  const itemsPerPage = 10

  useEffect(() => {
    // Filter vehicles whenever the search query changes
    const filtered = vehicles.filter((vehicle) => {
      const search = searchQuery.toLowerCase().trim()
      return (
        vehicle.id.toLowerCase().includes(search) || // Search by ID
        vehicle.make.toLowerCase().includes(search) || // Search by Make
        vehicle.model.toLowerCase().includes(search) || // Search by Model
        vehicle.year.toString().includes(search) || // Search by Year
        vehicle.licenseNumber.toLowerCase().includes(search) // Search by License Number
      )
    })
    setFilteredVehicles(filtered)
    setCurrentPage(1) // Reset to the first page when search query changes
  }, [searchQuery])

  const handleSort = (key) => {
    if (!columns.find((column) => column.key === key && column.sortable)) return // Prevent sorting on non-sortable columns

    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })

    const sorted = [...filteredVehicles].sort((a, b) => {
      if (['sn', 'id', 'model', 'licenseNumber', 'make', 'year'].includes(key)) {
        const aIndex = vehicles.indexOf(a)
        const bIndex = vehicles.indexOf(b)
        return direction === 'asc' ? aIndex - bIndex : bIndex - aIndex
      }

      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })

    setFilteredVehicles(sorted)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼'
    }
    return '↕'
  }

  const handleViewClick = (vehicle) => {
    setSelectedVehicle(vehicle)
    setFilteredLogs(vehicle.maintenanceLogs) // Initialize with all logs
    setOpen(true)
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = filteredVehicles.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Vehicles</strong>
              <CFormInput
                type="text"
                placeholder="Search vehicles..."
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
              {filteredVehicles.length === 0 ? (
                <p className="text-center">No vehicles found.</p>
              ) : (
                <CTable striped hover responsive bordered>
                  <CTableHead>
                    <CTableRow>
                      {columns.map((column, index) => (
                        <CTableHeaderCell
                          key={index}
                          className="text-center"
                          onClick={() => column.sortable && handleSort(column.key)}
                          style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                        >
                          {column.label} {column.sortable && getSortIcon(column.key)}
                        </CTableHeaderCell>
                      ))}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentData.map((row, rowIndex) => (
                      <CTableRow key={rowIndex}>
                        <CTableDataCell className="text-center">
                          {(currentPage - 1) * itemsPerPage + rowIndex + 1}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{row.id}</CTableDataCell>
                        <CTableDataCell className="text-center">{row.make}</CTableDataCell>
                        <CTableDataCell className="text-center">{row.year}</CTableDataCell>
                        <CTableDataCell className="text-center">{row.model}</CTableDataCell>
                        <CTableDataCell className="text-center">{row.licenseNumber}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton onClick={() => handleViewClick(row)} color="primary">
                            View
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {selectedVehicle && (
        <VehicleProfile
          open={open}
          setOpen={setOpen}
          onClose={() => setOpen(false)}
          vehicle={selectedVehicle}
        />
      )}

      {/* Pagination */}
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
  )
}

export default VehicleList
