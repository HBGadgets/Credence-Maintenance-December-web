import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CSpinner,
} from '@coreui/react'
import { FaCalendarAlt, FaMapMarkerAlt, FaFlagCheckered } from 'react-icons/fa'
import StatusBadge from './StatusBadge' // Ensure the correct path
import { FaTruck } from 'react-icons/fa' // For the truck icon
import './subtrip.css' // Include your custom styles

const SubTripDetailsModal = ({ visible, onClose, subTrips, loadingSubTrip }) => {
  return (
    <CModal visible={visible} onClose={onClose} size="lg" scrollable>
      <CModalHeader>
        <CModalTitle>Sub-Trip Details</CModalTitle>
      </CModalHeader>

      <CModalBody>
        {loadingSubTrip ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <p className="text-muted mt-3">Loading sub-trip details...</p>
          </div>
        ) : subTrips.length === 0 ? (
          <p className="text-muted text-center py-4">No sub-trips found for this trip.</p>
        ) : (
          <div className="d-grid gap-4">
            {subTrips.map((subTrip, index) => (
              <div key={index} className="sub-trip-card border rounded shadow-sm p-4 bg-white">
                <div className="status-badge-top-right">
                  <StatusBadge status={subTrip.status} />
                </div>
                <h6 className="fw-bold text-primary mb-3">Sub Trip {index + 1}</h6>
                {/* Date */}
                <div className="col-md-6 d-flex gap-2 align-items-start">
                  <FaCalendarAlt className="text-secondary mt-1" />
                  <div>
                    <div className="text-muted small">Date</div>
                    <div className="fw-semibold">{subTrip.date}</div>
                  </div>
                </div>
                <br />

                <div
                  className="flex justify-between  item-center row"
                  style={{ placeContent: 'space-between' }}
                >
                  {/* Start Location */}
                  <div className="col-md-2 d-flex gap-2 align-items-start">
                    {/* <FaMapMarkerAlt className="text-success mt-1" /> */}
                    <div className="d-flex flex-column">
                      <div className="text-muted small">Start Location</div>
                      <div className="fw-semibold text-success">
                        {' '}
                        <FaMapMarkerAlt className="text-success" /> {subTrip.startLocation}
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Track (between Start and End Location) */}
                  <div className="col-md-2 gap-2 vehicle-track-container d-flex justify-content-center">
                    <div className="vehicle-track ms-3 flex-grow-1 position-relative">
                      <div className="track-line"></div>

                      {/* Truck icon logic */}
                      {subTrip.status === 'in-progress' && (
                        <div className="truck-icon truck-mid animate-progress">
                          <FaTruck className="text-warning" /> {/* Yellow truck */}
                        </div>
                      )}

                      {subTrip.status === 'completed' && (
                        <div className="truck-icon truck-end">
                          <FaTruck className="text-success" />
                        </div>
                      )}

                      {subTrip.status === 'cancelled' && (
                        <div className="truck-icon truck-start">
                          <FaTruck className="text-danger" />
                        </div>
                      )}

                      {subTrip.status !== 'in-progress' &&
                        subTrip.status !== 'completed' &&
                        subTrip.status !== 'cancelled' && (
                          <div className="truck-icon truck-start">
                            <FaTruck className="text-success" />
                          </div>
                        )}
                    </div>
                  </div>

                  {/* End Location */}
                  <div className="col-md-2 d-flex gap-2 align-items-start">
                    {/* <FaFlagCheckered className="text-danger mt-1" /> */}
                    <div>
                      <div className="text-muted small">End Location</div>

                      <div className="fw-semibold text-danger">
                        {' '}
                        <FaFlagCheckered className="text-danger" /> {subTrip.endLocation}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CModalBody>

      <CModalFooter>
        <CButton color="primary" variant="outline" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default SubTripDetailsModal
