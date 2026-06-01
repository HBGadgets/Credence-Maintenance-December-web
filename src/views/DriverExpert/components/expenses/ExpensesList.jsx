import React, { useState, useEffect, useMemo } from 'react'
import { driverExpenses, getDriverBillApi } from '../../data/drivers'
import BillShow from '../../../components/BillModal/BillShow'
import Table from '../../../components/Table'
import SearchInput from '../../../components/SearchInput'
import DateRangeFilterCredence from '../../../../components/DateRangeFilterCredence'

import { toast, ToastContainer } from 'react-toastify'
import { CContainer } from '@coreui/react'
import SmartPagination from '../../../components/SmartPagination'
import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import usePdfExporter from '../../../customhooks/usePdfExporter'
import useExcelExporter from '../../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import IconDropdown from '../../../Supervisor/IconDropdown'

const ExpensesList = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const { id } = useParams()
  // Date range and search
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state

  const { data: driverExpensesData = [], isFetching } = useQuery({
    queryKey: ['DriverExpenses', id],
    queryFn: () => driverExpenses(id),
    staleTime: 1000 * 60 * 30,
    retry: 0,
  })

  useEffect(() => {
    let filtered = driverExpensesData

    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    // Filter by date range if available
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.originalDate)
        return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
      })
    }

    // Apply style in payment
    const styledData = filtered.map((data) => ({
      ...data,
      payment: (
        <span
          style={{
            backgroundColor:
              data.payment === 'upi'
                ? '#0000FF'
                : data.payment === 'cash'
                  ? '#28a745'
                  : data.payment === 'card'
                    ? '#f5a623'
                    : '#0000FF',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            display: 'inline-block',
            textTransform: 'capitalize',
          }}
        >
          {data.payment}
        </span>
      ),

      coordinate:
        data.lat !== 'No latitude' && data.long !== 'No Longitude'
          ? `${data.lat}, ${data.long}`
          : 'No coordinates',
    }))

    setFilteredData(styledData)
  }, [searchQuery, dateRange, driverExpensesData])

  console.log('All data drvier expense', driverExpensesData)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Pagination: Slice the data for current page
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Description', key: 'description', sortable: true },
    { label: 'Location', key: 'location', sortable: true },
    { label: 'Co-ordinate', key: 'coordinate', sortable: true },
    { label: 'Shop Name', key: 'shopName', sortable: true },
    { label: 'Amount', key: 'amount', sortable: true },
    { label: 'Payment Mode', key: 'payment', sortable: true },
  ]

  console.log('Filtered Data:', filteredData)

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Handle Date Range Change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }

  // handle View
  const handleViewButton = async (id) => {
    const selectedRow = driverExpensesData.find((item) => item.id === id)
    if (selectedRow) {
      console.log('idzaazz', id)
      console.log('billImg value:', selectedRow.billImg)

      try {
        const response = await getDriverBillApi(selectedRow.billImg)
        const { base64Data, contentType } = response

        if (base64Data && contentType) {
          const fileSrc = `data:${contentType};base64,${base64Data}`
          setPdfBase64(fileSrc)
          setModalTitle(
            contentType.startsWith('application/pdf')
              ? 'Vehicle Bill (PDF)'
              : contentType.startsWith('image')
                ? 'Vehicle Bill (Image)'
                : 'Vehicle Bill (File)',
          )
          setShowModal(true)
        } else {
          toast.error('Invalid bill image data.')
        }
      } catch (error) {
        console.error('Failed to fetch bill image:', error)
        toast.error('No bill image found.')
      }
    }
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
        onClick: () => {
          const cleanedData = filteredData.map((item) => ({
            ...item,
            payment:
              typeof item.payment === 'string' ? item.payment : item.payment?.props?.children || '',
          }))
          exportToPDF({
            title: 'Vehicle Expense Report',
            columns,
            data: cleanedData,
            fileName: 'Vehicle_Expenses_Report',
          })
        },
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () => {
          const cleanedData = filteredData.map((item) => ({
            ...item,
            payment:
              typeof item.payment === 'string' ? item.payment : item.payment?.props?.children || '',
          }))
          exportToExcel({
            title: 'Vehicle Expenses Report',
            columns,
            data: cleanedData,
            fileName: 'Vehicle_Expenses_Report',
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
        {' '}
        <div className="mb-2 d-flex justify-content-between align-items-center">
          {/* Left: Date Range Filter */}
          <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
          <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
        </div>
        <Table
          title="Driver Expenses"
          columns={columns}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          isFetching={isFetching}
          viewButton={true}
          handleViewButton={handleViewButton}
          action="Images"
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
        <BillShow
          showModal={showModal}
          setShowModal={setShowModal}
          pdfBase64={pdfBase64}
          modalTitle={modalTitle}
        />
      </CContainer>
      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}
ExpensesList.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default ExpensesList
