import React, { useState, useEffect } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { FaEdit } from 'react-icons/fa'
import { fetchDrivers } from '../../../DriverExpert/data/drivers'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVehicles } from '../../../../slices/vehicleSlice'

const TripFrom = ({
  mode = 'add',
  initialData = {},
  onSubmit,
  buttonStyle = {},
  buttonClass = '',
}) => {
  const [show, setShow] = useState(false)
  const [drivers, setDrivers] = useState([])
  const dispatch = useDispatch()
  const { vehicles, status: vehicleStatus } = useSelector((state) => state.vehicle)

  const [formData, setFormData] = useState({
    driverId: '', // Changed from driverName
    vehicleId: '', // Changed from vehicleName
    vehicleName: '', // New field
    startLocation: '',
    endLocation: '',
    date: '',
    budgetAllocated: '',
  })

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const data = await fetchDrivers()
        setDrivers(data)
        console.log('Fetched drivers:', data) // Debugging
      } catch (error) {
        console.error('Error fetching drivers:', error)
      }
    }

    loadDrivers()
  }, [])

  useEffect(() => {
    if (vehicleStatus === 'idle') {
      dispatch(fetchVehicles())
    }
  }, [dispatch, vehicleStatus])

  const handleOpen = () => {
    // if (mode === 'edit') {
    //   const selectedDriver = drivers.find((d) => d.name === initialData.driverId) // driverId holds the name here
    //   setFormData({
    //     ...initialData,
    //     driverId: selectedDriver?._id || '', // convert name to id
    //     status: initialData.status || '', // include this
    //   })
    // } else {
    //   setFormData({
    //     driverId: '',
    //     vehicleId: '',
    //     vehicleName: '',
    //     startLocation: '',
    //     endLocation: '',
    //     date: '',
    //     budgetAllocated: '',
    //     status: '',
    //   })
    // }
    setShow(true)
  }

  useEffect(() => {
    if (mode === 'edit' && show && drivers.length > 0 && vehicles.length > 0) {
      const matchedDriver = drivers.find(
        (d) => d.id === initialData.driverId || d.name === initialData.driverId,
      )
      const matchedVehicle = vehicles.find(
        (v) => v._id === initialData.vehicleId || v.name === initialData.vehicleId,
      )

      setFormData({
        _id: initialData._id || '', // include trip ID
        driverId: matchedDriver?.id || '',
        driverName: matchedDriver?.name || '',
        vehicleId: matchedVehicle?._id || '',
        vehicleName: matchedVehicle?.name || '',
        startLocation: initialData.startLocation || '',
        endLocation: initialData.endLocation || '',
        date: initialData.date?.slice(0, 10) || '',
        budgetAllocated: initialData.budgetAllocated || '',
        status: initialData.status || '',
      })
    }
  }, [mode, initialData, drivers, vehicles, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log('valueeeeeeeeeeeeeee', value) // Debugging

    if (name === 'vehicleId') {
      const selectedVehicle = vehicles.find((v) => v._id === value)
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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Payload to send:', formData) // Debugging
    onSubmit(formData)
    setShow(false)
  }

  console.log('driversssssssssssssssssssss', drivers) // Debugging

  return (
    <>
      {mode === 'add' ? (
        <Button variant="primary" onClick={handleOpen} className={buttonClass} style={buttonStyle}>
          Add Trip
        </Button>
      ) : (
        <Button
          variant="light"
          size="sm"
          onClick={handleOpen}
          className={`btn btn-sm btn-outline-primary ${buttonClass}`}
          style={{ padding: '4px 8px', ...buttonStyle }}
        >
          <FaEdit />
        </Button>
      )}

      <Modal show={show} onHide={() => setShow(false)} centered size="lg" className="trip-modal">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {mode === 'add' ? 'Add Trip Details' : 'Edit Trip Details'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row">
              {/* Driver Name */}
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Driver Name</Form.Label>
                  <Form.Select
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Vehicle Name */}
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Vehicle Name</Form.Label>
                  <Form.Select
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle._id} value={vehicle._id}>
                        {vehicle.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Start Location */}
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Start Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="startLocation"
                    value={formData.startLocation}
                    onChange={handleChange}
                    required
                    placeholder="Enter start location"
                  />
                </Form.Group>
              </div>

              {/* End Location */}
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>End Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="endLocation"
                    value={formData.endLocation}
                    onChange={handleChange}
                    required
                    placeholder="Enter end location"
                  />
                </Form.Group>
              </div>

              {/* Date */}
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>

              {/* Budget */}
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Budget Allocated</Form.Label>
                  <Form.Control
                    type="number"
                    name="budgetAllocated"
                    value={formData.budgetAllocated}
                    onChange={handleChange}
                    required
                    placeholder="Enter amount"
                  />
                </Form.Group>
              </div>

              {/* Status (only in edit mode) */}
              {mode === 'edit' && (
                <div className="col-md-6 mb-3">
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status || ''}
                      onChange={handleChange}
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
            <Button variant="secondary" onClick={() => setShow(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {mode === 'add' ? 'Add Trip' : 'Update'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default TripFrom
