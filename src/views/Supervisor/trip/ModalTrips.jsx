import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { fetchDrivers } from '../../DriverExpert/data/drivers'
import { fetchVehicles } from '../../vehicle/data/VehicleListData'
import { CSpinner } from '@coreui/react'
import { handleAddHelper, handleEditHelper } from './componets/tripHelpers'
import Select from 'react-select'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getCompanyNameApi } from '../../TransportPass/data/data'
import { toast } from 'react-toastify'

const ModalTrips = ({ mode, selectedTrip, onClose, onSubmit, fetchTripData }) => {
  const queryClient = useQueryClient()
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [transportMode, setTransportMode] = useState()
  const [tripData, setTripData] = useState({
    _id: '', // optional but helpful
    startDate: '',
    endDate: '',
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
      const formatToInputDate = (val) => {
        if (!val || val === 'N/A') return ''
        if (typeof val === 'string' && val.includes('/')) {
          const [day, month, year] = val.split('/')
          if (day && month && year) {
            const isoDateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            const parsedDate = new Date(isoDateString)
            if (!isNaN(parsedDate.getTime())) {
              return parsedDate.toISOString().split('T')[0]
            }
          }
        }
        const parsedDate = new Date(val)
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString().split('T')[0]
        }
        return ''
      }

      const formattedStartDate = formatToInputDate(
        selectedTrip.rawStartDate ||
          selectedTrip.startDate ||
          selectedTrip.orginalDate ||
          selectedTrip.date,
      )
      const formattedEndDate = formatToInputDate(
        selectedTrip.rawEndDate || selectedTrip.endDate,
      )

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
        startDate: formattedStartDate,
        endDate: formattedEndDate,
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
    if (tripData.startDate && tripData.endDate && tripData.endDate < tripData.startDate) {
      toast.error('End date cannot be earlier than start date')
      return
    }
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
      queryClient.invalidateQueries(['drivers'])
      queryClient.invalidateQueries(['driverStatus'])
      queryClient.invalidateQueries(['trip'])
      queryClient.invalidateQueries(['TripsList'])
    } catch (error) {
      console.error('Submit Error:', error?.message || error)
      // Form does not close on any error
    } finally {
      setIsSubmitting(false)
    }
  }

  // Driver options with assigned vehicle and trip status info
  const driverOptions = useMemo(() => {
    const currentTripId = selectedTrip?.id || selectedTrip?._id

    return (drivers || []).map((driver) => {
      const driverId = driver.id || driver._id || driver.name

      // Determine vehicle name / assignment
      const rawVehicle = driver.currentVehicle || driver.assignedVehicle
      const rawVehicleId =
        typeof rawVehicle === 'object' && rawVehicle
          ? rawVehicle._id || rawVehicle.id || ''
          : typeof rawVehicle === 'string'
          ? rawVehicle
          : ''

      let vehicleName =
        driver.currentVehicleName ||
        driver.assignedVehicleName ||
        (typeof driver.currentVehicle === 'object' && driver.currentVehicle
          ? driver.currentVehicle.name || driver.currentVehicle.vehicleNumber
          : null) ||
        (typeof driver.assignedVehicle === 'object' && driver.assignedVehicle
          ? driver.assignedVehicle.name || driver.assignedVehicle.vehicleNumber
          : null)

      const matchedVehicle =
        (rawVehicleId && vehicles.find((v) => (v.id || v._id) === rawVehicleId)) ||
        (vehicleName &&
          vehicles.find(
            (v) => v.name && v.name.trim().toLowerCase() === vehicleName.trim().toLowerCase(),
          ))

      if (!vehicleName && matchedVehicle?.name) {
        vehicleName = matchedVehicle.name
      }

      const resolvedVehicleId = matchedVehicle?.id || matchedVehicle?._id || rawVehicleId || ''
      const hasVehicle = Boolean(vehicleName || driver.currentVehicle || driver.assignedVehicle)
      const displayVehicleName = vehicleName || 'Assigned'

      // Determine trip assignment
      const trip = driver.currentTripId
      let hasTrip = false
      let isCurrentTrip = false

      if (trip) {
        if (typeof trip === 'object') {
          const tId = trip._id || trip.id
          if (mode === 'edit' && currentTripId && tId && String(tId) === String(currentTripId)) {
            isCurrentTrip = true
            hasTrip = true
          } else {
            const s = (trip.status || '').toLowerCase().trim()
            if (!s || (s !== 'cancelled' && s !== 'completed')) {
              hasTrip = true
            }
          }
        } else if (typeof trip === 'string' && trip.trim()) {
          if (mode === 'edit' && currentTripId && String(trip).trim() === String(currentTripId).trim()) {
            isCurrentTrip = true
            hasTrip = true
          } else {
            hasTrip = true
          }
        }
      } else if (
        mode === 'edit' &&
        currentTripId &&
        ((selectedTrip.driverId &&
          (String(driverId) === String(selectedTrip.driverId) ||
            String(driver._id) === String(selectedTrip.driverId))) ||
          (driver.name &&
            selectedTrip.driverName &&
            driver.name.trim().toLowerCase() === selectedTrip.driverName.trim().toLowerCase()))
      ) {
        isCurrentTrip = true
        hasTrip = true
      } else if (driver.tripStatus === 'Assigned to Trip') {
        hasTrip = true
      }

      const vehicleLabel = hasVehicle ? `Vehicle: ${displayVehicleName}` : 'No Vehicle'
      const tripLabel = isCurrentTrip
        ? 'Assigned to this Trip'
        : hasTrip
        ? 'Trip Assigned'
        : 'Trip Not Assigned'

      return {
        value: driverId,
        label: `${driver.name} (${vehicleLabel} • ${tripLabel})`,
        driverName: driver.name,
        contactNumber:
          driver.contactNumber && driver.contactNumber !== 'N/A'
            ? driver.contactNumber
            : null,
        hasVehicle,
        vehicleId: resolvedVehicleId,
        vehicleName: displayVehicleName,
        hasTrip,
        isCurrentTrip,
        tripLabel,
        driver,
      }
    })
  }, [drivers, vehicles, mode, selectedTrip])

  // Selected driver option for react-select
  const selectedDriverOption = useMemo(() => {
    if (!tripData.driverId && !tripData.driverName) return null

    if (tripData.driverId) {
      const matchById = driverOptions.find((opt) => opt.value === tripData.driverId)
      if (matchById) return matchById
    }

    if (tripData.driverName) {
      const matchByName = driverOptions.find(
        (opt) => opt.driverName?.trim().toLowerCase() === tripData.driverName.trim().toLowerCase(),
      )
      if (matchByName) return matchByName
    }

    return {
      value: tripData.driverId || tripData.driverName,
      label: tripData.driverName || 'Selected Driver',
      driverName: tripData.driverName,
    }
  }, [driverOptions, tripData.driverId, tripData.driverName])

  // const isLoading = vehicleStatus === 'loading' || drivers.length === 0

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
                  value={selectedDriverOption}
                  onChange={(selected) => {
                    if (selected) {
                      const selectedDriver =
                        selected.driver ||
                        drivers.find(
                          (d) =>
                            d.id === selected.value ||
                            d._id === selected.value ||
                            d.name === selected.value ||
                            d.name === selected.driverName,
                        )
                      const shouldAutoAssignVehicle =
                        mode === 'add' &&
                        selected.hasVehicle &&
                        !selected.hasTrip &&
                        (selected.vehicleId ||
                          (selected.vehicleName && selected.vehicleName !== 'Assigned'))

                      const autoVehicleName =
                        selected.vehicleName && selected.vehicleName !== 'Assigned'
                          ? selected.vehicleName
                          : vehicles.find((v) => (v.id || v._id) === selected.vehicleId)?.name || ''

                      setTripData((prev) => ({
                        ...prev,
                        driverName: selectedDriver?.name || selected.driverName || selected.label || '',
                        driverId:
                          selectedDriver?.id ||
                          selectedDriver?._id ||
                          selected.value ||
                          '',
                        ...(shouldAutoAssignVehicle
                          ? {
                              vehicleId: selected.vehicleId || '',
                              vehicleName: autoVehicleName,
                            }
                          : {}),
                      }))
                    } else {
                      setTripData((prev) => ({
                        ...prev,
                        driverName: '',
                        driverId: '',
                      }))
                    }
                  }}
                  options={driverOptions}
                  formatOptionLabel={(option, { context }) => {
                    if (context === 'value') {
                      return (
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span className="fw-medium text-dark">{option.driverName || option.label}</span>
                          {option.hasVehicle && (
                            <span
                              className="badge text-white"
                              style={{
                                backgroundColor: '#0d6efd',
                                color: '#ffffff',
                                fontSize: '10px',
                                padding: '2px 7px',
                                fontWeight: '600',
                                letterSpacing: '0.3px',
                              }}
                            >
                              🚗 {option.vehicleName}
                            </span>
                          )}
                          {option.isCurrentTrip ? (
                            <span
                              className="badge text-white"
                              style={{
                                backgroundColor: '#0d6efd',
                                color: '#ffffff',
                                fontSize: '10px',
                                padding: '2px 6px',
                                fontWeight: '500',
                              }}
                            >
                              This Trip
                            </span>
                          ) : option.hasTrip ? (
                            <span
                              className="badge text-dark"
                              style={{
                                backgroundColor: '#ffc107',
                                color: '#000000',
                                fontSize: '10px',
                                padding: '2px 6px',
                                fontWeight: '600',
                              }}
                            >
                              Trip Assigned
                            </span>
                          ) : option.hasTrip === false ? (
                            <span
                              className="badge"
                              style={{
                                backgroundColor: '#f8f9fa',
                                color: '#6c757d',
                                border: '1px solid #dee2e6',
                                fontSize: '10px',
                                padding: '2px 6px',
                                fontWeight: '500',
                              }}
                            >
                              Trip Not Assigned
                            </span>
                          ) : null}
                        </div>
                      )
                    }

                    return (
                      <div className="d-flex justify-content-between align-items-center py-1 flex-wrap gap-2">
                        <div>
                          <div className="fw-medium text-dark">{option.driverName || option.label}</div>
                          {option.contactNumber && (
                            <small className="text-muted" style={{ fontSize: '11px' }}>
                              📞 {option.contactNumber}
                            </small>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-1 ms-2 flex-wrap justify-end">
                          {option.hasVehicle ? (
                            <span
                              className="badge text-white shadow-sm"
                              style={{
                                backgroundColor: '#0d6efd',
                                color: '#ffffff',
                                fontSize: '11px',
                                padding: '3px 8px',
                                fontWeight: '600',
                                letterSpacing: '0.4px',
                              }}
                              title={`Assigned Vehicle: ${option.vehicleName}`}
                            >
                              🚗 {option.vehicleName}
                            </span>
                          ) : (
                            <span
                              className="badge"
                              style={{
                                backgroundColor: '#f8f9fa',
                                color: '#6c757d',
                                border: '1px solid #dee2e6',
                                fontSize: '11px',
                                padding: '3px 7px',
                                fontWeight: 'normal',
                              }}
                            >
                              No Vehicle
                            </span>
                          )}
                          {option.isCurrentTrip ? (
                            <span
                              className="badge text-white"
                              style={{
                                backgroundColor: '#0d6efd',
                                color: '#ffffff',
                                fontSize: '11px',
                                padding: '3px 7px',
                                fontWeight: '500',
                              }}
                              title="Currently assigned to this trip"
                            >
                              This Trip
                            </span>
                          ) : option.hasTrip ? (
                            <span
                              className="badge text-dark"
                              style={{
                                backgroundColor: '#ffc107',
                                color: '#000000',
                                fontSize: '11px',
                                padding: '3px 7px',
                                fontWeight: '600',
                              }}
                              title="Currently assigned to an active trip"
                            >
                              Trip Assigned
                            </span>
                          ) : (
                            <span
                              className="badge"
                              style={{
                                backgroundColor: '#f8f9fa',
                                color: '#6c757d',
                                border: '1px solid #dee2e6',
                                fontSize: '11px',
                                padding: '3px 7px',
                                fontWeight: '500',
                              }}
                              title="No trip currently assigned"
                            >
                              Trip Not Assigned
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  }}
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
                <Form.Control
                  type="text"
                  name="startLocation"
                  value={tripData.startLocation}
                  onChange={handleChange}
                  placeholder="Enter start city"
                />
              </Form.Group>
            </div>

            {/* End Location */}
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>End City Location</Form.Label>
                <Form.Control
                  type="text"
                  name="endLocation"
                  value={tripData.endLocation}
                  onChange={handleChange}
                  placeholder="Enter end city"
                />
              </Form.Group>
            </div>

            {/* Start Date */}
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={tripData.startDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>

            {/* End Date */}
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={tripData.endDate}
                  onChange={handleChange}
                  min={tripData.startDate || undefined}
                />
              </Form.Group>
            </div>

            {/* Budget */}

            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label> Charges Cost Kms/Hrs</Form.Label>
                <Form.Control
                  type="number"
                  name="coastPerKm"
                  value={tripData.coastPerKm}
                  onChange={handleChange}
                  onWheel={handleWheel}
                  placeholder="Enter Cost Kms/Hrs"
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
          <Button variant="primary" type="submit" disabled={isSubmitting}>
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
