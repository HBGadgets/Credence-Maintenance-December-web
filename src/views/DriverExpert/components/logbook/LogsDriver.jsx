import React, { useEffect, useMemo, useState } from 'react'
import BillShow from '../../../components/BillModal/BillShow'
import SmartPagination from '../../../components/SmartPagination'
import Table from '../../../components/Table'
import DateRangePicker from '../../../components/DateRangePicker'
import { CContainer } from '@coreui/react'
import {
  deleteDailyLogApi,
  driverLogbook,
  getDailyLogSign,
  patchDailyLogApi,
  postDailyLogApi,
} from '../../data/drivers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import SearchInput from '../../../components/SearchInput'
import { toast, ToastContainer } from 'react-toastify'
import AddButton from '../../../components/AddButton'
import ReusableModal from '../../../components/ReusableModal'
import Swal from 'sweetalert2'
import usePdfExporter from '../../../customhooks/usePdfExporter'
import useExcelExporter from '../../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import IconDropdown from '../../../Supervisor/IconDropdown'

const LogsDriver = () => {
  const queryClient = useQueryClient()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [searchQuery, setSearchQuery] = useState('')

  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const { id } = useParams()

  // from state
  const [showModalFrom, setShowModalFrom] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [submitEdit, setSubmitEdit] = useState(false)

  // fetch api
  const {
    data: driverLogbookData = [],
    isFetching,
    isFetched,
    isError,
  } = useQuery({
    queryKey: ['logbook', id, selectedMonth],
    queryFn: () => driverLogbook(id, selectedMonth),
    staleTime: 1000 * 60 * 30,
  })

  // POST Daily Log
  const { mutate: createDailyLog, isPending: isSubmitting } = useMutation({
    mutationFn: (formData) => postDailyLogApi(id, formData), // Expect only formData
    onSuccess: () => {
      toast.success('Daily log created successfully')
      queryClient.invalidateQueries(['logbook', id, selectedMonth])
      setShowModalFrom(false)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create daily log')
    },
  })

  // PATCH Daily Log
  const { mutate: updateDailyLog, isPending: isUpdating } = useMutation({
    mutationFn: ({ logId, data }) => patchDailyLogApi(logId, data),
    onSuccess: () => {
      toast.success('Daily log updated successfully')
      queryClient.invalidateQueries(['logbook', id, selectedMonth])
      setShowModalFrom(false)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update daily log')
    },
  })

  // DELETE Daily Log
  const { mutate: deleteDailyLog } = useMutation({
    mutationFn: deleteDailyLogApi,
    onSuccess: () => {
      toast.success('Daily log deleted successfully')
      queryClient.invalidateQueries(['logbook', id, selectedMonth])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete daily log')
    },
  })

  useEffect(() => {
    let filtered = [...driverLogbookData]

    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) =>
            value && typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    setFilteredData(filtered)
  }, [driverLogbookData, searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // fildes

  const field = [
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

  // Memoized paginatedData
  const paginatedData = useMemo(() => {
    return filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  // Memoized totalPages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / itemsPerPage)
  }, [filteredData.length, itemsPerPage])

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

  // handle view
  const handleViewButton = async (id) => {
    const selectedRow = filteredData.find((item) => item.id === id)
    if (!selectedRow) {
      return toast.error('Data not found for this ID')
    }

    if (!selectedRow.signatureId) {
      return toast.warn('No bill image available for this entry.')
    }

    try {
      const response = await getDailyLogSign(selectedRow.signatureId)
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

  // handle edit
  const handleEditButton = (logId) => {
    const logToEdit = filteredData.find((item) => item.id === logId)

    if (logToEdit) {
      const formatForDatetimeLocal = (dateString) => {
        if (!dateString) return '' // Handle missing value gracefully
        const date = new Date(dateString)
        return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 16)
      }

      console.log('Original Log Data:', logToEdit)

      const transformedLog = {
        ...logToEdit,
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

  // handle delete
  const handleDeleteButton = (logId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this daily log?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDailyLog(logId)
      }
    })
  }
  // handle submit
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
        text: 'Do you want to update this log entry?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          updateDailyLog({ logId: editingUser.id, data })
        }
      })
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to create this log entry?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, create it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          createDailyLog(data)
        }
      })
    }
  }

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

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
    <>
      <ToastContainer />
      <CContainer className="px-2" fluid>
        <>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <DateRangePicker
                value={selectedMonth}
                label={false}
                onMonthChange={(newMonth) => {
                  if (newMonth !== selectedMonth) {
                    setSelectedMonth(newMonth)
                  }
                }}
              />
            </div>
            <div className="d-flex justify-content-end align-items-center gap-2 w-75">
              <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />

              <AddButton
                label="Add Dailylog"
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
            title={editMode ? 'Edit LogBook' : 'Add LogBook'}
            size="xl"
            fields={field}
            isSubmitting={isSubmitting || isUpdating}
          />

          <Table
            title="Driver LogBooks"
            columns={columns}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isFetching={isFetching}
            isFetched={isFetched}
            isError={isError}
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
              if (value === -1) {
                setItemsPerPage(filteredData.length)
                setCurrentPage(1)
              } else {
                setItemsPerPage(value)
                setCurrentPage(1)
              }
            }}
          />
        </>
        {/* Modal for displaying signature */}
        <BillShow
          showModal={showModal}
          setShowModal={setShowModal}
          pdfBase64={pdfBase64}
          modalTitle={modalTitle}
        />
      </CContainer>
      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default LogsDriver
