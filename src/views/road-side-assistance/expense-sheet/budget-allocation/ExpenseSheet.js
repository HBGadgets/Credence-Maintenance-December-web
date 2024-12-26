/* eslint-disable prettier/prettier */
import React from 'react'
import { ServiceRecord } from '../../types/index'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
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
import './index.css'

const ExpenseSheet = ({ record, onSelectRecord }) => {
  const columns = ['Date', 'Service Type', 'Cost', 'Location', 'Service Provider']
  return (
    <>
      {/* Table */}
      <CRow className="d-flex justify-content-center">
        <CCol xs={10}>
          <CCard className="mb-4 shadow-sm">
            <CCardHeader>
              <strong>Total Expense Sheet</strong>
            </CCardHeader>
            <CCardBody>
              <CTable className="table-hover">
                <CTableHead>
                  <CTableRow>
                    {columns.map((column, index) => (
                      <CTableHeaderCell className="fs-6 text-center" key={index} scope="col">
                        {column}
                      </CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {record.map((record) => (
                    <CTableRow key={record.id} className="hover">
                      <CTableDataCell className="text-center">
                        {format(new Date(record.date), 'PP')}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{record.serviceType}</CTableDataCell>
                      <CTableDataCell className="text-center">₹{record.cost}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {record.location.address}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {record.serviceProvider}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

ExpenseSheet.propTypes = {
  record: ServiceRecord,
  onSelectRecord: PropTypes.func.isRequired,
}

export default ExpenseSheet
