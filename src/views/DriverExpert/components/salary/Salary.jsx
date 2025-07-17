import React, { useEffect, useMemo, useState } from 'react'
import { driverSalary } from '../../data/drivers'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import { useQuery } from '@tanstack/react-query'
import SalaryInvoiceModal from './SalaryInvoiceModal'
import { CContainer } from '@coreui/react'
import DateRangeFilterCredence from '../../../../components/DateRangeFilterCredence'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import usePdfExporter from '../../../customhooks/usePdfExporter'
import useExcelExporter from '../../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import IconDropdown from '../../../Supervisor/IconDropdown'

const Salary = ({ id }) => {
  const navigate = useNavigate()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [selectedSalary, setSelectedSalary] = useState(null)

  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state

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

    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate)
      const end = new Date(dateRange.endDate)
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.originalDate)
        return itemDate >= start && itemDate <= end
      })
    }

    setFilteredData(filtered)
  }, [driverSalaryData, dateRange])

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

  // Handle Logout
  const handleLogout = () => {
    // Clear sessionStorage and localStorage
    sessionStorage.clear()
    localStorage.clear()

    // Optional: Clear cookies (will only clear cookies accessible via JavaScript)
    document.cookie.split(';').forEach((c) => {
      const base = c.trim().split('=')[0]
      document.cookie = `${base}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    })

    // Redirect to Credence
    window.history.replaceState(null, '', '/')
    // window.location.href = 'http://localhost:3000'
    window.location.href = import.meta.env.VITE_API_CREDENCE_URL
  }

  // Memoized dropdown items for export
  const dropdownItems = useMemo(
    () => [
      {
        icon: FaRegFilePdf,
        label: 'Download PDF',
        onClick: () =>
          exportToPDF({
            title: 'Driver Salary Report',
            columns,
            data: filteredData,
            fileName: 'Driver_Salary_Report',
          }),
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () => {
          exportToExcel({
            title: 'Driver Salary Report',
            columns,
            data: filteredData,
            fileName: 'Driver_Salary_Report',
          })
        },
      },
      {
        icon: FaPrint,
        label: 'Print Page',
        onClick: () => window.print(),
      },
      {
        icon: HiOutlineLogout,
        label: 'Logout',
        onClick: () => handleLogout(),
      },
      {
        icon: FaArrowUp,
        label: 'Scroll To Top',
        onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      },
    ],
    [filteredData, columns, exportToPDF, exportToExcel],
  )

  return (
    <>
      <ToastContainer />

      <CContainer className="px-2" fluid>
        {/* <div className="mb-2 d-flex justify-content-between align-items-center">
          <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
        </div> */}
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
            action="Images"
          />

          {/* <SmartPagination
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
          /> */}
        </>

        <SalaryInvoiceModal
          visible={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          salaryData={selectedSalary}
        />

        <div className="mt-3 text-end">
          <button
            onClick={() => handleViewDetailedReport(id)}
            className="rounded ps-3 pe-3 btn btn-outline-primary custom-hover"
          >
            View Detailed Report
          </button>
        </div>
      </CContainer>
      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default Salary
