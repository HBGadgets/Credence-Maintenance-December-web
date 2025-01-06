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
} from '@coreui/react'
function TripAssignmentTable({ trip }) {
  const columns = ['Vehicle ID', 'Driver ID', 'Route', 'Start Date', 'Budget Alloted']
  return (
    <>
      <CRow className="mt-4">
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Assigned Trip</strong>
            </CCardHeader>
            <CCardBody>
              {trip.length === 0 ? (
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
                    {trip.map((row, rowIndex) => (
                      <CTableRow key={rowIndex}>
                        <CTableDataCell className="text-center">{row.vehicleId}</CTableDataCell>
                        <CTableDataCell className="text-center">{row.driverId}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {row.startLocation} &rarr; {row.endLocation}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{row.startDate}</CTableDataCell>
                        <CTableDataCell className="text-center">{row.budgetAlloted}</CTableDataCell>
                        <CTableDataCell className="text-center">{row.distance}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default TripAssignmentTable
