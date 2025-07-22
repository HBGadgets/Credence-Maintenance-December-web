import React, { useContext, useEffect, useMemo, useState } from 'react'
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
import { fetchDrivers, fetchSupervisor } from '../../DriverExpert/data/drivers'
import AddButton from '../../components/AddButton'
import ReusableModal from '../../components/ReusableModal'
import Swal from 'sweetalert2'
import BillShow from '../../components/BillModal/BillShow'
import { toast, ToastContainer } from 'react-toastify'
import SearchInput from '../../components/SearchInput'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import { TokenContext } from '../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import IconDropdown from '../IconDropdown'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'

const AllDailyLogbook = () => {
  const queryClient = useQueryClient()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
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

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // Fetch Data
  const { data: alldailylog, isFetching } = useQuery({
    queryKey: ['alldailylog'],
    queryFn: () => getAllDriverDailyLogbookApi(null, token), // ✅ token passed here
    staleTime: 1000 * 60 * 30,
    enabled: !!token, //  only run if token is available
    onError: (err) => {
      console.error('Error fetching logbook data:', err)
    },
  })
  console.log(alldailylog)

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

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
    if (!alldailylog || alldailylog.length === 0) return

    let filtered = alldailylog || []

    // Filter by supervisor if selected
    if (selectedName?.value) {
      filtered = filtered.filter(
        (dailylog) => dailylog.supervisor?.toLowerCase() === selectedName.value.toLowerCase(),
      )
    }

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
  }, [alldailylog, dateRange, searchQuery, selectedName])

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

  console.log('selectedName:', selectedName)
  console.log('Comparing supervisor:', {
    selectedValue: selectedName?.value,
    selectedLabel: selectedName?.label,
  })

  console.log('Supervisors:', supervisorOptions)

  // Handle Logout
  const handleLogout = () => {
    // Clear sessionStorage and localStorage
    sessionStorage.clear()
    localStorage.clear()

    // Optional: Clear cookies (will only clear cookies accessible via JavaScript)
    document.cookie.split(';').forEach((c) => {
      const base = c.trim().split('=')[0]
      document.cookie = `${base}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    })

    // Redirect to Credence
    window.history.replaceState(null, '', '/')
    // window.location.href = 'http://localhost:3000'
    window.location.href = import.meta.env.VITE_API_CREDENCE_URL
  }

  // Memoized dropdown items for export
  const dropdownItems = useMemo(
    () => [
      {
        icon: FaRegFilePdf,
        label: 'Download PDF',
        onClick: () =>
          exportToPDF({
            title: 'Driver LogBook Report',
            columns,
            data: filteredData,
            fileName: 'Driver_LogBook_Report',
          }),
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () => {
          exportToExcel({
            title: 'Driver LogBook Report',
            columns,
            data: filteredData,
            fileName: 'Driver_LogBook_Report',
          })
        },
      },
      {
        icon: FaPrint,
        label: 'Print Page',
        onClick: () => window.print(),
      },
      {
        icon: HiOutlineLogout,
        label: 'Logout',
        onClick: () => handleLogout(),
      },
      {
        icon: FaArrowUp,
        label: 'Scroll To Top',
        onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      },
    ],
    [filteredData, columns, exportToPDF, exportToExcel],
  )

  return (
    <div>
      <ToastContainer />

      <div>
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
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
        viewButtonLabel="Image"
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

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </div>
  )
}

export default AllDailyLogbook
