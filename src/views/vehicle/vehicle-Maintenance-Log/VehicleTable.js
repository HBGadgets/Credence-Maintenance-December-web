/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import Pagination from '../../base/paginations/Pagination'
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
import PropTypes from 'prop-types'
import DateRangeFilter from './DateRangeFilter'

const VehicleTable = ({ vehicles }) => {
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
      {/** TABLE */}
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

      {/** DIALOG BOX */}
      {selectedVehicle && (
        <CModal
          alignment="center"
          scrollable
          visible={open}
          onClose={() => setOpen(false)}
          fullscreen
        >
          <CModalHeader closeButton>
            <CModalTitle>
              Expenses Details for {selectedVehicle.make} {selectedVehicle.model}
            </CModalTitle>
          </CModalHeader>
          <CModalBody className="d-flex flex-column gap-4">
            <div>
              <DateRangeFilter onFilter={handleDateFilter} />
            </div>
            <CRow>
              <CCol xs={12}>
                <CCard className="mb-4">
                  <CCardHeader>
                    <strong>Vehicle Maintenance Log</strong>
                  </CCardHeader>
                  {filteredLogs.length === 0 ? (
                    <p className="text-center">No logs found for the selected date range.</p>
                  ) : (
                    <CTable className="rounded">
                      <CTableHead>
                        <CTableRow scope="col">
                          <CTableHeaderCell className="text-center">Service Date</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Mileage</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">
                            Work Performed
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Performed By</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Cost</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">
                            Invoice/Receipt
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Notes</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {filteredLogs.map((log, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell className="text-center">
                              {log.serviceDate}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">{log.mileage}</CTableDataCell>
                            <CTableDataCell className="text-center">
                              {log.workPerformed}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              {log.performedBy}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              {log.cost.toFixed(2)}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              {log.invoiceUrl && (
                                <a href={log.invoiceUrl} target="_blank" rel="noopener noreferrer">
                                  View
                                </a>
                              )}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">{log.notes}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  )}
                </CCard>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setOpen(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      )}

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

VehicleTable.propTypes = {
  vehicles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      make: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      model: PropTypes.string.isRequired,
      licenseNumber: PropTypes.string.isRequired,
      maintenanceLogs: PropTypes.arrayOf(
        PropTypes.shape({
          serviceDate: PropTypes.string.isRequired,
          mileage: PropTypes.number.isRequired,
          workPerformed: PropTypes.string.isRequired,
          performedBy: PropTypes.string,
          cost: PropTypes.number.isRequired,
          invoiceUrl: PropTypes.string,
          notes: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
}

export default VehicleTable
