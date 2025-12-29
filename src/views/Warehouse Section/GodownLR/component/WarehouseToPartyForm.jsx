import React, { useContext, useEffect, useState, useMemo } from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import { fetchDrivers, fetchSupervisor } from '../../../DriverExpert/data/drivers'
import { fetchVehicles } from '../../../vehicle/data/VehicleListData'
import { TokenContext } from '../../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import { useQuery } from '@tanstack/react-query'
import { getWorkerApi } from '../../../TransportPass/data/data'
import Select from 'react-select'
import { getCompanyNameApi } from '../../../TransportPass/data/data'
import CreatableSelect from 'react-select/creatable'
import { getWarehouseListApi, getWarehouseProfileApi } from '../../data/data'
import {
  FaExchangeAlt,
  FaWarehouse,
  FaWeight,
  FaRupeeSign,
  FaCalculator,
  FaBox,
} from 'react-icons/fa'

const defaultProduct = {
  warehouseId: '',
  warehouseName: '',
  productId: '',
  productName: '',
  quantityKg: '',
  bagSizeKg: '', // Form field name
  totalBags: '',
  itemUnit: '',
  itemWeight: '',
  costPerBag: '', // New field for cost per bag
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
  tpPassType: 'warehouseToParty',
  issuedBy: 'Warehouse',
  issuedByWarehouseId: '',
  issuedByWarehouseName: '',
  warehouseId: '',
  receivedBy: 'Party',
  receivedByType: 'party',
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

const WarehouseToPartyForm = ({
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

  // Fetch warehouse products when a warehouse is selected in issued by section
  const {
    data: warehouseProductsResponse = {},
    isLoading: isLoadingWarehouseProducts,
    isError,
    error,
    refetch: refetchWarehouseProducts,
  } = useQuery({
    queryKey: [
      'warehouseProfile',
      {
        id: formData.issuedByWarehouseId,
        search: '',
        page: 1,
        limit: 100,
      },
    ],
    queryFn: getWarehouseProfileApi,
    enabled: !!formData.issuedByWarehouseId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })

  const warehouseList = warehouseResponse?.data || []

  // Extract products from warehouse response
  const inventoryList = useMemo(() => {
    console.log('Processing warehouse products response:', warehouseProductsResponse)

    if (
      !warehouseProductsResponse ||
      !warehouseProductsResponse.data ||
      !Array.isArray(warehouseProductsResponse.data)
    ) {
      console.log('No warehouse products data found')
      return []
    }

    console.log('API returned data:', {
      totalItems: warehouseProductsResponse.total,
      dataLength: warehouseProductsResponse.data.length,
      sampleData: warehouseProductsResponse.data[0],
    })

    // The API already returns formatted data as an array of product objects
    return warehouseProductsResponse.data || []
  }, [warehouseProductsResponse])

  // Create product options - DIFFERENTIATE BY BAG SIZE
  const productOptions = useMemo(() => {
    console.log('Creating product options from inventory list:', inventoryList)

    if (!inventoryList || inventoryList.length === 0) {
      return []
    }

    const options = []
    const seenCombinations = new Set()

    inventoryList.forEach((product) => {
      const productId = product.productId
      const productName = product.productName || 'Unknown Product'
      const bagSizeKg = product.bagSizeKg
      const quantityKg = product.quantityKg
      const totalBags = product.totalBags

      // Skip if no productId or bagSizeKg
      if (!productId || bagSizeKg === undefined) {
        console.log('Skipping product due to missing data:', product)
        return
      }

      // Create a unique key for product + bag size combination
      const uniqueKey = `${productId}_${bagSizeKg}`

      if (!seenCombinations.has(uniqueKey)) {
        seenCombinations.add(uniqueKey)

        const label = `${productName} (Bag Size: ${bagSizeKg} kg, Available: ${quantityKg} kg, Total Bags: ${totalBags})`

        options.push({
          value: uniqueKey, // Use unique combination as value
          label: label,
          productId: productId,
          productName: productName,
          bagSizeKg: bagSizeKg,
          quantityKg: quantityKg,
          totalBags: totalBags,
          originalProductData: product,
        })
      }
    })

    console.log('Generated product options:', options)
    return options
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
      // Transform initial data for form
      const updatedFormData = {
        ...defaultFormData,
        ...initialData,
        date: initialData.date ? initialData.date.split('T')[0] : getTodayDate(),
        vehicleName: vehicles.find((vehicle) => vehicle.id === initialData.vehicleId)?.name || '',
        driverName: drivers.find((driver) => driver.id === initialData.driverId)?.name || '',
        companyId: initialData.companyId || '',
        products: initialData.products?.map((product) => {
          // Transform API data to form data
          const formProduct = {
            ...defaultProduct,
            ...product,
            quantityKg: product.quantityKg?.toString() || '',
            bagSizeKg: product.bagSize?.toString() || product.bagSizeKg?.toString() || '',
            totalBags: product.totalBags?.toString() || '',
            itemUnit: product.itemUnit?.toString() || '',
            itemWeight: product.itemWeight?.toString() || '',
            costPerBag: product.costPerBag?.toString() || '',
            itemCost: product.itemCost?.toString() || '',
          }

          if (formProduct.bagSize) {
            delete formProduct.bagSize
          }

          return formProduct
        }) || [{ ...defaultProduct }],
      }

      setFormData(updatedFormData)

      if (initialData.issuedByWarehouseId && updatedFormData.products.length > 0) {
        const updatedProducts = updatedFormData.products.map((product) => ({
          ...product,
          warehouseId: initialData.issuedByWarehouseId,
          warehouseName: initialData.issuedByWarehouseName || '',
        }))
        setFormData((prev) => ({ ...prev, products: updatedProducts }))
      }
    } else {
      setFormData(defaultFormData)
    }
  }, [initialData, mode, vehicles, drivers])

  useEffect(() => {
    if (formData.issuedByWarehouseId && formData.products.length > 0) {
      const selectedWarehouse = warehouseList.find(
        (w) => w.id === formData.issuedByWarehouseId || w._id === formData.issuedByWarehouseId,
      )

      const updatedProducts = formData.products.map((product) => ({
        ...product,
        warehouseId: formData.issuedByWarehouseId,
        warehouseName:
          selectedWarehouse?.wareHouseName ||
          selectedWarehouse?.name ||
          formData.issuedByWarehouseName ||
          '',
      }))

      setFormData((prev) => ({ ...prev, products: updatedProducts }))
    }
  }, [formData.issuedByWarehouseId, formData.issuedByWarehouseName, warehouseList])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      console.log('=== PRODUCT SELECTION DEBUG ===')
      console.log('Selected value:', value)

      // Find the selected product option
      const selectedOption = productOptions.find((opt) => opt.value === value)
      console.log('Found product option:', selectedOption)

      if (selectedOption) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          productId: selectedOption.productId,
          productName: selectedOption.productName || 'Unknown Product',
          quantityKg: selectedOption.quantityKg?.toString() || '',
          bagSizeKg: selectedOption.bagSizeKg?.toString() || '',
          totalBags: selectedOption.totalBags?.toString() || '',
        }
      }
      console.log('Updated product after selection:', updatedProducts[index])
    } else {
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
      }

      // Auto-calculate quantityKg and itemWeight when bagSizeKg or totalBags changes
      if (field === 'bagSizeKg' || field === 'totalBags') {
        const bagSizeNum = parseFloat(updatedProducts[index].bagSizeKg) || 0
        const totalBagsNum = parseFloat(updatedProducts[index].totalBags) || 0
        const calculatedQuantityKg = bagSizeNum * totalBagsNum

        updatedProducts[index] = {
          ...updatedProducts[index],
          quantityKg: calculatedQuantityKg > 0 ? calculatedQuantityKg.toString() : '',
          itemWeight: calculatedQuantityKg > 0 ? calculatedQuantityKg.toString() : '',
        }
      }

      // Auto-calculate total cost when costPerBag or totalBags changes
      if (field === 'costPerBag' || field === 'totalBags') {
        const costPerBagNum = parseFloat(updatedProducts[index].costPerBag) || 0
        const totalBagsNum = parseFloat(updatedProducts[index].totalBags) || 0
        const calculatedTotalCost = costPerBagNum * totalBagsNum

        updatedProducts[index] = {
          ...updatedProducts[index],
          itemCost: calculatedTotalCost > 0 ? calculatedTotalCost.toString() : '',
        }
      }

      // Auto-calculate costPerBag when itemCost or totalBags changes
      if (field === 'itemCost' || field === 'totalBags') {
        const itemCostNum = parseFloat(updatedProducts[index].itemCost) || 0
        const totalBagsNum = parseFloat(updatedProducts[index].totalBags) || 0
        const calculatedCostPerBag = totalBagsNum > 0 ? itemCostNum / totalBagsNum : 0

        updatedProducts[index] = {
          ...updatedProducts[index],
          costPerBag: calculatedCostPerBag > 0 ? calculatedCostPerBag.toString() : '',
        }
      }
    }

    setFormData((prev) => ({ ...prev, products: updatedProducts }))
  }

  const addProduct = () => {
    const newProduct = {
      ...defaultProduct,
      warehouseId: formData.issuedByWarehouseId || '',
      warehouseName: formData.issuedByWarehouseName || '',
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
    console.log('=== VALIDATING PRODUCTS ===')
    const invalidProducts = formData.products.filter((product, index) => {
      const isInvalid =
        !product.productId ||
        !product.quantityKg ||
        product.quantityKg === '0' ||
        !product.bagSizeKg ||
        product.bagSizeKg === '0' ||
        !product.itemWeight ||
        product.itemWeight === '0' ||
        !product.costPerBag ||
        product.costPerBag === '0' ||
        !product.itemCost ||
        product.itemCost === '0'

      if (isInvalid) {
        console.log(`Product ${index + 1} is invalid:`, {
          productId: product.productId,
          quantityKg: product.quantityKg,
          bagSizeKg: product.bagSizeKg,
          itemWeight: product.itemWeight,
          costPerBag: product.costPerBag,
          itemCost: product.itemCost,
        })
      }
      return isInvalid
    })

    console.log('Invalid products count:', invalidProducts.length)
    console.log('All products:', formData.products)

    if (invalidProducts.length > 0) {
      alert('Please fill all required fields for all products')
      return
    }

    // Transform form data for API submission
    const payload = {
      ...formData,
      tpPassType: 'warehouseToParty',
      companyId: formData.companyId || '',
      warehouseId: formData.issuedByWarehouseId || '',

      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      products: formData.products.map((product) => {
        // Create transformed product object
        const transformedProduct = {
          ...product,
          quantityKg: parseFloat(product.quantityKg) || 0,
          bagSize: parseFloat(product.bagSizeKg) || 0,
          totalBags: parseFloat(product.totalBags) || 0,
          itemUnit: parseFloat(product.itemUnit) || 0,
          itemWeight: parseFloat(product.itemWeight) || 0,
          costPerBag: parseFloat(product.costPerBag) || 0,
          itemCost: parseFloat(product.itemCost) || 0,
        }

        // Remove bagSizeKg from the product object since we're sending bagSize
        delete transformedProduct.bagSizeKg

        return transformedProduct
      }),
    }

    // Remove bagSizeKg from the main payload
    delete payload.bagSizeKg

    if (userRole !== 'superadmin') {
      delete payload.supervisorId
      delete payload.supervisorName
    }

    console.log('Submitting payload:', JSON.stringify(payload, null, 2))
    handleSubmit(payload)
  }

  const warehouseOptions = warehouseList.map((w) => ({
    value: w.id || w._id,
    label: w.wareHouseName || w.name || 'Unnamed Warehouse',
  }))

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
    console.log('getProductValue called with:', product)

    if (!product.productId || !product.bagSizeKg) {
      console.log('No productId or bagSizeKg, returning null')
      return null
    }

    // Create unique key to match with options
    const uniqueKey = `${product.productId}_${product.bagSizeKg}`
    const foundOption = productOptions.find((opt) => opt.value === uniqueKey)
    console.log('Unique key:', uniqueKey, 'Found option:', foundOption)

    return foundOption || null
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

  const getIssuedByWarehouseValue = () => {
    if (!formData.issuedByWarehouseId) return null
    return warehouseOptions.find((opt) => opt.value === formData.issuedByWarehouseId) || null
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
              <FaExchangeAlt className="me-2 text-warning" />
              <h4 className="mb-0">
                {mode === 'edit' ? 'Edit' : 'Add'} Warehouse to Party TP Pass
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
            <FaExchangeAlt className="me-2" />
            <div>
              <strong>TP Pass Type:</strong> Warehouse to Party
              <div className="small mt-1">
                <strong>Issued by:</strong> {formData.issuedBy}
                {formData.issuedByWarehouseName && ` (${formData.issuedByWarehouseName})`} •{' '}
                <strong>Received by:</strong> {formData.receivedBy}
              </div>
            </div>
          </div>
        </div>

        <Form onSubmit={onSubmit}>
          {/* Issued/Received Section */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Issued & Received Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Label>
                Issued By (Warehouse) <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Select
                value={getIssuedByWarehouseValue()}
                onChange={(selected) => {
                  if (selected) {
                    const selectedWarehouse = warehouseList.find(
                      (w) => w.id === selected.value || w._id === selected.value,
                    )
                    const warehouseName =
                      selectedWarehouse?.wareHouseName || selectedWarehouse?.name || selected.label

                    setFormData((prevState) => {
                      const updatedState = {
                        ...prevState,
                        issuedBy: 'Warehouse',
                        issuedByWarehouseId: selected.value,
                        issuedByWarehouseName: warehouseName,
                      }

                      // Update products with the new warehouse
                      if (prevState.products.length > 0) {
                        updatedState.products = prevState.products.map((product) => ({
                          ...product,
                          warehouseId: selected.value,
                          warehouseName: warehouseName,
                          productId: '', // Clear product selection when warehouse changes
                          productName: '',
                          quantityKg: '',
                          bagSizeKg: '',
                          totalBags: '',
                        }))
                      }

                      return updatedState
                    })
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      issuedBy: '',
                      issuedByWarehouseId: '',
                      issuedByWarehouseName: '',
                      products: prev.products.map((product) => ({
                        ...product,
                        warehouseId: '',
                        warehouseName: '',
                        productId: '',
                        productName: '',
                        quantityKg: '',
                        bagSizeKg: '',
                        totalBags: '',
                      })),
                    }))
                  }
                }}
                options={warehouseOptions}
                placeholder="Select Warehouse"
                isClearable
                isLoading={isLoading}
                required
              />
              {formData.issuedByWarehouseName && (
                <Form.Text className="text-success">
                  Selected: {formData.issuedByWarehouseName}
                  {isLoadingWarehouseProducts && (
                    <span className="ms-2">
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading products...
                    </span>
                  )}
                  {isError && (
                    <span className="ms-2 text-danger">
                      Error: {error?.message || 'Failed to load products'}
                    </span>
                  )}
                </Form.Text>
              )}
            </div>
            <div className="col-md-6">
              <Form.Label>Received By</Form.Label>
              <Form.Control
                type="text"
                value="Party"
                readOnly
                disabled={isLoading}
                className="bg-light"
              />
              <Form.Text className="text-muted">
                This is always "Party" for Warehouse to Party TP Pass
              </Form.Text>
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
                  isLoading={isLoading}
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
                isLoading={isLoading}
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
                isLoading={isLoading}
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
                isLoading={isLoading}
                required
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
                isLoading={isLoading}
                required
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
            <div className="alert alert-warning mb-3">
              <div className="d-flex align-items-center">
                <FaWarehouse className="me-2" />
                <div>
                  <strong>Note:</strong> Products will be loaded from the selected warehouse in the
                  "Issued By" section.
                  {formData.issuedByWarehouseName && (
                    <span className="ms-1">
                      Current warehouse: <strong>{formData.issuedByWarehouseName}</strong>
                    </span>
                  )}
                  {!formData.issuedByWarehouseId && (
                    <span className="text-danger ms-1">Please select a warehouse first.</span>
                  )}
                  {isError && (
                    <span className="text-danger ms-1">
                      Error loading products. Please try again.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {formData.products.map((product, index) => {
              const bagSize = parseFloat(product.bagSizeKg) || 0
              const totalBags = parseFloat(product.totalBags) || 0
              const costPerBag = parseFloat(product.costPerBag) || 0
              const calculatedQuantity = bagSize * totalBags
              const calculatedTotalCost = costPerBag * totalBags

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
                  <div className="row g-3">
                    <div className="col-md-6">
                      <Form.Label>Warehouse</Form.Label>
                      <Form.Control
                        type="text"
                        value={product.warehouseName || formData.issuedByWarehouseName || ''}
                        disabled
                        readOnly
                        className="bg-light"
                      />
                      <Form.Text className="text-muted">
                        Auto-selected from "Issued By" warehouse
                      </Form.Text>
                      <Form.Control
                        type="hidden"
                        value={product.warehouseId || formData.issuedByWarehouseId}
                        readOnly
                      />
                    </div>

                    <div className="col-md-6">
                      <Form.Label>
                        Product <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Select
                        key={`product-select-${index}-${product.productId || 'empty'}-${product.bagSizeKg || 'empty'}`}
                        value={getProductValue(product)}
                        onChange={(selected) => {
                          console.log('Product selected:', selected)

                          if (selected) {
                            const updatedProduct = {
                              ...product,
                              productId: selected.productId,
                              productName: selected.productName || 'Unknown Product',
                              quantityKg: selected.quantityKg?.toString() || '',
                              bagSizeKg: selected.bagSizeKg?.toString() || '',
                              totalBags: selected.totalBags?.toString() || '',
                            }

                            // Update the products array
                            const updatedProducts = [...formData.products]
                            updatedProducts[index] = updatedProduct

                            // Update form data
                            setFormData((prev) => ({
                              ...prev,
                              products: updatedProducts,
                            }))
                          } else {
                            // Clear the product
                            const updatedProducts = [...formData.products]
                            updatedProducts[index] = {
                              ...product,
                              productId: '',
                              productName: '',
                              quantityKg: '',
                              bagSizeKg: '',
                              totalBags: '',
                            }

                            setFormData((prev) => ({
                              ...prev,
                              products: updatedProducts,
                            }))
                          }
                        }}
                        options={productOptions}
                        placeholder={
                          isLoadingWarehouseProducts
                            ? 'Loading products...'
                            : !formData.issuedByWarehouseId
                              ? 'Select a warehouse first'
                              : isError
                                ? 'Error loading products'
                                : productOptions.length === 0
                                  ? 'No products available in this warehouse'
                                  : `Select Product`
                        }
                        isClearable
                        isLoading={isLoadingWarehouseProducts || isLoading}
                        isDisabled={
                          !formData.issuedByWarehouseId ||
                          isLoadingWarehouseProducts ||
                          isLoading ||
                          isError
                        }
                        required
                      />
                      {!formData.issuedByWarehouseId && (
                        <Form.Text className="text-danger">
                          Please select a warehouse in the "Issued By" section first
                        </Form.Text>
                      )}
                      {formData.issuedByWarehouseId &&
                        productOptions.length === 0 &&
                        !isLoadingWarehouseProducts && (
                          <Form.Text className="text-danger">
                            No products found in the selected warehouse
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
                        placeholder="Enter total bags"
                        required
                      />
                    </div>

                    {/* Bag Size */}
                    <div className="col-md-3">
                      <Form.Label>
                        Bag Size (Kg per bag) <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={product.bagSizeKg}
                        onChange={(e) => handleProductChange(index, 'bagSizeKg', e.target.value)}
                        disabled={isLoading}
                        required
                        min="0"
                        step="0.01"
                      />
                      <Form.Text className="text-muted">Weight per bag in kilograms</Form.Text>
                    </div>

                    {/* Quantity (Kg) - Auto-calculated */}
                    <div className="col-md-3">
                      <Form.Label>
                        Quantity (Kg) <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={calculatedQuantity || product.quantityKg}
                        onChange={(e) => handleProductChange(index, 'quantityKg', e.target.value)}
                        disabled={isLoading}
                        placeholder="Auto-calculated"
                        required
                        min="0"
                        step="0.01"
                      />
                      <Form.Text className="text-muted">
                        Auto-calculated: Bag Size × Total Bags
                      </Form.Text>
                    </div>

                    {/* Weight - Auto-calculated */}
                    <div className="col-md-3">
                      <Form.Label>
                        Weight (Kg) <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={calculatedQuantity || product.itemWeight}
                        onChange={(e) => handleProductChange(index, 'itemWeight', e.target.value)}
                        disabled={isLoading}
                        required
                        min="0"
                        step="0.01"
                      />
                      <Form.Text className="text-muted">
                        Auto-calculated: Same as Quantity
                      </Form.Text>
                    </div>

                    {/* Cost per Bag */}
                    <div className="col-md-3">
                      <Form.Label>
                        Cost per Bag (₹) <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={product.costPerBag}
                        onChange={(e) => handleProductChange(index, 'costPerBag', e.target.value)}
                        disabled={isLoading}
                        required
                        min="0"
                        step="0.01"
                      />
                      <Form.Text className="text-muted">Cost per single bag</Form.Text>
                    </div>

                    {/* Total Cost - Auto-calculated */}
                    <div className="col-md-3">
                      <Form.Label>
                        Total Cost (₹) <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={calculatedTotalCost || product.itemCost}
                        onChange={(e) => handleProductChange(index, 'itemCost', e.target.value)}
                        disabled={isLoading}
                        required
                        min="0"
                        step="0.01"
                      />
                      <Form.Text className="text-muted">
                        Auto-calculated: Cost per Bag × Total Bags
                      </Form.Text>
                    </div>
                  </div>

                  {/* Calculation Display */}
                  {(product.bagSizeKg || product.totalBags) && (
                    <div className="mt-3 p-3 bg-light rounded">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="alert alert-primary p-2 mb-2">
                            <h6 className="mb-1">Weight Calculation:</h6>
                            <div className="d-flex align-items-center">
                              <FaWeight className="me-2" />
                              <span>
                                {bagSize} kg/bag × {totalBags} bags ={' '}
                                <strong>{calculatedQuantity} kg</strong>
                              </span>
                            </div>
                          </div>
                        </div>
                        {(product.costPerBag || product.itemCost) && (
                          <div className="col-md-6">
                            <div className="alert alert-success p-2 mb-2">
                              <h6 className="mb-1">Cost Calculation:</h6>
                              <div className="d-flex align-items-center">
                                <FaRupeeSign className="me-2" />
                                <span>
                                  ₹ {costPerBag} per bag × {totalBags} bags ={' '}
                                  <strong>₹ {calculatedTotalCost}</strong>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
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
              disabled={isLoading || !formData.issuedByWarehouseId}
            >
              Add Another Product
            </Button>
          </div>

          {/* Freight Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Freight Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <Form.Label>Customer Rate (₹)</Form.Label>
              <Form.Control
                type="number"
                name="customerRate"
                value={formData.customerRate}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Total Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Transporter Rate (₹)</Form.Label>
              <Form.Control
                type="number"
                name="transporterRate"
                value={formData.transporterRate}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Total Transporter Amount (₹)</Form.Label>
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
              <Form.Label>Customer Freight (₹)</Form.Label>
              <Form.Control
                type="number"
                name="customerFreight"
                value={formData.customerFreight}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Transporter Freight (₹)</Form.Label>
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
            <Button
              type="submit"
              disabled={isLoading || !formData.issuedByWarehouseId}
              className="px-4"
            >
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

export default WarehouseToPartyForm
