import React, { useEffect, useMemo, useRef, useState } from 'react'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import TripFrom from './componets/TripFrom'
import { deleteTripApi, getTripListApi, patchTripApi, postTripApi } from '../data/data'
import { useParams } from 'react-router-dom'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { MdOutlineAnalytics } from 'react-icons/md'
import Swal from 'sweetalert2'
import { toast, ToastContainer } from 'react-toastify'
import TripDetailsCard from './componets/Tripdetailcomponent'
import TripBudgetPieChart from './componets/TripBudgetPieChart'
import TripBudgetBarChart from './componets/TripBudgetBarChart'

const Trip = () => {
  const [allData, setAllData] = useState([]) // Original fetched data
  const [filteredData, setFilteredData] = useState([]) // Filtered/searched data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const { id } = useParams()
  const isFetchedRef = useRef(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState(null)

  const fetchTripData = async () => {
    try {
      setLoading(true)
      const data = await getTripListApi(id)
      setAllData(data)
      setFilteredData(data)
    } catch (err) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isFetchedRef.current) {
      fetchTripData()
      isFetchedRef.current = true
    }
  }, [id])

  const applyFilters = (start, end, query) => {
    let filtered = [...allData]

    if (start && end) {
      filtered = filtered.filter((trip) => {
        const tripDate = new Date(trip.date)
        return tripDate >= new Date(start) && tripDate <= new Date(end)
      })
    }

    if (query) {
      filtered = filtered.filter((trip) =>
        (trip.driverId?.name || '').toLowerCase().includes(query.toLowerCase()),
      )
    }

    setFilteredData(filtered)
  }

  const handleDateRangeChange = (start, end) => {
    console.log('Date range changed:', { start, end })
    setStartDate(start)
    setEndDate(end)
    applyFilters(start, end, searchQuery)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    applyFilters(startDate, endDate, query)
  }

  // Handle add action
  const handleAdd = async (formData) => {
    try {
      const payload = {
        driverId: formData.driverId,
        vehicleId: formData.vehicleId,
        vehicleName: formData.vehicleName,
        startLocation: formData.startLocation,
        endLocation: formData.endLocation,
        budgetAllocated: Number(formData.budgetAllocated),
        date: formData.date,
      }

      await postTripApi(payload)
      await fetchTripData()
      toast.success('Trip Added successfully!')
    } catch (err) {
      console.error('Add Trip Failed:', err.message)
      toast.error('Trip Error on add trip!')
    }
  }

  // Handle edit action
  const handleEdit = async (formData) => {
    try {
      const updatePayload = {
        driverId: formData.driverId,
        vehicleId: formData.vehicleId,
        vehicleName: formData.vehicleName,
        startLocation: formData.startLocation,
        endLocation: formData.endLocation,
        budgetAllocated: Number(formData.budgetAllocated),
        date: formData.date,
        status: formData.status,
      }

      await patchTripApi(formData._id, updatePayload) // Pass ID and payload
      await fetchTripData() // Refresh data
      toast.success('Trip Updated successfully!')
      console.log('Trip updated successfully.')
    } catch (err) {
      toast.success('Trip Error on Update trip!')
      console.error('Trip update failed:', err.message)
    }
  }

  // Handle delete action
  const handleDelete = async (tripId, fieldName = 'Trip') => {
    const result = await Swal.fire({
      title: `Delete ${fieldName}?`,
      text: 'Are you sure you want to delete this trip? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (result.isConfirmed) {
      try {
        await deleteTripApi(tripId)
        await fetchTripData()
        toast.success('Trip Deleted successfully!')
        Swal.fire('Deleted!', `${fieldName} has been deleted.`, 'success')
      } catch (err) {
        toast.error('Trip Error occured!')
        console.error('Delete failed:', err.message)
        Swal.fire('Error!', 'Failed to delete the trip.', 'error')
      }
    }
  }

  // Handle view action
  const handleViewButton = (id) => {
    const trip = allData.find((item) => item._id === id)
    if (trip) {
      setSelectedTrip(trip)
      setShowViewModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowViewModal(false)
    setSelectedTrip(null)
  }

  // show status condition color

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'in-progress':
        return 'badge bg-warning text-dark' // Yellow warning
      case 'cancelled':
        return 'badge bg-danger' // Red danger
      case 'completed':
        return 'badge bg-success' // Green success
      default:
        return 'badge bg-secondary' // Default gray
    }
  }

  //  Coloumns for the table
  const columns = [
    { label: 'Trip Start Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Start Location', key: 'startLocation', sortable: true },
    { label: 'End Location', key: 'endLocation', sortable: true },
    { label: 'Trip Update Date', key: 'updateDate', sortable: true },
    { label: 'Budget Allocated', key: 'budgetAllocated', sortable: true },
    { label: 'Spent Amounts', key: 'spentAmount', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
    { label: 'Actions', key: 'actions', sortable: false },
  ]

  const currentPageData = useMemo(() => {
    return filteredData
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((data) => ({
        date: new Date(data.date).toLocaleDateString('en-GB'),
        driverName: data.driverId?.name || 'N/A',
        vehicleName:
          typeof data.vehicleName === 'string' ? data.vehicleName : data.vehicleId?.name || 'N/A',
        startLocation: data.startLocation || 'N/A',
        endLocation: data.endLocation || 'N/A',
        updateDate: new Date(data.updatedAt).toLocaleDateString('en-GB'),
        budgetAllocated: data.budgetAllocated ?? 0,
        spentAmount: data.spentAmount ?? 0,
        status: <span className={getStatusBadge(data.status)}>{data.status || 'N/A'}</span>,
        actions: (
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-sm btn-outline-success"
              onClick={() => handleViewButton(data._id)}
            >
              <MdOutlineAnalytics />
            </button>

            <TripFrom
              mode="edit"
              onSubmit={handleEdit}
              initialData={{
                _id: data._id, // Make sure to pass _id for patching
                driverId: data.driverId?._id || data.driverId,
                vehicleId: data.vehicleId?._id || data.vehicleId,
                vehicleName: data.vehicleName || data.vehicleId?.name,
                startLocation: data.startLocation,
                endLocation: data.endLocation,
                date: data.date,
                budgetAllocated: data.budgetAllocated,
              }}
            />
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleDelete(data._id, 'Trip')}
            >
              <FaTrash />
            </button>
          </div>
        ),
      }))
  }, [filteredData, currentPage, itemsPerPage])

  // Search and filter logic
  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(allData)
    } else {
      const filtered = allData.filter((item) =>
        (item.driverId?.name || '').toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredData(filtered)
    }
  }, [searchQuery, allData])

  return (
    <div>
      <ToastContainer />

      <div className="mb-3 row align-items-center">
        {/* Left Side: Date Range */}
        <div className="col-md-6 col-12 mb-2 mb-md-0">
          <DateRangeFilterCredence onDateRangeChange={handleDateRangeChange} title="Date Range" />
        </div>

        {/* Right Side: Search and Add Button */}
        <div className="col-md-6 col-12 d-flex justify-content-md-end justify-content-start gap-2">
          <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
          <TripFrom mode="add" onSubmit={handleAdd} />
        </div>
      </div>

      <div>
        <Table
          title="Trips Assigned"
          columns={columns}
          filteredData={currentPageData}
          setFilteredData={setFilteredData}
          viewButton={false}
          handleViewButton={handleViewButton}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          mode="edit"
          onSubmit={handleEdit}
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
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value)
            setCurrentPage(1)
          }}
        />
      </div>

      {/* modal */}
      {showViewModal && selectedTrip && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          onClick={() => setShowViewModal(false)}
        >
          <div className="modal-dialog modal-xl" role="document" style={{ marginTop: '4rem' }}>
            <div className="modal-content rounded-3 shadow-lg border-0">
              <div className="modal-header rounded-top">
                <h5 className="modal-title fw-semibold">
                  Trip Analytics - {selectedTrip?.driverId?.name}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close ms-auto"
                  aria-label="Close"
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>

              <div className="container-fluid px-4 py-3 bg-light">
                {/* Row 1: Trip Details & Pie Chart */}
                <div className="row mb-4 g-4">
                  <div className="col-md-6">
                    <div className="card bg-white text-dark shadow-sm border-light rounded-3 h-100">
                      <div className="card-body">
                        <h5 className="card-title text-primary fw-semibold">Trip Details</h5>
                        <TripDetailsCard trip={selectedTrip} />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card bg-white text-dark shadow-sm border-light rounded-3 h-100 d-flex flex-column justify-content-center">
                      <div className="card-body">
                        <h5 className="card-title text-primary fw-semibold">Budget Overview</h5>
                        <TripBudgetPieChart
                          budget={selectedTrip.budgetAllocated}
                          spent={selectedTrip.spentAmount}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Bar Chart */}
                <div className="row">
                  <div className="col-12">
                    <div className="card bg-white text-dark shadow-sm border-light rounded-3">
                      <div className="card-body">
                        <h5 className="card-title text-primary fw-semibold">Budget Analysis</h5>
                        <TripBudgetBarChart
                          budget={selectedTrip.budgetAllocated}
                          spent={selectedTrip.spentAmount}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-white border-top-0">
                <button
                  type="button"
                  className="btn btn-outline-primary px-4"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Trip

{
  /* <span className="mx-2" />
        <TripFrom mode="edit" onSubmit={handleEdit} /> */
}
