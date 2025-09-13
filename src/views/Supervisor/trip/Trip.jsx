import React, { useState, useEffect, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { getDutySlipApi, getTripListApi } from '../data/data'
import {
  fetchTripDataHelper,
  getStatusBadge,
  handleAddHelper,
  handleDeleteHelper,
  handleEditHelper,
} from './componets/tripHelpers'
import ModalTrips from './ModalTrips'
import { Button, Modal } from 'react-bootstrap'
import SearchInput from '../../components/SearchInput'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import { useNavigate } from 'react-router-dom'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { HiOutlineLogout } from 'react-icons/hi'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import IconDropdown from '../IconDropdown'
import { toast, ToastContainer } from 'react-toastify'
import { TokenContext } from '../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import { fetchSupervisor } from '../../DriverExpert/data/drivers'
import DutySlip from './DutySlip'

const Trip = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state
  const navigate = useNavigate()

  // Duty slip model
  const [dutySlipData, setDutySlipData] = useState(null)
  const [showDutySlipModal, setShowDutySlipModal] = useState(false)
  const [loadingDutySlip, setLoadingDutySlip] = useState(false)

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // Fetch Data
  const {
    data: TripsList = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['TripsList'],
    queryFn: () => getTripListApi(null, token),
    staleTime: 1000 * 60 * 30,
    enabled: !!token, //  only run if token is available
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
    enabled: !!token && !!decodedToken,
  })

  useEffect(() => {
    if (!TripsList || TripsList.length === 0) return

    let filtered = TripsList

    // Filter by supervisor if selected
    if (selectedName?.value) {
      filtered = filtered.filter((trip) => trip.supervisorId === selectedName.value)
    }

    // Filter by date range if available
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.orginalDate)
        return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
      })
    }

    // Apply search query filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    // Apply remaining amount calculation and status badge styling
    const styledData = filtered.map((data) => {
      const budgetAllocated = Number(data.budgetAllocated) || 0
      const subTripBudgetAllocated = Number(data.subTripBudgetAllocated) || 0
      const spentAmount = Number(data.spentAmount) || 0

      const remaining = budgetAllocated + subTripBudgetAllocated - spentAmount

      // Calculate total running km
      const startKM = Number(data.startOdometerReading) || 0
      const endKM = Number(data.endOdometerReading) || 0
      const totalRunning = endKM - startKM > 0 ? (endKM - startKM).toFixed(2) : '0'

      return {
        ...data,
        remainingAmount: (
          <span style={{ color: remaining < 0 ? 'red' : 'inherit' }}>{remaining.toFixed(2)}</span>
        ),
        status: <span className={getStatusBadge(data.status)}>{data.status}</span>,
        totalRunningKM: totalRunning,
      }
    })

    setFilteredData(styledData)
  }, [TripsList, dateRange, searchQuery, selectedName])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const columns = [
    // { label: 'Trip ID', key: 'tripId', sortable: false, hidden: true },
    { label: 'Start Date', key: 'date', sortable: true },
    { label: 'Transport Mode', key: 'transportMode', sortable: true },
    { label: 'Client Name', key: 'clientName', sortable: true },
    { label: 'Client Contact', key: 'clientNumber', sortable: true },
    { label: 'Company Name', key: 'companyName', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Driver CheckIn', key: 'driverCheckIn', sortable: true },
    { label: 'Start Location', key: 'startLocation', sortable: true },
    { label: 'Start Odometer KM', key: 'startOdometerReading', sortable: true },
    { label: 'End Location', key: 'endLocation', sortable: true },
    { label: 'End Odometer KM', key: 'endOdometerReading', sortable: true },
    { label: 'Total Running KM', key: 'totalRunningKM', sortable: true },
    { label: 'Coast Km/Hrs', key: 'coastPerKm', sortable: true },
    { label: 'Client Advance', key: 'clientAdvance', sortable: true },
    { label: 'Budget Allocated', key: 'budgetAllocated', sortable: true },
    { label: 'SubTrip Amount', key: 'subTripBudgetAllocated', sortable: true },
    { label: 'Spent Amount', key: 'spentAmount', sortable: true },
    { label: 'Remaining Amount', key: 'remainingAmount', sortable: true },
    { label: 'Material Type', key: 'materialType', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
  ]

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Handle Date Range Change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }

  // Handle Add Button Click
  const handleAdd = () => {
    setModalMode('add')
    setSelectedTrip(null) // Clear any selected trip data
    setIsModalOpen(true)
  }

  // Handle Edit Button Click
  const handleEditButton = (id) => {
    const selectedTrip = filteredData.find((trip) => trip.id === id)

    if (selectedTrip) {
      setModalMode('edit')
      setSelectedTrip(selectedTrip)
      setIsModalOpen(true)
    }
    console.log('Edit button clicked for Trip ID:', selectedTrip)
  }

  // Handle Submit button
  const handleSubmit = async (data) => {
    if (modalMode === 'add') {
      await handleAddHelper(data, refetch)
      await refetch()
    } else if (modalMode === 'edit') {
      await handleEditHelper(data, refetch)
      await refetch()
    }
    setIsModalOpen(false)
  }

  // Handle Delete button
  const handleDeleteButton = (id, fieldName) => {
    handleDeleteHelper(id, refetch, fieldName)
  }

  // Handle View button
  const handleViewButton = (id) => {
    console.log('trip id ', id)
    navigate(`/SubTrips/${id}`)
  }

  // Dropdown items for export
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () => {
        const cleanedData = filteredData.map(({ status, remainingAmount, ...rest }) => ({
          ...rest,
          status: typeof status === 'string' ? status : status?.props?.children || '',
          remainingAmount:
            typeof remainingAmount === 'string' || typeof remainingAmount === 'number'
              ? remainingAmount
              : remainingAmount?.props?.children || '',
        }))

        exportToPDF({
          title: 'Trips Report',
          columns: columns,
          data: cleanedData,
          fileName: 'Vehicle_Trips_Report',
        })
      },
    },

    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () => {
        const cleanedData = filteredData.map(({ status, remainingAmount, ...rest }) => ({
          ...rest,
          status: typeof status === 'string' ? status : status?.props?.children || '',
          remainingAmount:
            typeof remainingAmount === 'string' || typeof remainingAmount === 'number'
              ? remainingAmount
              : remainingAmount?.props?.children || '',
        }))

        exportToExcel({
          title: 'Trips Report',
          columns: columns,
          data: cleanedData,
          fileName: 'Vehicle_Trips_Report',
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
  ]

  console.log('selectedName:', selectedName)
  console.log('Comparing supervisor:', {
    selectedValue: selectedName?.value,
    selectedLabel: selectedName?.label,
  })

  console.log('Supervisors:', supervisorOptions)

  // Handle reports of duty slip
  const handleReportButton = async (id) => {
    try {
      setLoadingDutySlip(true)
      const data = await getDutySlipApi(id)
      setDutySlipData(data)
      setShowDutySlipModal(true)
      toast.success('Duty slip loaded successfully!') // success toast
    } catch (error) {
      console.error('Failed to fetch duty slip:', error)
      toast.error('Trip in Progress!') // error toast
    } finally {
      setLoadingDutySlip(false)
    }
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
            <Button variant="primary" onClick={handleAdd}>
              Add Trip
            </Button>
          </div>
        </div>

        {/* Trip Modal (for Add or Edit) */}
        {isModalOpen && (
          <ModalTrips
            mode={modalMode}
            selectedTrip={selectedTrip}
            onClose={() => setIsModalOpen(false)} // Close modal
            onSubmit={handleSubmit} // Submit handler
          />
        )}

        <Table
          title="All Vehicles Trips"
          columns={columns}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          viewButton={true}
          handleViewButton={handleViewButton}
          editButton={true}
          handleEditButton={handleEditButton}
          deleteButton={true}
          handleDeleteButton={handleDeleteButton}
          isFetching={isFetching}
          viewButtonLabel="Subtrips"
          reportButton={true}
          handleReportButton={handleReportButton}
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
      </div>

      {/* DutySlip Modal */}
      <Modal show={showDutySlipModal} onHide={() => setShowDutySlipModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Duty Slip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingDutySlip ? (
            <p>Loading...</p>
          ) : dutySlipData ? (
            <DutySlip invoiceData={dutySlipData} />
          ) : (
            <p>No duty slip data available.</p>
          )}
        </Modal.Body>
      </Modal>

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default Trip
