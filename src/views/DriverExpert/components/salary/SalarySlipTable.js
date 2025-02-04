import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { ChevronRight } from 'lucide-react'
import SalaryDetail from './SalaryCard'
import DateRangeFilter from '../../common/DateRangeFilter'
import IconDropdown from '../../IconDropdown'
import { FaRegFilePdf, FaPrint, FaArrowUp } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import { toast } from 'react-toastify'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const SalarySlipTable = ({ salaries }) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [open, setOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Number of items per page in modal table

  const handleOpen = () => {
    setCurrentPage(1) // Reset to the first page when opening modal
    setOpen(true)
  }

  // Filter salaries based on the date range
  const filteredSalaries = salaries.filter((salary) => {
    if (!startDate || !endDate) return true
    const date = new Date(salary.month)
    return date >= new Date(startDate) && date <= new Date(endDate)
  })

  // Pagination logic for modal table
  const totalPages = Math.ceil(filteredSalaries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentSalaries = filteredSalaries.slice(startIndex, startIndex + itemsPerPage)

  // Salary content for each salary slip
  const SalaryContent = ({ data }) => (
    <div className="space-y-4">
      {data.map((salary) => (
        <CCard key={salary.id} className="mb-4">
          <CCardHeader>
            Salary Slip - {new Date(salary.month).toLocaleDateString('en-US', {})}
          </CCardHeader>
          <CCardBody>
            <div className="space-y-2">
              <SalaryDetail label="Basic Pay" amount={salary.basicPay} />
              <SalaryDetail label="Overtime" amount={salary.overtime} className="text-success" />
              <SalaryDetail
                label="Incentives"
                amount={salary.incentives}
                className="text-success"
              />
              <SalaryDetail label="Deductions" amount={salary.deductions} className="text-danger" />
              <div className="border-top pt-2 mt-2 mt-0">
                <SalaryDetail
                  label="Net Pay"
                  amount={salary.netPay}
                  className="text-lg font-weight-bold"
                />
              </div>
            </div>
          </CCardBody>
        </CCard>
      ))}
    </div>
  )

  // Export to PDF function
  const exportToPDF = () => {
    try {
      if (!Array.isArray(filteredSalaries) || filteredSalaries.length === 0) {
        throw new Error('No data available for PDF export')
      }

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      // Add headers
      const headers = ['Month', 'Basic Pay', 'Overtime', 'Incentives', 'Deductions', 'Net Pay']

      // Add data rows
      const data = filteredSalaries.map((salary) => [
        new Date(salary.month).toLocaleDateString(),
        salary.basicPay,
        salary.overtime,
        salary.incentives,
        salary.deductions,
        salary.netPay,
      ])

      // Generate table
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 20,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [10, 45, 99], textColor: 255, fontStyle: 'bold' },
      })

      // Save PDF
      const filename = `Salary_Slip_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(filename)
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('PDF Export Error:', error)
      toast.error(error.message || 'Failed to export PDF')
    }
  }

  // Export to Excel function
  const exportToExcel = () => {
    try {
      if (!Array.isArray(filteredSalaries) || filteredSalaries.length === 0) {
        throw new Error('No data available for Excel export')
      }

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Salaries')

      // Add headers
      worksheet.addRow(['Month', 'Basic Pay', 'Overtime', 'Incentives', 'Deductions', 'Net Pay'])

      // Add data rows
      filteredSalaries.forEach((salary) => {
        worksheet.addRow([
          new Date(salary.month).toLocaleDateString(),
          salary.basicPay,
          salary.overtime,
          salary.incentives,
          salary.deductions,
          salary.netPay,
        ])
      })

      // Save Excel file
      workbook.xlsx.writeBuffer().then((buffer) => {
        const filename = `Salary_Slip_${new Date().toISOString().split('T')[0]}.xlsx`
        saveAs(new Blob([buffer]), filename)
        toast.success('Excel file downloaded successfully')
      })
    } catch (error) {
      console.error('Excel Export Error:', error)
      toast.error(error.message || 'Failed to export Excel')
    }
  }

  // Handle logout function
  const handleLogout = () => {
    console.log('Logout clicked')
  }

  // Dropdown items for export
  const dropdownItems = [
    { icon: FaRegFilePdf, label: 'Download PDF', onClick: exportToPDF },
    { icon: PiMicrosoftExcelLogo, label: 'Download Excel', onClick: exportToExcel },
    { icon: FaPrint, label: 'Print Page', onClick: () => window.print() },
    { icon: HiOutlineLogout, label: 'Logout', onClick: handleLogout },
    {
      icon: FaArrowUp,
      label: 'Scroll To Top',
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
  ]

  return (
    <div>
      <SalaryContent data={filteredSalaries.slice(0, 2)} />
      <div className="d-flex justify-content-end">
        <CButton color="secondary" className="m-1" onClick={handleOpen}>
          View More
        </CButton>
      </div>

      <CModal
        alignment="center"
        scrollable
        visible={open}
        onClose={() => setOpen(false)}
        fullscreen
      >
        <CModalHeader>
          <CModalTitle>All Salary Slips</CModalTitle>
        </CModalHeader>
        <CModalBody className="d-flex flex-column gap-3">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <SalaryContent data={currentSalaries} />
          <IconDropdown items={dropdownItems} />
        </CModalBody>
      </CModal>
    </div>
  )
}

export default SalarySlipTable
