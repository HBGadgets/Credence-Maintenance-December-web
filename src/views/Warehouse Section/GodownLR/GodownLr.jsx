import React, { useEffect, useState, useContext, useMemo } from 'react'
import {
  deleteGodownTPApi,
  getGodownTPApi,
  patchGodownTPApi,
  postGodownTPApi,
  patchGodownTPStatusApi,
} from '../data/data'
import SearchInput from '../../components/SearchInput'
import SmartPagination from '../../components/SmartPagination'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import TableArray from '../../components/TableArray'
import AddButton from '../../components/AddButton'
import GodownLRFrom from './component/GodownLRFrom'
import { toast, ToastContainer } from 'react-toastify'
import Swal from 'sweetalert2'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import { TokenContext } from '../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import { fetchSupervisor } from '../../DriverExpert/data/drivers'
import { getWorkerApi } from '../../TransportPass/data/data'
import { FaArrowUp, FaPrint } from 'react-icons/fa'
import { HiOutlineLogout } from 'react-icons/hi'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import IconDropdown from '../../Supervisor/IconDropdown'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'

const GodownLr = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  // Date range state
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // for worker select
  const [selectedWorker, setSelectedWorker] = useState(null)

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // Modal states
  const [showForm, setShowForm] = useState(false)
  const [formMode, setFormMode] = useState('add')
  const [selectedData, setSelectedData] = useState(null)

  const queryClient = useQueryClient()

  // Fetch godown lorry receipts
  const { data: getGodownTP, isFetching } = useQuery({
    queryKey: ['getGodownTP', { search: searchQuery, page: currentPage, limit: itemsPerPage }],
    queryFn: getGodownTPApi,
    keepPreviousData: true,
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor, // Make sure this function is imported/defined
    staleTime: 1000 * 60 * 10,
  })

  // Fetch workers
  const { data: workerList = [], isFetch } = useQuery({
    queryKey: ['workerList'],
    queryFn: getWorkerApi, // Make sure this function is imported/defined
    staleTime: 1000 * 60 * 30,
  })

  // Worker options based on selected supervisor
  const workerOptions = selectedName?.value
    ? workerList
        .filter((w) => w.supervisorId === selectedName.value)
        .map((w) => ({ value: w.id, label: w.name }))
    : workerList.map((w) => ({ value: w.id, label: w.name }))

  // ========== POST ==========
  const { mutate: postGodownTP, isLoading: isSubmitting } = useMutation({
    mutationFn: postGodownTPApi,
    onSuccess: () => {
      toast.success('Lorry receipt added successfully!')
      queryClient.invalidateQueries({ queryKey: ['getGodownTP'] })
      setShowForm(false)
    },
    onError: (error) => toast.error(error.message),
  })

  // ========== PATCH ==========
  const { mutate: patchGodownTP, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, formData }) => patchGodownTPApi(id, formData),
    onSuccess: () => {
      toast.success('Lorry receipt updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['getGodownTP'] })
      setShowForm(false)
      setFormMode('add')
      setSelectedData(null)
    },
    onError: (error) => toast.error(error.message),
  })

  // ========== PATCH STATUS ==========
  const { mutate: updateStatus, isLoading: isUpdatingStatus } = useMutation({
    mutationFn: ({ id, status }) => patchGodownTPStatusApi(id, { status }),
    onSuccess: () => {
      toast.success(`Status updated to ${status} successfully!`)
      queryClient.invalidateQueries({ queryKey: ['getGodownTP'] })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update status')
      // Revert local state on error
      queryClient.invalidateQueries({ queryKey: ['getGodownTP'] })
    },
  })

  // ========== DELETE ==========
  const { mutate: deleteGodownTP } = useMutation({
    mutationFn: deleteGodownTPApi,
    onSuccess: () => {
      toast.success('Lorry receipt deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['getGodownTP'] })
    },
    onError: (error) => toast.error(error.message),
  })

  // Handle date range change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
    setCurrentPage(1) // Reset to first page when date changes
  }

  // Update filtered data when API data changes
  useEffect(() => {
    if (getGodownTP?.receipts) {
      console.log('API Response:', getGodownTP.receipts[0]) // Debug log
      console.log('Selected Supervisor:', selectedName?.value)
      console.log('Selected Worker:', selectedWorker?.value)

      let filtered = [...getGodownTP.receipts]

      // Filter by date range if selected
      if (dateRange.startDate && dateRange.endDate) {
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.originalDate)
          return (
            itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
          )
        })
      }

      // Filter by supervisor if superadmin and supervisor selected
      if (userRole === 'superadmin' && selectedName?.value) {
        console.log('Filtering by supervisorId:', selectedName.value)
        filtered = filtered.filter((receipt) => {
          console.log(
            'Receipt supervisorId:',
            receipt.supervisorId,
            receipt.supervisor_id,
            receipt.supervisor,
          )
          return (
            receipt.supervisorId === selectedName.value ||
            receipt.supervisor_id === selectedName.value ||
            receipt.supervisor === selectedName.value
          )
        })
      }

      // Filter by workerId
      if (selectedWorker?.value) {
        console.log('Filtering by workerId:', selectedWorker.value)
        filtered = filtered.filter((receipt) => {
          console.log('Receipt workerId:', receipt.workerId, receipt.worker_id, receipt.worker)
          return (
            receipt.workerId === selectedWorker.value ||
            receipt.worker_id === selectedWorker.value ||
            receipt.worker === selectedWorker.value
          )
        })
      }

      console.log('Filtered results:', filtered.length)
      setFilteredData(filtered)
    }
  }, [getGodownTP, dateRange, selectedName, selectedWorker, userRole])

  // Compute total pages
  const totalPages = getGodownTP ? Math.ceil(getGodownTP.total / getGodownTP.limit) : 1

  // Handle form submission
  const handleFormSubmit = (formData) => {
    if (formMode === 'add') {
      postGodownTP(formData)
    } else if (formMode === 'edit' && selectedData) {
      patchGodownTP({
        id: selectedData.id,
        formData,
      })
    }
  }

  // handleEditButton
  const handleEditButton = (id) => {
    const record = filteredData.find((item) => item.id === id)
    if (record) {
      setSelectedData(record)
      setFormMode('edit')
      setShowForm(true)
    }
  }

  // handleDeleteButton
  const handleDeleteButton = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteGodownTP(id)
      }
    })
  }

  // Handle checkbox status change
  const handleCheckboxChange = (id, isChecked) => {
    const record = filteredData.find((item) => item.id === id)
    if (!record) return

    const newStatus = isChecked ? 'Completed' : 'Pending'

    // Show confirmation before making changes
    const currentStatus = record.status
    const actionText = isChecked ? 'mark as Completed' : 'mark as Pending'

    Swal.fire({
      title: `Change Status to ${newStatus}?`,
      text: `Are you sure you want to ${actionText}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, change to ${newStatus}`,
      cancelButtonText: 'Cancel',
      confirmButtonColor: newStatus === 'Completed' ? '#28a745' : '#f5a623',
    }).then((result) => {
      if (result.isConfirmed) {
        // Update local state immediately for instant UI feedback
        const updatedData = filteredData.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item,
        )
        setFilteredData(updatedData)

        // Call API to update status
        updateStatus({ id, status: newStatus })
      }
      // If cancelled, do nothing - checkbox will remain as is
    })
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // status colour
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
        status === 'Pending'
          ? '#f5a623'
          : status === 'Completed'
            ? '#28a745'
            : status === 'Cancelled'
              ? '#dc3545'
              : '#6c757d',
      color: 'white',
    }
  }

  // table columns
  const columns = [
    {
      label: 'Date',
      key: 'date',
      sortable: true,
      render: (item) => formatDate(item.date),
    },
    { label: 'Owner Name', key: 'ownerName', sortable: true },
    { label: 'Consignor Name', key: 'consignorName', sortable: true },
    { label: 'Consignor Address', key: 'consignorAddress' },
    { label: 'Consignee Name', key: 'consigneeName', sortable: true },
    { label: 'Consignee Address', key: 'consigneeAddress' },
    { label: 'Customer Name', key: 'customerName', sortable: true },
    { label: 'Customer Address', key: 'customerAddress' },
    { label: 'Start Location', key: 'startLocation', sortable: true },
    { label: 'End Location', key: 'endLocation', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Worker Name', key: 'workerName', sortable: true },
    {
      label: 'Customer Rate',
      key: 'customerRate',
      sortable: true,
      render: (item) => `₹${item.customerRate}`,
    },
    {
      label: 'Transporter Rate',
      key: 'transporterRate',
      sortable: true,
      render: (item) => `₹${item.transporterRate}`,
    },
    {
      label: 'Customer Freight',
      key: 'customerFreight',
      sortable: true,
      render: (item) => `₹${item.customerFreight}`,
    },
    {
      label: 'Transporter Freight',
      key: 'transporterFreight',
      sortable: true,
      render: (item) => `₹${item.transporterFreight}`,
    },
    {
      label: 'Total Amount',
      key: 'totalAmount',
      sortable: true,
      render: (item) => `₹${item.totalAmount}`,
    },
    {
      label: 'Total Transporter Amount',
      key: 'totalTransporterAmount',
      sortable: true,
      render: (item) => `₹${item.totalTransporterAmount}`,
    },
    { label: 'Customer Rate On', key: 'customerRateOn' },
    { label: 'Transporter Rate On', key: 'transporterRateOn' },
    {
      label: 'Products',
      key: 'products',
      render: (item) => {
        if (!item.products || item.products.length === 0) return 'No products'
        return `${item.products.length} product(s)`
      },
    },
    {
      label: 'Status',
      key: 'status',
      render: (row) => <span style={getStatusStyle(row.status)}>{row.status}</span>,
    },
  ]

  // Memoized dropdown items for export
  const dropdownItems = useMemo(
    () => [
      // {
      //   icon: FaRegFilePdf,
      //   label: 'Download PDF',
      //   onClick: () =>
      //     exportToPDF({
      //       title: 'All Transport Pass Report',
      //       columns,
      //       data: filteredData,
      //       fileName: 'Transport_Pass_Report',
      //     }),
      // },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () => {
          exportToExcel({
            title: 'All Godown Transport Pass Report',
            columns,
            data: filteredData,
            fileName: 'Godown_Transport_Pass_Report',
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

      <div className="mb-3 d-flex justify-content-between align-items-center gap-2 w-100">
        <div className="d-flex align-items-center gap-2">
          <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />

          {userRole === 'superadmin' ? (
            // Supervisor + Worker side by side
            <div className="d-flex align-items-center gap-2">
              {/* Supervisor Select */}
              <div style={{ minWidth: '140px' }}>
                <SingleSelectDropdown
                  options={supervisorOptions}
                  value={selectedName}
                  onChange={(value) => {
                    setSelectedName(value)
                    setSelectedWorker(null) // reset worker when supervisor changes
                  }}
                  isClearable
                  placeholder="Supervisor..."
                />
              </div>

              {/* Worker Select (only when supervisor selected) */}
              {selectedName && (
                <div style={{ minWidth: '140px' }}>
                  <SingleSelectDropdown
                    options={workerOptions}
                    value={selectedWorker}
                    onChange={setSelectedWorker}
                    isClearable
                    placeholder="Worker..."
                  />
                </div>
              )}
            </div>
          ) : (
            // Normal user → only worker select
            <div style={{ minWidth: '140px' }}>
              <SingleSelectDropdown
                options={workerOptions}
                value={selectedWorker}
                onChange={setSelectedWorker}
                isClearable
                placeholder="Worker..."
              />
            </div>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search by vehicle, driver, consignor..."
          />
          <AddButton
            label="Add Lorry Receipt"
            onClick={() => {
              setFormMode('add')
              setSelectedData(null)
              setShowForm(true)
            }}
          />
        </div>
      </div>

      <GodownLRFrom
        show={showForm}
        handleClose={() => {
          setShowForm(false)
          setSelectedData(null)
          setFormMode('add')
        }}
        handleSubmit={handleFormSubmit}
        initialData={selectedData}
        mode={formMode}
        isLoading={isSubmitting || isUpdating}
      />

      <TableArray
        title="Godown Lorry Receipts"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        editButton={true}
        deleteButton={true}
        checkButton={true}
        handleEditButton={handleEditButton}
        handleDeleteButton={handleDeleteButton}
        handleCheckboxButton={handleCheckboxChange}
        getCheckboxChecked={(row) => row.status === 'Completed'}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          const newItems = value === -1 ? filteredData.length : value
          setItemsPerPage(newItems)
          setCurrentPage(1)
        }}
      />

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default GodownLr
