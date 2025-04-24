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

const MaintenanceLog = () => {
  const { id } = useParams()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Use state for modal
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  // Date range and search
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({})

  const { data: vehicleMaintanceLog = [], isFetching } = useQuery({
    queryKey: ['vehicleMaintanceLog', id],
    queryFn: () => maintenanceLogApi(id),
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  })

  useEffect(() => {
    let filtered = vehicleMaintanceLog

    // Apply date filter
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate)
      const end = new Date(dateRange.endDate)

      filtered = filtered.filter((item) => {
        if (!item.originalDate) return false
        const itemDate = new Date(item.originalDate)
        return itemDate >= start && itemDate <= end
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

    const lowercasedQuery = query.toLowerCase()

    const filtered = vehicleMaintanceLog.filter((item) =>
      Object.values(item).some(
        (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
      ),
    )

    setFilteredData(filtered)
  }

  // Handle Date Range Filter
  const handleDateRangeChange = ({ startDate, endDate }) => {
    setDateRange({ startDate, endDate })

    if (!startDate || !endDate) {
      setFilteredData(vehicleMaintanceLog)
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    const filtered = vehicleMaintanceLog.filter((item) => {
      if (!item.originalDate) return false

      const itemDate = new Date(item.originalDate)
      return itemDate >= start && itemDate <= end
    })

    setFilteredData(filtered)
  }

  // const handleViewButton = async () => {
  //   try {
  //     console.log('vehicle maain log', vehicleMaintanceLog)
  //     const { base64Data, contentType } = await getVehicleBillApi(vehicleMaintanceLog[0].billImg)

  //     // Set modal data and open it
  //     setPdfBase64(`data:${contentType};base64,${base64Data}`)
  //     setModalTitle('Bill Image')
  //     setShowModal(true)
  //   } catch (error) {
  //     console.error('Failed to load bill image:', error)
  //   }
  // }

  const handleViewButton = async (index = null) => {
    let item

    if (index !== null && vehicleMaintanceLog?.[index]) {
      item = vehicleMaintanceLog[index]
    } else {
      item = vehicleMaintanceLog.find((item) => item?.billImg)
    }

    if (!item) {
      toast.warning('No bill image found.')
      return
    }

    const billImgId = item.billImg
    console.log('billl imagessss', billImgId)

    try {
      const { base64Data, contentType } = await getVehicleBillApi(billImgId)
      setPdfBase64(`data:${contentType};base64,${base64Data}`)
      setModalTitle('Bill Image')
      setShowModal(true)
    } catch (error) {
      console.error('Failed to load bill image:', error)
      toast.error('Failed to load bill image.')
    }
  }

  return (
    <>
      <ToastContainer />

      <div className="mb-2 d-flex justify-content-between align-items-center">
        {/* Left: Date Range Filter */}
        <DateRangeFilterCredence onDateRangeChange={handleDateRangeChange} title="Date Range" />
        <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
      </div>

      <Table
        title="Vehicle Maintenance Log"
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
    </>
  )
}

export default MaintenanceLog
