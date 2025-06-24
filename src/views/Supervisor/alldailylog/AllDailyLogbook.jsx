import React, { useEffect, useState } from 'react'
import {
  deleteAllDriverDailyLogbookApi,
  getAllDriverDailyLogbookApi,
  getAllDriverDailyLogbookSign,
  patchAllDriverDailyLogbookApi,
  postAllDriverDailyLogbookApi,
} from '../data/data'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import SmartPagination from '../../components/SmartPagination'
import Table from '../../components/Table'
import { fetchDrivers } from '../../DriverExpert/data/drivers'
import AddButton from '../../components/AddButton'
import ReusableModal from '../../components/ReusableModal'
import Swal from 'sweetalert2'
import BillShow from '../../components/BillModal/BillShow'
import { toast, ToastContainer } from 'react-toastify'
import SearchInput from '../../components/SearchInput'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'

const AllDailyLogbook = () => {
  const queryClient = useQueryClient()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state

  // bill modal
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  // from state
  const [showModalFrom, setShowModalFrom] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [submitEdit, setSubmitEdit] = useState(false)

  // Fetch Data
  const { data: alldailylog, isFetching } = useQuery({
    queryKey: ['alldailylog'],
    queryFn: getAllDriverDailyLogbookApi,
    staleTime: 1000 * 60 * 30,
    onError: (err) => {
      console.error('Error fetching logbook data:', err)
    },
  })
  console.log(alldailylog)

  // POST
  const createDailyLogMutation = useMutation({
    mutationFn: ({ id, formData }) => postAllDriverDailyLogbookApi(id, formData),
    onSuccess: () => {
      Swal.fire('Success', 'Daily Log created successfully!', 'success')
      queryClient.invalidateQueries(['alldailylog'])
      setShowModalFrom(false)
    },
    onError: (error) => {
      Swal.fire('Error', error.message || 'Failed to create log', 'error')
    },
  })

  // PATCH
  const updateDailyLogMutation = useMutation({
    mutationFn: ({ id, formData }) => patchAllDriverDailyLogbookApi(id, formData),
    onSuccess: () => {
      Swal.fire('Updated', 'Daily Log updated successfully!', 'success')
      queryClient.invalidateQueries(['alldailylog'])
      setShowModalFrom(false)
    },
    onError: (error) => {
      Swal.fire('Error', error.message || 'Failed to update log', 'error')
    },
  })

  // DELETE
  const deleteDailyLogMutation = useMutation({
    mutationFn: (id) => deleteAllDriverDailyLogbookApi(id),
    onSuccess: () => {
      Swal.fire('Deleted', 'Daily Log deleted successfully!', 'success')
      queryClient.invalidateQueries(['alldailylog'])
    },
    onError: (error) => {
      Swal.fire('Error', error.message || 'Failed to delete log', 'error')
    },
  })

  // Fetch driver
  const { data: drivers = [], isLoad } = useQuery({
    queryKey: ['drivers'],
    queryFn: fetchDrivers,
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
  })

  useEffect(() => {
    let filtered = alldailylog || []

    // Filter by date range
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.orignalstartDate) // Assuming "originalDate" exists
        return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
      })
    }

    // Filter by search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    setFilteredData(filtered)
  }, [alldailylog, dateRange, searchQuery])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // fildes

  const field = [
    ...(!editMode
      ? [
          {
            name: 'driverName',
            label: 'Driver Name',
            type: 'select',
            placeholder: 'Select Driver',
            options: drivers.map((driver) => ({
              value: driver.id,
              label: driver.name,
            })),
          },
        ]
      : []),
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'datetime-local',
      placeholder: 'Enter Date',
      required: true,
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'datetime-local',
      placeholder: 'Enter Date',
      required: true,
    },
    {
      name: 'logKM',
      label: 'Daily Logs KM',
      type: 'number',
      placeholder: 'Enter Log KM',
      required: true,
    },
    {
      name: 'signature',
      label: 'Signature Image',
      type: 'file',
      accept: 'image/*',
    },
  ]

  // Tbale columns
  const columns = [
    { label: 'Date', key: 'originalDate', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Start Time', key: 'startDate', sortable: true },
    { label: 'End Time', key: 'endDate', sortable: true },
    { label: 'Duration', key: 'duration', sortable: true },
    { label: 'Log KM', key: 'logKM', sortable: true },
    { label: 'GPS KM', key: 'gpsKM', sortable: true },
  ]

  // Handle Search
  const handleSearch = (query) => setSearchQuery(query)

  // Handle Date Range Change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }

  // Handle edit
  const handleEditButton = (logId) => {
    const logToEdit = filteredData.find((item) => item.id === logId)

    if (logToEdit) {
      const formatForDatetimeLocal = (dateString) => {
        if (!dateString) return '' // Handle missing value gracefully
        const date = new Date(dateString)
        return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 16)
      }

      console.log('Original Log Data:', logToEdit)

      const driver = drivers.find((d) => d.name === logToEdit.driverName)
      const driverId = driver?.id || ''

      const transformedLog = {
        ...logToEdit,
        driverName: driverId,
        startDate: formatForDatetimeLocal(logToEdit.orignalstartDate),
        endDate: formatForDatetimeLocal(logToEdit.orginalendDate),
      }

      console.log('Transformed Log:', transformedLog)

      setEditMode(true)
      setEditingUser(transformedLog)
      setShowModalFrom(true)
    } else {
      toast.error('Entry not found')
    }
  }

  // Handle delete
  const handleDeleteButton = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the log.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDailyLogMutation.mutate(id)
      }
    })
  }

  // Handle submit
  const handleFormSubmit = (formData) => {
    const formattedData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formattedData.append(key, value)
    })

    if (editMode && editingUser?.id) {
      updateDailyLogMutation.mutate({ id: editingUser.id, formData: formattedData })
    } else {
      const driverId = formData.driverName
      formattedData.delete('driverName') // Remove old key
      formattedData.append('driverId', driverId)
      createDailyLogMutation.mutate({ id: driverId, formData: formattedData })
    }
  }

  // Handle view button
  const handleViewButton = async (id) => {
    const selectedRow = filteredData.find((item) => item.id === id)
    if (!selectedRow) {
      return toast.error('Data not found for this ID')
    }

    if (!selectedRow.signatureId) {
      return toast.warn('No bill image available for this entry.')
    }

    try {
      const response = await getAllDriverDailyLogbookSign(selectedRow.signatureId)
      const { base64Data, contentType } = response.signatureImg || response

      if (base64Data && contentType) {
        const fileSrc = `data:${contentType};base64,${base64Data}`
        setPdfBase64(fileSrc)

        if (contentType.startsWith('application/pdf')) {
          setModalTitle('Driver signature (PDF)')
        } else if (contentType.startsWith('image')) {
          setModalTitle('Driver signature (Image)')
        } else {
          setModalTitle('Driver signature (File)')
        }

        setShowModal(true)
      } else {
        toast.error('Invalid Driver signature image data.')
      }
    } catch (error) {
      console.error('Failed to fetch Driver signature image:', error)
      toast.error('No Driver signature image Found.')
    }
  }

  return (
    <div>
      <ToastContainer />

      <div>
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
          </div>
          <div className="d-flex justify-content-end align-items-center gap-2 w-75">
            <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
            {/* Add Button */}
            <AddButton
              label="Add Dailylog"
              onClick={() => {
                setEditMode(false)
                setSubmitEdit(false)
                setEditingUser(null)
                setShowModalFrom(true)
              }}
            />
          </div>
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
        title={editMode ? 'Edit LogBook' : 'Add LogBook'}
        size="xl"
        fields={field}
        isSubmitting={createDailyLogMutation.isLoading || updateDailyLogMutation.isLoading}
      />

      <Table
        title="Driver LogBooks"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        viewButton={true}
        handleViewButton={handleViewButton}
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

      <BillShow
        showModal={showModal}
        setShowModal={setShowModal}
        pdfBase64={pdfBase64}
        modalTitle={modalTitle}
      />
    </div>
  )
}

export default AllDailyLogbook
