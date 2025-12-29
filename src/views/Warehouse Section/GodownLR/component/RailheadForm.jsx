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
import { FaTrain, FaInfoCircle, FaRupeeSign } from 'react-icons/fa'
import { getInventoryApi } from '../../data/data'

// Updated product structure
const defaultProduct = {
  productId: '',
  productName: '',
  quantityKg: '',
  bagSize: '',
  totalBags: '',
  itemWeight: '',
  costPerBag: '', // New field
  itemCost: '', // Total cost
}

const getTodayDate = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const defaultFormData = {
  tpPassType: 'railhead',
  issuedBy: 'Rack',
  receivedBy: 'Railhead',
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

const RailheadForm = ({
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
  const [productDetails, setProductDetails] = useState({})

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

  // Fetch Product list - with proper pagination
  const { data: inventoryResponse = {}, isFetching: inventoryLoading } = useQuery({
    queryKey: ['inventoryList', { page: 1, limit: 100 }], // Fetch first 100 products
    queryFn: ({ queryKey }) => getInventoryApi({ queryKey }),
    staleTime: 1000 * 60 * 30,
  })

  // Extract inventory list from response
  const inventoryList = inventoryResponse?.data || []

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
          productId: product.productId || '',
          productName: product.productName || '',
          quantityKg: product.quantityKg?.toString() || '',
          bagSize: product.bagSize?.toString() || '',
          totalBags: product.totalBags?.toString() || '',
          itemWeight: product.itemWeight?.toString() || '',
          costPerBag: product.costPerBag?.toString() || '', // New field
          itemCost: product.itemCost?.toString() || '',
        })) || [{ ...defaultProduct }],
      })
    } else {
      setFormData(defaultFormData)
    }
  }, [initialData, mode, vehicles, drivers])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle product changes with auto-calculation
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products]

    if (field === 'productId') {
      const selectedProduct = inventoryList.find((p) => p.id === value || p._id === value)
      updatedProducts[index] = {
        ...updatedProducts[index],
        productId: value,
        productName: selectedProduct?.productName || selectedProduct?.name || '',
      }

      // Store product details for display
      if (selectedProduct) {
        setProductDetails((prev) => ({
          ...prev,
          [index]: {
            productName: selectedProduct?.productName || selectedProduct?.name || '',
            quantityKg: selectedProduct?.quantityKg || 0,
            bagSize: selectedProduct?.bagSize || 0,
            totalBags: selectedProduct?.totalBags || 0,
          },
        }))
      }
    } else {
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
      }

      // Auto-calculate quantityKg and itemWeight when bagSize or totalBags changes
      if (field === 'bagSize' || field === 'totalBags') {
        const bagSizeNum = parseFloat(updatedProducts[index].bagSize) || 0
        const totalBagsNum = parseFloat(updatedProducts[index].totalBags) || 0
        const calculatedQuantityKg = bagSizeNum * totalBagsNum

        updatedProducts[index] = {
          ...updatedProducts[index],
          quantityKg: calculatedQuantityKg.toString(),
          itemWeight: calculatedQuantityKg.toString(),
        }
      }

      // Auto-calculate total cost when costPerBag or totalBags changes
      if (field === 'costPerBag' || field === 'totalBags') {
        const costPerBagNum = parseFloat(updatedProducts[index].costPerBag) || 0
        const totalBagsNum = parseFloat(updatedProducts[index].totalBags) || 0
        const calculatedTotalCost = costPerBagNum * totalBagsNum

        updatedProducts[index] = {
          ...updatedProducts[index],
          itemCost: calculatedTotalCost.toString(),
        }
      }

      // Auto-calculate costPerBag when itemCost or totalBags changes
      if (field === 'itemCost' || field === 'totalBags') {
        const itemCostNum = parseFloat(updatedProducts[index].itemCost) || 0
        const totalBagsNum = parseFloat(updatedProducts[index].totalBags) || 0
        const calculatedCostPerBag = totalBagsNum > 0 ? itemCostNum / totalBagsNum : 0

        updatedProducts[index] = {
          ...updatedProducts[index],
          costPerBag: calculatedCostPerBag.toString(),
        }
      }
    }

    setFormData((prev) => ({ ...prev, products: updatedProducts }))
  }

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { ...defaultProduct }],
    }))
  }

  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      const updatedProducts = [...formData.products]
      updatedProducts.splice(index, 1)
      setFormData((prev) => ({ ...prev, products: updatedProducts }))

      // Remove product details
      const updatedProductDetails = { ...productDetails }
      delete updatedProductDetails[index]
      setProductDetails(updatedProductDetails)
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
        !product.costPerBag ||
        !product.itemCost,
    )

    if (invalidProducts.length > 0) {
      alert('Please fill all required fields for all products')
      return
    }

    const payload = {
      ...formData,
      tpPassType: 'railhead',
      companyId: formData.companyId || '',
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      products: formData.products.map((product) => ({
        productId: product.productId || '',
        productName: product.productName || '',
        quantityKg: parseFloat(product.quantityKg) || 0,
        bagSize: parseFloat(product.bagSize) || 0,
        totalBags: parseFloat(product.totalBags) || 0,
        itemWeight: parseFloat(product.itemWeight) || 0,
        costPerBag: parseFloat(product.costPerBag) || 0, // Include in payload
        itemCost: parseFloat(product.itemCost) || 0,
      })),
    }

    if (userRole !== 'superadmin') {
      delete payload.supervisorId
      delete payload.supervisorName
    }

    handleSubmit(payload)
  }

  // Prepare company options for Select component
  const companyOptions = Array.isArray(companyList)
    ? companyList.map((c) => ({
        value: c.id || c._id,
        label: c.companyName || c.name || 'Unnamed Company',
      }))
    : []

  // Prepare worker options for Select component
  const workerOptions = Array.isArray(workerList)
    ? workerList.map((w) => ({
        value: w.id || w._id,
        label: w.name || 'Unnamed Worker',
        supervisorId: w.supervisorId,
      }))
    : []

  // Prepare vehicle options for CreatableSelect component
  const vehicleOptions = Array.isArray(vehicles)
    ? vehicles.map((v) => ({
        value: v.id || v._id,
        label: v.name || v.vehicleNumber || 'Unnamed Vehicle',
      }))
    : []

  // Prepare driver options for CreatableSelect component
  const driverOptions = Array.isArray(drivers)
    ? drivers.map((d) => ({
        value: d.id || d._id,
        label: d.name || 'Unnamed Driver',
      }))
    : []

  // Prepare product options for Select component
  const productOptions = Array.isArray(inventoryList)
    ? inventoryList.map((p) => ({
        value: p.id || p._id,
        label: p.productName || p.name || 'Unnamed Product',
      }))
    : []

  // Get current company selection value
  const getCompanyValue = () => {
    if (!formData.companyId) return null
    return companyOptions.find((opt) => opt.value === formData.companyId) || null
  }

  // Get current worker selection value
  const getWorkerValue = () => {
    if (!formData.workerId) return null
    return workerOptions.find((opt) => opt.value === formData.workerId) || null
  }

  // Get current vehicle selection value for CreatableSelect
  const getVehicleValue = () => {
    if (formData.vehicleId && formData.vehicleName) {
      return {
        value: formData.vehicleId,
        label: formData.vehicleName,
      }
    }
    return null
  }

  // Get current driver selection value for CreatableSelect
  const getDriverValue = () => {
    if (formData.driverId && formData.driverName) {
      return {
        value: formData.driverId,
        label: formData.driverName,
      }
    }
    return null
  }

  // Get current product selection value
  const getProductValue = (product) => {
    if (!product.productId) return null
    return productOptions.find((opt) => opt.value === product.productId) || null
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
              <FaTrain className="me-2 text-primary" />
              <h4 className="mb-0">{mode === 'edit' ? 'Edit' : 'Add'} Rack to Railhead TP Pass</h4>
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
            <FaTrain className="me-2" />
            <div>
              <strong>TP Pass Type:</strong> Rack to Railhead
              <div className="small mt-1">
                <strong>Issued by:</strong> {formData.issuedBy} • <strong>Received by:</strong>{' '}
                {formData.receivedBy}
              </div>
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
                value="Rack"
                readOnly
                disabled={isLoading}
                placeholder="Issued by"
                className="bg-light"
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Received By</Form.Label>
              <Form.Control
                type="text"
                value="Railhead"
                readOnly
                disabled={isLoading}
                placeholder="Received by"
                className="bg-light"
              />
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
                onChange={(selected, action) => {
                  if (selected) {
                    if (action.action === 'create-option') {
                      // User created new Vehicle
                      setFormData((prev) => ({
                        ...prev,
                        vehicleId: selected.value,
                        vehicleName: selected.label,
                      }))
                    } else {
                      // Existing Vehicle selected
                      const selectedVehicle = vehicles.find(
                        (v) => v.id === selected.value || v._id === selected.value,
                      )
                      setFormData((prev) => ({
                        ...prev,
                        vehicleId: selected.value,
                        vehicleName: selectedVehicle?.name || selected.label,
                      }))
                    }
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
                onChange={(selected, action) => {
                  if (selected) {
                    if (action.action === 'create-option') {
                      // User created new Driver
                      setFormData((prev) => ({
                        ...prev,
                        driverId: selected.value,
                        driverName: selected.label,
                      }))
                    } else {
                      // Existing Driver selected
                      const selectedDriver = drivers.find((d) => d.id === selected.value)
                      setFormData((prev) => ({
                        ...prev,
                        driverId: selected.value,
                        driverName: selectedDriver?.name || selected.label,
                      }))
                    }
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
              <Form.Label>Start Location</Form.Label>
              <Form.Control
                name="startLocation"
                value={formData.startLocation}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>End Location</Form.Label>
              <Form.Control
                name="endLocation"
                value={formData.endLocation}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Product Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Product Details</h5>
          <div className="mb-4">
            {formData.products.map((product, index) => {
              const productDetail = productDetails[index]
              const bagSize = parseFloat(product.bagSize) || 0
              const totalBags = parseFloat(product.totalBags) || 0
              const calculatedQuantity = bagSize * totalBags
              const costPerBag = parseFloat(product.costPerBag) || 0
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
                    {/* Product Selection - Dropdown */}
                    <div className="col-md-12">
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
                        isLoading={inventoryLoading || isLoading}
                        required
                      />
                    </div>

                    {/* Bag Size - Manual input */}
                    <div className="col-md-3">
                      <Form.Label>
                        Bags Size (Kg per bag) <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={product.bagSize}
                        onChange={(e) => handleProductChange(index, 'bagSize', e.target.value)}
                        disabled={isLoading}
                        placeholder="Enter bag size (e.g., 50)"
                        required
                        min="0"
                        step="0.01"
                      />
                      <Form.Text className="text-muted">Weight per bag in kilograms</Form.Text>
                    </div>

                    {/* Total bags - Manual input */}
                    <div className="col-md-3">
                      <Form.Label>
                        Total Bags <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={product.totalBags}
                        onChange={(e) => handleProductChange(index, 'totalBags', e.target.value)}
                        disabled={isLoading}
                        placeholder="Enter total bags count"
                        required
                        min="0"
                      />
                    </div>

                    {/* Quantity (Kg) - Auto-calculated and readonly */}
                    <div className="col-md-3">
                      <Form.Label>
                        Quantity (Kg) <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={calculatedQuantity || product.quantityKg}
                        readOnly
                        className="bg-light"
                        required
                      />
                      <Form.Text className="text-muted">
                        Auto-calculated: Bag Size × Total Bags
                      </Form.Text>
                    </div>

                    {/* Weight - Auto-calculated and readonly */}
                    <div className="col-md-3">
                      <Form.Label>
                        Weight (Kg) <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={calculatedQuantity || product.itemWeight}
                        readOnly
                        className="bg-light"
                        required
                      />
                      <Form.Text className="text-muted">
                        Auto-calculated: Same as Quantity
                      </Form.Text>
                    </div>

                    {/* Cost per bag - Manual input */}
                    <div className="col-md-3">
                      <Form.Label>
                        Cost per Bag (₹) <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={product.costPerBag}
                        onChange={(e) => handleProductChange(index, 'costPerBag', e.target.value)}
                        disabled={isLoading}
                        placeholder="Enter cost per bag"
                        required
                        min="0"
                        step="0.01"
                      />
                      <Form.Text className="text-muted">Cost per single bag</Form.Text>
                    </div>

                    {/* Total Cost - Auto-calculated and readonly */}
                    <div className="col-md-3">
                      <Form.Label>
                        Total Cost (₹) <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={calculatedTotalCost || product.itemCost}
                        readOnly
                        className="bg-light"
                        required
                      />
                      <Form.Text className="text-muted">
                        Auto-calculated: Cost per Bag × Total Bags
                      </Form.Text>
                    </div>

                    {/* Calculation Display */}
                    {(product.bagSize || product.totalBags) && (
                      <div className="col-md-12 mt-2">
                        <div className="alert alert-info p-2 small">
                          <div className="row">
                            <div className="col-md-6">
                              <strong>Weight Calculation:</strong> {bagSize} kg/bag × {totalBags}{' '}
                              bags = <strong>{calculatedQuantity} kg</strong>
                            </div>
                            {(product.costPerBag || product.itemCost) && (
                              <div className="col-md-6">
                                <strong>Cost Calculation:</strong>{' '}
                                <FaRupeeSign className="d-inline" size={12} /> {costPerBag} per bag
                                × {totalBags} bags ={' '}
                                <strong>
                                  <FaRupeeSign className="d-inline" size={12} />{' '}
                                  {calculatedTotalCost}
                                </strong>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>{' '}
                </div>
              )
            })}

            <Button
              variant="outline-primary"
              onClick={addProduct}
              className="mb-3"
              disabled={isLoading}
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
            <Button type="submit" disabled={isLoading}>
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

export default RailheadForm
