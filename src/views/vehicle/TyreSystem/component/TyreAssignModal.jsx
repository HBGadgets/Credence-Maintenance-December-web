import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { postTyreSystemApi, updateDriver } from '../../data/VehicleListData'
import Swal from 'sweetalert2'

const TyreAssignModal = ({
  show,
  onClose,
  onAssign,
  vehicleId,
  tyreLabel,
  refetchData = () => {}, // Function to refetch data in parent component
  initialData = null, // Initial data to pre-fill the form, if any
  size = 'lg', // You can pass 'sm', 'lg', or 'xl' from parent
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
  })

  // handle form change
  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'billImg') {
      setFormData({ ...formData, billImg: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  // POST mutation setup
  const { mutate, isLoading } = useMutation({
    mutationFn: async (data) => await postTyreSystemApi(data),
    onSuccess: async () => {
      await Swal.fire({
        icon: 'success',
        title: 'Tyre Assigned Successfully',
        timer: 1500,
        showConfirmButton: false,
      })

      // Refresh data in parent components
      if (refetchData) {
        await refetchData()
      }

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

  // Patch mutation
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

  // use effect to pre-fill form data if initialData is provided
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
        billImg: null, // don't pre-fill file input
        amount: initialData?.amount || '',
        paymentMode: initialData?.paymentMode || '',
      })
    } else {
      // reset on new add
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
      })
    }
  }, [initialData, show])

  // submit handler

  const handleSubmit = async () => {
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
    dataToSend.append('position', tyreLabel)
    dataToSend.append('vehicleId', vehicleId)

    if (formData.billImg) {
      dataToSend.append('billImg', formData.billImg)
    }

    if (isEditing) {
      updateMutation.mutate({ id: initialData?.id, data: dataToSend })
    } else {
      mutate(dataToSend) // old mutation for POST
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
            <Form.Label>Tyre Position</Form.Label>
            <Form.Control type="text" value={tyreLabel} disabled />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Serial No.</Form.Label>
            <Form.Control
              type="text"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Brand Name</Form.Label>
            <Form.Control
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Vehicle Category</Form.Label>
            <Form.Select name="category" value={formData.category} onChange={handleChange}>
              <option value="" disabled hidden>
                -- Select Vehicle Category --
              </option>
              <option value="car">Car</option>
              <option value="truck">Truck</option>
              <option value="bus">Bus</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Status</Form.Label>
            <Form.Select name="tyreStatus" value={formData.tyreStatus} onChange={handleChange}>
              <option value="" disabled hidden>
                -- Select Status --
              </option>
              <option value="new">New</option>
              <option value="in-use">In Use</option>
              <option value="need-replacement">Need Replacement</option>
              <option value="second-hand">Second Hand</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Installation Date</Form.Label>
            <Form.Control
              type="date"
              name="installationDate"
              value={formData.installationDate}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Shop Name</Form.Label>
            <Form.Control
              type="text"
              name="vendorName"
              value={formData.vendorName}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Tyre Size</Form.Label>
            <Form.Control
              type="text"
              name="tyreSize"
              value={formData.tyreSize}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Bill Image</Form.Label>
            <Form.Control type="file" name="billImg" accept="image/*" onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Payment Mode</Form.Label>
            <Form.Select name="paymentMode" value={formData.paymentMode} onChange={handleChange}>
              <option value="" disabled hidden>
                -- Select Payment Mode --
              </option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </Form.Select>
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
