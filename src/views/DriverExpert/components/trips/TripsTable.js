import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import {
  CButton,
  CPagination,
  CPaginationItem,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CCardHeader,
  CCard,
} from '@coreui/react'
import DateRangeFilter from '../../common/DateRangeFilter'
import { Button } from '@mui/material'
import signature from '../../Signature/signature.svg'

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

const TripsTable = ({ trips }) => {
  const [open, setOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const itemsPerPage = 10 // Number of items per page in modal table

  const handleOpenModal = (image) => {
    setSelectedImage(image)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedImage('')
  }

  const handleOpen = () => {
    setCurrentPage(1) // Reset to the first page when opening modal
    setOpen(true)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to the first page after filtering
  }

  const handleApplyFilter = () => {
    setCurrentPage(1) // Reset to the first page after filtering
  }

  // Sort trips by date (descending) for the latest 5 entries
  const sortedTrips = [...trips].sort((a, b) => new Date(b.date) - new Date(a.date))
  const latestTrips = sortedTrips.slice(0, 5)

  // Filter trips based on search query and date range
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.tripStart.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.tripEnd.toLowerCase().includes(searchQuery.toLowerCase())

    if (!startDate || !endDate) return matchesSearch

    const date = new Date(trip.date)
    return date >= new Date(startDate) && date <= new Date(endDate) && matchesSearch
  })

  // Pagination logic for modal table
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentTrips = filteredTrips.slice(startIndex, startIndex + itemsPerPage)

  // Export to PDF function
  const exportToPDF = () => {
    try {
      if (!Array.isArray(filteredTrips) || filteredTrips.length === 0) {
        throw new Error('No data available for PDF export')
      }

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      // Add headers
      const headers = ['Date', 'Vehicle', 'Trip Start', 'Trip End', 'Log KM', 'GPS KM']

      // Add data rows
      const data = filteredTrips.map((trip, index) => [
        trip.date,
        trip.vehicleName,
        new Date(trip.tripStart).toLocaleString(),
        new Date(trip.tripEnd).toLocaleString(),
        `${trip.logKm} km`,
        `${trip.gpsKm} km`,
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
      const filename = `Trips_List_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(filename)
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('PDF Export Error:', error)
      toast.error(error.message || 'Failed to export PDF')
    }
  }

  // Export to Excel function
  const exportToExcel = () => {
    try {
      if (!Array.isArray(filteredTrips) || filteredTrips.length === 0) {
        throw new Error('No data available for Excel export')
      }

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Trips')

      // Add headers
      worksheet.addRow(['Date', 'Vehicle', 'Trip Start', 'Trip End', 'Log KM', 'GPS KM'])

      // Add data rows
      filteredTrips.forEach((trip) => {
        worksheet.addRow([
          trip.date,
          trip.vehicleName,
          new Date(trip.tripStart).toLocaleString(),
          new Date(trip.tripEnd).toLocaleString(),
          `${trip.logKm} km`,
          `${trip.gpsKm} km`,
        ])
      })

      // Save Excel file
      workbook.xlsx.writeBuffer().then((buffer) => {
        const filename = `Trips_List_${new Date().toISOString().split('T')[0]}.xlsx`
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

  // Table component for displaying trips
  const TripsContent = ({ data }) => {
    if (data.length === 0) {
      return (
        <div className="text-center my-4">
          <h5>No results found for "{searchQuery}"</h5>
        </div>
      )
    }

    return (
      <CTable hover responsive bordered striped>
        <CTableHead>
          <CTableRow className="text-center">
            <CTableHeaderCell>Date</CTableHeaderCell>
            <CTableHeaderCell>Vehicle</CTableHeaderCell>
            <CTableHeaderCell>Trip Start</CTableHeaderCell>
            <CTableHeaderCell>Trip End</CTableHeaderCell>
            <CTableHeaderCell>Log KM</CTableHeaderCell>
            <CTableHeaderCell>GPS KM</CTableHeaderCell>
            <CTableHeaderCell>Customer Signature</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody className="text-center">
          {data.map((trip) => (
            <CTableRow key={trip.id}>
              <CTableDataCell>{trip.date}</CTableDataCell>
              <CTableDataCell>{trip.vehicleName}</CTableDataCell>
              <CTableDataCell>{new Date(trip.tripStart).toLocaleString()}</CTableDataCell>
              <CTableDataCell>{new Date(trip.tripEnd).toLocaleString()}</CTableDataCell>
              <CTableDataCell>{trip.logKm} km</CTableDataCell>
              <CTableDataCell>
                <span
                  className={`badge ${
                    Math.abs(trip.logKm - trip.gpsKm) <= 5 ? 'bg-success' : 'bg-danger'
                  }`}
                >
                  {trip.gpsKm} km
                </span>
              </CTableDataCell>
              <CTableDataCell className="text-center">
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    padding: '6px 12px',
                    fontSize: '14px',
                  }}
                  onClick={() => handleOpenModal(signature)}
                >
                  View Sign
                </Button>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    )
  }

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Trip Details</strong>
        </CCardHeader>
        <div className="overflow-auto">
          <TripsContent data={latestTrips} />
        </div>
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-secondary m-1" onClick={handleOpen}>
            View More
          </button>
        </div>

        {/* Main Modal */}
        <CModal
          alignment="center"
          scrollable
          visible={open}
          onClose={() => setOpen(false)}
          fullscreen
        >
          <CModalHeader>
            <CModalTitle>All Trips Details</CModalTitle>
          </CModalHeader>

          <CModalBody className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <DateRangeFilter
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                />
                <CButton
                  className="bg-success text-white p-1 mt-3"
                  onClick={handleApplyFilter}
                  color="primary"
                >
                  Apply Filter
                </CButton>
              </div>

              <CFormInput
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  width: '200px',
                  boxShadow: searchQuery ? '0 0 8px rgba(0, 123, 255, 0.75)' : 'none',
                  borderColor: searchQuery ? '#007bff' : undefined,
                }}
              />
            </div>
            <TripsContent data={currentTrips} />

            {/* Pagination for modal table */}
            {totalPages > 1 && filteredTrips.length > itemsPerPage && (
              <CPagination align="center" className="mt-4">
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </CPaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <CPaginationItem
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            )}
          </CModalBody>
          <div className="ms-auto">
            <IconDropdown items={dropdownItems} />
          </div>
        </CModal>

        {/* Signature Modal */}
        <CModal alignment="center" visible={openModal} onClose={handleCloseModal}>
          <CModalHeader>
            <CModalTitle>Customer Signature</CModalTitle>
          </CModalHeader>
          <CModalBody className="d-flex justify-content-center">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Customer Signature"
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            )}
          </CModalBody>
        </CModal>
      </CCard>
    </div>
  )
}

export default TripsTable
