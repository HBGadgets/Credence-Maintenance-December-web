import React, { useState } from 'react'

const SubTripTable = ({ subTrips }) => {
  const [showAll, setShowAll] = useState(false)

  const visibleTrips = showAll ? subTrips : subTrips.slice(0, 5)

  console.log('datataa tripsaaa', visibleTrips)

  const getStatusStyle = (status) => {
    return {
      display: 'inline-block',
      minWidth: '90px',
      padding: '4px 10px',
      borderRadius: '12px',
      textAlign: 'center',
      textTransform: 'capitalize',
      fontWeight: '500',
      backgroundColor:
        status === 'in-progress'
          ? '#f5a623'
          : status === 'completed'
            ? '#28a745'
            : status === 'cancelled'
              ? '#dc3545'
              : '#6c757d',
      color: 'white',
    }
  }

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Comapany Name</th>
            <th>Route</th>
            <th>Date</th>
            <th>Budget</th>
            <th>Status</th>
            <th>Material</th>
          </tr>
        </thead>
        <tbody>
          {visibleTrips.length > 0 ? (
            visibleTrips.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.companyName}</td>
                <td>
                  {trip.startLocation} ➝ {trip.endLocation}
                </td>
                <td>{trip.date}</td>
                <td>₹{trip.budgetAllocated}</td>
                <td>
                  <span style={getStatusStyle(trip.status)}>{trip.status}</span>
                </td>
                <td>{trip.materialType || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {subTrips.length > 5 && (
        <div className="d-flex justify-content-end mt-2">
          <button className="btn btn-primary" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </div>
  )
}

export default SubTripTable
