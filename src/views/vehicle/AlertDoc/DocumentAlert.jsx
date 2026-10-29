import React, { useContext, useEffect, useState } from 'react'
import { fetchDocAlerts } from '../data/VehicleListData'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import SearchInput from '../../components/SearchInput'
import { fetchSupervisor } from '../../DriverExpert/data/drivers'
import { TokenContext } from '../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import { CNav, CNavItem, CNavLink } from '@coreui/react'
import { FaTruck, FaUserTie } from 'react-icons/fa'

const DocumentAlert = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('vehicle') // 'vehicle' by default
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedName, setSelectedName] = useState(null)

  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  const { data: docAlertData, isFetching } = useQuery({
    queryKey: ['docAlert', activeTab, searchQuery],
    queryFn: () => fetchDocAlerts({ type: activeTab, search: searchQuery }),
    staleTime: 1000 * 60 * 5,
  })

  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  useEffect(() => {
    if (!docAlertData || docAlertData.length === 0) {
      setFilteredData([])
      return
    }

    // Apply filters
    let filtered = [...docAlertData]

    if (activeTab) {
      filtered = filtered.filter((item) => item.docCategory === activeTab)
    }

    if (selectedName?.value) {
      filtered = filtered.filter((item) => item.supervisor?.includes(selectedName.value))
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.vehicleName?.toLowerCase().includes(q) ||
          item.driverName?.toLowerCase().includes(q) ||
          item.documentNames?.toLowerCase().includes(q) ||
          item.companyName?.toLowerCase().includes(q) ||
          item.status?.toLowerCase().includes(q) ||
          item.issueDate?.toLowerCase().includes(q) ||
          item.expiryDate?.toLowerCase().includes(q) ||
          Object.values(item).some(
            (val) => typeof val === 'string' && val.toLowerCase().includes(q),
          ),
      )
    }

    // Then map styled data
    const styledData = filtered.map((data) => {
      let bgColor = '#28a745'

      if (data.status === 'Expiring Soon') {
        bgColor = '#ffc107'
      } else if (data.status === 'Expired') {
        bgColor = '#dc3545'
      }

      return {
        ...data,
        status: (
          <span
            style={{
              backgroundColor: bgColor,
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
      }
    })

    setFilteredData(styledData)
  }, [docAlertData, selectedName, activeTab, searchQuery])

  const totalPages = Math.ceil(itemsPerPage === -1 ? 1 : (filteredData?.length || 0) / itemsPerPage)

  const columns = [
    {
      label: activeTab === 'driver' ? 'Driver Name' : 'Vehicle Name',
      key: 'vehicleName',
      sortable: true,
      render: (row) =>
        activeTab === 'driver'
          ? (row.driverName || row.companyName || row.vehicleName || 'N/A')
          : (row.vehicleName || 'N/A'),
    },
    { label: 'Document Type', key: 'documentNames', sortable: true },
    { label: 'Issue Date', key: 'issueDate', sortable: true },
    { label: 'Expiry Date', key: 'expiryDate', sortable: true },
    {
      label: activeTab === 'driver' ? 'Vehicle Assigned' : 'Company Name',
      key: 'companyName',
      sortable: true,
      render: (row) => (activeTab === 'driver' ? (row.vehicleName || 'N/A') : (row.companyName || 'N/A')),
    },
    { label: 'Status', key: 'status', sortable: true },
  ]

  const handleSearch = (query) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleViewButton = (id) => {
    const selectedRow = filteredData.find((item) => item.id === id)
    if (selectedRow?.vehicleId) {
      navigate(`/VehicleProfile/${selectedRow.vehicleId}`)
    } else if (selectedRow?.driverId) {
      navigate(`/DriverProfile/${selectedRow.driverId}`)
    } else {
      alert('Profile ID not found')
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handleSupervisorChange = (selected) => {
    setSelectedName(selected)
    setCurrentPage(1)
  }

  return (
    <div>
      {/* Navigation Tabs */}
      <CNav variant="tabs" className="mb-3 border-bottom">
        <CNavItem>
          <CNavLink
            active={activeTab === 'vehicle'}
            onClick={() => handleTabChange('vehicle')}
            style={{ cursor: 'pointer', fontWeight: 600 }}
            className="d-flex align-items-center gap-2"
          >
            <FaTruck size={16} />
            <span>Vehicle Expiration</span>
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === 'driver'}
            onClick={() => handleTabChange('driver')}
            style={{ cursor: 'pointer', fontWeight: 600 }}
            className="d-flex align-items-center gap-2"
          >
            <FaUserTie size={16} />
            <span>Driver Expiration</span>
          </CNavLink>
        </CNavItem>
      </CNav>

      {/* Filters & Search */}
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        {/* Left: Supervisor Dropdown (for superadmin) */}
        <div>
          {userRole === 'superadmin' && (
            <div style={{ width: '160px' }}>
              <SingleSelectDropdown
                options={supervisorOptions}
                value={selectedName}
                onChange={handleSupervisorChange}
                isClearable
                placeholder="Supervisor"
              />
            </div>
          )}
        </div>

        {/* Right: Search bar */}
        <div className="d-flex align-items-center" style={{ width: '250px' }}>
          <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
        </div>
      </div>

      {/* Table */}
      <Table
        title={activeTab === 'driver' ? 'Driver Document Expiring' : 'Vehicle Document Expiring'}
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

      {/* Pagination */}
      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          const newItems = value === -1 ? filteredData.length : value
          setItemsPerPage(newItems)
          setCurrentPage(1)
        }}
      />
    </div>
  )
}

export default DocumentAlert
