import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { FaArrowUp, FaCheck, FaPrint, FaRegFilePdf, FaTimes } from 'react-icons/fa'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import Page404 from '../../pages/page404/Page404'
import { getLeaveResquestDriverApi, updateLeaveRequestStatus } from '../data/data'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { HiOutlineLogout } from 'react-icons/hi'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import IconDropdown from '../IconDropdown'

const LeaveRequests = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
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

  // Dropdown items for export
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () => {
        const cleanedData = filteredData.map(({ actions, status, ...rest }) => ({
          ...rest,
          status: typeof status === 'string' ? status : status?.props?.children || '', // Extract inner text from JSX badge
        }))

        const pdfColumns = columns.filter((col) => col.key !== 'actions') // remove 'actions' column

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
        const cleanedData = filteredData.map(({ actions, status, ...rest }) => ({
          ...rest,
          status: typeof status === 'string' ? status : status?.props?.children || '', // Convert badge to plain text
        }))

        const excelColumns = columns.filter((col) => col.key !== 'actions') // Remove 'actions' column

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

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </div>
  )
}

export default LeaveRequests
