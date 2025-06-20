import React, { useState, useEffect } from 'react'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'

const FuelRecords = ({ records = [] }) => {
  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Consumption (L)', key: 'consumption', sortable: true },
    { label: 'Distance (km)', key: 'distance', sortable: true },
    { label: 'Driver Fill Up Fuel Cost (₹)', key: 'cost', sortable: true },
  ]

  // Transform raw API records to match table format
  const transformedRecords = records.map((r) => ({
    date: r.date,
    consumption: r.dailyFuelConsumption || 0,
    efficiency: r.efficiency || 0,
    distance: r.distance || 0,
    cost: r.fuelExpenses?.reduce((sum, e) => sum + e.amount, 0) || 0,
  }))

  const [filteredData, setFilteredData] = useState(records)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  useEffect(() => {
    setFilteredData(transformedRecords)
  }, [records])

  return (
    <>
      <div className="mt-4">
        <Table
          title="Fuel Records"
          columns={columns}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
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

export default FuelRecords
