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
import { getInventoryApi, getWarehouseListApi } from '../../data/data'
import { FaWarehouse, FaTrain, FaBuilding, FaUserFriends, FaExchangeAlt } from 'react-icons/fa'

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

// Helper function to format date as YYYY-MM-DD
const formatDateForInput = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  return formatDateForInput(new Date())
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
  date: getTodayDate(), // Set current date as default
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
  // New fields for TP Pass type
  tpPassType: '', // 'railhead' or 'warehouse' or 'warehouseToParty'
  issuedBy: '', // Default based on tpPassType
  receivedBy: '', // Default based on tpPassType
  receivedByType: '', // 'warehouse' or 'party'
  receivedByWarehouseId: '', // Warehouse ID if receivedByType is 'warehouse'
  receivedByWarehouseName: '', // Warehouse name if receivedByType is 'warehouse'
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
  const [showTypeSelection, setShowTypeSelection] = useState(mode === 'add') // Show type selection only in add mode
  const [receivedByOptions, setReceivedByOptions] = useState([
    { value: 'warehouse', label: 'Warehouse', icon: <FaWarehouse className="me-2" /> },
    { value: 'party', label: 'Party', icon: <FaUserFriends className="me-2" /> },
  ])

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

  // Fetch drivers
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
        date: initialData.date ? initialData.date.split('T')[0] : getTodayDate(),
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
      setShowTypeSelection(false) // Hide type selection in edit mode
    } else {
      setFormData(defaultFormData) // Reset for 'add' mode with current date
      setShowTypeSelection(true) // Show type selection in add mode
    }
  }, [initialData, mode, vehicles, drivers])

  // Reset form data when modal is opened in add mode
  useEffect(() => {
    if (show && mode === 'add') {
      setFormData({
        ...defaultFormData,
        date: getTodayDate(), // Always set current date when opening in add mode
      })
      setShowTypeSelection(true)
    }
  }, [show, mode])

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

  // Handle TP Pass type selection
  const handleTpPassTypeSelect = (type) => {
    if (type === 'railhead') {
      setFormData((prev) => ({
        ...prev,
        tpPassType: 'railhead',
        issuedBy: 'Rack',
        receivedBy: 'Railhead',
        receivedByType: '',
        receivedByWarehouseId: '',
        receivedByWarehouseName: '',
      }))
    } else if (type === 'warehouse') {
      setFormData((prev) => ({
        ...prev,
        tpPassType: 'warehouse',
        issuedBy: 'Railhead',
        receivedBy: 'Warehouse/Party',
        receivedByType: '',
        receivedByWarehouseId: '',
        receivedByWarehouseName: '',
      }))
    } else if (type === 'warehouseToParty') {
      setFormData((prev) => ({
        ...prev,
        tpPassType: 'warehouseToParty',
        issuedBy: 'Warehouse',
        receivedBy: 'Party',
        receivedByType: 'party',
        receivedByWarehouseId: '',
        receivedByWarehouseName: '',
      }))
    }
    setShowTypeSelection(false)
  }

  // Handle received by type change (Warehouse or Party)
  const handleReceivedByTypeChange = (type) => {
    if (type === 'warehouse') {
      setFormData((prev) => ({
        ...prev,
        receivedByType: 'warehouse',
        receivedBy: 'Warehouse',
        receivedByWarehouseId: '',
        receivedByWarehouseName: '',
      }))
    } else if (type === 'party') {
      setFormData((prev) => ({
        ...prev,
        receivedByType: 'party',
        receivedBy: 'Party',
        receivedByWarehouseId: '',
        receivedByWarehouseName: '',
      }))
    }
  }

  // Handle warehouse selection for received by
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

  // Prepare warehouse options for Received By dropdown
  const receivedByWarehouseOptions = Array.isArray(warehouseList)
    ? warehouseList.map((w) => ({
        value: w.id || w._id,
        label: w.wareHouseName || w.name || 'Unnamed Warehouse',
      }))
    : []

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

  // Prepare warehouse options for Select component (for product warehouse)
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
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
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

  // Get current warehouse selection value for product
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

  // Get current received by warehouse value
  const getReceivedByWarehouseValue = () => {
    if (!formData.receivedByWarehouseId) return null
    return (
      receivedByWarehouseOptions.find((opt) => opt.value === formData.receivedByWarehouseId) || null
    )
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
        {/* TP Pass Type Selection (Only show in add mode before type is selected) */}
        {showTypeSelection && mode === 'add' ? (
          <div className="text-center py-5">
            <h5 className="mb-4">Select TP Pass Type</h5>
            <Row className="justify-content-center g-4">
              {/* Option 1: Railhead */}
              <Col md={6} lg={4}>
                <Card
                  className="h-100 cursor-pointer border-primary"
                  onClick={() => handleTpPassTypeSelect('railhead')}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="text-center py-4">
                    <FaTrain className="text-primary mb-3" size={48} />
                    <Card.Title className="mb-2">TP Pass for Railhead</Card.Title>
                    <Card.Text className="text-muted small">
                      Default: Issued by <strong>Rack</strong> • Received by{' '}
                      <strong>Railhead</strong>
                    </Card.Text>
                    <div className="mt-3">
                      <Button variant="primary">Select This Option</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Option 2: Warehouse/Party (Railhead to Warehouse/Party) */}
              <Col md={6} lg={4}>
                <Card
                  className="h-100 cursor-pointer border-success"
                  onClick={() => handleTpPassTypeSelect('warehouse')}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="text-center py-4">
                    <FaWarehouse className="text-success mb-3" size={48} />
                    <Card.Title className="mb-2">TP Pass for Warehouse/Party</Card.Title>
                    <Card.Text className="text-muted small">
                      Default: Issued by <strong>Railhead</strong> • Received by{' '}
                      <strong>Warehouse/Party</strong>
                    </Card.Text>
                    <div className="mt-3">
                      <Button variant="success">Select This Option</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Option 3: Warehouse to Party */}
              <Col md={6} lg={4}>
                <Card
                  className="h-100 cursor-pointer border-warning"
                  onClick={() => handleTpPassTypeSelect('warehouseToParty')}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="text-center py-4">
                    <FaExchangeAlt className="text-warning mb-3" size={48} />
                    <Card.Title className="mb-2">Warehouse to Party</Card.Title>
                    <Card.Text className="text-muted small">
                      Default: Issued by <strong>Warehouse</strong> • Received by{' '}
                      <strong>Party</strong>
                    </Card.Text>
                    <div className="mt-3">
                      <Button variant="warning">Select This Option</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <div className="mt-4">
              <Button variant="outline-secondary" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Form onSubmit={onSubmit}>
            {/* Show selected TP Pass type at top */}
            {formData.tpPassType && mode === 'add' && (
              <div className="alert alert-info mb-4">
                <div className="d-flex align-items-center">
                  {formData.tpPassType === 'railhead' ? (
                    <FaTrain className="me-2" />
                  ) : formData.tpPassType === 'warehouse' ? (
                    <FaWarehouse className="me-2" />
                  ) : (
                    <FaExchangeAlt className="me-2" />
                  )}
                  <div>
                    <strong>TP Pass Type:</strong>{' '}
                    {formData.tpPassType === 'railhead'
                      ? 'Railhead'
                      : formData.tpPassType === 'warehouse'
                        ? 'Warehouse/Party'
                        : 'Warehouse to Party'}
                    <div className="small mt-1">
                      <strong>Issued by:</strong> {formData.issuedBy} •{' '}
                      <strong>Received by:</strong> {formData.receivedBy}
                      {formData.receivedByType && ` (${formData.receivedByType})`}
                      {formData.receivedByType === 'warehouse' &&
                        formData.receivedByWarehouseName &&
                        ` • ${formData.receivedByWarehouseName}`}
                    </div>
                  </div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="ms-auto"
                    onClick={() => setShowTypeSelection(true)}
                    disabled={isLoading}
                  >
                    Change Type
                  </Button>
                </div>
              </div>
            )}

            {/* Issued/Received Section */}
            <h5 className="fw-semibold border-bottom pb-2 mb-3">Issued & Received Details</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <Form.Label>Issued By</Form.Label>
                {formData.tpPassType === 'warehouseToParty' ? (
                  <div>
                    <Form.Label>Select Warehouse</Form.Label>
                    <Select
                      value={
                        warehouseOptions.find(
                          (opt) => opt.value === formData.issuedByWarehouseId,
                        ) || null
                      }
                      onChange={(selected) => {
                        if (selected) {
                          const selectedWarehouse = warehouseList.find(
                            (w) => w.id === selected.value || w._id === selected.value,
                          )
                          setFormData((prev) => ({
                            ...prev,
                            issuedBy: 'Warehouse',
                            issuedByWarehouseId: selected.value,
                            issuedByWarehouseName:
                              selectedWarehouse?.wareHouseName ||
                              selectedWarehouse?.name ||
                              selected.label,
                          }))
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            issuedBy: '',
                            issuedByWarehouseId: '',
                            issuedByWarehouseName: '',
                          }))
                        }
                      }}
                      options={warehouseOptions}
                      placeholder="Select Warehouse"
                      isClearable
                      isLoading={warehousesLoading || isLoading}
                    />
                    {formData.issuedByWarehouseName && (
                      <Form.Text className="text-success">
                        Selected: {formData.issuedByWarehouseName}
                      </Form.Text>
                    )}
                  </div>
                ) : (
                  <>
                    <Form.Control
                      name="issuedBy"
                      value={formData.issuedBy}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="Issued by"
                    />
                  </>
                )}
              </div>
              <div className="col-md-6">
                <Form.Label>Received By</Form.Label>
                {formData.tpPassType === 'railhead' ? (
                  <Form.Control
                    name="receivedBy"
                    value={formData.receivedBy}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="Received by"
                  />
                ) : formData.tpPassType === 'warehouseToParty' ? (
                  <div>
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
                ) : (
                  <div>
                    {/* Received by type selection for Warehouse/Party option */}
                    <div className="mb-3">
                      <div className="d-flex gap-2">
                        {receivedByOptions.map((option) => (
                          <Button
                            key={option.value}
                            variant={
                              formData.receivedByType === option.value
                                ? 'primary'
                                : 'outline-primary'
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

                    {/* Warehouse selection if received by type is warehouse */}
                    {formData.receivedByType === 'warehouse' && (
                      <div className="mt-3">
                        <Form.Label>Select Warehouse</Form.Label>
                        <Select
                          value={getReceivedByWarehouseValue()}
                          onChange={handleWarehouseSelect}
                          options={receivedByWarehouseOptions}
                          placeholder="Select Warehouse"
                          isClearable
                          isLoading={warehousesLoading || isLoading}
                        />
                        {formData.receivedByWarehouseName && (
                          <Form.Text className="text-success">
                            Selected: {formData.receivedByWarehouseName}
                          </Form.Text>
                        )}
                      </div>
                    )}

                    {/* Party input if received by type is party */}
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

                    {/* Show current received by value */}
                    {formData.receivedByType && (
                      <div className="mt-2">
                        <Form.Text className="text-muted">
                          Current: {formData.receivedBy}
                          {formData.receivedByType === 'warehouse' &&
                            formData.receivedByWarehouseName &&
                            ` (${formData.receivedByWarehouseName})`}
                        </Form.Text>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

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
                  value={formData.date || getTodayDate()}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  max={getTodayDate()} // Optional: Prevent future dates
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
        )}
      </Modal.Body>
    </Modal>
  )
}

export default LorryReceiptForm
