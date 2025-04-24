import React from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'
import { SubTrip } from '../types'
import { formatDateToDDMMYYYY } from '../utils/formatDate'
import StatusBadge from './StatusBadge'
import { X } from 'lucide-react'

const SubTripDetailsModal = ({ visible, onClose, subTrips }) => {
  return (
    <CModal visible={visible} onClose={onClose} size="lg" scrollable>
      <CModalHeader className="d-flex justify-content-between align-items-center">
        <h5 className="modal-title">Sub-Trip Details</h5>
        <CButton type="button" color="light" onClick={onClose} className="border-0">
          <X size={20} />
        </CButton>
      </CModalHeader>

      <CModalBody>
        {subTrips.length === 0 ? (
          <p className="text-muted text-center py-4">No sub-trips found.</p>
        ) : (
          <div className="d-grid gap-3">
            {subTrips.map((subTrip) => (
              <div key={subTrip.id} className="border rounded p-3 bg-light shadow-sm">
                <div className="row mb-2">
                  <div className="col-md-6 mb-2">
                    <small className="text-muted">Date</small>
                    <div className="fw-semibold">{formatDateToDDMMYYYY(subTrip.date)}</div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <small className="text-muted">Status</small>
                    <div>
                      <StatusBadge status={subTrip.status} />
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <small className="text-muted">Start Location</small>
                    <div className="fw-semibold">{subTrip.startLocation}</div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <small className="text-muted">End Location</small>
                    <div className="fw-semibold">{subTrip.endLocation}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CModalBody>

      <CModalFooter>
        <CButton color="primary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default SubTripDetailsModal
