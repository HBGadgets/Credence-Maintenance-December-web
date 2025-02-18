import React, { useState, useEffect } from 'react'
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
} from '@coreui/react'
import IconDropdown from './IconDropdown'
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

const VehicleProfile = React.lazy(() => import('./VehicleProfile'))
const Pagination = React.lazy(() => import('../views/base/paginations/Pagination'))

const VehicleList = () => {
  const Navigate = useNavigate()

  // const columns = [
  //   { label: 'SN', key: 'sn', sortable: false },
  //   { label: 'Vehicle ID', key: 'id', sortable: true },
  //   { label: 'Make', key: 'make', sortable: true },
  //   { label: 'Year', key: 'year', sortable: true },
  //   { label: 'Model', key: 'model', sortable: true },
  //   { label: 'License Number', key: 'licenseNumber', sortable: true },
  //   { label: 'Action', key: 'action', sortable: true },
  // ]

  const columns = [
    { label: 'SN', key: 'sn', sortable: true },
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Model', key: 'model', sortable: true },
    { label: 'Category', key: 'category', sortable: true },
    { label: 'Device ID', key: 'deviceId', sortable: true },
    { label: 'Action', key: 'action', sortable: true },
  ]
  const [vehicles, setVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [open, setOpen] = useState(false)
  const [filteredLogs, setFilteredLogs] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const itemsPerPage = 10

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
        (vehicle.category && vehicle.category.toLowerCase().includes(search)) ||
        (vehicle.deviceId && vehicle.deviceId.toString().includes(search))
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
  // Export to Excel with header and footer
  const exportToExcel = async () => {
    try {
      if (!Array.isArray(filteredVehicles) || filteredVehicles.length === 0) {
        throw new Error('No data available for Excel export')
      }

      // Define some colors and formatting values
      const primaryColor = 'FF0A2D63' // Company blue (ARGB)
      const secondaryColor = 'FF6C757D' // Gray for headers
      const textColor = 'FFFFFFFF' // White text
      const borderStyle = 'thin'
      const companyName = 'Credence Tracker'
      const currentYear = new Date().getFullYear()
      const footerText = `© ${currentYear} ${companyName}`

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Vehicle List')

      // --- HEADER SECTION ---
      // Add title row
      const titleRow = worksheet.addRow([companyName])
      titleRow.font = { bold: true, size: 16, color: { argb: textColor } }
      titleRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: primaryColor },
      }
      titleRow.alignment = { horizontal: 'center' }
      // Merge cells across all 6 columns (adjust if you have a different number)
      worksheet.mergeCells(`A${titleRow.number}:F${titleRow.number}`)

      // Add a spacer row after title
      worksheet.addRow([])

      // Add header row with column titles
      const headerRow = worksheet.addRow([
        'SN',
        'Vehicle ID',
        'Make',
        'Year',
        'Model',
        'License Number',
      ])
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, size: 12, color: { argb: textColor } }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: secondaryColor },
        }
        cell.alignment = { horizontal: 'center' }
        cell.border = {
          top: { style: borderStyle },
          left: { style: borderStyle },
          bottom: { style: borderStyle },
          right: { style: borderStyle },
        }
      })

      // --- DATA SECTION ---
      // Add data rows from filteredVehicles
      filteredVehicles.forEach((vehicle, index) => {
        const row = worksheet.addRow([
          index + 1,
          vehicle.id,
          vehicle.make,
          vehicle.year,
          vehicle.model,
          vehicle.licenseNumber,
        ])
        row.eachCell((cell) => {
          cell.font = { size: 11 }
          cell.border = {
            top: { style: borderStyle },
            left: { style: borderStyle },
            bottom: { style: borderStyle },
            right: { style: borderStyle },
          }
        })
      })

      // --- FOOTER SECTION ---
      // Add a spacer row before the footer
      worksheet.addRow([])
      // Add the footer row
      const footerRow = worksheet.addRow([footerText])
      footerRow.font = { italic: true, size: 11 }
      // Align the footer text to the right
      footerRow.getCell(1).alignment = { horizontal: 'right' }
      // Merge footer cells so the footer spans across all columns (A to F here)
      worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`)

      // --- FINALIZE ---
      // Generate file buffer and trigger download
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const filename = `Vehicle_List_${new Date().toISOString().split('T')[0]}.xlsx`
      saveAs(blob, filename)
      toast.success('Excel file downloaded successfully')
    } catch (error) {
      console.error('Excel Export Error:', error)
      toast.error(error.message || 'Failed to export Excel file')
    }
  }

  // Export to PDF
  const exportToPDF = () => {
    try {
      // Validate data before proceeding
      if (!Array.isArray(currentData) || currentData.length === 0) {
        console.error('No data available for PDF export')
        return
      }

      // Configuration object for styling and layout
      const CONFIG = {
        colors: {
          primary: [10, 45, 99],
          secondary: [70, 70, 70],
          border: [220, 220, 220],
          background: [249, 250, 251],
        },
        company: {
          name: 'Credence Tracker',
          logo: { x: 15, y: 15, size: 8 },
        },
        layout: {
          margin: 16,
          lineHeight: 6,
        },
        fonts: {
          primary: 'helvetica',
        },
      }

      // Create a new jsPDF instance (landscape A4)
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      // --- Header Section ---
      // Company logo (a simple filled rectangle as placeholder)
      doc.setFillColor(...CONFIG.colors.primary)
      doc.rect(
        CONFIG.company.logo.x,
        CONFIG.company.logo.y,
        CONFIG.company.logo.size,
        CONFIG.company.logo.size,
        'F',
      )
      // Company name
      doc.setFont(CONFIG.fonts.primary, 'bold')
      doc.setFontSize(16)
      doc.text(CONFIG.company.name, 28, 21)
      // Header line
      doc.setDrawColor(...CONFIG.colors.primary)
      doc.setLineWidth(0.5)
      doc.line(CONFIG.layout.margin, 25, doc.internal.pageSize.width - CONFIG.layout.margin, 25)

      // --- Title & Date ---
      doc.setFontSize(24)
      doc.text('Vehicles Report', CONFIG.layout.margin, 35)
      const currentDate = new Date().toLocaleDateString('en-GB')
      const dateText = `Generated: ${currentDate}`
      doc.setFontSize(10)
      doc.text(
        dateText,
        doc.internal.pageSize.width - CONFIG.layout.margin - doc.getTextWidth(dateText),
        21,
      )

      // --- Table Data Preparation ---
      const tableColumns = ['SN', 'ID', 'Make', 'Year', 'Model', 'License Number']
      const tableRows = currentData.map((row, index) => [
        (currentPage - 1) * itemsPerPage + index + 1,
        row.id,
        row.make,
        row.year,
        row.model,
        row.licenseNumber,
      ])

      // --- Create Table using autoTable ---
      doc.autoTable({
        startY: 45,
        head: [tableColumns],
        body: tableRows,
        theme: 'grid',
        styles: {
          fontSize: 10,
          halign: 'center',
          lineColor: CONFIG.colors.border,
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: CONFIG.colors.primary,
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: CONFIG.colors.background,
        },
        margin: { left: CONFIG.layout.margin, right: CONFIG.layout.margin },
        didDrawPage: (data) => {
          // Add header text on subsequent pages
          if (doc.getCurrentPageInfo().pageNumber > 1) {
            doc.setFontSize(15)
            doc.setFont(CONFIG.fonts.primary, 'bold')
            doc.text('Vehicles Report', CONFIG.layout.margin, 10)
          }
        },
      })

      const addMetadata = () => {
        const metadata = [
          { label: 'User:', value: decodedToken.username || 'N/A' },
          { label: 'Group:', value: selectedGroupName || 'N/A' },
          {
            label: 'Date Range:',
            value:
              selectedFromDate && selectedToDate
                ? `${selectedFromDate} To ${selectedToDate}`
                : `${getDateRangeFromPeriod(selectedPeriod)}`,
          },
          { label: 'Vehicle:', value: selectedDeviceName || 'N/A' },
        ]

        doc.setFontSize(10)
        doc.setFont(CONFIG.fonts.primary, 'bold')

        let yPosition = 45
        const xPosition = 15
        const lineHeight = 6

        metadata.forEach((item) => {
          doc.text(`${item.label} ${item.value.toString()}`, xPosition, yPosition)
          yPosition += lineHeight
        })
      }

      // --- Footer Section ---
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        // Footer line
        doc.setDrawColor(...CONFIG.colors.border)
        doc.setLineWidth(0.5)
        doc.line(
          CONFIG.layout.margin,
          doc.internal.pageSize.height - 15,
          doc.internal.pageSize.width - CONFIG.layout.margin,
          doc.internal.pageSize.height - 15,
        )
        // Copyright text
        doc.setFontSize(9)
        doc.text(
          `© ${CONFIG.company.name}`,
          CONFIG.layout.margin,
          doc.internal.pageSize.height - 10,
        )
        // Page number
        const pageNumber = `Page ${i} of ${pageCount}`
        const pageNumberWidth = doc.getTextWidth(pageNumber)
        doc.text(
          pageNumber,
          doc.internal.pageSize.width - CONFIG.layout.margin - pageNumberWidth,
          doc.internal.pageSize.height - 10,
        )
      }

      // --- Save the PDF ---
      doc.save(`Vehicles_Report_${new Date().toISOString().split('T')[0]}.pdf`)
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('PDF Export Error:', error)
      toast.error(error.message || 'Failed to export PDF')
    }
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
      onClick: () => exportToPDF(),
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () => exportToExcel(),
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

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Vehicles</strong>
              <div className="d-flex align-items-center">
                <CFormInput
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-25 me-3"
                  style={{
                    boxShadow: searchQuery ? '0 0 8px rgba(0, 123, 255, 0.75)' : 'none',
                    borderColor: searchQuery ? '#007bff' : undefined,
                  }}
                />
              </div>
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
                        <CTableDataCell className="text-center">{row.deviceId}</CTableDataCell>
                        {/* <CTableDataCell className="text-center">{row.licenseNumber}</CTableDataCell> */}
                        <CTableDataCell className="text-center">
                          <CButton onClick={() => handleViewClick(row)} color="primary">
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

      {/* {selectedVehicle && (
        <VehicleProfile
          open={open}
          setOpen={setOpen}
          onClose={() => setOpen(false)}
          vehicle={selectedVehicle}
        />
      )} */}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </div>
      )}

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default VehicleList
