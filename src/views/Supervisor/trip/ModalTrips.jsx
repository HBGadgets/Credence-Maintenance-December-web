import React, { useState, useEffect } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDrivers } from '../../DriverExpert/data/drivers'
import { fetchVehicles } from '../../../slices/vehicleSlice'
import { CSpinner } from '@coreui/react'
import { fetchTripDataHelper, handleAddHelper, handleEditHelper } from './componets/tripHelpers'

const ModalTrips = ({ mode, selectedTrip, onClose, onSubmit, fetchTripData }) => {
  const [drivers, setDrivers] = useState([])
  const [tripData, setTripData] = useState({
    _id: '', // optional but helpful
    date: '',
    driverId: '',
    driverName: '',
    vehicleId: '',
    vehicleName: '',
    startLocation: '',
    endLocation: '',
    budgetAllocated: '',
    materialType: '',
    status: '',
  })

  const { vehicles, status: vehicleStatus } = useSelector((state) => state.vehicle)
  const dispatch = useDispatch()
  const fetchData = fetchTripDataHelper()

  // Fetch Drivers
  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const data = await fetchDrivers()
        setDrivers(data)
        console.log('Fetched drivers:', data)
      } catch (error) {
        console.error('Error fetching drivers:', error)
      }
    }

    loadDrivers()
  }, [])

  // Fetch Vehicles
  useEffect(() => {
    if (vehicleStatus === 'idle') {
      dispatch(fetchVehicles())
    }
  }, [dispatch, vehicleStatus])

  // Prefill form with selected trip data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && selectedTrip) {
      setTripData({
        _id: selectedTrip.id, //include this line
        date: selectedTrip.date,
        driverId: selectedTrip.driverId,
        driverName: selectedTrip.driverName,
        vehicleId: selectedTrip.vehicleId,
        vehicleName: selectedTrip.vehicleName,
        startLocation: selectedTrip.startLocation,
        endLocation: selectedTrip.endLocation,
        budgetAllocated: selectedTrip.budgetAllocated,
        materialType: selectedTrip.materialType,
        status: selectedTrip.status,
      })
    }
  }, [mode, selectedTrip])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    console.log('valueeeeeeeeeeeeeee', value) // Debugging
    console.log('dataaaaa', tripData)
    if (name === 'vehicleName') {
      const selectedVehicle = vehicles.find((v) => v.name === value)
      setTripData((prev) => ({
        ...prev,
        vehicleName: value,
        vehicleId: selectedVehicle?._id || '', // auto-set vehicleId
      }))
    } else if (name === 'driverName') {
      const selectedDriver = drivers.find((d) => d.name === value)
      setTripData((prev) => ({
        ...prev,
        driverName: value,
        driverId: selectedDriver?.id || '',
      }))
    } else {
      setTripData((prev) => ({ ...prev, [name]: value }))
    }
  }

  //   Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (mode === 'add') {
        await handleAddHelper(tripData, fetchData)
      } else {
        await handleEditHelper(tripData, fetchData)
        console.log('updated trip', tripData)
      }
      onClose()
      onSubmit(fetchData) // Pass data to parent
    } catch (error) {
      console.error('Submit Error:', error.message)
    }
  }

  const isLoading = vehicleStatus === 'loading' || drivers.length === 0

  return (
    <Modal show={true} onHide={onClose} centered size="lg" className="trip-modal">
      <Modal.Header>
        <Modal.Title className="fw-bold">
          {mode === 'add' ? 'Add New Trip' : 'Edit Trip'}
        </Modal.Title>
        <Button variant="close" onClick={onClose} aria-label="Close" />
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Driver Name</Form.Label>
                <Form.Select
                  name="driverName"
                  value={tripData.driverName}
                  onChange={handleChange}
                  required
                  disabled={isLoading} // Disable while loading
                >
                  <option value="">Select driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.name}>
                      {driver.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Vehicle Name</Form.Label>
                <Form.Select
                  name="vehicleName"
                  value={tripData.vehicleName}
                  onChange={handleChange}
                  required
                  disabled={isLoading} // Disable while loading
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.name}>
                      {vehicle.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Start Location</Form.Label>
                <Form.Control
                  type="text"
                  name="startLocation"
                  value={tripData.startLocation}
                  onChange={handleChange}
                  placeholder="Enter start location"
                  required
                />
              </Form.Group>
            </div>

            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>End Location</Form.Label>
                <Form.Control
                  type="text"
                  name="endLocation"
                  value={tripData.endLocation}
                  onChange={handleChange}
                  placeholder="Enter end location"
                  required
                />
              </Form.Group>
            </div>

            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={tripData.date}
                  onChange={handleChange}
                  placeholder="Enter Trip Date"
                  required
                />
              </Form.Group>
            </div>

            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Budget Allocated</Form.Label>
                <Form.Control
                  type="number"
                  name="budgetAllocated"
                  value={tripData.budgetAllocated}
                  onChange={handleChange}
                  placeholder="Enter budget allocated"
                  required
                />
              </Form.Group>
            </div>

            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Material Type</Form.Label>
                <Form.Control
                  type="text"
                  name="materialType"
                  value={tripData.materialType}
                  onChange={handleChange}
                  placeholder="Enter material type"
                  required
                />
              </Form.Group>
            </div>

            {mode === 'edit' && (
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={tripData.status}
                    onChange={handleChange}
                    placeholder="Enter trip status"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />{' '}
                {mode === 'add' ? 'Adding...' : 'Updating...'}
              </>
            ) : mode === 'add' ? (
              'Add Trip'
            ) : (
              'Update'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ModalTrips
