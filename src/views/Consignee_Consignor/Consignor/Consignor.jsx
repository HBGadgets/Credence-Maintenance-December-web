import React, { useEffect, useState } from 'react'
import {
  deleteConsignorApi,
  getConsignorApi,
  patchConsignorApi,
  postConsignorApi,
} from '../data/data'
import { ToastContainer, toast } from 'react-toastify'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AddButton from '../../components/AddButton'
import ReusableModal from '../../components/ReusableModal'
import Swal from 'sweetalert2'

const Consignor = () => {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)

  // Modal states
  const [showModalFrom, setShowModalFrom] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingData, setEditingData] = useState(null)

  const { data, isFetching } = useQuery({
    queryKey: [
      'Consignor',
      {
        search: searchQuery,
        page: currentPage,
        limit: itemsPerPage === -1 ? (totalRecords || 10) : itemsPerPage,
      },
    ],
    queryFn: getConsignorApi,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  })

  // ========== POST ==========
  const { mutate: postConsignor, isLoading: isSubmitting } = useMutation({
    mutationFn: postConsignorApi,
    onSuccess: (res) => {
      if (res && (res.status === false || res.success === false)) {
        toast.error(res.message || 'Failed to add consignor')
        return
      }
      toast.success('Consignor added successfully!')
      queryClient.invalidateQueries({ queryKey: ['Consignor'], exact: false })
      setShowModalFrom(false)
    },
    onError: (error) => toast.error(error.message),
  })

  // ========== PATCH ==========
  const { mutate: patchConsignor, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, formData }) => patchConsignorApi(id, formData),
    onSuccess: (res) => {
      if (res && (res.status === false || res.success === false)) {
        toast.error(res.message || 'Failed to update consignor')
        return
      }
      toast.success('Consignor updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['Consignor'], exact: false })
      setShowModalFrom(false)
      setEditMode(false)
      setEditingData(null)
    },
    onError: (error) => toast.error(error.message),
  })

  // ========== DELETE ==========
  const { mutate: deleteConsignor } = useMutation({
    mutationFn: deleteConsignorApi,
    onSuccess: () => {
      toast.success('Consignor deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['Consignor'], exact: false })
    },
    onError: (error) => toast.error(error.message),
  })

  useEffect(() => {
    if (data?.total !== undefined) {
      setTotalRecords(data.total)
    }
    if (data?.data) {
      setFilteredData(data.data)
    }
  }, [data])

  const totalPages =
    itemsPerPage === -1
      ? 1
      : data?.totalPages || (data?.total && itemsPerPage > 0 ? Math.ceil(data.total / itemsPerPage) : 1)

  const columns = [
    { label: 'Consignor Name', key: 'name', sortable: true },
    { label: 'Address', key: 'address', sortable: true },
  ]

  // Modal form fields
  const fields = [
    {
      name: 'name',
      label: 'Consignor Name',
      type: 'text',
      placeholder: 'Enter Consignor Name',
      required: true,
      stringOnly: true,
      alphaOnly: true,
      pattern: '[a-zA-Z\\s]*',
      onChange: (value) => {
        const stringValue = String(value || '').replace(/[^a-zA-Z\s]/g, '')
        return { name: stringValue }
      },
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      placeholder: 'Enter Address',
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
      name: String(record.name || '').replace(/[^a-zA-Z\s]/g, ''),
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
        deleteConsignor(id)
      }
    })
  }

  // Submit form (Add + Edit)
  const handleFormSubmit = (formValues) => {
    const sanitizedData = {
      ...formValues,
      name: String(formValues.name || '').replace(/[^a-zA-Z\s]/g, '').trim(),
      address: String(formValues.address || '').trim(),
    }

    if (editMode) {
      patchConsignor({ id: editingData.id, formData: sanitizedData })
    } else {
      postConsignor(sanitizedData)
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
        title={editMode ? 'Edit Consignor' : 'Add New Consignor'}
        size="xl"
        fields={fields}
        isSubmitting={isSubmitting || isUpdating}
        closeOnSubmit={false}
      />

      <Table
        title="Consignor Details"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        serverPagination={true}
        totalServerItems={data?.total || filteredData.length}
        editButton={true}
        deleteButton={true}
        handleEditButton={handleEditButton}
        handleDeleteButton={handleDeleteButton}
        showPagination={false}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value)
          setCurrentPage(1)
        }}
      />
    </div>
  )
}

export default Consignor
