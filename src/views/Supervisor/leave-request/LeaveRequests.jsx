import React, { useState, useMemo } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { FaArrowUp, FaCheck, FaPrint, FaRegFilePdf, FaTimes } from 'react-icons/fa'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import Page404 from '../../pages/page404/Page404'
import { getLeaveResquestDriverApi, updateLeaveRequestStatus } from '../data/data'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { HiOutlineLogout } from 'react-icons/hi'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import IconDropdown from '../IconDropdown'

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

  // Fetch driver leave requests with useQuery
  const {
    data: responseData = [],
    isFetching,
    error,
  } = useQuery({
    queryKey: ['driverleaveRequests'],
    queryFn: getLeaveResquestDriverApi,
    staleTime: 1000 * 60 * 30, // Cache data for 30 minutes
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
        title: 'Rejected!',
        text: 'Leave Rejected Successfully.',
        icon: 'error',
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

  // Process and format data for display
  const displayData = useMemo(() => {
    return responseData
      .filter((item) => {
        if (!searchQuery) return true
        const driverName = item.driverId?.name || 'Unknown'
        return driverName.toLowerCase().includes(searchQuery.toLowerCase())
      })
      .map((item) => ({
        _id: item._id,
        name: item.driverId?.name || 'Unknown',
        startDate: formatDate(item.startDate),
        endDate: formatDate(item.endDate),
        description: item.description || '',
        status: item.status, // Keep raw status for badge generation
        statusBadge: getStatusBadge(item.status || 'Pending'),
        actions: (
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-sm btn-success"
              onClick={() => handleApprove(item._id)}
              disabled={item.status !== 'Pending' || updatingId === item._id}
            >
              {updatingId === item._id ? (
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
              className="btn btn-sm btn-danger"
              onClick={() => handleReject(item._id)}
              disabled={item.status !== 'Pending' || updatingId === item._id}
            >
              {updatingId === item._id ? (
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

  if (error) return <Page404 />

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
