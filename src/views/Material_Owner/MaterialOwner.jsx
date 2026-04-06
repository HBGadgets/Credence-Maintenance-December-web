import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import {
  deleteMaterialOwnerApi,
  getMartialOwnerApi,
  patchMaterialOwnerApi,
  postMartialOwnerApi,
} from './data/data'
import Table from '../components/Table'
import SmartPagination from '../components/SmartPagination'
import { toast, ToastContainer } from 'react-toastify'
import SearchInput from '../components/SearchInput'
import AddButton from '../components/AddButton'
import ReusableModal from '../components/ReusableModal'
import Swal from 'sweetalert2'

const MaterialOwner = () => {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState([])

  // Modal states
  const [showModalFrom, setShowModalFrom] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingData, setEditingData] = useState(null)

  //   get fetch
  const { data, isFetching } = useQuery({
    queryKey: ['Material', { search: searchQuery, page: currentPage, limit: itemsPerPage }],
    queryFn: getMartialOwnerApi,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  })

  // ========== POST ==========
  const { mutate: postMaterial, isLoading: isSubmitting } = useMutation({
    mutationFn: postMartialOwnerApi,
    onSuccess: () => {
      toast.success('Martial Owner added successfully!')
      queryClient.invalidateQueries({ queryKey: ['Material'], exact: false })
      setShowModalFrom(false)
    },
    onError: (error) => toast.error(error.message),
  })

  // ========== PATCH ==========
  const { mutate: patchMaterial, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, formData }) => patchMaterialOwnerApi(id, formData),
    onSuccess: () => {
      toast.success('Material Owner updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['Material'], exact: false })
      setShowModalFrom(false)
      setEditMode(false)
      setEditingData(null)
    },
    onError: (error) => toast.error(error.message),
  })

  // ========== DELETE ==========
  const { mutate: deleteMaterial } = useMutation({
    mutationFn: deleteMaterialOwnerApi,
    onSuccess: () => {
      toast.success('Material Owner deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['Material'], exact: false })
    },
    onError: (error) => toast.error(error.message),
  })

  useEffect(() => {
    if (data?.data) {
      setFilteredData(data.data)
    }
  }, [data])

  const columns = [
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Contact', key: 'contactNumber', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Address', key: 'address', sortable: true },
  ]

  // Modal form fields
  const fields = [
    {
      name: 'name',
      label: 'Material Owner Name',
      type: 'text',
      required: true,
    },
    {
      name: 'contactNumber',
      label: 'Contact',
      type: 'phone',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
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
      contactNumber: record.contactNumber,
      email: record.email,
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
        deleteMaterial(id)
      }
    })
  }

  // Submit form (Add + Edit)
  const handleFormSubmit = (formValues) => {
    if (editMode) {
      patchMaterial({ id: editingData.id, formData: formValues })
    } else {
      postMaterial(formValues)
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
        title="Material Owners"
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

export default MaterialOwner
