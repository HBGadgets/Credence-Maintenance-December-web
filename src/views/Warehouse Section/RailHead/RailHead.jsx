import React, { useEffect, useState } from 'react'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getRailHeadApi, patchRailHeadApi } from '../data/data'
import { toast, ToastContainer } from 'react-toastify'
import ReusableModal from '../../components/ReusableModal'

const RailHead = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState([])

  const [showModalFrom, setShowModalFrom] = useState(false) // Fixed variable name
  const [editMode, setEditMode] = useState(false) // Fixed variable name
  const [editingData, setEditingData] = useState(null) // Fixed variable name

  // Add QueryClient
  const queryClient = useQueryClient()

  const { data, isFetching } = useQuery({
    queryKey: ['RailHead', { search: searchQuery, page: currentPage, limit: itemsPerPage }],
    queryFn: getRailHeadApi,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 10,
  })

  // ========== PATCH MUTATION ==========
  const { mutate: patchRailHead, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, formData }) => patchRailHeadApi(id, formData),
    onSuccess: () => {
      toast.success('Railhead Inventory updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['RailHead'] })
      setShowModalFrom(false)
      setEditMode(false)
      setEditingData(null)
    },
    onError: (error) => {
      toast.error(error.message || 'Update failed')
    },
  })

  useEffect(() => {
    if (data?.data) {
      setFilteredData(data.data)
    }
  }, [data])

  const columns = [
    { label: 'Date', key: 'createdAt', sortable: true },
    { label: 'Product Name', key: 'productName', sortable: true },
    { label: 'Quantity', key: 'quantityKg', sortable: true },
    { label: 'Bag Size (Kg)', key: 'bagSize', sortable: true },
    { label: 'Total Bags', key: 'totalBags', sortable: true },
  ]

  // Modal form fields - Fixed field names
  const fields = [
    {
      name: 'productName',
      label: 'Product Name',
      type: 'text',
      required: true,
    },
    {
      name: 'quantityKg',
      label: 'Quantity',
      type: 'text',
      required: true,
    },
    {
      name: 'bagSize',
      label: 'Bag Size (Kg)',
      type: 'text',
      required: true,
    },
    {
      name: 'totalBags',
      label: 'Total Bags',
      type: 'text',
      required: true,
    },
  ]

  // ========== EDIT BUTTON ==========
  const handleEditButton = (id) => {
    const record = filteredData.find((item) => item._id === id || item.id === id) // Check both _id and id

    if (!record) {
      toast.error('Record not found!')
      return
    }

    // Map the record data to match the form field names
    const mappedRecord = {
      productName: record.productName,
      quantityKg: record.quantityKg,
      bagSize: record.bagSize,
      totalBags: record.totalBags,
      id: record._id || record.id, // Use _id if it exists, otherwise use id
    }

    setEditMode(true)
    setEditingData(mappedRecord)
    setShowModalFrom(true)
  }

  // Submit form (Edit only)
  const handleFormSubmit = (formValues) => {
    if (editMode && editingData?.id) {
      // Create proper form data object matching your API expectations
      const formData = {
        productName: formValues.productName,
        quantityKg: Number(formValues.quantityKg),
        bagSize: Number(formValues.bagSize),
        totalBags: Number(formValues.totalBags),
      }

      patchRailHead({
        id: editingData.id,
        formData: formData,
      })
    }
  }

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

      <ReusableModal
        show={showModalFrom}
        initialData={editMode ? editingData : null}
        onClose={() => {
          setShowModalFrom(false)
          setEditMode(false)
          setEditingData(null)
        }}
        onSubmit={handleFormSubmit}
        title={editMode ? 'Edit Railhead Inventory' : 'Add New Railhead Inventory'}
        size="xl"
        fields={fields}
        isSubmitting={isUpdating} // Use isUpdating instead of isSubmitting
      />

      <Table
        title="Rail Head Inventory"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        editButton={true}
        handleEditButton={handleEditButton}
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
