/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import Table from '../../../components/Table'
import { driverTripDetails } from '../../data/drivers'
import { useQuery } from '@tanstack/react-query'
import SmartPagination from '../../../components/SmartPagination'
import { useNavigate } from 'react-router-dom'

function DriverTrip({ id }) {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const navigate = useNavigate()

  const { data: DriverTripData = [], isFetching } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => driverTripDetails(id),
    staleTime: 1000 * 60 * 30,
  })

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

  return (
    <>
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
    </>
  )
}

export default DriverTrip
