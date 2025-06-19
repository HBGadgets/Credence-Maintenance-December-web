import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import { deleteSubtripApi, getSubTripsApi, patchSubtripApi, postSubtripApi } from '../../data/data'
import SearchInput from '../../../components/SearchInput'
import DateRangeFilterCredence from '../../../../components/DateRangeFilterCredence'
import AddButton from '../../../components/AddButton'
import ReusableModal from '../../../components/ReusableModal'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'

const TableSubTrip = () => {
  const queryClient = useQueryClient()

  const { id } = useParams()
  console.log('ids', id)

  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isFetching, setIsFetching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // from state
  const [showModalFrom, setShowModalFrom] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [submitEdit, setSubmitEdit] = useState(false)

  const { data: subtripData = {}, isLoading } = useQuery({
    queryKey: ['subtrips', id],
    queryFn: () => getSubTripsApi(id),
    enabled: !!id,
  })

  useEffect(() => {
    if (subtripData.subTrips) {
      setFilteredData(subtripData.subTrips)
    }
  }, [subtripData])

  // ADD Subtrip
  const { mutate: createSubtrip, isPending: isSubmitting } = useMutation({
    mutationFn: ({ id, data }) => postSubtripApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['subtrips', id])
      setShowModalFrom(false)
      Swal.fire('Success', 'Subtrip created successfully', 'success')
    },
    onError: (error) => {
      Swal.fire('Error', error.message || 'Failed to create subtrip', 'error')
    },
  })

  // EDIT Subtrip
  const { mutate: updateSubtrip, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => patchSubtripApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['subtrips', id])
      setShowModalFrom(false)
      Swal.fire('Updated', 'Subtrip updated successfully', 'success')
    },
    onError: (error) => {
      Swal.fire('Error', error.message || 'Failed to update subtrip', 'error')
    },
  })

  // DELETE Subtrip
  const { mutate: deleteSubtrip } = useMutation({
    mutationFn: deleteSubtripApi,
    onSuccess: () => {
      queryClient.invalidateQueries(['subtrips', id])
      Swal.fire('Deleted!', 'Subtrip deleted successfully', 'success')
    },
    onError: (error) => {
      Swal.fire('Error', error.message || 'Failed to delete subtrip', 'error')
    },
  })

  // the fields
  const field = [
    ...(!editMode
      ? [
          {
            name: 'date',
            label: 'Date',
            type: 'date',
            placeholder: 'Enter Date',
            required: true,
          },
          {
            name: 'startLocation',
            label: 'Start Location',
            type: 'text',
            placeholder: 'Enter Start Location',
            required: true,
          },
          {
            name: 'endLocation',
            label: 'End Location',
            type: 'text',
            placeholder: 'Enter End Location',
            required: true,
          },
          {
            name: 'budgetAllocated',
            label: 'Budget Allocated',
            type: 'number',
            placeholder: 'Enter Budget Allocated',
            required: true,
          },
          {
            name: 'companyName',
            label: 'Company Name',
            type: 'text',
            placeholder: 'Enter Company Name',
          },
          {
            name: 'materialType',
            label: 'Material Type',
            type: 'text',
            placeholder: 'Enter Material Type',
          },
        ]
      : [
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: '', label: 'Select status', disabled: true },
              { value: 'completed', label: 'Completed Subtrip' },
              { value: 'cancelled', label: 'Cancelled Subtrip' },
            ],
          },
        ]),
  ]

  // Columns for reusable Table component
  const columns = [
    { label: 'Date', key: 'date' },
    { label: 'Company Name', key: 'companyName' },
    { label: 'Start Route', key: 'startLocation' },
    { label: 'End Route', key: 'endLocation' },
    {
      label: 'Budget',
      key: 'budgetAllocated',
      render: (row) => `₹${row.budgetAllocated}`,
    },
    {
      label: 'Status',
      key: 'status',
      render: (row) => <span style={getStatusStyle(row.status)}>{row.status}</span>,
    },
    { label: 'Material', key: 'materialType', render: (row) => row.materialType || '-' },
  ]

  const getStatusStyle = (status) => {
    return {
      display: 'inline-block',
      minWidth: '70px',
      padding: '1px 8px',
      borderRadius: '10px',
      textAlign: 'center',
      textTransform: 'capitalize',
      fontWeight: '400',
      backgroundColor:
        status === 'in-progress'
          ? '#f5a623'
          : status === 'completed'
            ? '#28a745'
            : status === 'cancelled'
              ? '#dc3545'
              : '#6c757d',
      color: 'white',
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true)
      try {
        // Fetch data using the ID from URL parameters
        const data = await getSubTripsApi(id)
        setFilteredData(data.subTrips) // Use the subtrips from the response
      } catch (error) {
        console.error('Error fetching subtrips:', error)
      } finally {
        setIsFetching(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id]) // Add id as dependency

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // handle edit
  const handleEditButton = (id) => {
    const record = filteredData.find((item) => item.id === id)
    if (record) {
      setEditMode(true)
      setEditingUser({
        ...record,
        date: new Date(record.orginalDate).toISOString().split('T')[0], // convert to yyyy-mm-dd
      })
      setShowModalFrom(true)
    }
  }

  // handle delete
  const handleDeleteButton = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this subtrip?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSubtrip(id)
      }
    })
  }

  const handleFormSubmit = (formData) => {
    console.log('Form Data:', formData) // Debug
    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      console.log(`${key}:`, value) // Debug individual fields
      data.append(key, value)
    })

    if (editMode && editingUser?.id) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this subtrip?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          updateSubtrip({ id: editingUser.id, data })
        }
      })
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to create this subtrip?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, create it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          createSubtrip({ id, data })
        }
      })
    }
  }

  // handle date
  const handleDateRangeChange = (id) => {
    console.log('date', id)
  }

  // handle search
  const handleSearch = (id) => {
    console.log('search', id)
  }

  return (
    <div>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
        </div>
        <div className="d-flex justify-content-end align-items-center gap-2 w-75">
          <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />

          <AddButton
            label="Add Subtrip"
            // icon={<FaPlus />}
            onClick={() => {
              setEditMode(false)
              setSubmitEdit(false)
              setEditingUser(null)
              setShowModalFrom(true)
            }}
          />
        </div>
      </div>

      <ReusableModal
        show={showModalFrom}
        initialData={editMode ? editingUser : null}
        onClose={() => {
          setShowModalFrom(false)
          setEditMode(false)
          setEditingUser(null)
        }}
        onSubmit={handleFormSubmit}
        title={editMode ? 'Edit Subtrip' : 'Add Subtrip'}
        size="xl"
        fields={field}
        isSubmitting={isSubmitting || isUpdating}
      />

      <Table
        title="Subtrips Trips"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        editButton={true}
        handleEditButton={handleEditButton}
        deleteButton={true}
        handleDeleteButton={handleDeleteButton}
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
  )
}

export default TableSubTrip
