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
  CModal,
  CModalBody,
  CModalHeader,
  CButton,
  CModalTitle,
  CModalFooter,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import IconDropdown from '../IconDropdown'

import { FaRegFilePdf } from 'react-icons/fa'
import { Plus } from 'lucide-react'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import { FaPrint } from 'react-icons/fa'
import { FaArrowUp } from 'react-icons/fa'

import { toast } from 'react-toastify'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const VehicleMaintenanceLogModal = React.lazy(() => import('../modals/VehicleMaintenanceLogModal'))

function VehicleMaintenanceLog({ logs }) {
  const [showAllLogs, setShowAllLogs] = useState(false)
  const [viewDoc, setViewDoc] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  const handleIconClick = (row) => {
    setSelectedRow(row)
    setModalVisible(true)
  }

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

  // Export to Excel
  const exportToExcel = async () => {
    try {
      if (!Array.isArray(logs) || logs.length === 0) {
        throw new Error('No data available for Excel export')
      }

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Maintenance Log')

      // Add headers
      worksheet.addRow(columns)

      // Add data rows
      logs.forEach((log, index) => {
        worksheet.addRow([
          log.serviceDate || '--',
          log.mileage || '--',
          log.workPerformed || '--',
          log.performedBy || '--',
          log.cost || '--',
          log.invoiceUrl || '--',
          log.notes || '--',
        ])
      })

      // Generate and save file
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const filename = `Maintenance_Log_${new Date().toISOString().split('T')[0]}.xlsx`
      saveAs(blob, filename)
      toast.success('Excel file downloaded successfully')
    } catch (error) {
      console.error('Excel Export Error:', error)
      toast.error(error.message || 'Failed to export Excel file')
    }
  }

  // Export to PDF
  const exportToPDF = () => {
    try {
      if (!Array.isArray(logs) || logs.length === 0) {
        throw new Error('No data available for PDF export')
      }

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      // Add headers
      const headers = columns

      // Add data rows
      const data = logs.map((log) => [
        log.serviceDate || '--',
        log.mileage || '--',
        log.workPerformed || '--',
        log.performedBy || '--',
        log.cost || '--',
        log.invoiceUrl || '--',
        log.notes || '--',
      ])

      // Generate table
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 20,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [10, 45, 99], textColor: 255, fontStyle: 'bold' },
      })

      // Save PDF
      const filename = `Maintenance_Log_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(filename)
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('PDF Export Error:', error)
      toast.error(error.message || 'Failed to export PDF')
    }
  }

  // Dropdown items for export
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () => exportToPDF(),
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () => exportToExcel(),
    },
    {
      icon: FaPrint,
      label: 'Print Page',
      onClick: () => window.print(),
    },
    {
      icon: HiOutlineLogout,
      label: 'Logout',
      onClick: () => handleLogout(),
    },
    {
      icon: FaArrowUp,
      label: 'Scroll To Top',
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
  ]

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
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
                        <CTableDataCell className="text-center">
                          {row.workPerformed}
                          <Plus
                            size={16}
                            className="ms-2 cursor-pointer"
                            onClick={() => handleIconClick(row)}
                          />
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{row.performedBy}</CTableDataCell>
                        <CTableDataCell className="text-center">{row.cost}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <button className="btn btn-primary" onClick={handleViewDoc}>
                            View
                          </button>
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
            <CTable bordered hover>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell className="fw-bold">Service Date</CTableDataCell>
                  <CTableDataCell>{selectedRow?.serviceDate || 'N/A'}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="fw-bold">Mileage</CTableDataCell>
                  <CTableDataCell>{selectedRow?.mileage || 'N/A'}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="fw-bold">Work Performed</CTableDataCell>
                  <CTableDataCell>{selectedRow?.workPerformed || 'N/A'}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="fw-bold">Performed By</CTableDataCell>
                  <CTableDataCell>{selectedRow?.performedBy || 'N/A'}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="fw-bold">Cost</CTableDataCell>
                  <CTableDataCell>{selectedRow?.cost || 'N/A'}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="fw-bold">Notes</CTableDataCell>
                  <CTableDataCell>{selectedRow?.notes || 'N/A'}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </div>
          <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
            <IconDropdown items={dropdownItems} />
          </div>
        </CModalBody>
      </CModal>
      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default VehicleMaintenanceLog
