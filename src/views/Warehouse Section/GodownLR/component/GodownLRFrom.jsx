import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { fetchDrivers, fetchSupervisor } from '../../../DriverExpert/data/drivers'
import { fetchVehicles } from '../../../vehicle/data/VehicleListData'
import { TokenContext } from '../../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import { useQuery } from '@tanstack/react-query'
import { getWorkerApi } from '../../../TransportPass/data/data'
import Select from 'react-select'
import { getCompanyNameApi } from '../../../TransportPass/data/data'
import CreatableSelect from 'react-select/creatable'
import { getInventoryApi, getWarehouseListApi } from '../../data/data'

// Product item structure for form state
const defaultProduct = {
  warehouseId: '',
  warehouseName: '',
  productId: '',
  productName: '',
  quantityKg: '',
  bags: '',
  itemUnit: '',
  itemWeight: '',
  itemCost: '',
}

const defaultFormData = {
  supervisorId: '',
  workerId: '',
  companyId: '',
  companyName: '',
  companyEmail: '',
  companyMobileNumber: '',
  companyOfficeNumber: '',
  companyAddress: '',
  gstIn: '',
  date: '',
  vehicleId: '',
  vehicleName: '',
  driverId: '',
  driverName: '',
  ownerName: '',
  consignorName: '',
  consignorAddress: '',
  consigneeName: '',
  consigneeAddress: '',
  customerName: '',
  customerAddress: '',
  startLocation: '',
  endLocation: '',
  sealNumber: '',
  containerNumber: '',
  customerRate: '',
  totalAmount: '',
  transporterRate: '',
  totalTransporterAmount: '',
  transporterRateOn: '',
  customerRateOn: '',
  customerFreight: '',
  transporterFreight: '',
  products: [defaultProduct], // Initialize with one product
}

