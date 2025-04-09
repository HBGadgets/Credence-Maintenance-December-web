import React from 'react'

const TripDetailsCard = ({ trip }) => {
  if (!trip) return <p>No trip selected.</p>

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h5 className="card-title mb-3 text-primary">Trip Summary</h5>
        <div className="mb-2">
          <strong>Trip Date:</strong>{' '}
          {trip.date ? new Date(trip.date).toLocaleDateString('en-GB') : 'N/A'}
        </div>
        <div className="mb-2">
          <strong>Driver Name:</strong> {trip.driverId?.name || 'N/A'}
        </div>
        <div className="mb-2">
          <strong>Vehicle Name:</strong>{' '}
          {typeof trip.vehicleName === 'string' ? trip.vehicleName : trip.vehicleId?.name || 'N/A'}
        </div>
        <div className="mb-2">
          <strong>Route:</strong>{' '}
          {trip.startLocation && trip.endLocation
            ? `${trip.startLocation} → ${trip.endLocation}`
            : 'N/A'}
        </div>
        <div className="mb-2">
          <strong>Budget Allocated:</strong> ₹{trip.budgetAllocated ?? 0}
        </div>
        <div className="mb-2">
          <strong>Spent Amount:</strong> ₹{trip.spentAmount ?? 0}
        </div>
        <div className="mb-2">
          <strong>Status:</strong>{' '}
          <span
            className={`badge ${
              trip.status === 'Completed'
                ? 'bg-success'
                : trip.status === 'Pending'
                  ? 'bg-warning text-dark'
                  : 'bg-secondary'
            }`}
          >
            {trip.status || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TripDetailsCard
