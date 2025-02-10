import React, { useState } from 'react'
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
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CImage,
  CForm,
  CFormInput,
  CFormLabel,
  CTab,
  CTabList,
  CTabPanel,
  CTabContent,
  CTabs,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { Edit, Eye, Trash2 } from 'lucide-react'
import { compaines as initialcompaines } from '../company-details/data/compaines' // Import compaines data
import { compaines } from '../company-details/data/compaines' // Ensure this import is correct
// import { trips } from '../compainesExpert/data/trips' // Ensure this import is correct
// import { expenses } from '../compainesExpert/data/expenses' // Import expenses
// import { salaries } from '../compainesExpert/data/salaries' // Import salaries
// import TripsTable from '../compainesExpert/components/trips/TripsTable' // Ensure this import is correct
// import ExpensesTable from '../compainesExpert/components/expenses/ExpensesTable' // Ensure this import is correct
// import SalarySlipTable from '../compainesExpert/components/salary/SalarySlipTable' // Import the SalarySlipTable component
// import AttendanceSection from '../compainesExpert/components/attendance/AttendanceSection' // Import AttendanceSection component
import { debounce } from 'lodash'
import { Select } from '@mui/material'
import { IoPerson } from 'react-icons/io5'
import { IoCall } from 'react-icons/io5'
import { MdEmail } from 'react-icons/md'
import { IoDocumentText } from 'react-icons/io5'
import { FaAddressCard } from 'react-icons/fa'
import { RiLockPasswordFill } from 'react-icons/ri'
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
import IconDropdown from '../../../components/IconDropdown'
import { useNavigate } from 'react-router-dom'

