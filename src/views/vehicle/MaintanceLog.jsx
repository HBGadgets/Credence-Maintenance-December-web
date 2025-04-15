import React, { useState, useEffect } from 'react'
import { maintenanceLogApi } from './data/VehicleListData'
import { useParams } from 'react-router-dom'
import SmartPagination from '../components/SmartPagination'
import DateRangeFilterCredence from '../../components/DateRangeFilterCredence'
import SearchInput from '../components/SearchInput'
import Table from '../components/Table'
import Loader from '../../components/Loader/Loader'
import Page404 from '../pages/page404/Page404'
import usePdfExporter from '../customhooks/usePdfExporter'
import useExcelExporter from '../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import IconDropdown from '../Supervisor/IconDropdown'

const MaintenanceLog = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const { id } = useParams()

  const [allData, setAllData] = useState([]) // Store full API data
  const [filteredData, setFilteredData] = useState([]) // Store searched/filtered data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  // ✅ Fetch Maintenance Logs
  useEffect(() => {
    const fetchMaintenanceLogs = async () => {
      try {
        setLoading(true)
        const data = await maintenanceLogApi(id)
        setAllData(data)
        setFilteredData(data)
      } catch (err) {
        // If the error is a network error
        if (!err.response) {
          setError('Network Error') // Internet/server unreachable
        } else if (err.response.status === 500) {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchMaintenanceLogs()
  }, [id])

  // ✅ Search handler (Filters allData)
  const handleSearch = (query) => {
    setSearchQuery(query)

    if (!query) {
      applyFilters() // Reset to full data if search is empty
      return
    }

    const filtered = allData.filter(
      (item) =>
        item.expenseType.toLowerCase().includes(query.toLowerCase()) ||
        item.vendor.toLowerCase().includes(query.toLowerCase()) ||
        item.amount.toString().includes(query) ||
        item.paymentMode.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredData(filtered)
  }

  // Handle Date Range Filter (Now Fully Fixed)
  const handleDateRangeChange = (start, end) => {
    console.log('Date range changed:', { start, end })

    setStartDate(start)
    setEndDate(end)

    applyFilters(start, end, searchQuery)
  }

  // Apply Filtering Based on Date Range & Search
  const applyFilters = (start = startDate, end = endDate, query = searchQuery) => {
    let filtered = [...allData]

    // Apply Date Filter
    if (start && end) {
      const startMillis = new Date(start).setHours(0, 0, 0, 0)
      const endMillis = new Date(end).setHours(23, 59, 59, 999)

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date).setHours(0, 0, 0, 0)
        return itemDate >= startMillis && itemDate <= endMillis
      })
    }

    // Apply Search Filter
    if (query) {
      filtered = filtered.filter(
        (item) =>
          item.driverName.toLowerCase().includes(query.toLocaleLowerCase()) ||
          item.expenseType.toLowerCase().includes(query.toLowerCase()) ||
          item.vendor.toLowerCase().includes(query.toLowerCase()) ||
          item.amount.toString().includes(query) ||
          item.paymentMode.toLowerCase().includes(query.toLowerCase()),
      )
    }

    setFilteredData(filtered)
  }

  // Define table columns
  const columns = [
    { label: 'Service Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Expense Type', key: 'expenseType', sortable: true },
    { label: 'Vendor', key: 'vendor', sortable: true },
    { label: 'Description', key: 'description', sortable: true },
    { label: 'Amount', key: 'amount', sortable: true },
    { label: 'Payment Mode', key: 'paymentMode', sortable: true },
  ]

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Dropdown items for export
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () =>
        exportToPDF({
          title: 'Vehicle Maintenance Logs Report',
          columns: columns,
          data: filteredData,
          fileName: 'Vehicle_Maintenance_Logs_Report',
        }),
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () =>
        exportToExcel({
          title: 'Vehicle Maintenance Logs Report',
          columns: columns,
          data: filteredData,
          fileName: 'Vehicle_Maintenance_Logs_Report',
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
      onClick: () => handleLogout(),
    },
    {
      icon: FaArrowUp,
      label: 'Scroll To Top',
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
  ]

  if (loading) return <Loader />
  if (error) return <Page404 />

  const handleViewButton = (id) => {
    console.log('Viewing Maintenance Log:', id)
  }

  const getPaymentBadge = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'upi':
        return 'badge bg-secondary' // UPI = secondary
      case 'cash':
        return 'badge bg-success' // Cash = success
      case 'card':
        return 'badge bg-warning' // Card = warning
      default:
        return 'badge bg-primary' // Default
    }
  }

  const tableData = filteredData.map((data) => ({
    date: new Date(data.date).toLocaleDateString('en-GB'),
    driverName: data.driverName,
    expenseType: data.expenseType,
    vendor: data.vendor,
    description: data.description,
    amount: data.amount,
    paymentMode: (
      <span className={getPaymentBadge(data.paymentMode)}>
        {(data.paymentMode || 'N/A').charAt(0).toUpperCase() + (data.paymentMode || 'N/A').slice(1)}
      </span>
    ),
  }))

  return (
    <div>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        {/*  Date Range Picker with working handler */}
        <DateRangeFilterCredence onDateRangeChange={handleDateRangeChange} title="Date Range" />
        <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
      </div>

      <div>
        <Table
          title="Vehicle Maintenance Logs"
          columns={columns}
          filteredData={tableData}
          setFilteredData={setFilteredData}
          viewButton={true}
          handleViewButton={handleViewButton}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />

        <SmartPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value)
            setCurrentPage(1)
          }}
        />
      </div>
      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </div>
  )
}

export default MaintenanceLog
