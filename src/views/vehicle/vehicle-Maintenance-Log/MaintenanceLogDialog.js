/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Vehicle } from '../types'
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

const MaintenanceLogDialog = ({ isOpen, onClose, vehicle }) => {
  const [filteredLogs, setFilteredLogs] = useState(vehicle.maintenanceLogs)

  const handleDateFilter = (startDate, endDate) => {
    const filtered = vehicle.maintenanceLogs.filter((log) => {
      const serviceDate = new Date(log.serviceDate)
      return serviceDate >= startDate && serviceDate <= endDate
    })
    setFilteredLogs(filtered)
  }

  if (!isOpen) return null

  return <></>
}

MaintenanceLogDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  vehicle: Vehicle,
}
export default MaintenanceLogDialog
