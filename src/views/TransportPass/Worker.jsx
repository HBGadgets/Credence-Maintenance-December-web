import React, { useContext, useEffect, useState } from 'react'
import {
  deleteWorkerApi,
  getWorkerApi,
  postWorkerApi,
  patchWorkerApi,
  getWorkerProfileApi,
} from './data/data'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Table from '../components/Table'
import SmartPagination from '../components/SmartPagination'
import { toast, ToastContainer } from 'react-toastify'
import AddButton from '../components/AddButton'
import SearchInput from '../components/SearchInput'
import ReusableModal from '../components/ReusableModal'
import Swal from 'sweetalert2'
import SingleSelectDropdown from '../components/SingleSelectDropdown'
import { fetchSupervisor } from '../DriverExpert/data/drivers'
import { TokenContext } from '../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import BillShow from '../components/BillModal/BillShow'

const Worker = () => {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Profile Model
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  // form state
  const [showModalForm, setShowModalForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const queryClient = useQueryClient()

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // Fetch workers
  const { data: workerList = [], isFetching } = useQuery({
    queryKey: ['workerList'],
    queryFn: getWorkerApi,
    staleTime: 1000 * 60 * 30,
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  // Create worker
  const { mutate: addWorker, isLoading: isSubmitting } = useMutation({
    mutationFn: postWorkerApi,
    onSuccess: () => {
      toast.success('Worker added successfully!')
      setShowModalForm(false)
      queryClient.invalidateQueries(['workerList'])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add worker')
    },
  })

  // Update worker
  const { mutate: updateWorker, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, formData }) => patchWorkerApi(id, formData),
    onSuccess: () => {
      toast.success('Worker updated successfully!')
      setShowModalForm(false)
      setEditMode(false)
      setEditingUser(null)
      queryClient.invalidateQueries(['workerList'])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update worker')
    },
  })

  // Delete worker
  const { mutate: deleteWorker } = useMutation({
    mutationFn: deleteWorkerApi,
    onSuccess: () => {
      toast.success('Worker deleted successfully!')
      queryClient.invalidateQueries(['workerList'])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete worker')
    },
  })

  // UseEffect for search and data update
  useEffect(() => {
    let updatedData = workerList

    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      updatedData = updatedData.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    // Apply supervisor filter
    if (selectedName?.value) {
      updatedData = updatedData.filter((worker) => worker.supervisorId === selectedName.value)
    }

    setFilteredData(updatedData)
  }, [workerList, searchQuery, selectedName])

  // table columns
  const columns = [
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Phone', key: 'phone', sortable: true },
    { label: 'Password', key: 'password', sortable: false },
    { label: 'Supervisor Name', key: 'supervisorName', sortable: true },
  ]

  // form fields
  const fields = [
    {
      name: 'profileImage',
      label: 'Profile Image',
      type: 'file',
      accept: 'image/*',
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter Name',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter Email',
      required: true,
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'tel',
      placeholder: 'Enter Phone Number',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter Password',
      required: true,
    },
  ]

  // handle edit
  const handleEditButton = (id) => {
    const record = filteredData.find((item) => item.id === id)
    if (record) {
      setEditMode(true)
      setEditingUser(record)
      setShowModalForm(true)
    }
  }

  // handle delete
  const handleDeleteButton = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteWorker(id)
      }
    })
  }

  // handle submit
  const handleFormSubmit = (formData) => {
    if (editMode && editingUser?.id) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this worker?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Update it',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          updateWorker({ id: editingUser.id, formData })
        }
      })
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to add this worker?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Add it',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          addWorker(formData)
        }
      })
    }
  }

  // handle View
  const handleViewButton = async (id) => {
    const selectedRow = workerList.find((item) => item.id === id)

    if (selectedRow) {
      console.log('idzaazz', id)
      console.log('Profile value:', selectedRow.profileImage)

      try {
        const response = await getWorkerProfileApi(selectedRow.profileImage)
        const { base64Data, contentType } = response

        if (base64Data && contentType) {
          const fileSrc = `data:${contentType};base64,${base64Data}`
          setPdfBase64(fileSrc)
          setModalTitle(
            contentType.startsWith('application/pdf')
              ? 'Profile Image (PDF)'
              : contentType.startsWith('image')
                ? 'Profile Image (Image)'
                : 'Profile Image (File)',
          )
          setShowModal(true)
        } else {
          toast.error('Invalid Profile image data.')
        }
      } catch (error) {
        console.error('Failed to fetch bill image:', error)
        toast.error('No Profile image found.')
      }
    }
  }

  console.log('Comparing supervisor:', {
    selectedValue: selectedName?.value,
    selectedLabel: selectedName?.label,
  })

  return (
    <>
      <ToastContainer />

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-wrap align-items-center gap-2">
          {userRole === 'superadmin' && (
            <div style={{ width: '150px' }}>
              <SingleSelectDropdown
                options={supervisorOptions}
                value={selectedName}
                onChange={setSelectedName}
                isClearable
                placeholder="Filter by Supervisor Name..."
              />
            </div>
          )}
        </div>

        <div className="d-flex justify-content-end align-items-center gap-2 w-100 mb-3">
          <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <AddButton
            label="Add Worker"
            onClick={() => {
              setEditMode(false)
              setEditingUser(null)
              setShowModalForm(true)
            }}
          />
        </div>
      </div>

      <ReusableModal
        show={showModalForm}
        initialData={editMode ? editingUser : null}
        onClose={() => {
          setShowModalForm(false)
          setEditMode(false)
          setEditingUser(null)
        }}
        onSubmit={handleFormSubmit}
        title={editMode ? 'Edit Worker' : 'Add New Worker'}
        size="xl"
        fields={fields}
        isSubmitting={isSubmitting || isUpdating}
      />

      <Table
        title="Workers List"
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
        viewButton={true}
        handleViewButton={handleViewButton}
        viewButtonLabel="Profile"
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

      <BillShow
        showModal={showModal}
        setShowModal={setShowModal}
        pdfBase64={pdfBase64}
        modalTitle={modalTitle}
      />
    </>
  )
}

export default Worker
