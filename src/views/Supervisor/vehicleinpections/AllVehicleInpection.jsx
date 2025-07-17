// InpectionList.jsx
import React, { useContext, useEffect, useState } from 'react'
import AddButton from '../../components/AddButton'
import InspectionForm from './components/InpectFrom'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteAllVehicleInpectionApi,
  getAllVehicleInpectionApi,
  patchAllVehicleInpectionApi,
  postAllVehicleInpectionApi,
} from '../data/data'
import { fetchVehicles } from '../../vehicle/data/VehicleListData'
import { toast, ToastContainer } from 'react-toastify'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import SearchInput from '../../components/SearchInput'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import { TokenContext } from '../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import { fetchSupervisor } from '../../DriverExpert/data/drivers'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'

const AllVehicleInpection = () => {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state

  // Edit modal
  const [editingInspection, setEditingInspection] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

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
        status === 'in-progress'
          ? '#f5a623'
          : status === 'completed'
            ? '#28a745'
            : status === 'cancelled'
              ? '#dc3545'
              : '#6c757d',
      color: 'white',
    }
  }

  // Fetch Data
  const { data: allvehicleinpection, isFetching } = useQuery({
    queryKey: ['allvehicleinpection'],
    queryFn: () => getAllVehicleInpectionApi(null, token),
    staleTime: 1000 * 60 * 30,
    enabled: !!token, //  only run if token is available
    onError: (err) => {
      console.error('Error fetching logbook data:', err)
    },
  })
  console.log(allvehicleinpection)

  // Vehicle api fetch
  const { data: vehicles = [], isload } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  // post
  const mutation = useMutation({
    mutationFn: ({ vehicleId, payload }) => postAllVehicleInpectionApi(vehicleId, payload),
    onSuccess: () => {
      toast.success('Inspection added successfully')
      setShowModal(false)
      queryClient.invalidateQueries(['allvehicleinpection']) // Refresh the list
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add inspection')
    },
  })

  // PATCH Mutation - Update Inspection
  const patchMutation = useMutation({
    mutationFn: ({ id, payload }) => patchAllVehicleInpectionApi(id, payload),
    onSuccess: () => {
      toast.success('Inspection updated successfully')
      queryClient.invalidateQueries(['allvehicleinpection'])
      setShowModal(false)
      setIsEditMode(false)
      setEditingInspection(null)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update inspection')
    },
  })

  // DELETE Mutation - Delete Inspection
  const deleteMutation = useMutation({
    mutationFn: deleteAllVehicleInpectionApi,
    onSuccess: () => {
      toast.success('Inspection deleted successfully')
      queryClient.invalidateQueries(['allvehicleinpection'])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete inspection')
    },
  })

  // use effect
  useEffect(() => {
    if (isEditMode && editingInspection && vehicles.length > 0) {
      const transformedItems = initialItems.map((item) => {
        // Vehicle dropdown
        if (item.name === 'vehicleName') {
          return {
            ...item,
            value: editingInspection.vehicleId || '',
          }
        }

        // All inspection items from 'items'
        if (item.section && item.name && editingInspection.items?.[item.name]) {
          const data = editingInspection.items[item.name]

          return {
            ...item,
            status: data.status?.toLowerCase() === 'pass' ? 'pass' : 'fail',
            failureDescription: data.description || '',
            failureImage: data.image || data.Image || null,
            existingImage: data.image || data.Image || null, // Store existing image separately
          }
        }

        return item
      })

      setInspectionItems(transformedItems)
    }
  }, [editingInspection, isEditMode, vehicles])

  // to check edit data
  useEffect(() => {
    if (isEditMode && editingInspection) {
      console.log('editingInspection', editingInspection)
    }
  }, [editingInspection])

  // Keep your existing filteredData useEffect
  useEffect(() => {
    if (!Array.isArray(allvehicleinpection)) return

    let filtered = [...allvehicleinpection]

    // Filter by supervisor
    if (selectedName?.value) {
      filtered = filtered.filter((trip) => trip.supervisor === selectedName.value)
    }

    // Filter by date range
    const { startDate, endDate } = dateRange || {}
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.orignalDate)
        return itemDate >= start && itemDate <= end
      })
    }

    // Filter by search query
    if (searchQuery?.trim()) {
      const lowercasedQuery = searchQuery.toLowerCase()

      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    setFilteredData(filtered)
  }, [allvehicleinpection, selectedName, dateRange, searchQuery])

  // From field opening modal
  const initialItems = [
    {
      name: 'vehicleName',
      label: 'Vehicle Name',
      type: 'select',
      section: null,
      Placeholder: 'Select Vehicle',
      options: vehicles.map((vehicle) => ({
        value: vehicle.id,
        label: vehicle.name,
      })),
    },

    // Engine Section

    {
      id: 1,
      section: 'Engine',
      name: 'engineOil',
      item: 'Engine Oil',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },
    {
      id: 2,
      section: 'Engine',
      name: 'sparkPlug',
      item: 'Spark Plug',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },

    // Fluids Section
    {
      id: 3,
      section: 'Fluids',
      name: 'acCollent',
      item: 'AC Coolant',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },
    {
      id: 4,
      section: 'Fluids',
      name: 'breakFluid',
      item: 'Brake Fluid',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },
    {
      id: 5,
      section: 'Fluids',
      name: 'transmissionFluid',
      item: 'Transmission Fluid',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },
    {
      id: 6,
      section: 'Fluids',
      name: 'powerStairingFluid',
      item: 'Power Steering Fluid',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },
    {
      id: 7,
      section: 'Fluids',
      name: 'windShieldWasherFluid',
      item: 'Windshield Washer Fluid',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },

    // Tyres Section
    {
      id: 8,
      section: 'Tyres',
      name: 'tyrePressure',
      item: 'Tyre Pressure',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },
    {
      id: 9,
      section: 'Tyres',
      name: 'tyreAlignment',
      item: 'Tyre Alignment',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },

    // Electrical Section
    {
      id: 10,
      section: 'Electrical',
      name: 'batteryCharge',
      item: 'Battery Charge',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },
    {
      id: 11,
      section: 'Electrical',
      name: 'wiperBlades',
      item: 'Wiper Blades',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },
    {
      id: 12,
      section: 'Electrical',
      name: 'warningLights',
      item: 'Warning Lights',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },
    {
      id: 13,
      section: 'Electrical',
      name: 'headLights',
      item: 'Head Lights',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },
    {
      id: 14,
      section: 'Electrical',
      name: 'indicator',
      item: 'Indicators',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },

    // Suspension Section
    {
      id: 15,
      section: 'Suspension',
      name: 'suspensionAndStairing',
      item: 'Suspension & Steering',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },

    // Underbody Section
    {
      id: 16,
      section: 'Underbody',
      name: 'underbody',
      item: 'Underbody',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },

    // Exhaust Section
    {
      id: 17,
      section: 'Exhaust',
      name: 'exaustSystem',
      item: 'Exhaust System',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },
    {
      id: 18,
      section: 'Exhaust',
      name: 'airFilter',
      item: 'Air Filter System',
      status: 'pending',
      failureDescription: '',
      failureImage: null,
    },
  ]

  // table data columns
  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Trips Start', key: 'startLocation', sortable: true },
    { label: 'Trips End', key: 'endLocation', sortable: true },
    {
      label: 'Trip Status',
      key: 'status',
      render: (row) => <span style={getStatusStyle(row.status)}>{row.status}</span>,
      sortable: true,
    },
    { label: 'Inpections Pass', key: 'inpectionPass', sortable: true },
    { label: 'Inpections Fail', key: 'inpectionFail', sortable: true },
  ]

  const [inspectionItems, setInspectionItems] = useState([])

  // Handle Search
  const handleSearch = (query) => setSearchQuery(query)

  // Handle Date Range Change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }

  const handleOpenModal = () => {
    setInspectionItems(initialItems)
    setIsEditMode(false)
    setEditingInspection(null)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setIsEditMode(false)
    setEditingInspection(null)
  }

  const [selectedVehicle, setSelectedVehicle] = useState(null)

  const handleVehicleSelect = (vehicleName) => {
    setSelectedVehicle(vehicleName)

    // Optionally filter table by vehicle name
    const filtered = allvehicleinpection?.filter((v) => v.vehicleName === vehicleName)
    setFilteredData(vehicleName ? filtered : allvehicleinpection)
  }

  const handleStatusChange = (id, data) => {
    if (id === '__vehicle_select__') {
      setInspectionItems(data)
    } else {
      setInspectionItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: data } : item)),
      )
    }
  }

  const handleDescriptionChange = (id, description) => {
    setInspectionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, failureDescription: description } : item)),
    )
  }

  const handleImageUpload = (id, file) => {
    setInspectionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, failureImage: file } : item)),
    )
  }

  // handle submit all
  const handleSubmitAll = () => {
    const vehicleField = inspectionItems.find((item) => item.name === 'vehicleName')
    const vehicleId = vehicleField?.value

    if (!vehicleId) {
      toast.error('Please select a vehicle')
      return
    }

    const formData = new FormData()

    inspectionItems
      .filter((item) => item.section)
      .forEach((item) => {
        const key = item.name
        const status = item.status === 'pass' || item.status === true
        const description = item.failureDescription || item.description || ''

        // Only include changed items
        if (isEditMode) {
          const originalItem = editingInspection.items[key]
          const isChanged =
            (originalItem.status?.toLowerCase() === 'pass') !== status ||
            (originalItem.description || '') !== description ||
            (item.failureImage && item.failureImage !== item.existingImage)

          if (!isChanged) return
        }

        formData.append(key, JSON.stringify({ status, description }))

        // Only append new images
        if (item.failureImage instanceof File) {
          formData.append(`${key}Img`, item.failureImage)
        }
        // Handle image removal
        else if (item.failureImage === null && item.existingImage) {
          formData.append(`${key}ImgRemove`, 'true')
        }
      })

    Swal.fire({
      title: isEditMode ? 'Update Inspection?' : 'Submit Inspection?',
      text: isEditMode
        ? 'Are you sure you want to update this inspection record?'
        : 'Are you sure you want to submit this new inspection?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: isEditMode ? 'Yes, update it!' : 'Yes, submit it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        if (isEditMode && editingInspection?.id) {
          console.log('Editing Inspection ID:', editingInspection.id)
          patchMutation.mutate({ id: editingInspection.id, payload: formData })
        } else {
          mutation.mutate({ vehicleId, payload: formData })
        }
      }
    })
  }

  // handle view button
  const handleViewButton = (id) => {
    console.log('idzzz ', id)
    navigate(`/AnalayisInpection/${id}`)
  }

  // handle edit button
  const handleEditButton = (id) => {
    const inspectionToEdit = allvehicleinpection.find((item) => item.id === id)
    if (inspectionToEdit) {
      setEditingInspection(inspectionToEdit)
      setIsEditMode(true)
      setShowModal(true)
    }
  }

  // handle delete button
  const handleDeleteButton = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this inspection!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id)
      }
    })
  }

  return (
    <>
      <ToastContainer />

      <div>
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
            {/* Add Button */}
            <AddButton label="Add Inspection" onClick={handleOpenModal} />
          </div>
        </div>
      </div>

      <InspectionForm
        show={showModal}
        onClose={handleCloseModal}
        inspectionItems={inspectionItems}
        onStatusChange={handleStatusChange}
        onDescriptionChange={handleDescriptionChange}
        onImageUpload={handleImageUpload}
        onSubmit={handleSubmitAll}
        isEditMode={isEditMode}
        inspectionData={editingInspection}
      />

      <Table
        title="All Vehicle Inpections"
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
        viewButtonLabel="Details"
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
    </>
  )
}

export default AllVehicleInpection
