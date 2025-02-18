import React, {useState, useEffect} from 'react'
import DateRangeFilter from './DateRangeFilter'
import AttendanceTable from './AttendanceTable'
import axios from 'axios'
import {useParams } from 'react-router-dom'

function AttendanceDetails() {
      const params= useParams()
      const driverId= params.id

      const [startDate, setStartDate] = useState('')
      const [endDate, setEndDate] = useState('')
      const [attendanceData, setAttendanceData] = useState([])
      const fetchDriverAttendance = async () => {
        try {
          const response = await axios(
            // `${import.meta.env.VITE_API_URL}/api/attendance/6798b812e674b058463a84bb`
            `${import.meta.env.VITE_API_URL}/api/attendance/${driverId}`
          )
          console.log('Driver attendance:', response.data)
          console.log('Driver attendance1:', response.data.attendance);
          setAttendanceData(response.data.attendance)
          } catch (error) {
          console.error('Error fetching driver attendance:', error)
        }
      }

        useEffect(() => {
            fetchDriverAttendance()
            }
        , [])

      const filteredAttendance = attendanceData
      .filter((a) => {
        if (!startDate || !endDate) return true
        const date = new Date(a.date)
        return date >= new Date(startDate) && date <= new Date(endDate)
      })

  return (
    <>

          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <AttendanceTable attendanceData={filteredAttendance} />
        
    </>
  )
}

export default AttendanceDetails