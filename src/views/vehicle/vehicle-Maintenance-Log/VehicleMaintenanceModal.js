/* eslint-disable prettier/prettier */
import React from 'react'
import {
  CCard,
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
import PropTypes from 'prop-types'
import DateRangeFilter from './DateRangeFilter'

const VehicleMaintenanceModal = ({
  selectedVehicle,
  handleDateFilter,
  open,
  setOpen,
  filteredLogs,
}) => {
  return (
    <CModal alignment="center" scrollable visible={open} onClose={() => setOpen(false)} fullscreen>
      <CModalHeader closeButton>
        <CModalTitle>
          Expenses Details for {selectedVehicle.make} {selectedVehicle.model}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="d-flex flex-column gap-4">
        <div>
          <DateRangeFilter onFilter={handleDateFilter} />
        </div>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Vehicle Maintenance Log</strong>
              </CCardHeader>
              {filteredLogs.length === 0 ? (
                <p className="text-center">No logs found for the selected date range.</p>
              ) : (
                <CTable className="rounded">
                  <CTableHead>
                    <CTableRow scope="col">
                      <CTableHeaderCell className="text-center">Service Date</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Mileage</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Work Performed</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Performed By</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Cost</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Invoice/Receipt</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Notes</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredLogs.map((log, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell className="text-center">{log.serviceDate}</CTableDataCell>
                        <CTableDataCell className="text-center">{log.mileage}</CTableDataCell>
                        <CTableDataCell className="text-center">{log.workPerformed}</CTableDataCell>
                        <CTableDataCell className="text-center">{log.performedBy}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {log.cost.toFixed(2)}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {log.invoiceUrl && (
                            <a href={log.invoiceUrl} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          )}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{log.notes}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCard>
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setOpen(false)}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

VehicleMaintenanceModal.propTypes = {
  selectedVehicle: PropTypes.shape({
    id: PropTypes.number.isRequired,
    make: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    maintenanceLogs: PropTypes.arrayOf(
      PropTypes.shape({
        serviceDate: PropTypes.string.isRequired,
        mileage: PropTypes.number.isRequired,
        workPerformed: PropTypes.string.isRequired,
        performedBy: PropTypes.string,
        cost: PropTypes.number.isRequired,
        invoiceUrl: PropTypes.string,
        notes: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
  filteredLogs: PropTypes.arrayOf(
    PropTypes.shape({
      serviceDate: PropTypes.string.isRequired,
      mileage: PropTypes.number.isRequired,
      workPerformed: PropTypes.string.isRequired,
      performedBy: PropTypes.string,
      cost: PropTypes.number.isRequired,
      invoiceUrl: PropTypes.string,
      notes: PropTypes.string,
    }),
  ).isRequired,
  handleDateFilter: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default VehicleMaintenanceModal
