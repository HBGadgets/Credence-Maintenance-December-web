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
} from '@coreui/react'
import './index.css'

const ExpenseSheet = ({ record, onSelectRecord, onFlyToLocation }) => {
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
              <CTable striped hover responsive bordered>
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
                      <CTableDataCell className="text-center"></CTableDataCell>
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
  onFlyToLocation: PropTypes.func.isRequired,
}

export default ExpenseSheet
