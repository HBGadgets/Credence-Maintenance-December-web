import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { getTripListApi } from '../data/data'
import {
  fetchTripDataHelper,
  getStatusBadge,
  handleAddHelper,
  handleDeleteHelper,
  handleEditHelper,
} from './componets/tripHelpers'
import ModalTrips from './ModalTrips'
import { Button } from 'react-bootstrap'
import SearchInput from '../../components/SearchInput'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import { useNavigate } from 'react-router-dom'

const Trip = () => {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state
  const navigate = useNavigate()

  // Fetch Data
  const {
    data: TripsList = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['TripsList'],
    queryFn: getTripListApi,
    staleTime: 1000 * 60 * 30,
  })

  useEffect(() => {
    let filtered = TripsList

    // Filter by date range if available
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.orginalDate)
        return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
      })
    }

    // Apply search query filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    // Apply status badge styling to the filtered data
    const styledData = filtered.map((data) => ({
      ...data,
      status: <span className={getStatusBadge(data.status)}>{data.status}</span>,
    }))

    setFilteredData(styledData)
  }, [TripsList, dateRange, searchQuery])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const columns = [
    { label: 'Trip ID', key: 'tripId', sortable: false, hidden: true },
    { label: 'Start Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Start Location', key: 'startLocation', sortable: true },
    { label: 'End Location', key: 'endLocation', sortable: true },
    { label: 'Budget Allocated', key: 'budgetAllocated', sortable: true },
    { label: 'Spent Amount', key: 'spentAmount', sortable: true },
    { label: 'Material Type', key: 'materialType', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
  ]

  // Handle Search
  const handleSearch = (query) => setSearchQuery(query)

  // Handle Date Range Change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }

  // Handle Add Button Click
  const handleAdd = () => {
    setModalMode('add')
    setSelectedTrip(null) // Clear any selected trip data
    setIsModalOpen(true)
  }

  // Handle Edit Button Click
  const handleEditButton = (id) => {
    const selectedTrip = filteredData.find((trip) => trip.id === id)

    if (selectedTrip) {
      setModalMode('edit')
      setSelectedTrip(selectedTrip)
      setIsModalOpen(true)
    }
    console.log('Edit button clicked for Trip ID:', selectedTrip)
  }

  // Handle Submit button
  const handleSubmit = async (data) => {
    if (modalMode === 'add') {
      await handleAddHelper(data, refetch)
      await refetch()
    } else if (modalMode === 'edit') {
      await handleEditHelper(data, refetch)
      await refetch()
    }
    setIsModalOpen(false)
  }

  // Handle Delete button
  const handleDeleteButton = (id, fieldName) => {
    handleDeleteHelper(id, refetch, fieldName)
  }

  // Handle View button
  const handleViewButton = (id) => {
    console.log('trip id ', id)
    navigate(`/SubTrips/${id}`)
  }

  return (
    <>
      <div>
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
          </div>
          <div className="d-flex justify-content-end align-items-center gap-2 w-75">
            <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
            {/* Add Button */}
            <Button variant="primary" onClick={handleAdd}>
              Add Trip
            </Button>
          </div>
        </div>

        {/* Trip Modal (for Add or Edit) */}
        {isModalOpen && (
          <ModalTrips
            mode={modalMode}
            selectedTrip={selectedTrip}
            onClose={() => setIsModalOpen(false)} // Close modal
            onSubmit={handleSubmit} // Submit handler
          />
        )}

        <Table
          title="All Vehicles Trips"
          columns={columns}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          viewButton={true}
          handleViewButton={handleViewButton}
          editButton={true}
          handleEditButton={handleEditButton}
          deleteButton={true}
          handleDeleteButton={handleDeleteButton}
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
      </div>
    </>
  )
}

export default Trip
