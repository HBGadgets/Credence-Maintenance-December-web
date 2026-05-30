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
  getServerOdometerApi,
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
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import IconDropdown from '../../Supervisor/IconDropdown'

const ServiceList = () => {
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [editData, setEditData] = useState(null)
  const [filteredData, setFilteredData] = useState([])
  const [loadingView, setLoadingView] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })

  // Use state for modal
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  // Fetch service data with retry logic
  const {
    data: serviceDataResponse,
    isFetching,
    refetch: refetchService,
  } = useQuery({
    queryKey: ['serviceData', id],
    queryFn: () => getVehicleServiceHistoryApi(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60,
    retry: 1, // Retry 2 times on failure (total 3 attempts: 1 initial + 2 retries)
    retryDelay: (attemptIndex) => {
      // Optional: Add delay between retries
      return Math.min(1000 * 1 ** attemptIndex, 30000) // Exponential backoff: 1s, 2s, 4s...
    },
    onError: (error) => {
      console.error('Service data fetch failed after retries:', error)
      // Optional: Show toast notification to user
      toast.error('Failed to load service data after multiple attempts')
    },
  })

  // fetch odometer with retry logic
  const {
    data: odometerData,
    isFetching: isFetchingOdometer,
    refetch: refetchOdometer,
  } = useQuery({
    queryKey: ['odosystem', id],
    queryFn: () => getServerOdometerApi(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60,
    retry: 1, // Retry 2 times on failure (total 3 attempts)
    retryDelay: (attemptIndex) => {
      return Math.min(1000 * 1 ** attemptIndex, 30000) // Exponential backoff
    },
    onError: (error) => {
      console.error('Odometer data fetch failed after retries:', error)
      toast.error('Failed to load odometer data after multiple attempts')
    },
  })

  const serviceData = serviceDataResponse?.serviceData || []
  const odometerDataList = odometerData || []

  // Calculate odometer summary
  const odometerSummary = useMemo(() => {
    if (!odometerDataList || odometerDataList.length === 0) {
      return {
        currentOdometer: 0,
        nextServiceDue: 0,
        lastService: 0,
      }
    }

    // Get the most recent odometer record
    const latestOdometer = odometerDataList[0]

    // Calculate next service due and last service from service data
    const lastServiceRecord = serviceData.length > 0 ? serviceData[serviceData.length - 1] : null

    return {
      currentOdometer: latestOdometer?.totalKm || 0,
      nextServiceDue: lastServiceRecord?.nextServiceKm || 0,
      lastService: lastServiceRecord?.odometer || 0,
    }
  }, [odometerDataList, serviceData])

  useEffect(() => {
    let filtered = [...serviceData]

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
      queryClient.invalidateQueries(['serviceData', id])
      refetchService()
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
      queryClient.invalidateQueries(['odosystem', id])
      refetchOdometer()
    },
    onError: (error) => {
      Swal.fire('Error!', error?.message || 'Failed to update odometer.', 'error')
    },
  })

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
          value: 'tollAndPraking',
          label: 'Toll & Parking',
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
    setLoadingView(true)

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
      setLoadingView(false)
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

    if (!result.isConfirmed) return

    // Validate required fields
    const requiredFields = [
      'date',
      'serviceType',
      'description',
      'nextService',
      'vendor',
      'amount',
      'paymentMode',
    ]

    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(', ')}`)
      return
    }

    if (parseFloat(formData.amount) <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }

    if (parseFloat(formData.nextService) < 0) {
      toast.error('Next service KM cannot be negative')
      return
    }

    const payload = new FormData()

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'serviceImg' && value instanceof File) {
        payload.append('serviceImg', value)
      } else if (value !== undefined && value !== null && value !== '') {
        payload.append(key, value)
      }
    })

    try {
      let response

      if (editData) {
        response = await updateService({
          id: editData.id,
          formData: payload,
        })
      } else {
        response = await createService(payload)
      }

      console.log('API Response:', response)

      // Check API response
      if (response?.success === false || response?.status === false || response?.error) {
        throw new Error(response?.message || response?.error || 'Operation failed')
      }

      toast.success(
        response?.message ||
          (editData
            ? 'Service record updated successfully!'
            : 'Service record added successfully!'),
      )

      // Refresh data here if needed
      // await fetchServiceList()
    } catch (error) {
      console.error('Submit error:', error)

      toast.error(
        error?.response?.data?.message || error?.message || 'Failed to submit service record',
      )
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

  // Define the columns for export
  const columns = [
    { label: 'Date', key: 'date' },
    { label: 'Service Type', key: 'serviceType' },
    { label: 'Description', key: 'description' },
    { label: 'Odometer (km)', key: 'odometer' },
    { label: 'Next Service Km', key: 'nextServiceKm' },
    { label: 'Driver Name', key: 'driverName' },
    { label: 'Shop Name', key: 'vendor' },
    { label: 'Location', key: 'location' },
    { label: 'Amount', key: 'amount' },
    { label: 'Payment Mode', key: 'paymentMode' },
  ]

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.clear()
    localStorage.clear()

    document.cookie.split(';').forEach((c) => {
      const base = c.trim().split('=')[0]
      document.cookie = `${base}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    })

    window.history.replaceState(null, '', '/')
    window.location.href = import.meta.env.VITE_API_CREDENCE_URL
  }

  // Memoized dropdown items for export
  const dropdownItems = useMemo(
    () => [
      {
        icon: FaRegFilePdf,
        label: 'Download PDF',
        onClick: () => {
          const cleanedData = filteredData.map(({ paymentMode, ...rest }) => ({
            ...rest,
            paymentMode:
              typeof paymentMode === 'string' ? paymentMode : paymentMode?.props?.children || '',
          }))
          exportToPDF({
            title: 'Vehicle Service Report',
            columns,
            data: cleanedData,
            fileName: 'Vehicle_Service_Report',
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
              typeof paymentMode === 'string' ? paymentMode : paymentMode?.props?.children || '',
          }))
          exportToExcel({
            title: 'Vehicle Service Report',
            columns,
            data: cleanedData,
            fileName: 'Vehicle_Service_Report',
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
          {serviceData.length > 0 && (
            <div className="mb-4">
              <h6 className="text-muted mb-1">Vehicle Name</h6>
              <h5 className="fw-bold text-dark">{serviceData[0].vehicleName}</h5>
            </div>
          )}

          <div className="row">
            {/* odometer */}
            <div className="col-md-4 mb-4">
              <div className="card rounded-3 border-1 p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="text-muted mb-0">
                    <strong>Odometer</strong>
                  </h6>
                  <ImMeter size={18} color="#0d6efd" />
                </div>

                <h4>
                  {odometerSummary.currentOdometer
                    ? typeof odometerSummary.currentOdometer === 'number'
                      ? odometerSummary.currentOdometer.toFixed(2).toLocaleString()
                      : Number(odometerSummary.currentOdometer).toFixed(2).toLocaleString()
                    : 0}{' '}
                  km
                </h4>

                <div className="text fw-semibold mt-1" style={{ fontSize: '0.9rem' }}>
                  Odometer Kilometer Reading.
                </div>
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

      {showModal && (
        <BillShow
          showModal={showModal}
          setShowModal={setShowModal}
          pdfBase64={pdfBase64}
          modalTitle={modalTitle}
        />
      )}

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default ServiceList
