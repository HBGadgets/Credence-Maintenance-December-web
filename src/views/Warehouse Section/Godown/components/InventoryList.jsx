import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast, ToastContainer } from 'react-toastify'
import { getWarehouseProfileApi } from '../../data/data'
import SearchInput from '../../../components/SearchInput'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'

const InventoryList = () => {
  const { id } = useParams()

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [filteredData, setFilteredData] = useState([])
  const [wareHouseName, setWareHouseName] = useState('')
  const [location, setLocation] = useState('')

  const { data, isFetching, isError, error } = useQuery({
    queryKey: [
      'warehouseProfile',
      { id, search: searchQuery, page: currentPage, limit: itemsPerPage },
    ],
    queryFn: getWarehouseProfileApi,
    enabled: !!id,
    staleTime: 1000 * 60 * 1, // 1 minute (data is fresh for 1 min)
    cacheTime: 1000 * 60 * 1, // 1 minute (kept in memory after unmount)
  })

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || 'Failed to fetch inventory')
    }
  }, [isError, error])

  useEffect(() => {
    if (data?.data?.length) {
      setWareHouseName(data.data[0].wareHouseName)
      setLocation(data.data[0].location)
      setFilteredData(data.data)
    }
  }, [data])

  const columns = [
    { label: 'Product Name', key: 'productName', sortable: true },
    { label: 'Bags Size', key: 'bagSize', sortable: true },
    { label: 'Total Bags', key: 'totalBags', sortable: true },
    { label: 'Quantity(MT)', key: 'quantityMT', sortable: true },
    // { label: 'Product Total Count MT', key: 'productTotalCountMT', sortable: true },
  ]

  // Handle Edit
  const handleEditButton = (id) => {
    console.log('id', id)
  }

  // Handle Delete
  const handleDeleteButton = (id) => {
    console.log('id', id)
  }

  return (
    <div>
      <ToastContainer />

      <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <h3 className="mb-1">Warehouse Inventory : {wareHouseName || 'Unknown'}</h3>
          <p className="text-muted mb-0">
            <p className="text-muted mb-0">Warehouse Location: {location || 'Unknown'} </p>
          </p>
        </div>

        <div className="mt-2 mt-md-0">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search products..."
          />
        </div>
      </div>

      <Table
        title="Inventory List"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        // editButton={true}
        // deleteButton={true}
        // handleEditButton={handleEditButton}
        // handleDeleteButton={handleDeleteButton}
        serverPagination={true}
      />

      <SmartPagination
        totalPages={data?.totalPages || 1}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value === -1 ? filteredData.length : value)
          setCurrentPage(1)
        }}
      />
    </div>
  )
}

export default InventoryList
