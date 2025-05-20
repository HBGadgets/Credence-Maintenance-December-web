import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { driverProfile, driverAttendance } from '../../data/drivers'
import { useQuery } from '@tanstack/react-query'
import AttendanceCard from '../../../components/AttendanceCard/AttendanceCard'
import DateRangePicker from '../../../components/DateRangePicker'
import AttendanceCalendar from './AttendanceCalendar'

function Attendance() {
  const { id } = useParams()
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  // Fetch driver details
  const { data: driver, isFetching } = useQuery({
    queryKey: ['driversProfile', id],
    queryFn: () => driverProfile(id),
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  })

  // Fetch attendance data
  const { data: driversAttendance } = useQuery({
    queryKey: ['attendance', id, selectedMonth],
    queryFn: () => driverAttendance(id, selectedMonth),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  console.log('Driver Attendance:', driversAttendance)

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Driver Name */}
        <span className="fw-bold fs-4">
          {isFetching ? 'Loading...' : driver?.driver?.name || 'N/A'}
        </span>
        {/* Date Picker (Month) */}
        <div className="col-md-2 d-flex align-items-center">
          <DateRangePicker
            value={selectedMonth}
            label={false}
            onMonthChange={(newMonth) => {
              if (newMonth !== selectedMonth) {
                setSelectedMonth(newMonth)
              }
            }}
          />
        </div>
      </div>
      {/* Attendance Cards */}
      <div className="d-flex justify-content-between">
        <AttendanceCard
          title="Present Days"
          subtitle="Current month"
          count={driversAttendance?.presentCount || 0} // Use real data if available
          status="Present"
          subStatus="attendance rate"
          rate={driversAttendance?.presentPercentage || 0} // Use dynamic attendance rate
          statusColor="#22c55e"
        />
        <AttendanceCard
          title="Absent Days"
          subtitle="Unplanned absences"
          count={driversAttendance?.absentCount || 0} // Use real data if available
          status="Absent"
          subStatus="absence rate"
          rate={driversAttendance?.unplannedLeavePercentage || 0} // Use dynamic attendance rate
          statusColor="#ef4444"
        />
        <AttendanceCard
          title="Approved Leaves"
          subtitle="Planned leaves"
          count={driversAttendance?.onLeaveCount || 0} // Use real data if available
          status="Leave"
          subStatus="Planned leave rate"
          rate={driversAttendance?.plannedLeavePercentage || 0} // Use dynamic attendance rate
          statusColor="#3b82f6"
        />
        <AttendanceCard
          title="Pending Leaves"
          subtitle="Leave requests"
          count={driversAttendance?.presentCount || 0} // Use real data if available
          statusColor="#22c55e"
        />
      </div>
      {/* Calendar */}
      <div>
        <AttendanceCalendar
          month={selectedMonth}
          onMonthChange={setSelectedMonth}
          attendanceData={driversAttendance?.attendanceDetails}
        />
      </div>
    </>
  )
}

Attendance.propTypes = {
  id: PropTypes.string,
}

export default Attendance
