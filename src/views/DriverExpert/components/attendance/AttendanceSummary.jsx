/* eslint-disable prettier/prettier */
import React from 'react'
import './style.css'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
function AttendanceSummary({ filterData, id }) {
  const { Present = 0, Absent = 0, Pending = 0, Approved = 0 } = filterData || {}

  const attendanceSummary = [
    { title: 'Present', value: Present, className: 'text-success', cardClass: 'present' },
    { title: 'Absent', value: Absent, className: 'text-danger', cardClass: 'absent' },
    { title: 'Pending Leaves', value: Pending, className: 'text-warning', cardClass: 'pending' },
    { title: 'Approved Leaves', value: Approved, className: 'text-primary', cardClass: 'approved' },
  ]

  const navigate = useNavigate()

  const handleViewDetailedReport = (id) => {
    navigate(`/DriverAttendance/${id}`)
  }

  return (
    <>
      <div className="container mt-4">
        <div className="row g-3">
          {attendanceSummary.map(({ title, value, className, cardClass }, index) => (
            <div key={index} className="col-md-3">
              <div className={`cardward ${cardClass}`}>
                <div className={`cardward-title ${className}`}>{title}</div>
                <div className="cardward-value">{value}</div>
                <div className="text-muted">Current month</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-end">
          <button
            onClick={() => handleViewDetailedReport(id)}
            className="rounded ps-3 pe-3 btn btn-outline-primary custom-hover"
          >
            View Detailed Report
          </button>
        </div>
      </div>
    </>
  )
}

AttendanceSummary.propTypes = {
  filterData: PropTypes.object,
  id: PropTypes.string,
}
export default AttendanceSummary
