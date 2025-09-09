// Lr.js
import React, { useContext, useEffect, useMemo, useState } from 'react'
import SmartPagination from '../../components/SmartPagination'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import SearchInput from '../../components/SearchInput'
import { useQuery } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import Table from '../../components/Table'
import { Button, Modal } from 'react-bootstrap'
import InvoiceBill from './componets/InvoiceBill'
import LorryReceiptForm from './componets/LorryReceiptForm'
import { handleDelete, handleFormSubmit } from './componets/lorryReceiptHandlers'
import { getLorryReciptApi } from '../data/data'
import { jwtDecode } from 'jwt-decode'
import { TokenContext } from '../../../context/TokenContext'
import { fetchSupervisor } from '../../DriverExpert/data/drivers'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import { getWorkerApi } from '../../TransportPass/data/data'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import IconDropdown from '../../Supervisor/IconDropdown'

const Lr = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [show, setShow] = useState(false)
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(null)
  const [selectedData, setSelectedData] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formMode, setFormMode] = useState('add')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // for worker select
  const [selectedWorker, setSelectedWorker] = useState(null)

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // Fetch Data
  const {
    data: lorryReciptList = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['lorryReciptList'], // The query key to identify the query
    queryFn: getLorryReciptApi, // The function that fetches the data
    staleTime: 1000 * 60 * 30, // Cache time in milliseconds
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
        .filter((w) => w.supervisorId === selectedName.value) // adjust key according to your API response
        .map((w) => ({ value: w.id, label: w.name }))
    : workerList.map((w) => ({ value: w.id, label: w.name }))

  // Use effect to filter data
  useEffect(() => {
    let filtered = lorryReciptList

    // superadmin → filter by supervisorId
    if (userRole === 'superadmin' && selectedName?.value) {
      filtered = filtered.filter((recipt) => recipt.supervisorId === selectedName.value)
    }

    // filter by workerId
    if (selectedWorker?.value) {
      filtered = filtered.filter((recipt) => recipt.workerId === selectedWorker.value)
    }

    // date range filter
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.originalDate)
        return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
      })
    }

    // search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    setFilteredData(filtered)
  }, [searchQuery, lorryReciptList, dateRange, selectedName, selectedWorker, userRole])

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Table column definitions
  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Supervisor', key: 'supervisorName', sortable: true },
    { label: 'Employee', key: 'workerName', sortable: true },
    { label: 'Company Name', key: 'companyName', sortable: true },
    { label: 'Company Address', key: 'companyAddress', sortable: true },
    { label: 'Company Email ', key: 'companyEmail', sortable: true },
    { label: 'GSTIN', key: 'gstIn', sortable: true },
    { label: 'Office Number', key: 'companyOfficeNumber', sortable: true },
    { label: 'Mobile Number', key: 'companyMobileNumber', sortable: true },
    { label: 'Lorry Receipt No.', key: 'lorryNumber', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Owner Name', key: 'ownerName', sortable: true },
    { label: 'Consignor Name', key: 'consignorName', sortable: true },
    { label: 'Consignor Address', key: 'consignorAddress', sortable: true },
    { label: 'Consignee Name', key: 'consigneeName', sortable: true },
    { label: 'Consignee Address', key: 'consigneeAddress', sortable: true },
    { label: 'Customer Name', key: 'customerName', sortable: true },
    { label: 'Customer Address', key: 'customerAddress', sortable: true },
    { label: 'Start Location', key: 'startLocation', sortable: true },
    { label: 'End Location', key: 'endLocation', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    // { label: 'Driver Contact', key: 'driverContact', sortable: true },
    { label: 'Container Number', key: 'containerNumber', sortable: true },
    { label: 'Seal Number', key: 'sealNumber', sortable: true },
    { label: 'Item Name', key: 'itemName', sortable: true },
    { label: 'Item Quantity', key: 'itemQuantity', sortable: true },
    { label: 'Item Unit', key: 'itemUnit', sortable: true },
    { label: 'Item Weight', key: 'itemWeight', sortable: true },
    { label: 'Item Charged', key: 'itemcost', sortable: true },
    { label: 'Customer Rate', key: 'customerRate', sortable: true },
    { label: 'Total Amount', key: 'totalAmount', sortable: true },
    { label: 'Transporter Rate', key: 'transporterRate', sortable: true },
    { label: 'Total Transporter Amount', key: 'totalTransporterAmount', sortable: true },
    { label: 'Transporter Rate On', key: 'transporterRateOn', sortable: true },
    { label: 'Customer Rate On', key: 'customerRateOn', sortable: true },
    { label: 'Customer Freight', key: 'customerFreight', sortable: true },
    { label: 'Transporter Freight', key: 'transporterFreight', sortable: true },
  ]

  // Handle Search
  const handleSearch = (query) => setSearchQuery(query)

  // Handle Date Range Change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }

  // Handle View Button
  const handleViewButton = (id) => {
    const selectedData = filteredData.find((item) => item.id === id)
    if (selectedData) {
      setSelectedInvoiceData(selectedData)
      setShow(true)
    }
  }

  // Handle Add
  const handleAdd = () => {
    setFormMode('add')
    setSelectedData(null)
    setShowForm(true)
  }

  // Handle Delete Button
  const handleDeleteButton = (id) => {
    handleDelete(id, filteredData, setFilteredData, refetch)
  }

  // Handle Edit Button
  const handleEditButton = (id) => {
    const selectedData = filteredData.find((item) => item.id === id)
    if (selectedData) {
      setFormMode('edit')
      setSelectedData(selectedData)
      setShowForm(true)
    }
  }

  // Handle Form Submit
  const handleFormSubmitWrapper = (formData) => {
    handleFormSubmit(formData, formMode, selectedData, setFilteredData, setShowForm, refetch)
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
            title: 'All Transport Pass Report',
            columns,
            data: filteredData,
            fileName: 'Transport_Pass_Report',
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

  console.log('selectedName:', selectedName)
  console.log('Comparing supervisor:', {
    selectedValue: selectedName?.value,
    selectedLabel: selectedName?.label,
  })

  console.log('Supervisors:', supervisorOptions)

  return (
    <>
      <div>
        <ToastContainer />
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div className="d-flex flex-wrap align-items-center gap-2">
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

          <div className="d-flex justify-content-end align-items-center gap-2 w-75 mb-5">
            <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
            <Button variant="primary" onClick={handleAdd}>
              Add Lorry Receipt
            </Button>
          </div>
        </div>

        <Table
          title="All TP Recipt List"
          columns={columns}
          filteredData={filteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          viewButton={true}
          handleViewButton={handleViewButton}
          editButton={true}
          handleEditButton={handleEditButton}
          deleteButton={true}
          handleDeleteButton={handleDeleteButton}
          isFetching={isFetching}
          viewButtonLabel="Recipt"
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

        <LorryReceiptForm
          show={showForm}
          handleClose={() => setShowForm(false)}
          handleSubmit={handleFormSubmitWrapper} // Now calls the wrapper function
          initialData={selectedData}
          mode={formMode}
        />

        <Modal show={show} onHide={() => setShow(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>Invoice Bill</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedInvoiceData ? (
              <InvoiceBill invoiceData={selectedInvoiceData} />
            ) : (
              <p>No invoice data available.</p>
            )}
          </Modal.Body>
        </Modal>
      </div>

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default Lr
