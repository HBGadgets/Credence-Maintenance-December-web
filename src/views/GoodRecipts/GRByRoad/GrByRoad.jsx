import React, { useState, useRef, useEffect } from 'react'
import { Card, Button, Form, Row, Col, Alert, Modal } from 'react-bootstrap'
import { FaInfoCircle, FaSave, FaPlus, FaTimes } from 'react-icons/fa'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Select from 'react-select'
import {
  getWarehouseListApi,
  postGodownTPApi,
  getInventoryApi,
  postInvenotryApi,
} from '../../Warehouse Section/data/data'
import { toast, ToastContainer } from 'react-toastify'

const defaultProduct = {
  warehouseId: '',
  productId: '',
  productName: '',
  quantityKg: '', // Changed from quantityKg to quantityMt (Metric Tons)
  bagSize: '',
  totalBags: '',
}

const defaultFormData = {
  tpPassType: 'GrByRoad',
  issuedBy: 'Road',
  receivedBy: 'Warehouse',
  warehouseId: '',
  products: [{ ...defaultProduct }],
}

const productFields = [
  {
    name: 'name',
    label: 'Product Name',
    type: 'text',
    required: true,
  },
  {
    name: 'category',
    label: 'Category',
    type: 'text',
    required: true,
  },
]

const GrByRoad = ({ setShowForm, setSelectedFormType }) => {
  const [formData, setFormData] = useState(defaultFormData)
  const [formErrors, setFormErrors] = useState({})
  const [warehouseSearch, setWarehouseSearch] = useState('')
  const [showNewProductModal, setShowNewProductModal] = useState(false)
  const [newProductData, setNewProductData] = useState({
    name: '',
    category: '',
  })
  const [newProductErrors, setNewProductErrors] = useState({})
  const warehouseSelectRef = useRef(null)
  const productSelectRefs = useRef([])

  const queryClient = useQueryClient()

  // Initialize refs array
  useEffect(() => {
    productSelectRefs.current = productSelectRefs.current.slice(0, formData.products.length)
  }, [formData.products.length])

  // Fetch warehouse list
  const { data: warehouseResponse = {}, isFetching: warehouseLoading } = useQuery({
    queryKey: ['getWarehouseList', { search: warehouseSearch, page: 1, limit: 100 }],
    queryFn: ({ queryKey }) => getWarehouseListApi(queryKey[1]),
    staleTime: 1000 * 60 * 30,
  })

  // Fetch Product list
  const { data: inventoryResponse = {}, isFetching: inventoryLoading } = useQuery({
    queryKey: ['inventoryList', { page: 1, limit: 100 }],
    queryFn: ({ queryKey }) => getInventoryApi({ queryKey }),
    staleTime: 1000 * 60 * 30,
  })

  // Extract inventory list from response
  const inventoryList = inventoryResponse?.data || []
  const warehouseList = warehouseResponse?.data || []

  // Mutation for submitting GR By Road form
  const { mutate: postGrByRoad, isLoading: isSubmitting } = useMutation({
    mutationFn: postGodownTPApi,
    onSuccess: () => {
      toast.success('GR By Road added successfully!')
      queryClient.invalidateQueries({ queryKey: ['getGodownTP'] })
      // Reset form and close if needed
      setFormData(defaultFormData)
      if (setShowForm) setShowForm(false)
      if (setSelectedFormType) setSelectedFormType(null)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit form')
    },
  })

  // Mutation for adding new product
  const { mutate: postInvenotry, isLoading: isAddingProduct } = useMutation({
    mutationFn: postInvenotryApi,
    onSuccess: (response) => {
      toast.success('Product added successfully!')
      // Invalidate and refetch inventory list
      queryClient.invalidateQueries({ queryKey: ['inventoryList'], exact: false })
      // Close modal and reset new product form
      setShowNewProductModal(false)
      setNewProductData({ name: '', category: '' })
      setNewProductErrors({})

      // Auto-select the newly created product in the first product slot
      if (response.data?._id) {
        const updatedProducts = [...formData.products]
        if (updatedProducts[0]) {
          updatedProducts[0] = {
            ...updatedProducts[0],
            productId: response.data._id,
            productName: response.data.name || '',
          }
          setFormData((prev) => ({ ...prev, products: updatedProducts }))
        }
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add product')
    },
  })

  // Function to handle wheel event and prevent scrolling from changing number values
  const handleWheel = (e) => {
    e.target.blur()
  }

  const handleNewProductChange = (e) => {
    const { name, value } = e.target
    setNewProductData((prev) => ({ ...prev, [name]: value }))
    if (newProductErrors[name]) {
      setNewProductErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products]

    if (field === 'productId') {
      // Find the selected product from inventory list
      const selectedProduct = inventoryList.find((item) => item._id === value)

      updatedProducts[index] = {
        ...updatedProducts[index],
        productId: value,
        productName: selectedProduct ? selectedProduct.productName : '',
      }
    } else {
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
      }

      // Get current values as numbers
      const bagSizeNum = parseFloat(updatedProducts[index].bagSize) || 0
      const totalBagsNum = parseFloat(updatedProducts[index].totalBags) || 0
      const quantityMtNum = parseFloat(updatedProducts[index].quantityKg) || 0

      // Calculate based on the formula: Quantity in MT = (Bag Size × Total Bags) ÷ 1000
      if (field === 'bagSize' || field === 'totalBags') {
        if (bagSizeNum > 0 && totalBagsNum > 0) {
          const calculatedQuantityMt = (bagSizeNum * totalBagsNum) / 1000
          updatedProducts[index] = {
            ...updatedProducts[index],
            quantityKg: calculatedQuantityMt.toFixed(3), // Keep 3 decimal places
          }
        }
      }
      // If user manually enters quantityMt, calculate total bags
      else if (field === 'quantityKg') {
        if (bagSizeNum > 0 && quantityMtNum > 0) {
          const calculatedTotalBags = Math.round((quantityMtNum * 1000) / bagSizeNum)
          updatedProducts[index] = {
            ...updatedProducts[index],
            totalBags: calculatedTotalBags.toString(),
          }
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
    }
  }

  const validateNewProduct = () => {
    const errors = {}

    if (!newProductData.name.trim()) {
      errors.name = 'Product name is required'
    }
    if (!newProductData.category.trim()) {
      errors.category = 'Category is required'
    }

    return errors
  }

  const handleAddNewProduct = (e) => {
    e.preventDefault()

    const errors = validateNewProduct()
    if (Object.keys(errors).length > 0) {
      setNewProductErrors(errors)
      return
    }

    // Prepare payload for API
    const payload = {
      name: newProductData.name.trim(),
      category: newProductData.category.trim(),
    }

    postInvenotry(payload)
  }

  const validateForm = () => {
    const errors = {}

    // Validate warehouse selection
    if (!formData.warehouseId) {
      errors.warehouseId = 'Warehouse selection is required'
    }

    // Validate each product
    formData.products.forEach((product, index) => {
      if (!product.productId) {
        errors[`productId_${index}`] = `Product selection for product ${index + 1} is required`
      }
      if (!product.bagSize || parseFloat(product.bagSize) <= 0) {
        errors[`bagSize_${index}`] = `Valid bag size for product ${index + 1} is required`
      }
      if (!product.totalBags || parseInt(product.totalBags) <= 0) {
        errors[`totalBags_${index}`] = `Valid total bags for product ${index + 1} is required`
      }
      if (!product.quantityKg || parseFloat(product.quantityKg) <= 0) {
        errors[`quantityKg_${index}`] = `Valid quantity for product ${index + 1} is required`
      }
    })

    return errors
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      toast.error('Please fix the errors in the form')
      return
    }

    // Get current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0]

    // Prepare payload for API with current date
    // Convert quantityKg to quantityKg for API (multiply by 1000)
    const payload = {
      tpPassType: formData.tpPassType,
      issuedBy: formData.issuedBy, // Auto-filled as "Road"
      receivedBy: 'Warehouse', // Auto-filled as "Warehouse"
      warehouseId: formData.warehouseId,
      date: currentDate,
      products: formData.products.map((product) => ({
        warehouseId: formData.warehouseId,
        productId: product.productId,
        productName: product.productName || '',
        quantityKg: parseFloat(product.quantityKg) * 1000, // Convert MT to Kg
        bagSize: parseFloat(product.bagSize) || 0,
        totalBags: parseInt(product.totalBags) || 0,
      })),
    }

    // Call mutation
    postGrByRoad(payload)
  }

  // Prepare warehouse options for Select component
  const warehouseOptions = Array.isArray(warehouseList)
    ? warehouseList.map((warehouse) => ({
        value: warehouse._id,
        label: warehouse.wareHouseName || 'Unknown Warehouse',
      }))
    : []

  const getWarehouseValue = () => {
    if (!formData.warehouseId) return null
    return warehouseOptions.find((opt) => opt.value === formData.warehouseId) || null
  }

  // Handle warehouse selection with clearing
  const handleWarehouseSelect = (selected) => {
    setFormData((prev) => ({
      ...prev,
      warehouseId: selected ? selected.value : '',
    }))

    // Clear warehouse error if exists
    if (formErrors.warehouseId) {
      setFormErrors((prev) => ({ ...prev, warehouseId: '' }))
    }
  }

  // Prepare product options for React Select
  const getProductOptions = () => {
    const productOptions = inventoryList.map((item) => ({
      value: item._id,
      label: `${item.productName}${item.category ? ` (${item.category})` : ''}`,
      productName: item.productName, // Add productName to the option object
    }))

    // Add "Create New Product" option at the beginning
    return [
      {
        value: 'new-product',
        label: '+ Create New Product',
        className: 'text-primary fw-bold',
      },
      ...productOptions,
    ]
  }

  const getProductValue = (productId) => {
    if (!productId) return null

    // First check inventory list
    const selectedProduct = inventoryList.find((item) => item._id === productId)
    if (selectedProduct) {
      return {
        value: selectedProduct._id,
        label: `${selectedProduct.productName}${selectedProduct.category ? ` (${selectedProduct.category})` : ''}`,
        productName: selectedProduct.productName,
      }
    }

    return null
  }

  // Handle warehouse search
  const handleWarehouseSearch = (searchValue) => {
    setWarehouseSearch(searchValue)
  }

  // Handle product selection with clearing
  const handleProductSelect = (selected, index) => {
    // If user clicks the clear (X) button, selected will be null
    if (selected === null) {
      const updatedProducts = [...formData.products]
      updatedProducts[index] = {
        ...updatedProducts[index],
        productId: '',
        productName: '',
      }
      setFormData((prev) => ({ ...prev, products: updatedProducts }))

      // Clear product error if exists
      if (formErrors[`productId_${index}`]) {
        setFormErrors((prev) => ({ ...prev, [`productId_${index}`]: '' }))
      }
      return
    }

    // Handle "Create New Product" option
    if (selected?.value === 'new-product') {
      // Open new product modal
      setShowNewProductModal(true)
      return
    }

    // Handle regular product selection
    const selectedProduct = inventoryList.find((item) => item._id === selected?.value)

    if (selectedProduct) {
      const updatedProducts = [...formData.products]
      updatedProducts[index] = {
        ...updatedProducts[index],
        productId: selectedProduct._id,
        productName: selectedProduct.productName || '',
      }

      setFormData((prev) => ({ ...prev, products: updatedProducts }))

      // Clear product error if exists
      if (formErrors[`productId_${index}`]) {
        setFormErrors((prev) => ({ ...prev, [`productId_${index}`]: '' }))
      }
    }
  }

  // Reset form
  const handleReset = () => {
    setFormData(defaultFormData)
    setFormErrors({})
  }

  // Function to calculate bags based on quantity and bag size
  const calculateBags = (quantityKg, bagSizeKg) => {
    if (!quantityKg || !bagSizeKg || bagSizeKg <= 0) return 0
    return Math.round((parseFloat(quantityKg) * 1000) / parseFloat(bagSizeKg))
  }

  // Function to calculate quantity based on bags and bag size
  const calculateQuantity = (totalBags, bagSizeKg) => {
    if (!totalBags || !bagSizeKg || bagSizeKg <= 0) return 0
    return (parseInt(totalBags) * parseFloat(bagSizeKg)) / 1000
  }

  // Warehouse dropdown styles
  const warehouseStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '38px',
      borderColor: formErrors.warehouseId ? '#dc3545' : '#dee2e6',
      '&:hover': {
        borderColor: formErrors.warehouseId ? '#dc3545' : '#dee2e6',
      },
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(13, 110, 253, 0.25)' : 'none',
      width: '100%',
    }),
    container: (base) => ({
      ...base,
      width: '100%',
      position: 'relative',
    }),
    menu: (base, state) => {
      let left = 0
      let top = 0
      let width = 'auto'

      if (warehouseSelectRef.current) {
        const rect = warehouseSelectRef.current.getBoundingClientRect()
        left = rect.left
        top = rect.bottom
        width = rect.width
      }

      return {
        ...base,
        position: 'fixed',
        zIndex: 99999,
        left: `${left}px !important`,
        top: `${top}px !important`,
        width: `${width}px !important`,
        maxHeight: '250px',
        overflowY: 'auto',
        minWidth: '300px',
        maxWidth: 'calc(100vw - 20px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        backgroundColor: 'white',
      }
    },
    menuList: (base) => ({
      ...base,
      maxHeight: '200px',
      padding: '4px 0',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#f8f9fa' : 'white',
      color: state.isSelected ? 'white' : '#212529',
      padding: '8px 12px',
      fontSize: '14px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: state.isSelected ? '#0d6efd' : '#e9ecef',
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '2px 8px',
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: '14px',
      color: '#212529',
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: '14px',
      color: '#6c757d',
    }),
    input: (base) => ({
      ...base,
      fontSize: '14px',
      color: '#212529',
    }),
    indicatorsContainer: (base) => ({
      ...base,
      padding: '0 8px',
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: '4px',
      cursor: 'pointer',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: '4px',
      cursor: 'pointer',
    }),
  }

  return (
    <>
      <ToastContainer />

      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <h4 className="mb-0">GR By Road Form</h4>
            </div>
            {setShowForm && (
              <Button
                variant="light"
                size="sm"
                onClick={() => {
                  if (setShowForm) setShowForm(false)
                  if (setSelectedFormType) setSelectedFormType(null)
                }}
                disabled={isSubmitting || isAddingProduct}
              >
                Close
              </Button>
            )}
          </div>
        </Card.Header>

        <Card.Body>
          <Form onSubmit={onSubmit}>
            {/* Date and Warehouse Selection */}
            <Card className="mb-4">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Details</h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="text"
                        value={new Date().toLocaleDateString()}
                        readOnly
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>
                        Select Warehouse <span className="text-danger">*</span>
                      </Form.Label>
                      <div ref={warehouseSelectRef}>
                        <Select
                          value={getWarehouseValue()}
                          onChange={handleWarehouseSelect}
                          onInputChange={handleWarehouseSearch}
                          options={warehouseOptions}
                          placeholder="Search and select warehouse"
                          isClearable
                          isLoading={warehouseLoading}
                          isInvalid={!!formErrors.warehouseId}
                          filterOption={null}
                          noOptionsMessage={() => 'No warehouses found'}
                          isDisabled={isSubmitting || isAddingProduct}
                          styles={warehouseStyles}
                          menuPosition="fixed"
                          menuPlacement="auto"
                          menuShouldScrollIntoView={false}
                          menuShouldBlockScroll={true}
                          classNamePrefix="select"
                        />
                      </div>
                      {formErrors.warehouseId && (
                        <div className="text-danger small mt-1">{formErrors.warehouseId}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Product Details */}
            <Card className="mb-4">
              <Card.Header className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Product Details</h5>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={addProduct}
                    disabled={isSubmitting || inventoryLoading || isAddingProduct}
                  >
                    <FaPlus className="me-1" /> Add Product
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {inventoryLoading ? (
                  <div className="text-center py-4">
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading products...
                  </div>
                ) : inventoryList.length === 0 ? (
                  <Alert variant="warning">
                    No products found in inventory. Please add products first.
                  </Alert>
                ) : (
                  formData.products.map((product, index) => {
                    // Create custom styles function for each product
                    const createProductStyles = (productIndex) => ({
                      control: (base, state) => ({
                        ...base,
                        minHeight: '38px',
                        borderColor: formErrors[`productId_${productIndex}`]
                          ? '#dc3545'
                          : '#dee2e6',
                        '&:hover': {
                          borderColor: formErrors[`productId_${productIndex}`]
                            ? '#dc3545'
                            : '#dee2e6',
                        },
                        boxShadow: state.isFocused
                          ? '0 0 0 0.2rem rgba(13, 110, 253, 0.25)'
                          : 'none',
                        width: '100%',
                      }),
                      container: (base) => ({
                        ...base,
                        width: '100%',
                        position: 'relative',
                      }),
                      menu: (base, state) => {
                        const selectElement = productSelectRefs.current[productIndex]
                        let left = 0
                        let top = 0
                        let width = 'auto'

                        if (selectElement) {
                          const rect = selectElement.getBoundingClientRect()
                          left = rect.left
                          top = rect.bottom
                          width = rect.width
                        }

                        return {
                          ...base,
                          position: 'fixed',
                          zIndex: 99999,
                          left: `${left}px !important`,
                          top: `${top}px !important`,
                          width: `${width}px !important`,
                          maxHeight: '250px',
                          overflowY: 'auto',
                          minWidth: '300px',
                          maxWidth: 'calc(100vw - 20px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          border: '1px solid #dee2e6',
                          borderRadius: '4px',
                          backgroundColor: 'white',
                        }
                      },
                      menuList: (base) => ({
                        ...base,
                        maxHeight: '200px',
                        padding: '4px 0',
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? '#0d6efd'
                          : state.isFocused
                            ? '#f8f9fa'
                            : 'white',
                        color: state.isSelected ? 'white' : '#212529',
                        padding: '8px 12px',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer',
                        '&:active': {
                          backgroundColor: state.isSelected ? '#0d6efd' : '#e9ecef',
                        },
                        fontWeight: state.data?.value === 'new-product' ? 'bold' : 'normal',
                        color: state.data?.value === 'new-product' ? '#0d6efd' : base.color,
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        padding: '2px 8px',
                      }),
                      singleValue: (base) => ({
                        ...base,
                        fontSize: '14px',
                        color: '#212529',
                      }),
                      placeholder: (base) => ({
                        ...base,
                        fontSize: '14px',
                        color: '#6c757d',
                      }),
                      input: (base) => ({
                        ...base,
                        fontSize: '14px',
                        color: '#212529',
                      }),
                      indicatorsContainer: (base) => ({
                        ...base,
                        padding: '0 8px',
                      }),
                      clearIndicator: (base) => ({
                        ...base,
                        padding: '4px',
                        cursor: 'pointer',
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        padding: '4px',
                        cursor: 'pointer',
                      }),
                    })

                    const productStyles = createProductStyles(index)

                    return (
                      <Card key={index} className="mb-3 border">
                        <Card.Header className="bg-light py-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">Product {index + 1}</h6>
                            {formData.products.length > 1 && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => removeProduct(index)}
                                disabled={isSubmitting || isAddingProduct}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-3">
                            {/* Product Selection Dropdown with React Select */}
                            <Col md={12} lg={3}>
                              <Form.Group>
                                <Form.Label>
                                  Select Product <span className="text-danger">*</span>
                                </Form.Label>
                                <div
                                  ref={(el) => {
                                    if (el) {
                                      productSelectRefs.current[index] = el
                                    }
                                  }}
                                >
                                  <Select
                                    instanceId={`product-select-${index}`}
                                    value={getProductValue(product.productId)}
                                    onChange={(selected) => handleProductSelect(selected, index)}
                                    options={getProductOptions()}
                                    placeholder="Search product"
                                    isClearable
                                    isSearchable
                                    isLoading={inventoryLoading}
                                    isDisabled={isSubmitting || isAddingProduct}
                                    styles={productStyles}
                                    menuPosition="fixed"
                                    menuPlacement="auto"
                                    menuShouldScrollIntoView={false}
                                    menuShouldBlockScroll={true}
                                    filterOption={(option, inputValue) => {
                                      // Always show "Create New Product" option
                                      if (option.value === 'new-product') return true
                                      if (!inputValue) return true
                                      return option.label
                                        .toLowerCase()
                                        .includes(inputValue.toLowerCase())
                                    }}
                                    noOptionsMessage={({ inputValue }) =>
                                      inputValue
                                        ? `No products found for "${inputValue}"`
                                        : 'No products available'
                                    }
                                    classNamePrefix="select"
                                  />
                                </div>
                                {formErrors[`productId_${index}`] && (
                                  <div className="text-danger small mt-1">
                                    {formErrors[`productId_${index}`]}
                                  </div>
                                )}
                              </Form.Group>
                            </Col>

                            {/* Bag Size (Kg per bag) */}
                            <Col md={12} lg={3}>
                              <Form.Group>
                                <Form.Label>
                                  Bag Size (kg) <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  value={product.bagSize}
                                  onChange={(e) =>
                                    handleProductChange(index, 'bagSize', e.target.value)
                                  }
                                  onWheel={handleWheel} // Added to disable scroll wheel
                                  disabled={isSubmitting || isAddingProduct}
                                  placeholder="e.g., 50"
                                  min="0.01"
                                  step="0.01"
                                  isInvalid={!!formErrors[`bagSize_${index}`]}
                                />
                                {formErrors[`bagSize_${index}`] && (
                                  <div className="text-danger small mt-1">
                                    {formErrors[`bagSize_${index}`]}
                                  </div>
                                )}
                              </Form.Group>
                            </Col>

                            {/* Total Bags */}
                            <Col md={12} lg={3}>
                              <Form.Group>
                                <Form.Label>
                                  Total Bags <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  value={product.totalBags}
                                  onChange={(e) =>
                                    handleProductChange(index, 'totalBags', e.target.value)
                                  }
                                  onWheel={handleWheel} // Added to disable scroll wheel
                                  disabled={isSubmitting || isAddingProduct}
                                  placeholder="e.g., 100"
                                  min="1"
                                  step="1"
                                  isInvalid={!!formErrors[`totalBags_${index}`]}
                                />
                                {formErrors[`totalBags_${index}`] && (
                                  <div className="text-danger small mt-1">
                                    {formErrors[`totalBags_${index}`]}
                                  </div>
                                )}
                              </Form.Group>
                            </Col>

                            {/* Quantity (Metric Tons) - Read Only */}
                            <Col md={12} lg={3}>
                              <Form.Group>
                                <Form.Label>
                                  Quantity (MT) <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  value={product.quantityKg}
                                  onChange={(e) =>
                                    handleProductChange(index, 'quantityKg', e.target.value)
                                  }
                                  onWheel={handleWheel}
                                  disabled={isSubmitting || isAddingProduct}
                                  placeholder="e.g., 5"
                                  isInvalid={!!formErrors[`quantityKg_${index}`]}
                                  className="bg-light"
                                  readOnly
                                />
                                {formErrors[`quantityKg_${index}`] && (
                                  <div className="text-danger small mt-1">
                                    {formErrors[`quantityKg_${index}`]}
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    )
                  })
                )}
              </Card.Body>
            </Card>

            {/* Action Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="outline-secondary"
                onClick={handleReset}
                disabled={isSubmitting || isAddingProduct}
              >
                Reset Form
              </Button>
              <div>
                <Button
                  type="submit"
                  size="xl"
                  disabled={
                    isSubmitting ||
                    inventoryLoading ||
                    inventoryList.length === 0 ||
                    isAddingProduct
                  }
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* New Product Modal */}
      <Modal
        show={showNewProductModal}
        onHide={() => !isAddingProduct && setShowNewProductModal(false)}
        centered
      >
        <Modal.Header closeButton={!isAddingProduct} className="bg-primary text-white">
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddNewProduct}>
          <Modal.Body>
            <Alert variant="info" className="mb-3">
              <FaInfoCircle className="me-2" />
              Add a new product to the inventory. This product will be available for selection in
              all forms.
            </Alert>

            {productFields.map((field) => (
              <Form.Group key={field.name} className="mb-3">
                <Form.Label>
                  {field.label} {field.required && <span className="text-danger">*</span>}
                </Form.Label>
                <Form.Control
                  type={field.type}
                  name={field.name}
                  value={newProductData[field.name] || ''}
                  onChange={handleNewProductChange}
                  disabled={isAddingProduct}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  isInvalid={!!newProductErrors[field.name]}
                />
                {newProductErrors[field.name] && (
                  <Form.Control.Feedback type="invalid">
                    {newProductErrors[field.name]}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowNewProductModal(false)}
              disabled={isAddingProduct}
            >
              <FaTimes className="me-1" /> Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isAddingProduct}>
              {isAddingProduct ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Adding...
                </>
              ) : (
                <>
                  <FaPlus className="me-1" /> Add Product
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default GrByRoad
