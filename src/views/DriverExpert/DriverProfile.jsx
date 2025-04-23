import React, { useEffect, useState } from 'react'
import Profile from './components/profile/Profile'
import { useParams } from 'react-router-dom'
import Tabs from '../../components/Tabs'
import AttendanceSummary from './components/attendance/AttendanceSummary'
import { driverProfile } from './data/drivers'
import { useQuery } from '@tanstack/react-query'

function DriverProfile() {
  const { id } = useParams()
  const [filterData, setFilteredData] = useState([])

  // Fetch driver details (uses cache if available, fetches if not)
  const { data: driversProfile = {}, isFetching } = useQuery({
    queryKey: ['driversProfile', id],
    queryFn: () => driverProfile(id),
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  })

  useEffect(() => {
    setFilteredData(driversProfile)
  }, [driversProfile])

  const tabData = [
    {
      label: 'Attendance',
      content: <AttendanceSummary filterData={filterData.attendance} id={id} />,
    },
    { label: 'Expenses', content: 'Expenses tab content' },
    { label: 'Logbook Details', content: 'Logbook Details tab content' },
    { label: 'Trips Details', content: 'Trips Details tab content' },
    { label: 'Salary Slips', content: 'Salary Slips tab content' },
    { label: 'Document Locker', content: 'Document Locker tab content' },
  ]
  return (
    <>
      <div>
        <Profile id={id} filterData={filterData.driver} isFetching={isFetching} />
        <div className="mt-4">
          <Tabs tabs={tabData} />
        </div>
      </div>
    </>
  )
}

export default DriverProfile
