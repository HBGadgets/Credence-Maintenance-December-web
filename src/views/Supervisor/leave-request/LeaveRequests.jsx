import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { FaCheck, FaTimes } from 'react-icons/fa'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import Loader from '../../../components/Loader/Loader'
import Page404 from '../../pages/page404/Page404'
import { getLeaveResquestDriverApi } from '../data/data'

const LeaveRequests = () => {
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState([]) // Store full API data
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Utility function to format dates (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
  }

  // Function to get the appropriate badge for status
  const getStatusBadge = (status) => {
    let badgeClass = 'badge bg-secondary' // Default color
    if (status === 'Pending') badgeClass = 'badge bg-warning text-dark'
    if (status === 'Rejected') badgeClass = 'badge bg-danger'
    if (status === 'Approved') badgeClass = 'badge bg-success'

    return <span className={badgeClass}>{status}</span>
  }

  // Function to render action buttons
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

  // Approve function (Implement API call here)
  const handleApprove = (id) => {
    console.log('Approving leave request:', id)
    toast.success('Leave Approved!')
    // Call API to update leave status to "Approved"
  }

  // Reject function (Implement API call here)
  const handleReject = (id) => {
    console.log('Rejecting leave request:', id)
    toast.error('Leave Rejected!')
    // Call API to update leave status to "Rejected"
  }

  // Fetch Request list of drivers
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const responseData = await getLeaveResquestDriverApi()
        console.log('Fetched Driver Data:', responseData)

        // Flatten data structure and format missing fields
        const formattedData = responseData.map((item) => ({
          _id: item._id,
          name: item.driverId?.name || 'Unknown', // driver name
          startDate: formatDate(item.startDate),
          endDate: formatDate(item.endDate),
          description: item.description || '', //  descriptions
          status: getStatusBadge(item.status || 'Pending'), // Highlight status with badge
          actions: renderActionButtons(item._id), //  Add Approve & Reject buttons
        }))

        setData(formattedData)
        setFilteredData(formattedData)
      } catch (error) {
        setError(error)
        toast.error('Failed to fetch driver data!', { position: 'top-right' })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Search handler (Filters allData)
  const handleSearch = (query) => {
    setSearchQuery(query)

    if (!query) {
      setFilteredData(data) // Reset to full data if search is empty
      return
    }

    const filtered = data.filter(
      (item) => item.name.toLowerCase().includes(query.toLowerCase()), //Searching in flattened `name`
    )
    setFilteredData(filtered)
  }

  if (loading) return <Loader />
  if (error) return <Page404 />

  // Table columns
  const columns = [
    { label: 'Driver Name', key: 'name', sortable: true },
    { label: 'Start Date', key: 'startDate', sortable: true },
    { label: 'End Date', key: 'endDate', sortable: true },
    { label: 'Description', key: 'description', sortable: true },
    { label: 'Status', key: 'status', sortable: false },
    { label: 'Actions', key: 'actions' }, //Buttons will be shown here
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
