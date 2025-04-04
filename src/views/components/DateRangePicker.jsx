import React, { useState } from 'react'

const DateRangePicker = ({ onMonthChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 7)) // Default: Current Month

  const handleDateChange = (event) => {
    const newMonth = event.target.value // Extract "yyyy-mm"
    setSelectedDate(newMonth)
    onMonthChange(newMonth) // Pass selected month to parent
  }

  return (
    <div className="date-range-picker">
      <label htmlFor="monthPicker" className="me-2 fw-bold">
        Select Month:
      </label>
      <input
        type="month"
        id="monthPicker"
        className="form-control"
        value={selectedDate}
        onChange={handleDateChange}
      />
    </div>
  )
}

export default DateRangePicker
