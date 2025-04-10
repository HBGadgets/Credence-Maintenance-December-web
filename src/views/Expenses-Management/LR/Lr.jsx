import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import LorryReceiptForm from './componets/LorryReceiptForm'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { ToastContainer } from 'react-toastify'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { getLorryReciptApi } from '../data/data'
import Swal from 'sweetalert2'
import SearchInput from '../../components/SearchInput'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'

const Lr = () => {
  const [showForm, setShowForm] = useState(false)
  const [formMode, setFormMode] = useState('add')
  const [selectedData, setSelectedData] = useState(null)
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const isFetchedRef = useRef(false)
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

      const formattedData = responseData.map((data) => ({
        _id: data.id,
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        gstin: data.gstin,
        officeNumber: data.officeNumber,
        mobileNumber: data.mobileNumber,
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
        from: data.startLocation,
        to: data.endLocation,
        driverName: data.driverName,
        driverContact: data.driverContact,
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
              onClick={() => handleDelete(data.id, 'Lorry Receipt')}
            >
              <FaTrash />
            </button>
          </div>
        ),
      }))

      setFilteredData(formattedData)
    } catch (error) {
      console.error('Failed to fetch lorry receipts:', error)
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

  // Handle Submit
  const handleFormSubmit = (formData) => {
    if (formMode === 'edit') {
      console.log('Updating...', formData)
    } else {
      console.log('Creating...', formData)
    }
    setShowForm(false)
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
        await deleteLorryReceiptApi(id) // Your API call to delete
        Swal.fire('Deleted!', 'Lorry Receipt has been deleted.', 'success')
        // Re-fetch or filter out deleted data from state
        setFilteredData((prev) => prev.filter((data) => data._id !== id))
      } catch (error) {
        console.error('Failed to delete:', error)
        Swal.fire('Error!', 'Failed to delete the Lorry Receipt.', 'error')
      }
    }
  }

  // Handle View
  const handleViewButton = (id) => {
    console.log('id for trip', id)
  }

  // Handle Date Range
  const handleDateRangeChange = () => {
    console.log('Date range changed:')
  }

  // Table column
  const columns = [
    { label: 'Company Name', key: 'companyName', sortable: true },
    { label: 'Company Address', key: 'companyAddress', sortable: true },
    { label: 'GSTIN', key: 'gstin', sortable: true },
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

  return (
    <div>
      <ToastContainer />

      {/* Filters and Actions Row */}
      <div className="mb-3 row align-items-center">
        {/* Left: Date Range Picker */}
        <div className="col-md-6 col-12 mb-2 mb-md-2">
          <DateRangeFilterCredence onDateRangeChange={handleDateRangeChange} title="Date Range" />
        </div>

        {/* Right: Search and Add Button */}
        <div className="col-md-6 col-12 d-flex justify-content-md-end justify-content-start gap-2">
          <div className="d-flex justify-content-end align-items-start gap-3 mb-1">
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
        <div>
          <Table
            title="Lorry Recipts"
            columns={columns}
            filteredData={filteredData}
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
        </div>
      </div>
    </div>
  )
}

export default Lr
