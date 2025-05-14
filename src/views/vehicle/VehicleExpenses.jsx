import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Table from '../components/Table' // Assuming this is your custom Table component
import SmartPagination from '../components/SmartPagination'
import { getVehicleBillApi, maintenanceLogApi } from './data/VehicleListData'
import BillShow from '../components/BillModal/BillShow'
import { toast, ToastContainer } from 'react-toastify'
import SearchInput from '../components/SearchInput'
import DateRangeFilterCredence from '../../components/DateRangeFilterCredence'
import usePdfExporter from '../customhooks/usePdfExporter'
import useExcelExporter from '../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import IconDropdown from '../Supervisor/IconDropdown'

const MaintenanceLog = () => {
  const { id } = useParams()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Use state for modal
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  // Date range and search
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state

  const { data: vehicleMaintanceLog = [], isFetching } = useQuery({
    queryKey: ['vehicleMaintanceLog', id],
    queryFn: () => maintenanceLogApi(id),
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  })

  useEffect(() => {
    let filtered = vehicleMaintanceLog

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
  }, [searchQuery, dateRange, vehicleMaintanceLog])

  console.log('all maintance logsss', vehicleMaintanceLog)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const columns = [
    { label: 'Service Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Shop Name', key: 'shopName', sortable: true },
    { label: 'Expense Type', key: 'expenseType', sortable: true },
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

  // const handleViewButton = (id) => {
  //   const selectedRow = filteredData.find((item) => item.id === id)
  //   if (selectedRow) {
  //     console.log('billImg value:', selectedRow.billImg)
  //   } else {
  //     console.warn('Row not found for id:', id)
  //   }
  // }

  const handleViewButton = async (id) => {
    const selectedRow = filteredData.find((item) => item.id === id)
    if (!selectedRow) {
      return toast.error('Data not found for this ID')
    }

    if (!selectedRow.billImg) {
      return toast.warn('No bill image available for this entry.')
    }

    try {
      const response = await getVehicleBillApi(selectedRow.billImg)
      const { base64Data, contentType } = response

      if (base64Data && contentType) {
        const fileSrc = `data:${contentType};base64,${base64Data}`
        console.log('Vehicle bill image:', fileSrc)
        setPdfBase64(fileSrc)

        if (contentType.startsWith('application/pdf')) {
          setModalTitle('Vehicle Bill (PDF)')
        } else if (contentType.startsWith('image')) {
          setModalTitle('Vehicle Bill (Image)')
        } else {
          setModalTitle('Vehicle Bill (File)')
        }

        setShowModal(true)
      } else {
        toast.error('Invalid bill image data.')
      }
    } catch (error) {
      console.error('Failed to fetch bill image:', error)
      toast.error('No bill image Found.')
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
          title: 'Vehicle Expense Report',
          columns: columns,
          data: cleanedData,
          fileName: 'Vehicle_Expenses_Report',
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
          title: 'Vehicle Expenses Report',
          columns: columns,
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
        title="Vehicle Expenses"
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

export default MaintenanceLog
