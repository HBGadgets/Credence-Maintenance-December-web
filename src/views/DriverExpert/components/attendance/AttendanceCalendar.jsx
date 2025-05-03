/* eslint-disable prettier/prettier */
import React from 'react'
import PropTypes from 'prop-types'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  getDay,
  parse,
} from 'date-fns'

function AttendanceCalendar({ month, onMonthChange, attendanceData = [] }) {
  const currentDate = new Date(month + '-01')
  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  })

  const firstDayOfMonth = getDay(startOfMonth(currentDate))
  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  days.forEach((day) => calendarDays.push(day))

  const getAttendanceStatus = (date) => {
    if (!date) return 'empty'
    const formattedDate = format(date, 'yyyy-MM-dd')
    return (
      attendanceData.find((entry) => {
        const parsedDate = parse(entry.createdAt, 'dd/MM/yyyy', new Date())
        return format(parsedDate, 'yyyy-MM-dd') === formattedDate
      })?.status || 'Attendance not marked'
    )
  }

  const handlePrevMonth = () => {
    const prev = subMonths(currentDate, 1)
    onMonthChange(format(prev, 'yyyy-MM'))
  }

  const handleNextMonth = () => {
    const next = addMonths(currentDate, 1)
    onMonthChange(format(next, 'yyyy-MM'))
  }

  const getStatusStyle = (status) => {
    const baseStyle = {
      minHeight: '70px',
      minWidth: '70px',
      borderRadius: '6px',
      padding: '6px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }

    switch (status) {
      case 'Present':
        return { ...baseStyle, backgroundColor: '#dcfce7', color: '#2d7749' }
      case 'Absent':
        return { ...baseStyle, backgroundColor: '#fee2e2', color: '#9d2323' }
      case 'On Leave':
        return { ...baseStyle, backgroundColor: '#dbeafe', color: '#3b82f6' }
      case 'Attendance not marked':
      default:
        return { ...baseStyle, backgroundColor: '#f8f9fa', color: '#6c757d' }
    }
  }

  const weeks = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }

  return (
    <div className="card mt-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-1">Attendance Calendar</h5>
            <p className="text-muted mb-0">
              Monthly attendance for {format(currentDate, 'MMMM yyyy')}
            </p>
          </div>
          <div className="btn-group">
            <button className="btn btn-outline-secondary btn-sm" onClick={handlePrevMonth}>
              &lt;
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={handleNextMonth}>
              &gt;
            </button>
          </div>
        </div>

        <table className="table table-bordered text-center">
          <thead>
            <tr>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <th key={day} className="fw-semibold">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, i) => (
              <tr key={i}>
                {week.map((day, j) => {
                  const status = getAttendanceStatus(day)
                  const style = day
                    ? getStatusStyle(status)
                    : { minHeight: '70px', minWidth: '70px' }

                  return (
                    <td key={j} className="p-1 align-middle">
                      <div
                        style={style}
                        title={day ? `${format(day, 'dd MMM yyyy')} - ${status}` : ''}
                      >
                        {day ? (
                          <>
                            <div className="fw-bold">{format(day, 'd')}</div>
                            {status !== 'Attendance not marked' && status !== 'empty' && (
                              <small>{status}</small>
                            )}
                          </>
                        ) : null}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Legend */}
        <div className="mt-3">
          <ul className="list-unstyled d-flex justify-content-center gap-4 mb-0">
            <li className="d-flex align-items-center">
              <span
                className="me-2 rounded"
                style={{
                  backgroundColor: '#dcfce7',
                  color: '#2d7749',
                  width: 20,
                  height: 20,
                  display: 'inline-block',
                }}
              ></span>
              Present
            </li>
            <li className="d-flex align-items-center">
              <span
                className="me-2 rounded"
                style={{
                  backgroundColor: '#fee2e2',
                  color: '#9d2323',
                  width: 20,
                  height: 20,
                  display: 'inline-block',
                }}
              ></span>
              Absent
            </li>
            <li className="d-flex align-items-center">
              <span
                className="me-2 rounded"
                style={{
                  backgroundColor: '#dbeafe',
                  color: '#3b82f6',
                  width: 20,
                  height: 20,
                  display: 'inline-block',
                }}
              ></span>
              Leave
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

AttendanceCalendar.propTypes = {
  month: PropTypes.string.isRequired,
  onMonthChange: PropTypes.func.isRequired,
  attendanceData: PropTypes.arrayOf(
    PropTypes.shape({
      createdAt: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['Present', 'Absent', 'Leave']),
    }),
  ),
}

export default AttendanceCalendar
