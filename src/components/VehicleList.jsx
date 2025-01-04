/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
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
} from '@coreui/react'
const VehicleProfile = React.lazy(() => import('./VehicleProfile'))
const Pagination = React.lazy(() => import('../views/base/paginations/Pagination'))
const VehicleList = () => {
  const columns = ['Vehicle ID', 'Make', 'Year', 'Model', 'License Number', 'Action']
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [open, setOpen] = useState(false)
  const [filteredLogs, setFilteredLogs] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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
  const totalPages = Math.ceil(vehicles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = vehicles.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Vehicles</strong>
            </CCardHeader>
            <CCardBody>
              {vehicles.length === 0 ? (
                <p className="text-center">No vehicles available.</p>
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
            filteredLogs={filteredLogs}
          />
        </div>
      )}
    </>
  )
}

export default VehicleList
