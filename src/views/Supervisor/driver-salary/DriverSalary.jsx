import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import SmartPagination from '../../components/SmartPagination.jsx'
import Loader from '../../../components/Loader/Loader.jsx'
import Page404 from '../../pages/page404/Page404.js'
import SearchInput from '../../components/SearchInput.jsx'
import Table from '../../components/Table'
import DateRangePicker from '../../components/DateRangePicker.jsx'
import {
  deleteDriverSalaryApi,
  getDriverSalaryListApiByMonth,
  postDriverSalaryApi,
} from '../data/data.js'
import SalaryAddButton from '../../components/SalaryAddButton.jsx'
import { toast, ToastContainer } from 'react-toastify'
import { FaEdit, FaTrash } from 'react-icons/fa'
import Swal from 'sweetalert2'

const DriverSalary = () => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState([])

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
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => console.log('Edit clicked', item)}
            >
              <FaEdit />
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleDelete(item._id, item.driverId?.name || 'Salary')}
            >
              <FaTrash />
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
  const handleSalarySubmit = async (formData) => {
    // Validate driverId (assuming it could be an object or string)
    if (
      !formData.driverId ||
      (typeof formData.driverId === 'string' && formData.driverId.trim() === '')
    ) {
      toast.error('Please select a driver.')
      return
    }

    // Validate basicPay
    if (!formData.basicPay || isNaN(formData.basicPay) || Number(formData.basicPay) <= 0) {
      toast.error('Basic Pay must be a valid positive number.')
      return
    }

    // Validate optional fields: overtime, incentives, deductions
    const validateOptional = (field, label) => {
      if (formData[field] !== undefined && formData[field] !== '') {
        if (isNaN(formData[field]) || Number(formData[field]) < 0) {
          toast.error(`${label} must be a valid non-negative number.`)
          return false
        }
      }
      return true
    }

    if (
      !validateOptional('overtime', 'Overtime') ||
      !validateOptional('incentives', 'Incentives') ||
      !validateOptional('deductions', 'Deductions')
    ) {
      return
    }

    try {
      console.log('Submitting salary:', formData)

      const response = await postDriverSalaryApi(formData.driverId, formData)

      console.log('API Response:', response)

      if (response?.status === 201 && response?.data) {
        toast.success('Salary successfully created!')
      } else {
        throw new Error('Unexpected response from server.')
      }
    } catch (error) {
      console.error('Error submitting salary:', error)
    } finally {
      // Always refresh the data
      await queryClient.invalidateQueries(['driverSalaries', month])
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
        toast.success('Salary deleted successfully.')

        // Refresh salary list
        await queryClient.invalidateQueries(['driverSalaries', month])
      } catch (error) {
        toast.error('Failed to delete salary. Please try again.')
        console.error('Delete Error:', error)
      }
    }
  }

  return (
    <div className="container-fluid">
      <ToastContainer />
      {/* Header Section */}
      <div className="row mb-3">
        {/* Left Side: Date Picker */}
        <div className="col-md-2 d-flex align-items-center">
          <DateRangePicker
            onMonthChange={(selectedMonth) => {
              if (selectedMonth !== month) {
                setMonth(selectedMonth)
              }
            }}
          />
        </div>

        {/* Right Side: SearchInput & SalaryComponent */}
        <div className="col-md-10 d-flex justify-content-end align-items-center gap-3">
          <div className="d-flex flex-grow-1 justify-content-end" style={{ marginTop: '1.5rem' }}>
            <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          <div>
            {/* Pass the callback function */}
            <SalaryAddButton onSubmit={handleSalarySubmit} month={month} />
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
    </div>
  )
}

export default DriverSalary
