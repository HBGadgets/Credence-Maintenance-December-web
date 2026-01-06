import React, { useEffect, useState, useContext, useMemo } from 'react'
import {
  deleteGodownTPApi,
  getGodownTPApi,
  // patchGodownTPApi,
  postGodownTPApi,
  patchGodownTPStatusApi,
  patchAcknowledgementsApi,
} from '../data/data'
import SearchInput from '../../components/SearchInput'
import SmartPagination from '../../components/SmartPagination'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import TableArray from '../../components/TableArray'
import AddButton from '../../components/AddButton'
import { toast, ToastContainer } from 'react-toastify'
import Swal from 'sweetalert2'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import { TokenContext } from '../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import { fetchSupervisor } from '../../DriverExpert/data/drivers'
import { getWorkerApi } from '../../TransportPass/data/data'
import { FaArrowUp, FaExchangeAlt, FaEye, FaPrint } from 'react-icons/fa'
import { HiOutlineLogout } from 'react-icons/hi'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import IconDropdown from '../../Supervisor/IconDropdown'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelArray from '../../customhooks/useExcelArray'

// Import the form components (only 2 now since RailheadForm is removed)
import WarehouseForm from './component/WarehouseForm'
import WarehouseToPartyForm from './component/WarehouseToPartyForm'
import { Button, Card, Col, Modal, Row } from 'react-bootstrap'
import { FaWarehouse } from 'react-icons/fa6'
import StatusUpdateModal from './component/StatusUpdateModal'
import AcknowledgementImage from './component/AcknowledgementImage'

