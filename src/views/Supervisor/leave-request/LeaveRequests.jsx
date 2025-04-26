import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { FaCheck, FaTimes } from 'react-icons/fa'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import Page404 from '../../pages/page404/Page404'
import { getLeaveResquestDriverApi, updateLeaveRequestStatus } from '../data/data'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'

const LeaveRequests = () => {
  const [filteredData, setFilteredData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

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

  // Function to update status and update UI
  const updateStatusInUI = (id, newStatus) => {
    setFilteredData((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, status: getStatusBadge(newStatus) } : item,
      ),
    )
  }

  // Approve function (removes request from table after update)
  const handleApprove = async (id) => {
    try {
      await updateLeaveRequestStatus(id, 'Approved')
      Swal.fire('Success!', 'Leave Approved Successfully.', 'success')

      // Remove approved request from table
      setFilteredData((prevData) => prevData.filter((item) => item._id !== id))
    } catch (error) {
      toast.error('Failed to approve leave request!')
    }
  }

  // Reject function (removes request from table after update)
  const handleReject = async (id) => {
    try {
      await updateLeaveRequestStatus(id, 'Rejected')
      Swal.fire('Error', 'Leave Reject Successfully.', 'error')

      // Remove rejected request from table
      setFilteredData((prevData) => prevData.filter((item) => item._id !== id))
    } catch (error) {
      toast.error('Failed to reject leave request!')
    }
  }

  // Render action buttons (centered)
  const renderActionButtons = (id) => (
    <div className="d-flex justify-content-center gap-2">
      <button className="btn btn-sm btn-success" onClick={() => handleApprove(id)}>
        <FaCheck />
      </button>
      <button className="btn btn-sm btn-danger" onClick={() => handleReject(id)}>
        <FaTimes />
      </button>
    </div>
  )

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

  // Format and set data
  React.useEffect(() => {
    if (responseData.length > 0) {
      const formattedData = responseData.map((item) => ({
        _id: item._id,
        name: item.driverId?.name || 'Unknown',
        startDate: formatDate(item.startDate),
        endDate: formatDate(item.endDate),
        description: item.description || '',
        status: getStatusBadge(item.status || 'Pending'),
        actions: renderActionButtons(item._id),
      }))

      setFilteredData(formattedData)
    }
  }, [responseData])

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query)

    if (!query) {
      setFilteredData(responseData)
      return
    }

    const filtered = responseData.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredData(filtered)
  }

  if (error) return <Page404 />

  // Table columns
  const columns = [
    { label: 'Driver Name', key: 'name', sortable: true },
    { label: 'Start Date', key: 'startDate', sortable: true },
    { label: 'End Date', key: 'endDate', sortable: true },
    { label: 'Description', key: 'description', sortable: true },
    { label: 'Status', key: 'status', sortable: false },
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
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        errorMessage={
          error
            ? 'Error fetching driver expenses. Please try again later.'
            : filteredData.length === 0 && !isFetching
              ? 'No driver expense records found for the selected period.'
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
    </div>
  )
}

export default LeaveRequests
