/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import PropTypes from 'prop-types'

const DateRangeFilter = ({ onFilter }) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleFilter = () => {
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        alert('End date must be greater than or equal to the start date.')
        return
      }
      onFilter(new Date(startDate), new Date(endDate))
    }
  }

  const handleClearFilter = () => {
    setStartDate('')
    setEndDate('')
    onFilter(null, null)
  }

  return (
    <div className="d-flex gap-3 align-items-end">
      <div>
        <label htmlFor="startDate" className="form-label">
          From Date
        </label>
        <input
          type="date"
          id="startDate"
          aria-label="Select start date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="form-control"
        />
      </div>
      <div>
        <label htmlFor="endDate" className="form-label">
          To Date
        </label>
        <input
          type="date"
          id="endDate"
          aria-label="Select end date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="form-control"
        />
      </div>
      <button onClick={handleFilter} className="btn btn-primary btn-sm">
        Apply Filter
      </button>
      {/* <button onClick={handleClearFilter} className="btn btn-secondary btn-sm">
        Clear Filter
      </button> */}
    </div>
  )
}

DateRangeFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
}

export default DateRangeFilter
