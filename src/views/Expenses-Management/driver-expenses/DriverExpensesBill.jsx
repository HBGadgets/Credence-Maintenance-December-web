import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import Page404 from '../../pages/page404/Page404'
import { getDriverBillImageApi, getDriverExpesesListApi } from '../data/data'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import { FcImageFile, FcRemoveImage } from 'react-icons/fc'
import BillModal from '../componet/BillModal'

const DriverExpensesBill = () => {
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState([]) // Store full API data
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Use state for modal
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  // Utility function to format dates (DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date)) return ''
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
  }

  // Function to get badge class based on payment mode
  const getPaymentBadge = (mode) => {
    switch (mode.toLowerCase()) {
      case 'upi':
        return 'badge bg-seccondary' // Green for digital payments
      case 'cash':
        return 'badge bg-success' // Yellow for cash
      case 'card':
        return 'badge bg-warning' // Blue for card payments
      default:
        return 'badge bg-primary' // Default gray for unknown modes
    }
  }

  // Fetch Request list of driver expenses
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const responseData = await getDriverExpesesListApi()
        if (!Array.isArray(responseData)) throw new Error('Invalid API response format')

        console.log('Fetched Driver Expenses Data:', responseData)

        // Format and map data
        const formattedData = responseData.map((item) => ({
          id: item._id, // Add an alias field `id`
          date: formatDate(item.date), // Formatted Date
          driverName: item.driverId?.name || 'Unknown', // Driver Name
          currentVehicleName: item.driverId?.currentVehicleName || 'N/A', // Current Vehicle
          shopName: item.shopName || 'Unknown', // Shop Name
          location: item.location || 'Unknown', // Location
          description: item.description || 'No description', // Expense Description
          amount: item.amount || 0, // Expense Amount
          paymentMode: (
            <span className={getPaymentBadge(item.paymentMode || 'Unknown')}>
              {item.paymentMode || 'Unknown'}
            </span>
          ), // Styled Payment Mode
          action: (
            <div className="d-flex justify-content-center gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                title={item.billImg ? 'View Bill' : 'No Bill Available'}
                onClick={() => handleViewButton(item.billImg)}
              >
                {item.billImg ? <FcImageFile /> : <FcRemoveImage />}
              </button>
            </div>
          ),
        }))

        setData(formattedData)
        setFilteredData(formattedData)
      } catch (err) {
        // If the error is a network error
        if (!err.response) {
          toast.error('Failed to fetch driver expenses data!', { position: 'top-right' })
          setError('Network Error') // Internet/server unreachable
        } else if (err.response.status === 500) {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Search handler (Filters allData)
  const handleSearch = (query) => {
    setSearchQuery(query)

    if (!query) {
      setFilteredData(data) // Reset to full data if search is empty
      return
    }

    const filtered = data.filter(
      (item) => item.driverName.toLowerCase().includes(query.toLowerCase()), // Correct key usage
    )
    setFilteredData(filtered)
  }

  // Handle view button click
  const handleViewButton = async (billImgId) => {
    if (!billImgId) {
      toast.info('No bill image available.')
      return
    }

    try {
      const response = await getDriverBillImageApi(billImgId)

      const { base64Data, contentType } = response

      if (base64Data && contentType) {
        const fileSrc = `data:${contentType};base64,${base64Data}`
        console.log('fileconverssssssss', fileSrc)
        setPdfBase64(fileSrc)

        if (contentType.startsWith('application/pdf')) {
          setModalTitle('Driver Bill (PDF)')
        } else if (contentType.startsWith('image')) {
          setModalTitle('Driver Bill (Image)')
        }

        setShowModal(true)
      } else {
        toast.error('Invalid bill image data.')
      }
    } catch (err) {
      toast.error('Failed to fetch bill image.')
    }
  }

  // Handle Date Range Filter Change
  const handleDateRangeChange = (startDate, endDate) => {
    // If no date range is selected (Clear button is hit)
    if (!startDate || !endDate) {
      setFilteredData(data) // Reset to full data
      return
    }
    // Filter data based on the selected date range
    const filtered = data.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
    })
    setFilteredData(filtered)
  }

  // loader and error
  // if (loading) return <Loader />
  if (error) return <Page404 />

  // Define table columns
  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Current Vehicle Name', key: 'currentVehicleName', sortable: true },
    { label: 'Shop Name', key: 'shopName', sortable: true },
    { label: 'Location', key: 'location', sortable: true },
    { label: 'Description', key: 'description', sortable: true },
    { label: 'Amount', key: 'amount', sortable: true },
    { label: 'Payment Mode', key: 'paymentMode', sortable: true },
    { label: 'Bill Image', key: 'actions', sortable: false },
  ]

  return (
    <div>
      <ToastContainer />

      <div className="mb-2 d-flex justify-content-between align-items-center">
        {/* Left: Date Range Filter */}
        <DateRangeFilterCredence onDateRangeChange={handleDateRangeChange} title="Date Range" />
        <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
      </div>

      <Table
        title="All Drivers Expenses Sheets"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        viewButton={false}
        handleViewButton={handleViewButton}
        isFetching={loading}
        errorMessage={
          error
            ? 'Error fetching driver expenses. Please try again later.'
            : filteredData.length === 0 && !loading
              ? 'No driver expense records found for the selected period.'
              : ''
        }
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* Modal Component */}
      <BillModal
        showModal={showModal}
        setShowModal={setShowModal}
        pdfBase64={pdfBase64}
        modalTitle={modalTitle}
      />
    </div>
  )
}

export default DriverExpensesBill
