/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
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

function VehicleDocuments({ document }) {
  const [open, setOpen] = useState(false)
  const columns = ['Document Name', 'Type', 'Action']

  const handleViewClick = (row) => {
    setOpen(true)
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Documents</strong>
            </CCardHeader>
            <CCardBody>
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
                  {document.map((row, rowIndex) => (
                    <CTableRow key={rowIndex}>
                      <CTableDataCell className="text-center">{row.name}</CTableDataCell>
                      <CTableDataCell className="text-center">{row.type}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton onClick={() => handleViewClick(row)} color="primary">
                          View
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal alignment="center" scrollable visible={open} onClose={() => setOpen(false)} size="lg">
        <CModalHeader closeButton />
        <CModalBody className="d-flex flex-column gap-3">Vehicle document</CModalBody>
      </CModal>
    </>
  )
}

export default VehicleDocuments
