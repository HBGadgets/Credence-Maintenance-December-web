import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { ChevronRight } from 'lucide-react'
import SalaryDetail from './SalaryCard'
import DateRangeFilter from '../../common/DateRangeFilter'

const SalarySlipTable = ({ salaries }) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [open, setOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Number of items per page in modal table

  const handleOpen = () => {
    setCurrentPage(1) // Reset to the first page when opening modal
    setOpen(true)
  }

  // Filter salaries based on the date range
  const filteredSalaries = salaries.filter((salary) => {
    if (!startDate || !endDate) return true
    const date = new Date(salary.month)
    return date >= new Date(startDate) && date <= new Date(endDate)
  })

  // Pagination logic for modal table
  const totalPages = Math.ceil(filteredSalaries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentSalaries = filteredSalaries.slice(startIndex, startIndex + itemsPerPage)

  // Salary content for each salary slip
  const SalaryContent = ({ data }) => (
    <div className="space-y-4">
      {data.map((salary) => (
        <CCard key={salary.id} className="mb-4">
          <CCardHeader>
            Salary Slip - {new Date(salary.month).toLocaleDateString('en-US', {})}
          </CCardHeader>
          <CCardBody>
            <div className="space-y-2">
              <SalaryDetail label="Basic Pay" amount={salary.basicPay} />
              <SalaryDetail label="Overtime" amount={salary.overtime} className="text-success" />
              <SalaryDetail
                label="Incentives"
                amount={salary.incentives}
                className="text-success"
              />
              <SalaryDetail label="Deductions" amount={salary.deductions} className="text-danger" />
              <div className="border-top pt-2 mt-2 mt-0">
                <SalaryDetail
                  label="Net Pay"
                  amount={salary.netPay}
                  className="text-lg font-weight-bold"
                />
              </div>
            </div>
          </CCardBody>
        </CCard>
      ))}
    </div>
  )

  return (
    <div>
      <SalaryContent data={filteredSalaries.slice(0, 2)} />
      <div className="mt-4">
        <CButton
          onClick={handleOpen}
          color="link"
          className="d-flex align-items-center text-primary"
        >
          View All Salary Slips
          <ChevronRight size={16} />
        </CButton>
      </div>

      <CModal
        alignment="center"
        scrollable
        visible={open}
        onClose={() => setOpen(false)}
        fullscreen
      >
        <CModalHeader>
          <CModalTitle>All Salary Slips</CModalTitle>
        </CModalHeader>

        <CModalBody className="d-flex flex-column gap-3">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <SalaryContent data={currentSalaries} />
          {/* Pagination for modal table */}
          {totalPages > 1 && filteredSalaries.length > itemsPerPage && (
            <CPagination align="center" className="mt-4">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </CPaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <CPaginationItem
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </CPaginationItem>
            </CPagination>
          )}
        </CModalBody>
      </CModal>
    </div>
  )
}

export default SalarySlipTable
