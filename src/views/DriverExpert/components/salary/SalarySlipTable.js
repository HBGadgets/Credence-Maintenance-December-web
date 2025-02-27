import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
} from '@coreui/react'
import SalaryDetail from './SalaryCard'

const SalarySlipTable = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Temporary Salary Data
  const salaries = [
    {
      id: '1',
      driverId: '1',
      month: '2024-03-04',
      basicPay: 25000,
      overtime: 1800,
      incentives: 2000,
      deductions: 1500,
      netPay: 27300,
    },
    {
      id: '2',
      driverId: '1',
      month: '2024-04-04',
      basicPay: 25000,
      overtime: 1800,
      incentives: 2000,
      deductions: 1500,
      netPay: 27300,
    },
  ]

  // Filter salaries based on date range and search query
  const filteredSalaries = salaries.filter((salary) => {
    const date = new Date(salary.month)
    const isWithinDateRange =
      (!startDate || date >= new Date(startDate)) && (!endDate || date <= new Date(endDate))

    const matchesSearch =
      searchQuery === '' ||
      salary.basicPay.toString().includes(searchQuery) ||
      salary.netPay.toString().includes(searchQuery)

    return isWithinDateRange && matchesSearch
  })

  // Salary content for each salary slip
  const SalaryContent = ({ data }) => (
    <div className="space-y-4">
      {data.map((salary) => (
        <CCard key={salary.id} className="mb-4">
          <CCardHeader>
            Salary Slip - {new Date(salary.month).toLocaleDateString('en-US')}
          </CCardHeader>
          <CCardBody>
            <div className="space-y-2">
              <SalaryDetail label="Basic Pay" amount={salary.basicPay} />
              <SalaryDetail label="Overtime" amount={salary.overtime} className="text-success" />
              <SalaryDetail label="Incentives" amount={salary.incentives} className="text-success" />
              <SalaryDetail label="Deductions" amount={salary.deductions} className="text-danger" />
              <div className="border-top pt-2 mt-2">
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
      {/* Filters and Search Bar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Date Range Filter (Left) */}
        <div className="d-flex gap-2">
          <CFormInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <CFormInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <CButton color="primary" onClick={() => console.log('Apply filter')}>
            Apply
          </CButton>
        </div>

        {/* Search Bar (Right) */}
        <CFormInput
          type="text"
          placeholder="Search Salary..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-25"
        />
      </div>

      {/* Salary List */}
      <SalaryContent data={filteredSalaries} />
    </div>
  )
}

export default SalarySlipTable
