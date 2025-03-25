import PropTypes from 'prop-types'
import React from 'react'
import { useParams } from 'react-router-dom'
import { driverProfile, driverAttendance } from '../../data/drivers'
import { useQuery } from '@tanstack/react-query'
import AttendanceCard from '../../../components/AttendanceCard/AttendanceCard'

function Attendance() {
  const { id } = useParams()

  // Fetch driver details
  const { data: driver, isFetching } = useQuery({
    queryKey: ['driversProfile', id],
    queryFn: () => driverProfile(id),
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  })

  // Fetch attendance data
  const { data: driversAttendance } = useQuery({
    queryKey: ['attendance', id],
    queryFn: () => driverAttendance(id),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  return (
    <>
      <div>
        <h2>{isFetching ? 'Loading...' : driver?.driver?.name || 'N/A'}</h2>
      </div>
      <div>
        <AttendanceCard
          title="Present Days"
          subtitle="Current Month"
          count={driversAttendance?.presentCount || 0} // Use real data if available
          status="Present"
          rate={driversAttendance?.absentCount || 0} // Use dynamic attendance rate
          statusColor="#22c55e"
        />
        <AttendanceCard
          title="Present Days"
          subtitle="Current Month"
          count={driversAttendance?.presentCount || 0} // Use real data if available
          status="Present"
          rate={driversAttendance?.absentCount || 0} // Use dynamic attendance rate
          statusColor="#22c55e"
        />
      </div>
    </>
  )
}

Attendance.propTypes = {
  id: PropTypes.string,
}

export default Attendance
