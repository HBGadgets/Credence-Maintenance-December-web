import React, { useState, useRef, useEffect } from 'react'
import { Card, Button, Form, Row, Col, Alert, Modal } from 'react-bootstrap'
import { FaInfoCircle, FaSave, FaPlus, FaTimes } from 'react-icons/fa'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast, ToastContainer } from 'react-toastify'
import Select from 'react-select'
import {
  postGodownTPApi,
  getInventoryApi,
  postInvenotryApi,
} from '../../Warehouse Section/data/data'

const defaultProduct = {
  productId: '',
  productName: '',
  quantityMT: '',
  bagSize: '',
  totalBags: '',
}

const defaultFormData = {
  tpPassType: 'GrByRail',
  issuedBy: 'Rack',
  receivedBy: 'Railhead',
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

const GrByRail = ({ setShowForm, setSelectedFormType }) => {
  const [formData, setFormData] = useState(defaultFormData)
  const [formErrors, setFormErrors] = useState({})
  const [showNewProductModal, setShowNewProductModal] = useState(false)
  const [newProductData, setNewProductData] = useState({
    name: '',
    category: '',
  })
  const [newProductErrors, setNewProductErrors] = useState({})
  const selectRefs = useRef([])

  const queryClient = useQueryClient()

  // Initialize refs array
  useEffect(() => {
    selectRefs.current = selectRefs.current.slice(0, formData.products.length)
  }, [formData.products.length])

  const handleWheel = (e) => {
    e.target.blur()
  }

  const { data: inventoryResponse = {}, isFetching: inventoryLoading } = useQuery({
    queryKey: ['inventoryList', { page: 1, limit: 100 }],
    queryFn: ({ queryKey }) => getInventoryApi({ queryKey }),
    staleTime: 1000 * 60 * 30,
  })

  const inventoryList = inventoryResponse?.data || []

  const { mutate: postGrByRail, isLoading: isSubmitting } = useMutation({
    mutationFn: postGodownTPApi,
    onSuccess: () => {
      toast.success('GR By Rail added successfully!')
      queryClient.invalidateQueries({ queryKey: ['getGodownTP'] })
      setFormData(defaultFormData)
      if (setShowForm) setShowForm(false)
      if (setSelectedFormType) setSelectedFormType(null)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit form')
    },
  })

  const { mutate: postInvenotry, isLoading: isAddingProduct } = useMutation({
    mutationFn: postInvenotryApi,
    onSuccess: (response) => {
      toast.success('Product added successfully!')
      queryClient.invalidateQueries({ queryKey: ['inventoryList'], exact: false })
      setShowNewProductModal(false)
      setNewProductData({ name: '', category: '' })
      setNewProductErrors({})

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
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
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
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
    if (!newProductData.name.trim()) errors.name = 'Product name is required'
    if (!newProductData.category.trim()) errors.category = 'Category is required'
    return errors
  }

  const handleAddNewProduct = (e) => {
    e.preventDefault()
    const errors = validateNewProduct()
    if (Object.keys(errors).length > 0) {
      setNewProductErrors(errors)
      return
    }

    const payload = {
      name: newProductData.name.trim(),
      category: newProductData.category.trim(),
    }
    postInvenotry(payload)
  }

  const validateForm = () => {
    const errors = {}
    formData.products.forEach((product, index) => {
      if (!product.productId) {
        errors[`productId_${index}`] = `Product selection for product ${index + 1} is required`
      }
      // Quantity is required
      if (!product.quantityMT || parseFloat(product.quantityMT) <= 0) {
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

    const currentDate = new Date().toISOString().split('T')[0]
    const payload = {
      tpPassType: formData.tpPassType,
      issuedBy: formData.issuedBy,
      receivedBy: formData.receivedBy,
      date: currentDate,
      products: formData.products.map((product) => ({
        productId: product.productId,
        productName: product.productName || '',
        quantityMT: parseFloat(product.quantityMT),
        bagSize: product.bagSize ? parseFloat(product.bagSize) : 0,
        totalBags: product.totalBags ? parseInt(product.totalBags) : 0,
      })),
    }

    console.log('Final API payload:', payload)
    postGrByRail(payload)
  }

  const getProductOptions = () => {
    const productOptions = inventoryList.map((item) => ({
      value: item._id,
      label: `${item.productName}${item.category ? ` (${item.category})` : ''}`,
      productName: item.productName,
    }))

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

  const handleProductSelect = (selected, index) => {
    if (selected === null) {
      const updatedProducts = [...formData.products]
      updatedProducts[index] = {
        ...updatedProducts[index],
        productId: '',
        productName: '',
      }
      setFormData((prev) => ({ ...prev, products: updatedProducts }))
      if (formErrors[`productId_${index}`]) {
        setFormErrors((prev) => ({ ...prev, [`productId_${index}`]: '' }))
      }
      return
    }

    if (selected?.value === 'new-product') {
      setShowNewProductModal(true)
      return
    }

    const selectedProduct = inventoryList.find((item) => item._id === selected?.value)
    if (selectedProduct) {
      const updatedProducts = [...formData.products]
      updatedProducts[index] = {
        ...updatedProducts[index],
        productId: selectedProduct._id,
        productName: selectedProduct.productName || '',
      }
      setFormData((prev) => ({ ...prev, products: updatedProducts }))
      if (formErrors[`productId_${index}`]) {
        setFormErrors((prev) => ({ ...prev, [`productId_${index}`]: '' }))
      }
    }
  }

  const handleReset = () => {
    setFormData(defaultFormData)
    setFormErrors({})
  }

  return (
    <>
      <ToastContainer />

      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <h4 className="mb-0">GR By Rail Form</h4>
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
            <Row className="g-3 mb-4">
              <Col md={3}>
                <Form.Group className="d-flex align-items-center gap-2">
                  <Form.Label className="mb-0 fw-semibold">Date:</Form.Label>
                  <Form.Control
                    type="text"
                    value={new Date().toLocaleDateString()}
                    readOnly
                    className="bg-light"
                    style={{ width: '160px' }}
                  />
                </Form.Group>
              </Col>
            </Row>

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
                    // Create custom styles function for each product to access index
                    const createCustomStyles = (productIndex) => ({
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
                        // Get the select container position
                        const selectElement = selectRefs.current[productIndex]
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

                    const customStyles = createCustomStyles(index)

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
                            <Col md={12} lg={3}>
                              <Form.Group>
                                <Form.Label>
                                  Select Product <span className="text-danger">*</span>
                                </Form.Label>
                                <div
                                  ref={(el) => {
                                    if (el) {
                                      selectRefs.current[index] = el
                                    }
                                  }}
                                >
                                  <Select
                                    instanceId={`product-select-${index}`}
                                    value={getProductValue(product.productId)}
                                    onChange={(selected) => handleProductSelect(selected, index)}
                                    options={getProductOptions()}
                                    placeholder="Search and select product"
                                    isClearable
                                    isSearchable
                                    isLoading={inventoryLoading}
                                    isDisabled={isSubmitting || isAddingProduct}
                                    styles={customStyles}
                                    menuPosition="fixed"
                                    menuPlacement="auto"
                                    menuShouldScrollIntoView={false}
                                    menuShouldBlockScroll={true}
                                    filterOption={(option, inputValue) => {
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
                                {product.productName && (
                                  <Form.Text className="text-muted">
                                    Selected: {product.productName}
                                  </Form.Text>
                                )}
                              </Form.Group>
                            </Col>

                            <Col md={12} lg={3}>
                              <Form.Group>
                                <Form.Label>Bag Size (kg)</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={product.bagSize}
                                  onChange={(e) =>
                                    handleProductChange(index, 'bagSize', e.target.value)
                                  }
                                  onWheel={handleWheel}
                                  disabled={isSubmitting || isAddingProduct}
                                  placeholder="e.g., 50"
                                  min="0.01"
                                  step="0.01"
                                />
                                <Form.Text className="text-muted">
                                  Weight per bag in kilograms (optional)
                                </Form.Text>
                              </Form.Group>
                            </Col>

                            <Col md={12} lg={3}>
                              <Form.Group>
                                <Form.Label>Total Bags</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={product.totalBags}
                                  onChange={(e) =>
                                    handleProductChange(index, 'totalBags', e.target.value)
                                  }
                                  onWheel={handleWheel}
                                  disabled={isSubmitting || isAddingProduct}
                                  placeholder="e.g., 100"
                                  min="1"
                                  step="1"
                                />
                                <Form.Text className="text-muted">
                                  Total number of bags (optional)
                                </Form.Text>
                              </Form.Group>
                            </Col>

                            <Col md={12} lg={3}>
                              <Form.Group>
                                <Form.Label>
                                  Quantity (MT) <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  value={product.quantityMT}
                                  onChange={(e) =>
                                    handleProductChange(index, 'quantityMT', e.target.value)
                                  }
                                  onWheel={handleWheel}
                                  disabled={isSubmitting || isAddingProduct}
                                  placeholder="e.g., 5"
                                  min="0.001"
                                  step="0.001"
                                  isInvalid={!!formErrors[`quantityKg_${index}`]}
                                />
                                {formErrors[`quantityKg_${index}`] && (
                                  <div className="text-danger small mt-1">
                                    {formErrors[`quantityKg_${index}`]}
                                  </div>
                                )}
                                <Form.Text className="text-muted">
                                  Quantity in metric tons (required)
                                </Form.Text>
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

      <Modal
        show={showNewProductModal}
        onHide={() => !isAddingProduct && setShowNewProductModal(false)}
        backdrop="static"
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

export default GrByRail
