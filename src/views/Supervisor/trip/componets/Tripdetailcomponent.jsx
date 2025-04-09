import React from 'react'

const TripDetailsCard = ({ trip }) => {
  if (!trip) return <p>No trip selected.</p>

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'in-progress':
        return 'badge bg-warning text-dark'
      case 'cancelled':
        return 'badge bg-danger'
      case 'completed':
        return 'badge bg-success'
      default:
        return 'badge bg-secondary'
    }
  }

  return (
    <div className="bg-white text-dark shadow-sm border-0 p-4 w-100">
      <div className="mb-3">
        <strong>Trip Date:</strong>{' '}
        {trip.date ? new Date(trip.date).toLocaleDateString('en-GB') : 'N/A'}
      </div>
      <div className="mb-3">
        <strong>Driver Name:</strong> {trip.driverId?.name || 'N/A'}
      </div>
      <div className="mb-3">
        <strong>Vehicle Name:</strong>{' '}
        {typeof trip.vehicleName === 'string' ? trip.vehicleName : trip.vehicleId?.name || 'N/A'}
      </div>
      <div className="mb-3">
        <strong>Route:</strong>{' '}
        {trip.startLocation && trip.endLocation
          ? `${trip.startLocation} → ${trip.endLocation}`
          : 'N/A'}
      </div>
      <div className="mb-3">
        <strong>Budget Allocated:</strong> ₹{trip.budgetAllocated ?? 0}
      </div>
      <div className="mb-3">
        <strong>Spent Amount:</strong> ₹{trip.spentAmount ?? 0}
      </div>
      <div className="mb-3">
        <strong>Status:</strong>{' '}
        <span className={getStatusBadge(trip.status)}>{trip.status || 'N/A'}</span>
      </div>
    </div>
  )
}

export default TripDetailsCard
