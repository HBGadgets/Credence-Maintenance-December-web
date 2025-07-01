import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ServiceCards from './component/ServiceCards'
import { ImMeter } from 'react-icons/im'
import { MdOutlineNextWeek } from 'react-icons/md'
import { GrHostMaintenance } from 'react-icons/gr'
import { Card } from 'react-bootstrap'
import ServiceHistoryCard from './component/ServiceHistoryCard'
import SmartPagination from '../../components/SmartPagination'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import AddFormButton from './component/AddFormButton'
import {
  deleteVehicleServiceApi,
  getVehicleServiceBillApi,
  getVehicleServiceHistoryApi,
  patchVehicleServiceApi,
  patchVehicleServiceOdometerApi,
  postVehicleServiceApi,
} from '../data/VehicleListData'
import Swal from 'sweetalert2'
import { TokenContext } from '../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import BillShow from '../../components/BillModal/BillShow'
import { toast, ToastContainer } from 'react-toastify'
import SearchInput from '../../components/SearchInput'

const ServiceList = () => {
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [editData, setEditData] = useState(null)
  const [filteredData, setFilteredData] = useState([])
  const [loadingView, setLoadingView] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state

  // Use state for modal
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  //Fetch api
  const { data, isFetching } = useQuery({
    queryKey: ['serviceData', id],
    queryFn: () => getVehicleServiceHistoryApi(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60,
  })

  const serviceData = data?.serviceData || []
  const odometerSummary = data?.odometerSummary || {}

  useEffect(() => {
    let filtered = [...serviceData] // Start from original data

    // Filter by date range
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.originalDate)
        return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
      })
    }

    // Filter by search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    setFilteredData(filtered)
  }, [serviceData, dateRange, searchQuery])

  // POST Mutation
  const { mutate: createService } = useMutation({
    mutationFn: (formData) => postVehicleServiceApi(formData, id),
    onSuccess: () => {
      queryClient.invalidateQueries(['serviceData', id])
      setEditData(null)

      Swal.fire({
        title: 'Success!',
        text: 'Service record has been added successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      })
    },
    onError: (error) => {
      console.error('Error while submitting service:', error)
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to submit service data.',
        icon: 'error',
        confirmButtonText: 'Close',
      })
    },
  })

  // PATCH Mutation
  const { mutate: updateService } = useMutation({
    mutationFn: ({ id, formData }) => patchVehicleServiceApi(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['serviceData', id])
      setEditData(null)

      Swal.fire({
        title: 'Updated!',
        text: 'Service record has been updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      })
    },
    onError: (error) => {
      console.error('Error while updating service:', error)
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to update service data.',
        icon: 'error',
        confirmButtonText: 'Close',
      })
    },
  })

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteVehicleServiceApi(id),
    onSuccess: (data) => {
      Swal.fire('Deleted!', data.message || 'Service deleted successfully.', 'success')
      queryClient.invalidateQueries(['vehicleServiceList']) // refetch service list
    },
    onError: (error) => {
      Swal.fire('Error!', error?.response?.data?.message || 'Failed to delete service.', 'error')
    },
  })

  // Patch for Odometer update
  const { mutate: updateOdometer } = useMutation({
    mutationFn: ({ id, currentOdometer }) =>
      patchVehicleServiceOdometerApi(id, { currentOdometer }),

    onSuccess: () => {
      Swal.fire('Success!', 'Odometer updated successfully.', 'success')
      queryClient.invalidateQueries(['serviceData', id])
    },
    onError: (error) => {
      Swal.fire('Error!', error?.message || 'Failed to update odometer.', 'error')
    },
  })

  // useEffect(() => {
  //   console.log('token', token)
  // }, [token])

  const fields = [
    { name: 'date', label: 'Date', type: 'date', required: true },
    {
      name: 'serviceType',
      label: 'Services Type',
      type: 'select',
      required: true,
      options: [
        {
          value: 'engineOil',
          label: 'Engine Service (Oil, filters, spark plugs, timing belt, tuning).',
        },
        {
          value: 'transmissionService',
          label: 'Transmission & Clutch (Fluid, gearbox, clutch plate, flywheel)',
        },
        {
          value: 'brakeMaintenance',
          label: 'Brakes System (Pads, discs, fluid, ABS module, handbrake).',
        },
        {
          value: 'suspensionSteeringService',
          label: 'Suspension & Steering (Shocks, struts, ball joints, alignment)',
        },
        {
          value: 'tyreWheel',
          label: 'Tyres & Wheels (Replacement, balancing, alignment, rim repair).',
        },
        { value: 'fuel', label: 'Fuel System (Pump, filter, injectors, throttle body).' },
        {
          value: 'acSystemService',
          label:
            'AC & Heating (Compressor, gas refill, condenser, blower, vents,Radiator, coolant flush, thermostat, water pump)',
        },
        {
          value: 'battery',
          label: 'Battery & Electrical (Battery check, starter, alternator, wiring).',
        },
        {
          value: 'newPartService',
          label:
            'Body Part & Paintwork (Dents, repaint, scratches, rust treatment, new parts of vehicle)',
        },
        {
          value: 'interiorCareService',
          label: 'Interior & Cabin Care (Cleaning, detailing, seat repairs, mats)',
        },
        {
          value: 'lightingHornWipers',
          label: 'Lights, Horn & Wipers (Bulbs, horns, wipers, washer motor)',
        },
        {
          value: 'diagnosticsAndScan',
          label: 'Diagnostics & Error Scanning (ECU scan, warning light resolution)',
        },
        {
          value: 'other',
          label: 'Major mechanical issues or part replacements or Full Service of Vehicle (Other).',
        },
      ],
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      placeholder: 'Description',
      required: true,
    },
    {
      name: 'nextService',
      label: 'Next Service KM',
      type: 'number',
      placeholder: 'Next Service Km',
      required: true,
    },
    { name: 'vendor', label: 'Shop Name', type: 'text', placeholder: 'Shop Name', required: true },
    { name: 'location', label: 'Location', type: 'text', placeholder: 'Location' },
    { name: 'amount', label: 'Amount', type: 'number', placeholder: 'Amount', required: true },
    {
      name: 'paymentMode',
      label: 'Payment Mode',
      type: 'select',
      required: true,
      options: [
        { value: 'upi', label: 'UPI' },
        { value: 'cash', label: 'CASH' },
        { value: 'card', label: 'CARD' },
      ],
    },
    {
      name: 'serviceImg',
      label: 'Bill Image',
      type: 'file',
      accept: 'image/*',
    },
  ]

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const totalPages = useMemo(() => {
    return itemsPerPage === -1 ? 1 : Math.ceil(filteredData.length / itemsPerPage)
  }, [filteredData.length, itemsPerPage])

  const paginatedData = useMemo(() => {
    if (itemsPerPage === -1) return filteredData
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  const handleEdit = (id) => {
    const item = filteredData.find((d) => d.id === id)
    if (item) {
      // Format the date to YYYY-MM-DD for the date input field
      const [day, month, year] = item.date.split('-') // assuming "25-06-2025"
      const formattedDate = `${year}-${month}-${day}`

      setEditData({ ...item, date: formattedDate })
    }
  }

  // Handle Delete
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This service log will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id)
      }
    })
  }

  // Handle View
  const handleView = async (id) => {
    setLoadingView(true) // Start loading

    const selectedRow = filteredData.find((item) => item.id === id)
    if (!selectedRow) {
      toast.error('Data not found for this ID')
      setLoadingView(false)
      return
    }

    if (!selectedRow.serviceImg) {
      toast.warn('No bill image available for this entry.')
      setLoadingView(false)
      return
    }

    try {
      const response = await getVehicleServiceBillApi(selectedRow.serviceImg)

      // ✅ Extract nested data
      const { base64Data, contentType } = response?.data || {}

      if (base64Data && contentType) {
        const fileSrc = `data:${contentType};base64,${base64Data}`
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
    } finally {
      setLoadingView(false) // Always stop loading
    }
  }

  // Handle form submit
  const handleSubmit = async (formData) => {
    const result = await Swal.fire({
      title: editData ? 'Confirm Update' : 'Confirm Submission',
      text: editData
        ? 'Are you sure you want to update this service entry?'
        : 'Are you sure you want to submit this service entry?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: editData ? 'Yes, Update' : 'Yes, Submit',
      cancelButtonText: 'Cancel',
    })

    if (result.isConfirmed) {
      const payload = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'serviceImg' && value instanceof File) {
          payload.append('serviceImg', value)
        } else {
          payload.append(key, value)
        }
      })

      if (editData) {
        updateService({ id: editData.id, formData: payload })
      } else {
        createService(payload)
      }
    }
  }

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Handle Date Range Change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }

  return (
    <>
      <ToastContainer />

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
        </div>
        <div className="d-flex justify-content-end align-items-center gap-2 w-75">
          <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />

          <AddFormButton
            buttonLabel="Add Service"
            formFields={
              editData
                ? fields.filter((f) => f.name !== 'odometer' && f.name !== 'nextService')
                : fields
            }
            initialData={editData}
            editMode={!!editData}
            showExternally={!!editData}
            onSubmit={handleSubmit}
            onCloseExternal={() => setEditData(null)}
            size="xl"
          />
        </div>
      </div>

      <Card className="shadow-sm rounded-3 border-0 mt-3">
        <Card.Header className="bg-secondary text-white fw-semibold fs-5">
          Odometer Service KM
        </Card.Header>
        <Card.Body className="px-4 py-3">
          <div className="mb-4">
            <h6 className="text-muted mb-1">Vehicle Name</h6>
            <h5 className="fw-bold text-dark">
              <h5 className="fw-bold text-dark">
                {serviceData.length > 0 ? serviceData[0].currentVehicleName : 'N/A'}
              </h5>
            </h5>
          </div>
          <div className="row">
            {/* odometer */}
            <div className="col-md-4 mb-4">
              <div className="card rounded-3 border-1 p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="text-muted mb-0">
                    <strong>Current Odometer</strong>
                  </h6>
                  <ImMeter size={18} color="#0d6efd" />
                </div>

                <h4>{odometerSummary.currentOdometer?.toLocaleString() || 0} km</h4>

                {/* 👇 Description for normal users */}
                {userRole !== 'superadmin' && (
                  <div className="text fw-semibold mt-1" style={{ fontSize: '0.9rem' }}>
                    Current Odometer Kilometer Reading.
                  </div>
                )}

                {/* 👇 Odometer update input for superadmin */}
                {userRole === 'superadmin' && (
                  <div className="mt-3">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        const value = e.target.currentOdometer.value

                        if (!value || value <= 0) {
                          Swal.fire('Invalid', 'Please enter a valid odometer value.', 'warning')
                          return
                        }

                        updateOdometer({ id, currentOdometer: value })
                        e.target.reset()
                      }}
                    >
                      <div className="d-flex gap-2">
                        <input
                          type="number"
                          name="currentOdometer"
                          className="form-control"
                          placeholder="Update odometer"
                        />
                        <button type="submit" className="btn btn-primary">
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Service Next km */}
            <div className="col-md-4 mb-4">
              <ServiceCards
                title="Next Service Due"
                value={odometerSummary.nextServiceDue}
                unit="km"
                icon={GrHostMaintenance}
                iconColor="#f40adb"
                description="Next Service Come On this Kilometer!"
              />
            </div>

            {/* Last Service km */}
            <div className="col-md-4 mb-4">
              <ServiceCards
                title="Last Service"
                value={odometerSummary.lastService}
                unit="km"
                icon={MdOutlineNextWeek}
                iconColor="#04fe3e"
                description="Last Service done on above Kilometer"
              />
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className="mt-4">
        <ServiceHistoryCard
          paginatedData={paginatedData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          isFetching={isFetching}
          loadingView={loadingView}
        />
        <SmartPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value)
            setCurrentPage(1)
          }}
        />
      </div>

      {/* Modal Component */}
      {showModal && (
        <BillShow
          showModal={showModal}
          setShowModal={setShowModal}
          pdfBase64={pdfBase64}
          modalTitle={modalTitle}
        />
      )}
    </>
  )
}

export default ServiceList
