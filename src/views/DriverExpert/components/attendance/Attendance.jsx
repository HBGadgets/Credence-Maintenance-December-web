/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { driverAttendance } from '../../data/drivers'

function Attendance() {
  const { id } = useParams()
  const [filterData, setFilteredData] = useState([])
  const [isFetching, setIsFetching] = useState(true)
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const response = await driverAttendance(id)
        setFilteredData(response)
      } catch (error) {
        console.error('Error fetching drivers:', error)
      } finally {
        setIsFetching(false)
      }
    }
    fetchDriverData()
  }, [])

  return (
    <>
      <h1>filterData</h1>
      <p>{filterData}</p>
    </>
  )
}

Attendance.propTypes = {
  id: PropTypes.string,
}
export default Attendance
