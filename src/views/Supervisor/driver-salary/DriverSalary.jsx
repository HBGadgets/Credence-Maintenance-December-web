import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import SmartPagination from '../../components/SmartPagination.jsx'
import Page404 from '../../pages/page404/Page404.js'
import SearchInput from '../../components/SearchInput.jsx'
import Table from '../../components/Table'
import DateRangePicker from '../../components/DateRangePicker.jsx'
import {
  deleteDriverSalaryApi,
  getDriverSalaryListApiByMonth,
  patchDriverSalaryApi,
  postDriverSalaryApi,
} from '../data/data.js'
import { toast, ToastContainer } from 'react-toastify'
import { FaArrowUp, FaEdit, FaPrint, FaRegFilePdf, FaTrash } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { CButton } from '@coreui/react'
import SalaryFrom from './componets/SalaryFrom.jsx'
import { Pencil, Trash2 } from 'lucide-react'
import { HiOutlineLogout } from 'react-icons/hi'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import IconDropdown from '../IconDropdown.js'
import usePdfExporter from '../../customhooks/usePdfExporter.js'
import useExcelExporter from '../../customhooks/useExcelExporter.js'

const DriverSalary = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState([])
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false)
  const [selectedSalary, setSelectedSalary] = useState(null)

  const lastFetchedMonth = useRef(null)
  const queryClient = useQueryClient() // React Query client for refetching

  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Basic Pay', key: 'basicPay', sortable: true },
    { label: 'Overtime', key: 'overtime', sortable: true },
    { label: 'Incentives', key: 'incentives', sortable: true },
    { label: 'Deductions', key: 'deductions', sortable: true },
    { label: 'Net Pay', key: 'netPay', sortable: true },
    { label: 'Actions', key: 'actions', sortable: false },
  ]

  // dulicate API call prevention
  // const {
  //   data: salaryData = [],
  //   isFetching,
  //   isError,
  // } = useQuery({
  //   queryKey: ['driverSalaries', month],
  //   queryFn: async () => {
  //     if (lastFetchedMonth.current === month) {
  //       console.log('Skipping duplicate API call for:', month)
  //       return []
  //     }
  //     lastFetchedMonth.current = month
  //     console.log(`Fetching driver salaries for month: ${month}`)
  //     const response = await getDriverSalaryListApiByMonth(month)
  //     return response || []
  //   },
  //   staleTime: 1000 * 60 * 5,
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  //   enabled: Boolean(month),
  //   retry: 1,
  // })

  const {
    data: salaryData = [],
    isFetching,
    isError,
    error, // make sure to destructure this
  } = useQuery({
    queryKey: ['driverSalaries', month],
    queryFn: async () => {
      console.log(`Fetching driver salaries for month: ${month}`)
      const response = await getDriverSalaryListApiByMonth(month)
      return response || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes caching
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(month), // only run if month is truthy
    retry: 1,
  })

  if (isError) {
    if (!error?.response) {
      return <Page404 message="Network Error: Please check your internet connection." />
    } else if (error.response.status === 500) {
      return <Page404 message="Server Error: Something went wrong on our end." />
    }
  }

  const transformedData = useMemo(
    () =>
      salaryData?.map((item) => ({
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : 'N/A',
        driverName: item.driverId?.name || 'N/A',
        basicPay: item.basicPay,
        overtime: item.overtime,
        incentives: item.incentives,
        deductions: item.deductions,
        netPay: item.netPay,
        actions: (
          <div className="d-flex gap-2 justify-content-center align-items-center">
            <button
              className="btn btn-link p-0 me-2"
              onClick={() => {
                setSelectedSalary(item) // Pass the full original item
                setIsSalaryModalOpen(true)
              }}
            >
              <Pencil color="#2D336B" size={20} style={{ cursor: 'pointer' }} />
            </button>
            <button
              className="btn btn-link p-0 me-2"
              onClick={() => handleDelete(item._id, item.driverId?.name || 'Salary')}
            >
              <Trash2 color="#2D336B" size={20} style={{ cursor: 'pointer' }} />
            </button>
          </div>
        ),
      })) || [],
    [salaryData],
  )

  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(transformedData)
    } else {
      const filtered = transformedData.filter((item) =>
        item.driverName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredData(filtered)
    }
  }, [searchQuery, transformedData])

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Function to refresh salary list POST SUBMIT
  const handleSalarySubmit = async (submittedData) => {
    try {
      if (submittedData._id) {
        // Remove metadata fields and send only changed data
        const { driverId, _id, ...updateData } = submittedData
        await patchDriverSalaryApi(_id, updateData)
        Swal.fire({
          icon: 'success',
          title: 'Salary Updated!',
          text: 'Salary updated successfully!',
          confirmButtonText: 'OK',
        })
      } else {
        if (!submittedData.driverId) {
          throw new Error('Driver ID is required to create salary.')
        }
        await postDriverSalaryApi(submittedData.driverId, submittedData)
        Swal.fire({
          icon: 'success',
          title: 'Salary Added!',
          text: 'Salary created successfully!',
          confirmButtonText: 'OK',
        })
      }

      // Invalidate query only after successful API call
      await queryClient.invalidateQueries(['driverSalaries', month])
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Something went wrong while saving the salary.'
      toast.error(errorMessage)
    }
  }

  // Handle delete action.
  const handleDelete = async (id, fieldName = 'salary') => {
    const result = await Swal.fire({
      title: `Delete ${fieldName}?`,
      text: 'Are you sure you want to delete this Salary? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (result.isConfirmed) {
      try {
        await deleteDriverSalaryApi(id)
        Swal.fire('Deleted!', `${fieldName} has been deleted.`, 'success')
        // Refresh salary list
        await queryClient.invalidateQueries(['driverSalaries', month])
      } catch (error) {
        toast.error('Failed to delete salary. Please try again.')
        console.error('Delete Error:', error)
      }
    }
  }

  if (error) return <Page404 />

  // Dropdown items for export
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () => {
        // Exclude 'Actions' column
        const pdfColumns = columns.filter((col) => col.key !== 'actions')
        const pdfData = filteredData.map(({ actions, ...rest }) => rest) // remove 'actions' field

        exportToPDF({
          title: 'Driver Salary Report',
          columns: pdfColumns,
          data: pdfData,
          fileName: 'Driver_Salary_Report',
        })
      },
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () => {
        const excelColumns = columns.filter((col) => col.key !== 'actions')
        const excelData = filteredData.map(({ actions, ...rest }) => rest)

        exportToExcel({
          title: 'Driver Salary Report',
          columns: excelColumns,
          data: excelData,
          fileName: 'Driver_Salary_Report',
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
  ]

  return (
    <div>
      <ToastContainer />
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center">
        {/* Left: Date Picker */}
        <div className="col-md-2 d-flex align-items-center">
          <DateRangePicker
            label={true}
            onMonthChange={(selectedMonth) => {
              if (selectedMonth !== month) {
                setMonth(selectedMonth)
              }
            }}
          />
        </div>

        {/* Right: SearchInput & SalaryComponent */}
        <div className="col-md-10 d-flex justify-content-end align-items-center gap-3">
          <div className="d-flex flex-grow-1 justify-content-end" style={{ marginTop: '1.5rem' }}>
            <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          <div>
            <CButton
              color="primary"
              style={{ marginTop: '2.8rem' }}
              onClick={() => {
                setSelectedSalary(null)
                setIsSalaryModalOpen(true)
              }}
            >
              Add Salary
            </CButton>
            <SalaryFrom
              onSubmit={handleSalarySubmit}
              month={month}
              visible={isSalaryModalOpen}
              onClose={() => setIsSalaryModalOpen(false)}
              initialData={selectedSalary}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Table
        title="Driver Salary Generation"
        columns={columns}
        filteredData={filteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        errorMessage={
          isError
            ? 'Error fetching driver salaries. Please try again later.'
            : filteredData.length === 0 && !isFetching
              ? 'No salary records found for the selected month.'
              : ''
        }
      />

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
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

export default DriverSalary
