import React from 'react'
import './TripDetailsCard.css'
import {
  FaRoute,
  FaUserTie,
  FaTruck,
  FaCalendarAlt,
  FaBoxes,
  FaMoneyBill,
  FaReceipt,
  FaInfoCircle,
} from 'react-icons/fa'

const TripDetailsCard = ({ mainTrip }) => {
  const isDataAvailable = mainTrip && Object.keys(mainTrip).length > 0

  console.log('datasassata', isDataAvailable)

  return (
    <div className="trip-card-modern">
      <h3 className="trip-card-title">Supervisor Trip Details</h3>

      {!isDataAvailable ? (
        <div className="text-center text-muted" style={{ padding: '60px 0', fontSize: '16px' }}>
          No data available
        </div>
      ) : (
        <>
          <div className="trip-info-row">
            <FaRoute className="trip-icon" />
            <span className="trip-label">Route:</span>
            <span className="trip-value">
              {mainTrip.startLocation} ➝ {mainTrip.endLocation}
            </span>
          </div>
          <div className="trip-info-row">
            <FaUserTie className="trip-icon" />
            <span className="trip-label">Driver:</span>
            <span className="trip-value">{mainTrip.driverName}</span>
          </div>
          <div className="trip-info-row">
            <FaTruck className="trip-icon" />
            <span className="trip-label">Vehicle:</span>
            <span className="trip-value">{mainTrip.vehicleName}</span>
          </div>
          <div className="trip-info-row">
            <FaCalendarAlt className="trip-icon" />
            <span className="trip-label">Date:</span>
            <span className="trip-value">{mainTrip.date}</span>
          </div>
          <div className="trip-info-row">
            <FaBoxes className="trip-icon" />
            <span className="trip-label">Material:</span>
            <span className="trip-value">{mainTrip.materialType}</span>
          </div>
          <div className="trip-info-row">
            <FaMoneyBill className="trip-icon" />
            <span className="trip-label">Budget:</span>
            <span className="trip-value">₹{mainTrip.budgetAllocated.toLocaleString()}</span>
          </div>
          <div className="trip-info-row">
            <FaReceipt className="trip-icon" />
            <span className="trip-label">Spent:</span>
            <span className="trip-value">₹{mainTrip.spentAmount.toLocaleString()}</span>
          </div>
          <div className="trip-info-row">
            <FaInfoCircle className="trip-icon" />
            <span className="trip-label">Status:</span>
            <span className={`trip-status ${mainTrip.status?.toLowerCase()}`}>
              {mainTrip.status}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default TripDetailsCard
