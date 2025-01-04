/* eslint-disable prettier/prettier */
import React, { memo } from 'react'
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

const ExpenseSheet = memo(function ExpenseSheet({ record, onSelectRecord, onFlyToLocation }) {
  const columns = ['Date', 'Service Type', 'Cost', 'Location', 'Service Provider']

  return (
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
                    <CTableHeaderCell key={index} className="fs-6 text-center">
                      {column}
                    </CTableHeaderCell>
                  ))}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {record.map(({ id, date, serviceType, cost, location, serviceProvider }) => (
                  <CTableRow key={id} className="hover">
                    <CTableDataCell className="text-center">
                      {format(new Date(date), 'PP')}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">{serviceType}</CTableDataCell>
                    <CTableDataCell className="text-center">₹{cost}</CTableDataCell>
                    <CTableDataCell
                      className="text-center text-primary cursor-pointer"
                      onClick={() => onFlyToLocation(location)}
                    >
                      {location.address}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">{serviceProvider}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
})

ExpenseSheet.propTypes = {
  record: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      serviceType: PropTypes.string.isRequired,
      cost: PropTypes.number.isRequired,
      location: PropTypes.shape({
        address: PropTypes.string.isRequired,
      }).isRequired,
      serviceProvider: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onSelectRecord: PropTypes.func.isRequired,
  onFlyToLocation: PropTypes.func.isRequired,
}

export default ExpenseSheet
