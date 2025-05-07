import React from 'react'
import './TripSummary.css'

const TripSummary = ({ mainTrip, subTrips }) => {
  const hasMainTrip = mainTrip && Object.keys(mainTrip).length > 0
  const hasSubTrips = Array.isArray(subTrips) && subTrips.length > 0

  if (!hasMainTrip && !hasSubTrips) {
    return (
      <div className="trip-summary no-data">
        <p>No trip summary data available.</p>
      </div>
    )
  }

  const totalTrips = 1 + (hasSubTrips ? subTrips.length : 0)
  const totalBudget =
    (mainTrip?.budgetAllocated || 0) +
    (hasSubTrips ? subTrips.reduce((sum, trip) => sum + (trip.budgetAllocated || 0), 0) : 0)
  const totalSpent = mainTrip?.spentAmount || 0
  const statusCounts = hasSubTrips
    ? subTrips.reduce((acc, trip) => {
        acc[trip.status] = (acc[trip.status] || 0) + 1
        return acc
      }, {})
    : {}

  return (
    <div className="trip-summary">
      <div className="summary-carddis">
        <h6 className="summary-title">Total Trips</h6>
        <p className="summary-description">Includes main trip and subtrips</p>
        <p className="summary-value">{totalTrips}</p>
      </div>
      <div className="summary-carddis">
        <h6 className="summary-title">Total Budget</h6>
        <p className="summary-description">Combined budget for all trips</p>
        <p className="summary-value">₹{totalBudget.toLocaleString()}</p>
      </div>
      <div className="summary-carddis">
        <h6 className="summary-title">Amount Spent</h6>
        <p className="summary-description">Expenses incurred so far</p>
        <p className="summary-value">₹{totalSpent.toLocaleString()}</p>
      </div>
      <div className="summary-carddis">
        <h6 className="summary-title">Status Count</h6>
        {Object.keys(statusCounts).length > 0 ? (
          <ul className="status-list">
            {Object.entries(statusCounts).map(([status, count]) => (
              <li key={status}>
                <span className={`status-name status-${status.toLowerCase().replace(/\s/g, '-')}`}>
                  {status}:
                </span>
                <span className="status-count">{count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="summary-description">No subtrip status available</p>
        )}
      </div>
    </div>
  )
}

export default TripSummary
