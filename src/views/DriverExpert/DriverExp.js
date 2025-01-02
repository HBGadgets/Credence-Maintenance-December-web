import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CImage,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
} from '@coreui/react'
import { Eye } from 'lucide-react'
import { drivers } from '../DriverExpert/data/drivers' // Ensure this import is correct
import { trips } from '../DriverExpert/data/trips' // Ensure this import is correct
import { expenses } from '../DriverExpert/data/expenses' // Import expenses
import { salaries } from '../DriverExpert/data/salaries' // Import salaries
import TripsTable from '../DriverExpert/components/trips/TripsTable' // Ensure this import is correct
import ExpensesTable from '../DriverExpert/components/expenses/ExpensesTable' // Ensure this import is correct
import SalarySlipTable from '../DriverExpert/components/salary/SalarySlipTable' // Import the SalarySlipTable component
import AttendanceSection from '../DriverExpert/components/attendance/AttendanceSection' // Import AttendanceSection component

const DriversExp = ({ setSelectedDriverId }) => {
  const columns = ['Name', 'Contact', 'Email', 'Action']
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [open, setOpen] = useState(false)

  // Group trips by driverId
  const groupedTrips = trips.reduce((acc, trip) => {
    if (!acc[trip.driverId]) {
      acc[trip.driverId] = []
    }
    acc[trip.driverId].push(trip)
    return acc
  }, {})

  // Group expenses by driverId
  const groupedExpenses = expenses.reduce((acc, expense) => {
    if (!acc[expense.driverId]) {
      acc[expense.driverId] = []
    }
    acc[expense.driverId].push(expense)
    return acc
  }, {})

  // Group salaries by driverId (assuming you have a similar salaries data)
  const groupedSalaries = salaries.reduce((acc, salary) => {
    if (!acc[salary.driverId]) {
      acc[salary.driverId] = []
    }
    acc[salary.driverId].push(salary)
    return acc
  }, {})

  const handleViewClick = (driver) => {
    setSelectedDriver(driver)
    setOpen(true)
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Drivers List</strong>
            </CCardHeader>
            <CCardBody>
              {drivers.length === 0 ? (
                <p className="text-center">No drivers available.</p>
              ) : (
                <CTable striped hover responsive bordered>
                  <CTableHead>
                    <CTableRow>
                      {columns.map((column, index) => (
                        <CTableHeaderCell key={index} className="text-center" scope="col">
                          {column}
                        </CTableHeaderCell>
                      ))}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {drivers.map((driver) => (
                      <CTableRow key={driver.id}>
                        <CTableDataCell className="text-center">{driver.name}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {driver.contactNumber}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{driver.email}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            color="primary"
                            size="sm"
                            onClick={() => handleViewClick(driver)}
                            className="text-center"
                          >
                            <Eye className="me-2" size={16} />
                            View Profile
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal */}
      {selectedDriver && (
        <CModal
          alignment="center"
          scrollable
          visible={open}
          onClose={() => setOpen(false)}
          fullscreen
        >
          <CModalHeader>
            <CModalTitle className="d-flex align-items-center"><h5>Driver Profile</h5></CModalTitle>
          </CModalHeader>
          <CModalBody className="shadow-md rounded-lg p-6 mb-6">
            <div className="d-flex gap-3">
              <CImage
                src={selectedDriver.profileImage || '/default-avatar.png'} // Default image fallback
                alt={selectedDriver.name}
                className="img-thumbnail rounded-circle me-3"
                width="120" // Set the desired width
                height="120" // Set the desired height
              />
              <div>
                <div className="py-2">
                  <h2>{selectedDriver.name}</h2>
                </div>
                <div>
                  <h6>License: {selectedDriver.licenseNumber}</h6>
                </div>
                <div>
                  <h6>Aadhar: {selectedDriver.aadharNumber}</h6>
                </div>
                <div>
                  <h6>Contact: {selectedDriver.contactNumber}</h6>
                </div>
                <div>
                  <h6>Email: {selectedDriver.email}</h6>
                </div>
              </div>
            </div>
            <hr />

            {/* Tabs */}
            <CTabs activeItemKey={1}>
              <CTabList variant="underline">
                <CTab aria-controls="attendance" itemKey={1}>
                  Attendances
                </CTab>
                <CTab aria-controls="expenses" itemKey={2}>
                  Expenses
                </CTab>
                <CTab aria-controls="trip-details" itemKey={3}>
                  Trip Details
                </CTab>
                <CTab aria-controls="salary-slips" itemKey={4}>
                  Salary Slips
                </CTab>
              </CTabList>
              <CTabContent>
                <CTabPanel className="p-3" aria-labelledby="attendance" itemKey={1}>
                  <AttendanceSection driverId={selectedDriver.id} />
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="expenses" itemKey={2}>
                  <ExpensesTable expenses={groupedExpenses[selectedDriver.id] || []} />
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="trip-details" itemKey={3}>
                  <TripsTable trips={groupedTrips[selectedDriver.id] || []} />
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="salary-slips" itemKey={4}>
                  <SalarySlipTable salaries={groupedSalaries[selectedDriver.id] || []} />
                </CTabPanel>
              </CTabContent>
            </CTabs>
          </CModalBody>
        </CModal>
      )}
    </>
  )
}

export default DriversExp
