/* eslint-disable prettier/prettier */

import React, { useState } from 'react'
import { serviceRecords } from '../../data'
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
  CFormInput,
  CModalTitle,
} from '@coreui/react'
import { debounce } from 'lodash'
import { Plus } from 'lucide-react'
import IconDropdown from '../../IconDropdown'
import { FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import { FaPrint } from 'react-icons/fa'
import { FaArrowUp } from 'react-icons/fa'
import { toast } from 'react-toastify'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const Pagination = React.lazy(() => import('../../../base/paginations/Pagination'))
const VehicleLog = React.lazy(() => import('../../vehicle-logs/VehicleLog'))
const DriverProfile = React.lazy(() => import('../../driver-profile/DriverProfile'))

const TotalExpenses = () => {
  const title = 'Total Expenses'
  const columns = [
    'Vehicle No.',
    'Driver',
    'Date',
    'Location',
    'Issue Type',
    'Cost (₹)',
    'Service Provider',
  ]
  const initialData = serviceRecords
  const [openDriverModal, setOpenDriverModal] = useState(false)
  const [openVehicleModal, setOpenVehicleModal] = useState(false)
  const [data, setData] = useState(initialData)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredData, setFilteredData] = useState('') // Search state

  const itemsPerPage = 10

  // Logic for Filter
  const debouncedFilterChange = debounce((value) => {
    const filteredData = initialData.filter(
      (row) =>
        row.driverId.toLowerCase().includes(value.toLowerCase()) ||
        row.vehicleId.toLowerCase().includes(value.toLowerCase()),
    )
    setData(filteredData)
    setCurrentPage(1)
  }, 300)

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
    debouncedFilterChange(e.target.value)
  }

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = data.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // table data
  const tableData = currentData.map((record) => ({
    vehicleNo: (
      <div className="d-flex align-items-center justify-content-center">
        {record.vehicleId}
        <Plus
          className="ms-2 cursor-pointer"
          onClick={() => handleClickOpenVehicle(record.vehicleId)}
          size={16}
          type="button"
        />
      </div>
    ),
    driver: (
      <div className="d-flex align-items-center justify-content-center">
        {record.driverId}
        <Plus
          className="ms-2 cursor-pointer"
          onClick={() => handleClickOpenDriver(record.driverId)}
          size={16}
          type="button"
        />
      </div>
    ),
    date: record.date,
    location: record.location.address,
    serviceType: record.serviceType,
    cost: `₹${record.cost.toLocaleString()}`,
    serviceProvider: record.serviceProvider,
  }))

  const handleClickOpenDriver = (driver) => {
    setSelectedDriver(driver)
    setOpenDriverModal(true)
  }

  const handleClickOpenVehicle = (vehicle) => {
    setSelectedVehicle(vehicle)
    setOpenVehicleModal(true)
  }

  const handleCloseDriverModal = () => setOpenDriverModal(false)
  const handleCloseVehicleModal = () => setOpenVehicleModal(false)

  const exportToExcel = () => {
    try {
      if (!Array.isArray(invoices) || invoices.length === 0) {
        throw new Error('No data available for Excel export')
      }

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Invoices')

      // Add headers
      worksheet.addRow(columns.map((column) => column.label))

      // Add data rows
      invoices.forEach((invoice) => {
        worksheet.addRow(
          columns.map((column) => {
            if (column.key === 'date' || column.key === 'paymentDueDate') {
              return new Date(invoice[column.key]).toLocaleDateString()
            }
            return invoice[column.key]?.toString() || ''
          }),
        )
      })

      // Save Excel file
      workbook.xlsx.writeBuffer().then((buffer) => {
        const filename = `Invoices_List_${new Date().toISOString().split('T')[0]}.xlsx`
        saveAs(new Blob([buffer]), filename)
        toast.success('Excel file downloaded successfully')
      })
    } catch (error) {
      console.error('Excel Export Error:', error)
      toast.error(error.message || 'Failed to export Excel')
    }
  }

  // Handle logout function
  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked')
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
      {/* Table */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>{title}</strong>
              <CFormInput
                type="text"
                placeholder="Search vehicles..."
                value={filteredData}
                onChange={(e) => setFilteredData(e.target.value)}
                className="w-25"
                style={{
                  boxShadow: filteredData ? '0 0 8px rgba(0, 123, 255, 0.75)' : 'none',
                  borderColor: filteredData ? '#007bff' : undefined,
                }}
              />
            </CCardHeader>
            <CCardBody>
              <CTable striped hover responsive bordered>
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
                  {tableData.map((row, rowIndex) => (
                    <CTableRow key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <CTableDataCell key={cellIndex} className="text-center">
                          {cell}
                        </CTableDataCell>
                      ))}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              {/* No results message */}
              {data.length === 0 && (
                <div className="text-center text-muted">
                  No results found for &quot;{filter}&quot;
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/**DIALOG BOXES */}

      {/* Dialog box for drivers */}
      <CModal
        alignment="center"
        scrollable
        visible={openDriverModal}
        onClose={handleCloseDriverModal}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>Driver Information</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <DriverProfile driverId={selectedDriver} />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseDriverModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Dialog box for vehicles */}
      <CModal
        alignment="center"
        scrollable
        visible={openVehicleModal}
        onClose={handleCloseVehicleModal}
        fullscreen
      >
        <CModalHeader closeButton>
          <CModalTitle>30 days logs for Vehicle: {selectedVehicle}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <VehicleLog vehicleId={selectedVehicle} />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseVehicleModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      <div className="ms-right">
        <IconDropdown items={dropdownItems} />
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        {totalPages >= 2 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    </>
  )
}

export default TotalExpenses
