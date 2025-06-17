import React, { useState, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Table from '../components/Table'
import SmartPagination from '../components/SmartPagination'
import { getVehicleBillApi, maintenanceLogApi } from './data/VehicleListData'
import BillShow from '../components/BillModal/BillShow'
import { toast, ToastContainer } from 'react-toastify'
import SearchInput from '../components/SearchInput'
import DateRangeFilterCredence from '../../components/DateRangeFilterCredence'
import usePdfExporter from '../customhooks/usePdfExporter'
import useExcelExporter from '../customhooks/useExcelExporter'
import { FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import IconDropdown from '../Supervisor/IconDropdown'

const MaintenanceLog = () => {
  const { id } = useParams()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()

  // State for pagination, modal, search, and date range
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })

  // Fetch maintenance logs using React Query
  const { data: vehicleMaintanceLog = [], isFetching } = useQuery({
    queryKey: ['vehicleMaintanceLog', id],
    queryFn: () => maintenanceLogApi(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  })

  // Memoized filtered data to prevent unnecessary recalculations
  const filteredData = useMemo(() => {
    if (!Array.isArray(vehicleMaintanceLog)) return []

    let filtered = [...vehicleMaintanceLog]

    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    // Apply date range filter
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.originalDate)
        return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
      })
    }

    // Style paymentMode column
    return filtered.map((data) => ({
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

      coordinate:
        data.lat !== 'No latitude' && data.long !== 'No Longitude'
          ? `${data.lat}, ${data.long}`
          : 'No coordinates',
    }))
  }, [vehicleMaintanceLog, searchQuery, dateRange])

  // Memoized total pages
  const totalPages = useMemo(
    () => Math.ceil(filteredData.length / itemsPerPage),
    [filteredData, itemsPerPage],
  )

  // Memoized table columns
  const columns = useMemo(
    () => [
      { label: 'Service Date', key: 'date', sortable: true },
      { label: 'Driver Name', key: 'driverName', sortable: true },
      { label: 'Shop Name', key: 'shopName', sortable: true },
      { label: 'Expense Type', key: 'expenseType', sortable: true },
      { label: 'Description', key: 'description', sortable: true },
      { label: 'Location', key: 'location', sortable: true },
      { label: 'Co-ordinate', key: 'coordinate', sortable: true },
      { label: 'Amount', key: 'amount', sortable: true },
      { label: 'Payment Mode', key: 'paymentMode', sortable: false },
    ],
    [],
  )

  // Handlers
  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }, [])

  const handleViewButton = useCallback(
    async (id) => {
      const selectedRow = filteredData.find((item) => item.id === id)
      if (!selectedRow) {
        toast.error('Data not found for this ID')
        return
      }

      if (!selectedRow.billImg) {
        toast.warn('No bill image available for this entry.')
        return
      }

      try {
        const response = await getVehicleBillApi(selectedRow.billImg)
        const { base64Data, contentType } = response

        if (base64Data && contentType) {
          const fileSrc = `data:${contentType};base64,${base64Data}`
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
        toast.error('No bill image found.')
      }
    },
    [filteredData],
  )

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
  }, [])

  const handleItemsPerPageChange = useCallback(
    (value) => {
      setItemsPerPage(value === -1 ? filteredData.length : value)
      setCurrentPage(1)
    },
    [filteredData.length],
  )

  // Memoized dropdown items for export
  const dropdownItems = useMemo(
    () => [
      {
        icon: FaRegFilePdf,
        label: 'Download PDF',
        onClick: () => {
          const cleanedData = filteredData.map(({ paymentMode, ...rest }) => ({
            ...rest,
            paymentMode:
              typeof paymentMode === 'string' ? paymentMode : paymentMode?.props?.children || '',
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
          const cleanedData = filteredData.map(({ paymentMode, ...rest }) => ({
            ...rest,
            paymentMode:
              typeof paymentMode === 'string' ? paymentMode : paymentMode?.props?.children || '',
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
    ],
    [filteredData, columns, exportToPDF, exportToExcel],
  )

  return (
    <>
      <ToastContainer />
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
        <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
      </div>
      <Table
        title="Vehicle Expenses"
        columns={columns}
        filteredData={filteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        viewButton={true}
        handleViewButton={handleViewButton}
        isFetching={isFetching}
      />
      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
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
