import React, { useContext, useEffect, useState } from 'react'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import { useQuery } from '@tanstack/react-query'
import {
  fetchDriverAttendanceLocation,
  fetchSupervisor,
  getAddressApi,
  getDriverLocationApi,
} from '../../data/drivers'
import SingleSelectDropdown from '../../../components/SingleSelectDropdown'
import SearchInput from '../../../components/SearchInput'
import DateRangeFilterCredence from '../../../../components/DateRangeFilterCredence'
import { TokenContext } from '../../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import BillShow from '../../../components/BillModal/BillShow'
import { toast, ToastContainer } from 'react-toastify'

const DriverLocation = () => {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })

  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  const [selectedName, setSelectedName] = useState(null)

  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role ?? 'user'

  const {
    data: attendanceLocData = [],
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['attendanceLoc'],
    queryFn: fetchDriverAttendanceLocation,
    staleTime: 1000 * 60 * 30,
  })

  const { data: supervisorOptions = [], isError: isSupervisorError } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!attendanceLocData || attendanceLocData.length === 0) {
        setFilteredData([])
        return
      }

      const map = {}

      const updatedData = await Promise.all(
        attendanceLocData.map(async (item) => {
          if (!item.lat || !item.long) return { ...item, address: 'N/A' }

          const key = `${item.lat},${item.long}`

          if (!map[key]) {
            try {
              map[key] = await getAddressApi(item.lat, item.long)
            } catch (err) {
              console.error('Failed to get address:', err)
              map[key] = 'Address not found'
            }
          }

          return {
            ...item,
            coordinate:
              item.lat !== 'N/A' ? `${item.lat}, ${item.long}` : 'Co-ordinates not available',
            address: map[key],
          }
        }),
      )

      // Apply filters
      let filtered = [...updatedData]

      if (selectedName?.value) {
        filtered = filtered.filter((item) => item.supervisor === selectedName.value)
      }

      if (dateRange.startDate && dateRange.endDate) {
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.originalDate)
          return (
            itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
          )
        })
      }

      if (searchQuery) {
        const lower = searchQuery.toLowerCase()
        filtered = filtered.filter((item) =>
          Object.values(item).some(
            (val) => typeof val === 'string' && val.toLowerCase().includes(lower),
          ),
        )
      }

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
    // { label: 'Co-ordinate', key: 'coordinate', sortable: false },
    { label: 'Address', key: 'address', sortable: false },
    { label: 'Status', key: 'status', sortable: true },
  ]

  const handleSearch = (query) => setSearchQuery(query)

  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }

  const handleViewButton = async (id) => {
    const selectedRow = filteredData.find((item) => item.id === id)

    if (!selectedRow?.attendanceImageId) {
      toast.warning('No image found for selected entry.')
      return
    }

    try {
      const response = await getDriverLocationApi(selectedRow.attendanceImageId)
      const { base64Data, contentType } = response

      if (!base64Data || !contentType) {
        toast.error('Invalid image data.')
        return
      }

      const fileSrc = `data:${contentType};base64,${base64Data}`
      setPdfBase64(fileSrc)
      setModalTitle(
        contentType.includes('pdf')
          ? 'Driver Location Image (PDF)'
          : contentType.includes('image')
            ? 'Driver Location Image'
            : 'Driver Location File',
      )
      setShowModal(true)
    } catch (error) {
      console.error('Image fetch error:', error)
      toast.error('No image found or failed to load.')
    }
  }

  return (
    <div>
      <ToastContainer />

      {isError && (
        <div className="alert alert-danger" role="alert">
          Failed to load driver attendance data.
        </div>
      )}

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
          {userRole === 'superadmin' && supervisorOptions.length > 0 && (
            <div style={{ width: '150px' }}>
              <SingleSelectDropdown
                options={supervisorOptions}
                value={selectedName}
                onChange={setSelectedName}
                isClearable
                placeholder="Filter by Supervisor"
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

      <BillShow
        showModal={showModal}
        setShowModal={setShowModal}
        pdfBase64={pdfBase64}
        modalTitle={modalTitle}
      />
    </div>
  )
}

export default DriverLocation
