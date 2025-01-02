/* eslint-disable prettier/prettier */
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
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import VehicleTripModal from '../modals/VehicleTripModal'

function VehicelTripInfo({ trips }) {
  const [open, setOpen] = useState(false)
  const columns = [
    'Driver',
    'Route',
    'Distance in Miles',
    'Start Date',
    'End Date',
    'Duration in Hours',
    'Total Cost',
    'Status',
  ]

  const handleClickView = () => {
    setOpen(true)
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Recent Trips</strong>
            </CCardHeader>
            <CCardBody>
              {trips.length === 0 ? (
                <p className="text-center">No Trips to Show</p>
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
                    {trips.slice(0, 3).map((trip, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell className="text-center">{trip.driver}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {trip.startLocation} &rarr; {trip.endLocation}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{trip.distance}</CTableDataCell>
                        <CTableDataCell className="text-center">{trip.startDate}</CTableDataCell>
                        <CTableDataCell className="text-center">{trip.endDate}</CTableDataCell>
                        <CTableDataCell className="text-center">{trip.duration}</CTableDataCell>
                        <CTableDataCell className="text-center">{trip.totalCost}</CTableDataCell>
                        <CTableDataCell className="text-center">{trip.status}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
              <div className="d-flex justify-content-end">
                <button className="btn btn-secondary" type="button" onClick={handleClickView}>
                  View More
                </button>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <VehicleTripModal
        trip={trips}
        setOpen={setOpen}
        open={open}
        onClose={() => setOpen(false)}
        columns={columns}
      />
    </>
  )
}
export default VehicelTripInfo
