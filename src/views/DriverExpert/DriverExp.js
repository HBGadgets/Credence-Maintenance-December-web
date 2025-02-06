import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaUserCircle } from 'react-icons/fa';
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
  CModalFooter,
} from '@coreui/react'
import { Edit, Eye, Trash2 } from 'lucide-react'
import { trips } from '../DriverExpert/data/trips'
import { expenses } from '../DriverExpert/data/expenses'
import { salaries } from '../DriverExpert/data/salaries'
import TripsTable from '../DriverExpert/components/trips/TripsTable'
import ExpensesTable from '../DriverExpert/components/expenses/ExpensesTable'
import SalarySlipTable from '../DriverExpert/components/salary/SalarySlipTable'
import AttendanceSection from '../DriverExpert/components/attendance/AttendanceSection'
import { debounce } from 'lodash'
import { Select } from '@mui/material'
import { IoPerson } from 'react-icons/io5'
import { IoCall } from 'react-icons/io5'
import { MdEmail } from 'react-icons/md'
import { IoDocumentText } from 'react-icons/io5'
import { RiLockPasswordFill } from 'react-icons/ri'
import { AiFillPicture } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DocumentLocker from './components/documents/DocumentLocker'
import Cookie from 'js-cookie'
import IconDropdown from '../../components/IconDropdown'

import { FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import { FaPrint } from 'react-icons/fa'
import { FaArrowUp } from 'react-icons/fa'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const DriversExp = () => {
  const columns = ['Name', 'Contact', 'Email', 'Profile']
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [open, setOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [newDriver, setNewDriver] = useState({
    name: '',
    contactNumber: '',
    email: '',
    licenseNumber: '',
    aadharNumber: '',
    password: '',
  })
  const [profileImage, setProfileImage] = useState(null)
  const [licenseImage, setLicenseImage] = useState(null)
  const [aadharImage, setAadharImage] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [driverToEdit, setDriverToEdit] = useState(null)
  const [data, setData] = useState(drivers)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [driverToDelete, setDriverToDelete] = useState(null)
  const [loading, setLoading] = useState(false)

  const itemsPerPage = 10

  // Fetch drivers from the API
  const refreshDrivers = () => {
    // const token = Cookie.get('crdnsToken')
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVydmlzb3IxIiwiaWQiOiI2Nzk3N2I2YmEzM2NjNGE5MzBhODhkZDYiLCJ1c2VycyI6dHJ1ZSwic3VwZXJhZG1pbiI6ZmFsc2UsInVzZXIiOnsiX2lkIjoiNjc5NzdiNmJhMzNjYzRhOTMwYTg4ZGQ2IiwiZW1haWwiOiIiLCJwYXNzd29yZCI6ImEzOGJmZmU0Y2QwZjM5MmM2ZDMzMGI0MmQ1NmVmYjAwOmYxMzAyODRjOThiNzcyNTk1MmMwYTFiZThhNGUyMGMyIiwidXNlcm5hbWUiOiJzdXBlcnZpc29yMSIsIm1vYmlsZSI6IjgwMDc1MzcwNDQiLCJncm91cHNBc3NpZ25lZCI6WyI2Nzk3Nzk5YWEzM2NjNGE5MzBhNzlmNDEiXSwiY3JlYXRlZEJ5IjoiNjc5Nzc5Y2NhMzNjYzRhOTMwYTdiOTNkIiwic3RhdHVzIjoiZmFsc2UiLCJub3RpZmljYXRpb24iOnRydWUsImRldmljZXMiOnRydWUsImRyaXZlciI6dHJ1ZSwiZ3JvdXBzIjp0cnVlLCJjYXRlZ29yeSI6ZmFsc2UsIm1vZGVsIjpmYWxzZSwidXNlcnMiOnRydWUsInJlcG9ydCI6ZmFsc2UsInN0b3AiOnRydWUsInRyYXZlbCI6dHJ1ZSwiZ2VvZmVuY2UiOnRydWUsImdlb2ZlbmNlUmVwb3J0Ijp0cnVlLCJtYWludGVuYW5jZSI6dHJ1ZSwicHJlZmVyZW5jZXMiOmZhbHNlLCJkaXN0YW5jZSI6dHJ1ZSwiaGlzdG9yeSI6dHJ1ZSwic2Vuc29yIjp0cnVlLCJpZGxlIjp0cnVlLCJhbGVydHMiOnRydWUsInZlaGljbGUiOnRydWUsImRldmljZWxpbWl0IjpmYWxzZSwiZW50cmllc0NvdW50IjowLCJfX3YiOjB9LCJpYXQiOjE3Mzc5ODEyOTR9.29lMWplx4W5l2Ca-bMFh5K21tU1e9RaMveAt617rHZY'
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/drivers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDrivers(response.data)
      })
      .catch((error) => {
        console.error('Error fetching drivers:', error)
      })
  }

  useEffect(() => {
    refreshDrivers()
  }, [])

  // Handle file input changes
  const handleFileChange = (e, setFileFunction) => {
    const file = e.target.files[0]
    if (file) {
      setFileFunction(file)
    }
  }

  const handleDelete = () => {
    if (driverToDelete) {
      handleDeleteDriver(driverToDelete) // Call the delete function
    }
    setShowDeleteModal(false) // Close the modal
  }

  const handleDeleteConfirmation = (driverId) => {
    setDriverToDelete(driverId) // Set the driver ID to delete
    setShowDeleteModal(true) // Show the confirmation modal
  }

  // Handle adding a new driver
  const handleAddDriver = async () => {
    if (loading) return

    setLoading(true)

    const formData = new FormData()
    formData.append('name', newDriver.name)
    formData.append('contactNumber', newDriver.contactNumber)
    formData.append('email', newDriver.email)
    formData.append('password', newDriver.password)
    formData.append('licenseNumber', newDriver.licenseNumber)
    formData.append('aadharNumber', newDriver.aadharNumber)

    if (profileImage) formData.append('profileImage', profileImage)
    if (licenseImage) formData.append('licenseImage', licenseImage)
    if (aadharImage) formData.append('aadharImage', aadharImage)

    try {
      // const token = Cookie.get('crdnsToken')
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVydmlzb3IxIiwiaWQiOiI2Nzk3N2I2YmEzM2NjNGE5MzBhODhkZDYiLCJ1c2VycyI6dHJ1ZSwic3VwZXJhZG1pbiI6ZmFsc2UsInVzZXIiOnsiX2lkIjoiNjc5NzdiNmJhMzNjYzRhOTMwYTg4ZGQ2IiwiZW1haWwiOiIiLCJwYXNzd29yZCI6ImEzOGJmZmU0Y2QwZjM5MmM2ZDMzMGI0MmQ1NmVmYjAwOmYxMzAyODRjOThiNzcyNTk1MmMwYTFiZThhNGUyMGMyIiwidXNlcm5hbWUiOiJzdXBlcnZpc29yMSIsIm1vYmlsZSI6IjgwMDc1MzcwNDQiLCJncm91cHNBc3NpZ25lZCI6WyI2Nzk3Nzk5YWEzM2NjNGE5MzBhNzlmNDEiXSwiY3JlYXRlZEJ5IjoiNjc5Nzc5Y2NhMzNjYzRhOTMwYTdiOTNkIiwic3RhdHVzIjoiZmFsc2UiLCJub3RpZmljYXRpb24iOnRydWUsImRldmljZXMiOnRydWUsImRyaXZlciI6dHJ1ZSwiZ3JvdXBzIjp0cnVlLCJjYXRlZ29yeSI6ZmFsc2UsIm1vZGVsIjpmYWxzZSwidXNlcnMiOnRydWUsInJlcG9ydCI6ZmFsc2UsInN0b3AiOnRydWUsInRyYXZlbCI6dHJ1ZSwiZ2VvZmVuY2UiOnRydWUsImdlb2ZlbmNlUmVwb3J0Ijp0cnVlLCJtYWludGVuYW5jZSI6dHJ1ZSwicHJlZmVyZW5jZXMiOmZhbHNlLCJkaXN0YW5jZSI6dHJ1ZSwiaGlzdG9yeSI6dHJ1ZSwic2Vuc29yIjp0cnVlLCJpZGxlIjp0cnVlLCJhbGVydHMiOnRydWUsInZlaGljbGUiOnRydWUsImRldmljZWxpbWl0IjpmYWxzZSwiZW50cmllc0NvdW50IjowLCJfX3YiOjB9LCJpYXQiOjE3Mzc5ODEyOTR9.29lMWplx4W5l2Ca-bMFh5K21tU1e9RaMveAt617rHZY'
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/drivers`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      toast.success('Driver added successfully!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })

      setAddModalOpen(false)
      setNewDriver({
        name: '',
        contactNumber: '',
        email: '',
        password: '',
        licenseNumber: '',
        aadharNumber: '',
      })
      setProfileImage(null)
      setLicenseImage(null)
      setAadharImage(null)

      refreshDrivers()
    } catch (error) {
      console.error('Error adding driver:', error)
      toast.error('Failed to add driver. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle editing a driver
  const handleEditDriver = (driver) => {
    setDriverToEdit(driver)
    setEditModalOpen(true)
  }

  // Handle saving edits
  const handleSaveEdit = async () => {
    const formData = new FormData()
    formData.append('name', driverToEdit.name)
    formData.append('contactNumber', driverToEdit.contactNumber)
    formData.append('email', driverToEdit.email)
    formData.append('licenseNumber', driverToEdit.licenseNumber)
    formData.append('aadharNumber', driverToEdit.aadharNumber)
    formData.append('password', driverToEdit.password)

    if (profileImage) formData.append('profileImage', profileImage)
    if (licenseImage) formData.append('licenseImage', licenseImage)
    if (aadharImage) formData.append('aadharImage', aadharImage)

    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVydmlzb3IxIiwiaWQiOiI2Nzk3N2I2YmEzM2NjNGE5MzBhODhkZDYiLCJ1c2VycyI6dHJ1ZSwic3VwZXJhZG1pbiI6ZmFsc2UsInVzZXIiOnsiX2lkIjoiNjc5NzdiNmJhMzNjYzRhOTMwYTg4ZGQ2IiwiZW1haWwiOiIiLCJwYXNzd29yZCI6ImEzOGJmZmU0Y2QwZjM5MmM2ZDMzMGI0MmQ1NmVmYjAwOmYxMzAyODRjOThiNzcyNTk1MmMwYTFiZThhNGUyMGMyIiwidXNlcm5hbWUiOiJzdXBlcnZpc29yMSIsIm1vYmlsZSI6IjgwMDc1MzcwNDQiLCJncm91cHNBc3NpZ25lZCI6WyI2Nzk3Nzk5YWEzM2NjNGE5MzBhNzlmNDEiXSwiY3JlYXRlZEJ5IjoiNjc5Nzc5Y2NhMzNjYzRhOTMwYTdiOTNkIiwic3RhdHVzIjoiZmFsc2UiLCJub3RpZmljYXRpb24iOnRydWUsImRldmljZXMiOnRydWUsImRyaXZlciI6dHJ1ZSwiZ3JvdXBzIjp0cnVlLCJjYXRlZ29yeSI6ZmFsc2UsIm1vZGVsIjpmYWxzZSwidXNlcnMiOnRydWUsInJlcG9ydCI6ZmFsc2UsInN0b3AiOnRydWUsInRyYXZlbCI6dHJ1ZSwiZ2VvZmVuY2UiOnRydWUsImdlb2ZlbmNlUmVwb3J0Ijp0cnVlLCJtYWludGVuYW5jZSI6dHJ1ZSwicHJlZmVyZW5jZXMiOmZhbHNlLCJkaXN0YW5jZSI6dHJ1ZSwiaGlzdG9yeSI6dHJ1ZSwic2Vuc29yIjp0cnVlLCJpZGxlIjp0cnVlLCJhbGVydHMiOnRydWUsInZlaGljbGUiOnRydWUsImRldmljZWxpbWl0IjpmYWxzZSwiZW50cmllc0NvdW50IjowLCJfX3YiOjB9LCJpYXQiOjE3Mzc5ODEyOTR9.29lMWplx4W5l2Ca-bMFh5K21tU1e9RaMveAt617rHZY'
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/drivers/${driverToEdit._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const updatedDrivers = drivers.map((driver) =>
        driver._id === driverToEdit._id ? { ...driverToEdit, ...response.data } : driver,
      )
      setDrivers(updatedDrivers)

      toast.success('Driver updated successfully!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })

      setEditModalOpen(false)
      setProfileImage(null)
      setLicenseImage(null)
      setAadharImage(null)
    } catch (error) {
      console.error('Error updating driver:', error)
      toast.error('Failed to update driver. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }

  // Handle deleting a driver
  const handleDeleteDriver = async (driverId) => {
    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVydmlzb3IxIiwiaWQiOiI2Nzk3N2I2YmEzM2NjNGE5MzBhODhkZDYiLCJ1c2VycyI6dHJ1ZSwic3VwZXJhZG1pbiI6ZmFsc2UsInVzZXIiOnsiX2lkIjoiNjc5NzdiNmJhMzNjYzRhOTMwYTg4ZGQ2IiwiZW1haWwiOiIiLCJwYXNzd29yZCI6ImEzOGJmZmU0Y2QwZjM5MmM2ZDMzMGI0MmQ1NmVmYjAwOmYxMzAyODRjOThiNzcyNTk1MmMwYTFiZThhNGUyMGMyIiwidXNlcm5hbWUiOiJzdXBlcnZpc29yMSIsIm1vYmlsZSI6IjgwMDc1MzcwNDQiLCJncm91cHNBc3NpZ25lZCI6WyI2Nzk3Nzk5YWEzM2NjNGE5MzBhNzlmNDEiXSwiY3JlYXRlZEJ5IjoiNjc5Nzc5Y2NhMzNjYzRhOTMwYTdiOTNkIiwic3RhdHVzIjoiZmFsc2UiLCJub3RpZmljYXRpb24iOnRydWUsImRldmljZXMiOnRydWUsImRyaXZlciI6dHJ1ZSwiZ3JvdXBzIjp0cnVlLCJjYXRlZ29yeSI6ZmFsc2UsIm1vZGVsIjpmYWxzZSwidXNlcnMiOnRydWUsInJlcG9ydCI6ZmFsc2UsInN0b3AiOnRydWUsInRyYXZlbCI6dHJ1ZSwiZ2VvZmVuY2UiOnRydWUsImdlb2ZlbmNlUmVwb3J0Ijp0cnVlLCJtYWludGVuYW5jZSI6dHJ1ZSwicHJlZmVyZW5jZXMiOmZhbHNlLCJkaXN0YW5jZSI6dHJ1ZSwiaGlzdG9yeSI6dHJ1ZSwic2Vuc29yIjp0cnVlLCJpZGxlIjp0cnVlLCJhbGVydHMiOnRydWUsInZlaGljbGUiOnRydWUsImRldmljZWxpbWl0IjpmYWxzZSwiZW50cmllc0NvdW50IjowLCJfX3YiOjB9LCJpYXQiOjE3Mzc5ODEyOTR9.29lMWplx4W5l2Ca-bMFh5K21tU1e9RaMveAt617rHZY'
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/drivers/${driverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setDrivers(drivers.filter((driver) => driver._id !== driverId))
      toast.success('Driver deleted successfully!')
    } catch (error) {
      console.error('Error deleting driver:', error)
      toast.error('Failed to delete driver. Please try again.')
    }
  }

  // Handle view click
  const handleViewClick = (driver) => {
    setSelectedDriver(driver)
    setOpen(true)
  }

  // Filtered drivers based on search query
  const filteredDrivers = Array.isArray(drivers)
    ? drivers.filter((driver) => driver.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  // Pagination logic
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredDrivers.slice(indexOfFirstItem, indexOfLastItem)

  const exportToExcel = async () => {
    try {
      if (!Array.isArray(filteredDrivers) || filteredDrivers.length === 0) {
        throw new Error('No data available for Excel export')
      }

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Drivers List')

      // Add headers
      worksheet.addRow(['SN', 'Name', 'Contact', 'Email', 'License Number', 'Aadhar Number'])

      // Add data rows
      filteredDrivers.forEach((driver, index) => {
        worksheet.addRow([
          index + 1,
          driver.name,
          driver.contactNumber,
          driver.email,
          driver.licenseNumber,
          driver.aadharNumber,
        ])
      })

      // Generate and save file
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const filename = `Drivers_List_${new Date().toISOString().split('T')[0]}.xlsx`
      saveAs(blob, filename)
      toast.success('Excel file downloaded successfully')
    } catch (error) {
      console.error('Excel Export Error:', error)
      toast.error(error.message || 'Failed to export Excel file')
    }
  }

  const exportToPDF = () => {
    try {
      if (!Array.isArray(filteredDrivers) || filteredDrivers.length === 0) {
        throw new Error('No data available for PDF export')
      }

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      // Add headers
      const headers = ['SN', 'Name', 'Contact', 'Email', 'License Number', 'Aadhar Number']

      // Add data rows
      const data = filteredDrivers.map((driver, index) => [
        index + 1,
        driver.name,
        driver.contactNumber,
        driver.email,
        driver.licenseNumber,
        driver.aadharNumber,
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
      const filename = `Drivers_List_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(filename)
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('PDF Export Error:', error)
      toast.error(error.message || 'Failed to export PDF')
    }
  }
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
          <CButton color="primary" className="float-end mb-2" onClick={() => setAddModalOpen(true)}>
            Add Driver
          </CButton>
        </div>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Drivers</strong>
              <CFormInput
                type="text"
                placeholder="Search Drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-25"
                style={{
                  boxShadow: searchQuery ? '0 0 8px rgba(0, 123, 255, 0.75)' : 'none',
                  borderColor: searchQuery ? '#007bff' : undefined,
                }}
              />
            </CCardHeader>

            <CCardBody>
              {currentItems.length === 0 ? (
                <p className="text-center">No drivers available.</p>
              ) : (
                <CTable striped hover responsive bordered>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="text-center" scope="col">
                        SN
                      </CTableHeaderCell>
                      {columns.map((column, index) => (
                        <CTableHeaderCell key={index} className="text-center" scope="col">
                          {column}
                        </CTableHeaderCell>
                      ))}
                      <CTableHeaderCell className="text-center" scope="col">
                        Actions
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentItems.map((driver, index) => (
                      <CTableRow key={driver._id}>
                        <CTableDataCell className="text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{driver.name}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {driver.contactNumber}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{driver.email}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            color="primary"
                            size="sm"
                            onClick={() => handleViewClick(driver)}
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
                            onClick={() => handleEditDriver(driver)}
                          >
                            <Edit size={16} />
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => handleDeleteConfirmation(driver._id)}
                          >
                            <Trash2 size={16} />
                          </CButton>
                          <CModal
                            visible={showDeleteModal}
                            onClose={() => setShowDeleteModal(false)}
                          >
                            <CModalHeader>
                              <CModalTitle>Confirm Delete</CModalTitle>
                            </CModalHeader>
                            <CModalBody>Are you sure you want to delete this driver?</CModalBody>
                            <CModalFooter>
                              <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
                                No
                              </CButton>
                              <CButton color="danger" onClick={handleDelete}>
                                Yes, Delete
                              </CButton>
                            </CModalFooter>
                          </CModal>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                  <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
                    <IconDropdown items={dropdownItems} />
                  </div>
                </CTable>
              )}

              <div className="d-flex justify-content-center align-items-center mt-3">
                <CButton
                  color="primary"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </CButton>
                {Array.from({ length: totalPages }, (_, index) => (
                  <CButton
                    key={index}
                    color={currentPage === index + 1 ? 'primary' : 'secondary'}
                    className="mx-1"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </CButton>
                ))}
                <CButton
                  color="primary"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* View Profile Modal */}
      {selectedDriver && (
        <CModal
          alignment="center"
          scrollable
          visible={open}
          onClose={() => setOpen(false)}
          fullscreen
        >
          <CModalHeader>
            <CModalTitle className="d-flex align-items-center">
              <h5>Driver Profile</h5>
            </CModalTitle>
          </CModalHeader>
          <CModalBody className="shadow-md rounded-lg p-6 mb-6">
            <div className="d-flex gap-3">
              {/* <CImage
                src={selectedDriver?.profileImage?.base64Data || '/defaultDriverProfileImage.png'}
                alt={selectedDriver.name}
                className="img-thumbnail rounded-circle me-3"
                width="170"
                height="170"
              /> */}
              {selectedDriver?.profileImage?.base64Data ? (
                <CImage
                  src={selectedDriver.profileImage.base64Data}
                  alt={selectedDriver.name}
                  className="img-thumbnail rounded-circle me-3"
                  width="170"
                  height="170"
                />
              ) : (
                <FaUserCircle 
                  className="me-3 text-secondary" 
                  size={170}  // Controls the icon size
                />
              )}
              <div>
                <div className="py-2">
                  <h2>{selectedDriver.name}</h2>
                </div>
                <div>
                  <h6>License: {selectedDriver.licenseNumber}</h6>
                </div>
                <div>
                  <h6>Aadhar: {selectedDriver.aadharNumber}</h6>
                </div>
                <div>
                  <h6>Contact: {selectedDriver.contactNumber}</h6>
                </div>
                <div>
                  <h6>Email: {selectedDriver.email}</h6>
                </div>
              </div>
            </div>
            <hr />
            <CTabs activeItemKey={1}>
              <CTabList variant="underline">
                <CTab aria-controls="attendance" itemKey={1}>
                  Attendances
                </CTab>
                <CTab aria-controls="expenses" itemKey={2}>
                  Expenses
                </CTab>
                <CTab aria-controls="trip-details" itemKey={3}>
                  Logbook Details
                </CTab>
                <CTab aria-controls="salary-slips" itemKey={4}>
                  Salary Slips
                </CTab>
                <CTab aria-controls="document-locker" itemKey={5}>
                  Document Locker
                </CTab>
              </CTabList>
              <CTabContent>
                <CTabPanel className="p-3" aria-labelledby="attendance" itemKey={1}>
                  <AttendanceSection driverId={selectedDriver.id} />
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="expenses" itemKey={2}>
                  <ExpensesTable
                    expenses={expenses.filter((expense) => expense.driverId === selectedDriver.id)}
                  />
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="trip-details" itemKey={3}>
                  <TripsTable trips={trips.filter((trip) => trip.driverId === selectedDriver.id)} />
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="salary-slips" itemKey={4}>
                  <SalarySlipTable
                    salaries={salaries.filter((salary) => salary.driverId === selectedDriver.id)}
                  />
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="document-locker" itemKey={5}>
                  <DocumentLocker documents={selectedDriver} />
                </CTabPanel>
              </CTabContent>
            </CTabs>
          </CModalBody>
        </CModal>
      )}

      {/* Add Driver Modal */}
      <CModal
        alignment="center"
        visible={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>Add Driver</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div
              className="flex-wrap gap-5"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
            >
              <CCol md={15}>
                <CInputGroup className="mt-4">
                  <CInputGroupText className="border-end">
                    <IoPerson style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="name"
                    placeholder="Enter Driver Name"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
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
                    name="contactNumber"
                    placeholder="Enter Contact Number"
                    value={newDriver.contactNumber}
                    onChange={(e) => setNewDriver({ ...newDriver, contactNumber: e.target.value })}
                  />
                </CInputGroup>
              </CCol>
            </div>

            <div
              className="flex-wrap gap-5"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
            >
              <CCol md={15}>
                <CInputGroup className="mt-5">
                  <CInputGroupText className="border-end">
                    <MdEmail style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="email"
                    name="email"
                    placeholder="Enter Email Id"
                    value={newDriver.email}
                    onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                  />
                </CInputGroup>
              </CCol>

              <CCol md={15}>
                <CInputGroup className="mt-5">
                  <CInputGroupText className="border-end">
                    <IoDocumentText style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="licenseNumber"
                    placeholder="Enter License Number"
                    value={newDriver.licenseNumber}
                    onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                  />
                </CInputGroup>
              </CCol>
            </div>

            <div
              className="flex-wrap gap-5"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
            >
              <CCol md={15}>
                <CInputGroup className="mt-5">
                  <CInputGroupText className="border-end">
                    <IoDocumentText style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="aadharNumber"
                    placeholder="Enter Aadhar Number"
                    value={newDriver.aadharNumber}
                    onChange={(e) => setNewDriver({ ...newDriver, aadharNumber: e.target.value })}
                  />
                </CInputGroup>
              </CCol>

              <CCol md={15}>
                <CInputGroup className="mt-5">
                  <CInputGroupText className="border-end">
                    <RiLockPasswordFill style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={newDriver.password}
                    onChange={(e) => setNewDriver({ ...newDriver, password: e.target.value })}
                  />
                </CInputGroup>
              </CCol>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                marginTop: '30px',
                gap: '20px',
                width: '100%',
              }}
            >
              <CCol md={20}>
                <h6>Upload Profile Image </h6>
                <CInputGroup className="mt-0">
                  <CInputGroupText className="border-end">
                    <AiFillPicture style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput type="file" onChange={(e) => setProfileImage(e.target.files[0])} />
                </CInputGroup>
              </CCol>

              <CCol md={20}>
                <h6>Upload License </h6>
                <CInputGroup className="mt-0">
                  <CInputGroupText className="border-end">
                    <IoDocumentText style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput type="file" onChange={(e) => setLicenseImage(e.target.files[0])} />
                </CInputGroup>
              </CCol>

              <CCol md={20}>
                <h6>Upload Aadhar</h6>
                <CInputGroup className="mt-0">
                  <CInputGroupText className="border-end">
                    <IoDocumentText style={{ fontSize: '22px', color: 'gray' }} />
                  </CInputGroupText>
                  <CFormInput type="file" onChange={(e) => setAadharImage(e.target.files[0])} />
                </CInputGroup>
              </CCol>
            </div>

            <div className="d-flex justify-content-end">
              <CButton
                color="primary"
                className="mt-3"
                onClick={handleAddDriver}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </CButton>
            </div>
          </CForm>
        </CModalBody>
      </CModal>

      {/* Edit Driver Modal */}
      {editModalOpen && driverToEdit && (
        <CModal
          alignment="center"
          visible={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          size="xl"
        >
          <CModalHeader>
            <CModalTitle>Edit Driver</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <div
                className="flex-wrap gap-5"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
              >
                <CCol md={15}>
                  <CInputGroup className="mt-4">
                    <CInputGroupText className="border-end">
                      <IoPerson style={{ fontSize: '22px', color: 'gray' }} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      required
                      value={driverToEdit.name}
                      onChange={(e) => setDriverToEdit({ ...driverToEdit, name: e.target.value })}
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
                      value={driverToEdit.contactNumber}
                      onChange={(e) =>
                        setDriverToEdit({ ...driverToEdit, contactNumber: e.target.value })
                      }
                    />
                  </CInputGroup>
                </CCol>
              </div>

              <div
                className="flex-wrap gap-5"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
              >
                <CCol md={15}>
                  <CInputGroup className="mt-5">
                    <CInputGroupText className="border-end">
                      <MdEmail style={{ fontSize: '22px', color: 'gray' }} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      value={driverToEdit.email}
                      onChange={(e) => setDriverToEdit({ ...driverToEdit, email: e.target.value })}
                    />
                  </CInputGroup>
                </CCol>

                <CCol md={15}>
                  <CInputGroup className="mt-5">
                    <CInputGroupText className="border-end">
                      <IoDocumentText style={{ fontSize: '22px', color: 'gray' }} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      value={driverToEdit.licenseNumber}
                      onChange={(e) =>
                        setDriverToEdit({ ...driverToEdit, licenseNumber: e.target.value })
                      }
                    />
                  </CInputGroup>
                </CCol>
              </div>

              <div
                className="flex-wrap gap-5"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
              >
                <CCol md={15}>
                  <CInputGroup className="mt-5">
                    <CInputGroupText className="border-end">
                      <IoDocumentText style={{ fontSize: '22px', color: 'gray' }} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      value={driverToEdit.aadharNumber}
                      onChange={(e) =>
                        setDriverToEdit({ ...driverToEdit, aadharNumber: e.target.value })
                      }
                    />
                  </CInputGroup>
                </CCol>

                <CCol md={15}>
                  <CInputGroup className="mt-5">
                    <CInputGroupText className="border-end">
                      <RiLockPasswordFill style={{ fontSize: '22px', color: 'gray' }} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      value={driverToEdit.password}
                      onChange={(e) =>
                        setDriverToEdit({ ...driverToEdit, password: e.target.value })
                      }
                    />
                  </CInputGroup>
                </CCol>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  marginTop: '30px',
                  gap: '20px',
                  width: '100%',
                }}
              >
                <CCol md={20}>
                  <h6>Upload Profile Image </h6>
                  <CInputGroup className="mt-0">
                    <CInputGroupText className="border-end">
                      <AiFillPicture style={{ fontSize: '22px', color: 'gray' }} />
                    </CInputGroupText>
                    <CFormInput
                      type="file"
                      onChange={(e) => handleFileChange(e, setProfileImage)}
                    />
                  </CInputGroup>
                </CCol>

                <CCol md={20}>
                  <h6>Upload License </h6>
                  <CInputGroup className="mt-0">
                    <CInputGroupText className="border-end">
                      <IoDocumentText style={{ fontSize: '22px', color: 'gray' }} />
                    </CInputGroupText>
                    <CFormInput
                      type="file"
                      onChange={(e) => handleFileChange(e, setLicenseImage)}
                    />
                  </CInputGroup>
                </CCol>

                <CCol md={20}>
                  <h6>Upload Aadhar</h6>
                  <CInputGroup className="mt-0">
                    <CInputGroupText className="border-end">
                      <IoDocumentText style={{ fontSize: '22px', color: 'gray' }} />
                    </CInputGroupText>
                    <CFormInput type="file" onChange={(e) => handleFileChange(e, setAadharImage)} />
                  </CInputGroup>
                </CCol>
              </div>

              <div className="d-flex justify-content-end">
                <CButton
                  color="primary"
                  className="mt-3"
                  onClick={handleSaveEdit}
                  disabled={loading}
                >
                  {loading ? 'Editing...' : 'Edit'}
                </CButton>
              </div>
            </CForm>
          </CModalBody>
        </CModal>
      )}

      <ToastContainer />
    </>
  )
}

export default DriversExp
