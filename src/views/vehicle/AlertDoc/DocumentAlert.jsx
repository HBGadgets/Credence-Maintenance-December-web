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
import DocumentStatusCard from './DocumentStatusCard'

const DocumentAlert = () => {
  const navigate = useNavigate()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedName, setSelectedName] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)

  const [statusCounts, setStatusCounts] = useState({
    Valid: 0,
    'Expiring Soon': 0,
    Expired: 0,
  })

  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  const { data: docAlertData, isFetching } = useQuery({
    queryKey: ['docAlert'],
    queryFn: fetchDocAlerts,
    staleTime: 1000 * 60 * 30,
  })

  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  useEffect(() => {
    if (!docAlertData || docAlertData.length === 0) return

    let counts = { Valid: 0, 'Expiring Soon': 0, Expired: 0 }

    // First calculate full status counts (from full docAlertData)
    docAlertData.forEach((item) => {
      if (item.status === 'Valid') counts.Valid++
      else if (item.status === 'Expiring Soon') counts['Expiring Soon']++
      else if (item.status === 'Expired') counts.Expired++
    })

    setStatusCounts(counts)

    // Then apply filters
    let filtered = [...docAlertData]

    if (selectedName?.value) {
      filtered = filtered.filter((item) => item.supervisor?.includes(selectedName.value))
    }

    if (selectedStatus) {
      filtered = filtered.filter((item) => item.status === selectedStatus)
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
    setStatusCounts(counts)
  }, [docAlertData, selectedName, selectedStatus])

  const totalPages = Math.ceil(itemsPerPage === -1 ? 1 : (filteredData?.length || 0) / itemsPerPage)

  const columns = [
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Document Type', key: 'documentNames', sortable: true },
    { label: 'Issue Date', key: 'issueDate', sortable: true },
    { label: 'Expiry Date', key: 'expiryDate', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
  ]

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleViewButton = (id) => {
    const selectedRow = filteredData.find((item) => item.id === id)
    if (selectedRow?.vehicleId) {
      navigate(`/VehicleProfile/${selectedRow.vehicleId}`)
    } else {
      alert('Vehicle ID not found')
    }
  }

  const handleStatusClick = (status) => {
    setSelectedStatus((prev) => (prev === status ? null : status))
  }

  return (
    <div>
      {/* Status Pills */}
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        {/* Left: Pills + Dropdown */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <DocumentStatusCard
            label="ALL"
            count={statusCounts.Valid + statusCounts['Expiring Soon'] + statusCounts.Expired}
            status={null}
            isSelected={selectedStatus === null}
            onClick={handleStatusClick}
          />
          <DocumentStatusCard
            label="Valid"
            count={statusCounts.Valid}
            status="Valid"
            isSelected={selectedStatus === 'Valid'}
            onClick={handleStatusClick}
          />
          <DocumentStatusCard
            label="Expiring Soon"
            count={statusCounts['Expiring Soon']}
            status="Expiring Soon"
            isSelected={selectedStatus === 'Expiring Soon'}
            onClick={handleStatusClick}
          />
          <DocumentStatusCard
            label="Expired"
            count={statusCounts.Expired}
            status="Expired"
            isSelected={selectedStatus === 'Expired'}
            onClick={handleStatusClick}
          />

          {userRole === 'superadmin' && (
            <div style={{ width: '160px' }}>
              <SingleSelectDropdown
                options={supervisorOptions}
                value={selectedName}
                onChange={setSelectedName}
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
        title="Vehicle Document Expiring"
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
