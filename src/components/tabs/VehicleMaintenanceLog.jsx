/* eslint-disable prettier/prettier */
import React from 'react'
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
function VehicleMaintenanceLog({ logs }) {
  const columns = [
    'Service Date',
    'Mileage',
    'Work Performed',
    'Performed By',
    'Cost',
    'Invoice/Receipt',
    'Notes',
  ]
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Maintenance Log</strong>
            </CCardHeader>
            <CCardBody>
              {logs === 0 ? (
                <p className="text-center">No vehicles available.</p>
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
                        <CTableDataCell className="text-center">{row.invoiceUrl}</CTableDataCell>
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
      <div className="d-flex justify-content-end">
        <button className="btn btn-primary">View More</button>
      </div>
    </>
  )
}

export default VehicleMaintenanceLog
