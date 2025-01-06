import React, { useState } from 'react';
import { Box, ChevronRight } from 'lucide-react';
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
  CCardHeader,
  CCard,
} from '@coreui/react';
import DateRangeFilter from '../../common/DateRangeFilter';
import { Button } from '@mui/material';
import signature from '../../Signature/signature.svg';

const TripsTable = ({ trips }) => {
  const [open, setOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // Number of items per page in modal table

  const handleOpen = () => {
    setCurrentPage(1) // Reset to the first page when opening modal
    setOpen(true)
  }

  // Sort trips by date (descending) for the latest 5 entries
  const sortedTrips = [...trips].sort((a, b) => new Date(b.date) - new Date(a.date))
  const latestTrips = sortedTrips.slice(0, 5)

  // Filter trips based on the date range
  const filteredTrips = trips.filter((trip) => {
    if (!startDate || !endDate) return true;
    const date = new Date(trip.date);
    return date >= new Date(startDate) && date <= new Date(endDate);
  });

  // Pagination logic for modal table
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentTrips = filteredTrips.slice(startIndex, startIndex + itemsPerPage)

  // Table component for displaying trips
  const TripsContent = ({ data }) => (
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
      <CTableBody>
        {data.map((trip) => (
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
  );

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Trip Details</strong>
        </CCardHeader>
        <div className="overflow-auto">
          <TripsContent data={latestTrips} />
        </div>
        <div className="mt-4">
          <CButton
            onClick={handleOpen}
            color="link"
            className="d-flex align-items-center text-primary"
          >
            View All Trips
            <ChevronRight size={16} />
          </CButton>
        </div>

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
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
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
        </CModal>
      </CCard>
    </div>
  );
};

export default TripsTable;
