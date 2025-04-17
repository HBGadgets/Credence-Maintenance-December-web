import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import LorryReceiptForm from './componets/LorryReceiptForm'
import { FaEdit, FaFileInvoice, FaTrash } from 'react-icons/fa'
import { ToastContainer } from 'react-toastify'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import {
  deleteLorryReciptApi,
  getLorryReciptApi,
  patchLorryReciptApi,
  postLorryReciptApi,
} from '../data/data'
import Swal from 'sweetalert2'
import SearchInput from '../../components/SearchInput'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import InvoiceBill from './componets/InvoiceBill'
import Page404 from '../../pages/page404/Page404'

const Lr = () => {
  const [showForm, setShowForm] = useState(false)
  const [formMode, setFormMode] = useState('add')
  const [selectedData, setSelectedData] = useState(null)
  const [filteredData, setFilteredData] = useState([])
  const [rawData, setRawData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const isFetchedRef = useRef(false)
  const [show, setShow] = useState(false)
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(null)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Format Date (DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
  }

  // Fetch function declared outside useEffect
  const fetchData = async () => {
    try {
      setLoading(true)
      const responseData = await getLorryReciptApi()
      setRawData(responseData)
      setFilteredData(responseData)
    } catch (err) {
      // If the error is a network error
      if (!err.response) {
        setError('Network Error') // Internet/server unreachable
      } else if (err.response.status === 500) {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // Single useEffect with fetch protection
  useEffect(() => {
    if (!isFetchedRef.current) {
      fetchData()
      isFetchedRef.current = true
    }
  }, [])

  // search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(rawData)
    } else {
      const lowercasedQuery = searchQuery.toLowerCase()
      const filtered = rawData.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(lowercasedQuery),
        ),
      )
      setFilteredData(filtered)
    }
  }, [searchQuery, rawData])

  // Handle Add
  const handleAdd = () => {
    setFormMode('add')
    setSelectedData(null)
    setShowForm(true)
  }

  // Handle Edit
  const handleEdit = (data) => {
    setFormMode('edit')
    setSelectedData(data)
    setShowForm(true)
  }

  // Handle View
  const handleViewButton = (id) => {
    console.log('Clicked ID:', id)
    console.log('Raw Data:', rawData)
    const invoiceData = rawData.find((data) => data._id === id)
    if (!invoiceData) {
      console.warn('Invoice data not found for ID:', id)
    }
    setSelectedInvoiceData(invoiceData)
    setShow(true)
  }

  const handleClose = () => {
    setShow(false)
    setSelectedInvoiceData(null)
  }

  const handleFormSubmit = async (formData) => {
    try {
      if (formMode === 'edit') {
        console.log('Updating...', formData)
        const result = await patchLorryReciptApi(selectedData._id, formData)
        Swal.fire('Success!', 'Lorry Receipt updated successfully.', 'success')
        fetchData() // Refresh the list with updated data
        // Update the edited record in filteredData
        setFilteredData((prevData) =>
          prevData.map((data) =>
            data._id === selectedData._id
              ? {
                  ...data,
                  ...formData,
                  date: formatDate(formData.date),
                  actions: (
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-success"
                        title="Invoice bill"
                        onClick={() => handleViewButton(data._id)}
                      >
                        <FaFileInvoice />
                      </button>
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => handleEdit(data)}
                        className="btn btn-sm btn-outline-primary"
                        style={{ padding: '4px 8px' }}
                      >
                        <FaEdit />
                      </Button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Delete Lorry Receipt"
                        onClick={() => handleDelete(data._id, 'Lorry Receipt')}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ),
                }
              : data,
          ),
        )
      } else {
        // ADD flow (already working)
        const result = await postLorryReciptApi(formData)
        Swal.fire('Success!', 'Lorry Receipt added successfully.', 'success')
        fetchData() // Refresh the list with updated data
        setFilteredData((prev) => [
          ...prev,
          {
            ...formData,
            _id: result.id,
            date: formatDate(formData.date),
          },
        ])
      }
    } catch (error) {
      console.error('Failed to submit Lorry Receipt:', error)
      Swal.fire('Error!', 'Failed to submit Lorry Receipt.', 'error')
    } finally {
      setShowForm(false)
    }
  }

  // Handel delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the Lorry Receipt.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    })

    if (confirm.isConfirmed) {
      try {
        await deleteLorryReciptApi(id) // Your API call to delete
        Swal.fire('Deleted!', 'Lorry Receipt has been deleted.', 'success')
        // Re-fetch or filter out deleted data from state
        setFilteredData((prev) => prev.filter((data) => data._id !== id))
        fetchData()
      } catch (error) {
        console.error('Failed to delete:', error)
        Swal.fire('Error!', 'Failed to delete the Lorry Receipt.', 'error')
      }
    }
  }

  // Handle Date Range
  const handleDateRangeChange = (startDate, endDate) => {
    const filtered = rawData.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= startDate && itemDate <= endDate
    })
    setFilteredData(filtered)
  }

  // const handleDateRangeChange = (startDate, endDate) => {
  //   const filtered = rawData.filter((item) => {
  //     if (!item.date) return false
  //     const itemDate = new Date(item.date)
  //     return itemDate >= startDate && itemDate <= endDate
  //   })
  //   setFilteredData(filtered)
  // }

  // Table column
  const columns = [
    { label: 'Company Name', key: 'companyName', sortable: true },
    { label: 'Company Address', key: 'companyAddress', sortable: true },
    { label: 'Company Email ', key: 'companyEmail', sortable: true },
    { label: 'GSTIN', key: 'gstIn', sortable: true },
    { label: 'Office Number', key: 'officeNumber', sortable: true },
    { label: 'Mobile Number', key: 'mobileNumber', sortable: true },
    { label: 'Lorry Receipt No.', key: 'lorryNumber', sortable: true },
    { label: 'Date', key: 'date', sortable: true },
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
    { label: 'Actions', key: 'actions', sortable: false },
  ]

  // fetch in table data
  const formattedData = useMemo(() => {
    return filteredData
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((data) => ({
        _id: data._id,
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        companyEmail: data.companyEmail,
        gstIn: data.gstIn,
        companyOfficeNumber: data.companyOfficeNumber,
        companyMobileNumber: data.companyMobileNumber,
        lorryNumber: data.lorryNumber,
        date: formatDate(data.date),
        vehicleName: data.vehicleName,
        ownerName: data.ownerName,
        consignorName: data.consignorName,
        consignorAddress: data.consignorAddress,
        consigneeName: data.consigneeName,
        consigneeAddress: data.consigneeAddress,
        customerName: data.customerName,
        customerAddress: data.customerAddress,
        startLocation: data.from || data.startLocation,
        endLocation: data.to || data.endLocation,
        driverName: data.driverId?.name || 'N/A',
        driverContact: data.driverId?.contactNumber || 'N/A',
        containerNumber: data.containerNumber,
        sealNumber: data.sealNumber,
        itemName: data.itemName,
        itemQuantity: data.itemQuantity,
        itemUnit: data.itemUnit,
        itemWeight: data.itemWeight,
        itemcost: data.itemcost,
        customerRate: data.customerRate,
        totalAmount: data.totalAmount,
        transporterRate: data.transporterRate,
        totalTransporterAmount: data.totalTransporterAmount,
        transporterRateOn: data.transporterRateOn,
        customerRateOn: data.customerRateOn,
        customerFreight: data.customerFreight,
        transporterFreight: data.transporterFreight,
        actions: (
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-sm btn-outline-success"
              title="Invoice bill"
              onClick={() => handleViewButton(data._id)}
            >
              <FaFileInvoice />
            </button>

            <Button
              variant="light"
              size="sm"
              onClick={() => handleEdit(data)}
              className="btn btn-sm btn-outline-primary"
              style={{ padding: '4px 8px' }}
            >
              <FaEdit />
            </Button>

            <button
              className="btn btn-sm btn-outline-danger"
              title="Delete Lorry Receipt"
              onClick={() => handleDelete(data._id, 'Lorry Receipt')}
            >
              <FaTrash />
            </button>
          </div>
        ),
      }))
  }, [filteredData, currentPage, itemsPerPage])

  if (error) return <Page404 />

  return (
    <>
      <div>
        <ToastContainer />

        {/* Filters and Actions Row */}
        <div className="mb-3 d-flex justify-content-between align-items-center">
          {/* Left: Date Range Filter */}
          <div className="d-flex align-items-center">
            <DateRangeFilterCredence onDateRangeChange={handleDateRangeChange} title="Date Range" />
          </div>

          {/* Right: Search and Add Button */}
          <div className="d-flex justify-content-end align-items-center gap-2 w-75">
            <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <Button variant="primary" onClick={handleAdd}>
              Add Lorry Receipt
            </Button>
          </div>
        </div>

        {/* Lorry Receipt Form Modal */}
        <LorryReceiptForm
          show={showForm}
          handleClose={() => setShowForm(false)}
          handleSubmit={handleFormSubmit}
          initialData={selectedData}
          mode={formMode}
        />

        {/* Table and Pagination */}
        <Table
          title="Lorry Receipts"
          columns={columns}
          filteredData={formattedData}
          setFilteredData={setFilteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          viewButton={false}
          handleViewButton={handleViewButton}
          isFetching={loading}
          errorMessage={
            error
              ? 'Error fetching trips. Please try again later.'
              : filteredData.length === 0 && !loading
                ? 'No trip records found for the selected filters.'
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

        {/* Invoice Modal */}
        <Modal show={show} onHide={handleClose} size="xl">
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
