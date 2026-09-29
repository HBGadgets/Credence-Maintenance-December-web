import React, { useEffect, useMemo, useState } from 'react'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteRailHeadApi, getRailHeadApi, patchRailHeadApi } from '../data/data'
import { toast, ToastContainer } from 'react-toastify'
import Swal from 'sweetalert2'
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
    refetchOnMount: 'always',
    staleTime: 0,
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

  // ========== DELETE MUTATION ==========
  const { mutate: deleteRailHead } = useMutation({
    mutationFn: (id) => deleteRailHeadApi(id),
    onSuccess: () => {
      toast.success('Railhead Inventory deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['RailHead'] })
    },
    onError: (error) => {
      toast.error(error.message || 'Delete failed')
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

// Truncate to 3 decimal places without rounding up (e.g. 0.949999 -> 0.949)
const truncateTo3Decimals = (val) => {
  if (val === undefined || val === null || val === '') return ''
  const str = val.toString()
  if (str.includes('.')) {
    const [intPart, decPart] = str.split('.')
    return `${intPart}.${decPart.slice(0, 3)}`
  }
  return str
}

// Calculate quantity in MT from bag size and total bags
const calculateQuantityFromBags = (bagSize, totalBags) => {
  const bSize = parseFloat(bagSize)
  const tBags = parseFloat(totalBags)
  if (isNaN(bSize) || isNaN(tBags) || bSize <= 0 || tBags <= 0) return ''
  const quantityInMT = (bSize * tBags) / 1000
  return truncateTo3Decimals(quantityInMT)
}

// Calculate total bags from bag size and quantity in MT
const calculateBagsFromQuantity = (bagSize, quantityMT) => {
  const bSize = parseFloat(bagSize)
  const qMT = parseFloat(quantityMT)
  if (isNaN(bSize) || isNaN(qMT) || bSize <= 0 || qMT <= 0) return ''
  const totalBags = (qMT * 1000) / bSize
  return Math.round(totalBags).toString()
}

// Calculate bag size from total bags and quantity in MT
const calculateBagSizeFromQuantityAndBags = (quantityMT, totalBags) => {
  const qMT = parseFloat(quantityMT)
  const tBags = parseFloat(totalBags)
  if (isNaN(qMT) || isNaN(tBags) || qMT <= 0 || tBags <= 0) return ''
  const bagSize = (qMT * 1000) / tBags
  return bagSize.toFixed(2)
}

  // Modal form fields with auto-calculation between totalBags, quantityMT, and bagSize
  const fields = useMemo(
    () => [
      {
        name: 'productName',
        label: 'Product Name',
        type: 'text',
        required: true,
      },
      {
        name: 'bagSize',
        label: 'Bag Size (Kg per bag)',
        type: 'number',
        required: true,
        readOnly: true,
        helperText: 'Weight per bag in kilograms',
        onChange: (value, currentData) => {
          const totalBags = currentData.totalBags
          const quantityMT = currentData.quantityMT
          if (value && totalBags && parseFloat(totalBags) > 0) {
            return { quantityMT: calculateQuantityFromBags(value, totalBags) }
          } else if (value && quantityMT && parseFloat(quantityMT) > 0) {
            return { totalBags: calculateBagsFromQuantity(value, quantityMT) }
          }
          return null
        },
      },
      {
        name: 'totalBags',
        label: 'Total Bags',
        type: 'number',
        min: '0',
        required: true,
        helperText: 'Total number of bags',
        onChange: (value, currentData) => {
          const bagSize = currentData.bagSize
          if (!value || isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
            return { quantityMT: '' }
          }
          if (bagSize && parseFloat(bagSize) > 0) {
            return { quantityMT: calculateQuantityFromBags(bagSize, value) }
          }
          return null
        },
      },
      {
        name: 'quantityMT',
        label: 'Quantity(MT)',
        type: 'number',
        step: '0.001',
        min: '0',
        required: true,
        helperText: 'Quantity in Metric Ton',
        onChange: (value, currentData) => {
          const bagSize = currentData.bagSize
          if (!value || isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
            return { totalBags: '' }
          }
          if (bagSize && parseFloat(bagSize) > 0) {
            return { totalBags: calculateBagsFromQuantity(bagSize, value) }
          }
          return null
        },
      },
    ],
    [],
  )

  // ========== EDIT BUTTON ==========
  const handleEditButton = (id) => {
    const record = filteredData.find((item) => item._id === id || item.id === id) // Check both _id and id

    if (!record) {
      toast.error('Record not found!')
      return
    }

    const totalBagsValue =
      record.totalBags !== undefined && record.totalBags !== null
        ? record.totalBags
        : record.totalbags !== undefined && record.totalbags !== null
          ? record.totalbags
          : record.bags !== undefined && record.bags !== null
            ? record.bags
            : record.totalBagsCount !== undefined && record.totalBagsCount !== null
              ? record.totalBagsCount
              : ''

    const quantityValue =
      record.quantityMT !== undefined && record.quantityMT !== null
        ? record.quantityMT
        : record.quantity !== undefined && record.quantity !== null
          ? record.quantity
          : record.totalQuantity !== undefined && record.totalQuantity !== null
            ? record.totalQuantity
            : record.quantityKg !== undefined && record.quantityKg !== null
              ? record.quantityKg
              : ''

    const bagSizeValue =
      record.bagSize !== undefined && record.bagSize !== null
        ? record.bagSize
        : record.bagWeight !== undefined && record.bagWeight !== null
          ? record.bagWeight
          : record.bagSizeKg !== undefined && record.bagSizeKg !== null
            ? record.bagSizeKg
            : ''

    // Map the record data to match the form field names
    const mappedRecord = {
      ...record,
      productName: record.productName || record.name || '',
      quantityMT: quantityValue,
      quantity: quantityValue,
      bagSize: bagSizeValue,
      totalBags: totalBagsValue,
      totalbags: totalBagsValue,
      bags: totalBagsValue,
      id: record._id || record.id, // Use _id if it exists, otherwise use id
    }

    setEditMode(true)
    setEditingData(mappedRecord)
    setShowModalFrom(true)
  }

  // ========== DELETE BUTTON ==========
  const handleDeleteButton = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRailHead(id)
      }
    })
  }

  // Submit form (Edit only)
  const handleFormSubmit = (formValues) => {
    if (editMode && editingData?.id) {
      const qty = Number(formValues.quantityMT ?? formValues.quantity ?? 0)
      const bags = Number(formValues.totalBags ?? formValues.totalbags ?? formValues.bags ?? 0)
      const bagSz = Number(formValues.bagSize ?? 0)

      // Create proper form data object matching API expectations
      const formData = {
        productName: formValues.productName,
        quantityMT: qty,
        quantity: qty,
        bagSize: bagSz,
        totalBags: bags,
        totalbags: bags,
        bags: bags,
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
        deleteButton={true}
        handleDeleteButton={handleDeleteButton}
        serverPagination={true}
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