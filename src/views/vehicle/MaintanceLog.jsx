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

  // Fetch Maintenance Logs
  useEffect(() => {
    const fetchMaintenanceLogs = async () => {
      try {
        setLoading(true)
        const data = await maintenanceLogApi(id) // Fetch data from API
        setAllData(data) // Store the full data separately
        setFilteredData(data) // Initially, show all data
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchMaintenanceLogs()
  }, [id])

  // Search handler (Filters allData)
  const handleSearch = (query) => {
    setSearchQuery(query)

    if (!query) {
      setFilteredData(allData) // Reset to full data if search is empty
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

  // Define table columns (ONLY required fields)
  const columns = [
    { label: 'Service Date', key: 'date', sortable: true },
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
          title: 'Vehicle Maintenance Logs Report', // Dynamic title
          columns: columns,
          data: filteredData,
          fileName: 'Vehicle_Maintenanc_Logs_Report', // Dynamic file name
        }),
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () =>
        exportToExcel({
          title: 'Vehicle Maintenance Logs Report', // Dynamic title
          columns: columns,
          data: filteredData,
          fileName: 'Vehicle_Maintenanc_Logs_Report', // Dynamic file name
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

  // Creating a variable for the mapped data
  const tableData = filteredData.map((data) => ({
    date: new Date(data.date).toLocaleDateString('en-GB'), // Converts to dd-mm-yyyy
    expenseType: data.expenseType,
    vendor: data.vendor,
    description: data.description,
    amount: data.amount,
    paymentMode: data.paymentMode,
  }))

  return (
    <div>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <DateRangeFilterCredence title="Date Range" />
        <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
      </div>

      <div>
        <Table
          title="Vehicle Maintenance Logs"
          columns={columns}
          filteredData={tableData} // Using the variable here
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
