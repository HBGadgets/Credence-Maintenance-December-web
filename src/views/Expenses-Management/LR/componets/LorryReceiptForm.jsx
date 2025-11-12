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

  // Fetch companies
  const { data: companyList, isFetch } = useQuery({
    queryKey: ['companyList'],
    queryFn: getCompanyNameApi,
    staleTime: 1000 * 60 * 30,
  })

  console.log('company data', companyList)

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
      console.log('formdata', initialData)
      setFormData({
        ...defaultFormData,
        ...initialData,
        vehicleName: vehicles.find((vehicle) => vehicle.id === initialData.vehicleId)?.name || '',
        driverName: drivers.find((driver) => driver.id === initialData.driverId)?.name || '',
        companyId: initialData.companyId || '',
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
      companyId: formData.companyId || '',
      date: formData.date ? new Date(formData.date).toISOString() : '', // Handle date
    }

    // Remove supervisor fields if not superadmin
    if (userRole !== 'superadmin') {
      delete payload.supervisorId
      delete payload.supervisorName
    }

    handleSubmit(payload)
  }

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
              <Form.Label>Employees</Form.Label>
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
                placeholder="Select Employee"
                isClearable
              />
            </div>
          </div>

          {/* Company Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Company Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <Form.Label>Company Name</Form.Label>
              <Select
                name="companyName"
                value={
                  companyList
                    ?.map((c) => ({ value: c.id, label: c.companyName }))
                    .find((c) => c.label === formData.companyName) || null
                }
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
                    // Reset company details if cleared
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
                options={companyList?.map((c) => ({
                  value: c.id,
                  label: c.companyName,
                }))}
                placeholder="Select Company"
                isClearable
              />
            </div>
          </div>

          {/* Basic Details */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3">Basic Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Label>
                Date <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date ? formData.date.split('T')[0] : ''}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <Form.Label>
                Vehicle Name (Lorry Number) <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <CreatableSelect
                name="vehicleId"
                value={
                  vehicles
                    ?.map((v) => ({ value: v.id || v._id, label: v.name }))
                    .find((v) => v.value === formData.vehicleId) ||
                  (formData.vehicleName
                    ? { value: formData.vehicleId, label: formData.vehicleName }
                    : null)
                }
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
                options={vehicles?.map((v) => ({
                  value: v.id || v._id,
                  label: v.name,
                }))}
                placeholder="Select or type new vehicle"
                isClearable
              />
            </div>

            <div className="col-md-4">
              <Form.Label>
                Driver Name <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <CreatableSelect
                name="driverId"
                value={
                  drivers
                    ?.map((d) => ({ value: d.id, label: d.name }))
                    .find((d) => d.value === formData.driverId) ||
                  (formData.driverName
                    ? { value: formData.driverId, label: formData.driverName }
                    : null)
                }
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
                options={drivers?.map((d) => ({
                  value: d.id,
                  label: d.name,
                }))}
                placeholder="Select or type new driver"
                isClearable
              />
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