const GodownLr = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelArray()
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
  const [selectedFormType, setSelectedFormType] = useState(null)

  // Image modal state
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState(null)

  const queryClient = useQueryClient()

  // Add these state variables at the top of the component:
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedStatusRecord, setSelectedStatusRecord] = useState(null)
  const [statusModalLoading, setStatusModalLoading] = useState(false)

  // Helper function to detect form type from record
  const detectFormType = (record) => {
    if (!record) return 'warehouse'

    // Check tpPassType first
    if (record.tpPassType) {
      if (record.tpPassType === 'warehouseToParty') {
        return 'warehouseToParty'
      }
      if (record.tpPassType === 'warehouse') {
        return 'warehouse'
      }
    }

    // Fallback detection based on fields
    if (record.issuedBy === 'Warehouse' && record.receivedBy === 'Party') {
      return 'warehouseToParty'
    }

    if (record.issuedBy === 'Railhead') {
      return 'warehouse'
    }

    // Default fallback to warehouse
    return 'warehouse'
  }

  // Fetch godown lorry receipts
  const { data: getGodownTP, isFetching } = useQuery({
    queryKey: ['getGodownTP', { search: searchQuery, page: currentPage, limit: itemsPerPage }],
    queryFn: getGodownTPApi,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 10,
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  // Fetch workers
  const { data: workerList = [], isFetch } = useQuery({
    queryKey: ['workerList'],
    queryFn: getWorkerApi,
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
      setSelectedFormType(null)
    },
    onError: (error) => toast.error(error.message),
  })

  // ========== PATCH ==========
  const { mutate: patchGodownTP, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, formData }) => patchGodownTPStatusApi(id, formData),
    onSuccess: () => {
      toast.success('Lorry receipt updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['getGodownTP'] })
      setShowForm(false)
      setFormMode('add')
      setSelectedData(null)
      setSelectedFormType(null)
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
      queryClient.invalidateQueries({ queryKey: ['getGodownTP'] })
    },
  })

  const { mutate: updateStatusWithImage, isLoading: isStatus } = useMutation({
    mutationFn: ({ id, formData }) => patchAcknowledgementsApi(id, formData),
    onSuccess: () => {
      toast.success('Status updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['getGodownTP'] })
      setShowStatusModal(false)
      setSelectedStatusRecord(null)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update status')
      queryClient.invalidateQueries({ queryKey: ['getGodownTP'] })
      setStatusModalLoading(false)
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
    setCurrentPage(1)
  }

  // Update filtered data when API data changes
  useEffect(() => {
    if (getGodownTP?.receipts) {
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
        filtered = filtered.filter((receipt) => {
          return (
            receipt.supervisorId === selectedName.value ||
            receipt.supervisor_id === selectedName.value ||
            receipt.supervisor === selectedName.value
          )
        })
      }

      // Filter by workerId
      if (selectedWorker?.value) {
        filtered = filtered.filter((receipt) => {
          return (
            receipt.workerId === selectedWorker.value ||
            receipt.worker_id === selectedWorker.value ||
            receipt.worker === selectedWorker.value
          )
        })
      }

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

  // handleEditButton - Fixed to detect correct form type
  const handleEditButton = (id) => {
    const record = filteredData.find((item) => item.id === id)
    if (record) {
      setSelectedData(record)
      setFormMode('edit')
      const formType = detectFormType(record)
      setSelectedFormType(formType)
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

  // Function to check if status button should be disabled
  const shouldDisableStatusButton = (status) => {
    return status === 'Cancelled' || status === 'Completed'
  }

  // Handle checkbox status change
  const handleStatusButtonClick = (id) => {
    const record = filteredData.find((item) => item.id === id)
    if (!record) return

    // Check if status is Cancelled or Completed
    if (shouldDisableStatusButton(record.status)) {
      toast.info(`Cannot update status for ${record.status} entries`)
      return // Don't open modal
    }

    setSelectedStatusRecord(record)
    setShowStatusModal(true)
  }

  // Update the handleStatusSubmit function:
  const handleStatusSubmit = (statusData) => {
    if (!selectedStatusRecord) return

    setStatusModalLoading(true)

    // Create FormData object
    const formData = new FormData()

    // Append status
    formData.append('status', statusData.status || 'Pending')

    // Append image if it exists
    if (statusData.image) {
      formData.append('acknowledgementImage', statusData.image)
    }

    // Use the correct mutation function that handles FormData
    updateStatusWithImage({
      id: selectedStatusRecord.id,
      formData: formData,
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

  // Add a render function for image preview in table
  const renderImagePreview = (item) => {
    if (!item.acknowledgementImage) {
      return <span className="text-muted">No Image</span>
    }

    const fullImageUrl = `${import.meta.env.VITE_API_URL}${item.acknowledgementImage}`

    return (
      <div className="d-flex justify-content-center">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedImageUrl(fullImageUrl)
            setShowImageModal(true)
          }}
          className="d-flex align-items-center gap-2"
        >
          <FaEye /> View Image
        </Button>
      </div>
    )
  }

  // table columns
  const columns = [
    {
      label: 'Date',
      key: 'date',
      sortable: true,
    },
    { label: 'Recipt No', key: 'receiptNo', sortable: true },
    { label: 'Issued By', key: 'issuedBy', sortable: true },
    { label: 'Received By', key: 'receivedBy', sortable: true },
    { label: 'Company Name', key: 'companyName', sortable: true },
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
      label: 'Acknowledgement',
      key: 'acknowledgementImage',
      render: renderImagePreview,
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
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () => {
          exportToExcel({
            title: 'All Godown Transport Pass Report',
            columns: columns.filter((col) => !col.hidden),
            data: filteredData,
            fileName: 'Godown_Transport_Pass_Report',
            metaData: {
              'Export Date': new Date().toLocaleDateString(),
              'Total Records': filteredData.length,
              'Date Range':
                dateRange.startDate && dateRange.endDate
                  ? `${dateRange.startDate} to ${dateRange.endDate}`
                  : 'All Dates',
            },
            includeProducts: true,
            productsLabel: 'Products Details',
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
    [filteredData, columns, exportToExcel, dateRange],
  )

  // Handle Add button click - show type selection
  const handleAddButtonClick = () => {
    setFormMode('add')
    setSelectedData(null)
    setSelectedFormType(null)
    setShowForm(true)
  }

  // Get the correct form component based on mode and type
  const getFormComponent = () => {
    if (!showForm) return null

    // In edit mode, always use detected form type
    const formType =
      formMode === 'edit' && selectedData ? detectFormType(selectedData) : selectedFormType

    const commonProps = {
      show: showForm,
      handleClose: () => {
        setShowForm(false)
        setSelectedData(null)
        setFormMode('add')
        setSelectedFormType(null)
      },
      handleSubmit: handleFormSubmit,
      initialData: selectedData,
      mode: formMode,
      isLoading: isSubmitting || isUpdating,
      onFormTypeChange: setSelectedFormType,
    }

    switch (formType) {
      case 'warehouse':
        return <WarehouseForm {...commonProps} />
      case 'warehouseToParty':
        return <WarehouseToPartyForm {...commonProps} />
      default:
        if (formMode === 'add') {
          return (
            <FormTypeSelection
              show={showForm}
              handleClose={() => {
                setShowForm(false)
                setSelectedData(null)
                setFormMode('add')
                setSelectedFormType(null)
              }}
              onSelectType={setSelectedFormType}
            />
          )
        }
        return null
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="mb-3 d-flex justify-content-between align-items-center gap-2 w-100">
        <div className="d-flex align-items-center gap-2">
          <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />

          {userRole === 'superadmin' ? (
            <div className="d-flex align-items-center gap-2">
              <div style={{ minWidth: '140px' }}>
                <SingleSelectDropdown
                  options={supervisorOptions}
                  value={selectedName}
                  onChange={(value) => {
                    setSelectedName(value)
                    setSelectedWorker(null)
                  }}
                  isClearable
                  placeholder="Supervisor..."
                />
              </div>

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
          <AddButton label="Add Lorry Receipt" onClick={handleAddButtonClick} />
        </div>
      </div>

      {getFormComponent()}
      <TableArray
        title="TP Pass Receipts"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        editButton={true}
        deleteButton={true}
        statusButton={true}
        handleEditButton={handleEditButton}
        handleDeleteButton={handleDeleteButton}
        handleStatusButton={handleStatusButtonClick}
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

      {/* Status Update Modal */}
      <StatusUpdateModal
        show={showStatusModal}
        onHide={() => {
          setShowStatusModal(false)
          setSelectedStatusRecord(null)
          setStatusModalLoading(false)
        }}
        onSubmit={handleStatusSubmit}
        isLoading={isStatus}
        currentStatus={selectedStatusRecord?.status || 'Pending'}
        recordData={selectedStatusRecord}
      />

      {/* Image Viewer Modal */}
      <AcknowledgementImage
        show={showImageModal}
        onHide={() => {
          setShowImageModal(false)
          setSelectedImageUrl(null)
        }}
        imageUrl={selectedImageUrl}
      />

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

// Form Type Selection Component
const FormTypeSelection = ({ show, handleClose, onSelectType }) => {
  const [isLoading] = useState(false)

  if (!show) return null

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Select TP Pass Type</h4>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4 pt-0">
        <div className="text-center py-3">
          <h5 className="mb-4">Choose the type of TP Pass you want to create</h5>
          <Row className="justify-content-center g-4">
            {/* Removed the Railhead card */}

            <Col md={6} lg={6}>
              <Card
                className="h-100 cursor-pointer border-success"
                onClick={() => onSelectType('warehouse')}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center py-4">
                  <FaWarehouse className="text-success mb-3" size={48} />
                  <Card.Title className="mb-2">Railhead to Warehouse/Party</Card.Title>
                  <Card.Text className="text-muted small">
                    Default: Issued by <strong>Railhead</strong> • Received by{' '}
                    <strong>Warehouse/Party</strong>
                  </Card.Text>
                  <div className="mt-3">
                    <Button variant="success" disabled={isLoading}>
                      Select This Option
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={6}>
              <Card
                className="h-100 cursor-pointer border-warning"
                onClick={() => onSelectType('warehouseToParty')}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center py-4">
                  <FaExchangeAlt className="text-warning mb-3" size={48} />
                  <Card.Title className="mb-2">Warehouse to Party</Card.Title>
                  <Card.Text className="text-muted small">
                    Default: Issued by <strong>Warehouse</strong> • Received by{' '}
                    <strong>Party</strong>
                  </Card.Text>
                  <div className="mt-3">
                    <Button variant="warning" disabled={isLoading}>
                      Select This Option
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="mt-4">
            <Button variant="outline-secondary" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default GodownLr
