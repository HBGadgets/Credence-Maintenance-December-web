import React, { useEffect, useState } from 'react'
import SmartPagination from '../../../components/SmartPagination'
import Table from '../../../components/Table'
import { CContainer } from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { driverTripDetails } from '../../data/drivers'
import { useQuery } from '@tanstack/react-query'
import SearchInput from '../../../components/SearchInput'

const TripLogs = () => {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state

  const navigate = useNavigate()
  const { id } = useParams()

  const { data: DriverTripData = [], isFetching } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => driverTripDetails(id),
    staleTime: 1000 * 60 * 30,
  })

  useEffect(() => {
    let updatedData = [...DriverTripData] // Start with all vehicles

    // Filter by date range if available
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.orginalDate)
        return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
      })
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      updatedData = updatedData.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    setFilteredData(updatedData)
  }, [DriverTripData, dateRange, searchQuery])

  useEffect(() => {
    console.log('Driver Trip Data', DriverTripData)
    setFilteredData(DriverTripData)
  }, [DriverTripData])

  const handleViewButton = (id) => {
    console.log('View button clicked for ID:', id)
    navigate(`/SubTrips/${id}`)
  }

  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Start Location', key: 'startLocation', sortable: true },
    { label: 'End Location', key: 'endLocation', sortable: true },
    { label: 'Budget Allocated', key: 'budgetAllocated', sortable: true },
    { label: 'Spent Amount', key: 'spentAmount', sortable: true },
    { label: 'Material Type', key: 'materialType', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
  ]

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Pagination: Slice the data for current page
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  return (
    <>
      <CContainer className="px-2" fluid>
        <div className="mb-2 d-flex justify-content-between align-items-center">
          <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
        </div>

        <Table
          title="Driver Trip"
          columns={columns}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          isFetching={isFetching}
          viewButton={true}
          handleViewButton={handleViewButton}
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
      </CContainer>
    </>
  )
}

export default TripLogs
