import React, { useEffect, useMemo, useState } from 'react'
import SmartPagination from '../../../components/SmartPagination'
import Table from '../../../components/Table'
import { CContainer } from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { driverTripDetails } from '../../data/drivers'
import { useQuery } from '@tanstack/react-query'
import SearchInput from '../../../components/SearchInput'
import IconDropdown from '../../../Supervisor/IconDropdown'
import usePdfExporter from '../../../customhooks/usePdfExporter'
import useExcelExporter from '../../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import { ToastContainer } from 'react-toastify'

const TripLogs = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }) // Add date range state

  const navigate = useNavigate()
  const { id } = useParams()

  const { data: DriverTripData = [], isFetching } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => driverTripDetails(id),
    staleTime: 1000 * 60 * 30,
  })

  useEffect(() => {
    let updatedData = [...DriverTripData] // Start with all vehicles

    // Filter by date range if available
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.orginalDate)
        return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate)
      })
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      updatedData = updatedData.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    setFilteredData(updatedData)
  }, [DriverTripData, dateRange, searchQuery])

  useEffect(() => {
    console.log('Driver Trip Data', DriverTripData)
    setFilteredData(DriverTripData)
  }, [DriverTripData])

  const handleViewButton = (id) => {
    console.log('View button clicked for ID:', id)
    navigate(`/SubTrips/${id}`)
  }

  const getStatusStyle = (status) => {
    return {
      display: 'inline-block',
      minWidth: '70px',
      padding: '1px 8px',
      borderRadius: '10px',
      textAlign: 'center',
      textTransform: 'capitalize',
      fontWeight: '400',
      backgroundColor:
        status === 'in-progress'
          ? '#f5a623'
          : status === 'completed'
            ? '#28a745'
            : status === 'cancelled'
              ? '#dc3545'
              : '#6c757d',
      color: 'white',
    }
  }

  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Start Location', key: 'startLocation', sortable: true },
    { label: 'End Location', key: 'endLocation', sortable: true },
    { label: 'Budget Allocated', key: 'budgetAllocated', sortable: true },
    { label: 'Spent Amount', key: 'spentAmount', sortable: true },
    { label: 'Material Type', key: 'materialType', sortable: true },
    {
      label: 'Status',
      key: 'status',
      render: (row) => <span style={getStatusStyle(row.status)}>{row.status}</span>,
    },
  ]

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Pagination: Slice the data for current page
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

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
            title: 'Driver Trips Report',
            columns,
            data: filteredData,
            fileName: 'Driver_Trips_Report',
          }),
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () => {
          exportToExcel({
            title: 'Driver Trips Report',
            columns,
            data: filteredData,
            fileName: 'Driver_Trips_Report',
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
      <ToastContainer />

      <CContainer className="px-2" fluid>
        <div className="mb-2 d-flex justify-content-between align-items-center">
          <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
        </div>

        <Table
          title="Driver Trip"
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
            setItemsPerPage(value === -1 ? filteredData.length : value)
            setCurrentPage(1)
          }}
        />
      </CContainer>
      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default TripLogs
