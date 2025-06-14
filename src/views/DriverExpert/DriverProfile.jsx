import React, { useEffect, useState } from 'react'
import Profile from './components/profile/Profile'
import { useParams } from 'react-router-dom'
import Tabs from '../../components/Tabs'
import AttendanceSummary from './components/attendance/AttendanceSummary'
import { driverProfile, driverExpenses } from './data/drivers'
import { useQuery } from '@tanstack/react-query'
import DriverLogbook from './components/logbook/DriverLogbook'
import Salary from './components/salary/Salary'
import DriverTrip from './components/trip/DriverTrip'
import DriverExpenses from './components/expenses/DriverExpenses'
import { ToastContainer } from 'react-toastify'
import DocumentLocker from './components/documents/DocumentLocker'

function DriverProfile() {
  const { id } = useParams()
  const [filterData, setFilteredData] = useState([])

  // Fetch driver profile
  const { data: driversProfile = {}, isFetching } = useQuery({
    queryKey: ['driversProfile', id],
    queryFn: () => driverProfile(id),
    staleTime: 1000 * 60 * 30, // 30 minutes
  })

  useEffect(() => {
    setFilteredData(driversProfile)
  }, [driversProfile])

  const tabData = [
    {
      label: 'Attendance',
      content: <AttendanceSummary filterData={filterData.attendance} id={id} />,
    },
    { label: 'Expenses', content: <DriverExpenses id={id} /> },
    { label: 'Logbook Details', content: <DriverLogbook id={id} /> },
    { label: 'Trips Details', content: <DriverTrip id={id} /> },
    { label: 'Salary Slips', content: <Salary id={id} /> },
    { label: 'Document Locker', content: <DocumentLocker id={id}/> },
  ]

  return (
    <div>
      <ToastContainer />

      <Profile id={id} filterData={filterData.driver} isFetching={isFetching} />
      <div className="mt-4">
        <Tabs tabs={tabData} />
      </div>
    </div>
  )
}

export default DriverProfile
