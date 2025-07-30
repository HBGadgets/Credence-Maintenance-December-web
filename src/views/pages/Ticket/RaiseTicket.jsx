import React, { useEffect, useState } from 'react'
import SmartPagination from '../../components/SmartPagination'
import Table from '../../components/Table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import CardStatus from './component/CardStatus'
import SearchInput from '../../components/SearchInput'
import AddButton from '../../components/AddButton'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import { getAllRaiseTicektApi, postRaiseTicketApi } from './data/data'
import { fetchVehicles } from '../../vehicle/data/VehicleListData'
import { toast, ToastContainer } from 'react-toastify'
import ReusableModal from '../../components/ReusableModal'
import Swal from 'sweetalert2'

const RaiseTicket = () => {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state
  const [selectedTicket, setSelectedTicket] = useState(null)

  const [showModalFrom, setShowModalFrom] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [submitEdit, setSubmitEdit] = useState(false)

  const [statusFilter, setStatusFilter] = useState('ALL')

  const queryClient = useQueryClient()

  const RaiseTicketOptions = [
    { value: 'technical Issue', label: 'Technical Issue' },
    { value: 'Account Related', label: 'Account Related' },
    { value: 'Software Demo', label: 'Software Demo' },
    { value: 'Video Demo Request', label: 'Video Demo Request' },
    { value: 'Software Error', label: 'Software Error' },
    { value: 'Other', label: 'Other' },
  ]

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
        status === 'pending'
          ? '#dc3545'
          : status === 'answered'
            ? '#f5a623'
            : status === 'closed'
              ? '#28a745'
              : '#6c757d',
      color: 'white',
    }
  }

  // Fetch raised tickets
  const { data: raiseticket, isFetching } = useQuery({
    queryKey: ['raiseticket'],
    queryFn: getAllRaiseTicektApi,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  })

  // Fetch vehicle data
  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
    staleTime: 1000 * 60 * 30,
  })

  // Add ticket mutation
  const { mutate: raiseTicketData, isLoading: isSubmitting } = useMutation({
    mutationFn: postRaiseTicketApi,
    onSuccess: () => {
      toast.success('Raised Ticket added successfully!')
      setShowModalFrom(false)
      queryClient.invalidateQueries(['raiseticket']) // Refresh list
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add raised ticket')
    },
  })

  // useeffect
  useEffect(() => {
    if (raiseticket) {
      let filtered = [...raiseticket].reverse() // Most recent first

      // filter by status
      if (statusFilter !== 'ALL') {
        filtered = filtered.filter((ticket) => ticket.status === statusFilter)
      }

      // filter ticket
      if (selectedTicket) {
        filtered = filtered.filter((ticket) => ticket.ticketType === selectedTicket.value)
      }

      // Filter by date range
      const { startDate, endDate } = dateRange || {}
      if (startDate && endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)

        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.originalDate) // fix this line
          return itemDate >= start && itemDate <= end
        })
      }

      // Filter by search query
      if (searchQuery?.trim()) {
        const lowercasedQuery = searchQuery.toLowerCase()

        filtered = filtered.filter((item) =>
          Object.values(item).some(
            (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
          ),
        )
      }

      setFilteredData(filtered)
    }
  }, [raiseticket, statusFilter, selectedTicket, dateRange, searchQuery])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // filed for from
  const field = [
    {
      name: 'vehicle',
      label: 'Vehicle Name (Optional)',
      type: 'select',
      options: vehicles.map((veh) => ({
        label: veh.name,
        value: veh.name,
      })),
    },
    {
      name: 'ticketType',
      label: 'Ticket Type',
      type: 'select',
      options: RaiseTicketOptions,
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter ticket description',
      required: true,
    },
  ]

  // coloumn
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

  //  handle submit
  const handleFromSubmit = (formData) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to add this ticket?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Add it',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        raiseTicketData(formData)
      }
    })
  }

  // Handle Search
  const handleSearch = (query) => setSearchQuery(query)

  // Handle Date Range Change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }

  return (
    <>
      <ToastContainer />

      {/* Filters */}
      <div className="mb-4">
        <div className="row g-3 align-items-center justify-content-between">
          {/* Left side filters */}
          <div className="col-lg-6 col-md-12 d-flex flex-wrap align-items-center gap-2">
            <DateRangeFilterCredence title="Added Date" onDateRangeChange={handleDateRangeChange} />
            <DateRangeFilterCredence
              title="Updated Date"
              onDateRangeChange={handleDateRangeChange}
            />
            <div>
              <SingleSelectDropdown
                options={RaiseTicketOptions}
                value={selectedTicket}
                onChange={setSelectedTicket}
                isClearable
                placeholder="Filter by Raise Ticket..."
              />
            </div>
          </div>

          {/* Right side buttons */}
          <div className="col-lg-4 col-md-12 d-flex justify-content-end gap-2">
            <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
            <AddButton
              label="Add Ticket"
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
      <div className="d-flex flex-wrap gap-2">
        {['ALL', 'pending', 'answered', 'closed'].map((status) => (
          <div key={status} onClick={() => setStatusFilter(status)} style={{ cursor: 'pointer' }}>
            <CardStatus
              label={status}
              count={
                status === 'ALL'
                  ? raiseticket?.length || 0
                  : raiseticket?.filter((i) => i.status === status).length || 0
              }
              color={
                statusFilter === status
                  ? 'dark' // Active card gets darker
                  : status === 'pending'
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
          title="All Raised Tickets"
          columns={columns}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          isFetching={isFetching}
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
    </>
  )
}

export default RaiseTicket
