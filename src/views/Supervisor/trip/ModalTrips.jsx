import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { fetchDrivers } from '../../DriverExpert/data/drivers'
import { fetchVehicles } from '../../vehicle/data/VehicleListData'
import { CSpinner } from '@coreui/react'
import { handleAddHelper, handleEditHelper } from './componets/tripHelpers'
import Select from 'react-select'
import debounce from 'lodash.debounce'
import { useQuery } from '@tanstack/react-query'
import { getCompanyNameApi } from '../../TransportPass/data/data'

const ModalTrips = ({ mode, selectedTrip, onClose, onSubmit, fetchTripData }) => {
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [transportMode, setTransportMode] = useState()
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
    clientName: '',
    clientNumber: '',
    companyId: '',
    companyName: '',
    transportMode: '',
    coastPerKm: '',
    clientAdvance: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch companies
  const { data: companyList, isFetch } = useQuery({
    queryKey: ['companyList'],
    queryFn: getCompanyNameApi,
    staleTime: 1000 * 60 * 30,
  })

  console.log('company data', companyList)

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

      // Find driver by id or name
      const driver =
        drivers.find(
          (d) =>
            selectedTrip.driverId &&
            (d.id === selectedTrip.driverId || d._id === selectedTrip.driverId),
        ) ||
        drivers.find(
          (d) =>
            d.name &&
            selectedTrip.driverName &&
            d.name.trim().toLowerCase() === selectedTrip.driverName.trim().toLowerCase(),
        )

      // Find vehicle by id or name
      const vehicle =
        vehicles.find(
          (v) =>
            selectedTrip.vehicleId &&
            (v.id === selectedTrip.vehicleId || v._id === selectedTrip.vehicleId),
        ) ||
        vehicles.find(
          (v) =>
            v.name &&
            selectedTrip.vehicleName &&
            v.name.trim().toLowerCase() === selectedTrip.vehicleName.trim().toLowerCase(),
        )

      // Find company by its id or name
      const company =
        companyList?.find((c) => c.id === selectedTrip.companyId) ||
        companyList?.find((c) => c.companyName === selectedTrip.companyName)

      const rawStatus =
        typeof selectedTrip.rawStatus === 'string'
          ? selectedTrip.rawStatus
          : typeof selectedTrip.status === 'string'
          ? selectedTrip.status
          : ''

      const resolvedVehicleId =
        selectedTrip.vehicleId || vehicle?.id || vehicle?._id || ''
      const resolvedVehicleName =
        (selectedTrip.vehicleName && selectedTrip.vehicleName !== 'N/A'
          ? selectedTrip.vehicleName
          : vehicle?.name) || ''

      const resolvedDriverId =
        selectedTrip.driverId || driver?.id || driver?._id || ''
      const resolvedDriverName =
        (selectedTrip.driverName && selectedTrip.driverName !== 'N/A'
          ? selectedTrip.driverName
          : driver?.name) || ''

      setTripData({
        _id: selectedTrip.id || selectedTrip._id || '',
        date: formattedDate,
        driverId: resolvedDriverId,
        driverName: resolvedDriverName,
        vehicleId: resolvedVehicleId,
        vehicleName: resolvedVehicleName,
        startLocation:
          selectedTrip.startLocation && selectedTrip.startLocation !== 'N/A'
            ? selectedTrip.startLocation
            : '',
        endLocation:
          selectedTrip.endLocation && selectedTrip.endLocation !== 'N/A'
            ? selectedTrip.endLocation
            : '',
        budgetAllocated:
          selectedTrip.budgetAllocated && selectedTrip.budgetAllocated !== '0'
            ? selectedTrip.budgetAllocated
            : '',
        materialType:
          selectedTrip.materialType && selectedTrip.materialType !== 'Not Assign'
            ? selectedTrip.materialType
            : '',
        status: rawStatus,
        // 🔹 Add these missing fields
        transportMode:
          selectedTrip.transportMode && selectedTrip.transportMode !== 'N/A'
            ? selectedTrip.transportMode
            : '',
        clientName:
          selectedTrip.clientName && selectedTrip.clientName !== 'N/A'
            ? selectedTrip.clientName
            : '',
        clientNumber:
          selectedTrip.clientNumber && selectedTrip.clientNumber !== 'N/A'
            ? selectedTrip.clientNumber
            : '',
        companyId: company?.id || selectedTrip.companyId || '',
        companyName:
          company?.companyName ||
          (selectedTrip.companyName !== 'N/A' ? selectedTrip.companyName : '') ||
          '',
        coastPerKm:
          selectedTrip.coastPerKm && selectedTrip.coastPerKm !== '0'
            ? selectedTrip.coastPerKm
            : '',
        clientAdvance:
          selectedTrip.clientAdvance && selectedTrip.clientAdvance !== '0'
            ? selectedTrip.clientAdvance
            : '',
      })
    }
  }, [mode, selectedTrip, drivers, vehicles, companyList])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    console.log('handleChange:', name, value)
    if (name === 'vehicleName') {
      const selectedVehicle = vehicles.find(
        (v) =>
          v.id === value ||
          v._id === value ||
          v.name === value ||
          (v.name && value && v.name.trim().toLowerCase() === value.trim().toLowerCase()),
      )
      setTripData((prev) => ({
        ...prev,
        vehicleName: selectedVehicle?.name || value,
        vehicleId: selectedVehicle?.id || selectedVehicle?._id || prev.vehicleId || '',
      }))
    } else if (name === 'driverName') {
      const selectedDriver = drivers.find(
        (d) =>
          d.id === value ||
          d._id === value ||
          d.name === value ||
          (d.name && value && d.name.trim().toLowerCase() === value.trim().toLowerCase()),
      )
      setTripData((prev) => ({
        ...prev,
        driverName: selectedDriver?.name || value,
        driverId: selectedDriver?.id || selectedDriver?._id || prev.driverId || '',
      }))
    } else {
      setTripData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Prevent wheel scroll from modifying numeric inputs
  const handleWheel = (e) => {
    e.target.blur()
  }

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      let finalVehicleId = tripData.vehicleId
      if (!finalVehicleId && tripData.vehicleName) {
        const match = vehicles.find(
          (v) =>
            v.name === tripData.vehicleName ||
            (v.name &&
              v.name.trim().toLowerCase() === tripData.vehicleName.trim().toLowerCase()),
        )
        if (match) {
          finalVehicleId = match.id || match._id || ''
        }
      }

      let finalDriverId = tripData.driverId
      if (!finalDriverId && tripData.driverName) {
        const match = drivers.find(
          (d) =>
            d.name === tripData.driverName ||
            (d.name &&
              d.name.trim().toLowerCase() === tripData.driverName.trim().toLowerCase()),
        )
        if (match) {
          finalDriverId = match.id || match._id || ''
        }
      }

      let finalCompanyId = tripData.companyId
      if (!finalCompanyId && tripData.companyName) {
        const match = companyList?.find(
          (c) =>
            c.companyName === tripData.companyName ||
            (c.companyName &&
              c.companyName.trim().toLowerCase() === tripData.companyName.trim().toLowerCase()),
        )
        if (match) {
          finalCompanyId = match.id || match._id || ''
        }
      }

      const submissionData = {
        ...tripData,
        vehicleId: finalVehicleId || tripData.vehicleId,
        driverId: finalDriverId || tripData.driverId,
        companyId: finalCompanyId || tripData.companyId,
      }

      if (onSubmit) {
        await onSubmit(submissionData)
      } else {
        if (mode === 'add') {
          await handleAddHelper(submissionData, fetchTripData)
        } else {
          await handleEditHelper(submissionData, fetchTripData)
        }
        if (onClose) onClose()
      }
    } catch (error) {
      console.error('Submit Error:', error?.message || error)
      // Form does not close on any error
    } finally {
      setIsSubmitting(false)
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
    <Modal show={true} onHide={onClose} centered size="xl" className="trip-modal" backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title className="fw-bold">
          {mode === 'add' ? 'Add New Trip' : 'Edit Trip'}
        </Modal.Title>
        <Button variant="close" onClick={onClose} aria-label="Close" />
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row">
            {/* Transport Mode Selector */}
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Transport Mode</Form.Label>
                <Select
                  name="transportMode"
                  value={
                    tripData.transportMode
                      ? { label: tripData.transportMode, value: tripData.transportMode }
                      : null
                  }
                  onChange={(selected) => {
                    const value = selected?.value || ''
                    handleChange({ target: { name: 'transportMode', value } }) // update tripData
                  }}
                  options={[
                    { value: 'travel', label: 'Travel' },
                    { value: 'transport', label: 'Transport' },
                  ]}
                  placeholder="Select transport mode"
                  isClearable
                />
              </Form.Group>
            </div>

            {/* Client Name */}
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Client Name</Form.Label>
                <Form.Control
                  type="text"
                  name="clientName"
                  value={tripData.clientName}
                  onChange={handleChange}
                  placeholder="Enter client name"
                />
              </Form.Group>
            </div>

            {/* Client Number */}
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Client Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="clientNumber"
                  value={tripData.clientNumber}
                  onChange={handleChange}
                  onWheel={handleWheel}
                  placeholder="Enter client number"
                  maxLength={10}
                  pattern="\d{10}"
                  inputMode="numeric"
                />
              </Form.Group>
            </div>

            {/* Company Name */}
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Company Name</Form.Label>
                <Select
                  name="companyName"
                  value={
                    tripData.companyId
                      ? {
                          value: tripData.companyId,
                          label:
                            companyList?.find((c) => c.id === tripData.companyId)?.companyName ||
                            tripData.companyName,
                        }
                      : null
                  }
                  onChange={(selected) => {
                    if (selected) {
                      const selectedCompany = companyList.find((c) => c.id === selected.value)
                      setTripData((prev) => ({
                        ...prev,
                        companyId: selectedCompany?.id || '',
                        companyName: selectedCompany?.companyName || '',
                      }))
                    } else {
                      setTripData((prev) => ({
                        ...prev,
                        companyId: '',
                        companyName: '',
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
              </Form.Group>
            </div>

            {/* Driver Name */}
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Driver Name</Form.Label>
                <Select
                  name="driverName"
                  value={
                    tripData.driverName || tripData.driverId
                      ? {
                          label:
                            tripData.driverName ||
                            drivers.find(
                              (d) =>
                                d.id === tripData.driverId || d._id === tripData.driverId,
                            )?.name ||
                            '',
                          value:
                            tripData.driverId ||
                            tripData.driverName ||
                            '',
                        }
                      : null
                  }
                  onChange={(selected) => {
                    if (selected) {
                      const selectedDriver = drivers.find(
                        (d) =>
                          d.id === selected.value ||
                          d._id === selected.value ||
                          d.name === selected.value ||
                          d.name === selected.label,
                      )
                      setTripData((prev) => ({
                        ...prev,
                        driverName: selectedDriver?.name || selected.label || '',
                        driverId:
                          selectedDriver?.id ||
                          selectedDriver?._id ||
                          selected.value ||
                          '',
                      }))
                    } else {
                      setTripData((prev) => ({
                        ...prev,
                        driverName: '',
                        driverId: '',
                      }))
                    }
                  }}
                  options={drivers.map((driver) => ({
                    label: driver.name,
                    value: driver.id || driver._id || driver.name,
                  }))}
                  placeholder={drivers.length === 0 ? 'Loading drivers...' : 'Select driver'}
                  isClearable
                />
              </Form.Group>
            </div>

            {/* Vehicle Name */}
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Vehicle Name</Form.Label>
                <Select
                  name="vehicleName"
                  value={
                    tripData.vehicleName || tripData.vehicleId
                      ? {
                          label:
                            tripData.vehicleName ||
                            vehicles.find(
                              (v) =>
                                v.id === tripData.vehicleId || v._id === tripData.vehicleId,
                            )?.name ||
                            '',
                          value:
                            tripData.vehicleId ||
                            tripData.vehicleName ||
                            '',
                        }
                      : null
                  }
                  onChange={(selected) => {
                    if (selected) {
                      const selectedVehicle = vehicles.find(
                        (v) =>
                          v.id === selected.value ||
                          v._id === selected.value ||
                          v.name === selected.value ||
                          v.name === selected.label,
                      )
                      setTripData((prev) => ({
                        ...prev,
                        vehicleName: selectedVehicle?.name || selected.label || '',
                        vehicleId:
                          selectedVehicle?.id ||
                          selectedVehicle?._id ||
                          selected.value ||
                          '',
                      }))
                    } else {
                      setTripData((prev) => ({
                        ...prev,
                        vehicleName: '',
                        vehicleId: '',
                      }))
                    }
                  }}
                  options={vehicles.map((vehicle) => ({
                    label: vehicle.name,
                    value: vehicle.id || vehicle._id || vehicle.name,
                  }))}
                  placeholder={vehicles.length === 0 ? 'Loading vehicles...' : 'Select vehicle'}
                  isClearable
                />
              </Form.Group>
            </div>

            {/* Start Location */}
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

            {/* End Location */}
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
                    handleChange({
                      target: { name: 'endLocation', value: selected?.value || '' },
                    })
                  }
                  options={filteredCities.map((city) => ({ label: city, value: city }))}
                  placeholder={isLoading ? 'Loading cities...' : 'Select end city'}
                  isClearable
                  isLoading={isLoading}
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
                  value={tripData.date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>

            {/* Budget */}

            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label> Charges Coast Kms/Hrs</Form.Label>
                <Form.Control
                  type="number"
                  name="coastPerKm"
                  value={tripData.coastPerKm}
                  onChange={handleChange}
                  onWheel={handleWheel}
                  placeholder="Enter Coast Kms/Hrs"
                />
              </Form.Group>
            </div>

            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Client Advances</Form.Label>
                <Form.Control
                  type="number"
                  name="clientAdvance"
                  value={tripData.clientAdvance}
                  onChange={handleChange}
                  onWheel={handleWheel}
                  placeholder="Enter Client advance"
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
                  onWheel={handleWheel}
                  placeholder="Enter budget allocated"
                />
              </Form.Group>
            </div>

            {/* Material Type - show only if transportMode is 'transport' */}
            {tripData.transportMode === 'transport' && (
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
            )}

            {/* Status only in edit mode */}
            {mode === 'edit' && (
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={tripData.status}
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
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading || isSubmitting}>
            {isSubmitting ? (
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
