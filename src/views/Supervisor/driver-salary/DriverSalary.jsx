import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query' // Ensure react-query is installed
import SalaryComponent from '../../components/SalaryComponet.jsx'
import SmartPagination from '../../components/SmartPagination.jsx'
import Loader from '../../../components/Loader/Loader.jsx'
import Page404 from '../../pages/page404/Page404.js'
import SearchInput from '../../components/SearchInput.jsx'
import Table from '../../components/Table'
import DateRangePicker from '../../components/DateRangePicker.jsx'
import { getDriverSalaryListApiByMonth } from '../data/data.js'

const DriverSalary = () => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState([])

  const lastFetchedMonth = useRef(null)

  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Contact Number', key: 'contactNumber', sortable: true },
    { label: 'Basic Pay', key: 'basicPay', sortable: true },
    { label: 'Overtime', key: 'overtime', sortable: true },
    { label: 'Incentives', key: 'incentives', sortable: true },
    { label: 'Net Pay', key: 'netPay', sortable: true },
    { label: 'Actions', key: 'actions', sortable: false },
  ]

  const {
    data: salaryData = [],
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['driverSalaries', month],
    queryFn: async () => {
      if (lastFetchedMonth.current === month) {
        console.log('Skipping duplicate API call for:', month)
        return []
      }
      lastFetchedMonth.current = month
      console.log(`Fetching driver salaries for month: ${month}`)
      const response = await getDriverSalaryListApiByMonth(month)
      return response || []
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(month),
    retry: 1,
  })

  const transformedData = useMemo(
    () =>
      salaryData?.map((item) => ({
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : 'N/A',
        driverName: item.driverId?.name || 'N/A',
        contactNumber: item.driverId?.contactNumber || 'N/A',
        basicPay: item.basicPay,
        overtime: item.overtime,
        incentives: item.incentives,
        netPay: item.netPay,
      })) || [],
    [salaryData],
  )

  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(transformedData)
    } else {
      const filtered = transformedData.filter((item) =>
        item.driverName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredData(filtered)
    }
  }, [searchQuery, transformedData])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  return (
    <div className="container-fluid">
      {/* Header Section */}
      <div className="row mb-3">
        {/* Left Side: Date Picker (Fixed to Left) */}
        <div className="col-md-2 d-flex align-items-center">
          <DateRangePicker
            onMonthChange={(selectedMonth) => {
              if (selectedMonth !== month) {
                setMonth(selectedMonth)
              }
            }}
          />
        </div>

        {/* Right Side: SearchInput & SalaryComponent (Aligned to Right) */}
        <div className="col-md-10 d-flex justify-content-end align-items-center gap-3">
          <div className="d-flex flex-grow-1 justify-content-end" style={{ marginTop: '1.5rem' }}>
            <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          <div>
            <SalaryComponent />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Table
        title="Driver Salary Generation"
        columns={columns}
        filteredData={filteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        errorMessage={
          isError
            ? 'Error fetching driver salaries. Please try again later.'
            : filteredData.length === 0 && !isFetching
              ? 'No salary records found for the selected month.'
              : ''
        }
      />

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <SmartPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value)
            setCurrentPage(1)
          }}
        />
      </div>
    </div>
  )
}

export default DriverSalary
