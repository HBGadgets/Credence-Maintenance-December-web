import React, { useContext, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Table from '../../components/Table'
import SearchInput from '../../components/SearchInput'
import SmartPagination from '../../components/SmartPagination'
import { getLeaveResquestDriverApi, updateLeaveRequestStatus } from '../data/data'
import { FaArrowUp, FaCheck, FaPrint, FaRegFilePdf, FaTimes } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import IconDropdown from '../IconDropdown'
import Swal from 'sweetalert2'
import { toast, ToastContainer } from 'react-toastify'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import { TokenContext } from '../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import { HiOutlineLogout } from 'react-icons/hi'

const LeaveRequests = () => {
  const queryClient = useQueryClient()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [updatingId, setUpdatingId] = useState(null) // Track which item is being updated

  // Format date to "dd/mm/yyyy"
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
  }

  // Get badge based on status
  const getStatusBadge = (status) => {
    let badgeClass = 'badge bg-secondary' // Default
    if (status === 'Pending') badgeClass = 'badge bg-warning text-dark'
    if (status === 'Rejected') badgeClass = 'badge bg-danger'
    if (status === 'Approved') badgeClass = 'badge bg-success'

    return <span className={badgeClass}>{status}</span>
  }

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // Token resolution
  const token = sessionStorage.getItem('crdnsMaintToken')

  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // Fetch driver leave requests with useQuery
  const {
    data: responseData = [],
    isFetching,
    error,
  } = useQuery({
    queryKey: ['driverleaveRequests'],
    queryFn: () => getLeaveResquestDriverApi(null, token),
    staleTime: 1000 * 60 * 30, // Cache data for 30 minutes
    enabled: Boolean(token), // only run if token is available
  })

  // Approve function
  const handleApprove = async (id) => {
    setUpdatingId(id)
    try {
      await updateLeaveRequestStatus(id, 'Approved')
      Swal.fire({
        title: 'Success!',
        text: 'Leave Approved Successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      })
      // Invalidate query to refetch data
      queryClient.invalidateQueries(['driverleaveRequests'])
    } catch (error) {
      toast.error('Failed to approve leave request!')
    } finally {
      setUpdatingId(null)
    }
  }

  // Reject function
  const handleReject = async (id) => {
    setUpdatingId(id)
    try {
      await updateLeaveRequestStatus(id, 'Rejected')
      Swal.fire({
        title: 'Success!',
        text: 'Leave Rejected Successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      })
      // Invalidate query to refetch data
      queryClient.invalidateQueries(['driverleaveRequests'])
    } catch (error) {
      toast.error('Failed to reject leave request!')
    } finally {
      setUpdatingId(null)
    }
  }

  // Filter and map responseData
  const displayData = useMemo(() => {
    return responseData
      .filter((item) => {
        const matchesSearch =
          item.driverId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.status?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
      })
      .map((item) => ({
        id: item._id,
        name: item.driverId?.name || 'N/A',
        startDate: formatDate(item.startDate),
        endDate: formatDate(item.endDate),
        description: item.description,
        statusBadge: getStatusBadge(item.status),
        status: item.status, // Raw status for export
        actions: (
          <div className="d-flex gap-2">
            <button
              className="btn btn-success btn-sm d-flex align-items-center justify-content-center"
              onClick={() => handleApprove(item._id)}
              disabled={updatingId === item._id || item.status === 'Approved'}
              title="Approve Leave"
            >
              {updatingId === item._id && item.status !== 'Approved' ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <FaCheck />
              )}
            </button>
            <button
              className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
              onClick={() => handleReject(item._id)}
              disabled={updatingId === item._id || item.status === 'Rejected'}
              title="Reject Leave"
            >
              {updatingId === item._id && item.status !== 'Rejected' ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <FaTimes />
              )}
            </button>
          </div>
        ),
      }))
  }, [responseData, searchQuery, updatingId])

  const totalPages = Math.ceil(displayData.length / itemsPerPage)

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleLogout = () => {
    // Implement your logout logic here
    console.log('Logout clicked')
  }

  // Dropdown items for export
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () => {
        const cleanedData = displayData.map(({ actions, statusBadge, ...rest }) => ({
          ...rest,
          status: rest.status, // Use the raw status for export
        }))

        const pdfColumns = [
          { label: 'Driver Name', key: 'name' },
          { label: 'Start Date', key: 'startDate' },
          { label: 'End Date', key: 'endDate' },
          { label: 'Description', key: 'description' },
          { label: 'Status', key: 'status' },
        ]

        exportToPDF({
          title: 'Leave Requests Report',
          columns: pdfColumns,
          data: cleanedData,
          fileName: 'Leave_Requests_Report',
        })
      },
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () => {
        const cleanedData = displayData.map(({ actions, statusBadge, ...rest }) => ({
          ...rest,
          status: rest.status, // Use the raw status for export
        }))

        const excelColumns = [
          { label: 'Driver Name', key: 'name' },
          { label: 'Start Date', key: 'startDate' },
          { label: 'End Date', key: 'endDate' },
          { label: 'Description', key: 'description' },
          { label: 'Status', key: 'status' },
        ]

        exportToExcel({
          title: 'Leave Requests Report',
          columns: excelColumns,
          data: cleanedData,
          fileName: 'Leave_Requests_Report',
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
  ]

  // Table columns
  const columns = [
    { label: 'Driver Name', key: 'name', sortable: true },
    { label: 'Start Date', key: 'startDate', sortable: true },
    { label: 'End Date', key: 'endDate', sortable: true },
    { label: 'Description', key: 'description', sortable: true },
    { label: 'Status', key: 'statusBadge', sortable: false },
    { label: 'Actions', key: 'actions' },
  ]

  return (
    <div>
      <ToastContainer />

      <div className="mb-2 d-flex justify-content-end align-items-center">
        <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
      </div>

      <Table
        title="Driver Leave Requests"
        columns={columns}
        filteredData={displayData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        errorMessage={
          error
            ? 'Error fetching driver leave requests. Please try again later.'
            : displayData.length === 0 && !isFetching
              ? 'No leave requests found.'
              : ''
        }
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </div>
  )
}

export default LeaveRequests
