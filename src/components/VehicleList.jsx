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
  const columns = ['SN', 'Vehicle ID', 'Make', 'Year', 'Model', 'License Number', 'Action']
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [open, setOpen] = useState(false)
  const [filteredLogs, setFilteredLogs] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('') // Search state
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles) // Filtered list for display
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

  const handleViewClick = (vehicle) => {
    setSelectedVehicle(vehicle)
    setFilteredLogs(vehicle.maintenanceLogs) // Initialize with all logs
    setOpen(true)
  }

  const handleDateFilter = (startDate, endDate) => {
    if (!selectedVehicle) return
    const filtered = selectedVehicle.maintenanceLogs.filter((log) => {
      const serviceDate = new Date(log.serviceDate)
      return serviceDate >= new Date(startDate) && serviceDate <= new Date(endDate)
    })
    setFilteredLogs(filtered)
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
                        <CTableHeaderCell key={index} className="text-center">
                          {column}
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
