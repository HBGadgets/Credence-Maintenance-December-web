import React, { useEffect, useState } from 'react'
import {
  deleteInventoryProductListApi,
  getInventoryApi,
  getInventoryProductListApi,
  getWarehouseListApi,
  patchInventoryProductListApi,
  postInvenotryProductListApi,
} from '../data/data'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AddButton from '../../components/AddButton'
import SearchInput from '../../components/SearchInput'
import { ToastContainer, toast } from 'react-toastify'
import Swal from 'sweetalert2'
import InventoryModal from './component/InventoryModal'

const InventoryList = () => {
  const queryClient = useQueryClient()

  const [filteredData, setFilteredData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Modal states
  const [showModalFrom, setShowModalFrom] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingData, setEditingData] = useState(null)

  // Form state for multiple products
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null)
  const [products, setProducts] = useState([{ productId: '', quantityKg: '', bagSizeKg: '' }])

  // Fetch Inventory product list
  const { data: getInventoryProductList, isFetching } = useQuery({
    queryKey: [
      'getInventoryProductList',
      { search: searchQuery, page: currentPage, limit: itemsPerPage },
    ],
    queryFn: getInventoryProductListApi,
    keepPreviousData: true,
  })

  // Fetch Product list
  const { data: inventoryList, isFetch } = useQuery({
    queryKey: ['inventoryList', { search: searchQuery, page: currentPage, limit: itemsPerPage }],
    queryFn: getInventoryApi,
    keepPreviousData: true,
  })

  // Warehouse list
  const { data: getWarehouseList, isFetched } = useQuery({
    queryKey: ['getWarehouseList', { search: searchQuery, page: currentPage, limit: itemsPerPage }],
    queryFn: getWarehouseListApi,
    keepPreviousData: true,
  })

  // ========== POST ==========
  const { mutate: postInvenotryProductList, isLoading: isSubmitting } = useMutation({
    mutationFn: postInvenotryProductListApi,
    onSuccess: () => {
      toast.success('Inventory added successfully!')
      queryClient.invalidateQueries({ queryKey: ['getInventoryProductList'], exact: false })
      setShowModalFrom(false)
      resetForm()
    },
    onError: (error) => toast.error(error.message),
  })

  // ========== PATCH ==========
  const { mutate: patchInventoryProductList, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, formData }) => patchInventoryProductListApi(id, formData),
    onSuccess: () => {
      toast.success('Inventory updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['getInventoryProductList'], exact: false })
      setShowModalFrom(false)
      setEditMode(false)
      setEditingData(null)
      resetForm()
    },
    onError: (error) => toast.error(error.message),
  })

  // ========== DELETE ==========
  const { mutate: deleteInventoryProductList } = useMutation({
    mutationFn: deleteInventoryProductListApi,
    onSuccess: () => {
      toast.success('Inventory deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['getInventoryProductList'], exact: false })
    },
    onError: (error) => toast.error(error.message),
  })

  // Set filtered data when API returns
  useEffect(() => {
    if (getInventoryProductList?.data) {
      setFilteredData(getInventoryProductList.data)
    }
  }, [getInventoryProductList])

  // Reset form
  const resetForm = () => {
    setSelectedWarehouseId(null)
    setProducts([{ productId: '', quantityKg: '', bagSizeKg: '' }])
  }

  const totalPages = getInventoryProductList?.totalPages || 1

  // Table columns
  const columns = [
    { label: 'Warehouse Name', key: 'wareHouseName', sortable: true },
    { label: 'Location', key: 'location', sortable: true },
    { label: 'Capacity Kg', key: 'capacityKg', sortable: true },
    { label: 'Product Name', key: 'productName', sortable: true },
    { label: 'Quantity Kg', key: 'quantityKg', sortable: true },
    { label: 'Bag Size Kg', key: 'bagSizeKg', sortable: true },
    { label: 'Total Bags', key: 'totalBags', sortable: true },
    { label: 'Total Quantity Kg', key: 'totalQuantityKg', sortable: true },
  ]

  // Handle add product row
  const handleAddProduct = () => {
    setProducts([...products, { productId: '', quantityKg: '', bagSizeKg: '' }])
  }

  // Handle remove product row
  const handleRemoveProduct = (index) => {
    if (products.length > 1) {
      const updatedProducts = products.filter((_, i) => i !== index)
      setProducts(updatedProducts)
    }
  }

  // Handle product field change
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products]
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    }
    setProducts(updatedProducts)
  }

  // Handle edit
  const handleEditButton = (id) => {
    // First, check if filteredData has the item
    let record = filteredData.find((item) => item.id === id)

    // If not found in filteredData, try to find it in the original API response
    if (!record && getInventoryProductList?.data) {
      record = getInventoryProductList.data.find((item) => item.id === id)
    }

    // If still not found, try by different property names
    if (!record && getInventoryProductList?.data) {
      record = getInventoryProductList.data.find(
        (item) => item._id === id || item.warehouseProductId === id || item.inventoryId === id,
      )
    }

    if (!record) {
      toast.error('Record not found!')
      return
    }

    // Use the actual ID from the record (not the parameter if it might be wrong)
    const actualId = record.id || record._id || record.warehouseProductId || record.inventoryId

    setEditingData({ ...record, actualId })
    setEditMode(true)

    // Find warehouse by name from your warehouse list
    if (getWarehouseList?.data && record.wareHouseName) {
      const warehouse = getWarehouseList.data.find((w) => w.wareHouseName === record.wareHouseName)
      setSelectedWarehouseId(warehouse?.id || null)
    } else {
      setSelectedWarehouseId(null)
    }

    // Set product (only one for edit mode)
    setProducts([
      {
        productId: record.productId || '',
        quantityKg: record.quantityKg || '',
        bagSizeKg: record.bagSizeKg || '',
      },
    ])

    setShowModalFrom(true)
  }

  // Handle Delete
  const handleDeleteButton = (id) => {
    console.log('Delete ID received:', id) // Debug log

    if (!id) {
      toast.error('Cannot delete: ID is undefined')
      return
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteInventoryProductList(id)
      }
    })
  }

  // Submit form
  const handleFormSubmit = () => {
    // Validate warehouse selection
    if (!selectedWarehouseId) {
      toast.error('Please select a warehouse')
      return
    }

    // Validate products
    const validProducts = products.filter((p) => p.productId && p.quantityKg && p.bagSizeKg)

    if (validProducts.length === 0) {
      toast.error('Please add at least one product')
      return
    }

    // Check if any product has incomplete data
    const incompleteProduct = products.find(
      (p) =>
        (p.productId && (!p.quantityKg || !p.bagSizeKg)) ||
        (p.quantityKg && (!p.productId || !p.bagSizeKg)) ||
        (p.bagSizeKg && (!p.productId || !p.quantityKg)),
    )

    if (incompleteProduct) {
      toast.error('Please complete all fields for each product')
      return
    }

    // Prepare payload according to your API structure
    const payload = {
      warehouseId: selectedWarehouseId,
      products: validProducts.map((product) => ({
        productId: product.productId,
        quantityKg: Number(product.quantityKg),
        bagSizeKg: Number(product.bagSizeKg),
      })),
    }

    if (editMode && editingData) {
      // Use the actualId from editingData
      const idToUpdate = editingData.actualId || editingData.id || editingData._id

      if (!idToUpdate) {
        toast.error('Cannot update: Record ID not found')
        return
      }

      patchInventoryProductList({
        id: idToUpdate,
        formData: payload,
      })
    } else {
      postInvenotryProductList(payload)
    }
  }

  // Prepare options for the modal
  const warehouseOptions =
    getWarehouseList?.data?.map((war) => ({
      label: war.wareHouseName,
      value: war.id,
    })) || []

  const productOptions =
    inventoryList?.data?.map((p) => ({
      label: p.productName,
      value: p.id,
    })) || []

  const handleModalClose = () => {
    setShowModalFrom(false)
    setEditMode(false)
    setEditingData(null)
  }

  return (
    <>
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

      {/* Use the separated modal component */}
      <InventoryModal
        show={showModalFrom}
        editMode={editMode}
        selectedWarehouseId={selectedWarehouseId}
        setSelectedWarehouseId={setSelectedWarehouseId}
        products={products}
        setProducts={setProducts}
        handleAddProduct={handleAddProduct}
        handleRemoveProduct={handleRemoveProduct}
        handleProductChange={handleProductChange}
        handleFormSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        isUpdating={isUpdating}
        warehouseOptions={warehouseOptions}
        productOptions={productOptions}
        onClose={handleModalClose}
        resetForm={resetForm}
      />

      <Table
        title="Inventory List"
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
    </>
  )
}

export default InventoryList
