import React, { useState, useEffect, useMemo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  CBadge,
  CTooltip,
  CNav,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import {
  FaClock,
  FaRegFilePdf,
  FaPrint,
  FaArrowUp,
  FaTruck,
  FaUserTie,
} from 'react-icons/fa'
import { Eye } from 'lucide-react'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import { jwtDecode } from 'jwt-decode'

import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import SearchInput from '../../components/SearchInput'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import IconDropdown from '../IconDropdown'
import FilterShiftHistoryModal from './components/FilterShiftHistoryModal'
import { TokenContext } from '../../../context/TokenContext'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import useDebounce from '../../customhooks/useDebounce'
import { fetchSupervisor } from '../../DriverExpert/data/drivers'
import { getActiveShiftLogsApi, getDriverShiftLogsApi } from './data'

function ShiftLogs() {
  const navigate = useNavigate()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()

  const [activeTab, setActiveTab] = useState('vehicle') // 'vehicle' | 'driver'
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSupervisor, setSelectedSupervisor] = useState(null)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [selectedRowForHistory, setSelectedRowForHistory] = useState(null)

  // Driver tab states
  const [driverCurrentPage, setDriverCurrentPage] = useState(1)
  const [driverItemsPerPage, setDriverItemsPerPage] = useState(10)

  const debouncedSearch = useDebounce(searchQuery, 400)

  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // Fetch Active Vehicle Shift Logs
  const {
    data: shiftLogsResponse,
    isFetching,
  } = useQuery({
    queryKey: ['activeShiftLogs'],
    queryFn: getActiveShiftLogsApi,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: false,
    refetchOnWindowFocus: false,
  })

  // Fetch Driver Shift Logs (Endpoint 6)
  const {
    data: driverShiftLogsResponse,
    isFetching: isFetchingDriverLogs,
  } = useQuery({
    queryKey: [
      'driverShiftLogs',
      driverCurrentPage,
      driverItemsPerPage,
      debouncedSearch,
    ],
    queryFn: () =>
      getDriverShiftLogsApi({
        page: driverCurrentPage,
        limit: driverItemsPerPage,
        search: debouncedSearch || undefined,
      }),
    enabled: activeTab === 'driver',
    staleTime: 1000 * 60 * 2,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const driverLogsList = Array.isArray(driverShiftLogsResponse?.data)
    ? driverShiftLogsResponse.data
    : []
  const driverTotalCount =
    driverShiftLogsResponse?.total ??
    driverShiftLogsResponse?.totalRecords ??
    driverShiftLogsResponse?.count ??
    driverLogsList.length
  const driverTotalPages =
    driverShiftLogsResponse?.totalPages ??
    Math.max(1, Math.ceil(driverTotalCount / driverItemsPerPage))

  // Fetch Supervisors for superadmin filter
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
    enabled: userRole === 'superadmin',
  })

  // Open parameter prompt modal for viewing vehicle or driver shift history
  const handleViewDetailLogs = (row) => {
    setSelectedRowForHistory(row)
    setFilterModalVisible(true)
  }

  // Open parameter prompt modal for driver
  const handleViewDriverReport = (row) => {
    setSelectedRowForHistory(row)
    setFilterModalVisible(true)
  }

  // Navigate to VehicleShiftLogs or DriverShiftLogs with confirmed parameters
  const handleConfirmHistoryFilters = (params) => {
    const searchParams = new URLSearchParams()
    if (params.vehicleId) searchParams.set('vehicleId', params.vehicleId)
    if (params.vehicleName) searchParams.set('vehicleName', params.vehicleName)
    if (params.driverId) searchParams.set('driverId', params.driverId)
    if (params.driverName) searchParams.set('driverName', params.driverName)
    if (params.status && params.status !== 'all') searchParams.set('status', params.status)
    if (params.startDate) searchParams.set('startDate', params.startDate)
    if (params.endDate) searchParams.set('endDate', params.endDate)
    if (params.month) searchParams.set('month', params.month)
    if (params.year) searchParams.set('year', params.year)

    if (activeTab === 'driver') {
      navigate(`/DriverShiftLogs?${searchParams.toString()}`)
    } else {
      navigate(`/VehicleShiftLogs?${searchParams.toString()}`)
    }
  }

  const rawShiftData = shiftLogsResponse?.data

  // Filter effect - depend only on stable references
  useEffect(() => {
    let list = Array.isArray(rawShiftData) ? [...rawShiftData] : []

    // Filter by supervisor
    if (selectedSupervisor?.value) {
      list = list.filter((item) => item.supervisor === selectedSupervisor.value)
    }

    // Filter by search query
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (item) =>
          item.driverName?.toLowerCase().includes(q) ||
          item.vehicleName?.toLowerCase().includes(q) ||
          item.contactNumber?.toString().toLowerCase().includes(q) ||
          item.assignmentType?.toLowerCase().includes(q) ||
          item.duration?.toLowerCase().includes(q) ||
          item.remarks?.toLowerCase().includes(q) ||
          item.vehicleCategory?.toLowerCase().includes(q) ||
          item.vehicleModel?.toLowerCase().includes(q),
      )
    }

    setFilteredData(list)
    setCurrentPage(1)
  }, [rawShiftData, selectedSupervisor?.value, searchQuery])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Columns for Vehicle Shift Logs
  const vehicleColumns = [
    {
      label: 'Vehicle',
      key: 'vehicleName',
      sortable: true,
      render: (row) => (
        <span className="fw-semibold text-dark">{row.vehicleName}</span>
      ),
    },
    {
      label: 'Driver Name',
      key: 'driverName',
      sortable: true,
      render: (row) => (
        <span className="fw-semibold text-dark">{row.driverName}</span>
      ),
    },
    {
      label: 'Contact Number',
      key: 'contactNumber',
      sortable: true,
      render: (row) => (
        <span className="text-secondary">
          {row.contactNumber && row.contactNumber !== 'N/A' ? row.contactNumber : '—'}
        </span>
      ),
    },
    {
      label: 'Assigned At',
      key: 'assignedAtFormatted',
      sortable: true,
      render: (row) => (
        <span className="small text-nowrap">
          {row.assignedAtFormatted || '—'}
        </span>
      ),
    },
    {
      label: 'Shift Duration',
      key: 'duration',
      sortable: true,
      render: (row) => (
        <CTooltip content={`Ongoing since ${row.assignedAtFormatted || 'assignment'}`} placement="top">
          <span
            className="badge bg-light text-primary border border-primary px-2 py-1 d-inline-flex align-items-center gap-1"
            style={{ cursor: 'pointer', fontSize: '12px' }}
          >
            <FaClock size={11} />
            {row.duration || 'Just started'}
          </span>
        </CTooltip>
      ),
    },
    {
      label: 'Assignment Type',
      key: 'assignmentType',
      sortable: false,
      render: (row) => (
        <CBadge color="secondary" className="text-capitalize px-2 py-1">
          {row.assignmentType || 'Manual'}
        </CBadge>
      ),
    },
    {
      label: 'Remarks',
      key: 'remarks',
      sortable: false,
      render: (row) => (
        <span className="text-secondary">
          {row.remarks || '—'}
        </span>
      ),
    },
  ]

  // Columns for Driver Shift Logs
  const driverColumns = [
    {
      label: 'Driver Name',
      key: 'driverName',
      sortable: true,
      render: (row) => (
        <span className="fw-semibold text-dark">{row.driverName}</span>
      ),
    },
    {
      label: 'Contact Number',
      key: 'contactNumber',
      sortable: true,
      render: (row) => (
        <span className="text-secondary">
          {row.contactNumber && row.contactNumber !== 'N/A' ? row.contactNumber : '—'}
        </span>
      ),
    },
    {
      label: 'Assigned Vehicle',
      key: 'vehicleName',
      sortable: true,
      render: (row) => (
        <span className="fw-semibold text-dark">{row.vehicleName}</span>
      ),
    },
    {
      label: 'Assigned At',
      key: 'assignedAtFormatted',
      sortable: true,
      render: (row) => (
        <span className="small text-nowrap">
          {row.assignedAtFormatted || '—'}
        </span>
      ),
    },
    {
      label: 'Shift Duration',
      key: 'duration',
      sortable: true,
      render: (row) => (
        <CTooltip content={`Ongoing since ${row.assignedAtFormatted || 'assignment'}`} placement="top">
          <span
            className="badge bg-light text-primary border border-primary px-2 py-1 d-inline-flex align-items-center gap-1"
            style={{ cursor: 'pointer', fontSize: '12px' }}
          >
            <FaClock size={11} />
            {row.duration || 'Just started'}
          </span>
        </CTooltip>
      ),
    },
    {
      label: 'Assignment Type',
      key: 'assignmentType',
      sortable: false,
      render: (row) => (
        <CBadge color="secondary" className="text-capitalize px-2 py-1">
          {row.assignmentType || 'Manual'}
        </CBadge>
      ),
    },
    {
      label: 'Remarks',
      key: 'remarks',
      sortable: false,
      render: (row) => (
        <span className="text-secondary">
          {row.remarks || '—'}
        </span>
      ),
    },
  ]

  // Logout
  const handleLogout = () => {
    sessionStorage.clear()
    localStorage.clear()
    document.cookie.split(';').forEach((c) => {
      const base = c.trim().split('=')[0]
      document.cookie = `${base}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    })
    window.location.href = import.meta.env.VITE_API_CREDENCE_URL || '/'
  }

  // Floating Dropdown Items
  const dropdownItems = useMemo(
    () => [
      {
        icon: FaRegFilePdf,
        label: 'Download PDF',
        onClick: () =>
          exportToPDF({
            title: `Ongoing ${activeTab === 'vehicle' ? 'Vehicle' : 'Driver'} Shift Logs Report`,
            columns: [
              ...(activeTab === 'vehicle'
                ? [
                    { label: 'Vehicle', key: 'vehicleName' },
                    { label: 'Driver Name', key: 'driverName' },
                  ]
                : [
                    { label: 'Driver Name', key: 'driverName' },
                    { label: 'Vehicle', key: 'vehicleName' },
                  ]),
              { label: 'Contact', key: 'contactNumber' },
              { label: 'Assigned At', key: 'assignedAtFormatted' },
              { label: 'Duration', key: 'duration' },
              { label: 'Assignment Type', key: 'assignmentType' },
              { label: 'Remarks', key: 'remarks' },
            ],
            data: filteredData,
            fileName: `Ongoing_${activeTab === 'vehicle' ? 'Vehicle' : 'Driver'}_Shift_Logs_Report`,
          }),
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () =>
          exportToExcel({
            title: `Ongoing ${activeTab === 'vehicle' ? 'Vehicle' : 'Driver'} Shift Logs Report`,
            columns: [
              ...(activeTab === 'vehicle'
                ? [
                    { label: 'Vehicle', key: 'vehicleName' },
                    { label: 'Driver Name', key: 'driverName' },
                  ]
                : [
                    { label: 'Driver Name', key: 'driverName' },
                    { label: 'Vehicle', key: 'vehicleName' },
                  ]),
              { label: 'Contact', key: 'contactNumber' },
              { label: 'Assigned At', key: 'assignedAtFormatted' },
              { label: 'Duration', key: 'duration' },
              { label: 'Assignment Type', key: 'assignmentType' },
              { label: 'Remarks', key: 'remarks' },
            ],
            data: filteredData,
            fileName: `Ongoing_${activeTab === 'vehicle' ? 'Vehicle' : 'Driver'}_Shift_Logs_Report`,
          }),
      },
      {
        icon: FaPrint,
        label: 'Print Page',
        onClick: () => window.print(),
      },
      {
        icon: HiOutlineLogout,
        label: 'Logout',
        onClick: handleLogout,
      },
      {
        icon: FaArrowUp,
        label: 'Scroll To Top',
        onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      },
    ],
    [filteredData, exportToPDF, exportToExcel],
  )

  return (
    <>
      {/* Shift Logs Navigation Tabs */}
      <CNav variant="tabs" className="mb-3 border-bottom">
        <CNavItem>
          <CNavLink
            active={activeTab === 'vehicle'}
            onClick={() => {
              setActiveTab('vehicle')
              setCurrentPage(1)
            }}
            style={{ cursor: 'pointer', fontWeight: 600 }}
            className="d-flex align-items-center gap-2"
          >
            <FaTruck size={15} />
            <span>Vehicle Shift Logs</span>
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === 'driver'}
            onClick={() => {
              setActiveTab('driver')
              setCurrentPage(1)
            }}
            style={{ cursor: 'pointer', fontWeight: 600 }}
            className="d-flex align-items-center gap-2"
          >
            <FaUserTie size={15} />
            <span>Driver Shift Logs</span>
          </CNavLink>
        </CNavItem>
      </CNav>

      {/* Action Header */}
      <div className="mb-4">
        <div className="row g-3 align-items-center justify-content-between">
          <div className="col-lg-5 col-md-12 d-flex flex-wrap align-items-center gap-2">
            {userRole === 'superadmin' && supervisorOptions.length > 0 && (
              <div style={{ minWidth: '240px' }}>
                <SingleSelectDropdown
                  options={supervisorOptions}
                  value={selectedSupervisor}
                  onChange={setSelectedSupervisor}
                  isClearable
                  placeholder="Filter by Supervisor..."
                />
              </div>
            )}
          </div>

          <div className="col-lg-7 col-md-12 d-flex justify-content-end align-items-center flex-wrap gap-2">
            <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </div>
      </div>

      {/* Total Count Badge on Top of Table */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="badge bg-light text-dark border px-3 py-2 fs-6 shadow-sm">
          Total Logs:{' '}
          <strong className="text-primary">
            {activeTab === 'vehicle' ? filteredData.length : driverTotalCount}
          </strong>
        </span>
      </div>

      {/* Main Table */}
      <Table
        columns={activeTab === 'vehicle' ? vehicleColumns : driverColumns}
        filteredData={activeTab === 'vehicle' ? filteredData : driverLogsList}
        setFilteredData={activeTab === 'vehicle' ? setFilteredData : undefined}
        currentPage={activeTab === 'vehicle' ? currentPage : driverCurrentPage}
        itemsPerPage={activeTab === 'vehicle' ? itemsPerPage : driverItemsPerPage}
        isFetching={activeTab === 'vehicle' ? isFetching : isFetchingDriverLogs}
        viewButton={false}
        editButton={false}
        deleteButton={false}
        renderActions={(row) => (
          <CTooltip
            content={
              activeTab === 'vehicle'
                ? `View Shift History (${row.vehicleName})`
                : `View Shift History (${row.driverName})`
            }
            placement="top"
          >
            <button
              className="action-button"
              onClick={() => handleViewDetailLogs(row)}
              aria-label={
                activeTab === 'vehicle' ? 'View Shift History' : 'View Driver Shift History'
              }
              title={
                activeTab === 'vehicle'
                  ? 'View Vehicle Shift History'
                  : 'View Driver Shift History'
              }
            >
              <Eye color="#0d6efd" size={18} />
            </button>
          </CTooltip>
        )}
        showPagination={false}
      />

      {/* Pagination */}
      <SmartPagination
        totalPages={activeTab === 'vehicle' ? totalPages : driverTotalPages}
        currentPage={activeTab === 'vehicle' ? currentPage : driverCurrentPage}
        onPageChange={activeTab === 'vehicle' ? setCurrentPage : setDriverCurrentPage}
        itemsPerPage={activeTab === 'vehicle' ? itemsPerPage : driverItemsPerPage}
        onItemsPerPageChange={(value) => {
          if (activeTab === 'vehicle') {
            setItemsPerPage(value === -1 ? filteredData.length : value)
            setCurrentPage(1)
          } else {
            setDriverItemsPerPage(value === -1 ? driverTotalCount : value)
            setDriverCurrentPage(1)
          }
        }}
      />

      {/* Filter Parameters Modal for Vehicle and Driver Details */}
      <FilterShiftHistoryModal
        visible={filterModalVisible}
        setVisible={setFilterModalVisible}
        selectedRow={selectedRowForHistory}
        onConfirm={handleConfirmHistoryFilters}
        mode={activeTab}
      />

      {/* Export / Quick Actions floating dropdown */}
      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default ShiftLogs
