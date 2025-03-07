import React, { useState, useEffect, useMemo } from 'react'
import { useVehicleListData } from './data/VehicleListData'
import Table from '../components/Table'
import { CCol, CRow } from '@coreui/react'
import SingleSelectDropdown from '../components/SingleSelectDropdown'
import SearchInput from '../components/SearchInput'
import { useNavigate } from 'react-router-dom'
import SmartPagination from '../components/SmartPagination'

function VehicleList() {
  const navigate = useNavigate()

  // Extract all necessary states from useVehicleListData
  const {
    vehicles,
    filteredVehicles,
    filterOptions,
    nameFilter, // ✅ Now correctly extracted
    modelFilter,
    categoryFilter,
    setNameFilter,
    setModelFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
  } = useVehicleListData()

  console.log('FILTERED VEHICLE DATA FROM VEHICLE LIST', filteredVehicles)

  // Processed Data
  const initialData = useMemo(
    () =>
      filteredVehicles.map((item) => ({
        name: item.name || 'Unknown Driver',
        model: item.model || 'No Model',
        category: item.category || 'N/A',
        id: item._id || 'No ID',
      })),
    [filteredVehicles],
  )

  const [filteredData, setFilteredData] = useState([])

  // Sync filteredData when initialData updates
  useEffect(() => {
    setFilteredData(initialData)
  }, [initialData])

  console.log('Filtered Data:', filteredData)

  const columns = [
    { label: 'SN', key: 'sn', sortable: true },
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Model', key: 'model', sortable: true },
    { label: 'Category', key: 'category', sortable: true },
    { label: 'View', key: 'view', sortable: true },
  ]

  const handleViewButton = (data) => {
    console.log('SUBMIT HUA', data)
    navigate(`/VehicleProfile/${data}`)
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <CRow>
          <CCol>
            <SingleSelectDropdown
              options={filterOptions.names}
              value={nameFilter}
              onChange={setNameFilter}
              isClearable
              placeholder="Filter by name..."
            />
          </CCol>
          <CCol>
            <SingleSelectDropdown
              options={filterOptions.models}
              value={modelFilter}
              onChange={setModelFilter}
              isClearable
              placeholder="Filter by model..."
            />
          </CCol>
          <CCol>
            <SingleSelectDropdown
              options={filterOptions.categories}
              value={categoryFilter}
              onChange={setCategoryFilter}
              isClearable
              placeholder="Filter by category..."
            />
          </CCol>
        </CRow>

        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <Table
        title="Vehicle"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        viewButton={true}
        handleViewButton={handleViewButton}
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
          if (value === -1) {
            setItemsPerPage(totalItems)
          } else {
            setItemsPerPage(value)
          }
        }}
      />
    </>
  )
}

export default VehicleList
