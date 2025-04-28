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

    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    // Date Range Filter
    if (dateRange?.startDate && dateRange?.endDate) {
      const start = new Date(dateRange.startDate)
      const end = new Date(dateRange.endDate)

      filtered = filtered.filter((item) => {
        if (!item.date) return false
        const parts = item.date.split('/')
        if (parts.length !== 3) return false

        const itemDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`) // YYYY-MM-DD

        return itemDate >= start && itemDate <= end
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

    const lowercasedQuery = query.toLowerCase()

    const filtered = vehicleMaintanceLog.filter((item) =>
      Object.values(item).some(
        (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
      ),
    )

    setFilteredData(filtered)
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

  return (
    <>
      <ToastContainer />

      <div className="mb-2 d-flex justify-content-between align-items-center">
        {/* Left: Date Range Filter */}
        <DateRangeFilterCredence
          title="Date Range"
          onDateRangeChange={(range) => {
            console.log('Selected Range:', range)
            setDateRange(range)
          }}
        />

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
