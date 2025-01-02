/* eslint-disable prettier/prettier */
import React from 'react'
import { useState } from 'react'
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
function VehicleMaintenanceLogModal({ show, setShow, logs, columns }) {
  const [viewDoc, setViewDoc] = useState(false)
  const [filteredLogs, setFilterdLogs] = useState(logs)

  const handleDateFilter = (startDate, endDate) => {
    if (!logs) return
    const filtered = logs.filter((log) => {
      const serviceDate = new Date(log.serviceDate)
      return serviceDate >= new Date(startDate) && serviceDate <= new Date(endDate)
    })
    setFilterdLogs(filtered)
  }

  const handleViewDoc = () => {
    setViewDoc(true)
  }

  const handleClearFilter = () => {
    setFilterdLogs(logs)
  }

  return (
    <>
      <CModal
        alignment="center"
        scrollable
        visible={show}
        onClose={() => setShow(false)}
        fullscreen
        className="bg-light"
      >
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
                  <strong>Maintenance Log</strong>
                </CCardHeader>
                <CCardBody>
                  {filteredLogs.length === 0 ? (
                    <p className="text-center">No logs match the filter criteria.</p>
                  ) : (
                    <CTable>
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
                              <button className="btn btn-primary" onClick={handleViewDoc}>
                                View
                              </button>
                              {/* {row.invoiceUrl} */}
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
        </CModalBody>
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
      </CModal>
    </>
  )
}
export default VehicleMaintenanceLogModal
