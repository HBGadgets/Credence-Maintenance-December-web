import React, { useEffect, useMemo, useState } from 'react'
import SmartPagination from '../../components/SmartPagination'
import Table from '../../components/Table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import CardStatus from './component/CardStatus'
import SearchInput from '../../components/SearchInput'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import { getAllRaiseTicektApi, patchAnsweredTicketApi } from './data/data'
import { toast, ToastContainer } from 'react-toastify'
import ReusableModal from '../../components/ReusableModal'
import Swal from 'sweetalert2'
import { fetchSupervisor } from '../../DriverExpert/data/drivers'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import IconDropdown from '../../Supervisor/IconDropdown'

const AnsweredTicket = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })
  const [showModalFrom, setShowModalFrom] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedTicket, setSelectedTicket] = useState(null)

  const queryClient = useQueryClient()

  const [selectedSupervisor, setSelectedSupervisor] = useState(null)

  const RaiseTicketOptions = [
    { value: 'technical Issue', label: 'Technical Issue' },
    { value: 'Account Related', label: 'Account Related' },
    { value: 'Software Demo', label: 'Software Demo' },
    { value: 'Video Demo Request', label: 'Video Demo Request' },
    { value: 'Software Error', label: 'Software Error' },
    { value: 'Other', label: 'Other' },
  ]

  const getStatusStyle = (status) => ({
    display: 'inline-block',
    minWidth: '70px',
    padding: '1px 8px',
    borderRadius: '10px',
    textAlign: 'center',
    textTransform: 'capitalize',
    fontWeight: '400',
    backgroundColor:
      status === 'pending'
        ? '#dc3545'
        : status === 'answered'
          ? '#f5a623'
          : status === 'closed'
            ? '#28a745'
            : '#6c757d',
    color: 'white',
  })

  // Fetch tickets
  const { data: raiseticket = [], isFetching } = useQuery({
    queryKey: ['raiseticket'],
    queryFn: getAllRaiseTicektApi,
    staleTime: 1000 * 60 * 30,
  })

  // fetch supervisor
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })
  console.log('Supervisor Options:', supervisorOptions)

  // update data
  const { mutate: updateAnsweredTicket, isLoading: isSubmitting } = useMutation({
    mutationFn: ({ id, formData }) => patchAnsweredTicketApi(id, formData),
    onSuccess: () => {
      toast.success('Answered Ticket updated successfully!')
      setShowModalFrom(false)
      setEditMode(false)
      setEditingUser(null)
      queryClient.invalidateQueries(['raiseticket'])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update Answered Ticket')
    },
  })

  // use effect
  useEffect(() => {
    let data = [...raiseticket].reverse() // latest ticket

    // Filter by supervisor if selected
    if (selectedSupervisor?.value) {
      data = data.filter((raiseticket) => raiseticket.supervisorId === selectedSupervisor.value)
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      data = data.filter((ticket) => ticket.status === statusFilter.toLowerCase())
    }

    // Filter by ticket type
    if (selectedTicket) {
      data = data.filter((ticket) => ticket.ticketType === selectedTicket.value)
    }

    // Filter by date range
    const { startDate, endDate } = dateRange || {}
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)

      data = data.filter((item) => {
        const itemDate = new Date(item.originalDate)
        return itemDate >= start && itemDate <= end
      })
    }

    // Filter by search query
    if (searchQuery?.trim()) {
      const lowercasedQuery = searchQuery.toLowerCase()
      data = data.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    setFilteredData(data)
  }, [raiseticket, statusFilter, selectedTicket, dateRange, searchQuery, selectedSupervisor])

  // pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // table coluns
  const columns = [
    { label: 'Added Date', key: 'date', sortable: true },
    { label: 'Ticket ID', key: 'id', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Supervisor', key: 'supervisor', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Ticket Type', key: 'ticketType', sortable: true },
    { label: 'Description', key: 'description', sortable: true },
    { label: 'Feedback', key: 'feedback', sortable: true },
    { label: 'Update Date', key: 'updateDate', sortable: true },
    {
      label: 'Status',
      key: 'status',
      render: (row) => <span style={getStatusStyle(row.status)}>{row.status}</span>,
      sortable: false,
    },
  ]

  // tbale fields
  const field = [
    {
      name: 'feedback',
      label: 'Feedback',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'answered', label: 'Answered' },
        { value: 'closed', label: 'Closed' },
      ],
    },
  ]

  // handle edit
  const handleEditButton = (id) => {
    const record = filteredData.find((ticket) => ticket.id === id)
    if (!record) return

    const prefill = {
      id: record.id,
      feedback: record.feedback || '',
      status: record.status,
    }

    setEditingUser(prefill) // only send prefilled values
    setEditMode(true)
    setShowModalFrom(true)
  }

  // handle submit
  const handleFromSubmit = (formData) => {
    Swal.fire({
      title: 'Are you sure?',
      text: editMode ? 'Do you want to update this ticket?' : 'Do you want to add this ticket?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: editMode ? 'Yes, Update it' : 'Yes, Add it',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        if (editingUser) {
          updateAnsweredTicket({ id: editingUser.id, formData })
        }
      }
    })
  }

  // Handle Search
  const handleSearch = (query) => setSearchQuery(query)

  // Handle Date Range Change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
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
        onClick: () => {
          const cleanedData = filteredData.map(({ paymentMode, ...rest }) => ({
            ...rest,
            paymentMode:
              typeof paymentMode === 'string' ? paymentMode : paymentMode?.props?.children || '',
          }))
          exportToPDF({
            title: 'Answered Ticket Report',
            columns,
            data: cleanedData,
            fileName: 'Answered_Ticket_Report',
          })
        },
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () => {
          const cleanedData = filteredData.map(({ paymentMode, ...rest }) => ({
            ...rest,
            paymentMode:
              typeof paymentMode === 'string' ? paymentMode : paymentMode?.props?.children || '',
          }))
          exportToExcel({
            title: 'Answered Ticket Report',
            columns,
            data: cleanedData,
            fileName: 'Answered_Ticket_Report',
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

      {/* Filters */}
      <div className="mb-4">
        <div className="row g-3 align-items-center justify-content-between">
          {/* Left Filters */}
          <div className="col-lg-8 col-md-12">
            <div className="d-flex flex-wrap align-items-center gap-3">
              {/* Date Filters */}
              <DateRangeFilterCredence
                title="Added Date"
                onDateRangeChange={handleDateRangeChange}
              />
              <DateRangeFilterCredence
                title="Updated Date"
                onDateRangeChange={handleDateRangeChange}
              />

              {/* Dropdowns in Flexbox */}
              <div className="d-flex flex-wrap gap-3">
                <div style={{ minWidth: '200px' }}>
                  <SingleSelectDropdown
                    options={RaiseTicketOptions}
                    value={selectedTicket}
                    onChange={setSelectedTicket}
                    isClearable
                    placeholder="Filter by Raise Ticket..."
                  />
                </div>

                <div style={{ minWidth: '200px' }}>
                  <SingleSelectDropdown
                    options={supervisorOptions}
                    value={selectedSupervisor}
                    onChange={setSelectedSupervisor}
                    isClearable
                    placeholder="Filter by Supervisor Name..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Search Box */}
          <div className="col-lg-4 col-md-12 d-flex justify-content-end">
            <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
          </div>
        </div>
      </div>

      {/* Modal */}
      <ReusableModal
        show={showModalFrom}
        initialData={editMode ? editingUser : null}
        onClose={() => {
          setShowModalFrom(false)
          setEditMode(false)
          setEditingUser(null)
        }}
        onSubmit={handleFromSubmit}
        title={editMode ? 'Edit Ticket' : 'Add New Ticket'}
        size="lg"
        fields={field}
        isSubmitting={isSubmitting}
      />

      <hr />

      {/* Status Filter Cards */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {['ALL', 'pending', 'answered', 'closed'].map((status) => (
          <div key={status} onClick={() => setStatusFilter(status)} style={{ cursor: 'pointer' }}>
            <CardStatus
              label={status}
              count={
                status === 'ALL'
                  ? raiseticket.length
                  : raiseticket.filter((i) => i.status === status.toLowerCase()).length
              }
              color={
                status === 'pending'
                  ? 'danger'
                  : status === 'answered'
                    ? 'warning'
                    : status === 'closed'
                      ? 'success'
                      : 'primary'
              }
            />
          </div>
        ))}
      </div>

      {/* Table + Pagination */}
      <div className="mt-3">
        <Table
          title="All Answered Tickets"
          columns={columns}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          isFetching={isFetching}
          editButton={true}
          handleEditButton={handleEditButton}
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
      </div>

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default AnsweredTicket
