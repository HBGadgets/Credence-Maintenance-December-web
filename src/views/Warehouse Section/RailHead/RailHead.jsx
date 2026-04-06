import React, { useEffect, useMemo, useState } from 'react'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getRailHeadApi, patchRailHeadApi } from '../data/data'
import { toast, ToastContainer } from 'react-toastify'
import ReusableModal from '../../components/ReusableModal'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import IconDropdown from '../../Supervisor/IconDropdown'

const RailHead = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState([])

  const [showModalFrom, setShowModalFrom] = useState(false) // Fixed variable name
  const [editMode, setEditMode] = useState(false) // Fixed variable name
  const [editingData, setEditingData] = useState(null) // Fixed variable name

  // Add QueryClient
  const queryClient = useQueryClient()

  const { data, isFetching } = useQuery({
    queryKey: ['RailHead', { search: searchQuery, page: currentPage, limit: itemsPerPage }],
    queryFn: getRailHeadApi,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 1, // 1 minute (data is fresh for 1 min)
    cacheTime: 1000 * 60 * 1, // 1 minute (kept in memory after unmount)
  })

  // ========== PATCH MUTATION ==========
  const { mutate: patchRailHead, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, formData }) => patchRailHeadApi(id, formData),
    onSuccess: () => {
      toast.success('Railhead Inventory updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['RailHead'] })
      setShowModalFrom(false)
      setEditMode(false)
      setEditingData(null)
    },
    onError: (error) => {
      toast.error(error.message || 'Update failed')
    },
  })

  useEffect(() => {
    if (data?.data) {
      setFilteredData(data.data)
    }
  }, [data])

  const columns = [
    { label: 'Date', key: 'createdAt', sortable: true },
    { label: 'Product Name', key: 'productName', sortable: true },
    // { label: 'Product id', key: 'productId', sortable: true },
    { label: 'Bag Size', key: 'bagSize', sortable: true },
    { label: 'Total Bags', key: 'totalBags', sortable: true },
    { label: 'Quantity(MT)', key: 'quantityMT', sortable: true },
  ]

  // Modal form fields - Fixed field names
  const fields = [
    {
      name: 'productName',
      label: 'Product Name',
      type: 'text',
      required: true,
    },
    {
      name: 'quantityMT',
      label: 'Quantity(MT)',
      type: 'text',
      required: true,
    },
  ]

  // ========== EDIT BUTTON ==========
  const handleEditButton = (id) => {
    const record = filteredData.find((item) => item._id === id || item.id === id) // Check both _id and id

    if (!record) {
      toast.error('Record not found!')
      return
    }

    // Map the record data to match the form field names
    const mappedRecord = {
      productName: record.productName,
      quantityMT: record.quantityMT,
      bagSize: record.bagSize,
      totalBags: record.totalBags,
      id: record._id || record.id, // Use _id if it exists, otherwise use id
    }

    setEditMode(true)
    setEditingData(mappedRecord)
    setShowModalFrom(true)
  }

  // Submit form (Edit only)
  const handleFormSubmit = (formValues) => {
    if (editMode && editingData?.id) {
      // Create proper form data object matching your API expectations
      const formData = {
        productName: formValues.productName,
        quantityMT: Number(formValues.quantityMT),
        bagSize: Number(formValues.bagSize),
        totalBags: Number(formValues.totalBags),
      }

      patchRailHead({
        id: editingData.id,
        formData: formData,
      })
    }
  }

  // Memoized dropdown items for export
  const dropdownItems = useMemo(
    () => [
      {
        icon: FaRegFilePdf,
        label: 'Download PDF',
        onClick: () =>
          exportToPDF({
            title: 'All Railhead Inventory Report',
            columns,
            data: filteredData,
            fileName: 'Railhead_Inventory_Report',
          }),
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () => {
          exportToExcel({
            title: 'All Railhead Inventory Report',
            columns,
            data: filteredData,
            fileName: 'Railhead_Inventory_Report',
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

  return (
    <div>
      <ToastContainer />

      <div className="mb-4 d-flex justify-content-end">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search products..."
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
        title={editMode ? 'Edit Railhead Inventory' : 'Add New Railhead Inventory'}
        size="xl"
        fields={fields}
        isSubmitting={isUpdating} // Use isUpdating instead of isSubmitting
      />

      <Table
        title="Rail Head Inventory"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        editButton={true}
        handleEditButton={handleEditButton}
      />

      <SmartPagination
        totalPages={data?.totalPages || 1}
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

export default RailHead
