import React, { useState, useEffect } from 'react'
import Table from '../components/Table'
import SmartPagination from '../components/SmartPagination'
import { fetchDrivers } from './data/drivers'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

function DriversPage() {
  // const [isFetching, setIsFetching] = useState(true)
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const navigate = useNavigate()

  const { data: drivers = [], isFetching } = useQuery({
    queryKey: ['drivers'],
    queryFn: fetchDrivers,
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
  })

  useEffect(() => {
    setFilteredData(drivers)
  }, [drivers])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleViewButton = (id) => {
    navigate(`/DriverProfile/${id}`)
  }

  const columns = [
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Contact Number', key: 'contactNumber', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Password', key: 'password', sortable: false },
  ]

  return (
    <>
      <Table
        title="Drivers"
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

export default DriversPage
