import React, { useState, useEffect } from 'react'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'

const FuelRecords = () => {
  const records = [
    { date: '2025-06-01', consumption: 30, efficiency: 8.2, distance: 246, cost: 3900 },
    { date: '2025-06-05', consumption: 28, efficiency: 8.1, distance: 227, cost: 3640 },
    { date: '2025-06-10', consumption: 32, efficiency: 8.3, distance: 266, cost: 4080 },
    { date: '2025-06-15', consumption: 31, efficiency: 8.0, distance: 248, cost: 4030 },
    { date: '2025-06-20', consumption: 29, efficiency: 8.2, distance: 238, cost: 3850 },
    { date: '2025-06-25', consumption: 27, efficiency: 8.4, distance: 227, cost: 3610 },
    { date: '2025-06-30', consumption: 26, efficiency: 8.1, distance: 211, cost: 3530 },
  ]

  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Consumption (L)', key: 'consumption', sortable: true },
    { label: 'Efficiency (km/L)', key: 'efficiency', sortable: true },
    { label: 'Distance (km)', key: 'distance', sortable: true },
    { label: 'Cost (₹)', key: 'cost', sortable: true },
  ]

  const [filteredData, setFilteredData] = useState(records)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  useEffect(() => {
    setFilteredData(records) // Simulate fetch or filter
  }, [])

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
