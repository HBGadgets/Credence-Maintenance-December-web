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

const DocumentAlert = () => {
  const navigate = useNavigate()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // fetch data
  const { data: docAlertData, isFetching } = useQuery({
    queryKey: ['docAlert'],
    queryFn: fetchDocAlerts,
    staleTime: 1000 * 60 * 30,
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  useEffect(() => {
    if (!docAlertData || docAlertData.length === 0) return

    let filtered = [...docAlertData]

    // Filter by supervisor if selected
    if (selectedName?.value) {
      filtered = filtered.filter((item) => item.supervisor?.includes(selectedName.value))
    }

    const styledData = filtered.map((data) => {
      let bgColor = '#28a745' // Default: green for 'Valid'

      if (data.status === 'Expiring Soon') {
        bgColor = '#ffc107' // Yellow
      } else if (data.status === 'Expired') {
        bgColor = '#dc3545' // Red
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
  }, [docAlertData, selectedName])

  const totalPages = Math.ceil(itemsPerPage === -1 ? 1 : (filteredData?.length || 0) / itemsPerPage)

  const columns = [
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Document Type', key: 'documentNames', sortable: true },
    {
      label: 'Issue Date',
      key: 'issueDate',
      sortable: true,
    },
    {
      label: 'Expiry Date',
      key: 'expiryDate',
      sortable: true,
    },
    { label: 'Status', key: 'status', sortable: true },
  ]

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // handle view
  const handleViewButton = (id) => {
    const selectedRow = filteredData.find((item) => item.id === id)
    if (selectedRow?.vehicleId) {
      navigate(`/VehicleProfile/${selectedRow.vehicleId}`)
    } else {
      alert('Vehicle ID not found')
    }
  }

  return (
    <div>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-wrap align-items-center gap-2">
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
