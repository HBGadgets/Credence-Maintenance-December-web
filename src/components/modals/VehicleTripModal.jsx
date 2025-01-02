/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
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
  CModalHeader,
} from '@coreui/react'
import DateRangeFilter from '../DateRangeFilter'

function VehicleTripModal({ trip = [], setOpen, open, columns = [] }) {
  const [filteredLogs, setFilteredLogs] = useState(trip)

  const handleDateFilter = (startDate, endDate) => {
    if (!trip.length) return

    const filtered = trip.filter((t) => {
      const tripDate = new Date(t.startDate)
      return tripDate >= new Date(startDate) && tripDate <= new Date(endDate)
    })
    setFilteredLogs(filtered)
  }

  const handleClearFilter = () => {
    setFilteredLogs(trip)
  }

  return (
    <CModal alignment="center" scrollable visible={open} onClose={() => setOpen(false)} fullscreen>
      <CModalHeader closeButton />
      <CModalBody className="d-flex flex-column gap-3">
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
                <strong>Trips</strong>
              </CCardHeader>
              <CCardBody>
                {filteredLogs.length === 0 ? (
                  <p className="text-center">No trips match the filter criteria.</p>
                ) : (
                  <div className="table-responsive">
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
                        {filteredLogs.map((row, rowIndex) => (
                          <CTableRow key={rowIndex}>
                            <CTableDataCell className="text-center">{row.driver}</CTableDataCell>
                            <CTableDataCell className="text-center">
                              {row.startLocation} &rarr; {row.endLocation}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">{row.distance}</CTableDataCell>
                            <CTableDataCell className="text-center">{row.startDate}</CTableDataCell>
                            <CTableDataCell className="text-center">{row.endDate}</CTableDataCell>
                            <CTableDataCell className="text-center">{row.duration}</CTableDataCell>
                            <CTableDataCell className="text-center">{row.totalCost}</CTableDataCell>
                            <CTableDataCell className="text-center">{row.status}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CModalBody>
    </CModal>
  )
}

VehicleTripModal.propTypes = {
  trip: PropTypes.arrayOf(
    PropTypes.shape({
      driver: PropTypes.string,
      startLocation: PropTypes.string,
      endLocation: PropTypes.string,
      distance: PropTypes.number,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      duration: PropTypes.string,
      totalCost: PropTypes.number,
      status: PropTypes.string,
    }),
  ),
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string),
}

export default VehicleTripModal
