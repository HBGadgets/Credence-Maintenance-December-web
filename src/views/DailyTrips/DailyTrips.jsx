import React, { useState, useEffect, useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Table from '../components/Table'
import SmartPagination from '../components/SmartPagination'
import ReusableModal from '../components/ReusableModal'
import AddButton from '../components/AddButton'
import {
  getAllDailyReadingApi,
  postDailyReadingApi,
  patchDailyReadingApi,
  deleteDailyTripApi,
  verifyPasswordApi,
} from './data'
import { fetchDrivers, fetchSupervisor } from '../DriverExpert/data/drivers'
import DateRangeFilterCredence from '../../components/DateRangeFilterCredence'
import SearchInput from '../components/SearchInput'
import { TokenContext } from '../../context/TokenContext'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import SingleSelectDropdown from '../components/SingleSelectDropdown'
import usePdfExporter from '../customhooks/usePdfExporter'
import useExcelExporter from '../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import IconDropdown from '../Supervisor/IconDropdown'

const DailyTrips = () => {
  const queryClient = useQueryClient()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })

  const [selectedDriverId, setSelectedDriverId] = useState(null)
  const [showModalFrom, setShowModalFrom] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Use state for modal
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // for status filter
  const [selectedStatus, setSelectedStatus] = useState(null)

  // superadmin role
  const token = useContext(TokenContext)
  const effectiveToken = token || Cookies.get('crdnsMaintToken')
  const decodedToken = effectiveToken ? jwtDecode(effectiveToken) : null
  const userRole = decodedToken?.role
  const isSuperAdmin = userRole === 'superadmin' || userRole?.toLowerCase() === 'superadmin'

  // Status options for dropdown
  const statusOptions = [
    { label: 'Started', value: 'started' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ]

  // Debug effect to track dateRange changes
  useEffect(() => {
    console.log('🔄 dateRange state updated:', dateRange)
  }, [dateRange])

  // Format date for API (start or end of day)
  const formatDateForAPI = (date, isEnd = false) => {
    if (!date) return ''
    const d = new Date(date)
    if (isEnd) {
      d.setHours(23, 59, 59, 999)
    } else {
      d.setHours(0, 0, 0, 0)
    }

    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Fetch daily trips with filters
  const {
    data: apiResponse = { data: [], total: 0, totalPages: 1 },
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      'dailyTrips',
      currentPage,
      itemsPerPage,
      searchQuery,
      dateRange.startDate,
      dateRange.endDate,
      selectedName?.value,
      selectedStatus?.value, // Status in queryKey for refetching
    ],
    queryFn: () => {
      const payload = {
        search: searchQuery,
        page: currentPage,
        limit: itemsPerPage === -1 ? 10000 : itemsPerPage,
      }

      if (dateRange.startDate) {
        payload.startDate = formatDateForAPI(dateRange.startDate)
      }
      if (dateRange.endDate) {
        payload.endDate = formatDateForAPI(dateRange.endDate, true)
      }

      if (selectedName?.value) {
        payload.supervisorId = selectedName.value
      }

      //  Status filter sent to backend API
      if (selectedStatus?.value) {
        payload.status = selectedStatus.value
      }

      console.log('📤 Sending payload to API:', payload)

      return getAllDailyReadingApi(payload) // API call with status filter
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  })

  const dailyTrips = apiResponse.data || []
  const totalItems = apiResponse.total || 0
  const totalPages = apiResponse.totalPages || 1

  // Calculate actual data to display
  const displayData = dailyTrips

  // Fetch driver list
  const { data: drivers = [] } = useQuery({
    queryKey: ['drivers'],
    queryFn: fetchDrivers,
    staleTime: 1000 * 60 * 30,
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedName, selectedStatus, searchQuery, dateRange])

  // Handle Date Range Change
  const handleDateRangeChange = (start, end) => {
    console.log('📅 Received from picker:', start, end)

    const normalizedRange = {
      startDate: start || null,
      endDate: end || null,
    }

    console.log('📅 Normalized date range:', normalizedRange)
    setDateRange(normalizedRange)
    // Note: currentPage is reset in useEffect above
  }

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
    // Note: currentPage is reset in useEffect above
  }

  // Handle Add/Edit Submit
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true)
      if (editMode) {
        await patchDailyReadingApi(editingUser.id, editingUser.driverId, formData)
        toast.success('Trip End Reading Updated Successfully')
      } else {
        const driverId = selectedDriverId || formData.driverId
        await postDailyReadingApi(driverId, formData)
        toast.success('Trip Started Successfully')
      }
      await refetch()
      queryClient.invalidateQueries(['dailyTrips'])
      setShowModalFrom(false)
      setEditMode(false)
      setEditingUser(null)
      setSelectedDriverId(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Edit Button - FIXED to handle pagination
  const handleEditButton = (id) => {
    // We need to find the record in the current page's data
    const record = dailyTrips.find((item) => item.id === id)
    if (record) {
      const driver = drivers.find((d) => d.name === record.driverName)
      setEditMode(true)
      setEditingUser({
        ...record,
        driverId: driver?.id || record.driverId || '',
        odometerEnd: record.odometerEnd || '',
      })
      setShowModalFrom(true)
    } else {
      toast.error('Record not found on current page. Please search for it.')
    }
  }

  // Handle Delete Trip with Password Verification (Superadmin only)
  const handleDeleteButton = async (id) => {
    if (!isSuperAdmin) {
      toast.error('Only superadmin is authorized to delete daily trips.')
      return
    }

    const selected = dailyTrips.find((item) => item.id === id) || {}

    // Step 1: Warning and Consequences Confirmation
    const warningResult = await Swal.fire({
      title: '<span style="color: #dc3545; font-weight: 700;">⚠️ High-Risk Action: Delete Daily Trip</span>',
      html: `
        <div style="text-align: left; font-size: 13.5px; line-height: 1.6;">
          ${
            selected.driverName
              ? `<div style="background: #f8f9fa; border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; border: 1px solid #e9ecef;">
                  <div><strong>Driver:</strong> ${selected.driverName}</div>
                  <div><strong>Vehicle:</strong> ${selected.vehicleNumber}</div>
                  <div><strong>Date:</strong> ${selected.createdAt}</div>
                  <div><strong>Distance:</strong> ${selected.totalDistance || '-'} KM (Odo: ${selected.odometerStart || '-'} - ${selected.odometerEnd || '-'})</div>
                </div>`
              : ''
          }
          <div class="alert alert-danger py-2 px-3 small" style="color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 6px; margin-bottom: 12px;">
            <strong>CRITICAL WARNING:</strong> Deleting this daily trip is a permanent and irreversible administrative action.
          </div>
          <div style="font-weight: 600; margin-bottom: 6px; color: #212529;">Consequences of deleting this trip:</div>
          <ul style="padding-left: 20px; margin-bottom: 12px; color: #495057;">
            <li style="margin-bottom: 4px;"><strong>Irreversible Data Loss:</strong> This daily trip record will be permanently deleted from the database and cannot be recovered or restored.</li>
            <li style="margin-bottom: 4px;"><strong>Driver Shift & Reports Impact:</strong> Total kilometers travelled, monthly trip count, and driver shift logs will lose this entry, altering historical summaries.</li>
            <li style="margin-bottom: 4px;"><strong>Odometer Continuity Gap:</strong> The start and end odometer sequence for this vehicle will show an unaccounted gap in fleet maintenance history.</li>
            <li style="margin-bottom: 4px;"><strong>Audit & Inspection Discrepancy:</strong> Associated trip time and GPS kilometer logs will be removed, potentially causing audit mismatches.</li>
          </ul>
          <p style="color: #c53030; font-weight: 700; font-size: 13px; margin: 0; text-align: center; border-top: 1px dashed #feb2b2; padding-top: 8px;">
            Do you acknowledge these risks and want to proceed to security authorization?
          </p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'I Understand the Consequences, Proceed',
      cancelButtonText: 'Abort! Keep Trip Safe',
      reverseButtons: true,
      focusCancel: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    })

    if (!warningResult.isConfirmed) {
      return
    }

    // Step 2: Password Verification & Permanent Deletion
    const passwordResult = await Swal.fire({
      title: '<span style="color: #dc3545; font-weight: 700;">Superadmin Security Authorization</span>',
      html: `
        <p class="mb-2">Enter your Superadmin password to authorize permanent deletion of this trip:</p>
        <div class="alert alert-danger py-2 px-3 text-start small mb-0" style="color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
          <strong>Final Confirmation:</strong> Once password is verified, this trip will be permanently erased.
        </div>
      `,
      icon: 'warning',
      input: 'password',
      inputPlaceholder: 'Enter your password...',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off',
        'aria-label': 'Enter password',
      },
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Verify & Permanently Delete',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return 'Password is required!'
        }
      },
      preConfirm: async (password) => {
        const pass = password ? password.trim() : ''
        try {
          const res = await verifyPasswordApi(pass)
          if (res?.status === false || res?.success === false || res?.valid === false) {
            throw new Error(res?.message || res?.error || 'Password verification failed.')
          }

          await deleteDailyTripApi(id)
          return true
        } catch (err) {
          const errorMessage =
            (Array.isArray(err.response?.data?.message)
              ? err.response.data.message.join(', ')
              : err.response?.data?.message) ||
            err.response?.data?.error ||
            (typeof err.response?.data === 'string' ? err.response.data : null) ||
            err.message ||
            'Verification or deletion failed. Please try again.'

          Swal.showValidationMessage(errorMessage)
          return false
        }
      },
    })

    if (passwordResult.isConfirmed) {
      toast.success('Daily trip deleted successfully')
      refetch()
      queryClient.invalidateQueries(['dailyTrips'])
    }
  }

  // Dynamic Form Fields
  const fields = [
    {
      name: 'driverId',
      label: 'Driver Name',
      type: 'select',
      options: drivers?.map((drv) => ({ label: drv.name, value: drv.id })) || [],
      required: true,
      disabled: editMode,
      onChange: (e) => setSelectedDriverId(e.target.value),
    },
    ...(!editMode
      ? [
          {
            name: 'odometerStart',
            label: 'Start Odometer Reading',
            type: 'number',
            placeholder: 'Enter Start Odometer',
            required: true,
            min: 0,
          },
        ]
      : [
          {
            name: 'odometerEnd',
            label: 'End Odometer Reading',
            type: 'number',
            placeholder: 'Enter End Odometer',
            required: true,
            min: 0,
          },
        ]),
  ]

  // status color
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
        status === 'started'
          ? '#f5a623'
          : status === 'completed'
            ? '#28a745'
            : status === 'cancelled'
              ? '#dc3545'
              : '#6c757d',
      color: 'white',
    }
  }

  // Table Columns
  const columns = [
    { label: 'Date', key: 'createdAt', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Vehicle', key: 'vehicleNumber', sortable: true },
    { label: 'Start Trip', key: 'startTime', sortable: true },
    { label: 'Start Odometer', key: 'odometerStart', sortable: true },
    { label: 'End Trip', key: 'endTime', sortable: true },
    { label: 'End Odometer', key: 'odometerEnd', sortable: true },
    { label: 'Total KM', key: 'totalDistance', sortable: true },
    { label: 'GPS Km', key: 'gpsKM', sortable: true },
    {
      label: 'Status',
      key: 'status',
      render: (row) => <span style={getStatusStyle(row.status)}>{row.status}</span>,
    },
  ]

  // Dropdown items for export
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () => {
        const cleanedData = displayData.map(({ status, ...rest }) => ({
          ...rest,
          status: typeof status === 'string' ? status : status?.props?.children || '',
        }))

        exportToPDF({
          title: 'Daily Trips Report',
          columns: columns,
          data: cleanedData,
          fileName: 'Daily_Trips_Report',
        })
      },
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () => {
        const cleanedData = displayData.map(({ status, ...rest }) => ({
          ...rest,
          status: typeof status === 'string' ? status : status?.props?.children || '',
        }))

        exportToExcel({
          title: 'Daily Trips Report',
          columns: columns,
          data: cleanedData,
          fileName: 'Daily_Trips_Report',
        })
      },
    },
    {
      icon: FaPrint,
      label: 'Print Page',
      onClick: () => window.print(),
    },
    {
      icon: FaArrowUp,
      label: 'Scroll To Top',
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
  ]

  return (
    <>
      <ToastContainer />

      <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <DateRangeFilterCredence
            title="Date Range"
            onDateRangeChange={handleDateRangeChange}
            value={dateRange}
          />
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
          <div style={{ width: '160px' }}>
            <SingleSelectDropdown
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              isClearable
              placeholder="Filter Status.."
            />
          </div>
        </div>

        <div className="d-flex justify-content-end align-items-center gap-2 w-75">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={handleSearch}
            placeholder="Search by driver name or vehicle number..."
          />
          <AddButton
            label="Add Daily Log"
            onClick={() => {
              setEditMode(false)
              setEditingUser(null)
              setSelectedDriverId(null)
              setShowModalFrom(true)
            }}
          />
        </div>
      </div>

      <ReusableModal
        show={showModalFrom}
        title={editMode ? 'End Trip Reading' : 'Start Trip Reading'}
        initialData={editMode ? editingUser : null}
        onClose={() => {
          setShowModalFrom(false)
          setEditMode(false)
          setEditingUser(null)
          setSelectedDriverId(null)
        }}
        onSubmit={handleFormSubmit}
        fields={fields}
        isSubmitting={isSubmitting}
      />

      <Table
        title="All Drivers Daily Logs"
        columns={columns}
        filteredData={displayData}
        setFilteredData={() => {}} // Required prop for Table component
        currentPage={1} // Always show page 1 since data is already paginated from API
        itemsPerPage={displayData.length} // Show all items in current page
        isFetching={isFetching}
        editButton={true}
        handleEditButton={handleEditButton}
        deleteButton={isSuperAdmin}
        handleDeleteButton={handleDeleteButton}
      />

      <SmartPagination
        totalPages={itemsPerPage === -1 ? 1 : totalPages}
        currentPage={currentPage}
        onPageChange={(page) => {
          // When showing all, don't allow page changes
          if (itemsPerPage === -1) {
            // If trying to change page while showing all, reset to normal pagination
            setItemsPerPage(10)
            setCurrentPage(page)
          } else {
            setCurrentPage(page)
          }
        }}
        onItemsPerPageChange={(value) => {
          console.log('Changing items per page to:', value)
          // Set itemsPerPage (could be -1 for "All")
          setItemsPerPage(value)
          // Always reset to page 1 when changing items per page
          setCurrentPage(1)
        }}
        totalItems={itemsPerPage === -1 ? displayData.length : totalItems}
      />

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default DailyTrips
