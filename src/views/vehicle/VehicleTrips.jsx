import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getVehicleSubTripApi, getVehicleTripsByIdAPI } from './data/VehicleListData'
import Table from '../components/Table'
import SmartPagination from '../components/SmartPagination'
import SubTripDetailsModal from './modals/SubtripVehicle'
import { toast, ToastContainer } from 'react-toastify'
import SearchInput from '../components/SearchInput'
import DateRangeFilterCredence from '../../components/DateRangeFilterCredence'
import IconDropdown from '../Supervisor/IconDropdown'
import usePdfExporter from '../customhooks/usePdfExporter'
import useExcelExporter from '../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'

const VehicleTrips = () => {
  const { id } = useParams()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state

  // Modal state for SubTrips
  const [modalVisible, setModalVisible] = useState(false)
  const [subTrips, setSubTrips] = useState([])
  const [selectedTripId, setSelectedTripId] = useState(null) // Track selected trip
  const [loadingSubTrip, setLoadingSubTrip] = useState(false) // Loading state for sub-trips

  const { data: vehicleTrips = [], isFetching } = useQuery({
    queryKey: ['vehicleTrips', id],
    queryFn: () => getVehicleTripsByIdAPI(id),
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  })

  useEffect(() => {
    let filtered = vehicleTrips

    // Filter by date range if available
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.originalDate)
        return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
      })
    }

    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    // Apply styling AFTER filtering
    const styledData = filtered.map((data) => ({
      ...data,
      status: (
        <span
          style={{
            backgroundColor:
              data.status === 'in-progress'
                ? '#f5a623'
                : data.status === 'completed'
                  ? '#28a745'
                  : data.status === 'cancelled'
                    ? '#dc3545'
                    : '#6c757d',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            display: 'inline-block',
            textTransform: 'capitalize',
          }}
        >
          {data.status}
        </span>
      ),
    }))

    setFilteredData(styledData)
  }, [searchQuery, vehicleTrips, dateRange])

  console.log('vehicleTripsssssssssss', vehicleTrips)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  //   Tables columns
  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Start Location', key: 'startLocation', sortable: true },
    { label: 'End Location', key: 'endLocation', sortable: true },
    { label: 'Budget Allocated', key: 'budgetAllocated', sortable: true },
    { label: 'Spent Amount', key: 'spentAmount', sortable: true },
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

  // handle view button

  const handleViewButton = async (id) => {
    setLoadingSubTrip(true) // Start loading state for sub-trip data
    try {
      const subTripData = await getVehicleSubTripApi(id)
      console.log('Returned Sub Trip Data:', subTripData)

      if (!Array.isArray(subTripData)) {
        throw new Error('Expected array but got: ' + JSON.stringify(subTripData))
      }

      setSelectedTripId(id)
      setSubTrips(subTripData)
      setModalVisible(true)
    } catch (error) {
      toast.error('No Sub-Trips Data!')
      console.error('Error fetching sub trip data:', error)
    } finally {
      setLoadingSubTrip(false) // End loading state
    }
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

  // Dropdown items for export
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () => {
        const cleanedData = filteredData.map(({ status, ...rest }) => ({
          ...rest,
          status: typeof status === 'string' ? status : status?.props?.children || '', // Extract text if it's a React element
        }))

        exportToPDF({
          title: 'Vehicle Trips Report',
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
        const cleanedData = filteredData.map(({ status, ...rest }) => ({
          ...rest,
          status: typeof status === 'string' ? status : status?.props?.children || '', // fallback if styled span
        }))

        exportToExcel({
          title: 'Vehicle Trip Report',
          columns: columns,
          data: cleanedData,
          fileName: 'Vehicle_Trip_Report',
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

  return (
    <>
      <ToastContainer />

      <div className="mb-2 d-flex justify-content-between align-items-center">
        {/* Left: Date Range Filter */}
        <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
        <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
      </div>

      <Table
        title="Vehicle Trips"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        viewButton={true}
        handleViewButton={handleViewButton}
        isFetching={isFetching}
        action="Subtrips"
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value)
          setCurrentPage(1)
          if (value === -1) {
            setItemsPerPage(filteredData.length)
          }
        }}
      />

      {/* Show Modal with Sub-Trips for selected Trip ID */}
      {modalVisible && (
        <SubTripDetailsModal
          subTrips={subTrips}
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false)
            setSubTrips([])
            setSelectedTripId(null)
          }}
          tripId={selectedTripId} // Optional: pass it to show in modal
          loadingSubTrip={loadingSubTrip} // Pass loading state to modal
        />
      )}

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default VehicleTrips
