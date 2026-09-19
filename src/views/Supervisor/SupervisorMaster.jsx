import React, { useMemo, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Table from '../components/Table'
import SmartPagination from '../components/SmartPagination'
import AddButton from '../components/AddButton'
import SearchInput from '../components/SearchInput'
import ReusableModal from '../components/ReusableModal'
import IconDropdown from './IconDropdown'
import { toast, ToastContainer } from 'react-toastify'
import Swal from 'sweetalert2'
import { Shield } from 'lucide-react'
import { FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import usePdfExporter from '../customhooks/usePdfExporter'
import useExcelExporter from '../customhooks/useExcelExporter'
import SingleSelectDropdown from '../components/SingleSelectDropdown'
import SupervisorPermissionsModal from './SupervisorPermissionsModal'
import {
  getSupervisorsApi,
  postSupervisorApi,
  patchSupervisorApi,
  deleteSupervisorApi,
  getSchoolDropdownApi,
  getBranchDropdownApi,
} from './data/supervisorMasterData'

const SupervisorMaster = () => {
  const queryClient = useQueryClient()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState([])

  // Modal form states
  const [showModalForm, setShowModalForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingSupervisor, setEditingSupervisor] = useState(null)

  // Permissions modal states
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [selectedSupervisorForPermissions, setSelectedSupervisorForPermissions] = useState(null)

  // Admin & Branch filter states
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState(null)

  // Fetch school (Admin) options from VTS Backend
  const { data: schoolOptions = [] } = useQuery({
    queryKey: ['schoolDropdownOptions'],
    queryFn: getSchoolDropdownApi,
    staleTime: 1000 * 60 * 15,
  })

  // Fetch branch options for filter
  const { data: filterBranchOptions = [] } = useQuery({
    queryKey: ['filterBranchOptions', selectedSchool?.value],
    queryFn: () => getBranchDropdownApi(selectedSchool?.value),
    enabled: Boolean(selectedSchool?.value),
    staleTime: 1000 * 60 * 15,
  })

  // Modal branch state and options
  const [modalSchoolId, setModalSchoolId] = useState(null)

  const { data: modalBranchOptions = [] } = useQuery({
    queryKey: ['modalBranchOptions', modalSchoolId],
    queryFn: () => getBranchDropdownApi(modalSchoolId),
    enabled: Boolean(modalSchoolId),
    staleTime: 1000 * 60 * 15,
  })

  // Fetch supervisors via /supervisor-role/all-users?page=1&limit=10&search=city
  const {
    data: supervisorList = [],
    isFetching,
    error,
  } = useQuery({
    queryKey: ['supervisorMasterList', currentPage, itemsPerPage, searchQuery],
    queryFn: () =>
      getSupervisorsApi({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  })

  const serverPagination = supervisorList?.pagination

  // Create supervisor mutation
  const { mutate: addSupervisor, isLoading: isSubmitting } = useMutation({
    mutationFn: postSupervisorApi,
    onSuccess: () => {
      toast.success('Supervisor added successfully!')
      setShowModalForm(false)
      queryClient.invalidateQueries(['supervisorMasterList'])
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to add supervisor')
    },
  })

  // Update supervisor mutation
  const { mutate: updateSupervisor, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, formData }) => patchSupervisorApi(id, formData),
    onSuccess: () => {
      toast.success('Supervisor updated successfully!')
      setShowModalForm(false)
      setEditMode(false)
      setEditingSupervisor(null)
      queryClient.invalidateQueries(['supervisorMasterList'])
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update supervisor')
    },
  })

  // Delete supervisor mutation
  const { mutate: deleteSupervisor } = useMutation({
    mutationFn: deleteSupervisorApi,
    onSuccess: () => {
      toast.success('Supervisor deleted successfully!')
      queryClient.invalidateQueries(['supervisorMasterList'])
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete supervisor')
    },
  })

  // Search, Admin, and Branch filtering
  useEffect(() => {
    if (supervisorList) {
      let filtered = supervisorList.map((item) => {
        let schoolName = item.schoolName
        if (!schoolName && item.schoolId) {
          const matched = schoolOptions.find((s) => s.value === item.schoolId)
          if (matched) {
            schoolName = matched.label
          }
        }
        return {
          ...item,
          schoolName: schoolName || 'N/A',
          branchName: item.branchName || 'N/A',
        }
      })

      // Filter by Admin (School) dropdown
      if (selectedSchool?.value) {
        filtered = filtered.filter(
          (item) =>
            item.schoolId === selectedSchool.value ||
            item.schoolName?.toLowerCase() === selectedSchool.label?.toLowerCase(),
        )
      }

      // Filter by Branch dropdown
      if (selectedBranch?.value) {
        filtered = filtered.filter(
          (item) =>
            item.branchId === selectedBranch.value ||
            item.branchName?.toLowerCase() === selectedBranch.label?.toLowerCase(),
        )
      }

      setFilteredData(filtered)
    }
  }, [supervisorList, selectedSchool, selectedBranch, schoolOptions])

  const totalPages =
    serverPagination?.totalPages ||
    Math.ceil((serverPagination?.total || filteredData.length) / itemsPerPage) ||
    1

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleEditButton = (row) => {
    setEditMode(true)
    setEditingSupervisor(row)
    setModalSchoolId(row.schoolId || null)
    setShowModalForm(true)
  }

  const handleDeleteButton = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this supervisor!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSupervisor(id)
      }
    })
  }

  const handleOpenPermissions = (supervisor) => {
    setSelectedSupervisorForPermissions(supervisor)
    setShowPermissionsModal(true)
  }

  const handleFormSubmit = (formData) => {
    const matchedSchool = schoolOptions.find((s) => s.value === formData.schoolId)
    const matchedBranch = modalBranchOptions.find((b) => b.value === formData.branchId)
    const payload = {
      ...formData,
      schoolName: matchedSchool?.label || formData.schoolName || '',
      branchName: matchedBranch?.label || formData.branchName || '',
    }

    if (editMode && editingSupervisor?.id) {
      updateSupervisor({ id: editingSupervisor.id, formData: payload })
    } else {
      addSupervisor(payload)
    }
  }

  const columns = [
    { label: 'Supervisor Name', key: 'name', sortable: true },
    { label: 'Admin', key: 'schoolName', sortable: true },
    { label: 'Branch', key: 'branchName', sortable: true },
    { label: 'Mobile / Contact', key: 'mobile', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Role', key: 'role', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
    { label: 'Created At', key: 'createdAt', sortable: true },
  ]

  const fields = [
    {
      name: 'schoolId',
      label: 'Admin',
      type: 'select',
      options: schoolOptions,
      required: false,
      placeholder: 'Select Admin...',
      clearFields: ['branchId'],
      onChange: (selectedOption) => {
        setModalSchoolId(selectedOption?.value || null)
      },
    },
    {
      name: 'branchId',
      label: 'Branch',
      type: 'select',
      options: modalBranchOptions,
      required: false,
      placeholder: modalSchoolId ? 'Select Branch...' : 'Select Admin first...',
      disabled: !modalSchoolId,
    },
    {
      name: 'name',
      label: 'Supervisor Name',
      type: 'text',
      required: true,
    },
    {
      name: 'mobile',
      label: 'Mobile / Contact Number',
      type: 'phone',
      required: true,
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
    },
    {
      name: 'password',
      label: editMode ? 'New Password (leave blank to keep current)' : 'Password',
      type: 'password',
      required: !editMode,
    },
  ]

  const dropdownItems = useMemo(
    () => [
      {
        icon: FaRegFilePdf,
        label: 'Download PDF',
        onClick: () => {
          const exportCols = [
            { label: 'Supervisor Name', key: 'name' },
            { label: 'Admin', key: 'schoolName' },
            { label: 'Branch', key: 'branchName' },
            { label: 'Contact', key: 'mobile' },
            { label: 'Email', key: 'email' },
            { label: 'Role', key: 'role' },
            { label: 'Status', key: 'status' },
            { label: 'Created Date', key: 'createdAt' },
          ]
          exportToPDF({
            title: 'Supervisor Master List',
            columns: exportCols,
            data: filteredData,
            fileName: 'Supervisor_Master_List',
          })
        },
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () => {
          const exportCols = [
            { label: 'Supervisor Name', key: 'name' },
            { label: 'Admin', key: 'schoolName' },
            { label: 'Branch', key: 'branchName' },
            { label: 'Contact', key: 'mobile' },
            { label: 'Email', key: 'email' },
            { label: 'Role', key: 'role' },
            { label: 'Status', key: 'status' },
            { label: 'Created Date', key: 'createdAt' },
          ]
          exportToExcel({
            title: 'Supervisor Master List',
            columns: exportCols,
            data: filteredData,
            fileName: 'Supervisor_Master_List',
          })
        },
      },
    ],
    [filteredData, exportToPDF, exportToExcel],
  )

  return (
    <>
      <ToastContainer />

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <AddButton
            label="Add Supervisor"
            onClick={() => {
              setEditMode(false)
              setEditingSupervisor(null)
              setModalSchoolId(null)
              setShowModalForm(true)
            }}
          />

          <div style={{ width: '210px' }}>
            <SingleSelectDropdown
              options={schoolOptions}
              value={selectedSchool}
              onChange={(val) => {
                setSelectedSchool(val)
                setSelectedBranch(null)
              }}
              isClearable
              placeholder="Filter by Admin..."
            />
          </div>

          <div style={{ width: '210px' }}>
            <SingleSelectDropdown
              options={filterBranchOptions}
              value={selectedBranch}
              onChange={setSelectedBranch}
              isClearable
              placeholder={selectedSchool ? 'Filter by Branch...' : 'Select Admin first...'}
              disabled={!selectedSchool}
            />
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearchChange} />
        </div>
      </div>

      <ReusableModal
        show={showModalForm}
        initialData={editingSupervisor}
        onClose={() => {
          setShowModalForm(false)
          setEditMode(false)
          setEditingSupervisor(null)
        }}
        onSubmit={handleFormSubmit}
        title={editMode ? 'Edit Supervisor' : 'Add New Supervisor'}
        fields={fields}
        size="lg"
        isSubmitting={isSubmitting || isUpdating}
      />

      <Table
        title="Supervisor Master"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        serverPagination={true}
        totalServerItems={serverPagination?.total || filteredData.length}
        editButton={false}
        deleteButton={false}
        renderActions={(row) => (
          <button
            type="button"
            className="action-view-button"
            onClick={() => handleOpenPermissions(row)}
            style={{
              backgroundColor: '#198754',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
            title="Manage Supervisor Permissions"
          >
            <Shield size={15} />
            <span>Permissions</span>
          </button>
        )}
        errorMessage={
          error
            ? 'Error fetching supervisors. Please try again later.'
            : filteredData.length === 0 && !isFetching
              ? 'No supervisors found.'
              : ''
        }
      />

      <SupervisorPermissionsModal
        visible={showPermissionsModal}
        supervisor={selectedSupervisorForPermissions}
        onClose={() => {
          setShowPermissionsModal(false)
          setSelectedSupervisorForPermissions(null)
        }}
        onSuccess={() => {
          queryClient.invalidateQueries(['supervisorMasterList'])
        }}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value === -1 ? (serverPagination?.total || 100) : value)
          setCurrentPage(1)
        }}
      />

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default SupervisorMaster
