/* eslint-disable prettier/prettier */

import React from 'react'
import { useState } from 'react'
import Table from '../../../base/tables/Table'
import Pagination from '../../../base/paginations/Pagination'

const TotalExpenses = () => {
  const title = 'Total Expenses'
  const columns = [
    'Date',
    'Driver',
    'Vehicle No.',
    'Location',
    'Issue Type',
    'Cost (₹)',
    'Service Provider',
  ]

  const initialData = [
    ['2024-12-23', 'ABC', 'V1234', 'NH-9, Toll Plaza', 'Flat Tire', '2000', 'XYZ Services'],
    ['2024-12-24', 'DEF', 'V5678', 'City Center', 'Engine Failure', '3000', 'ABC Services'],
    ['2024-12-03', 'JKL', 'V4729', 'City Center', 'Flat Tire', '2314', 'XYZ Services'],
    ['2024-12-17', 'DEF', 'V2816', 'NH-9, Toll Plaza', 'Battery Issue', '1783', 'PQR Services'],
    ['2024-12-20', 'STU', 'V7132', 'Bus Station', 'Brake Failure', '4529', 'DEF Services'],
    ['2024-12-29', 'VWX', 'V6195', 'Mall Road', 'Oil Leakage', '3654', 'LMN Services'],
    ['2024-12-06', 'MNO', 'V1073', 'Airport', 'Engine Failure', '3184', 'ABC Services'],
    ['2024-12-13', 'PQR', 'V2317', 'Highway-7', 'Flat Tire', '2014', 'XYZ Services'],
    ['2024-12-19', 'ABC', 'V9831', 'NH-9, Toll Plaza', 'Flat Tire', '2789', 'PQR Services'],
    ['2024-12-05', 'DEF', 'V5173', 'City Center', 'Battery Issue', '1934', 'XYZ Services'],
    ['2024-12-24', 'JKL', 'V3829', 'Bus Station', 'Brake Failure', '4218', 'ABC Services'],
    ['2024-12-11', 'GHI', 'V5129', 'Mall Road', 'Oil Leakage', '3129', 'DEF Services'],
    ['2024-12-27', 'MNO', 'V3295', 'Airport', 'Engine Failure', '3291', 'LMN Services'],
    ['2024-12-08', 'PQR', 'V7932', 'Highway-7', 'Flat Tire', '2940', 'XYZ Services'],
    ['2024-12-18', 'ABC', 'V1093', 'NH-9, Toll Plaza', 'Battery Issue', '3021', 'PQR Services'],
    ['2024-12-21', 'STU', 'V6742', 'City Center', 'Brake Failure', '2456', 'DEF Services'],
    ['2024-12-10', 'DEF', 'V8273', 'Bus Station', 'Oil Leakage', '3829', 'ABC Services'],
    ['2024-12-31', 'JKL', 'V4029', 'Mall Road', 'Engine Failure', '4120', 'LMN Services'],
    ['2024-12-01', 'MNO', 'V4195', 'Airport', 'Flat Tire', '2304', 'XYZ Services'],
    ['2024-12-15', 'GHI', 'V8293', 'Highway-7', 'Battery Issue', '2910', 'PQR Services'],
    ['2024-12-07', 'ABC', 'V6192', 'NH-9, Toll Plaza', 'Brake Failure', '2850', 'DEF Services'],
    ['2024-12-14', 'DEF', 'V2109', 'City Center', 'Oil Leakage', '3729', 'LMN Services'],
    ['2024-12-12', 'JKL', 'V6298', 'Bus Station', 'Engine Failure', '4821', 'ABC Services'],
    ['2024-12-09', 'PQR', 'V2319', 'Mall Road', 'Flat Tire', '3718', 'XYZ Services'],
    ['2024-12-16', 'STU', 'V3748', 'Airport', 'Battery Issue', '2948', 'PQR Services'],
    ['2024-12-04', 'DEF', 'V1932', 'Highway-7', 'Brake Failure', '4820', 'DEF Services'],
    ['2024-12-25', 'ABC', 'V1931', 'NH-9, Toll Plaza', 'Oil Leakage', '4190', 'LMN Services'],
    ['2024-12-26', 'MNO', 'V4297', 'City Center', 'Engine Failure', '3812', 'ABC Services'],
    ['2024-12-22', 'PQR', 'V7391', 'Bus Station', 'Flat Tire', '3712', 'XYZ Services'],
    ['2024-12-28', 'JKL', 'V2917', 'Mall Road', 'Battery Issue', '3289', 'PQR Services'],
    ['2024-12-30', 'GHI', 'V1923', 'Airport', 'Brake Failure', '4021', 'DEF Services'],
    ['2024-12-02', 'DEF', 'V6381', 'Highway-7', 'Oil Leakage', '3918', 'LMN Services'],
    ['2024-12-23', 'STU', 'V2837', 'NH-9, Toll Plaza', 'Engine Failure', '2849', 'ABC Services'],
    ['2024-12-03', 'ABC', 'V4029', 'City Center', 'Flat Tire', '3712', 'XYZ Services'],
    ['2024-12-11', 'MNO', 'V1748', 'Bus Station', 'Battery Issue', '4820', 'PQR Services'],
    ['2024-12-29', 'DEF', 'V1093', 'Mall Road', 'Brake Failure', '4817', 'DEF Services'],
    ['2024-12-17', 'GHI', 'V7284', 'Airport', 'Oil Leakage', '3218', 'LMN Services'],
    ['2024-12-19', 'STU', 'V7392', 'Highway-7', 'Engine Failure', '2940', 'ABC Services'],
    ['2024-12-24', 'ABC', 'V1820', 'NH-9, Toll Plaza', 'Flat Tire', '3218', 'XYZ Services'],
    ['2024-12-06', 'DEF', 'V4821', 'City Center', 'Battery Issue', '3829', 'PQR Services'],
    ['2024-12-15', 'MNO', 'V8471', 'Bus Station', 'Brake Failure', '4901', 'DEF Services'],
    ['2024-12-20', 'JKL', 'V1093', 'Mall Road', 'Oil Leakage', '3128', 'LMN Services'],
  ]

  const [data, setData] = useState(initialData)
  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
    // Filter the data based on the "Driver" column (or any column you want)
    const filteredData = initialData.filter((row) =>
      row[1].toLowerCase().includes(e.target.value.toLowerCase()),
    )
    setData(filteredData)
    setCurrentPage(1) // reset the current page to 1 when the filter changes
  }

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = data.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  return (
    <>
      {/* Filter */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filter by Driver"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      {/* Table */}
      <Table title={title} columns={columns} data={currentData} />

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </>
  )
}

export default TotalExpenses
