import React, { useState, useEffect } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import SmartPagination from '../../components/SmartPagination'
import Table from '../../components/Table'
import SearchInput from '../../components/SearchInput'
import { ToastContainer } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getAllDriverAttendenceApi } from '../data/data'
import IconDropdown from '../IconDropdown'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'

const attendanceFilterOptions = [
  { value: 'all', label: 'All Drivers' },
  { value: 'zero_present', label: '0 Present' },
  { value: 'zero_absent', label: '0 Absent' },
]

const AllDriverAttendance = () => {
  const navigate = useNavigate()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState([])
  const [attendanceFilter, setAttendanceFilter] = useState(null)

  const [selectedMonth, setSelectedMonth] = useState(() => {
    return sessionStorage.getItem('allDriverAttendanceMonth') || new Date().toISOString().slice(0, 7)
  })

  useEffect(() => {
    sessionStorage.setItem('allDriverAttendanceMonth', selectedMonth)
  }, [selectedMonth])

  const [year, month] = selectedMonth.split('-')

  const selectedFilterValue =
    attendanceFilter?.value && attendanceFilter.value !== 'all' ? attendanceFilter.value : undefined

  const { data, isFetching } = useQuery({
    queryKey: [
      'DriverAttendacne',
      {
        search: searchQuery,
        page: currentPage,
        limit: itemsPerPage,
        month: parseInt(month, 10),
        year: parseInt(year, 10),
        filter: selectedFilterValue,
      },
    ],
    queryFn: getAllDriverAttendenceApi,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  })

  useEffect(() => {
    if (data?.data) {
      setFilteredData(data.data)
    }
  }, [data])

  const totalPages = data?.totalPages || 1

  const columns = [
    { label: 'Drivers Name', key: 'driverName', sortable: true },
    { label: 'Total Days', key: 'totalDays', sortable: true },
    { label: 'Present Days', key: 'presentCount', sortable: true },
    { label: 'Absent Days', key: 'absentCount', sortable: true },
    { label: 'leave Days', key: 'leaveCount', sortable: true },
  ]

  const handleViewButton = (id) => {
    navigate(`/DriverAttendance/${id}`, { state: { selectedMonth } })
  }

  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () =>
        exportToPDF({
          title: 'Driver Attendance Details',
          columns: columns,
          data: filteredData,
          fileName: 'Driver_Attendance_Report',
        }),
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () =>
        exportToExcel({
          title: 'Driver Attendance Details',
          columns: columns,
          data: filteredData,
          fileName: 'Driver_Attendance_Report',
        }),
    },
    {
      icon: FaPrint,
      label: 'Print Page',
      onClick: () => window.print(),
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

      <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
        {/* Top Left */}
        <div className="d-flex align-items-center flex-wrap gap-2">
          <DateRangePicker
            value={selectedMonth}
            onMonthChange={(newMonth) => {
              setSelectedMonth(newMonth)
              setCurrentPage(1)
            }}
            style={{ width: '230px' }}
            className="p-0 m-0"
          />
          <div style={{ width: '220px' }}>
            <SingleSelectDropdown
              options={attendanceFilterOptions}
              value={attendanceFilter}
              onChange={(selected) => {
                setAttendanceFilter(selected)
                setCurrentPage(1)
              }}
              isClearable
              placeholder="Filter Attendance..."
            />
          </div>
        </div>

        {/* Top Right */}
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={(query) => {
            setSearchQuery(query)
            setCurrentPage(1)
          }}
        />
      </div>

      <Table
        title="Driver Attendence Details"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={1}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        viewButton={true}
        handleViewButton={handleViewButton}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value === -1 ? filteredData.length : value)
          setCurrentPage(1)
        }}
      />

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </div>
  )
}

export default AllDriverAttendance
