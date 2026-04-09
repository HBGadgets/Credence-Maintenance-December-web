import React, { useEffect, useState, useContext, useMemo } from 'react'
import {
  deleteGodownTPApi,
  getGodownTPApi,
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
import {
  getCompanyNameApi,
  getDigitalSignatureApi,
  getWorkerApi,
} from '../../TransportPass/data/data'
import { FaArrowUp, FaExchangeAlt, FaEye, FaPrint } from 'react-icons/fa'
import { HiOutlineLogout } from 'react-icons/hi'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import IconDropdown from '../../Supervisor/IconDropdown'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelArray from '../../customhooks/useExcelArray'

// Import the form components
import WarehouseForm from './component/WarehouseForm'
import WarehouseToPartyForm from './component/WarehouseToPartyForm'
import { Button, Card, Col, Modal, Row } from 'react-bootstrap'
import { FaWarehouse } from 'react-icons/fa6'
import StatusUpdateModal from './component/StatusUpdateModal'
import AcknowledgementImage from './component/AcknowledgementImage'
import TpInvoiceBill from './component/TpInvoiceBill'

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

  // for consignor select
  const [selectedConsignor, setSelectedConsignor] = useState(null)

  // for consignee select
  const [selectedConsignee, setSelectedConsignee] = useState(null)

  // for compant select
  const [selectedCompany, setSelectedCompany] = useState(null)

  // Add status filter state
  const [selectedStatus, setSelectedStatus] = useState('All')

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

  // Consignor and consignee options state
  const [consignorOptions, setConsignorOptions] = useState([])
  const [consigneeOptions, setConsigneeOptions] = useState([])

  // company option useState
  const [companyOptions, setCompanyOptions] = useState([])

  const queryClient = useQueryClient()

  // Add these state variables at the top of the component:
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedStatusRecord, setSelectedStatusRecord] = useState(null)
  const [statusModalLoading, setStatusModalLoading] = useState(false)

  // Add these state variables near other state variables
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(null)

  // Define status options
  const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Partially Correction', label: 'Partially Correction' },
  ]

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

  // Fetch godown lorry receipts with all filters
  const { data: getGodownTP, isFetching } = useQuery({
    queryKey: [
      'getGodownTP',
      {
        search: searchQuery,
        page: currentPage,
        limit: itemsPerPage,
        consignorId: selectedConsignor?.value || null,
        consigneeId: selectedConsignee?.value || null,
        companyId: selectedCompany?.value || null,
        workerId: selectedWorker?.value || null,
        status: selectedStatus !== 'All' ? selectedStatus : null, // Add status to query params
      },
    ],
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

  // Fetch company
  const { data: companyList, isFetched } = useQuery({
    queryKey: ['companyList'],
    queryFn: getCompanyNameApi,
    staleTime: 1000 * 60 * 30,
  })

  // Extract consignor and consignee options from fetched data
  useEffect(() => {
    if (getGodownTP?.receipts) {
      // Extract unique consignors
      const consignorsMap = {}
      const consigneesMap = {}
      const companiesMap = {}

      getGodownTP.receipts.forEach((item) => {
        // Add consignor
        if (item.consignorId && item.consignorName) {
          consignorsMap[item.consignorId] = {
            value: item.consignorId,
            label: item.consignorName,
          }
        }

        // Add consignee
        if (item.consigneeId && item.consigneeName) {
          consigneesMap[item.consigneeId] = {
            value: item.consigneeId,
            label: item.consigneeName,
          }
        }

        if (item.companyId && item.companyName) {
          companiesMap[item.companyId] = {
            value: item.companyId,
            label: item.companyName,
          }
        }
      })

      setCompanyOptions(Object.values(companiesMap))
      setConsignorOptions(Object.values(consignorsMap))
      setConsigneeOptions(Object.values(consigneesMap))
    }
  }, [getGodownTP])

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
      setStatusModalLoading(false)
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

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedConsignor(null)
    setSelectedConsignee(null)
    setSelectedName(null)
    setSelectedWorker(null)
    setSelectedCompany(null)
    setSelectedStatus('All')
    setDateRange({ startDate: null, endDate: null })
    setSearchQuery('')
    setCurrentPage(1)
    toast.info('All filters cleared')
  }

  // Handle status button click
  const handleStatusFilterClick = (status) => {
    setSelectedStatus(status)
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

      // Filter by consignor
      if (selectedConsignor?.value) {
        filtered = filtered.filter((receipt) => {
          return receipt.consignorId === selectedConsignor.value
        })
      }

      // Filter by consignee
      if (selectedConsignee?.value) {
        filtered = filtered.filter((receipt) => {
          return receipt.consigneeId === selectedConsignee.value
        })
      }

      // filter by company
      if (selectedCompany?.value) {
        filtered = filtered.filter((receipt) => {
          return receipt.companyId === selectedCompany.value
        })
      }

      setFilteredData(filtered)
    }
  }, [
    getGodownTP,
    dateRange,
    selectedName,
    selectedWorker,
    selectedConsignor,
    selectedConsignee,
    selectedCompany,
    userRole,
  ])

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
    return status === 'Cancelled' || status === 'Completed' || status === 'Partially Correction'
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

  // Updated handleStatusSubmit function with products support:
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

    // Append products data for Partially Correction
    if (statusData.status === 'Partially Correction' && statusData.products) {
      // Method 1: Send as JSON string
      formData.append('products', JSON.stringify(statusData.products))
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
              : status === 'Partially Correction'
                ? '#007bff' // blue color for partially correction
                : '#6c757d',
      color: 'white',
    }
  }

  // Status button style
  const getStatusButtonStyle = (status) => {
    const isActive = selectedStatus === status

    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '20px',
      border: '1px solid #dee2e6',
      fontSize: '14px',
      fontWeight: '400',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
    }

    if (isActive) {
      return {
        ...baseStyle,
        backgroundColor:
          status === 'All'
            ? '#6c757d'
            : status === 'Pending'
              ? '#f5a623'
              : status === 'Completed'
                ? '#28a745'
                : status === 'Cancelled'
                  ? '#dc3545'
                  : '#007bff',
        color: 'white',
        borderColor:
          status === 'All'
            ? '#6c757d'
            : status === 'Pending'
              ? '#f5a623'
              : status === 'Completed'
                ? '#28a745'
                : status === 'Cancelled'
                  ? '#dc3545'
                  : '#007bff',
      }
    }

    return {
      ...baseStyle,
      backgroundColor: 'white',
      color:
        status === 'All'
          ? '#6c757d'
          : status === 'Pending'
            ? '#f5a623'
            : status === 'Completed'
              ? '#28a745'
              : status === 'Cancelled'
                ? '#dc3545'
                : '#007bff',
      ':hover': {
        backgroundColor: '#f8f9fa',
      },
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

  // Frontend table columns (hidden columns excluded)
  const frontendColumns = [
    {
      label: 'Date',
      key: 'date',
      sortable: true,
    },
    { label: 'Recipt No', key: 'receiptNo', sortable: true },
    { label: 'Company Name', key: 'companyName', sortable: true },
    { label: 'Consignor Name', key: 'consignorName', sortable: true },
    { label: 'Consignee Name', key: 'consigneeName', sortable: true },
    { label: 'Material Owner', key: 'materialOwner', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
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

  // All columns for Excel export (including hidden ones)
  const allColumns = [
    {
      label: 'Date',
      key: 'date',
    },
    { label: 'Receipt No', key: 'receiptNo' },
    { label: 'Issued By', key: 'issuedBy' },
    { label: 'Received By', key: 'receivedBy' },
    { label: 'Company Name', key: 'companyName' },
    { label: 'Consignor Name', key: 'consignorName' },
    { label: 'Consignor Address', key: 'consignorAddress' },
    { label: 'Consignee Name', key: 'consigneeName' },
    { label: 'Consignee Address', key: 'consigneeAddress' },
    { label: 'Material Owner', key: 'materialOwner' },
    { label: 'Material Address', key: 'materialAddress' },
    { label: 'Start Location', key: 'startLocation' },
    { label: 'End Location', key: 'endLocation' },
    { label: 'Vehicle Name', key: 'vehicleName' },
    { label: 'Driver Name', key: 'driverName' },
    {
      label: 'Customer Rate',
      key: 'customerRate',
      render: (item) => `₹${item.customerRate}`,
    },
    {
      label: 'Transporter Rate',
      key: 'transporterRate',
      render: (item) => `₹${item.transporterRate}`,
    },
    {
      label: 'Customer Freight',
      key: 'customerFreight',
      render: (item) => `₹${item.customerFreight}`,
    },
    {
      label: 'Transporter Freight',
      key: 'transporterFreight',
      render: (item) => `₹${item.transporterFreight}`,
    },
    {
      label: 'Total Amount',
      key: 'totalAmount',
      render: (item) => `₹${item.totalAmount}`,
    },
    {
      label: 'Total Transporter Amount',
      key: 'totalTransporterAmount',
      render: (item) => `₹${item.totalTransporterAmount}`,
    },
    { label: 'Customer Rate On', key: 'customerRateOn' },
    { label: 'Transporter Rate On', key: 'transporterRateOn' },
    {
      label: 'Status',
      key: 'status',
      render: (row) => <span style={getStatusStyle(row.status)}>{row.status}</span>,
    },
    // REMOVED the Products column from here since we now expand products into separate rows
  ]

  // Memoized dropdown items for export
  const dropdownItems = useMemo(
    () => [
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () => {
          exportToExcel({
            title: 'Transport Pass Report',
            columns: allColumns,
            data: filteredData,
            fileName: 'Transport_Pass_Report',
            metaData: {
              'Export Date': new Date().toLocaleDateString(),
              'Total Records': filteredData.length,
              'Date Range':
                dateRange.startDate && dateRange.endDate
                  ? `${dateRange.startDate} to ${dateRange.endDate}`
                  : 'All Dates',
              'Consignor Filter': selectedConsignor?.label || 'All',
              'Consignee Filter': selectedConsignee?.label || 'All',
              'Status Filter': selectedStatus !== 'All' ? selectedStatus : 'All',
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
    [filteredData, exportToExcel, dateRange, selectedConsignor, selectedConsignee, selectedStatus],
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

  // Update handleViewButton function
  const handleViewButton = async (id) => {
    const selectedRow = filteredData.find((item) => item.id === id)

    if (!selectedRow) {
      return toast.error('Data not found for this ID')
    }

    // Check for digitalSignatureId before calling the API
    if (!selectedRow.digitalSignatureId || selectedRow.digitalSignatureId === 'Unknown') {
      console.log('No digitalSignatureId found for this entry:', selectedRow)

      // Still show invoice but without signature
      const invoiceData = mapToInvoiceData(selectedRow)
      setSelectedInvoiceData(invoiceData)
      setShowInvoiceModal(true)
      return
    }

    try {
      console.log('Fetching Digital Signature for ID:', selectedRow.digitalSignatureId)
      const response = await getDigitalSignatureApi(selectedRow.digitalSignatureId)

      // Assuming the API returns { signatureImage: "base64..." }
      const base64Image = response?.signatureImage
      const invoiceData = mapToInvoiceData(selectedRow)

      if (base64Image) {
        invoiceData.digitalSignature = `data:image/jpeg;base64,${base64Image}`
      }

      setSelectedInvoiceData(invoiceData)
      setShowInvoiceModal(true)
    } catch (error) {
      console.error('Error fetching digital signature:', error)

      // Still show invoice but without signature
      const invoiceData = mapToInvoiceData(selectedRow)
      setSelectedInvoiceData(invoiceData)
      setShowInvoiceModal(true)
      toast.warn('Showing invoice without digital signature')
    }
  }

  // Helper function to map API data to invoice format
  const mapToInvoiceData = (apiData) => {
    // Use the first product for item details (or aggregate if needed)
    const firstProduct = apiData.products?.[0] || {}

    // Calculate total bags and quantity from all products
    const totalBags =
      apiData.products?.reduce((sum, product) => sum + (product.totalBags || 0), 0) || 0
    const totalQuantityKg =
      apiData.products?.reduce((sum, product) => sum + (product.quantityMT || 0), 0) || 0

    return {
      // Company Details
      companyName: apiData.companyName,
      companyAddress: apiData.companyAddress,
      companyEmail: apiData.companyEmail,
      gstIn: apiData.companygstNumber,
      companyOfficeNumber: apiData.companyofficeNumber,
      companyMobileNumber: apiData.companymobileNumber,

      // Basic Details
      date: apiData.date,
      receiptNo: apiData.receiptNo,

      // Vehicle Details
      vehicleName: apiData.vehicleName,
      ownerName: apiData.materialOwner, // Assuming company is owner

      // Location Details
      startLocation: apiData.startLocation,
      endLocation: apiData.endLocation,
      containerNumber: 'N/A', // Not in API
      sealNumber: 'N/A', // Not in API

      // Parties Details
      consignorName: apiData.consignorName,
      consignorAddress: apiData.consignorAddress,
      consigneeName: apiData.consigneeName,
      consigneeAddress: apiData.consigneeAddress,

      // Material owner Details
      materialOwner: apiData.materialOwner,
      materialAddress: apiData.materialAddress,

      // Product/Item Details
      itemName:
        firstProduct.productName || apiData.products?.map((p) => p.productName).join(', ') || 'N/A',
      itemQuantity: totalBags,
      itemUnit: 'Bags',
      itemWeight: totalQuantityKg,
      itemcost: apiData.totalAmount,

      // Rate Details
      customerRate: apiData.customerRate,
      customerRateOn: apiData.customerRateOn,
      customerFreight: apiData.customerFreight,
      totalAmount: apiData.totalAmount,

      transporterRate: apiData.transporterRate,
      transporterRateOn: apiData.transporterRateOn,
      transporterFreight: apiData.transporterFreight,
      totalTransporterAmount: apiData.totalTransporterAmount,

      // Driver Details
      driverName: apiData.driverName,
      driverContact: 'N/A', // Not in API
      driverId: apiData.driverId,

      // Status
      status: apiData.status,

      // Other
      issuedBy: apiData.issuedBy,
      receivedBy: apiData.receivedBy,
      products: apiData.products || [],
    }
  }

  // Check if any filter is active
  const isAnyFilterActive = () => {
    return (
      selectedConsignor ||
      selectedConsignee ||
      selectedCompany ||
      selectedName ||
      selectedWorker ||
      selectedStatus !== 'All' ||
      dateRange.startDate ||
      searchQuery
    )
  }

  return (
    <>
      <ToastContainer />
      <div className="mb-3 d-flex justify-content-between align-items-center gap-2 w-100">
        <div className="d-flex align-items-center gap-2">
          <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />

          {/* Consignor and Consignee Dropdowns */}
          <div>
            <SingleSelectDropdown
              options={consignorOptions}
              value={selectedConsignor}
              onChange={setSelectedConsignor}
              isClearable
              placeholder="Consignor..."
              width="100px" // Custom width
            />
          </div>

          <div>
            <SingleSelectDropdown
              options={consigneeOptions}
              value={selectedConsignee}
              onChange={setSelectedConsignee}
              isClearable
              placeholder="Consignee..."
              width="100px" // Custom width
            />
          </div>

          <div>
            <SingleSelectDropdown
              options={companyOptions}
              value={selectedCompany}
              onChange={setSelectedCompany}
              isClearable
              placeholder="Company..."
              width="100px" // Custom width
            />
          </div>

          {userRole === 'superadmin' ? (
            <div className="d-flex align-items-center gap-2">
              <div>
                <SingleSelectDropdown
                  options={supervisorOptions}
                  value={selectedName}
                  onChange={(value) => {
                    setSelectedName(value)
                    setSelectedWorker(null)
                  }}
                  isClearable
                  placeholder="Supervisor..."
                  width="100px" // Custom width
                />
              </div>

              {selectedName && (
                <div>
                  <SingleSelectDropdown
                    options={workerOptions}
                    value={selectedWorker}
                    onChange={setSelectedWorker}
                    isClearable
                    placeholder="Worker..."
                    width="100px" // Custom width
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              <SingleSelectDropdown
                options={workerOptions}
                value={selectedWorker}
                onChange={setSelectedWorker}
                isClearable
                placeholder="Worker..."
                width="70px"
              />
            </div>
          )}

          {/* Clear Filters Button - Only show when filters are active */}
          {isAnyFilterActive() && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={clearAllFilters}
              className="d-flex align-items-center gap-1"
            >
              Clear Filters
            </Button>
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

      {/* Status Filter Buttons */}
      <div className="mb-3">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <span className="text-muted fw-medium me-2">Status:</span>
          {statusOptions.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => handleStatusFilterClick(status.value)}
              style={getStatusButtonStyle(status.value)}
              className="me-2"
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {getFormComponent()}
      <TableArray
        title="TP Pass Receipts"
        columns={frontendColumns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        editButton={true}
        deleteButton={false}
        statusButton={true}
        viewButton={true}
        viewButtonLabel="Invoice"
        handleEditButton={handleEditButton}
        handleDeleteButton={handleDeleteButton}
        handleStatusButton={handleStatusButtonClick}
        handleViewButton={handleViewButton}
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
        isLoading={isStatus || statusModalLoading}
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

      {/* Invoice Bill Modal */}
      <Modal show={showInvoiceModal} onHide={() => setShowInvoiceModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Transport Pass Invoice - {selectedInvoiceData?.receiptNo || 'N/A'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          {selectedInvoiceData ? (
            <TpInvoiceBill invoiceData={selectedInvoiceData} />
          ) : (
            <div className="text-center p-4">
              <p>No invoice data available.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInvoiceModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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
