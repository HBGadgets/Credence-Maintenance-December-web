import React, { useContext, useEffect, useState } from 'react'
import { fetchVehicleStatus } from '../data/VehicleListData'
import { useQuery } from '@tanstack/react-query'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { TokenContext } from '../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import SearchInput from '../../components/SearchInput'
import { useNavigate } from 'react-router-dom'

const AssignVehicle = () => {
  const token = useContext(TokenContext)
  const navigate = useNavigate()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)
  const [nameOptions, setNameOptions] = useState([])

  // superadmin role
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  //   fetch api
  const { data: vehicleStatusData, isFetching } = useQuery({
    queryKey: ['vehicleStatus'],
    queryFn: fetchVehicleStatus,
    staleTime: 1000 * 60 * 30,
  })

  // fetching supervisor data
  useEffect(() => {
    if (!vehicleStatusData) return

    const supervisors = [...new Set(vehicleStatusData.map((v) => v.supervisor).filter(Boolean))]

    const options = supervisors.map((name) => ({
      label: name,
      value: name,
    }))

    setNameOptions(options)
  }, [vehicleStatusData])

  //   fetch search and other data
  useEffect(() => {
    if (vehicleStatusData) {
      let combinedData = [...vehicleStatusData]

      //Filter by supervisor if selected
      if (selectedName) {
        combinedData = combinedData.filter((item) => item.supervisor === selectedName.value)
      }

      //Apply search filter
      if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase()
        combinedData = combinedData.filter((item) =>
          Object.values(item).some(
            (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
          ),
        )
      }

      //Add styled status
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
  }, [vehicleStatusData, selectedName, searchQuery])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const columns = [
    { label: 'Vehicle Number', key: 'name', sortable: true },
    { label: 'Model', key: 'model', sortable: true },
    { label: 'Category', key: 'category', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Spuervisor', key: 'supervisor', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
  ]

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  //handle edit
  const handleViewButton = (id) => {
    navigate(`/VehicleProfile/${id}`)
  }

  return (
    <div>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-wrap align-items-center">
          {userRole === 'superadmin' && (
            <div style={{ width: '150px' }}>
              <SingleSelectDropdown
                options={nameOptions}
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
        title="Vehicle Assign to Driver Status"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        viewButton={true}
        handleViewButton={handleViewButton}
        action="Profile"
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

export default AssignVehicle
