/* eslint-disable prettier/prettier */
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import PropTypes from 'prop-types'
import './attendance-card.css'

const AttendanceCard = ({ title, subtitle, count, status, rate, statusColor, subStatus }) => {
  return (
    <div className="card attendance-card">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-subtitle text-muted">{subtitle}</p>

        <div className="count-display">{count}</div>

        <div className="status-info">
          <span className="status-badge" style={{ backgroundColor: statusColor }}>
            {status}
          </span>
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
}

export default AttendanceCard
