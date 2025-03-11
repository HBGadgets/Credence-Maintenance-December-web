import React, { useEffect, useState } from 'react'
import Profile from './components/profile/Profile'
import { useParams } from 'react-router-dom'
import Tabs from '../../components/Tabs'
import AttendanceSummary from './components/attendance/AttendanceSummary'

function DriverProfile() {
  const { id } = useParams()
  const tabData = [
    { label: 'Attendance', content: <AttendanceSummary /> },
    { label: 'Expenses', content: 'Expenses tab content' },
    { label: 'Logbook Details', content: 'Logbook Details tab content' },
    { label: 'Salary Slips', content: 'Salary Slips tab content' },
    { label: 'Document Locker', content: 'Document Locker tab content' },
  ]
  return (
    <>
      <div>
        <Profile id={id} />
        <div className="mt-4">
          <Tabs tabs={tabData} />
        </div>
      </div>
    </>
  )
}

export default DriverProfile
