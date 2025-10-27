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
import usePdfExporter from '../../../customhooks/usePdfExporter'
import useExcelExporter from '../../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import IconDropdown from '../../../Supervisor/IconDropdown'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'

const DriverLocation = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
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
  } = useQuery({
    queryKey: ['attendanceLoc', dateRange.startDate, dateRange.endDate],
    queryFn: () => fetchDriverAttendanceLocation(dateRange.startDate, dateRange.endDate),
    // enabled: !!token, // only run when token exists
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

      const addressCache = {}

      const updatedData = await Promise.all(
        attendanceLocData.map(async (item) => {
          // --- START ADDRESS ---
          let startAddress = 'N/A'
          if (item.lat && item.long && item.lat !== 'N/A' && item.long !== 'N/A') {
            const startKey = `${item.lat},${item.long}`
            if (!addressCache[startKey]) {
              try {
                addressCache[startKey] = await getAddressApi(item.lat, item.long)
              } catch (err) {
                console.error('Failed to get Start address:', err)
                addressCache[startKey] = 'Address not found'
              }
            }
            startAddress = addressCache[startKey]
          }

          // --- END ADDRESS ---
          let endAddress = 'Trip In-Progress'
          if (item.endLat && item.endLong && item.endLat !== '--' && item.endLong !== '--') {
            const endKey = `${item.endLat},${item.endLong}`
            if (!addressCache[endKey]) {
              try {
                addressCache[endKey] = await getAddressApi(item.endLat, item.endLong)
              } catch (err) {
                console.error('Failed to get End address:', err)
                addressCache[endKey] = 'Address not found'
              }
            }
            endAddress = addressCache[endKey]
          }

          return {
            ...item,
            Startaddress: startAddress,
            Endaddress: endAddress,
            coordinate:
              item.lat && item.long ? `${item.lat}, ${item.long}` : 'Co-ordinates not available',
          }
        }),
      )

      // --- Apply filters ---
      let filtered = [...updatedData]

      if (selectedName?.value) {
        filtered = filtered.filter((item) => item.supervisor === selectedName.value)
      }

      // if (dateRange.startDate && dateRange.endDate) {
      //   filtered = filtered.filter((item) => {
      //     const itemDate = new Date(item.originalDate)
      //     return (
      //       itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
      //     )
      //   })
      // }

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
    { label: 'CheckIn Time', key: 'checkInTime', sortable: true },
    { label: 'CheckIn Address', key: 'Startaddress', sortable: false },
    { label: 'CheckOut Time', key: 'checkOutTime', sortable: true },
    { label: 'CheckOut Address', key: 'Endaddress', sortable: false },
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
          title: 'Driver Check In/Out Report',
          columns: columns,
          data: cleanedData,
          fileName: 'Driver_CheckIN/OUT_Report',
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
          title: 'Driver Check Report',
          columns: columns,
          data: cleanedData,
          fileName: 'Driver_CheckIN/OUT_Report',
        })
      },
    },

    {
      icon: FaPrint,
      label: 'Print Page',
      onClick: () => window.print(),
    },

    {
      icon: FaArrowUp,
      label: 'Scroll To Top',
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
  ]

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
        action="Image"
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

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </div>
  )
}

export default DriverLocation
