import React, { useState } from 'react'
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CCardHeader,
  CCard,
  CFormInput,
} from '@coreui/react'
import DateRangeFilter from '../../common/DateRangeFilter'
import { Button } from '@mui/material'
import signature from '../../Signature/signature.svg'
import { toast } from 'react-toastify'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const TripsTable = ({ trips }) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleApplyFilter = () => {
    // Logic to apply date range filter
  }

  // Sort trips by date (descending) for the latest 5 entries
  const sortedTrips = [...trips].sort((a, b) => new Date(b.date) - new Date(a.date))
  const latestTrips = sortedTrips.slice(0, 5)

  // Filter trips based on search query and date range
  const filteredTrips = latestTrips.filter((trip) => {
    const matchesSearch =
      trip.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.tripStart.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.tripEnd.toLowerCase().includes(searchQuery.toLowerCase())

    if (!startDate || !endDate) return matchesSearch

    const date = new Date(trip.date)
    return date >= new Date(startDate) && date <= new Date(endDate) && matchesSearch
  })

  // Export to PDF function
  const exportToPDF = () => {
    try {
      if (!filteredTrips.length) throw new Error('No data available for PDF export')

      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const headers = ['Date', 'Vehicle', 'Trip Start', 'Trip End', 'Log KM', 'GPS KM']
      const data = filteredTrips.map((trip) => [
        trip.date,
        trip.vehicleName,
        new Date(trip.tripStart).toLocaleString(),
        new Date(trip.tripEnd).toLocaleString(),
        `${trip.logKm} km`,
        `${trip.gpsKm} km`,
      ])

      doc.autoTable({ head: [headers], body: data, startY: 20 })
      doc.save(`Trips_List_${new Date().toISOString().split('T')[0]}.pdf`)
      toast.success('PDF downloaded successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to export PDF')
    }
  }

  // Export to Excel function
  const exportToExcel = () => {
    try {
      if (!filteredTrips.length) throw new Error('No data available for Excel export')

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Trips')
      worksheet.addRow(['Date', 'Vehicle', 'Trip Start', 'Trip End', 'Log KM', 'GPS KM'])

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

      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer]), `Trips_List_${new Date().toISOString().split('T')[0]}.xlsx`)
        toast.success('Excel file downloaded successfully')
      })
    } catch (error) {
      toast.error(error.message || 'Failed to export Excel')
    }
  }

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <strong>Trip Details</strong>

        {/* Search Bar */}
        <CFormInput
          type="text"
          placeholder="Search vehicles..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: '250px', maxWidth: '100%' }}
        />
      </CCardHeader>

      <div className="overflow-auto">
        <CTable hover responsive bordered striped>
          <CTableHead>
            <CTableRow className="text-center">
              <CTableHeaderCell>SrNo</CTableHeaderCell>
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
            {filteredTrips.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="8" className="text-center">
                  No results found for "{searchQuery}"
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredTrips.map((trip) => (
                <CTableRow key={trip.id}>
                  <CTableDataCell>{trip.date}</CTableDataCell>
                  <CTableDataCell>{trip.vehicleName}</CTableDataCell>
                  <CTableDataCell>{new Date(trip.tripStart).toLocaleString()}</CTableDataCell>
                  <CTableDataCell>{new Date(trip.tripEnd).toLocaleString()}</CTableDataCell>
                  <CTableDataCell>{trip.logKm} km</CTableDataCell>
                  <CTableDataCell>
                    <span
                      className={`badge ${Math.abs(trip.logKm - trip.gpsKm) <= 5 ? 'bg-success' : 'bg-danger'
                        }`}
                    >
                      {trip.gpsKm} km
                    </span>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <Button
                      variant="contained"
                      style={{ backgroundColor: '#007bff', color: '#fff', padding: '6px 12px' }}
                    >
                      View Sign
                    </Button>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    </CCard>
  )
}

export default TripsTable
