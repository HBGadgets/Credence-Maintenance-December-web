import React from 'react'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'
import { Button } from '@mui/material'
import signature from '../../Signature/signature.svg'
import IconDropdown from '../../IconDropdown'
import { FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import { FaPrint } from 'react-icons/fa'
import { FaArrowUp } from 'react-icons/fa'
import { toast } from 'react-toastify'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const AttendanceTable = ({ attendanceData }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'present':
        return 'bg-success text-white'
      case 'absent':
        return 'bg-danger text-white'
      case 'leave-pending':
        return 'bg-warning text-dark'
      case 'leave-approved':
        return 'bg-primary text-white'
      default:
        return ''
    }
  }

  const formatStatus = (status) => {
    switch (status) {
      case 'present':
        return 'Present'
      case 'absent':
        return 'Absent'
      case 'leave-pending':
        return 'Leave Pending'
      case 'leave-approved':
        return 'Leave Approved'
      default:
        return ''
    }
  }

  // Export to PDF function
  const exportToPDF = () => {
    try {
      if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
        throw new Error('No data available for PDF export')
      }

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      // Add headers
      const headers = ['Date', 'Description', 'Status']

      // Add data rows
      const data = attendanceData.map((record) => [
        record.date,
        record.description,
        formatStatus(record.status),
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
      const filename = `Attendance_List_${new Date().toISOString().split('T')[0]}.pdf`
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
      if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
        throw new Error('No data available for Excel export')
      }

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Attendance')

      // Add headers
      worksheet.addRow(['Date', 'Description', 'Status'])

      // Add data rows
      attendanceData.forEach((record) => {
        worksheet.addRow([record.date, record.description, formatStatus(record.status)])
      })

      // Save Excel file
      workbook.xlsx.writeBuffer().then((buffer) => {
        const filename = `Attendance_List_${new Date().toISOString().split('T')[0]}.xlsx`
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
    // Implement logout logic here
    console.log('Logout clicked')
  }

  // Dropdown items for export
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
    <div>
      <CTable bordered striped>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Date</CTableHeaderCell>
            <CTableHeaderCell>Description</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {attendanceData.map((record) => (
            <CTableRow key={record.id}>
              <CTableDataCell>{record.date}</CTableDataCell>
              <CTableDataCell>{record.description}</CTableDataCell>
              <CTableDataCell>
                <span className={`badge ${getStatusStyle(record.status)}`}>
                  {formatStatus(record.status)}
                </span>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <div className="d-flex justify-content-end" style={{ marginTop: '30rem' }}>
        <IconDropdown items={dropdownItems} />
      </div>
    </div>
  )
}

export default AttendanceTable
