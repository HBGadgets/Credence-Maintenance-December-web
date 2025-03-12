import React, { useEffect, useState } from 'react'
import Profile from './components/profile/Profile'
import { useParams } from 'react-router-dom'
import Tabs from '../../components/Tabs'
import AttendanceSummary from './components/attendance/AttendanceSummary'
import { driverProfile } from './data/drivers'

function DriverProfile() {
  const { id } = useParams()
  const [filterData, setFilteredData] = useState([])
  const [isFetching, setIsFetching] = useState(true)
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const response = await driverProfile(id)
        setFilteredData(response)
      } catch (error) {
        console.error('Error fetching drivers:', error)
      } finally {
        setIsFetching(false)
      }
    }
    fetchDriverData()
  }, [])

  const tabData = [
    {
      label: 'Attendance',
      content: <AttendanceSummary filterData={filterData.attendance} id={id} />,
    },
    { label: 'Expenses', content: 'Expenses tab content' },
    { label: 'Logbook Details', content: 'Logbook Details tab content' },
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
