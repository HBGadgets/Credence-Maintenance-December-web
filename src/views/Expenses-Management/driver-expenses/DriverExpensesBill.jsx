import React, { useContext, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import BillShow from '../../components/BillModal/BillShow'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteDriverExpenseApi,
  getAllDriverExpesesListApi,
  getDriverBillImageApi,
  patchDriverExpenseApi,
  postDriverExpenseApi,
} from '../data/data'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import IconDropdown from '../../Supervisor/IconDropdown'
import AddButton from '../../components/AddButton'
import { FaPlus } from 'react-icons/fa'
import ReusableModal from '../../components/ReusableModal'
import { fetchDrivers, fetchSupervisor } from '../../DriverExpert/data/drivers'
import Swal from 'sweetalert2'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import { TokenContext } from '../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'

const DriverExpensesBill = () => {
  const queryClient = useQueryClient()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state

  // Use state for modal
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  // from field
  const [showModalFrom, setShowModalFrom] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [submitEdit, setSubmitEdit] = useState(false)

  //  select driver inpt box
  const [selectedDriverId, setSelectedDriverId] = useState(null)

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // Fetch Data
  const { data: driverExpenseList = [], isFetching } = useQuery({
    queryKey: ['driverExpenseList'],
    queryFn: getAllDriverExpesesListApi,
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  })

  // Fetch drivers name
  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: fetchDrivers,
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  })
  console.log('drivers list', drivers)

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  // Post driver expense
  const { mutate: addDriverExpense, isLoading: isSubmitting } = useMutation({
    mutationFn: postDriverExpenseApi,
    onSuccess: (data) => {
      toast.success('Driver expense added successfully!')
      setShowModalFrom(false)
      queryClient.invalidateQueries(['driverExpenseList']) // Refresh the list
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add driver expense')
    },
  })

  // Patch driver expense
  const { mutate: updateDriverExpense, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, formData }) => patchDriverExpenseApi(id, formData),
    onSuccess: () => {
      toast.success('Driver expense updated successfully!')
      setShowModalFrom(false)
      setEditMode(false)
      setEditingUser(null)
      queryClient.invalidateQueries(['driverExpenseList'])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update driver expense')
    },
  })

  // Delete driver expense
  const { mutate: deleteDriverExpense } = useMutation({
    mutationFn: deleteDriverExpenseApi,
    onSuccess: () => {
      toast.success('Driver expense deleted successfully!')
      queryClient.invalidateQueries(['driverExpenseList'])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete driver expense')
    },
  })

  useEffect(() => {
    let filtered = driverExpenseList

    // Filter by supervisor if selected
    if (selectedName?.value) {
      filtered = filtered.filter((driverexp) => driverexp.supervisor === selectedName.value)
    }

    // Filter by date range if available
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.originalDate)
        return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
      })
    }

    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    // Apply styling AFTER filtering
    const styledData = filtered.map((data) => ({
      ...data,
      paymentMode: (
        <span
          style={{
            backgroundColor:
              data.paymentMode === 'upi'
                ? '#0000FF'
                : data.paymentMode === 'cash'
                  ? '#28a745'
                  : data.paymentMode === 'card'
                    ? '#f5a623'
                    : '#0000FF',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            display: 'inline-block',
            textTransform: 'capitalize',
          }}
        >
          {data.paymentMode}
        </span>
      ),

      coordinate:
        data.lat !== 'No latitude' && data.long !== 'No Longitude'
          ? `${data.lat}, ${data.long}`
          : 'No coordinates',
    }))

    setFilteredData(styledData)
  }, [searchQuery, driverExpenseList, dateRange, selectedName])

  console.log('All Driver Expenses Data: ', filteredData)

  // In field data

  const field = [
    ...(!editMode
      ? [
          {
            name: 'driverId',
            label: 'Driver Name',
            type: 'select',
            placeholder: 'Enter Driver name',
            options:
              drivers?.map((drv) => ({
                label: drv.name,
                value: drv.id,
              })) || [],
            required: true,
            onChange: (e) => {
              setSelectedDriverId(e.target.value)
            },
          },
        ]
      : []),

    {
      name: 'date',
      label: 'Date',
      type: 'date',
      placeholder: 'Enter Date',
      required: true,
    },
    {
      name: 'shopName',
      label: 'Shop Name',
      type: 'text',
      placeholder: 'Enter Shop Name',
      required: true,
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'Enter Location',
      required: true,
    },
    { name: 'description', label: 'Description', type: 'text', placeholder: 'Enter Description' },
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      placeholder: 'Enter Amount',
      required: true,
    },
    {
      name: 'paymentMode',
      label: 'Payment Mode',
      type: 'select',
      options: [
        { value: 'upi', label: 'UPI' },
        { value: 'cash', label: 'CASH' },
        { value: 'card', label: 'CARD' },
      ],
      required: true,
    },
    {
      name: 'billImg',
      label: 'Bill Image',
      type: 'file',
      accept: 'image/*',
    },
  ]

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Table Columns

  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    // { label: 'Current Vehicle', key: 'currentVehicleName', sortable: true },
    { label: 'Shop Name', key: 'shopName', sortable: true },
    { label: 'Location', key: 'location', sortable: true },
    { label: 'Co-ordinate', key: 'coordinate', sortable: true },
    { label: 'Description', key: 'description', sortable: true },
    { label: 'Amount', key: 'amount', sortable: true },
    { label: 'Payment Mode', key: 'paymentMode', sortable: false },
  ]

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Handle Date Range Change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }

  // Handle View Button

  const handleViewButton = async (id) => {
    const selectedRow = filteredData.find((item) => item.id === id)
    if (!selectedRow) {
      return toast.error('Data not found for this ID')
    }

    if (!selectedRow.billImg) {
      return toast.warn('No bill image available for this entry.')
    }

    try {
      const response = await getDriverBillImageApi(selectedRow.billImg)
      const { base64Data, contentType } = response

      if (base64Data && contentType) {
        const fileSrc = `data:${contentType};base64,${base64Data}`
        console.log('Document bill image:', fileSrc)
        setPdfBase64(fileSrc)

        if (contentType.startsWith('application/pdf')) {
          setModalTitle('Driver Bill (PDF)')
        } else if (contentType.startsWith('image')) {
          setModalTitle('Driver Bill (Image)')
        } else {
          setModalTitle('Driver Bill (File)')
        }

        setShowModal(true)
      } else {
        toast.error('Invalid bill image data.')
      }
    } catch (error) {
      console.error('Failed to fetch bill image:', error)
      toast.error('No bill image found.')
    }
  }

  // handle edit
  const handleEditButton = (id) => {
    const record = filteredData.find((item) => item.id === id)
    if (record) {
      // find the correct driver ID by matching the driver name from the drivers list
      const driver = drivers.find((d) => d.name === record.driverName)

      setEditMode(true)
      setEditingUser({
        ...record,
        driverId: driver?.id || '', // use driver ID, fallback to empty string
        date: new Date(record.originalDate).toISOString().split('T')[0], // convert to yyyy-mm-dd
        paymentMode:
          typeof record.paymentMode === 'string'
            ? record.paymentMode
            : record.paymentMode?.props?.children?.toLowerCase(),
      })

      setShowModalFrom(true)
    }
  }

  // handle delete
  const handleDeleteButton = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDriverExpense(id)
      }
    })
  }

  // handle submit

  const handleFormSubmit = (formData) => {
    if (editMode && editingUser?.id) {
      // ✅ Ensure driverId is injected from editingUser
      if (!formData.driverId) {
        formData.driverId = editingUser.driverId
      }

      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this driver expense?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Update it',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          updateDriverExpense({ id: editingUser.id, formData })
        }
      })
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to add this driver expense?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Add it',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          addDriverExpense(formData)
        }
      })
    }
  }

  // Dropdown items for export
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () => {
        const cleanedData = filteredData.map(({ paymentMode, ...rest }) => ({
          ...rest,
          paymentMode:
            typeof paymentMode === 'string' ? paymentMode : paymentMode?.props?.children || '', // Extract text if it's a React element
        }))

        exportToPDF({
          title: 'Driver Expense Report',
          columns: columns,
          data: cleanedData,
          fileName: 'Driver_Expenses_Report',
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
            typeof paymentMode === 'string' ? paymentMode : paymentMode?.props?.children || '', // fallback if styled span
        }))

        exportToExcel({
          title: 'Driver Expenses Report',
          columns: columns,
          data: cleanedData,
          fileName: 'Driver_Expenses_Report',
        })
      },
    },

    {
      icon: FaPrint,
      label: 'Print Page',
      onClick: () => window.print(),
    },

    {
      icon: FaArrowUp,
      label: 'Scroll To Top',
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
  ]

  console.log('selectedName:', selectedName)
  console.log('Comparing supervisor:', {
    selectedValue: selectedName?.value,
    selectedLabel: selectedName?.label,
  })

  console.log('Supervisors:', supervisorOptions)

  return (
    <>
      <ToastContainer />

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
          {userRole === 'superadmin' && (
            <div style={{ width: '150px' }}>
              <SingleSelectDropdown
                options={supervisorOptions}
                value={selectedName}
                onChange={setSelectedName}
                isClearable
                placeholder="Filter by Supervisor Name..."
              />
            </div>
          )}
        </div>
        <div className="d-flex justify-content-end align-items-center gap-2 w-75">
          <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />

          <AddButton
            label="Add Driver Expense"
            // icon={<FaPlus />}
            onClick={() => {
              setEditMode(false)
              setSubmitEdit(false)
              setEditingUser(null)
              setShowModalFrom(true)
            }}
          />
        </div>
      </div>

      <ReusableModal
        show={showModalFrom}
        initialData={editMode ? editingUser : null}
        onClose={() => {
          setShowModalFrom(false)
          setEditMode(false)
          setEditingUser(null)
        }}
        onSubmit={handleFormSubmit}
        title={editMode ? 'Edit Driver Expense' : 'Add New Driver Expense'}
        size="xl"
        fields={field}
        isSubmitting={isSubmitting || isUpdating}
      />

      <Table
        title="All Drivers Expenses List"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        viewButton={true}
        handleViewButton={handleViewButton}
        editButton={true}
        handleEditButton={handleEditButton}
        deleteButton={true}
        handleDeleteButton={handleDeleteButton}
        viewButtonLabel="Image"
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

      {/* Modal Component */}
      <BillShow
        showModal={showModal}
        setShowModal={setShowModal}
        pdfBase64={pdfBase64}
        modalTitle={modalTitle}
      />

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default DriverExpensesBill
