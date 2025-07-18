import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { driverProfile, driverAttendance } from '../../data/drivers'
import { useQuery } from '@tanstack/react-query'
import AttendanceCard from '../../../components/AttendanceCard/AttendanceCard'
import DateRangePicker from '../../../components/DateRangePicker'
import AttendanceCalendar from './AttendanceCalendar'

function Attendance() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  // pending data pass through AttendanceSummary.jsx
  const location = useLocation()
  const pendingFromSummary = location.state?.pendingCount

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
  })

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
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            onClick={() =>
              navigate(`/PresentTable/${id}?month=${selectedMonth}`, {
                state: {
                  presentData: driversAttendance?.attendanceDetails?.filter(
                    (entry) => entry.status === 'Present',
                  ),
                },
              })
            }
            style={{ cursor: 'pointer' }}
          >
            <AttendanceCard
              title="Present Days"
              subtitle="Current month"
              count={driversAttendance?.presentCount || 0}
              status="Present"
              subStatus="attendance rate"
              rate={driversAttendance?.presentPercentage || 0}
              statusColor="#22c55e"
            />
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div
            onClick={() =>
              navigate(`/AbsentTable/${id}?month=${selectedMonth}`, {
                state: {
                  absentData: driversAttendance?.attendanceDetails?.filter(
                    (entry) => entry.status === 'Absent',
                  ),
                },
              })
            }
            style={{ cursor: 'pointer' }}
          >
            <AttendanceCard
              title="Absent Days"
              subtitle="Unplanned absences"
              count={driversAttendance?.absentCount || 0}
              status="Absent"
              subStatus="absence rate"
              rate={driversAttendance?.unplannedLeavePercentage || 0}
              statusColor="#ef4444"
            />
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div
            onClick={() =>
              navigate(`/ApprovedLeaveTable/${id}?month=${selectedMonth}`, {
                state: {
                  approvedData: driversAttendance?.attendanceDetails?.filter(
                    (entry) => entry.status === 'On Leave',
                  ),
                },
              })
            }
            style={{ cursor: 'pointer' }}
          >
            <AttendanceCard
              title="Approved Leaves Days"
              subtitle="Planned leaves days"
              count={driversAttendance?.onLeaveCount || 0}
              status="Leave"
              subStatus="Planned leave rate"
              rate={driversAttendance?.plannedLeavePercentage || 0}
              statusColor="#3b82f6"
            />
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div onClick={() => navigate(`/LeaveRequests`)} style={{ cursor: 'pointer' }}>
            <AttendanceCard
              title="Pending Leaves Requests"
              subtitle="Leave requests"
              status="Pending"
              subStatus="Planned leave rate"
              count={driversAttendance?.pendingCount || pendingFromSummary || 0}
              statusColor="#facc15"
            />
          </div>
        </div>
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
