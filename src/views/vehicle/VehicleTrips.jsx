import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getVehicleSubTripApi, getVehicleTripsByIdAPI } from './data/VehicleListData'
import Table from '../components/Table'
import SmartPagination from '../components/SmartPagination'

const VehicleTrips = () => {
  const { id } = useParams()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const { data: vehicleTrips = [], isFetching } = useQuery({
    queryKey: ['vehicleTrips', id],
    queryFn: () => getVehicleTripsByIdAPI(id),
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  })

  useEffect(() => {
    const styledData = vehicleTrips.map((data) => ({
      ...data,
      status: (
        <span
          style={{
            backgroundColor:
              data.status === 'in-progress'
                ? '#f5a623' // orange
                : data.status === 'completed'
                  ? '#28a745' // green
                  : data.status === 'cancelled'
                    ? '#dc3545' // red
                    : '#6c757d', // gray no data found
            color: 'white',
            padding: '4px 10px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            display: 'inline-block',
            textTransform: 'capitalize',
          }}
        >
          {data.status}
        </span>
      ),
    }))
    setFilteredData(styledData)
  }, [vehicleTrips])

  console.log('vehicleTripsssssssssss', vehicleTrips)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  //   Tables columns
  const columns = [
    { label: 'Trip ID', key: 'id', sortable: true },
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Start Location', key: 'startLocation', sortable: true },
    { label: 'End Location', key: 'endLocation', sortable: true },
    { label: 'Budget Allocated', key: 'budgetAllocated', sortable: true },
    { label: 'Spent Amount', key: 'spentAmount', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
  ]

  // Handle View Button
  const handleViewButton = async (id) => {
    console.log('Trip ID passed to View Button:', id) // <- You should see the correct _id here
    try {
      const subTripData = await getVehicleSubTripApi(id)
      console.log('Sub Trip Data:', subTripData)
    } catch (error) {
      console.error('Error fetching sub trip data:', error)
    }
  }

  return (
    <>
      <Table
        title="Vehicle Trips"
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
          setItemsPerPage(value)
          setCurrentPage(1)
          if (value === -1) {
            setItemsPerPage(filteredData.length)
          }
        }}
      />
    </>
  )
}

export default VehicleTrips
