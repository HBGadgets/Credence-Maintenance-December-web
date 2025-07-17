// import React, { useEffect, useState } from 'react'
// import {
//   deleteLorryReciptApi,
//   getLorryReciptApi,
//   patchLorryReciptApi,
//   postLorryReciptApi,
// } from '../data/data'
// import SmartPagination from '../../components/SmartPagination'
// import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
// import SearchInput from '../../components/SearchInput'
// import { useQuery } from '@tanstack/react-query'
// import { ToastContainer } from 'react-toastify'
// import Table from '../../components/Table'
// import { Button, Modal } from 'react-bootstrap'
// import InvoiceBill from './componets/InvoiceBill'
// import LorryReceiptForm from './componets/LorryReceiptForm'
// import Swal from 'sweetalert2'

// const Lr = () => {
//   const [filteredData, setFilteredData] = useState([])
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage, setItemsPerPage] = useState(10)
//   const [searchQuery, setSearchQuery] = useState('')

//   // Modal use state
//   const [show, setShow] = useState(false)
//   const [selectedInvoiceData, setSelectedInvoiceData] = useState(null)
//   const [selectedData, setSelectedData] = useState(null)

//   //  Form Modal use state
//   const [showForm, setShowForm] = useState(false)
//   const [formMode, setFormMode] = useState('add')

//   // Fetch Data
//   const {
//     data: lorryReciptList = [],
//     isFetching,
//     refetch, //Add this line
//   } = useQuery({
//     queryKey: ['lorryReciptList'],
//     queryFn: getLorryReciptApi,
//     staleTime: 1000 * 60 * 30,
//   })

//   // Use effect to filter data

//   useEffect(() => {
//     let filtered = lorryReciptList

//     // Apply search filter
//     if (searchQuery) {
//       const lowercasedQuery = searchQuery.toLowerCase()
//       filtered = filtered.filter((item) =>
//         Object.values(item).some(
//           (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
//         ),
//       )
//     }
//     setFilteredData(filtered)
//   }, [searchQuery, lorryReciptList])

//   console.log('All Lorry Recipt List', lorryReciptList)

//   // Pagination logic
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage)

//   // Table column
//   const columns = [
//     { label: 'Date', key: 'date', sortable: true },
//     { label: 'Company Name', key: 'companyName', sortable: true },
//     { label: 'Company Address', key: 'companyAddress', sortable: true },
//     { label: 'Company Email ', key: 'companyEmail', sortable: true },
//     { label: 'GSTIN', key: 'gstIn', sortable: true },
//     { label: 'Office Number', key: 'companyOfficeNumber', sortable: true },
//     { label: 'Mobile Number', key: 'companyMobileNumber', sortable: true },
//     { label: 'Lorry Receipt No.', key: 'lorryNumber', sortable: true },
//     { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
//     { label: 'Owner Name', key: 'ownerName', sortable: true },
//     { label: 'Consignor Name', key: 'consignorName', sortable: true },
//     { label: 'Consignor Address', key: 'consignorAddress', sortable: true },
//     { label: 'Consignee Name', key: 'consigneeName', sortable: true },
//     { label: 'Consignee Address', key: 'consigneeAddress', sortable: true },
//     { label: 'Customer Name', key: 'customerName', sortable: true },
//     { label: 'Customer Address', key: 'customerAddress', sortable: true },
//     { label: 'Start Location', key: 'startLocation', sortable: true },
//     { label: 'End Location', key: 'endLocation', sortable: true },
//     { label: 'Driver Name', key: 'driverName', sortable: true },
//     { label: 'Driver Contact', key: 'driverContact', sortable: true },
//     { label: 'Container Number', key: 'containerNumber', sortable: true },
//     { label: 'Seal Number', key: 'sealNumber', sortable: true },
//     { label: 'Item Name', key: 'itemName', sortable: true },
//     { label: 'Item Quantity', key: 'itemQuantity', sortable: true },
//     { label: 'Item Unit', key: 'itemUnit', sortable: true },
//     { label: 'Item Weight', key: 'itemWeight', sortable: true },
//     { label: 'Item Charged', key: 'itemcost', sortable: true },
//     { label: 'Customer Rate', key: 'customerRate', sortable: true },
//     { label: 'Total Amount', key: 'totalAmount', sortable: true },
//     { label: 'Transporter Rate', key: 'transporterRate', sortable: true },
//     { label: 'Total Transporter Amount', key: 'totalTransporterAmount', sortable: true },
//     { label: 'Transporter Rate On', key: 'transporterRateOn', sortable: true },
//     { label: 'Customer Rate On', key: 'customerRateOn', sortable: true },
//     { label: 'Customer Freight', key: 'customerFreight', sortable: true },
//     { label: 'Transporter Freight', key: 'transporterFreight', sortable: true },
//   ]

//   // Handle Search
//   const handleSearch = (query) => {
//     setSearchQuery(query)
//   }

//   // Handle View Button
//   const handleViewButton = (id) => {
//     console.log('Viewing ID:', id) // Log the ID for debugging

//     const selectedData = filteredData.find((item) => item.id === id) // Match id correctly
//     if (selectedData) {
//       setSelectedInvoiceData(selectedData)
//       setShow(true) // Show the modal
//     } else {
//       console.log('Data not found for ID:', id)
//     }
//   }

//   // Handle Modal Close
//   const handleClose = () => {
//     setShow(false)
//     setSelectedInvoiceData(null)
//   }

//   // Handle Add
//   const handleAdd = () => {
//     setFormMode('add')
//     setSelectedData(null)
//     setShowForm(true)
//   }

