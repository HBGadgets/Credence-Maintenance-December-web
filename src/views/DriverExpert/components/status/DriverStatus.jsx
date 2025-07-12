import React, { useContext, useEffect, useState } from 'react'
import { fetchDriverStatus, fetchSupervisor } from '../../data/drivers'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { TokenContext } from '../../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import SingleSelectDropdown from '../../../components/SingleSelectDropdown'
import SearchInput from '../../../components/SearchInput'

const DriverStatus = () => {
  const token = useContext(TokenContext)
  const navigate = useNavigate()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // superadmin role

  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  const { data: driverStatusData, isFetching } = useQuery({
    queryKey: ['driverStatus'],
    queryFn: fetchDriverStatus,
    staleTime: 1000 * 60 * 30,
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  useEffect(() => {
    if (driverStatusData) {
      // Step 1: Combine and flatten the available/unavailable drivers
      let combinedData = [
        ...driverStatusData.available.map((d) => ({ ...d, status: 'Available' })),
        ...driverStatusData.unavailable.map((d) => ({ ...d, status: 'Unavailable' })),
      ]

      // Step 2: Filter by supervisor if selected
      if (selectedName?.value) {
        combinedData = combinedData.filter((driver) => driver.supervisor === selectedName.value)
      }

      // Step 3: Apply search filter
      if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase()
        combinedData = combinedData.filter((item) =>
          Object.values(item).some(
            (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
          ),
        )
      }

      // Step 4: Add styled status
      const styledData = combinedData.map((data) => ({
        ...data,
        status: (
          <span
            style={{
              backgroundColor: data.status === 'Available' ? '#28a745' : '#dc3545',
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
    }
  }, [driverStatusData, selectedName, searchQuery])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const columns = [
    { label: 'Driver Name', key: 'name', sortable: true },
    { label: 'Contact Number', key: 'contactNumber', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
  ]

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  //handle edit
  const handleViewButton = (id) => {
    navigate(`/DriverProfile/${id}`)
  }

  return (
    <div>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-wrap align-items-center">
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
        title="Drivers Status"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        viewButton={true}
        handleViewButton={handleViewButton}
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

export default DriverStatus
