import React, { useEffect, useState } from 'react'
import { driverSalary } from '../../data/drivers'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import { useQuery } from '@tanstack/react-query'
import SalaryInvoiceModal from './SalaryInvoiceModal'
import { CContainer } from '@coreui/react'
import DateRangeFilterCredence from '../../../../components/DateRangeFilterCredence'
import { useNavigate, useParams } from 'react-router-dom'
import SearchInput from '../../../components/SearchInput'
import { ToastContainer } from 'react-toastify'

const ViewAllSalary = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [selectedSalary, setSelectedSalary] = useState(null)

  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: driverSalaryData = [],
    isFetching,
    isFetched,
    isError,
  } = useQuery({
    queryKey: ['DriverSalary', id],
    queryFn: () => driverSalary(id),
  })

  useEffect(() => {
    if (!driverSalaryData || driverSalaryData.length === 0) {
      setFilteredData([])
      return
    }

    let filtered = [...driverSalaryData]

    // Filter by date range
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate)
      const end = new Date(dateRange.endDate)
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.originalDate)
        return itemDate >= start && itemDate <= end
      })
    }

    // Filter by search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) =>
            value && typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    setFilteredData(filtered)
  }, [driverSalaryData, dateRange, searchQuery])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Basic Pay', key: 'basicPay', sortable: true },
    { label: 'Overtime Pay', key: 'overtime', sortable: true },
    { label: 'Incentives', key: 'incentives', sortable: true },
    { label: 'Deductions', key: 'deductions', sortable: true },
    { label: 'Net Pay', key: 'netPay', sortable: true },
  ]

  // handle view
  const handleViewButton = (id) => {
    const selectedRow = driverSalaryData.find((item) => item.id === id)
    if (selectedRow) {
      setSelectedSalary(selectedRow)
      setShowInvoiceModal(true)
    }
  }

  // Handle Date Range Change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }

  // handle navigate
  const handleViewDetailedReport = (id) => {
    navigate(`/ViewAllSalary/${id}`)
  }

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  return (
    <>
      <ToastContainer />

      <CContainer className="px-2" fluid>
        <div className="mb-2 d-flex justify-content-between align-items-center">
          <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
          <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
        </div>

        <>
          <Table
            title="Driver Salary"
            columns={columns}
            filteredData={paginatedData}
            setFilteredData={setFilteredData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isFetching={isFetching}
            isFetched={isFetched}
            isError={isError}
            viewButton={true}
            handleViewButton={handleViewButton}
          />

          <SmartPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(value) => {
              if (value === -1) {
                setItemsPerPage(filteredData.length)
                setCurrentPage(1)
              } else {
                setItemsPerPage(value)
                setCurrentPage(1)
              }
            }}
          />
        </>

        <SalaryInvoiceModal
          visible={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          salaryData={selectedSalary}
        />
      </CContainer>
    </>
  )
}

export default ViewAllSalary