//   // Handle Delete Button
//   const handleDeleteButton = async (id) => {
//     try {
//       // Confirm before deleting
//       const confirmed = await Swal.fire({
//         title: 'Are you sure?',
//         text: 'This action cannot be undone!',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: 'Yes, delete it!',
//       })
//       if (confirmed.isConfirmed) {
//         await deleteLorryReciptApi(id, { status: 'deleted' })
//         Swal.fire('Deleted!', 'The record has been deleted.', 'success')
//         setFilteredData(filteredData.filter((item) => item._id !== id))
//         await refetch()
//       }
//     } catch (error) {
//       Swal.fire('Error!', 'Failed to delete Lorry Receipt.', 'error')
//     }
//   }

//   // Handle Edit Button
//   // const handleEditButton = (item) => {
//   //   console.log('Edit clicked for item:', item)

//   //   setFormMode('edit')
//   //   setSelectedData(item) // make sure this is the full item
//   //   setShowForm(true)
//   // }

//   const handleEditButton = (id) => {
//     console.log('Editing Item:', id)
//     const selectedData = filteredData.find((item) => item.id === id) // Match id correctly

//     if (!selectedData) {
//       console.error('Could not find matching item in filteredData')
//       return
//     }

//     setFormMode('edit')
//     setSelectedData(selectedData) // This is passed as initialData to the form
//     setShowForm(true)
//   }

//   // Handle Form Submit
//   const handleFormSubmit = async (formData) => {
//     try {
//       if (formMode === 'edit') {
//         const result = await patchLorryReciptApi(selectedData.id, formData)
//         Swal.fire('Success!', 'Lorry Receipt updated successfully.', 'success')
//         setFilteredData((prevData) =>
//           prevData.map((data) => (data._id === selectedData.id ? { ...data, ...formData } : data)),
//         )
//       } else {
//         const result = await postLorryReciptApi(formData)
//         Swal.fire('Success!', 'Lorry Receipt added successfully.', 'success')
//         setFilteredData((prevData) => [
//           ...prevData,
//           { ...formData, _id: result.id, date: formData.date },
//         ])
//       }
//     } catch (error) {
//       Swal.fire('Error!', 'Failed to submit Lorry Receipt.', 'error')
//     } finally {
//       setShowForm(false)
//     }
//   }

//   return (
//     <>
//       <div>
//         <ToastContainer />

//         {/* Filters and Actions Row */}
//         <div className="mb-3 d-flex justify-content-between align-items-center">
//           {/* Left: Date Range Filter */}
//           <div className="d-flex align-items-center">
//             <DateRangeFilterCredence title="Date Range" />
//           </div>

//           {/* Right: Search and Add Button */}
//           <div className="d-flex justify-content-end align-items-center gap-2 w-75">
//             <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
//             <Button variant="primary" onClick={handleAdd}>
//               Add Lorry Receipt
//             </Button>
//           </div>
//         </div>

//         <Table
//           title="All Lorry Recipt List"
//           columns={columns}
//           filteredData={filteredData}
//           setFilteredData={setFilteredData}
//           currentPage={currentPage}
//           itemsPerPage={itemsPerPage}
//           viewButton={true}
//           handleViewButton={handleViewButton}
//           editButton={true}
//           handleEditButton={handleEditButton}
//           deleteButton={true}
//           handleDeleteButton={handleDeleteButton}
//           isFetching={isFetching}
//         />

//         <SmartPagination
//           totalPages={totalPages}
//           currentPage={currentPage}
//           onPageChange={setCurrentPage}
//           onItemsPerPageChange={(value) => {
//             setItemsPerPage(value === -1 ? filteredData.length : value)
//             setCurrentPage(1)
//           }}
//         />

//         {/* Lorry Receipt Form Modal */}
//         <LorryReceiptForm
//           show={showForm}
//           handleClose={() => setShowForm(false)}
//           handleSubmit={handleFormSubmit}
//           initialData={selectedData} // Add this
//           mode={formMode} // Correct prop name
//         />

//         {/* Modal code  */}
//         <Modal show={show} onHide={handleClose} size="xl">
//           <Modal.Header closeButton>
//             <Modal.Title>Invoice Bill</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {selectedInvoiceData ? (
//               <InvoiceBill invoiceData={selectedInvoiceData} />
//             ) : (
//               <p>No invoice data available.</p>
//             )}
//           </Modal.Body>
//         </Modal>
//       </div>
//     </>
//   )
// }

// export default Lr

// Lr.js
import React, { useContext, useEffect, useState } from 'react'
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

const Lr = () => {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [show, setShow] = useState(false)
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(null)
  const [selectedData, setSelectedData] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formMode, setFormMode] = useState('add')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

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

  // Use effect to filter data
  useEffect(() => {
    let filtered = lorryReciptList

    // Filter by supervisor if selected
    if (selectedName?.value) {
      filtered = filtered.filter((recipt) => recipt.supervisor === selectedName.value)
    }

    // Filter by date range if available
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.originalDate)
        return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
      })
    }

    // Apply Search Query Filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }
    setFilteredData(filtered)
  }, [searchQuery, lorryReciptList, dateRange, selectedName])

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Table column definitions
  const columns = [
    { label: 'Date', key: 'date', sortable: true },
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
    { label: 'Driver Contact', key: 'driverContact', sortable: true },
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
            <Button variant="primary" onClick={handleAdd}>
              Add Lorry Receipt
            </Button>
          </div>
        </div>

        <Table
          title="All Lorry Recipt List"
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
    </>
  )
}

export default Lr
