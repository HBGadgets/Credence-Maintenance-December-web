/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { serviceRecords } from '../data' // Assuming data is imported here
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
import PropTypes from 'prop-types'

const VehicleLog = ({ vehicleId }) => {
  const [logs, setLogs] = useState([])
  const columns = [
    'Date',
    'Mileage at Service',
    'Service Type',
    'Cost (₹)',
    'Location',
    'Service Provider',
    'Receipt',
  ]

  useEffect(() => {
    if (vehicleId) {
      // Get current date and subtract 30 days
      const currentDate = new Date()
      const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30))

      // Filter service records based on vehicleId and date (only the last 30 days)
      const filteredLogs = serviceRecords.filter((record) => {
        const recordDate = new Date(record.date)
        return record.vehicleId === vehicleId && recordDate >= thirtyDaysAgo
      })

      setLogs(filteredLogs)
    }
  }, [vehicleId])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Logs</strong>
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
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <CTableRow key={log.id}>
                      <CTableDataCell className="text-center">{log.date}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {log.mileageAtService}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{log.serviceType}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        ₹{log.cost.toLocaleString()}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {log.location.address}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{log.serviceProvider}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <a href={log.receiptImage} target="_blank" rel="noopener noreferrer">
                          View Receipt
                        </a>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={6} className="text-center">
                      No service records found for this vehicle in the last 30 days.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

VehicleLog.propTypes = {
  vehicleId: PropTypes.string.isRequired,
}

export default VehicleLog
