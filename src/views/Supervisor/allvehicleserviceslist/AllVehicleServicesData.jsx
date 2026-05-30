import { useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { getAllServiceHistoryApi } from '../data/data'
import { useNavigate } from 'react-router-dom'
import SearchInput from '../../components/SearchInput'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import { TokenContext } from '../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import { fetchSupervisor } from '../../DriverExpert/data/drivers'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import IconDropdown from '../IconDropdown'

const AllVehicleServicesData = () => {
  const navigate = useNavigate()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [rowMapById, setRowMapById] = useState({})
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // fetch data
  const { data: serviceLogs, isFetching } = useQuery({
    queryKey: ['vehicleServiceLogs'],
    queryFn: () => getAllServiceHistoryApi(),
    staleTime: 1000 * 60 * 10,
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  // useeffect
  useEffect(() => {
    if (!Array.isArray(serviceLogs)) return

    if (!serviceLogs || serviceLogs.length === 0) return

    // Step 1: Start with full data
    let filtered = [...serviceLogs]

    // Filter by supervisor if selected
    if (selectedName?.value) {
      filtered = filtered.filter((services) => services.supervisor === selectedName.value)
    }

    // Step 2: Filter by date range
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate)
      const end = new Date(dateRange.endDate)

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.originalDate)
        return itemDate >= start && itemDate <= end
      })
    }

    // Step 3: Filter by search query
    if (searchQuery.trim()) {
      const lowercasedQuery = searchQuery.toLowerCase()

      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    // Step 4: Set filtered data
    setFilteredData(filtered)

    // Step 5: Create row map for view navigation
    const map = {}
    serviceLogs.forEach((row) => {
      map[row.id] = row
    })
    setRowMapById(map)
  }, [serviceLogs, dateRange, searchQuery, selectedName])

  // payment colors
  const getPaymentStyle = (payment) => {
    return {
      display: 'inline-block',
      minWidth: '70px',
      padding: '1px 8px',
      borderRadius: '10px',
      textAlign: 'center',
      textTransform: 'capitalize',
      fontWeight: '400',
      backgroundColor:
        payment === 'upi'
          ? '#0000FF'
          : payment === 'cash'
            ? '#28a745'
            : payment === 'card'
              ? '#f5a623'
              : '#0000FF',
      color: 'white',
    }
  }

  // trip status
  const getTripStatuStyle = (payment) => {
    return {
      display: 'inline-block',
      minWidth: '70px',
      padding: '1px 8px',
      borderRadius: '10px',
      textAlign: 'center',
      textTransform: 'capitalize',
      fontWeight: '400',
      backgroundColor:
        payment === 'cancelled'
          ? '#FF0000'
          : payment === 'completed'
            ? '#28a745'
            : payment === 'in-progress'
              ? '#f5a623'
              : '#0000FF',
      color: 'white',
    }
  }

  const columns = [
    { label: 'Service Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Current Vehicle', key: 'currentVehicleName', sortable: true },
    { label: 'Trip Start', key: 'tripStartLocation', sortable: true },
    { label: 'Trip End', key: 'tripEndLocation', sortable: true },
    { label: 'Shop Name', key: 'shopName', sortable: true },
    { label: 'Services Type', key: 'serviceType', sortable: true },
    { label: 'Description', key: 'description', sortable: true },
    { label: 'Last Service KM', key: 'odometer', sortable: true },
    { label: 'Next Service KM', key: 'nextServiceKm', sortable: true },
    { label: 'Location', key: 'location', sortable: true },
    { label: 'Co-ordinate', key: 'coordinate', sortable: true },
    {
      label: 'Trip Status',
      key: 'tripStatus',
      render: (row) => <span style={getTripStatuStyle(row.tripStatus)}>{row.tripStatus}</span>,
      sortable: true,
    },
    { label: 'Amount', key: 'amount', sortable: true },
    {
      label: 'Payment Mode',
      key: 'paymentMode',
      render: (row) => <span style={getPaymentStyle(row.paymentMode)}>{row.paymentMode}</span>,
      sortable: false,
    },
  ]

  // handle viewbutton
  const handleViewButton = (id) => {
    const row = rowMapById[id]
    if (row) {
      console.log('Navigating to Vehicle ServiceList for Vehicle ID:', row.vehicleId)
      navigate(`/VehicleProfile/${row.vehicleId}/ServiceList`)
    } else {
      console.warn('Row not found for ID:', id)
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

  console.log('selectedName:', selectedName)
  console.log('Comparing supervisor:', {
    selectedValue: selectedName?.value,
    selectedLabel: selectedName?.label,
  })

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
      {
        icon: FaRegFilePdf,
        label: 'Download PDF',
        onClick: () =>
          exportToPDF({
            title: 'Driver LogBook Report',
            columns,
            data: filteredData,
            fileName: 'Driver_LogBook_Report',
          }),
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () => {
          exportToExcel({
            title: 'Driver LogBook Report',
            columns,
            data: filteredData,
            fileName: 'Driver_LogBook_Report',
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
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
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
        </div>
      </div>

      <Table
        title="All Vehicles Service History"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        viewButton={true}
        handleViewButton={handleViewButton}
        action="Details"
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

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default AllVehicleServicesData
