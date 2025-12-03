import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import {
  deleteInventoryApi,
  getInventoryApi,
  patchInventoryApi,
  postInvenotryApi,
} from '../data/data'
import Swal from 'sweetalert2'
import { ToastContainer, toast } from 'react-toastify'
import SearchInput from '../../components/SearchInput'
import AddButton from '../../components/AddButton'
import ReusableModal from '../../components/ReusableModal'

const ProductList = () => {
  const queryClient = useQueryClient()

  const [filteredData, setFilteredData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Modal states
  const [showModalFrom, setShowModalFrom] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingData, setEditingData] = useState(null)

  // Fetch Inventory list
  const { data: InvetoryList, isFetching } = useQuery({
    queryKey: ['InvetoryList', { search: searchQuery, page: currentPage, limit: itemsPerPage }],
    queryFn: getInventoryApi,
    keepPreviousData: true,
  })

  // ========== POST ==========
  const { mutate: postInvenotry, isLoading: isSubmitting } = useMutation({
    mutationFn: postInvenotryApi,
    onSuccess: () => {
      toast.success('Inventory added successfully!')
      queryClient.invalidateQueries({ queryKey: ['InvetoryList'], exact: false })
      setShowModalFrom(false)
    },
    onError: (error) => toast.error(error.message),
  })

  // ========== PATCH ==========
  const { mutate: patchInventory, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, formData }) => patchInventoryApi(id, formData),
    onSuccess: () => {
      toast.success('Inventory updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['InvetoryList'], exact: false })
      setShowModalFrom(false)
      setEditMode(false)
      setEditingData(null)
    },
    onError: (error) => toast.error(error.message),
  })

  // ========== DELETE ==========
  const { mutate: deleteInventory } = useMutation({
    mutationFn: deleteInventoryApi,
    onSuccess: () => {
      toast.success('Inventory deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['InvetoryList'], exact: false })
    },
    onError: (error) => toast.error(error.message),
  })

  // Set filtered data when API returns
  useEffect(() => {
    if (InvetoryList?.data) {
      setFilteredData(InvetoryList.data)
    }
  }, [InvetoryList])

  const totalPages = InvetoryList?.totalPages || 1

  // Table columns
  const columns = [
    { label: 'Product Name', key: 'productName', sortable: true },
    { label: 'Category', key: 'category', sortable: true },
  ]

  // Modal form fields
  const fields = [
    {
      name: 'name',
      label: 'Product Name',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'text',
      required: true,
    },
  ]

  // ========== EDIT BUTTON ==========
  const handleEditButton = (id) => {
    const record = filteredData.find((item) => item.id === id)

    if (!record) {
      toast.error('Record not found!')
      return
    }

    // Convert to modal field format
    const mappedRecord = {
      name: record.productName,
      category: record.category,
      unit: record.weight,
      id: record.id,
    }

    setEditMode(true)
    setEditingData(mappedRecord)
    setShowModalFrom(true)
  }

  // ========== DELETE BUTTON ==========
  const handleDeleteButton = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteInventory(id)
      }
    })
  }

  // Submit form (Add + Edit)
  const handleFormSubmit = (formValues) => {
    if (editMode) {
      patchInventory({ id: editingData.id, formData: formValues })
    } else {
      postInvenotry(formValues)
    }
  }

  return (
    <>
      <ToastContainer />

      <div className="mb-3 d-flex justify-content-end align-items-center gap-2 w-100">
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <AddButton
          label="Add"
          onClick={() => {
            setEditMode(false)
            setEditingData(null)
            setShowModalFrom(true)
          }}
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
        title={editMode ? 'Edit Product' : 'Add New Product'}
        size="xl"
        fields={fields}
        isSubmitting={isSubmitting || isUpdating}
      />

      <Table
        title="Product List"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        editButton={true}
        deleteButton={true}
        handleEditButton={handleEditButton}
        handleDeleteButton={handleDeleteButton}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          const newItems = value === -1 ? filteredData.length : value
          setItemsPerPage(newItems)
          setCurrentPage(1)
        }}
      />
    </>
  )
}

export default ProductList
