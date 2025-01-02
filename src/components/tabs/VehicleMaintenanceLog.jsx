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
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import VehicleMaintenanceLogModal from '../modals/VehicleMaintenanceLogModal'
function VehicleMaintenanceLog({ logs }) {
  const [showAllLogs, setShowAllLogs] = useState(false)
  const [viewDoc, setViewDoc] = useState(false)

  const columns = [
    'Service Date',
    'Mileage',
    'Work Performed',
    'Performed By',
    'Cost',
    'Invoice/Receipt',
    'Notes',
  ]

  const handleClickView = () => {
    setShowAllLogs(true)
  }

  const handleViewDoc = () => {
    setViewDoc(true)
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Maintenance Log</strong>
            </CCardHeader>
            <CCardBody>
              {logs.length === 0 ? (
                <p className="text-center">No Logs to show.</p>
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
                    {logs.slice(0, 3).map((row, rowIndex) => (
                      <CTableRow key={rowIndex}>
                        <CTableDataCell className="text-center">{row.serviceDate}</CTableDataCell>
                        <CTableDataCell className="text-center">{row.mileage}</CTableDataCell>
                        <CTableDataCell className="text-center">{row.workPerformed}</CTableDataCell>
                        <CTableDataCell className="text-center">{row.performedBy}</CTableDataCell>
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
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" onClick={handleClickView}>
                  View More
                </button>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

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

      <VehicleMaintenanceLogModal
        show={showAllLogs}
        setShow={setShowAllLogs}
        onClose={() => setShowAllLogs(false)}
        logs={logs}
        columns={columns}
      />
    </>
  )
}

export default VehicleMaintenanceLog
