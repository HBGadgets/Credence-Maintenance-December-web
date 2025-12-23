import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap'
import { fetchDrivers, fetchSupervisor } from '../../../DriverExpert/data/drivers'
import { fetchVehicles } from '../../../vehicle/data/VehicleListData'
import { TokenContext } from '../../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import { useQuery } from '@tanstack/react-query'
import { getWorkerApi } from '../../../TransportPass/data/data'
import Select from 'react-select'
import { getCompanyNameApi } from '../../../TransportPass/data/data'
import CreatableSelect from 'react-select/creatable'
import { getRailHeadApi, getWarehouseListApi } from '../../data/data'
import {
  FaWarehouse,
  FaUserFriends,
  FaCalculator,
  FaBox,
  FaWeight,
  FaInfoCircle,
} from 'react-icons/fa'

const defaultProduct = {
  warehouseId: '',
  warehouseName: '',
  productId: '',
  productName: '',
  quantityKg: '',
  bagSize: '',
  totalBags: '',
  itemWeight: '',
  itemCost: '',
}

const getTodayDate = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const defaultFormData = {
  tpPassType: 'warehouse',
  issuedBy: 'Railhead',
  receivedBy: 'Warehouse/Party',
  receivedByType: '', // 'warehouse' or 'party'
  receivedByWarehouseId: '',
  receivedByWarehouseName: '',
  supervisorId: '',
  workerId: '',
  companyId: '',
  companyName: '',
  companyEmail: '',
  companyMobileNumber: '',
  companyOfficeNumber: '',
  companyAddress: '',
  gstIn: '',
  date: getTodayDate(),
  vehicleId: '',
  vehicleName: '',
  driverId: '',
  driverName: '',
  consignorName: '',
  consignorAddress: '',
  consigneeName: '',
  consigneeAddress: '',
  customerName: '',
  customerAddress: '',
  startLocation: '',
  endLocation: '',
  customerRate: '',
  totalAmount: '',
  transporterRate: '',
  totalTransporterAmount: '',
  transporterRateOn: '',
  customerRateOn: '',
  customerFreight: '',
  transporterFreight: '',
  products: [{ ...defaultProduct }],
}

