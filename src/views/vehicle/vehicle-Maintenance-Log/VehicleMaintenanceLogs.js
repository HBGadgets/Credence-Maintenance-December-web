/* eslint-disable prettier/prettier */
import React from 'react'
import VehicleTable from './VehicleTable'
import { vehicles } from '../data'
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
const VehicleMaintenanceLogs = () => {
  const columns = []
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Vehicle Maintenance Log</strong>
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
                <VehicleTable vehicles={vehicles} />
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default VehicleMaintenanceLogs
