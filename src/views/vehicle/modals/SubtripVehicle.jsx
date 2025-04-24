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
import StatusBadge from './StatusBadge' // Make sure the path is correct
import { FaTruck } from 'react-icons/fa' // Truck icon for animation
import './subtrip.css' // Import your CSS file for styles

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
              <div key={index} className="border rounded shadow-sm p-4 bg-white">
                <h6 className="fw-bold text-primary mb-3">Sub Trip {index + 1}</h6>
                <div className="row g-4">
                  {/* Date */}
                  <div className="col-md-6 d-flex gap-2 align-items-start">
                    <FaCalendarAlt className="text-secondary mt-1" />
                    <div>
                      <div className="text-muted small">Date</div>
                      <div className="fw-semibold">{subTrip.date}</div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-md-6">
                    <div className="text-muted small">Status</div>
                    <StatusBadge status={subTrip.status} />
                  </div>

                  {/* Start Location with Animation */}
                  <div className="col-md-6 d-flex gap-2 align-items-start">
                    <FaMapMarkerAlt className="text-success mt-1" />
                    <div>
                      <div className="text-muted small">Start Location</div>
                      <div className="fw-semibold text-success">{subTrip.startLocation}</div>
                    </div>

                    {/* Animation Line with Vehicle */}
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
                  <div className="col-md-6 d-flex gap-2 align-items-start">
                    <FaFlagCheckered className="text-danger mt-1" />
                    <div>
                      <div className="text-muted small">End Location</div>
                      <div className="fw-semibold text-danger">{subTrip.endLocation}</div>
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