const WarehouseForm = ({
  show,
  handleClose,
  handleSubmit,
  initialData = {},
  mode = 'add',
  isLoading = false,
  onFormTypeChange,
}) => {
  const [formData, setFormData] = useState(defaultFormData)
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [productDetails, setProductDetails] = useState({}) // Store product details by productId
  const [receivedByOptions] = useState([
    { value: 'warehouse', label: 'Warehouse', icon: <FaWarehouse className="me-2" /> },
    { value: 'party', label: 'Party', icon: <FaUserFriends className="me-2" /> },
  ])

  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  const { data: workerList = [] } = useQuery({
    queryKey: ['workerList'],
    queryFn: getWorkerApi,
    staleTime: 1000 * 60 * 30,
  })

  const { data: companyList = [] } = useQuery({
    queryKey: ['companyList'],
    queryFn: getCompanyNameApi,
    staleTime: 1000 * 60 * 30,
  })

  const { data: warehouseResponse = {} } = useQuery({
    queryKey: ['getWarehouseList', { page: 1, limit: 100 }],
    queryFn: ({ queryKey }) => getWarehouseListApi(queryKey[1]),
    staleTime: 1000 * 60 * 30,
  })

  // Updated API call using getRailHeadApi
  const { data: railHeadData = {}, isFetching: isRailHeadFetching } = useQuery({
    queryKey: ['RailHead', { search: '', page: 1, limit: 100 }],
    queryFn: getRailHeadApi,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 10,
  })

  const warehouseList = warehouseResponse?.data || []
  const inventoryList = railHeadData?.data || [] // Using railHeadData instead of inventoryResponse

  // Extract product details from rail head response
  useEffect(() => {
    if (inventoryList.length > 0) {
      console.log('=== RAIL HEAD DATA ===', inventoryList)

      const details = {}
      inventoryList.forEach((item) => {
        // Use _id as the primary identifier
        const productId = item._id || item.id || item.productId

        if (productId) {
          // Extract data from rail head API response structure
          // Adjust these property names based on your actual API response structure
          details[productId] = {
            // Basic product info
            _id: item._id,
            id: item.id,
            productId: item.productId || item._id,
            productName: item.productName || item.name || 'Unknown Product',

            // Product details from RailHead API
            // Adjust property names based on your actual API response
            quantityKg: item.quantityKg || item.quantity || item.totalQuantity || 0,
            bagSize: item.bagSize || item.bagWeight || 0,
            totalBags: item.totalBags || item.bags || item.totalBagsCount || 0,

            // Other metadata
            __v: item.__v,

            // Calculate derived values
            bagsPerQuantity:
              (item.bagSize || item.bagWeight) > 0
                ? (item.quantityKg || item.quantity || 0) / (item.bagSize || item.bagWeight)
                : 0,
          }

          console.log(`Extracted for ${productId}:`, {
            name: details[productId].productName,
            quantityKg: details[productId].quantityKg,
            bagSize: details[productId].bagSize,
            totalBags: details[productId].totalBags,
          })
        }
      })

      console.log('=== ALL EXTRACTED DETAILS ===', details)
      setProductDetails(details)
    }
  }, [inventoryList])

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const data = await fetchDrivers()
        setDrivers(data || [])
      } catch (error) {
        console.error('Error fetching drivers:', error)
      }
    }

    const loadVehicles = async () => {
      try {
        const data = await fetchVehicles()
        setVehicles(data || [])
      } catch (error) {
        console.error('Error fetching vehicles:', error)
      }
    }

    loadDrivers()
    loadVehicles()
  }, [])

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        ...defaultFormData,
        ...initialData,
        date: initialData.date ? initialData.date.split('T')[0] : getTodayDate(),
        vehicleName: vehicles.find((vehicle) => vehicle.id === initialData.vehicleId)?.name || '',
        driverName: drivers.find((driver) => driver.id === initialData.driverId)?.name || '',
        companyId: initialData.companyId || '',
        products: initialData.products?.map((product) => ({
          ...defaultProduct,
          ...product,
          quantityKg: product.quantityKg?.toString() || '',
          bagSize: product.bagSize?.toString() || '',
          totalBags: product.totalBags?.toString() || '',
          itemWeight: product.itemWeight?.toString() || '',
          itemCost: product.itemCost?.toString() || '',
        })) || [{ ...defaultProduct }],
      })
    } else {
      setFormData(defaultFormData)
    }
  }, [initialData, mode, vehicles, drivers])

  // Auto-fill warehouse in products when receivedByType is 'warehouse'
  useEffect(() => {
    if (
      formData.receivedByType === 'warehouse' &&
      formData.receivedByWarehouseId &&
      formData.issuedBy === 'Railhead'
    ) {
      const updatedProducts = formData.products.map((product) => ({
        ...product,
        warehouseId: formData.receivedByWarehouseId,
        warehouseName: formData.receivedByWarehouseName,
      }))

      // Only update if there's a change to prevent infinite loop
      if (JSON.stringify(updatedProducts) !== JSON.stringify(formData.products)) {
        setFormData((prev) => ({
          ...prev,
          products: updatedProducts,
        }))
      }
    }

    // Clear warehouse in products when receivedByType is 'party'
    if (formData.receivedByType === 'party' && formData.issuedBy === 'Railhead') {
      const hasWarehouseInProducts = formData.products.some(
        (product) => product.warehouseId || product.warehouseName,
      )
      if (hasWarehouseInProducts) {
        const updatedProducts = formData.products.map((product) => ({
          ...product,
          warehouseId: '',
          warehouseName: '',
        }))

        setFormData((prev) => ({
          ...prev,
          products: updatedProducts,
        }))
      }
    }
  }, [
    formData.receivedByType,
    formData.receivedByWarehouseId,
    formData.receivedByWarehouseName,
    formData.issuedBy,
  ])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReceivedByTypeChange = (type) => {
    if (type === 'warehouse') {
      setFormData((prev) => ({
        ...prev,
        receivedByType: 'warehouse',
        receivedBy: 'Warehouse',
        receivedByWarehouseId: '',
        receivedByWarehouseName: '',
        // Reset warehouse in products when switching to warehouse type
        products: prev.products.map((product) => ({
          ...product,
          warehouseId: '',
          warehouseName: '',
        })),
      }))
    } else if (type === 'party') {
      setFormData((prev) => ({
        ...prev,
        receivedByType: 'party',
        receivedBy: 'Party',
        receivedByWarehouseId: '',
        receivedByWarehouseName: '',
        // Clear warehouse in products when switching to party type
        products: prev.products.map((product) => ({
          ...product,
          warehouseId: '',
          warehouseName: '',
        })),
      }))
    }
  }

  const handleWarehouseSelect = (selected) => {
    if (selected) {
      const selectedWarehouse = warehouseList.find(
        (w) => w.id === selected.value || w._id === selected.value,
      )
      setFormData((prev) => ({
        ...prev,
        receivedByWarehouseId: selected.value,
        receivedByWarehouseName:
          selectedWarehouse?.wareHouseName || selectedWarehouse?.name || selected.label,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        receivedByWarehouseId: '',
        receivedByWarehouseName: '',
      }))
    }
  }

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products]

    if (field === 'warehouseId') {
      const selectedWarehouse = warehouseList.find((w) => w.id === value || w._id === value)
      updatedProducts[index] = {
        ...updatedProducts[index],
        warehouseId: value,
        warehouseName: selectedWarehouse?.wareHouseName || selectedWarehouse?.name || '',
      }
    } else if (field === 'productId') {
      console.log('=== PRODUCT SELECTION ===')
      console.log('Selected value:', value)

      // Find the product from rail head list
      const selectedProduct = inventoryList.find(
        (p) => p._id === value || p.id === value || p.productId === value,
      )

      console.log('Found product:', selectedProduct)

      if (selectedProduct) {
        const productName = selectedProduct.productName || selectedProduct.name || 'Unknown Product'

        // Get product details from productDetails state or directly from selectedProduct
        let productDetail = productDetails[value]
        if (!productDetail) {
          // Extract from rail head API structure
          productDetail = {
            productName: productName,
            quantityKg: selectedProduct.quantityKg || selectedProduct.quantity || 0,
            bagSize: selectedProduct.bagSize || selectedProduct.bagWeight || 0,
            totalBags: selectedProduct.totalBags || selectedProduct.totalbags || 0,
          }
        }

        console.log('Product details for form:', productDetail)

        // Update the product in the form
        updatedProducts[index] = {
          ...updatedProducts[index],
          productId: value,
          productName: productName,
          // Auto-fill the quantityKg, bagSize, and totalBags from the selected product
          quantityKg: (selectedProduct.quantityKg || selectedProduct.quantity || '').toString(),
          bagSize: (selectedProduct.bagSize || selectedProduct.bagWeight || '').toString(),
          totalBags: (selectedProduct.totalBags || selectedProduct.totalags || '').toString(),
        }

        console.log('Updated product:', updatedProducts[index])
      } else {
        // If no product found, clear the fields
        updatedProducts[index] = {
          ...updatedProducts[index],
          productId: value,
          productName: '',
          quantityKg: '',
          bagSize: '',
          totalBags: '',
        }
      }
    } else if (field === 'bags') {
      // When bags count changes, calculate totalBags based on bagSize
      const bagsValue = parseFloat(value) || 0
      const currentProduct = updatedProducts[index]
      const bagSize = parseFloat(currentProduct.bagSize) || 0

      // Calculate totalBags if we have bagSize
      let calculatedTotalBags = 0
      if (bagSize > 0) {
        calculatedTotalBags = bagsValue * bagSize
      }

      updatedProducts[index] = {
        ...updatedProducts[index],
        bags: value,
        totalBags:
          calculatedTotalBags > 0 ? calculatedTotalBags.toString() : currentProduct.totalBags,
      }
    } else if (field === 'bagSize') {
      // When bagSize changes, recalculate totalBags based on bags count
      const bagSizeValue = parseFloat(value) || 0
      const currentProduct = updatedProducts[index]
      const bags = parseFloat(currentProduct.bags) || 0

      // Calculate totalBags
      let calculatedTotalBags = 0
      if (bags > 0 && bagSizeValue > 0) {
        calculatedTotalBags = bags * bagSizeValue
      }

      updatedProducts[index] = {
        ...updatedProducts[index],
        bagSize: value,
        totalBags:
          calculatedTotalBags > 0 ? calculatedTotalBags.toString() : currentProduct.totalBags,
      }
    } else if (field === 'totalBags') {
      // When totalBags changes, calculate bags if we have bagSize
      const totalBagsValue = parseFloat(value) || 0
      const currentProduct = updatedProducts[index]
      const bagSize = parseFloat(currentProduct.bagSize) || 0

      let calculatedBags = 0
      if (bagSize > 0 && totalBagsValue > 0) {
        calculatedBags = totalBagsValue / bagSize
      }

      updatedProducts[index] = {
        ...updatedProducts[index],
        totalBags: value,
        bags: calculatedBags > 0 ? Math.round(calculatedBags).toString() : currentProduct.bags,
      }
    } else {
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
      }
    }

    // Don't auto-fill if manually changing warehouse for a specific product
    // Only auto-fill when receivedByType is 'warehouse' and it's not a manual change
    if (
      field !== 'warehouseId' &&
      formData.receivedByType === 'warehouse' &&
      formData.receivedByWarehouseId &&
      formData.issuedBy === 'Railhead'
    ) {
      updatedProducts[index] = {
        ...updatedProducts[index],
        warehouseId: formData.receivedByWarehouseId,
        warehouseName: formData.receivedByWarehouseName,
      }
    }

    setFormData((prev) => ({ ...prev, products: updatedProducts }))
  }

  const addProduct = () => {
    const newProduct = { ...defaultProduct }

    // Auto-fill warehouse if conditions are met
    if (
      formData.receivedByType === 'warehouse' &&
      formData.receivedByWarehouseId &&
      formData.issuedBy === 'Railhead'
    ) {
      newProduct.warehouseId = formData.receivedByWarehouseId
      newProduct.warehouseName = formData.receivedByWarehouseName
    }

    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
    }))
  }

  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      const updatedProducts = [...formData.products]
      updatedProducts.splice(index, 1)
      setFormData((prev) => ({ ...prev, products: updatedProducts }))
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.workerId) {
      alert('Please select an employee')
      return
    }

    if (!formData.companyId) {
      alert('Please select a company')
      return
    }

    if (!formData.startLocation || !formData.endLocation) {
      alert('Please enter both start and end locations')
      return
    }

    // Validate products
    const invalidProducts = formData.products.filter(
      (product) =>
        !product.productId ||
        !product.quantityKg ||
        !product.bagSize ||
        !product.totalBags ||
        !product.itemWeight ||
        !product.itemCost,
    )

    if (invalidProducts.length > 0) {
      alert('Please fill all required fields for all products')
      return
    }

    // Prepare products based on receivedByType
    const preparedProducts = formData.products.map((product) => {
      const baseProduct = {
        ...product,
        quantityKg: parseFloat(product.quantityKg) || 0,
        bags: parseFloat(product.bags) || 0,
        bagSize: parseFloat(product.bagSize) || 0,
        totalBags: parseFloat(product.totalBags) || 0,
        itemWeight: parseFloat(product.itemWeight) || 0,
        itemCost: parseFloat(product.itemCost) || 0,
      }

      // If issued by Railhead and received by party, don't include warehouse fields
      if (formData.issuedBy === 'Railhead' && formData.receivedByType === 'party') {
        const { warehouseId, warehouseName, ...rest } = baseProduct
        return rest
      }

      return baseProduct
    })

    const payload = {
      ...formData,
      tpPassType: 'warehouse',
      companyId: formData.companyId || '',
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      products: preparedProducts,
    }

    // Remove empty warehouseId from products if received by party
    if (formData.issuedBy === 'Railhead' && formData.receivedByType === 'party') {
      payload.products = payload.products.map((product) => {
        const { warehouseId, warehouseName, ...rest } = product
        return rest
      })
    }

    // Ensure warehouseId is not empty string for warehouse type
    if (formData.issuedBy === 'Railhead' && formData.receivedByType === 'warehouse') {
      payload.products = payload.products.map((product) => ({
        ...product,
        warehouseId: product.warehouseId || formData.receivedByWarehouseId,
      }))
    }

    if (userRole !== 'superadmin') {
      delete payload.supervisorId
      delete payload.supervisorName
    }

    handleSubmit(payload)
  }

  const receivedByWarehouseOptions = warehouseList.map((w) => ({
    value: w.id || w._id,
    label: w.wareHouseName || w.name || 'Unnamed Warehouse',
  }))

  const warehouseOptions = warehouseList.map((w) => ({
    value: w.id || w._id,
    label: w.wareHouseName || w.name || 'Unnamed Warehouse',
  }))

  const productOptions = inventoryList.map((p) => {
    const productId = p._id || p.id || p.productId
    const productName = p.productName || p.name || 'Unnamed Product'
    const quantityKg = p.quantityKg || p.quantity || 0
    const bagSize = p.bagSize || p.bagWeight || 0
    const totalBags = p.totalBags || p.bags || 0

    return {
      value: productId,
      label: `${productName} (${quantityKg}kg, ${bagSize}/bag, ${totalBags} bags)`,
      data: p,
    }
  })

  const companyOptions = companyList.map((c) => ({
    value: c.id || c._id,
    label: c.companyName || c.name || 'Unnamed Company',
  }))

  const workerOptions = workerList.map((w) => ({
    value: w.id || w._id,
    label: w.name || 'Unnamed Worker',
    supervisorId: w.supervisorId,
  }))

  const vehicleOptions = vehicles.map((v) => ({
    value: v.id || v._id,
    label: v.name || v.vehicleNumber || 'Unnamed Vehicle',
  }))

  const driverOptions = drivers.map((d) => ({
    value: d.id || d._id,
    label: d.name || 'Unnamed Driver',
  }))

  const getWarehouseValue = (product) => {
    if (!product.warehouseId) return null
    return warehouseOptions.find((opt) => opt.value === product.warehouseId) || null
  }

  const getProductValue = (product) => {
    if (!product.productId) return null
    return productOptions.find((opt) => opt.value === product.productId) || null
  }

  const getCompanyValue = () => {
    if (!formData.companyId) return null
    return companyOptions.find((opt) => opt.value === formData.companyId) || null
  }

  const getWorkerValue = () => {
    if (!formData.workerId) return null
    return workerOptions.find((opt) => opt.value === formData.workerId) || null
  }

  const getVehicleValue = () => {
    if (!formData.vehicleId) return null
    return vehicleOptions.find((opt) => opt.value === formData.vehicleId) || null
  }

  const getDriverValue = () => {
    if (!formData.driverId) return null
    return driverOptions.find((opt) => opt.value === formData.driverId) || null
  }

  const getReceivedByWarehouseValue = () => {
    if (!formData.receivedByWarehouseId) return null
    return (
      receivedByWarehouseOptions.find((opt) => opt.value === formData.receivedByWarehouseId) || null
    )
  }

  // Helper function to check if warehouse section should be shown in products
  const shouldShowWarehouseInProducts = () => {
    if (formData.issuedBy === 'Railhead') {
      if (formData.receivedByType === 'warehouse') {
        return 'auto-filled'
      } else if (formData.receivedByType === 'party') {
        return 'hidden'
      }
    }
    return 'editable'
  }

  const warehouseDisplayMode = shouldShowWarehouseInProducts()

  // Get product details for display
  const getProductDetailForDisplay = (product) => {
    let productDetail = productDetails[product.productId]

    // If not found in productDetails, try to find in inventoryList
    if (!productDetail && product.productId) {
      const productFromList = inventoryList.find(
        (p) =>
          p._id === product.productId ||
          p.id === product.productId ||
          p.productId === product.productId,
      )
      if (productFromList) {
        productDetail = {
          productName: productFromList.productName || productFromList.name || 'Unknown Product',
          quantityKg: productFromList.quantityKg || productFromList.quantity || 0,
          bagSize: productFromList.bagSize || productFromList.bagWeight || 0,
          totalBags: productFromList.totalBags || productFromList.bags || 0,
          bags: productFromList.bags || 0,
          _id: productFromList._id,
        }
      }
    }

    return productDetail
  }

  // Calculate derived values for a product
  const calculateProductDetails = (product, index) => {
    const productDetail = getProductDetailForDisplay(product)
    if (!productDetail) return null

    const bags = parseFloat(product.bags) || 0
    const bagSize = parseFloat(product.bagSize) || 0
    const totalBags = parseFloat(product.totalBags) || 0
    const quantityKg = parseFloat(product.quantityKg) || 0

    // Calculations
    const calculatedTotalBags = bags * bagSize
    const calculatedBagsFromTotal = bagSize > 0 ? totalBags / bagSize : 0
    const calculatedQuantityFromBags = bags * bagSize
    const calculatedBagsFromQuantity = bagSize > 0 ? quantityKg / bagSize : 0
    const bagsPerQuantity = bagSize > 0 ? quantityKg / bagSize : 0

    return {
      productDetail,
      bags,
      bagSize,
      totalBags,
      quantityKg,
      calculatedTotalBags,
      calculatedBagsFromTotal,
      calculatedQuantityFromBags,
      calculatedBagsFromQuantity,
      bagsPerQuantity,
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      centered
      scrollable
      dialogClassName="modal-dialog-scrollable"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <FaWarehouse className="me-2 text-success" />
              <h4 className="mb-0">
                {mode === 'edit' ? 'Edit' : 'Add'} Railhead to Warehouse/Party TP Pass
              </h4>
            </div>
            {mode === 'add' && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => onFormTypeChange(null)}
                disabled={isLoading}
              >
                Change Type
              </Button>
            )}
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="p-4 pt-0"
        style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
      >
        <div className="alert alert-info mb-4">
          <div className="d-flex align-items-center">
            <FaWarehouse className="me-2" />
            <div>
              <strong>TP Pass Type:</strong> Railhead to Warehouse/Party
              <div className="small mt-1">
                <strong>Issued by:</strong> {formData.issuedBy} • <strong>Received by:</strong>{' '}
                {formData.receivedBy}
                {formData.receivedByType && ` (${formData.receivedByType})`}
                {formData.receivedByType === 'warehouse' &&
                  formData.receivedByWarehouseName &&
                  ` • ${formData.receivedByWarehouseName}`}
              </div>
              {warehouseDisplayMode === 'auto-filled' && (
                <div className="small text-success mt-1">
                  <FaWarehouse className="me-1" />
                  Warehouse in products section will be auto-filled from selected warehouse above
                </div>
              )}
              {warehouseDisplayMode === 'hidden' && (
                <div className="small text-warning mt-1">
                  <FaUserFriends className="me-1" />
                  Warehouse field is hidden in products section when received by party
                </div>
              )}
            </div>
          </div>
        </div>

        <Form onSubmit={onSubmit}>
          {/* Issued/Received Section */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Issued & Received Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Label>Issued By</Form.Label>
              <Form.Control
                type="text"
                value="Railhead"
                readOnly
                disabled={isLoading}
                placeholder="Issued by"
                className="bg-light"
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Received By</Form.Label>
              <div>
                <div className="mb-3">
                  <div className="d-flex gap-2">
                    {receivedByOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={
                          formData.receivedByType === option.value ? 'primary' : 'outline-primary'
                        }
                        onClick={() => handleReceivedByTypeChange(option.value)}
                        className="d-flex align-items-center"
                        disabled={isLoading}
                      >
                        {option.icon}
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {formData.receivedByType === 'warehouse' && (
                  <div className="mt-3">
                    <Form.Label>Select Warehouse</Form.Label>
                    <Select
                      value={getReceivedByWarehouseValue()}
                      onChange={handleWarehouseSelect}
                      options={receivedByWarehouseOptions}
                      placeholder="Select Warehouse"
                      isClearable
                      isLoading={isLoading || isRailHeadFetching}
                    />
                    {formData.receivedByWarehouseName && (
                      <Form.Text className="text-success">
                        Selected: {formData.receivedByWarehouseName}
                      </Form.Text>
                    )}
                  </div>
                )}

                {formData.receivedByType === 'party' && (
                  <div className="mt-3">
                    <Form.Label>Party Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.receivedBy}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, receivedBy: e.target.value }))
                      }
                      placeholder="Enter party name"
                      disabled={isLoading}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Select Users */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Select Users</h5>
          <div className="row g-3 mb-4">
            {userRole === 'superadmin' && (
              <div className="col-md-6">
                <Form.Label>Supervisors</Form.Label>
                <Select
                  value={
                    supervisorOptions.find((sup) => sup.value === formData.supervisorId) || null
                  }
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      supervisorId: selected ? selected.value : '',
                      supervisorName: selected ? selected.label : '',
                    }))
                  }
                  options={supervisorOptions}
                  placeholder="Select Supervisor"
                  isClearable
                  isLoading={isLoading || isRailHeadFetching}
                />
              </div>
            )}

            <div className="col-md-6">
              <Form.Label>
                Employees <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Select
                value={getWorkerValue()}
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    workerId: selected ? selected.value : '',
                    workerName: selected ? selected.label : '',
                  }))
                }
                options={workerOptions.filter((w) =>
                  userRole === 'superadmin' ? w.supervisorId === formData.supervisorId : true,
                )}
                placeholder="Select Employee"
                isClearable
                isLoading={isLoading || isRailHeadFetching}
                required
              />
            </div>
          </div>

          {/* Company Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Company Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Label>
                Company Name <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Select
                value={getCompanyValue()}
                onChange={(selected) => {
                  if (selected) {
                    const selectedCompany = companyList.find((c) => c.id === selected.value)
                    setFormData((prev) => ({
                      ...prev,
                      companyId: selectedCompany?.id || '',
                      companyName: selectedCompany?.companyName || '',
                      companyEmail: selectedCompany?.email || '',
                      companyMobileNumber: selectedCompany?.mobileNumber || '',
                      companyOfficeNumber: selectedCompany?.officeNumber || '',
                      companyAddress: selectedCompany?.address || '',
                      gstIn: selectedCompany?.gstNumber || '',
                    }))
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      companyId: '',
                      companyName: '',
                      companyEmail: '',
                      companyMobileNumber: '',
                      companyOfficeNumber: '',
                      companyAddress: '',
                      gstIn: '',
                    }))
                  }
                }}
                options={companyOptions}
                placeholder="Select Company"
                isClearable
                isLoading={isLoading || isRailHeadFetching}
                required
              />
            </div>
          </div>

          {/* Basic Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Basic Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <Form.Label>
                Date <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date || getTodayDate()}
                onChange={handleChange}
                required
                disabled={isLoading}
                max={getTodayDate()}
              />
            </div>

            <div className="col-md-4">
              <Form.Label>
                Vehicle Name (Lorry Number) <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <CreatableSelect
                value={getVehicleValue()}
                onChange={(selected) => {
                  if (selected) {
                    const selectedVehicle = vehicles.find(
                      (v) => v.id === selected.value || v._id === selected.value,
                    )
                    setFormData((prev) => ({
                      ...prev,
                      vehicleId: selected.value,
                      vehicleName: selectedVehicle?.name || selected.label,
                    }))
                  } else {
                    setFormData((prev) => ({ ...prev, vehicleId: '', vehicleName: '' }))
                  }
                }}
                options={vehicleOptions}
                placeholder="Select or type new vehicle"
                isClearable
                isLoading={isLoading || isRailHeadFetching}
              />
            </div>

            <div className="col-md-4">
              <Form.Label>
                Driver Name <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <CreatableSelect
                value={getDriverValue()}
                onChange={(selected) => {
                  if (selected) {
                    const selectedDriver = drivers.find((d) => d.id === selected.value)
                    setFormData((prev) => ({
                      ...prev,
                      driverId: selected.value,
                      driverName: selectedDriver?.name || selected.label,
                    }))
                  } else {
                    setFormData((prev) => ({ ...prev, driverId: '', driverName: '' }))
                  }
                }}
                options={driverOptions}
                placeholder="Select or type new driver"
                isClearable
                isLoading={isLoading || isRailHeadFetching}
              />
            </div>
          </div>

          {/* Consignor Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Consignor Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Label>Consignor Name</Form.Label>
              <Form.Control
                name="consignorName"
                value={formData.consignorName}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Consignor Address</Form.Label>
              <Form.Control
                name="consignorAddress"
                value={formData.consignorAddress}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Consignee Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Consignee Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Label>Consignee Name</Form.Label>
              <Form.Control
                name="consigneeName"
                value={formData.consigneeName}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Consignee Address</Form.Label>
              <Form.Control
                name="consigneeAddress"
                value={formData.consigneeAddress}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Customer Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Customer Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Customer Address</Form.Label>
              <Form.Control
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Route Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Route Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Label>
                Start Location <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                name="startLocation"
                value={formData.startLocation}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className="col-md-6">
              <Form.Label>
                End Location <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                name="endLocation"
                value={formData.endLocation}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Product Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Product Details</h5>
          <div className="mb-4">
            {formData.products.map((product, index) => {
              const calculations = calculateProductDetails(product, index)
              const productDetail = getProductDetailForDisplay(product)

              return (
                <div key={index} className="border rounded p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Product {index + 1}</h6>
                    {formData.products.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeProduct(index)}
                        disabled={isLoading}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Product Details Display from API */}
                  {productDetail && (
                    <div className="alert alert-info mb-3 p-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaInfoCircle className="me-2" />
                        <strong>Product Details from RailHead Inventory:</strong>
                      </div>
                      <div className="row small">
                        <div className="col-md-3 mb-1">
                          <span className="text-muted">Product:</span>{' '}
                          <strong>{productDetail.productName}</strong>
                        </div>
                        <div className="col-md-3 mb-1">
                          <span className="text-muted">Quantity (Kg):</span>{' '}
                          <strong
                            className={
                              productDetail.quantityKg === 0 ? 'text-danger' : 'text-success'
                            }
                          >
                            {productDetail.quantityKg}
                          </strong>
                        </div>
                        <div className="col-md-3 mb-1">
                          <span className="text-muted">Bag Size:</span>{' '}
                          <strong
                            className={productDetail.bagSize === 0 ? 'text-danger' : 'text-success'}
                          >
                            {productDetail.bagSize}
                          </strong>
                        </div>
                        <div className="col-md-3 mb-1">
                          <span className="text-muted">Total Bags:</span>{' '}
                          <strong
                            className={
                              productDetail.totalBags === 0 ? 'text-danger' : 'text-success'
                            }
                          >
                            {productDetail.totalBags}
                          </strong>
                        </div>

                        {/* Show all available data from the API response */}
                        {productDetail._id && (
                          <div className="col-md-4 mb-1">
                            <span className="text-muted">Product ID:</span>{' '}
                            <code className="small">{productDetail._id.substring(0, 8)}...</code>
                          </div>
                        )}

                        {/* Show bags per quantity calculation */}
                        {productDetail.bagSize > 0 && productDetail.quantityKg > 0 && (
                          <div className="col-md-12 mt-2">
                            <div className="alert alert-light p-2 mb-0">
                              <FaCalculator className="me-1" />
                              <small>
                                <strong>Calculation:</strong> {productDetail.quantityKg} Kg ÷{' '}
                                {productDetail.bagSize} per bag =
                                <strong>
                                  {' '}
                                  {(productDetail.quantityKg / productDetail.bagSize).toFixed(
                                    1,
                                  )}{' '}
                                  bags
                                </strong>{' '}
                                needed for complete quantity
                              </small>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="row g-3">
                    {/* Warehouse field - conditionally displayed */}
                    {warehouseDisplayMode === 'auto-filled' ? (
                      // When issued by Railhead and received by warehouse - show as read-only
                      <div className="col-md-6">
                        <Form.Label>
                          Warehouse <span style={{ color: 'red' }}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            product.warehouseName ||
                            formData.receivedByWarehouseName ||
                            'Select warehouse above'
                          }
                          disabled
                          readOnly
                          required
                        />
                        <Form.Text className="text-success">
                          <FaWarehouse className="me-1" />
                          Auto-filled from selected warehouse
                        </Form.Text>
                      </div>
                    ) : warehouseDisplayMode === 'hidden' ? (
                      // When issued by Railhead and received by party - hide warehouse field
                      <div className="col-md-6">
                        <div className="alert alert-warning p-2 mb-0">
                          <FaUserFriends className="me-2" />
                          <small>Warehouse not required when received by party</small>
                        </div>
                      </div>
                    ) : (
                      // Default case - show warehouse dropdown
                      <div className="col-md-6">
                        <Form.Label>
                          Warehouse <span style={{ color: 'red' }}>*</span>
                        </Form.Label>
                        <Select
                          value={getWarehouseValue(product)}
                          onChange={(selected) =>
                            handleProductChange(
                              index,
                              'warehouseId',
                              selected ? selected.value : '',
                            )
                          }
                          options={warehouseOptions}
                          placeholder="Select Warehouse"
                          isClearable
                          isLoading={isLoading || isRailHeadFetching}
                          required
                        />
                      </div>
                    )}

                    <div className="col-md-6">
                      <Form.Label>
                        Product <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Select
                        value={getProductValue(product)}
                        onChange={(selected) =>
                          handleProductChange(index, 'productId', selected ? selected.value : '')
                        }
                        options={productOptions}
                        placeholder="Select Product"
                        isClearable
                        isLoading={isLoading || isRailHeadFetching}
                        required
                      />
                      {productDetail && (
                        <Form.Text className="text-info">
                          <FaBox className="me-1" />
                          {productDetail.productName} • Bag Size: {productDetail.bagSize} • Total
                          Bags: {productDetail.totalBags}
                        </Form.Text>
                      )}
                    </div>

                    <div className="col-md-3">
                      <Form.Label>
                        Quantity (Kg) <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={product.quantityKg}
                        onChange={(e) => handleProductChange(index, 'quantityKg', e.target.value)}
                        disabled={isLoading}
                        placeholder="Enter quantity"
                        required
                        min="0"
                        step="0.01"
                      />
                      {calculations && calculations.calculatedBagsFromQuantity > 0 && (
                        <Form.Text className="text-success">
                          <FaCalculator className="me-1" />≈{' '}
                          {calculations.calculatedBagsFromQuantity.toFixed(1)} bags needed
                        </Form.Text>
                      )}
                    </div>

                    {/* Bag Size */}
                    <div className="col-md-3">
                      <Form.Label>
                        Bag Size <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={product.bagSize}
                        onChange={(e) => handleProductChange(index, 'bagSize', e.target.value)}
                        disabled={isLoading}
                        placeholder="Enter bag size"
                        required
                        min="0"
                        step="0.01"
                      />
                      {calculations &&
                        calculations.bags > 0 &&
                        calculations.calculatedTotalBags > 0 && (
                          <Form.Text className="text-primary">
                            <FaCalculator className="me-1" />
                            {calculations.bags} bags × {calculations.bagSize} ={' '}
                            {calculations.calculatedTotalBags} total
                          </Form.Text>
                        )}
                    </div>

                    {/* Total Bags */}
                    <div className="col-md-3">
                      <Form.Label>
                        Total Bags <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={product.totalBags}
                        onChange={(e) => handleProductChange(index, 'totalBags', e.target.value)}
                        disabled={isLoading}
                        placeholder="Auto-calculated"
                        required
                        min="0"
                        step="0.01"
                      />
                      {calculations &&
                        calculations.bagSize > 0 &&
                        calculations.calculatedBagsFromTotal > 0 && (
                          <Form.Text className="text-success">
                            <FaBox className="me-1" />≈{' '}
                            {Math.round(calculations.calculatedBagsFromTotal)} bags
                          </Form.Text>
                        )}
                    </div>

                    {/* Weight */}
                    <div className="col-md-3">
                      <Form.Label>
                        Weight <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={product.itemWeight}
                        onChange={(e) => handleProductChange(index, 'itemWeight', e.target.value)}
                        disabled={isLoading}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>

                    {/* Cost */}
                    <div className="col-md-3">
                      <Form.Label>
                        Cost <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={product.itemCost}
                        onChange={(e) => handleProductChange(index, 'itemCost', e.target.value)}
                        disabled={isLoading}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Summary Calculation */}
                  {calculations && (
                    <div className="mt-3 p-2 bg-light rounded">
                      <div className="row small">
                        <div className="col-md-4">
                          <strong>Summary:</strong>
                        </div>
                        <div className="col-md-4">
                          <span className="text-muted">Bags Selected:</span> {calculations.bags}
                        </div>
                        <div className="col-md-4">
                          <span className="text-muted">Bag Size:</span> {calculations.bagSize}
                        </div>
                        <div className="col-md-4 mt-1">
                          <span className="text-muted">Total Quantity:</span>{' '}
                          {calculations.calculatedQuantityFromBags > 0
                            ? calculations.calculatedQuantityFromBags
                            : calculations.quantityKg}{' '}
                          Kg
                        </div>
                        <div className="col-md-4 mt-1">
                          <span className="text-muted">Total Bags:</span>{' '}
                          {calculations.calculatedTotalBags > 0
                            ? calculations.calculatedTotalBags
                            : calculations.totalBags}
                        </div>
                        <div className="col-md-4 mt-1">
                          <span className="text-muted">Equivalent Bags:</span>{' '}
                          {calculations.calculatedBagsFromQuantity > 0
                            ? calculations.calculatedBagsFromQuantity.toFixed(1)
                            : 'N/A'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            <Button
              variant="outline-primary"
              onClick={addProduct}
              className="mb-3"
              disabled={isLoading || isRailHeadFetching}
            >
              Add Another Product
            </Button>
          </div>

          {/* Freight Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Freight Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <Form.Label>Customer Rate</Form.Label>
              <Form.Control
                type="number"
                name="customerRate"
                value={formData.customerRate}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Total Amount</Form.Label>
              <Form.Control
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Transporter Rate</Form.Label>
              <Form.Control
                type="number"
                name="transporterRate"
                value={formData.transporterRate}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Total Transporter Amount</Form.Label>
              <Form.Control
                type="number"
                name="totalTransporterAmount"
                value={formData.totalTransporterAmount}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Transporter Rate On</Form.Label>
              <Form.Control
                type="number"
                name="transporterRateOn"
                value={formData.transporterRateOn}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Customer Rate On</Form.Label>
              <Form.Control
                type="number"
                name="customerRateOn"
                value={formData.customerRateOn}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Customer Freight</Form.Label>
              <Form.Control
                type="number"
                name="customerFreight"
                value={formData.customerFreight}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Transporter Freight</Form.Label>
              <Form.Control
                type="number"
                name="transporterFreight"
                value={formData.transporterFreight}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="text-end mt-4">
            <Button type="submit" disabled={isLoading || isRailHeadFetching}>
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {mode === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : mode === 'edit' ? (
                'Update Receipt'
              ) : (
                'Create Receipt'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default WarehouseForm
