import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
// import { fetchVehicles } from '../../../../slices/vehicleSlice'
import { fetchDrivers, fetchSupervisor } from '../../../DriverExpert/data/drivers'
import { fetchVehicles } from '../../../vehicle/data/VehicleListData'
import { TokenContext } from '../../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import { useQuery } from '@tanstack/react-query'
import { getWorkerApi } from '../../../TransportPass/data/data'
import Select from 'react-select'

const defaultFormData = {
  supervisorId: '',
  workerId: '',
  companyName: '',
  companyEmail: '',
  companyMobileNumber: '',
  companyOfficeNumber: '',
  companyAddress: '',
  gstIn: '',
  lorryNumber: '',
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
  startLocation: '',
  endLocation: '',
  itemName: '',
  itemQuantity: '',
  itemUnit: '',
  itemWeight: '',
  itemcost: '',
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
}

const LorryReceiptForm = ({ show, handleClose, handleSubmit, initialData = {}, mode = 'add' }) => {
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
  const { data: workerList = [], isFetching } = useQuery({
    queryKey: ['workerList'],
    queryFn: getWorkerApi,
    staleTime: 1000 * 60 * 30,
  })

  console.log('worker listttttttttttt', workerList)

  // const dispatch = useDispatch()
  // const { vehicles, status: vehicleStatus } = useSelector((state) => state.vehicle)
  console.log('vehiclesssssssssssssss', vehicles)

  // Fetch drives
  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const data = await fetchDrivers()
        setDrivers(data || [])
        console.log('Fetched drivers:', data) // Debugging
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
      console.log('formdata WWWWWWWWWWWWWWWWWWWWWWWWWWW', initialData)
      setFormData({
        ...defaultFormData,
        ...initialData,
        vehicleName: vehicles.find((vehicle) => vehicle.id === initialData.vehicleId)?.name || '',
        driverName: drivers.find((driver) => driver.id === initialData.driverId)?.name || '',
      })
    } else {
      setFormData(defaultFormData) // Reset for 'add' mode
    }
  }, [initialData, mode, vehicles, drivers])

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log('valueee all this driver and vehicle', value)

    if (name === 'vehicleId') {
      const selectedVehicle = vehicles.find((v) => v.id === value || v._id === value) // handle both cases
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
        driverName: selectedDriver?.name || '', // optional, only if needed
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // In LorryReceiptForm.jsx
  const onSubmit = (e) => {
    e.preventDefault()
    let payload = {
      ...formData,
      date: formData.date ? new Date(formData.date).toISOString() : '', // Handle date
    }

    // Remove supervisor fields if not superadmin
    if (userRole !== 'superadmin') {
      delete payload.supervisorId
      delete payload.supervisorName
    }

    handleSubmit(payload)
  }

  // console.log(
  //   'Prefiled data',
  //   workerList,
  //   'formData',
  //   formData,
  //   'initialData',
  //   initialData,
  // )

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">{mode === 'edit' ? 'Edit' : 'Add'} Lorry Receipt</h4>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={handleClose}
          ></button>
        </div>

        <Form onSubmit={onSubmit}>
          {/* Select Users */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Select Users</h5>
          <div className="row g-3 mb-4">
            {/* Show Supervisor dropdown only if role === superadmin */}
            {/* Supervisor dropdown (only for superadmin) */}
            {userRole === 'superadmin' && (
              <div className="col-md-4">
                <Form.Label>Supervisor</Form.Label>
                <Select
                  name="supervisorId"
                  value={
                    supervisorOptions.find((sup) => sup.value === formData.supervisorId) || null
                  }
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      supervisorId: selected ? selected.value : '',
                      supervisorName: selected ? selected.label : '', // optional
                    }))
                  }
                  options={supervisorOptions}
                  placeholder="Select Supervisor"
                  isClearable
                />
              </div>
            )}

            {/* Worker dropdown */}
            <div className="col-md-4">
              <Form.Label>Worker</Form.Label>
              <Select
                name="workerId"
                value={
                  workerList
                    .map((w) => ({ value: w.id, label: w.name, supervisorId: w.supervisorId }))
                    .find((w) => w.value === formData.workerId) || null
                }
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    workerId: selected ? selected.value : '',
                    workerName: selected ? selected.label : '', // optional
                  }))
                }
                options={workerList
                  .filter((w) =>
                    userRole === 'superadmin' ? w.supervisorId === formData.supervisorId : true,
                  )
                  .map((w) => ({
                    value: w.id,
                    label: w.name,
                  }))}
                placeholder="Select Worker"
                isClearable
              />
            </div>
          </div>

          {/* Company Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Company Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Company Address</Form.Label>
              <Form.Control
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>GST IN</Form.Label>
              <Form.Control name="gstIn" value={formData.gstIn} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <Form.Label>Company Email-ID</Form.Label>
              <Form.Control
                type="email"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Company Office Number</Form.Label>
              <Form.Control
                name="companyOfficeNumber"
                value={formData.companyOfficeNumber}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Company Mobile Number</Form.Label>
              <Form.Control
                name="companyMobileNumber"
                value={formData.companyMobileNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Basic Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Basic Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Label>Lorry Number</Form.Label>
              <Form.Control
                type="number"
                name="lorryNumber"
                value={formData.lorryNumber}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <Form.Label>
                Date <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.originalDate ? formData.originalDate.split('T')[0] : ''}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <Form.Label>
                Vehicle Name <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Select
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id || vehicle._id} value={vehicle.id || vehicle._id}>
                    {vehicle.name}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="col-md-4">
              <Form.Label>
                Driver Name <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Select
                onChange={handleChange}
                name="driverId"
                value={formData.driverId}
                required
              >
                <option value="">Select Driver</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="col-md-4">
              <Form.Label>Owner Name</Form.Label>
              <Form.Control name="ownerName" value={formData.ownerName} onChange={handleChange} />
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
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Consignor Address</Form.Label>
              <Form.Control
                name="consignorAddress"
                value={formData.consignorAddress}
                onChange={handleChange}
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
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Consignee Address</Form.Label>
              <Form.Control
                name="consigneeAddress"
                value={formData.consigneeAddress}
                onChange={handleChange}
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
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Customer Address</Form.Label>
              <Form.Control
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
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
              />
            </div>
            <div className="col-md-6">
              <Form.Label>End Location</Form.Label>
              <Form.Control
                name="endLocation"
                value={formData.endLocation}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Cargo Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Cargo Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <Form.Label>Item Name</Form.Label>
              <Form.Control name="itemName" value={formData.itemName} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <Form.Label>Item Quantity</Form.Label>
              <Form.Control
                type="number"
                name="itemQuantity"
                value={formData.itemQuantity}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Item Unit</Form.Label>
              <Form.Control
                type="number"
                name="itemUnit"
                value={formData.itemUnit}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Item Weight</Form.Label>
              <Form.Control
                type="number"
                name="itemWeight"
                value={formData.itemWeight}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Charged Weight</Form.Label>
              <Form.Control
                type="number"
                name="itemcost"
                value={formData.itemcost}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Seal Number</Form.Label>
              <Form.Control name="sealNumber" value={formData.sealNumber} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <Form.Label>Container Number</Form.Label>
              <Form.Control
                name="containerNumber"
                value={formData.containerNumber}
                onChange={handleChange}
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
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Total Amount</Form.Label>
              <Form.Control
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Transporter Rate</Form.Label>
              <Form.Control
                type="number"
                name="transporterRate"
                value={formData.transporterRate}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Total Transporter Amount</Form.Label>
              <Form.Control
                type="number"
                name="totalTransporterAmount"
                value={formData.totalTransporterAmount}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Transporter Rate On</Form.Label>
              <Form.Control
                type="number"
                name="transporterRateOn"
                value={formData.transporterRateOn}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Customer Rate On</Form.Label>
              <Form.Control
                type="number"
                name="customerRateOn"
                value={formData.customerRateOn}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Customer Freight</Form.Label>
              <Form.Control
                type="number"
                name="customerFreight"
                value={formData.customerFreight}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Form.Label>Transporter Freight</Form.Label>
              <Form.Control
                type="number"
                name="transporterFreight"
                value={formData.transporterFreight}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="text-end mt-4">
            <Button type="submit">{mode === 'edit' ? 'Update Receipt' : 'Create Receipt'}</Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default LorryReceiptForm
