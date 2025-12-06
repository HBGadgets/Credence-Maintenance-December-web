import React, { useEffect, useMemo, useState } from 'react'
import {
  deleteWarehouseApi,
  getWarehouseApi,
  patchWarehouseApi,
  postWarehouseApi,
} from '../data/data'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import SearchInput from '../../components/SearchInput'
import AddButton from '../../components/AddButton'
import ReusableModal from '../../components/ReusableModal'
import { toast, ToastContainer } from 'react-toastify'
import Swal from 'sweetalert2'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { HiOutlineLogout } from 'react-icons/hi'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import IconDropdown from '../../Supervisor/IconDropdown'

const Godown = () => {
  const queryClient = useQueryClient()
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  // Modal states
  const [showModalFrom, setShowModalFrom] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingData, setEditingData] = useState(null)

  // Fetch warehouse list
  const { data: warehouseRes, isFetching } = useQuery({
    queryKey: ['warehouse', { search: searchQuery, page: currentPage, limit: itemsPerPage }],
    queryFn: getWarehouseApi,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 30, // Cache data for 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  })

  // POST
  const { mutate: postWarehouse, isLoading: isSubmitting } = useMutation({
    mutationFn: postWarehouseApi,
    onSuccess: () => {
      toast.success('Warehouse added successfully!')
      queryClient.invalidateQueries(['warehouse'])
      setShowModalFrom(false)
    },
    onError: (error) => toast.error(error.message),
  })

  // PATCH
  const { mutate: patchWarehouse, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, formData }) => patchWarehouseApi(id, formData),
    onSuccess: () => {
      toast.success('Warehouse updated successfully!')
      queryClient.invalidateQueries(['warehouse'])
      setShowModalFrom(false)
      setEditMode(false)
      setEditingData(null)
    },
    onError: (error) => toast.error(error.message),
  })

  // DELETE
  const { mutate: deleteWarehouse } = useMutation({
    mutationFn: deleteWarehouseApi,
    onSuccess: () => {
      toast.success('Warehouse deleted successfully!')
      queryClient.invalidateQueries(['warehouse'])
    },
    onError: (error) => toast.error(error.message),
  })

  // Filter + Search
  useEffect(() => {
    if (warehouseRes?.data) {
      setFilteredData(warehouseRes.data)
    }
  }, [warehouseRes])

  const totalPages = warehouseRes?.totalPages || 1

  // Table columns
  const columns = [
    { label: 'WareHouse Name', key: 'wareHouseName', sortable: true },
    { label: 'Location', key: 'location', sortable: true },
    { label: 'Capacity Kg', key: 'capacityKg', sortable: true },
  ]

  // Modal form fields
  const fields = [
    {
      name: 'wareHouseName',
      label: 'Warehouse Name',
      type: 'text',
      placeholder: 'Enter Warehouse Name',
      required: true,
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'Enter Location',
      required: true,
    },
    {
      name: 'capacityKg',
      label: 'Capacity (KG)',
      type: 'number',
      placeholder: 'Enter Capacity',
      required: true,
    },
  ]

  // Memoized dropdown items for export
  const dropdownItems = useMemo(
    () => [
      {
        icon: FaRegFilePdf,
        label: 'Download PDF',
        onClick: () =>
          exportToPDF({
            title: 'All Godown Report',
            columns,
            data: filteredData,
            fileName: 'Godown_Report',
          }),
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () => {
          exportToExcel({
            title: 'All Godown Report',
            columns,
            data: filteredData,
            fileName: 'Godown_Report',
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

  // Submit form (Add + Edit)
  const handleFormSubmit = (formValues) => {
    if (editMode) {
      patchWarehouse({
        id: editingData.id,
        formData: formValues,
      })
    } else {
      postWarehouse(formValues)
    }
  }

  // EDIT handler
  const handleEditButton = (id) => {
    const record = filteredData.find((item) => item.id === id)

    if (!record) {
      toast.error('Record not found!')
      return
    }

    setEditMode(true)
    setEditingData(record)
    setShowModalFrom(true)
  }

  // DELETE handler (Swal + toast)
  const handleDeleteButton = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteWarehouse(id)
      }
    })
  }

  return (
    <div>
      <ToastContainer />

      <div className="mb-3 d-flex justify-content-end align-items-center gap-2 w-100">
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <AddButton
          label="Add"
          onClick={() => {
            setEditMode(false)
            setEditingData(null)
            setShowModalFrom(true)
          }}
        />
      </div>

      <ReusableModal
        show={showModalFrom}
        initialData={editMode ? editingData : null}
        onClose={() => {
          setShowModalFrom(false)
          setEditMode(false)
          setEditingData(null)
        }}
        onSubmit={handleFormSubmit}
        title={editMode ? 'Edit Warehouse' : 'Add New Warehouse'}
        size="xl"
        fields={fields}
        isSubmitting={isSubmitting || isUpdating}
      />

      <Table
        title="Warehouse Section"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        editButton={true}
        deleteButton={true}
        handleEditButton={handleEditButton}
        handleDeleteButton={handleDeleteButton}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          const newItems = value === -1 ? filteredData.length : value
          setItemsPerPage(newItems)
          setCurrentPage(1)
        }}
      />
      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </div>
  )
}

export default Godown
