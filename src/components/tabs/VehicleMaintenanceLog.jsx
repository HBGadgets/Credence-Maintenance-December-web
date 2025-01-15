/* eslint-disable prettier/prettier */
import React from 'react'
import { useState } from 'react'
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
  CModal,
  CModalBody,
  CModalHeader,
  CButton,
  CModalTitle,
  CModalFooter,
} from '@coreui/react'
import { Plus } from "lucide-react";
const VehicleMaintenanceLogModal = React.lazy(() => import('../modals/VehicleMaintenanceLogModal'))
function VehicleMaintenanceLog({ logs }) {
  const [showAllLogs, setShowAllLogs] = useState(false)
  const [viewDoc, setViewDoc] = useState(false)

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const handleIconClick = (row) => {
    setSelectedRow(row);
    setModalVisible(true);
  };

  const columns = [
    'Service Date',
    'Mileage',
    'Work Performed',
    'Performed By',
    'Cost',
    'Invoice/Receipt',
    'Notes',
  ]

  const handleClickView = () => {
    setShowAllLogs(true)
  }

  const handleViewDoc = () => {
    setViewDoc(true)
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Maintenance Log</strong>
            </CCardHeader>
            <CCardBody>
              {logs.length === 0 ? (
                <p className="text-center">No Logs to show.</p>
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
                    {logs.slice(0, 3).map((row, rowIndex) => (
                      <CTableRow key={rowIndex}>
                        <CTableDataCell className="text-center">{row.serviceDate}</CTableDataCell>
                        <CTableDataCell className="text-center">{row.mileage}</CTableDataCell>

                        {/*  */}
                        <CTableDataCell className="text-center">
                          {row.workPerformed}
                            <Plus size={16} 
                              className="ms-2 cursor-pointer"
                              onClick={() => handleIconClick(row)}
                            />
                          
                        </CTableDataCell>
                       
                        {/*  */}
                        <CTableDataCell className="text-center">{row.performedBy}</CTableDataCell>
                        <CTableDataCell className="text-center">{row.cost}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <button className="btn btn-primary" onClick={handleViewDoc}>
                            View
                          </button>
                          {/* {row.invoiceUrl} */}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{row.notes}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary" onClick={handleClickView}>
                  View More
                </button>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        alignment="center"
        scrollable
        visible={viewDoc}
        onClose={() => setViewDoc(false)}
        size="md"
      >
        <CModalHeader closeButton />
        <CModalBody className="d-flex flex-column gap-3">receipt</CModalBody>
      </CModal>

      <VehicleMaintenanceLogModal
        show={showAllLogs}
        setShow={setShowAllLogs}
        onClose={() => setShowAllLogs(false)}
        logs={logs}
        columns={columns}
      />

      
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Details for {selectedRow?.workPerformed}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <h5 className="text-primary">Service Information</h5>
            <CTable  bordered hover>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell className="fw-bold">Service Date</CTableDataCell>
                  <CTableDataCell>{selectedRow?.serviceDate || "N/A"}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="fw-bold">Mileage</CTableDataCell>
                  <CTableDataCell>{selectedRow?.mileage || "N/A"}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="fw-bold">Work Performed</CTableDataCell>
                  <CTableDataCell>{selectedRow?.workPerformed || "N/A"}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="fw-bold">Performed By</CTableDataCell>
                  <CTableDataCell>{selectedRow?.performedBy || "N/A"}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="fw-bold">Cost</CTableDataCell>
                  <CTableDataCell>{selectedRow?.cost || "N/A"}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="fw-bold">Notes</CTableDataCell>
                  <CTableDataCell>{selectedRow?.notes || "N/A"}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </div>
        </CModalBody>

</CModal>

    </>
  )
}

export default VehicleMaintenanceLog
