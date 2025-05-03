import React, { useState } from 'react'

const DateRangePicker = ({ onMonthChange, label, value }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 7)) // Default: Current Month

  const handleDateChange = (event) => {
    const newMonth = event.target.value
    setSelectedDate(newMonth)
    onMonthChange(newMonth)
  }

  return (
    <div className="container-fluid">
      <div className="row align-items-center g-2">
        {label && (
          <div className="col-12 col-sm-auto">
            <label htmlFor="monthPicker" className="fw-bold">
              Select Month:
            </label>
          </div>
        )}
        <div className="col-12 col-sm">
          <input
            type="month"
            id="monthPicker"
            className="form-control"
            value={value ? value : selectedDate}
            onChange={handleDateChange}
          />
        </div>
      </div>
    </div>
  )
}

export default DateRangePicker
