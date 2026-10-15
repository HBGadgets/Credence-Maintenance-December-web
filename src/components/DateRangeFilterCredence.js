/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import './DateRangeCredence.css'

const DateRangeFilter = ({
  onDateRangeChange,
  title = 'Date Range',
  startDate: propStartDate,
  endDate: propEndDate,
  maxDate,
  minDate,
  className,
  style,
  buttonClassName,
  buttonStyle,
  dropdownAlign = 'left',
  dropdownStyle,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedStartDate, setSelectedStartDate] = useState(null)
  const [selectedEndDate, setSelectedEndDate] = useState(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const calendarRef = useRef(null)

  // Sync with parent props (e.g. on external reset or initial values)
  useEffect(() => {
    if (!propStartDate && !propEndDate) {
      setSelectedStartDate(null)
      setSelectedEndDate(null)
    } else {
      if (propStartDate) {
        const s = new Date(propStartDate)
        if (!isNaN(s.getTime())) {
          setSelectedStartDate(s)
          setCurrentMonth(s)
        }
      }
      if (propEndDate) {
        const e = new Date(propEndDate)
        if (!isNaN(e.getTime())) setSelectedEndDate(e)
      }
    }
  }, [propStartDate, propEndDate])

  // Close calendar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false)
      }
    }

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCalendarOpen])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonthDate = new Date(year, month, -i)
      days.unshift(prevMonthDate)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }

    return days
  }

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const formatDate = (date) => {
    if (!date) return ''
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
  }

  const isDateDisabled = (date) => {
    if (maxDate) {
      const max = new Date(maxDate)
      max.setHours(23, 59, 59, 999)
      if (date > max) return true
    }
    if (minDate) {
      const min = new Date(minDate)
      min.setHours(0, 0, 0, 0)
      if (date < min) return true
    }
    return false
  }

  const handleDateClick = (date) => {
    if (isDateDisabled(date)) return

    // If no start date yet, or if both start and end were selected: start new selection
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date)
      setSelectedEndDate(null)
    } else {
      // One date was already selected
      if (date.toDateString() === selectedStartDate.toDateString()) {
        // Clicking same date again marks it as a single date selection
        setSelectedEndDate(date)
      } else if (date < selectedStartDate) {
        setSelectedStartDate(date)
        setSelectedEndDate(selectedStartDate)
      } else {
        setSelectedEndDate(date)
      }
    }
  }

  const handleDateDoubleClick = (date) => {
    if (isDateDisabled(date)) return
    setSelectedStartDate(date)
    setSelectedEndDate(date)
    const start = new Date(date)
    start.setHours(0, 1, 1, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)
    if (onDateRangeChange) {
      onDateRangeChange(start, end)
    }
    setIsCalendarOpen(false)
  }

  const isDateInRange = (date) => {
    if (!selectedStartDate || !selectedEndDate) return false
    return date >= selectedStartDate && date <= selectedEndDate
  }

  const isDateSelected = (date) => {
    return (
      selectedStartDate?.toDateString() === date.toDateString() ||
      selectedEndDate?.toDateString() === date.toDateString()
    )
  }

  const handleApply = () => {
    let start = selectedStartDate
    let end = selectedEndDate

    // If only one date is picked, treat it as single date selection
    if (selectedStartDate && !selectedEndDate) {
      end = new Date(start)
      setSelectedEndDate(end)
    } else if (selectedEndDate && !selectedStartDate) {
      start = new Date(end)
      setSelectedStartDate(start)
    }

    if (start) {
      start = new Date(start)
      start.setHours(0, 1, 1, 0) // Set to 00:01:01
    }

    if (end) {
      end = new Date(end)
      end.setHours(23, 59, 59, 999) // End of day
    }

    if (onDateRangeChange) {
      onDateRangeChange(start, end)
    }
    setIsCalendarOpen(false)
  }

  const handleClear = () => {
    setSelectedStartDate(null)
    setSelectedEndDate(null)
    if (onDateRangeChange) {
      onDateRangeChange(null, null)
    }
    setIsCalendarOpen(false)
  }

  const presets = [
    {
      label: 'Today',
      action: () => {
        const today = new Date()
        setSelectedStartDate(today)
        setSelectedEndDate(today)
        setCurrentMonth(today)
      },
    },
    {
      label: 'Yesterday',
      action: () => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        setSelectedStartDate(yesterday)
        setSelectedEndDate(yesterday)
        setCurrentMonth(yesterday)
      },
    },
    {
      label: 'This Month',
      action: () => {
        const start = new Date()
        start.setDate(1)
        const end = new Date()
        setSelectedStartDate(start)
        setSelectedEndDate(end)
        setCurrentMonth(start)
      },
    },
    {
      label: 'Last Month',
      action: () => {
        const start = new Date()
        start.setMonth(start.getMonth() - 1)
        start.setDate(1)
        const end = new Date(start.getFullYear(), start.getMonth() + 1, 0)
        setSelectedStartDate(start)
        setSelectedEndDate(end)
        setCurrentMonth(start)
      },
    },
    {
      label: 'Custom Range',
      action: () => {
        setSelectedStartDate(null)
        setSelectedEndDate(null)
      },
    },
  ]

  const getButtonText = () => {
    if (selectedStartDate && selectedEndDate) {
      if (formatDate(selectedStartDate) === formatDate(selectedEndDate)) {
        return formatDate(selectedStartDate)
      }
      return `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`
    }
    if (selectedStartDate) {
      return formatDate(selectedStartDate)
    }
    return title
  }

  const canGoNextMonth = () => {
    if (!maxDate) return true
    const max = new Date(maxDate)
    const nextMonthFirstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    return nextMonthFirstDay <= max
  }

  return (
    <div className={`position-relative ${className || ''}`} style={style}>
      <button
        type="button"
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        className={buttonClassName || 'btn btn-outline-secondary'}
        style={buttonStyle}
      >
        <div className="d-flex align-items-center gap-2 text-truncate">
          <Calendar size={14} className="text-secondary flex-shrink-0" />
          <span className="text-truncate">{getButtonText()}</span>
        </div>
      </button>

      {isCalendarOpen && (
        <div
          ref={calendarRef}
          className="position-absolute mt-2 bg-white rounded shadow border p-4"
          style={{
            width: '450px',
            maxWidth: '92vw',
            zIndex: 1050,
            ...(dropdownAlign === 'right' ? { right: 0 } : { left: 0 }),
            ...dropdownStyle,
          }}
        >
          <div className="d-flex">
            {/* Presets */}
            <div className="border-end pe-4" style={{ width: '180px' }}>
              {presets.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={preset.action}
                  className="preset-button"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Calendar */}
            <div className="flex-grow-1 ps-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
                    )
                  }
                  className="btn btn-link p-1 text-dark"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="fw-semibold">
                  {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button
                  type="button"
                  disabled={!canGoNextMonth()}
                  onClick={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
                    )
                  }
                  className="btn btn-link p-1 text-dark"
                  style={!canGoNextMonth() ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center small fw-medium text-secondary py-1">
                    {day}
                  </div>
                ))}
                {getDaysInMonth(currentMonth).map((date, index) => {
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                  const disabled = isDateDisabled(date)
                  const classes = [
                    'date-button',
                    !isCurrentMonth && 'other-month',
                    isDateSelected(date) && 'selected',
                    isDateInRange(date) && !isDateSelected(date) && 'in-range',
                    disabled && 'disabled text-muted',
                  ]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleDateClick(date)}
                      onDoubleClick={() => handleDateDoubleClick(date)}
                      className={classes}
                      style={disabled ? { cursor: 'not-allowed', opacity: 0.3 } : undefined}
                      title={disabled ? 'Disabled' : 'Click to select, double-click for single date'}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
            <span className="small text-secondary">
              {selectedStartDate && selectedEndDate
                ? formatDate(selectedStartDate) === formatDate(selectedEndDate)
                  ? `Selected: ${formatDate(selectedStartDate)} (Single Date)`
                  : `Selected: ${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`
                : selectedStartDate
                  ? `Selected: ${formatDate(selectedStartDate)} (Single Date)`
                  : 'Select a date or range'}
            </span>
            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={() => setIsCalendarOpen(false)}
                className="btn btn-light btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="btn btn-outline-danger btn-sm"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!selectedStartDate && !selectedEndDate}
                className="btn btn-primary btn-sm text-white"
                style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangeFilter
