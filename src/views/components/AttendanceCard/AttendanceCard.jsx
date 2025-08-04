import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './attendance-card.css'

const AttendanceCard = ({
  title,
  subtitle,
  count,
  status,
  rate,
  statusColor,
  subStatus,
  backgroundColor,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const cardStyle = {
    backgroundColor: isHovered ? backgroundColor || '#e0e0e0' : '#fff',
  }

  return (
    <div
      className="card attendance-card"
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-subtitle text-muted">{subtitle}</p>

        <div className="count-display">{count}</div>

        <div className="status-info">
          {status && (
            <span className="status-badge" style={{ backgroundColor: statusColor }}>
              {status}
            </span>
          )}
          <span className="attendance-rate">
            {rate} {subStatus}
          </span>
        </div>
      </div>
    </div>
  )
}

AttendanceCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  count: PropTypes.number.isRequired,
  status: PropTypes.string,
  rate: PropTypes.number,
  statusColor: PropTypes.string,
  subStatus: PropTypes.string,
  backgroundColor: PropTypes.string,
}

export default AttendanceCard
