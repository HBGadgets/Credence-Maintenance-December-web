import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import Select from 'react-select'

const InventoryModal = ({
  show,
  editMode,
  selectedWarehouseId,
  setSelectedWarehouseId,
  products,
  setProducts,
  handleAddProduct,
  handleRemoveProduct,
  handleProductChange,
  handleFormSubmit,
  isSubmitting,
  isUpdating,
  warehouseOptions,
  productOptions,
  onClose,
  resetForm,
}) => {
  const [errors, setErrors] = useState({})

  if (!show) return null

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editMode ? 'Edit Inventory' : 'Add Inventory'}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                onClose()
                resetForm()
              }}
            ></button>
          </div>

          <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            <Form>
              {/* Warehouse Selection */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Warehouse <span className="text-danger">*</span>
                </Form.Label>
                <Select
                  options={warehouseOptions}
                  value={warehouseOptions.find((opt) => opt.value === selectedWarehouseId)}
                  onChange={(selected) => setSelectedWarehouseId(selected?.value || null)}
                  placeholder="Select Warehouse"
                  isClearable
                />
                {errors.warehouseId && <div className="text-danger">{errors.warehouseId}</div>}
              </Form.Group>

              {/* Products Section */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6>
                    Products <span className="text-danger">*</span>
                  </h6>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleAddProduct}
                    disabled={products.length >= 10}
                  >
                    + Add Product
                  </Button>
                </div>

                {products.map((product, index) => (
                  <div key={index} className="border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">Product {index + 1}</h6>
                      {products.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveProduct(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="row g-3">
                      {/* Product Selection */}
                      <div className="col-md-4">
                        <Form.Label>Product Name</Form.Label>
                        <Select
                          options={productOptions}
                          value={productOptions.find((opt) => opt.value === product.productId)}
                          onChange={(selected) =>
                            handleProductChange(index, 'productId', selected?.value || '')
                          }
                          placeholder="Select Product"
                          isClearable
                        />
                      </div>

                      {/* Quantity */}
                      <div className="col-md-3">
                        <Form.Label>Quantity (KG)</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter quantity"
                          value={product.quantityKg}
                          onChange={(e) => handleProductChange(index, 'quantityKg', e.target.value)}
                          min="0"
                        />
                      </div>

                      {/* Bag Size */}
                      <div className="col-md-3">
                        <Form.Label>Bag Size (KG)</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter bag size"
                          value={product.bagSizeKg}
                          onChange={(e) => handleProductChange(index, 'bagSizeKg', e.target.value)}
                          min="0"
                        />
                      </div>

                      {/* Calculated Bags */}
                      <div className="col-md-2">
                        <Form.Label>Total Bags</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            product.quantityKg && product.bagSizeKg && product.bagSizeKg > 0
                              ? Math.ceil(product.quantityKg / product.bagSizeKg)
                              : '0'
                          }
                          readOnly
                          className="bg-light"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Form>
          </div>

          <div className="modal-footer">
            <Button
              variant="secondary"
              onClick={() => {
                onClose()
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleFormSubmit}
              disabled={isSubmitting || isUpdating}
            >
              {isSubmitting || isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryModal
