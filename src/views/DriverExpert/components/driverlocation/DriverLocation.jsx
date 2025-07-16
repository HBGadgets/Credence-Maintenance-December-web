import React, { useContext, useEffect, useState } from 'react'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import { useQuery } from '@tanstack/react-query'
import { fetchDriverAttendanceLocation, fetchSupervisor, getAddressApi } from '../../data/drivers'
import SingleSelectDropdown from '../../../components/SingleSelectDropdown'
import SearchInput from '../../../components/SearchInput'
import DateRangeFilterCredence from '../../../../components/DateRangeFilterCredence'
import { TokenContext } from '../../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'

const DriverLocation = () => {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // fetch attendance
  const { data: attendanceLocData, isFetching } = useQuery({
    queryKey: ['attendanceLoc'],
    queryFn: fetchDriverAttendanceLocation,
    staleTime: 1000 * 60 * 30,
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!attendanceLocData || attendanceLocData.length === 0) return

      const map = {}

      const updatedData = await Promise.all(
        attendanceLocData.map(async (item) => {
          const key = `${item.lat},${item.long}`

          let address = map[key]
          if (!address) {
            address = await getAddressApi(item.lat, item.long)
            map[key] = address
          }

          return {
            ...item,
            address,
          }
        }),
      )

      // filtering
      let filtered = [...updatedData]

      // Filter by supervisor if selected
      if (selectedName?.value) {
        filtered = filtered.filter((supdrv) => supdrv.supervisor === selectedName.value)
      }

      // Filter by date range if available
      if (dateRange.startDate && dateRange.endDate) {
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.originalDate)
          return (
            itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
          )
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

      // Add styled status to final filtered data
      const styledData = filtered.map((data) => ({
        ...data,
        status: (
          <span
            style={{
              backgroundColor: data.status === 'Available' ? '#dc3545' : '#28a745',
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

    fetchAddresses()
  }, [attendanceLocData, selectedName, dateRange, searchQuery])

  const totalPages = Math.ceil(itemsPerPage === -1 ? 1 : (filteredData?.length || 0) / itemsPerPage)

  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'name', sortable: true },
    { label: 'Co-ordinate', key: 'coordinate', sortable: false },
    { label: 'Address', key: 'address', sortable: false },
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

  // handle view
  const handleViewButton = (id) => {
    const selectedRow = filteredData.find((item) => item.id === id)

    if (selectedRow) {
      console.log('Attendance Image ID:', selectedRow.attendanceImageId)
    } else {
      console.warn('Row not found for ID:', id)
    }
  }

  return (
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
        </div>
      </div>

      <Table
        title="Drivers Attendance Location"
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

export default DriverLocation
