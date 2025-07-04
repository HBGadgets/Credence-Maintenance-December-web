import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { postTyreSystemApi, updateDriver } from '../../data/VehicleListData'
import Swal from 'sweetalert2'
import Select from 'react-select'

const TyreAssignModal = ({
  show,
  onClose,
  onAssign,
  vehicleId,
  position,
  tyreLabel,
  refetchData = () => {},
  initialData = null,
  size = 'lg',
}) => {
  const [formData, setFormData] = useState({
    serialNo: '',
    brandName: '',
    category: '',
    tyreStatus: '',
    installationDate: '',
    vendorName: '',
    location: '',
    tyreSize: '',
    billImg: null,
    amount: '',
    paymentMode: '',
    position: position || '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'billImg') {
      setFormData({ ...formData, billImg: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  // Post
  const { mutate, isLoading } = useMutation({
    mutationFn: async (data) => await postTyreSystemApi(data),
    onSuccess: async () => {
      await Swal.fire({
        icon: 'success',
        title: 'Tyre Assigned Successfully',
        timer: 1500,
        showConfirmButton: false,
      })
      if (refetchData) await refetchData()
      onClose()
    },
    onError: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err?.response?.data?.message || 'Tyre assignment failed',
      })
    },
  })

  // Patch
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => await updateDriver(id, data),
    onSuccess: async () => {
      await Swal.fire({
        icon: 'success',
        title: 'Tyre Updated Successfully',
        timer: 1500,
        showConfirmButton: false,
      })
      if (refetchData) await refetchData()
      onClose()
    },
    onError: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err?.response?.data?.message || 'Tyre update failed',
      })
    },
  })

  // tyre position options -----
  const positionOptions = []

  const maxPosition = 10 // Change this to generate more or fewer positions
  const positions = ['RI', 'RO', 'LI', 'LO']
  const labels = {
    RI: 'Rear Right Inner',
    RO: 'Rear Right Outer',
    LI: 'Rear Left Inner',
    LO: 'Rear Left Outer',
  }

  // Optional: manually include special cases if needed
  positionOptions.push({ value: 'RI1', label: 'Front Right Position 1' })
  positionOptions.push({ value: 'LI1', label: 'Front Left Position 1' })

  // Start from position 2, since 1 was already added manually above
  for (let i = 2; i <= maxPosition; i++) {
    for (const code of positions) {
      positionOptions.push({
        value: `${code}${i}`,
        label: `${labels[code]} ${i}`,
      })
    }
  }
  // ------

  useEffect(() => {
    if (initialData) {
      setFormData({
        serialNo: initialData?.tyreSerialNumber || '',
        brandName: initialData?.brandName || '',
        category: initialData?.category || '',
        tyreStatus: initialData?.tyreStatus || '',
        installationDate: initialData?.installationDate || '',
        vendorName: initialData?.vendorName || '',
        location: initialData?.location || '',
        tyreSize: initialData?.tyreSize || '',
        billImg: null,
        amount: initialData?.amount || '',
        paymentMode: initialData?.paymentMode || '',
        position: initialData?.position || tyreLabel || '',
      })
    } else {
      setFormData({
        serialNo: '',
        brandName: '',
        category: '',
        tyreStatus: '',
        installationDate: '',
        vendorName: '',
        location: '',
        tyreSize: '',
        billImg: null,
        amount: '',
        paymentMode: '',
        position: tyreLabel || '',
      })
    }
  }, [initialData, tyreLabel, show])

  const handleSubmit = async () => {
    const requiredFields = [
      'position',
      'serialNo',
      'brandName',
      'category',
      'tyreStatus',
      'installationDate',
      'vendorName',
      'location',
      'tyreSize',
      'amount',
      'paymentMode',
    ]

    const newErrors = {}
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = true
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const firstInvalid = document.querySelector('[aria-invalid="true"]')
      if (firstInvalid) firstInvalid.focus()

      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all required fields.',
      })

      return
    }

    setErrors({}) // Clear errors if all fields are valid

    const isEditing = !!initialData?.position

    const confirm = await Swal.fire({
      title: isEditing ? 'Update Tyre Assignment?' : 'Assign Tyre?',
      text: isEditing
        ? `Do you want to update the tyre at position ${tyreLabel}?`
        : `Do you want to assign the tyre to position ${tyreLabel}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: isEditing ? 'Yes, update it!' : 'Yes, assign it!',
      cancelButtonText: 'Cancel',
    })

    if (!confirm.isConfirmed) return

    const dataToSend = new FormData()
    dataToSend.append('tyreSerialNumber', formData.serialNo)
    dataToSend.append('brandName', formData.brandName)
    dataToSend.append('category', formData.category)
    dataToSend.append('tyreStatus', formData.tyreStatus)
    dataToSend.append('installationDate', formData.installationDate)
    dataToSend.append('vendorName', formData.vendorName)
    dataToSend.append('location', formData.location)
    dataToSend.append('tyreSize', formData.tyreSize)
    dataToSend.append('amount', formData.amount)
    dataToSend.append('paymentMode', formData.paymentMode)
    // dataToSend.append('position', tyreLabel)
    dataToSend.append('vehicleId', vehicleId)
    dataToSend.append('position', formData.position)

    if (formData.billImg) {
      dataToSend.append('billImg', formData.billImg)
    }

    if (isEditing) {
      updateMutation.mutate({ id: initialData?.id, data: dataToSend })
    } else {
      mutate(dataToSend)
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered scrollable size={size}>
      <Modal.Header closeButton>
        <Modal.Title>Assign Tyre</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>
              Tyre Position <span className="text-danger">*</span>
            </Form.Label>
            <Select
              name="position"
              options={positionOptions}
              value={positionOptions.find((opt) => opt.value === formData.position) || null}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, position: selected?.value || '' }))
              }
              isClearable
              placeholder="-- Select Tyre Position --"
              classNamePrefix="react-select"
              className={errors.position ? 'is-invalid' : ''}
            />
            {errors.position && (
              <div className="invalid-feedback d-block">Position is required.</div>
            )}
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              Serial No <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleChange}
              isInvalid={!!errors.serialNo}
              aria-invalid={!!errors.serialNo}
            />
            <Form.Control.Feedback type="invalid">Serial number is required.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              Brand Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              isInvalid={!!errors.brandName}
              aria-invalid={!!errors.brandName}
            />
            <Form.Control.Feedback type="invalid">Brand name is required.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              Vehicle Category <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              isInvalid={!!errors.category}
              aria-invalid={!!errors.category}
            >
              <option value="" disabled hidden>
                -- Select Vehicle Category --
              </option>
              <option value="car">Car</option>
              <option value="truck">Truck</option>
              <option value="bus">Bus</option>
              <option value="other">Other</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Vehicle category is required.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              Status <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="tyreStatus"
              value={formData.tyreStatus}
              onChange={handleChange}
              isInvalid={!!errors.tyreStatus}
              aria-invalid={!!errors.tyreStatus}
            >
              <option value="" disabled hidden>
                -- Select Status --
              </option>
              <option value="new">New</option>
              <option value="in-use">In Use</option>
              <option value="need-replacement">Need Replacement</option>
              <option value="second-hand">Second Hand</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">Status is required.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              Installation Date <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="installationDate"
              value={formData.installationDate}
              onChange={handleChange}
              isInvalid={!!errors.installationDate}
              aria-invalid={!!errors.installationDate}
            />
            <Form.Control.Feedback type="invalid">
              Installation date is required.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              Shop Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="vendorName"
              value={formData.vendorName}
              onChange={handleChange}
              isInvalid={!!errors.vendorName}
              aria-invalid={!!errors.vendorName}
            />
            <Form.Control.Feedback type="invalid">Shop name is required.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              Location <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              isInvalid={!!errors.location}
              aria-invalid={!!errors.location}
            />
            <Form.Control.Feedback type="invalid">Location is required.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              Tyre Size <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="tyreSize"
              value={formData.tyreSize}
              onChange={handleChange}
              isInvalid={!!errors.tyreSize}
              aria-invalid={!!errors.tyreSize}
            />
            <Form.Control.Feedback type="invalid">Tyre size is required.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Bill Image</Form.Label>
            <Form.Control type="file" name="billImg" accept="image/*" onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              Amount <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              isInvalid={!!errors.amount}
              aria-invalid={!!errors.amount}
            />
            <Form.Control.Feedback type="invalid">Amount is required.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              Payment Mode <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
              isInvalid={!!errors.paymentMode}
              aria-invalid={!!errors.paymentMode}
            >
              <option value="" disabled hidden>
                -- Select Payment Mode --
              </option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">Payment mode is required.</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit} disabled={isLoading}>
          {initialData?.position
            ? isLoading
              ? 'Updating...'
              : 'Update'
            : isLoading
              ? 'Assigning...'
              : 'Assign'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default TyreAssignModal
