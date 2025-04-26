import React, { useEffect, useMemo, useRef, useState } from 'react'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import TripFrom from './componets/TripFrom'
import { useParams } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import { MdOutlineAnalytics } from 'react-icons/md'
import { ToastContainer } from 'react-toastify'
import Page404 from '../../pages/page404/Page404'
import TripViewModal from './componets/TripViewModal'
import {
  fetchTripDataHelper,
  handleAddHelper,
  handleDeleteHelper,
  handleEditHelper,
} from './componets/tripHelpers'

const Trip = () => {
  const [allData, setAllData] = useState([]) // Original fetched data
  const [filteredData, setFilteredData] = useState([]) // Filtered/searched data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const { id } = useParams()
  const isFetchedRef = useRef(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState(null)

  // Fetch trip data
  const fetchTripData = () =>
    fetchTripDataHelper(id, setAllData, setFilteredData, setLoading, setError)

  useEffect(() => {
    if (!isFetchedRef.current) {
      fetchTripData()
      isFetchedRef.current = true
    }
  }, [id])

  // Apply filters based on date range and search query
  const applyFilters = (start, end, query) => {
    let filtered = [...allData]

    if (start && end) {
      filtered = filtered.filter((trip) => {
        const tripDate = new Date(trip.date)
        return tripDate >= new Date(start) && tripDate <= new Date(end)
      })
    }

    if (query) {
      filtered = filtered.filter((trip) =>
        (trip.driverId?.name || '').toLowerCase().includes(query.toLowerCase()),
      )
    }

    setFilteredData(filtered)
  }

  const handleDateRangeChange = (start, end) => {
    console.log('Date range changed:', { start, end })
    setStartDate(start)
    setEndDate(end)
    applyFilters(start, end, searchQuery)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    applyFilters(startDate, endDate, query)
  }

  // Handle add action
  const handleAdd = (formData) => handleAddHelper(formData, fetchTripData)

  // Handle edit action
  const handleEdit = (formData) => handleEditHelper(formData, fetchTripData)

  // Handle delete action
  const handleDelete = (tripId, fieldName) => handleDeleteHelper(tripId, fetchTripData, fieldName)

  // Handle view action
  const handleViewButton = (id) => {
    const trip = allData.find((item) => item._id === id)
    if (trip) {
      setSelectedTrip(trip)
      setShowViewModal(true)
    }
  }

  // show status condition color

  const getStatusBadge = (status) => {
    if (typeof status !== 'string') return // Handle non-string cases

    switch (status?.toLowerCase()) {
      case 'in-progress':
        return 'badge bg-warning text-dark' // Yellow warning
      case 'cancelled':
        return 'badge bg-danger' // Red danger
      case 'completed':
        return 'badge bg-success' // Green success
      default:
        return 'badge bg-secondary' // Default gray
    }
  }

  //  Coloumns for the table
  const columns = [
    { label: 'Start Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Start Location', key: 'startLocation', sortable: true },
    { label: 'End Location', key: 'endLocation', sortable: true },
    { label: 'End Date', key: 'updateDate', sortable: true },
    { label: 'Material Type', key: 'materialType', sortable: true },
    { label: 'Budget Allocated', key: 'budgetAllocated', sortable: true },
    { label: 'Spent Amounts', key: 'spentAmount', sortable: true },
    { label: 'Status', key: 'status', sortable: false },
    { label: 'Actions', key: 'actions', sortable: false },
  ]

  const currentPageData = useMemo(() => {
    const pageData = filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    )

    return pageData.map((data) => ({
      date: new Date(data.date).toLocaleDateString('en-GB'),
      driverName: data.driverId?.name || 'N/A',
      vehicleName:
        typeof data.vehicleName === 'string' ? data.vehicleName : data.vehicleId?.name || 'N/A',
      startLocation: data.startLocation || 'N/A',
      endLocation: data.endLocation || 'N/A',
      materialType: data.materialType || 'N/A',
      updateDate: new Date(data.updatedAt).toLocaleDateString('en-GB'),
      budgetAllocated: data.budgetAllocated ?? 0,
      spentAmount: data.spentAmount ?? 0,
      status: <span className={getStatusBadge(data.status)}>{data.status || 'N/A'}</span>,
      actions: (
        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-sm btn-outline-success"
            title="View Analyatics"
            onClick={() => handleViewButton(data._id)}
          >
            <MdOutlineAnalytics />
          </button>

          <TripFrom
            mode="edit"
            onSubmit={handleEdit}
            initialData={{
              _id: data._id,
              driverId: data.driverId?._id || data.driverId,
              vehicleId: data.vehicleId?._id || data.vehicleId,
              vehicleName: data.vehicleName || data.vehicleId?.name,
              startLocation: data.startLocation,
              endLocation: data.endLocation,
              date: data.date,
              budgetAllocated: data.budgetAllocated,
              materialType: data.materialType,
            }}
            buttonProps={{
              className: 'btn btn-sm btn-outline-primary',
              title: 'Edit Trip', // Tooltip here
            }}
          />

          <button
            className="btn btn-sm btn-outline-danger"
            title="Delete Trip"
            onClick={() => handleDelete(data._id, 'Trip')}
          >
            <FaTrash />
          </button>
        </div>
      ),
    }))
  }, [filteredData, currentPage, itemsPerPage])

  // if (loading) return <Loader />
  if (error) return <Page404 />

  return (
    <div>
      <ToastContainer />

      <div className="mb-3 d-flex justify-content-between align-items-center">
        {/* Left: Date Range Filter */}
        <div className="d-flex align-items-center">
          <DateRangeFilterCredence onDateRangeChange={handleDateRangeChange} title="Date Range" />
        </div>

        {/* Right: Search and Add Button */}
        <div className="d-flex justify-content-end align-items-center gap-2 w-75">
          <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
          <TripFrom mode="add" onSubmit={handleAdd} />
        </div>
      </div>

      <div>
        <Table
          title="Trips Assigned"
          columns={columns}
          filteredData={currentPageData}
          setFilteredData={setFilteredData}
          viewButton={false}
          handleViewButton={handleViewButton}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          mode="edit"
          onSubmit={handleEdit}
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
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value)
            setCurrentPage(1)
          }}
        />
      </div>

      {/* modal */}
      <TripViewModal
        show={showViewModal}
        trip={selectedTrip}
        onClose={() => setShowViewModal(false)}
      />
    </div>
  )
}

export default Trip

{
  /* <span className="mx-2" />
        <TripFrom mode="edit" onSubmit={handleEdit} /> */
}
