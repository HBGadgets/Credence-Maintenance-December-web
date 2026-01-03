import React, { useEffect, useState } from 'react'
import {
  deleteConsigneeApi,
  getConsigneeApi,
  patchConsigneeApi,
  postConsigneeApi,
} from '../data/data'
import { ToastContainer, toast } from 'react-toastify'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AddButton from '../../components/AddButton'
import ReusableModal from '../../components/ReusableModal'
import Swal from 'sweetalert2'

const Consignee = () => {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState([])

  // Modal states
  const [showModalFrom, setShowModalFrom] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingData, setEditingData] = useState(null)

  const { data, isFetching } = useQuery({
    queryKey: ['Consignee', { search: searchQuery, page: currentPage, limit: itemsPerPage }],
    queryFn: getConsigneeApi,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  })

  // ========== POST ==========
  const { mutate: postConsignee, isLoading: isSubmitting } = useMutation({
    mutationFn: postConsigneeApi,
    onSuccess: () => {
      toast.success('Consignee added successfully!')
      queryClient.invalidateQueries({ queryKey: ['Consignee'], exact: false })
      setShowModalFrom(false)
    },
    onError: (error) => toast.error(error.message),
  })

  // ========== PATCH ==========
  const { mutate: patchConsignee, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, formData }) => patchConsigneeApi(id, formData),
    onSuccess: () => {
      toast.success('Consignee updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['Consignee'], exact: false })
      setShowModalFrom(false)
      setEditMode(false)
      setEditingData(null)
    },
    onError: (error) => toast.error(error.message),
  })

  // ========== DELETE ==========
  const { mutate: deleteConsignee } = useMutation({
    mutationFn: deleteConsigneeApi,
    onSuccess: () => {
      toast.success('Consignee deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['Consignee'], exact: false })
    },
    onError: (error) => toast.error(error.message),
  })

  useEffect(() => {
    if (data?.data) {
      setFilteredData(data.data)
    }
  }, [data])

  const columns = [
    { label: 'Consignee Name', key: 'name', sortable: true },
    { label: 'Address', key: 'address', sortable: true },
  ]

  // Modal form fields
  const fields = [
    {
      name: 'name',
      label: 'Consignee Name',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      label: 'Address',
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

    // Map the record data to match the form field names
    const mappedRecord = {
      name: record.name,
      address: record.address,
      id: record.id, // Include ID for update operation
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
        deleteConsignee(id)
      }
    })
  }

  // Submit form (Add + Edit)
  const handleFormSubmit = (formValues) => {
    if (editMode) {
      patchConsignee({ id: editingData.id, formData: formValues })
    } else {
      postConsignee(formValues)
    }
  }

  return (
    <div>
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
        title={editMode ? 'Edit Consignee' : 'Add New Consignee'}
        size="xl"
        fields={fields}
        isSubmitting={isSubmitting || isUpdating}
      />

      <Table
        title="Consignee Details"
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

export default Consignee
