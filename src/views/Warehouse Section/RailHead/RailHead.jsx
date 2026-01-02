import React, { useEffect, useState } from 'react'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { useQuery } from '@tanstack/react-query'
import { getRailHeadApi } from '../data/data'
import { ToastContainer } from 'react-toastify'

const RailHead = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState([])

  const { data, isFetching } = useQuery({
    queryKey: ['RailHead', { search: searchQuery, page: currentPage, limit: itemsPerPage }],
    queryFn: getRailHeadApi,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  })

  useEffect(() => {
    if (data?.data) {
      setFilteredData(data.data)
    }
  }, [data])

  const columns = [
    { label: 'Date', key: 'createdAt', sortable: true },
    { label: 'Product Name', key: 'productName', sortable: true },
    { label: 'Quantity (Kg)', key: 'quantityKg', sortable: true },
    { label: 'Bag Size (Kg)', key: 'bagSize', sortable: true },
    { label: 'Total Bags', key: 'totalBags', sortable: true },
  ]

  return (
    <div>
      <ToastContainer />

      <div className="mb-4 d-flex justify-content-end">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search products..."
        />
      </div>

      <Table
        title="Rail Head Inventory"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
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

export default RailHead