const compainesExp = ({ setselectedCompanyId }) => {
  const Navigate = useNavigate()
  const columns = [
    { label: 'SN', key: 'sn', sortable: false },
    { label: 'Company Name', key: 'name', sortable: true },
    { label: 'Contact', key: 'contact', sortable: true },
    { label: 'Address', key: 'address', sortable: true },
    { label: 'View Profile', key: 'profile', sortable: true },
    { label: 'Action', key: 'action', sortable: true },
  ]
  // const columns = ['Comapny Name', 'Contact', 'Address', 'Profile']
  const [compaines, setcompaines] = useState(initialcompaines) // Use state for the compaines list
  const [selectedCompany, setselectedCompany] = useState(null)
  const [open, setOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [newcompaines, setNewcompaines] = useState({
    name: '',
    contactNumber: '',
    address: '',
    gstNumber: '',
    password: '',
    // profileImage: null,  // State to store the selected image
  })
  const [editModalOpen, setEditModalOpen] = useState(false) // State for edit modal
  const [compainesToEdit, setcompainesToEdit] = useState(null) // State for the compaines being edited

  const [data, setData] = useState(compaines) // Assuming compaines are available
  const [filter, setFilter] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }) // Sorting configuration

  // Logic for Filter
  const debouncedFilterChange = debounce((value) => {
    const filteredData = compaines.filter((row) =>
      row.name.toLowerCase().includes(value.toLowerCase()),
    )
    setData(filteredData)
  }, 300)

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
    debouncedFilterChange(e.target.value)
  }

  const handleSort = (key) => {
    if (!columns.find((column) => column.key === key && column.sortable)) return // Prevent sorting on non-sortable columns

    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })

    const sorted = [...filteredVehicles].sort((a, b) => {
      if (['sn', 'name', 'contact', 'address'].includes(key)) {
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

  const handleViewClick = (compaines) => {
    setselectedCompany(compaines)
    setOpen(true)
    Navigate(`${compaines.id}`)
  } 

  const handleAddcompaines = () => {
    // Add new compaines logic here (e.g., send to API or update state)
    setcompaines([...compaines, newcompaines])
    setAddModalOpen(false)
    alert('New compaines added!')
  }

  const handleDeletecompaines = (compainesId) => {
    // Delete the compaines by filtering it out from the state
    setcompaines(compaines.filter((compaines) => compaines.id !== compainesId))
  }

  const handleEditcompaines = (compaines) => {
    setcompainesToEdit(compaines)
    setEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    setcompaines(
      compaines.map((compaines) =>
        compaines.id === compainesToEdit.id ? compainesToEdit : compaines,
      ),
    )
    setEditModalOpen(false)
    alert('compaines updated successfully!')
  }
  const exportToExcel = async () => {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No data available for Excel export')
      }

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Companies List')

      // Add headers
      worksheet.addRow(columns.map((col) => col.label))

      // Add data rows
      data.forEach((company, index) => {
        worksheet.addRow([
          index + 1,
          company.name,
          company.contactNumber,
          company.address,
          company.gstNumber,
        ])
      })

      // Generate and save file
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const filename = `Companies_List_${new Date().toISOString().split('T')[0]}.xlsx`
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
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No data available for PDF export')
      }

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      // Add headers
      const headers = columns.map((col) => col.label)

      // Add data rows
      const pdfData = data.map((company, index) => [
        index + 1,
        company.name,
        company.contactNumber,
        company.address,
        company.gstNumber,
      ])

      // Generate table
      doc.autoTable({
        head: [headers],
        body: pdfData,
        startY: 20,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [10, 45, 99], textColor: 255, fontStyle: 'bold' },
      })

      // Save PDF
      const filename = `Companies_List_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(filename)
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('PDF Export Error:', error)
      toast.error(error.message || 'Failed to export PDF')
    }
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
    <>
      <CRow>
        <div>
          {' '}
          <CButton color="primary" className="float-end mb-2" onClick={() => setAddModalOpen(true)}>
            Add Company
          </CButton>
        </div>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Compaines List</strong>
              <CFormInput
                type="text"
                placeholder="Search Company..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-25"
                style={{
                  boxShadow: filter ? '0 0 8px rgba(0, 123, 255, 0.75)' : 'none',
                  borderColor: filter ? '#007bff' : undefined,
                }}
              />
            </CCardHeader>

            <CCardBody>
              {data.length === 0 ? (
                <p className="text-center">No compaines available.</p>
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
                    {data.map((compaines, index) => (
                      <CTableRow key={compaines.id}>
                        <CTableDataCell className="text-center">{index + 1}</CTableDataCell>{' '}
                        {/* Serial Number */}
                        <CTableDataCell className="text-center">{compaines.name}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {compaines.contactNumber}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{compaines.address}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            color="primary"
                            size="sm"
                            onClick={() => handleViewClick(compaines)}
                            className="text-center"
                          >
                            <Eye className="me-2" size={16} />
                            View Profile
                          </CButton>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            color="warning"
                            size="sm"
                            onClick={() => handleEditcompaines(compaines)}
                          >
                            <Edit size={16} /> {/* Edit Icon */}
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => handleDeletecompaines(compaines.id)}
                          >
                            <Trash2 size={16} /> {/* Delete Icon */}
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

      {/* Edit compaines Modal */}
      {editModalOpen && compainesToEdit && (
        <CModal alignment="center" visible={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <CModalHeader>
            <CModalTitle>Edit compaines</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <div className="mb-2">
                <CFormLabel>Name</CFormLabel>
                <CFormInput
                  type="text"
                  value={compainesToEdit.name}
                  onChange={(e) => setcompainesToEdit({ ...compainesToEdit, name: e.target.value })}
                />
              </div>
              <div className="mb-2">
                <CFormLabel>Contact Number</CFormLabel>
                <CFormInput
                  type="text"
                  value={compainesToEdit.contactNumber}
                  onChange={(e) =>
                    setcompainesToEdit({ ...compainesToEdit, contactNumber: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <CFormLabel>Address</CFormLabel>
                <CFormInput
                  type="text"
                  value={compainesToEdit.address}
                  onChange={(e) =>
                    setcompainesToEdit({ ...compainesToEdit, address: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <CFormLabel>GST Number</CFormLabel>
                <CFormInput
                  type="text"
                  value={compainesToEdit.gstNumber}
                  onChange={(e) =>
                    setcompainesToEdit({ ...compainesToEdit, gstNumber: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <CFormLabel>Password</CFormLabel>
                <CFormInput
                  type="password"
                  value={compainesToEdit.password}
                  onChange={(e) =>
                    setcompainesToEdit({ ...compainesToEdit, password: e.target.value })
                  }
                />
              </div>
              <CButton color="primary" onClick={handleSaveEdit}>
                Save Changes
              </CButton>
            </CForm>
          </CModalBody>
        </CModal>
      )}

      {/* Add compaines Modal */}
      <CModal
        alignment="center"
        visible={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Add Companies</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm style={{ width: '100%' }}>
            <div
              className="flex-wrap gap-2"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
            >
              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <IoPerson style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    name="Enter Name"
                    placeholder="Enter Name"
                    value={newcompaines.name}
                    onChange={(e) => setNewcompaines({ ...newcompaines, name: e.target.value })}
                  />
                </CInputGroup>
              </CCol>

              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <IoCall style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    placeholder="Enter Contact No"
                    value={newcompaines.contactNumber}
                    // style={{ flex: 1 }}
                    onChange={(e) =>
                      setNewcompaines({ ...newcompaines, contactNumber: e.target.value })
                    }
                  />
                </CInputGroup>
              </CCol>
            </div>
            <div
              className="flex-wrap gap-2"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <FaAddressCard style={{ fontSize: '20px', color: 'gray' }} />
                  </CInputGroupText>

                  <CFormInput
                    type="text"
                    placeholder="Enter Address"
                    value={newcompaines.address}
                    onChange={(e) => setNewcompaines({ ...newcompaines, address: e.target.value })}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <IoDocumentText style={{ fontSize: '20px', color: 'gray' }} />
                  </CInputGroupText>

                  <CFormInput
                    type="text"
                    placeholder="Enter GST Number"
                    value={newcompaines.gstNumber}
                    onChange={(e) =>
                      setNewcompaines({ ...newcompaines, gstNumber: e.target.value })
                    }
                  />
                </CInputGroup>
              </CCol>
              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <RiLockPasswordFill style={{ fontSize: '20px', color: 'gray' }} />
                  </CInputGroupText>

                  <CFormInput
                    type="password"
                    placeholder="Enter Password"
                    value={newcompaines.password}
                    onChange={(e) => setNewcompaines({ ...newcompaines, password: e.target.value })}
                  />
                </CInputGroup>
              </CCol>
            </div>
            <div className="text-end mt-3">
              <CButton color="primary" onClick={() => handleAddcompaines(newcompaines)}>
                Submit
              </CButton>
            </div>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

export default compainesExp
