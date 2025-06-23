/* eslint-disable prettier/prettier */
import React, { useMemo } from 'react'
import './style.css'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import IconDropdown from '../../../Supervisor/IconDropdown'
import { FaArrowUp, FaPrint } from 'react-icons/fa'
import { HiOutlineLogout } from 'react-icons/hi'
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

  // Handle Logout
  const handleLogout = () => {
    // Clear sessionStorage and localStorage
    sessionStorage.clear()
    localStorage.clear()

    // Optional: Clear cookies (will only clear cookies accessible via JavaScript)
    document.cookie.split(';').forEach((c) => {
      const base = c.trim().split('=')[0]
      document.cookie = `${base}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    })

    // Redirect to Credence
    window.history.replaceState(null, '', '/')
    // window.location.href = 'http://localhost:3000'
    window.location.href = import.meta.env.VITE_API_CREDENCE_URL
  }

  // Memoized dropdown items for export
  const dropdownItems = useMemo(() => [
    {
      icon: HiOutlineLogout,
      label: 'Logout',
      onClick: () => handleLogout(),
    },
    {
      icon: FaArrowUp,
      label: 'Scroll To Top',
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
  ])

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

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

AttendanceSummary.propTypes = {
  filterData: PropTypes.object,
  id: PropTypes.string,
}
export default AttendanceSummary
