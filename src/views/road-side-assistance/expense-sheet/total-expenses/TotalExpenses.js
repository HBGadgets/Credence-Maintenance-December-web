/* eslint-disable prettier/prettier */

import React, { useState } from 'react'
import Pagination from '../../../base/paginations/Pagination'
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
  CModalTitle,
} from '@coreui/react'
import { debounce } from 'lodash'
import { Plus } from 'lucide-react'
import VehicleLog from '../../vehicle-logs/VehicleLog'
import DriverProfile from '../../driver-profile/DriverProfile'

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

  return (
    <>
      {/* Filter */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filter by Driver or Vehicle"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      {/* Table */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{title}</strong>
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
