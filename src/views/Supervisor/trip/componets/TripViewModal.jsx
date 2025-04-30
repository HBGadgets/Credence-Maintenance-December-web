import React from 'react'
import TripDetailsCard from './Tripdetailcomponent'
import TripBudgetPieChart from './TripBudgetPieChart'
import TripBudgetBarChart from './TripBudgetBarChart'

const TripViewModal = ({ show, trip, onClose }) => {
  if (!show || !trip) return null

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" onClick={onClose}>
      <div className="modal-dialog modal-xl" role="document" style={{ marginTop: '4rem' }}>
        <div className="modal-content rounded-4 shadow-lg border-0 overflow-hidden">
          <div className="modal-header bg-white">
            <h5 className="modal-title fw-semibold">Trip Analytics - {trip?.driverId?.name}</h5>
            <button
              type="button"
              className="btn-close ms-auto"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="container-fluid px-4 py-4 bg-light">
            {/* Row 1: Trip Summary & Pie Chart */}
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="card bg-white shadow-sm border-light rounded-3 h-100 d-flex flex-column justify-content-center">
                  <div className="card-body p-4">
                    <h5 className="card-title text-primary fw-semibold mb-3">Trip Summary</h5>
                    <TripDetailsCard trip={trip} />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card bg-white shadow-sm border-light rounded-3 h-100 d-flex flex-column justify-content-center">
                  <div className="card-body p-4">
                    <h5 className="card-title text-primary fw-semibold mb-3">Budget Overview</h5>
                    <TripBudgetPieChart budget={trip.budgetAllocated} spent={trip.spentAmount} />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Bar Chart */}
            <div className="row">
              <div className="col-12">
                <div className="card bg-white shadow-sm border-light rounded-3 h-100">
                  <div className="card-body py-3 px-4">
                    <h5 className="card-title text-primary fw-semibold mb-3">Budget Analysis</h5>
                    <TripBudgetBarChart budget={trip.budgetAllocated} spent={trip.spentAmount} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-white border-top-0">
            <button type="button" className="btn btn-outline-primary px-4" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripViewModal
