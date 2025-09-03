import React, { useContext, useEffect, useState } from 'react'
import { getAllTodayExpesesListApi, getVehicleBillImageApi } from './data/data'
import SmartPagination from '../components/SmartPagination'
import Table from '../components/Table'
import { useQuery } from '@tanstack/react-query'
import BillShow from '../components/BillModal/BillShow'
import { toast, ToastContainer } from 'react-toastify'
import { TokenContext } from '../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import { fetchSupervisor } from '../DriverExpert/data/drivers'
import SearchInput from '../components/SearchInput'
import SingleSelectDropdown from '../components/SingleSelectDropdown'

const AllExpenses = () => {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const totalPages = Math.ceil(itemsPerPage === -1 ? 1 : (filteredData?.length || 0) / itemsPerPage)

  // Use state for modal
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // fetch data
  const { data: todayExpense = [], isFetching } = useQuery({
    queryKey: ['todayExpense'],
    queryFn: getAllTodayExpesesListApi,
    staleTime: 1000 * 60 * 30,
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  // for paymentmode color
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
        status === 'card'
          ? '#f5a623'
          : status === 'cash'
            ? '#28a745'
            : status === 'upi'
              ? '#0000FF'
              : '#6c757d',
      color: 'white',
    }
  }

  // useEffect
  useEffect(() => {
    if (!todayExpense) return

    let updatedData = [...todayExpense]

    // Filter by search query (case-insensitive, across multiple fields)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      updatedData = updatedData.filter(
        (item) =>
          item.driverName.toLowerCase().includes(query) ||
          item.currentVehicleName.toLowerCase().includes(query) ||
          (item.shopName || '').toLowerCase().includes(query) ||
          (item.expenseType || '').toLowerCase().includes(query) ||
          (item.description || '').toLowerCase().includes(query) ||
          (item.location || '').toLowerCase().includes(query) ||
          (item.paymentMode || '').toLowerCase().includes(query) ||
          String(item.amount).includes(query),
      )
    }

    // Filter by selected supervisor if applicable
    if (selectedName?.value) {
      updatedData = updatedData.filter(
        (todayExpense) => todayExpense.supervisor === selectedName.value,
      )
    }

    setFilteredData(updatedData)
  }, [searchQuery, todayExpense, selectedName])

  // cloumns table

  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Driver', key: 'driverName', sortable: true },
    { label: 'Vehicle', key: 'currentVehicleName', sortable: true },
    { label: 'Shop/Vendor', key: 'shopName', sortable: true },
    { label: 'Expense Type', key: 'expenseType', sortable: true },
    { label: 'Description', key: 'description', sortable: false },
    { label: 'Location', key: 'location', sortable: true },
    { label: 'Amount', key: 'amount', sortable: true },
    {
      label: 'Payment Mode',
      key: 'paymentMode',
      sortable: false,
      render: (row) => <span style={getStatusStyle(row.paymentMode)}>{row.paymentMode}</span>,
    },
  ]

  console.log('Comparing supervisor:', {
    selectedValue: selectedName?.value,
    selectedLabel: selectedName?.label,
  })

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
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
      const response = await getVehicleBillImageApi(selectedRow.billImg)
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

  return (
    <>
      <ToastContainer />

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-wrap align-items-center gap-2">
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
        </div>
      </div>

      <Table
        title="Today's Expenses of Vehicles and Drivers"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        viewButtonLabel="Image"
        viewButton={true}
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

      {/* Modal Component */}
      <BillShow
        showModal={showModal}
        setShowModal={setShowModal}
        pdfBase64={pdfBase64}
        modalTitle={modalTitle}
      />
    </>
  )
}

export default AllExpenses
