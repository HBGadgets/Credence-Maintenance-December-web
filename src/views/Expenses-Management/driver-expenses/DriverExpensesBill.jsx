import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import Loader from '../../../components/Loader/Loader'
import Page404 from '../../pages/page404/Page404'
import { getDriverExpesesListApi } from '../data/data'

const DriverExpensesBill = () => {
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState([]) // Store full API data
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Utility function to format dates (DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
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
        }))

        setData(formattedData)
        setFilteredData(formattedData)
      } catch (error) {
        setError(error.message)
        toast.error('Failed to fetch driver expenses data!', { position: 'top-right' })
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
  const handleViewButton = (id) => {
    console.log('Selected Driver Expense ID:', id)
    const expense = data.find((item) => String(item.id) === String(id))

    if (expense) {
      console.log('Selected Driver Expense Details:', expense)
    } else {
      console.warn('Expense not found for ID:', id)
    }
  }

  if (loading) return <Loader />
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
  ]

  return (
    <div>
      <ToastContainer />

      <div className="mb-2 d-flex justify-content-end align-items-center">
        <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
      </div>

      <Table
        title="All Drivers Expenses Sheets"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        viewButton={true}
        handleViewButton={handleViewButton}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  )
}

export default DriverExpensesBill
