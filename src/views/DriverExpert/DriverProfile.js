import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaUserCircle } from 'react-icons/fa'
import { CImage, CTabs, CTabList, CTab, CTabContent, CTabPanel } from '@coreui/react'
import { useParams } from 'react-router-dom'
import { trips } from '../DriverExpert/data/trips'
import { expenses } from '../DriverExpert/data/expenses'
import { salaries } from '../DriverExpert/data/salaries'
import TripsTable from '../DriverExpert/components/trips/TripsTable'
import ExpensesTable from '../DriverExpert/components/expenses/ExpensesTable'
import SalarySlipTable from '../DriverExpert/components/salary/SalarySlipTable'
import AttendanceSection from '../DriverExpert/components/attendance/AttendanceSection'
import DocumentLocker from './components/documents/DocumentLocker'


function DriverProfile() {
    const {id}= useParams()

    const [selectedDriver, setSelectedDriver] = useState(null)
    const [expenses, setExpenses] = useState([])
    const [trips, setTrips] = useState([])
    const [salaries, setSalaries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchDriver = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/drivers/${id}`)
            console.log("driver in fetch specific driver",response.data)
            setSelectedDriver(response.data)

        } catch (error) {
            setError(error.message)
        }
    }
    useEffect(() => {
        fetchDriver()
    }, [])

  return (
    <>
     
            <div className="d-flex gap-3">
              {/* <CImage
                src={selectedDriver?.profileImage?.base64Data || '/defaultDriverProfileImage.png'}
                alt={selectedDriver.name}
                className="img-thumbnail rounded-circle me-3"
                width="170"
                height="170"
              /> */}
              {selectedDriver?.profileImage?.base64Data ? (
                <CImage
                  src={selectedDriver.profileImage.base64Data}
                  alt={selectedDriver.name}
                  className="img-thumbnail rounded-circle me-3"
                  width="170"
                  height="170"
                />
              ) : (
                <FaUserCircle 
                  className="me-3 text-secondary" 
                  size={170}  // Controls the icon size
                />
              )}
              <div>
                <div className="py-2">
                  <h2>{selectedDriver?.name? selectedDriver.name : 'No Driver Selected'}</h2>
                </div>
                <div>
                  <h6>License: {selectedDriver?.licenseNumber? selectedDriver.licenseNumber : 'No License Number'}</h6>
                </div>
                <div>
                  <h6>Aadhar: {selectedDriver?.aadharNumber? selectedDriver.aadharNumber : 'No Aadhar Number'}</h6>
                </div>
                <div>
                  <h6>Contact: {selectedDriver?.contactNumber? selectedDriver.contactNumber : 'No Contact Number'}</h6>
                </div>
                <div>
                  <h6>Email: {selectedDriver?.email? selectedDriver.email : 'No Email'}</h6>
                </div>
              </div>
            </div>
            <hr />
            <CTabs activeItemKey={1}>
              <CTabList variant="underline">
                <CTab aria-controls="attendance" itemKey={1}>
                  Attendances
                </CTab>
                <CTab aria-controls="expenses" itemKey={2}>
                  Expenses
                </CTab>
                <CTab aria-controls="trip-details" itemKey={3}>
                  Logbook Details
                </CTab>
                <CTab aria-controls="salary-slips" itemKey={4}>
                  Salary Slips
                </CTab>
                <CTab aria-controls="document-locker" itemKey={5}>
                  Document Locker
                </CTab>
              </CTabList>
              <CTabContent>
                <CTabPanel className="p-3" aria-labelledby="attendance" itemKey={1}>
                  <AttendanceSection driverId={id} />
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="expenses" itemKey={2}>
                  <ExpensesTable
                    expenses={expenses.filter((expense) => expense.driverId === selectedDriver._id)}
                  />
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="trip-details" itemKey={3}>
                  <TripsTable trips={trips.filter((trip) => trip.driverId === selectedDriver._id)} />
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="salary-slips" itemKey={4}>
                  <SalarySlipTable
                    salaries={salaries.filter((salary) => salary.driverId === selectedDriver._id)}
                  />
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="document-locker" itemKey={5}>
                  <DocumentLocker documents={selectedDriver} />
                </CTabPanel>
              </CTabContent>
            </CTabs>
          
      
    </>
  )
}

export default DriverProfile