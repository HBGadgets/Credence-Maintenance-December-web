import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CCol,
  CForm,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CAlert,
} from '@coreui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import SingleSelectDropdown from '../../components/SingleSelectDropdown'
import { assignVehicleToDriverApi, unassignVehicleFromDriverApi } from '../data/drivers'
import { fetchVehicles } from '../../vehicle/data/VehicleListData'
import { FaTruck, FaUnlink } from 'react-icons/fa'

function AssignVehicleModal({ visible, setVisible, initialDriver = null, drivers = [] }) {
  const queryClient = useQueryClient()

  const [selectedDriverOption, setSelectedDriverOption] = useState(null)
  const [selectedVehicleOption, setSelectedVehicleOption] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Fetch available vehicles
  const { data: vehicleList = [], isFetching: isFetchingVehicles } = useQuery({
    queryKey: ['vehicleListForAssignment'],
    queryFn: () => fetchVehicles(),
    staleTime: 1000 * 60 * 10,
    enabled: visible,
  })

  // Format Driver options
  const driverOptions = (drivers || []).map((d) => {
    const isAssigned = d.tripStatus === 'Assigned to Trip'
    return {
      value: d.id || d._id,
      label: `${d.name} ${d.contactNumber && d.contactNumber !== 'N/A' ? `(${d.contactNumber})` : ''} • [${isAssigned ? 'Assigned to Trip' : 'Available'}]`,
    }
  })

  // Format Vehicle options
  const vehicleOptions = (vehicleList || []).map((v) => ({
    value: v.id || v._id,
    label: `${v.name} ${v.model && v.model !== 'N/A' ? `(${v.model})` : ''} ${v.category && v.category !== 'N/A' ? `• ${v.category}` : ''}`,
  }))

  // Set initial driver when modal opens or initialDriver changes
  useEffect(() => {
    if (visible) {
      setErrorMessage('')
      if (initialDriver) {
        const dId = initialDriver.id || initialDriver._id
        const found = driverOptions.find((opt) => opt.value === dId)
        setSelectedDriverOption(
          found || {
            value: dId,
            label: `${initialDriver.name} ${initialDriver.contactNumber ? `(${initialDriver.contactNumber})` : ''}`,
          },
        )
      } else {
        setSelectedDriverOption(null)
      }
      setSelectedVehicleOption(null)
    }
  }, [visible, initialDriver, drivers])

  // Mutation for assigning vehicle
  const { mutate: assignVehicleMutation, isLoading: isAssigning } = useMutation({
    mutationFn: assignVehicleToDriverApi,
    onSuccess: (res) => {
      const successMsg = res?.message || 'Vehicle assigned to driver successfully!'
      toast.success(successMsg)
      Swal.fire({
        icon: 'success',
        title: 'Vehicle Assigned!',
        text: successMsg,
        timer: 2500,
        showConfirmButton: false,
      })
      queryClient.invalidateQueries(['drivers'])
      queryClient.invalidateQueries(['vehicleList'])
      queryClient.invalidateQueries(['vehicleStatus'])
      handleClose()
    },
    onError: (err) => {
      const rawMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to assign vehicle'

      const msg =
        typeof rawMsg === 'string'
          ? rawMsg
              .replace(/\s*\((?:daily\s*)?trip\s*id\s*:[^)]*\)/gi, '')
              .replace(/\s*(?:daily\s*)?trip\s*id\s*:\s*[a-f0-9]+\b/gi, '')
              .replace(/\s+\./g, '.')
              .trim()
          : rawMsg

      setErrorMessage(msg)
      toast.error(msg)
      Swal.fire({
        icon: 'error',
        title: 'Assignment Failed',
        text: msg,
      })
    },
  })

  // Mutation for unassigning vehicle
  const { mutate: unassignVehicleMutation, isLoading: isUnassigning } = useMutation({
    mutationFn: unassignVehicleFromDriverApi,
    onSuccess: (res) => {
      const successMsg = res?.message || 'Vehicle unassigned from driver successfully!'
      toast.success(successMsg)
      Swal.fire({
        icon: 'success',
        title: 'Vehicle Unassigned!',
        text: successMsg,
        timer: 2500,
        showConfirmButton: false,
      })
      queryClient.invalidateQueries(['drivers'])
      queryClient.invalidateQueries(['vehicleList'])
      queryClient.invalidateQueries(['vehicleStatus'])
      handleClose()
    },
    onError: (err) => {
      const rawMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to unassign vehicle'

      const msg =
        typeof rawMsg === 'string'
          ? rawMsg
              .replace(/\s*\((?:daily\s*)?trip\s*id\s*:[^)]*\)/gi, '')
              .replace(/\s*(?:daily\s*)?trip\s*id\s*:\s*[a-f0-9]+\b/gi, '')
              .replace(/\s+\./g, '.')
              .trim()
          : rawMsg

      setErrorMessage(msg)
      toast.error(msg)
      Swal.fire({
        icon: 'error',
        title: 'Unassignment Failed',
        text: msg,
      })
    },
  })

  const selectedDriverData = (drivers || []).find(
    (d) => (d.id || d._id) === selectedDriverOption?.value,
  )
  const currentAssignedVehicle =
    selectedDriverData?.currentVehicleName ||
    selectedDriverData?.assignedVehicleName ||
    (initialDriver && (initialDriver.id || initialDriver._id) === selectedDriverOption?.value
      ? initialDriver.currentVehicleName || initialDriver.assignedVehicleName
      : null)

  const handleUnassignCurrent = () => {
    if (!selectedDriverOption?.value) return
    const dName = selectedDriverData?.name || initialDriver?.name || 'this driver'
    Swal.fire({
      title: 'Unassign Vehicle?',
      html: `Are you sure you want to unassign <b>${currentAssignedVehicle}</b> from driver <b>${dName}</b>?<br/><small class="text-muted">This will successfully complete the current shift.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Unassign',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        unassignVehicleMutation({ driverId: selectedDriverOption.value })
      }
    })
  }

  const handleClose = () => {
    setVisible(false)
    setErrorMessage('')
    setSelectedDriverOption(null)
    setSelectedVehicleOption(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!selectedDriverOption?.value) {
      setErrorMessage('Please select a driver.')
      toast.warn('Please select a driver.')
      return
    }

    if (!selectedVehicleOption?.value) {
      setErrorMessage('Please select a vehicle.')
      toast.warn('Please select a vehicle.')
      return
    }

    const payload = {
      driverId: selectedDriverOption.value,
      vehicleId: selectedVehicleOption.value,
    }

    assignVehicleMutation(payload)
  }

  return (
    <CModal visible={visible} onClose={handleClose} size="lg" alignment="center">
      <CModalHeader closeButton>
        <CModalTitle className="d-flex align-items-center gap-2">
          <FaTruck className="text-primary" />
          Assign Vehicle to Driver
        </CModalTitle>
      </CModalHeader>

      <CForm onSubmit={handleSubmit}>
        <CModalBody className="p-4">
          {errorMessage && (
            <CAlert color="danger" dismissible onClose={() => setErrorMessage('')} className="mb-3">
              {errorMessage}
            </CAlert>
          )}

          <div
            className="p-3 mb-4 rounded"
            style={{ backgroundColor: '#f0f4f8', borderLeft: '4px solid #0d6efd' }}
          >
            <p className="mb-0 small text-secondary">
              Directly assigns a vehicle to the driver without creating a trip. The driver can operate this vehicle and log daily trips until unassigned.
            </p>
          </div>

          <CRow className="g-3">
            {/* Driver Select */}
            <CCol md={12}>
              <SingleSelectDropdown
                label="Target Driver *"
                options={driverOptions}
                value={selectedDriverOption}
                onChange={(option) => {
                  setSelectedDriverOption(option)
                  setErrorMessage('')
                }}
                placeholder="Search and select driver..."
                isClearable={!initialDriver}
                isDisabled={isAssigning || isUnassigning}
              />
            </CCol>

            {/* Currently assigned notification with unassign button */}
            {currentAssignedVehicle && (
              <CCol md={12}>
                <CAlert
                  color="warning"
                  className="d-flex justify-content-between align-items-center mb-0 py-2 border-warning"
                >
                  <div className="small">
                    <strong>Currently Assigned:</strong>{' '}
                    <span className="badge bg-primary ms-1">{currentAssignedVehicle}</span>
                  </div>
                  <CButton
                    color="danger"
                    size="sm"
                    variant="outline"
                    disabled={isAssigning || isUnassigning}
                    onClick={handleUnassignCurrent}
                    className="d-flex align-items-center gap-1"
                  >
                    <FaUnlink size={12} />
                    {isUnassigning ? 'Unassigning...' : 'Unassign Vehicle'}
                  </CButton>
                </CAlert>
              </CCol>
            )}

            {/* Vehicle Select */}
            <CCol md={12}>
              <SingleSelectDropdown
                label="Target Vehicle *"
                options={vehicleOptions}
                value={selectedVehicleOption}
                onChange={(option) => {
                  setSelectedVehicleOption(option)
                  setErrorMessage('')
                }}
                placeholder={
                  isFetchingVehicles
                    ? 'Loading vehicles...'
                    : 'Search and select vehicle (by number, model, category)...'
                }
                isClearable
                isDisabled={isAssigning || isUnassigning || isFetchingVehicles}
              />
            </CCol>
          </CRow>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={handleClose} disabled={isAssigning}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            type="submit"
            disabled={isAssigning || !selectedDriverOption || !selectedVehicleOption}
            className="d-flex align-items-center gap-2"
          >
            {isAssigning && <CSpinner size="sm" />}
            {isAssigning ? 'Assigning Vehicle...' : 'Assign Vehicle'}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

AssignVehicleModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  initialDriver: PropTypes.object,
  drivers: PropTypes.array,
}

export default AssignVehicleModal
