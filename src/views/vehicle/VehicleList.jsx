import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { cilSearch } from '@coreui/icons'
import { CIcon } from '@coreui/icons-react'
// import { vehicles } from '../views/vehicle/data/data'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import IconDropdown from '../../components/IconDropdown'
import { FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import { FaPrint } from 'react-icons/fa'
import { FaArrowUp } from 'react-icons/fa'
import { toast } from 'react-toastify'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { auto } from '@popperjs/core'
import axios from 'axios'
import usePdfExporter from '../customhooks/usePdfExporter'
import useExcelExporter from '../customhooks/useExcelExporter'

const VehicleProfile = React.lazy(() => import('./VehicleProfile'))
const Pagination = React.lazy(() => import('../paginations/Pagination'))

const VehicleList = () => {
  const Navigate = useNavigate()

  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()

  const columns = [
    { label: 'SN', key: 'sn', sortable: true },
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Model', key: 'model', sortable: true },
    { label: 'Category', key: 'category', sortable: true },
    { label: 'View', key: 'view', sortable: true },
  ]

  const [vehicles, setVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [open, setOpen] = useState(false)
  const [filteredLogs, setFilteredLogs] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  // const itemsPerPage = 10
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/credence`)
      console.log('devices from credence', response.data)
      setVehicles(response.data.devices)
      setFilteredVehicles(response.data.devices)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  useEffect(() => {
    if (!Array.isArray(vehicles)) {
      console.error('Vehicles is not an array:', vehicles)
      setFilteredVehicles([])
      return
    }

    const filtered = vehicles.filter((vehicle) => {
      const search = searchQuery.toLowerCase().trim()

      return (
        (vehicle.name && vehicle.name.toLowerCase().includes(search)) ||
        (vehicle.model && vehicle.model.toLowerCase().includes(search)) ||
        (vehicle.category && vehicle.category.toLowerCase().includes(search))
      )
    })

    console.log('Filtered Vehicles:', filtered)
    setFilteredVehicles(filtered)
    setCurrentPage(1)
  }, [searchQuery, vehicles])

  const handleSort = (key) => {
    if (!columns.find((column) => column.key === key && column.sortable)) return

    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })

    const sorted = [...filteredVehicles].sort((a, b) => {
      if (key === 'sn') {
        const aIndex = vehicles.indexOf(a)
        const bIndex = vehicles.indexOf(b)
        return direction === 'asc' ? aIndex - bIndex : bIndex - aIndex
      }
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })

    setFilteredVehicles(sorted)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼'
    }
    return '↕'
  }

  const handleViewClick = (vehicle) => {
    setSelectedVehicle(vehicle)
    setFilteredLogs(vehicle.maintenanceLogs)
    setOpen(true)
    Navigate(`/VehicleProfile/${vehicle._id}`)
  }

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = filteredVehicles.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Export to Excel

  const handleDownload1 = () => {
    exportToExcel({
      title: 'Vehicle Report',
      columns: [
        { label: 'SN', key: 'sn' },
        { label: 'Name', key: 'name' },
        { label: 'Model', key: 'model' },
        { label: 'Category', key: 'category' },
        // { label: 'View', key: 'view' },
      ],
      data: vehicles,
      metaData: {
        GeneratedBy: 'Admin',
        // 'Date Range': '01/01/2024 - 01/03/2024',
        'Generated On': new Date().toLocaleDateString(),
      },
      fileName: 'Vehicle_Report',
    })
  }

  // Export to PDF
  const handleDownload = () => {
    exportToPDF({
      title: 'Vehicle Report',
      columns: [
        { label: 'SN', key: 'sn', sortable: true },
        { label: 'Name', key: 'name', sortable: true },
        { label: 'Model', key: 'model', sortable: true },
        { label: 'Category', key: 'category', sortable: true },
        { label: 'View', key: 'view', sortable: true },
      ],
      data: vehicles,
      metaData: {
        User: 'Admin',
        // 'Date Range': '01/01/2024 - 01/03/2024',
        'Generated On': new Date().toLocaleDateString(),
      },
      fileName: 'Vehicles_Report',
    })
  }

  // Dummy logout function; replace with your actual logout logic
  const handleLogout = () => {
    toast.info('Logged out')
    // Add your logout logic here
  }

  // Dropdown items for export and other actions
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () => handleDownload(),
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () => handleDownload1(),
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

  const [nameFilter, setNameFilter] = useState(null)
  const [modelFilter, setModelFilter] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [filteredOptions, setFilteredOptions] = useState({ names: [], models: [], categories: [] })

  useEffect(() => {
    if (!Array.isArray(vehicles)) return

    const uniqueNames = [...new Set(vehicles.map((v) => v.name))].map((name) => ({
      label: name,
      value: name,
    }))
    const uniqueModels = [...new Set(vehicles.map((v) => v.model))].map((model) => ({
      label: model,
      value: model,
    }))
    const uniqueCategories = [...new Set(vehicles.map((v) => v.category))].map((category) => ({
      label: category,
      value: category,
    }))

    setFilteredOptions({
      names: uniqueNames,
      models: uniqueModels,
      categories: uniqueCategories,
    })
  }, [vehicles])
  useEffect(() => {
    let filtered = vehicles

    if (nameFilter) {
      filtered = filtered.filter((v) => v.name === nameFilter.value)
    }
    if (modelFilter) {
      filtered = filtered.filter((v) => v.model === modelFilter.value)
    }
    if (categoryFilter) {
      filtered = filtered.filter((v) => v.category === categoryFilter.value)
    }

    setFilteredVehicles(filtered)
  }, [nameFilter, modelFilter, categoryFilter, vehicles])

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <CRow className="">
          {/* Name Filter */}
          <CCol style={{ width: '15rem', paddingRight: '0rem' }}>
            <Select
              options={filteredOptions.names}
              value={nameFilter}
              onChange={setNameFilter}
              isClearable
              placeholder="Filter by Name..."
            />
          </CCol>

          {/* Model Filter */}
          <CCol style={{ width: '15rem', paddingRight: '0rem' }}>
            <Select
              options={filteredOptions.models}
              value={modelFilter}
              onChange={setModelFilter}
              isClearable
              placeholder="Filter by Model..."
            />
          </CCol>

          {/* Category Filter */}
          <CCol style={{ width: '15rem' }}>
            <Select
              options={filteredOptions.categories}
              value={categoryFilter}
              onChange={setCategoryFilter}
              isClearable
              placeholder="Filter by Category..."
            />
          </CCol>
        </CRow>

        <CInputGroup className="w-25 ">
          <CInputGroupText>
            <CIcon icon={cilSearch} />
          </CInputGroupText>
          <CFormInput
            type="text"
            placeholder="Search Here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CInputGroup>
      </div>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Vehicles</strong>
            </CCardHeader>
            <CCardBody>
              {filteredVehicles.length === 0 ? (
                <p className="text-center">No vehicles found.</p>
              ) : (
                <CTable striped hover responsive bordered>
                  <CTableHead>
                    <CTableRow>
                      {columns.map((column, index) => (
                        <CTableHeaderCell
                          key={index}
                          className="text-center"
                          onClick={() => column.sortable && handleSort(column.key)}
                          style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                        >
                          {column.label} {column.sortable && getSortIcon(column.key)}
                        </CTableHeaderCell>
                      ))}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentData.map((row, rowIndex) => (
                      <CTableRow key={rowIndex}>
                        <CTableDataCell className="text-center">
                          {(currentPage - 1) * itemsPerPage + rowIndex + 1}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{row.name}</CTableDataCell>
                        <CTableDataCell className="text-center">{row.model}</CTableDataCell>
                        <CTableDataCell className="text-center">{row.category}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            onClick={() => handleViewClick(row)}
                            style={{ backgroundColor: `rgb(10, 45, 99)`, color: 'white' }}
                          >
                            View
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Pagination */}
      {/* {totalPages > 1 && ( */}
      <div className="d-flex justify-content-center">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          handleItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
      {/* )} */}

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default VehicleList