const LorryReceiptForm = ({
  show,
  handleClose,
  handleSubmit,
  initialData = {},
  mode = 'add',
  isLoading = false,
}) => {
  const [formData, setFormData] = useState(defaultFormData)
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  // Fetch workers
  const { data: workerList = [], isFetching: workersLoading } = useQuery({
    queryKey: ['workerList'],
    queryFn: getWorkerApi,
    staleTime: 1000 * 60 * 30,
  })

  // Fetch companies
  const { data: companyList = [], isFetching: companiesLoading } = useQuery({
    queryKey: ['companyList'],
    queryFn: getCompanyNameApi,
    staleTime: 1000 * 60 * 30,
  })

  // Fetch Warehouse list - with proper pagination
  const { data: warehouseResponse = {}, isFetching: warehousesLoading } = useQuery({
    queryKey: ['getWarehouseList', { page: 1, limit: 100 }], // Fetch first 100 warehouses
    queryFn: ({ queryKey }) => getWarehouseListApi(queryKey[1]),
    staleTime: 1000 * 60 * 30,
  })

  // Fetch Product list - with proper pagination
  const { data: inventoryResponse = {}, isFetching: inventoryLoading } = useQuery({
    queryKey: ['inventoryList', { page: 1, limit: 100 }], // Fetch first 100 products
    queryFn: ({ queryKey }) => getInventoryApi({ queryKey }),
    staleTime: 1000 * 60 * 30,
  })

  // Extract warehouse list from response
  const warehouseList = warehouseResponse?.data || []

  // Extract inventory list from response
  const inventoryList = inventoryResponse?.data || []

  // Fetch drives
  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const data = await fetchDrivers()
        setDrivers(data || [])
        console.log('Fetched drivers:', data)
      } catch (error) {
        console.error('Error fetching drivers:', error)
      }
    }

    loadDrivers()
  }, [])

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await fetchVehicles()
        setVehicles(data || [])
        console.log('All vehicles', data)
      } catch (error) {
        console.error('Error fetching vehicles:', error)
      }
    }
    loadVehicles()
  }, [])

  // Set form data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      console.log('Editing data:', initialData)
      setFormData({
        ...defaultFormData,
        ...initialData,
        date: initialData.date ? initialData.date.split('T')[0] : '',
        vehicleName: vehicles.find((vehicle) => vehicle.id === initialData.vehicleId)?.name || '',
        driverName: drivers.find((driver) => driver.id === initialData.driverId)?.name || '',
        companyId: initialData.companyId || '',
        products: initialData.products?.map((product) => ({
          ...defaultProduct,
          ...product,
          quantityKg: product.quantityKg?.toString() || '',
          bags: product.bags?.toString() || '',
          itemUnit: product.itemUnit?.toString() || '',
          itemWeight: product.itemWeight?.toString() || '',
          itemCost: product.itemCost?.toString() || '',
        })) || [defaultProduct],
      })
    } else {
      setFormData(defaultFormData) // Reset for 'add' mode
    }
  }, [initialData, mode, vehicles, drivers])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'vehicleId') {
      const selectedVehicle = vehicles.find((v) => v.id === value || v._id === value)
      setFormData((prev) => ({
        ...prev,
        vehicleId: value,
        vehicleName: selectedVehicle?.name || '',
      }))
    } else if (name === 'driverId') {
      const selectedDriver = drivers.find((d) => d.id === value)
      setFormData((prev) => ({
        ...prev,
        driverId: value,
        driverName: selectedDriver?.name || '',
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Handle product changes
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
      const selectedProduct = inventoryList.find((p) => p.id === value || p._id === value)
      updatedProducts[index] = {
        ...updatedProducts[index],
        productId: value,
        productName: selectedProduct?.productName || selectedProduct?.name || '',
      }
    } else {
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
      }
    }

    setFormData((prev) => ({ ...prev, products: updatedProducts }))
  }

  // Add new product row
  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { ...defaultProduct }],
    }))
  }

  // Remove product row
  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      const updatedProducts = [...formData.products]
      updatedProducts.splice(index, 1)
      setFormData((prev) => ({ ...prev, products: updatedProducts }))
    }
  }

  // Prepare warehouse options for Select component
  const warehouseOptions = Array.isArray(warehouseList)
    ? warehouseList.map((w) => ({
        value: w.id || w._id,
        label: w.wareHouseName || w.name || 'Unnamed Warehouse',
      }))
    : []

  // Prepare product options for Select component
  const productOptions = Array.isArray(inventoryList)
    ? inventoryList.map((p) => ({
        value: p.id || p._id,
        label: p.productName || p.name || 'Unnamed Product',
      }))
    : []

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

  // Prepare vehicle options for Select component
  const vehicleOptions = Array.isArray(vehicles)
    ? vehicles.map((v) => ({
        value: v.id || v._id,
        label: v.name || v.vehicleNumber || 'Unnamed Vehicle',
      }))
    : []

  // Prepare driver options for Select component
  const driverOptions = Array.isArray(drivers)
    ? drivers.map((d) => ({
        value: d.id || d._id,
        label: d.name || 'Unnamed Driver',
      }))
    : []

  // In LorryReceiptForm.jsx
  const onSubmit = (e) => {
    e.preventDefault()
    let payload = {
      ...formData,
      companyId: formData.companyId || '',
      date: formData.date ? new Date(formData.date).toISOString() : '',
      products: formData.products.map((product) => ({
        ...product,
        quantityKg: parseFloat(product.quantityKg) || 0,
        bags: parseFloat(product.bags) || 0,
        itemUnit: parseFloat(product.itemUnit) || 0,
        itemWeight: parseFloat(product.itemWeight) || 0,
        itemCost: parseFloat(product.itemCost) || 0,
      })),
    }

    // Remove supervisor fields if not superadmin
    if (userRole !== 'superadmin') {
      delete payload.supervisorId
      delete payload.supervisorName
    }

    handleSubmit(payload)
  }

  // Get current warehouse selection value
  const getWarehouseValue = (product) => {
    if (!product.warehouseId) return null
    return warehouseOptions.find((opt) => opt.value === product.warehouseId) || null
  }

  // Get current product selection value
  const getProductValue = (product) => {
    if (!product.productId) return null
    return productOptions.find((opt) => opt.value === product.productId) || null
  }

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

  // Get current vehicle selection value
  const getVehicleValue = () => {
    if (!formData.vehicleId) return null
    return vehicleOptions.find((opt) => opt.value === formData.vehicleId) || null
  }

  // Get current driver selection value
  const getDriverValue = () => {
    if (!formData.driverId) return null
    return driverOptions.find((opt) => opt.value === formData.driverId) || null
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
            <h4 className="mb-0">{mode === 'edit' ? 'Edit' : 'Add'} Lorry Receipt</h4>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="p-4 pt-0"
        style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
      >
        <Form onSubmit={onSubmit}>
          {/* Select Users */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Select Users</h5>
          <div className="row g-3 mb-4">
            {/* Show Supervisor dropdown only if role === superadmin */}
            {userRole === 'superadmin' && (
              <div className="col-md-4">
                <Form.Label>Supervisors</Form.Label>
                <Select
                  name="supervisorId"
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

            {/* Worker dropdown */}
            <div className="col-md-4">
              <Form.Label>Employees</Form.Label>
              <Select
                name="workerId"
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
                isLoading={workersLoading || isLoading}
              />
            </div>
          </div>

          {/* Company Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Company Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <Form.Label>Company Name</Form.Label>
              <Select
                name="companyId"
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
                isLoading={companiesLoading || isLoading}
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
                value={formData.date ? formData.date.split('T')[0] : ''}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="col-md-4">
              <Form.Label>
                Vehicle Name (Lorry Number) <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <CreatableSelect
                name="vehicleId"
                value={getVehicleValue()}
                onChange={(selected, action) => {
                  if (selected) {
                    if (action.action === 'create-option') {
                      setFormData((prev) => ({
                        ...prev,
                        vehicleId: selected.value,
                        vehicleName: selected.label,
                      }))
                    } else {
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
              />
            </div>

            <div className="col-md-4">
              <Form.Label>
                Driver Name <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <CreatableSelect
                name="driverId"
                value={getDriverValue()}
                onChange={(selected, action) => {
                  if (selected) {
                    if (action.action === 'create-option') {
                      setFormData((prev) => ({
                        ...prev,
                        driverId: selected.value,
                        driverName: selected.label,
                      }))
                    } else {
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
              />
            </div>

            <div className="col-md-4">
              <Form.Label>Owner Name</Form.Label>
              <Form.Control
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                disabled={isLoading}
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

          {/* Product Details - Multiple Products */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Product Details</h5>
          <div className="mb-4">
            {formData.products.map((product, index) => (
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
                  {/* Warehouse Selection */}
                  <div className="col-md-6">
                    <Form.Label>Warehouse</Form.Label>
                    <Select
                      value={getWarehouseValue(product)}
                      onChange={(selected) =>
                        handleProductChange(index, 'warehouseId', selected ? selected.value : '')
                      }
                      options={warehouseOptions}
                      placeholder="Select Warehouse"
                      isClearable
                      isLoading={warehousesLoading || isLoading}
                    />
                  </div>

                  {/* Product Selection */}
                  <div className="col-md-6">
                    <Form.Label>Product</Form.Label>
                    <Select
                      value={getProductValue(product)}
                      onChange={(selected) =>
                        handleProductChange(index, 'productId', selected ? selected.value : '')
                      }
                      options={productOptions}
                      placeholder="Select Product"
                      isClearable
                      isLoading={inventoryLoading || isLoading}
                    />
                  </div>

                  {/* Quantity and Bags */}
                  <div className="col-md-3">
                    <Form.Label>Quantity (Kg)</Form.Label>
                    <Form.Control
                      type="number"
                      value={product.quantityKg}
                      onChange={(e) => handleProductChange(index, 'quantityKg', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-md-3">
                    <Form.Label>Bags</Form.Label>
                    <Form.Control
                      type="number"
                      value={product.bags}
                      onChange={(e) => handleProductChange(index, 'bags', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Unit, Weight, Cost */}
                  <div className="col-md-2">
                    <Form.Label>Unit</Form.Label>
                    <Form.Control
                      type="number"
                      value={product.itemUnit}
                      onChange={(e) => handleProductChange(index, 'itemUnit', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-md-2">
                    <Form.Label>Weight</Form.Label>
                    <Form.Control
                      type="number"
                      value={product.itemWeight}
                      onChange={(e) => handleProductChange(index, 'itemWeight', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-md-2">
                    <Form.Label>Cost</Form.Label>
                    <Form.Control
                      type="number"
                      value={product.itemCost}
                      onChange={(e) => handleProductChange(index, 'itemCost', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline-primary"
              onClick={addProduct}
              className="mb-3"
              disabled={isLoading}
            >
              Add Another Product
            </Button>
          </div>

          {/* Seal and Container Numbers */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Additional Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Label>Seal Number (Batch)</Form.Label>
              <Form.Control
                name="sealNumber"
                value={formData.sealNumber}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Container Number</Form.Label>
              <Form.Control
                name="containerNumber"
                value={formData.containerNumber}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
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

export default LorryReceiptForm
