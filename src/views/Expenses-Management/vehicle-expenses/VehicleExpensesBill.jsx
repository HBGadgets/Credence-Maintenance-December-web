import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import SearchInput from '../../components/SearchInput'
import SmartPagination from '../../components/SmartPagination'
import Loader from '../../../components/Loader/Loader'
import Page404 from '../../pages/page404/Page404'
import Table from '../../components/Table' // Import the correct Table component
import { getVehicleExpesesListApi } from '../data/data'

const VehicleExpensesBill = () => {
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Format Date (DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
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
        }))

        setData(formattedData)
        setFilteredData(formattedData)
      } catch (error) {
        setError(error.message)
        toast.error('Failed to fetch vehicle expenses data!', { position: 'top-right' })
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
    } else {
      const lowerCaseQuery = query.toLowerCase()
      setFilteredData(
        data.filter(
          (item) =>
            item.driverName.toLowerCase().includes(lowerCaseQuery) ||
            item.vehicleName.toLowerCase().includes(lowerCaseQuery) ||
            item.expenseType.toLowerCase().includes(lowerCaseQuery) ||
            item.shopName.toLowerCase().includes(lowerCaseQuery),
        ),
      )
    }
  }

  // Handle view button click
  const handleViewButton = (id) => {
    console.log('Selected Driver Expense ID:', id)
    const vehiclesexpense = data.find((item) => String(item.id) === String(id))

    if (vehiclesexpense) {
      console.log('Selected Driver Expense Details:', vehiclesexpense)
    } else {
      console.warn('Expense not found for ID:', id)
    }
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
  ]

  if (loading) return <Loader />
  if (error) return <Page404 />

  return (
    <div>
      <ToastContainer />
      <div className="mb-2 d-flex justify-content-end align-items-center">
        <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
      </div>

      <Table
        title="All Vehicles Expenses Sheets"
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

export default VehicleExpensesBill
