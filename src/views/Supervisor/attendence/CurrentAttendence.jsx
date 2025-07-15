import React, { useContext, useEffect, useState } from 'react'
import { getDriverListApi, markAttendanceBySupervisorApi } from '../data/data'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { useQuery } from '@tanstack/react-query'
import { VscBlank } from 'react-icons/vsc'
import Swal from 'sweetalert2'
import IconDropdown from '../IconDropdown'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import { ToastContainer } from 'react-toastify'
import { TokenContext } from '../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import { fetchSupervisor } from '../../DriverExpert/data/drivers'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'

const CurrentAttendence = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // fetch data
  const { data: driverlist = [], isFetching } = useQuery({
    queryKey: ['driverlist'],
    queryFn: () => getDriverListApi(null, token),
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
    enabled: !!token, //  only run if token is available
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
    enabled: !!token && !!decodedToken,
  })

  useEffect(() => {
    if (!driverlist || driverlist.length === 0) return

    let filtered = driverlist

    // Filter by supervisor if selected
    if (selectedName?.value) {
      filtered = filtered.filter((trip) => trip.supervisorId === selectedName.value)
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = driverlist.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    setFilteredData(filtered)
  }, [searchQuery, driverlist, selectedName])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Handle View Button
  const handleViewButton = async (id) => {
    if (isFetching) return // Prevent action while fetching
    try {
      await markAttendanceBySupervisorApi(id)

      setFilteredData((prevData) =>
        prevData.filter((driverlist) => driverlist.id !== id && driverlist._id !== id),
      )

      Swal.fire('Success!', 'Attendance marked successfully.', 'success')
      console.log('Attendance marked and row removed for id:', id)
    } catch (error) {
      Swal.fire('Error', 'Failed to mark attendance.', 'error')
      console.error('Failed to mark attendance:', error)
    }
  }

  // Table columns
  const columns = [
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Contact Number', key: 'contactNumber', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
  ]

  // Dropdown items for export
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () =>
        exportToPDF({
          title: 'Attendance Report', // Dynamic title
          columns: columns,
          data: filteredData,
          fileName: 'Attendance_Report', // Dynamic file name
        }),
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () =>
        exportToExcel({
          title: 'Attendance Report', // Dynamic title
          columns: columns,
          data: filteredData,
          fileName: 'Attendance_Report', // Dynamic file name
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

  return (
    <>
      <ToastContainer />

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-wrap align-items-center gap-2">
          {userRole === 'superadmin' && (
            <div style={{ width: '150px' }}>
              {/* <SingleSelectDropdown
                options={supervisorOptions}
                value={selectedName}
                onChange={setSelectedName}
                isClearable
                placeholder="Filter by Supervisor Name..."
              /> */}
            </div>
          )}
        </div>

        <div className="d-flex justify-content-end align-items-center gap-2 w-75">
          <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
        </div>
      </div>

      <Table
        title="Marks Attendence List"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        viewButton={true}
        viewButtonLabel="Mark Present" //Custom label here
        viewButtonIcon={<VscBlank size={1} />} //Custom icon here
        viewButtonColor={'green'} // Custom green
        handleViewButton={handleViewButton}
        isFetching={isFetching}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value)
          setCurrentPage(1)
          if (value === -1) {
            setItemsPerPage(filteredData.length)
          }
        }}
      />

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default CurrentAttendence
