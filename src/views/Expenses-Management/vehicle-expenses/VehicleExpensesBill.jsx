import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import SearchInput from '../../components/SearchInput'
import SmartPagination from '../../components/SmartPagination'
import Page404 from '../../pages/page404/Page404'
import Table from '../../components/Table' // Import the correct Table component
import { getVehicleBillImageApi, getVehicleExpesesListApi } from '../data/data'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import { FcImageFile, FcRemoveImage } from 'react-icons/fc'
import BillShow from '../../components/BillModal/BillShow'

const VehicleExpensesBill = () => {
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
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

  // Get Payment Mode Badge Color
  const getPaymentBadge = (mode) => {
    switch (mode.toLowerCase()) {
      case 'upi':
        return 'badge bg-secondary' // Corrected class
      case 'cash':
        return 'badge bg-success'
      case 'card':
        return 'badge bg-warning'
      default:
        return 'badge bg-primary'
    }
  }

  // Fetch Vehicle Expenses Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const responseData = await getVehicleExpesesListApi()
        if (!Array.isArray(responseData)) throw new Error('Invalid API response format')

        console.log('Fetched Driver Expenses Data:', responseData)

        // Format API data
        const formattedData = responseData.map((item) => ({
          id: item._id, // Add an alias field `id`
          date: formatDate(item.date),
          // rawDate: item.date,
          vehicleName: item.vehicleName || 'Unknown',
          driverName: item.driverId?.name || 'Unknown',
          shopName: item.vendor || 'Unknown',
          expenseType: item.expenseType || 'Unknown',
          description: item.description || 'No description',
          amount: item.amount || 0,
          paymentMode: (
            <span className={getPaymentBadge(item.paymentMode || 'Unknown')}>
              {item.paymentMode || 'Unknown'}
            </span>
          ),
          billImg: (
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

  // Search Function
  const handleSearch = (query) => {
    setSearchQuery(query)
    if (!query) {
      setFilteredData(data)
      return
    }
    const filtered = data.filter(
      (item) =>
        item.driverName.toLowerCase().includes(lowerCaseQuery) ||
        item.vehicleName.toLowerCase().includes(lowerCaseQuery) ||
        item.expenseType.toLowerCase().includes(lowerCaseQuery) ||
        item.shopName.toLowerCase().includes(lowerCaseQuery),
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
      const response = await getVehicleBillImageApi(billImgId)

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
    if (!startDate || !endDate) {
      setFilteredData(data)
      return
    }

    // Convert the start and end dates to Date objects
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Filter the data using Date object comparison
    const filtered = data.filter((item) => {
      const itemDateParts = item.date.split('/') // Assuming formatDate gives DD/MM/YYYY
      const itemDate = new Date(`${itemDateParts[2]}-${itemDateParts[1]}-${itemDateParts[0]}`) // Convert to YYYY-MM-DD
      return itemDate >= start && itemDate <= end
    })

    setFilteredData(filtered)
  }

  // Define Table Columns
  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Shop Name', key: 'shopName', sortable: true },
    { label: 'Expense Type', key: 'expenseType', sortable: true },
    { label: 'Description', key: 'description', sortable: true },
    { label: 'Amount', key: 'amount', sortable: true },
    { label: 'Payment Mode', key: 'paymentMode', sortable: false },
    { label: 'Bill Image', key: 'billImg', sortable: false },
  ]

  // if (loading) return <Loader />
  if (error) return <Page404 />

  return (
    <div>
      <ToastContainer />

      <div className="mb-2 d-flex justify-content-between align-items-center">
        {/* Left: Date Range Filter */}
        <DateRangeFilterCredence onDateRangeChange={handleDateRangeChange} title="Date Range" />
        <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
      </div>

      <Table
        title="All Vehicles Expenses Sheets"
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
      <BillShow
        showModal={showModal}
        setShowModal={setShowModal}
        pdfBase64={pdfBase64}
        modalTitle={modalTitle}
      />
    </div>
  )
}

export default VehicleExpensesBill
