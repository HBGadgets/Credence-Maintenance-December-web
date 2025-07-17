import React, { useState, useEffect, useMemo, useContext } from 'react'
import Table from '../components/Table'
import SmartPagination from '../components/SmartPagination'
import {
  addDriver,
  deleteDriver,
  fetchDrivers,
  fetchSupervisor,
  updateDriver,
} from './data/drivers'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import SearchInput from '../components/SearchInput'
import AddDriverModel from './components/AddDriverModel'
import UpdateDriverModel from './components/UpdateDriverModel'
import Swal from 'sweetalert2'
import AddButton from '../components/AddButton'
import ReusableModal from '../components/ReusableModal'
import { toast, ToastContainer } from 'react-toastify'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import IconDropdown from '../Supervisor/IconDropdown'
import usePdfExporter from '../customhooks/usePdfExporter'
import useExcelExporter from '../customhooks/useExcelExporter'
import SingleSelectDropdown from '../components/SingleSelectDropdown'
import { TokenContext } from '../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'

function DriversPage() {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const queryClient = useQueryClient()
  // const [isFetching, setIsFetching] = useState(true)
  const [filteredData, setFilteredData] = useState([])
  const [visible, setVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [editVisible, setEditVisible] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)

  const navigate = useNavigate()

  // from modal
  const [showModalFrom, setShowModalFrom] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [submitEdit, setSubmitEdit] = useState(false)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // Fetch driver
  const { data: drivers = [], isFetching } = useQuery({
    queryKey: ['drivers'],
    queryFn: fetchDrivers,
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  // Add Driver
  const { mutate: addDriverMutation, isLoading: isSubmitting } = useMutation({
    mutationFn: addDriver,
    onSuccess: (data) => {
      // toast.success('Driver added successfully!')
      setShowModalFrom(false)
      queryClient.invalidateQueries(['drivers'])
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message)
    },
  })

  // Edit Driver
  const { mutate: updateDriverMutation, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateDriver(id, data),
    onSuccess: () => {
      // toast.success('Driver updated successfully!')
      queryClient.invalidateQueries(['drivers'])
      setShowModalFrom(false)
      setEditMode(false)
      setEditingUser(null)
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message)
    },
  })

  // Delete driver
  const { mutate: deleteDriverMutation } = useMutation({
    mutationFn: deleteDriver,
    onSuccess: () => {
      // toast.success('Driver deleted successfully!')
      queryClient.invalidateQueries(['drivers'])
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message)
    },
  })

  useEffect(() => {
    let filtered = drivers

    // Filter by supervisor if selected
    if (selectedName?.value) {
      filtered = filtered.filter((driver) => driver.supervisor === selectedName.value)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((driver) =>
        driver.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredData(filtered)
  }, [drivers, selectedName, searchQuery])

  // field from

  const field = [
    {
      name: 'profileImage',
      label: 'Profile Image',
      type: 'file',
      accept: 'image/*',
    },
    {
      name: 'name',
      label: 'Driver Name',
      type: 'text',
      Placeholder: 'Enter Driver Name',
      required: true,
    },
    {
      name: 'contactNumber',
      label: 'Contact Number',
      type: 'number',
      Placeholder: 'Enter Driver Contact Number',
      required: true,
    },
    {
      name: 'email',
      label: 'Email ID',
      type: 'email',
      Placeholder: 'Enter Driver Email Id',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      Placeholder: 'Enter Password',
      required: true,
    },

    // not show in edit from
    ...(!editMode
      ? [
          {
            name: 'licenseNumber',
            label: 'License Number',
            type: 'text',
            Placeholder: 'Enter Driver License Number',
          },
          {
            name: 'aadharNumber',
            label: 'Aadhar Number',
            type: 'text',
            Placeholder: 'Enter Driver Aadhar Number',
          },
        ]
      : []),
  ]

  // Table columns
  const columns = [
    { label: 'Driver Name', key: 'name', sortable: true },
    { label: 'Contact Number', key: 'contactNumber', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Password', key: 'password', sortable: false },
  ]

  // Handle view button click
  const handleViewButton = (id) => {
    navigate(`/DriverProfile/${id}`)
  }

  // handle edit
  const handleEditButton = (id) => {
    console.log('Driver data:', id) //
    const record = filteredData.find((item) => item.id === id)
    if (record) {
      const driver = drivers.find((d) => d.name === record.name)
    }
    setEditMode(true)
    setEditingUser({
      ...record,
    })
    setShowModalFrom(true)
  }

  // handle delete
  const handleDeleteButton = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this driver!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDriverMutation(id)
      }
    })
  }

  // handle submit
  const handleFormSubmit = (data) => {
    if (editMode && editingUser?.id) {
      Swal.fire({
        title: editMode ? 'Update Driver?' : 'Add New Driver?',
        text: editMode
          ? 'Are you sure you want to update this driver?'
          : 'Are you sure you want to add this driver?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: editMode ? 'Yes, update it!' : 'Yes, add it!',
      }).then((result) => {
        if (result.isConfirmed) {
          updateDriverMutation({ id: editingUser.id, data })
        }
      })
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to add this driver expense?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Add it',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          addDriverMutation(data)
        }
      })
    }
  }

  // Search handler (Filters allData)
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Handle Logout
  const handleLogout = () => {
    // Clear sessionStorage and localStorage
    sessionStorage.clear()
    localStorage.clear()

    // Optional: Clear cookies (will only clear cookies accessible via JavaScript)
    document.cookie.split(';').forEach((c) => {
      const base = c.trim().split('=')[0]
      document.cookie = `${base}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    })

    // Redirect to Credence
    window.history.replaceState(null, '', '/')
    // window.location.href = 'http://localhost:3000'
    window.location.href = import.meta.env.VITE_API_CREDENCE_URL
  }

  // Memoized dropdown items for export
  const dropdownItems = useMemo(
    () => [
      {
        icon: FaRegFilePdf,
        label: 'Download PDF',
        onClick: () =>
          exportToPDF({
            title: 'All Drivers List Report',
            columns,
            data: filteredData,
            fileName: 'Drivers_List_Report',
          }),
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () => {
          exportToExcel({
            title: 'All Drivers List Report',
            columns,
            data: filteredData,
            fileName: 'Drivers_List_Report',
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
    ],
    [filteredData, columns, exportToPDF, exportToExcel],
  )

  console.log('drivers:', drivers)
  console.log('selectedName:', selectedName)
  console.log(
    'Drivers:',
    drivers.map((d) => ({ name: d.name, supervisor: d.supervisor })),
  )
  console.log('Supervisors:', supervisorOptions)

  return (
    <>
      <ToastContainer />

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          {userRole === 'superadmin' && (
            <div style={{ width: '330px' }}>
              <SingleSelectDropdown
                options={supervisorOptions}
                value={selectedName}
                onChange={setSelectedName}
                isClearable
                placeholder="Filter by Supervisor Name..."
              />
            </div>
          )}
        </div>
        <div className="d-flex justify-content-end align-items-center gap-2 w-75">
          <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
          <AddButton
            label="Add Driver"
            onClick={() => {
              setEditMode(false)
              setSubmitEdit(false)
              setEditingUser(null)
              setShowModalFrom(true)
            }}
          />
        </div>
      </div>

      <ReusableModal
        show={showModalFrom}
        initialData={editMode ? editingUser : null}
        onClose={() => {
          setShowModalFrom(false)
          setEditMode(false)
          setEditingUser(null)
        }}
        onSubmit={handleFormSubmit}
        title={editMode ? 'Edit Driver Expense' : 'Add New Driver Expense'}
        size="xl"
        fields={field}
        isSubmitting={isSubmitting || isUpdating}
      />

      <Table
        title="Drivers"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        viewButton={true}
        handleViewButton={handleViewButton}
        isFetching={isFetching}
        editButton={true}
        handleEditButton={handleEditButton}
        deleteButton={true}
        handleDeleteButton={handleDeleteButton}
        viewButtonLabel="Profile"
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
      <AddDriverModel visible={visible} setVisible={setVisible} />
      <UpdateDriverModel
        visible={editVisible}
        setVisible={(val) => {
          setEditVisible(val)
          if (!val) setSelectedDriver(null) // Clear driver when modal is closed
        }}
        driver={selectedDriver}
      />

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default DriversPage
