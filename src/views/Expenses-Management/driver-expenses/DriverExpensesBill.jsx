import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import BillShow from '../../components/BillModal/BillShow'
import { useQuery } from '@tanstack/react-query'
import { getAllDriverExpesesListApi, getDriverBillImageApi } from '../data/data'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { HiOutlineLogout } from 'react-icons/hi'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import IconDropdown from '../../Supervisor/IconDropdown'

const DriverExpensesBill = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state

  // Use state for modal
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  // Fetch Data
  const { data: driverExpenseList = [], isFetching } = useQuery({
    queryKey: ['driverExpenseList'],
    queryFn: getAllDriverExpesesListApi,
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  })

  useEffect(() => {
    let filtered = driverExpenseList

    // Filter by date range if available
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.originalDate)
        return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
      })
    }

    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    // Apply styling AFTER filtering
    const styledData = filtered.map((data) => ({
      ...data,
      paymentMode: (
        <span
          style={{
            backgroundColor:
              data.paymentMode === 'upi'
                ? '#0000FF'
                : data.paymentMode === 'cash'
                  ? '#28a745'
                  : data.paymentMode === 'card'
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
          {data.paymentMode}
        </span>
      ),
    }))

    setFilteredData(styledData)
  }, [searchQuery, driverExpenseList, dateRange])

  console.log('All Driver Expenses Data: ', filteredData)

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Table Columns

  const columns = [
    { label: 'Service Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    // { label: 'Current Vehicle', key: 'currentVehicleName', sortable: true },
    { label: 'Shop Name', key: 'shopName', sortable: true },
    { label: 'Location', key: 'location', sortable: true },
    { label: 'Description', key: 'description', sortable: true },
    { label: 'Amount', key: 'amount', sortable: true },
    { label: 'Payment Mode', key: 'paymentMode', sortable: false },
  ]

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Handle Date Range Change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }

  // Handle View Button

  const handleViewButton = async (id) => {
    const selectedRow = filteredData.find((item) => item.id === id)
    if (!selectedRow) {
      return toast.error('Data not found for this ID')
    }

    if (!selectedRow.billImg) {
      return toast.warn('No bill image available for this entry.')
    }

    try {
      const response = await getDriverBillImageApi(selectedRow.billImg)
      const { base64Data, contentType } = response

      if (base64Data && contentType) {
        const fileSrc = `data:${contentType};base64,${base64Data}`
        console.log('Document bill image:', fileSrc)
        setPdfBase64(fileSrc)

        if (contentType.startsWith('application/pdf')) {
          setModalTitle('Driver Bill (PDF)')
        } else if (contentType.startsWith('image')) {
          setModalTitle('Driver Bill (Image)')
        } else {
          setModalTitle('Driver Bill (File)')
        }

        setShowModal(true)
      } else {
        toast.error('Invalid bill image data.')
      }
    } catch (error) {
      console.error('Failed to fetch bill image:', error)
      toast.error('No bill image found.')
    }
  }

  // Dropdown items for export
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () => {
        const cleanedData = filteredData.map(({ paymentMode, ...rest }) => ({
          ...rest,
          paymentMode:
            typeof paymentMode === 'string' ? paymentMode : paymentMode?.props?.children || '', // Extract text if it's a React element
        }))

        exportToPDF({
          title: 'Driver Expense Report',
          columns: columns,
          data: cleanedData,
          fileName: 'Driver_Expenses_Report',
        })
      },
    },

    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () => {
        const cleanedData = filteredData.map(({ paymentMode, ...rest }) => ({
          ...rest,
          paymentMode:
            typeof paymentMode === 'string' ? paymentMode : paymentMode?.props?.children || '', // fallback if styled span
        }))

        exportToExcel({
          title: 'Driver Expenses Report',
          columns: columns,
          data: cleanedData,
          fileName: 'Driver_Expenses_Report',
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
  ]

  return (
    <>
      <ToastContainer />

      <div className="mb-2 d-flex justify-content-between align-items-center">
        {/* Left: Date Range Filter */}
        <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
        <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
      </div>

      <Table
        title="All Drivers Expenses List"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        viewButton={true}
        handleViewButton={handleViewButton}
        isFetching={isFetching}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value === -1 ? filteredData.length : value)
          setCurrentPage(1)
        }}
      />

      {/* Modal Component */}
      <BillShow
        showModal={showModal}
        setShowModal={setShowModal}
        pdfBase64={pdfBase64}
        modalTitle={modalTitle}
      />

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default DriverExpensesBill
