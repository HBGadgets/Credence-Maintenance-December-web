import React, { useEffect, useState } from 'react'
import Table from '../components/Table'
import SmartPagination from '../components/SmartPagination'
import SearchInput from '../components/SearchInput'
import DateRangeFilterCredence from '../../components/DateRangeFilterCredence'
import { useParams } from 'react-router-dom'
import Loader from '../../components/Loader/Loader'
import Page404 from '../pages/page404/Page404'
import { VehicleTripsApi } from './data/VehicleListData'

const VehicleTrips = () => {
  const { id } = useParams()
  const [allData, setAllData] = useState([]) // Store full API data
  const [filteredData, setFilteredData] = useState([]) // Store searched/filtered data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch Vehicle Trips
  useEffect(() => {
    const fetchVehicleTrips = async () => {
      try {
        setLoading(true)
        const data = await VehicleTripsApi(id)

        // Ensure data is an array (API returns a single object)
        const formattedData = Array.isArray(data) ? data : [data]

        setAllData(formattedData) // Store the full data separately
        setFilteredData(formattedData) // Initially, show all data
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchVehicleTrips()
  }, [id])

  // Search handler (Filters allData)
  const handleSearch = (query) => {
    setSearchQuery(query)

    if (!query) {
      setFilteredData(allData) // Reset to full data if search is empty
      return
    }

    const filtered = allData.filter(
      (item) =>
        item.driverId?.name?.toLowerCase().includes(query.toLowerCase()) || // Driver Name
        item.startLocation.toLowerCase().includes(query.toLowerCase()) || // Start Location
        item.endLocation.toLowerCase().includes(query.toLowerCase()) || // End Location
        item.status.toLowerCase().includes(query.toLowerCase()) || // Trip Status
        item.budgetAllocated.toString().includes(query) || // Numeric: Convert to String
        item.spentAmount.toString().includes(query), // Numeric: Convert to String
    )
    setFilteredData(filtered)
  }

  // Define table columns (ONLY required fields)
  const columns = [
    { label: 'Trip Route', key: 'startEndLocation', sortable: true }, // Updated column name
    { label: 'Driver Name', key: 'name', sortable: true },
    { label: 'Start Date', key: 'date', sortable: true },
    { label: 'End Date', key: 'date1', sortable: true },
    { label: 'Budget Allocated', key: 'budgetAllocated', sortable: true },
    { label: 'Amount Spent', key: 'spentAmount', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
  ]

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  if (loading) return <Loader />
  if (error) return <Page404 />

  // Creating a variable for the mapped data
  const tableData = filteredData.map((data) => ({
    startEndLocation: `${data.startLocation} → ${data.endLocation}`, // Format as "Mumbai → Pune"
    name: data.driverId?.name || 'N/A',
    date: new Date(data.date).toLocaleDateString('en-GB'), // Converts to dd-mm-yyyy
    date1: new Date(data.date).toLocaleDateString('en-GB'), // Converts to dd-mm-yyyy
    budgetAllocated: data.budgetAllocated,
    spentAmount: data.spentAmount,
    status: (
      <span
        style={{
          color:
            data.status === 'in-progress'
              ? 'orange'
              : data.status === 'completed'
                ? 'green'
                : data.status === 'cancelled'
                  ? 'red'
                  : 'black',
          fontWeight: 'bold',
        }}
      >
        {data.status}
      </span>
    ),
  }))

  return (
    <div>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <DateRangeFilterCredence title="Date Range" />
        <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
      </div>

      <div>
        <Table
          title="Vehicle Trips Logs"
          columns={columns}
          filteredData={tableData} // Using the variable here
          setFilteredData={setFilteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />

        <SmartPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value)
            setCurrentPage(1)
          }}
        />
      </div>
    </div>
  )
}

export default VehicleTrips
