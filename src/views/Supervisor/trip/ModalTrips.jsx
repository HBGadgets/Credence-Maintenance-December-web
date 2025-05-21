import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDrivers } from '../../DriverExpert/data/drivers'
import { fetchVehicles } from '../../vehicle/data/VehicleListData'
// import { fetchVehicles } from '../../../slices/vehicleSlice'
import { CSpinner } from '@coreui/react'
import { fetchTripDataHelper, handleAddHelper, handleEditHelper } from './componets/tripHelpers'
import Select from 'react-select'
import debounce from 'lodash.debounce'
import { useQuery } from '@tanstack/react-query'

const ModalTrips = ({ mode, selectedTrip, onClose, onSubmit, fetchTripData }) => {
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
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

  // const { vehicles, status: vehicleStatus } = useSelector((state) => state.vehicle)
  // const dispatch = useDispatch()
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
  // useEffect(() => {
  //   if (vehicleStatus === 'idle') {
  //     dispatch(fetchVehicles())
  //   }
  // }, [dispatch, vehicleStatus])

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await fetchVehicles()
        setVehicles(data)
        console.log('fetch vehicle', data)
      } catch (error) {
        console.log('Error fetching vehicle', error)
      }
    }
    loadVehicles()
  }, [])

  // Prefill form with selected trip data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && selectedTrip) {
      console.log('selectedTrip.date (raw):', selectedTrip.date)

      let formattedDate = ''
      if (selectedTrip.date) {
        // Convert DD/MM/YYYY → YYYY-MM-DD
        const [day, month, year] = selectedTrip.date.split('/')
        const isoDateString = `${year}-${month}-${day}`

        const parsedDate = new Date(isoDateString)
        if (!isNaN(parsedDate.getTime())) {
          formattedDate = parsedDate.toISOString().split('T')[0]
        } else {
          console.warn('⚠️ Still invalid after conversion:', isoDateString)
        }
      }

      // Find driver and vehicle by their names
      const driver = drivers.find((d) => d.name === selectedTrip.driverName)
      const vehicle = vehicles.find((v) => v.name === selectedTrip.vehicleName)
      console.log('drivers', driver)
      console.log('vehicles', vehicle)

      setTripData({
        _id: selectedTrip.id || '',
        date: formattedDate,
        // driverId: selectedTrip.driverId || '',
        driverId: driver?.id || '',
        driverName: selectedTrip.driverName || '',
        // vehicleId: selectedTrip.vehicleId || '',
        vehicleId: vehicle?.id || '', // Use found vehicle's ID
        vehicleName: selectedTrip.vehicleName || '',
        startLocation: selectedTrip.startLocation || '',
        endLocation: selectedTrip.endLocation || '',
        budgetAllocated: selectedTrip.budgetAllocated || '',
        materialType: selectedTrip.materialType || '',
        status: selectedTrip.status || '',
      })
    }
  }, [mode, selectedTrip, drivers, vehicles])

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
        vehicleId: selectedVehicle?.id || '', // auto-set vehicleId
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

  // const isLoading = vehicleStatus === 'loading' || drivers.length === 0

  // City fetch
  // Fetch all states of India
  const fetchStates = async () => {
    const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: 'India' }),
    })
    const data = await res.json()
    return data?.data?.states || []
  }

  // Fetch all cities in India (parallel)
  const fetchAllCities = async () => {
    const states = await fetchStates()

    const cityPromises = states.map((state) =>
      fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: 'India',
          state: state.name,
        }),
      }).then((res) => res.json()),
    )

    const citiesResults = await Promise.all(cityPromises)
    let allCities = []

    citiesResults.forEach((result) => {
      if (Array.isArray(result?.data)) {
        allCities.push(...result.data)
      }
    })

    return [...new Set(allCities)].sort()
  }

  const [searchInput, setSearchInput] = useState('')
  const { data: cities = [], isLoading } = useQuery({
    queryKey: ['all-cities-india'],
    queryFn: fetchAllCities,
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  // Debounce input handling
  const [filteredCities, setFilteredCities] = useState([])

  const debouncedFilter = useMemo(
    () =>
      debounce((input) => {
        if (!input) {
          setFilteredCities(cities)
        } else {
          const filtered = cities.filter((city) => city.toLowerCase().includes(input.toLowerCase()))
          setFilteredCities(filtered)
        }
      }, 300),
    [cities],
  )

  // Trigger filter when search input changes
  useEffect(() => {
    debouncedFilter(searchInput)
    return () => debouncedFilter.cancel()
  }, [searchInput, debouncedFilter])

  useEffect(() => {
    if (cities.length) setFilteredCities(cities)
  }, [cities])

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
                <Form.Label>Start City Location</Form.Label>
                <Select
                  name="startLocation"
                  value={
                    tripData.startLocation
                      ? { label: tripData.startLocation, value: tripData.startLocation }
                      : null
                  }
                  onInputChange={(val) => setSearchInput(val)}
                  onChange={(selected) =>
                    handleChange({
                      target: { name: 'startLocation', value: selected?.value || '' },
                    })
                  }
                  options={filteredCities.map((city) => ({ label: city, value: city }))}
                  placeholder={isLoading ? 'Loading cities...' : 'Select start city'}
                  isClearable
                  isLoading={isLoading}
                />
              </Form.Group>
            </div>

            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>End City Location</Form.Label>
                <Select
                  name="endLocation"
                  value={
                    tripData.endLocation
                      ? { label: tripData.endLocation, value: tripData.endLocation }
                      : null
                  }
                  onInputChange={(val) => setSearchInput(val)}
                  onChange={(selected) =>
                    handleChange({ target: { name: 'endLocation', value: selected?.value || '' } })
                  }
                  options={filteredCities.map((city) => ({ label: city, value: city }))}
                  placeholder={isLoading ? 'Loading cities...' : 'Select end city'}
                  isClearable
                  isLoading={isLoading}
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
