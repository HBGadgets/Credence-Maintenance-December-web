import React, { useState, useEffect } from 'react'
import { attendance } from '../../data/attendance'
import DateRangeFilter from '../attendance/DateRangeFilter'
import AttendanceStats from '../attendance/AttendanceStats'
import LeaveRequests from '../attendance/LeaveRequests'
import AttendanceTable from '../attendance/AttendanceTable'
import { ChevronRight } from 'lucide-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CCardHeader,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AttendanceSection = ({ driverId }) => {
  const Navigate = useNavigate()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [open, setOpen] = useState(false)
  const [attendanceData, setAttendanceData] = useState([])
  const [filteredAttendance, setFilteredAttendence] = useState([])

  const handleOpen = () => {
    setOpen(true)
  }

  const fetchDriverAttendance = async () => {
    try {
      const response = await axios(
        `${import.meta.env.VITE_API_URL}/api/attendance/${driverId}`
      )
      setAttendanceData(response.data.attendance)
      setFilteredAttendence(response.data.attendance)
      } catch (error) {
      console.error('Error fetching driver attendance:', error)
    }
  }
  useEffect(()=>{
    fetchDriverAttendance()
    console.log("attendanceData",attendanceData);
  },[driverId])

  useEffect(() => {
    if (!startDate || !endDate) {
      setFilteredAttendence(attendanceData);
    } else {
      setFilteredAttendence(
        attendanceData.filter((a) => {
          const date = new Date(a.date);
          return date >= new Date(startDate) && date <= new Date(endDate);
        })
      );
    }
  }, [startDate, endDate, attendanceData]);

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Attendance</strong>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol xs="12" md="6" lg="4">
              <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            </CCol>
          </CRow>

          <AttendanceStats attendanceData={filteredAttendance} />
          {/* <LeaveRequests
            requests={filteredAttendance}
            onApprove={(id) => console.log('Approve:', id)}
            onDeny={(id) => console.log('Deny:', id)}
          /> */}

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary m-1" onClick={()=>{Navigate(`attendance`)}}>
              View More
            </button>
          </div>
        </CCardBody>
      </CCard>

      
    </div>
  )
}

export default AttendanceSection
