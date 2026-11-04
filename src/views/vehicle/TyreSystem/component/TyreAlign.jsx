import React, { useEffect, useState } from 'react'
import './tyrealign.css'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import TyreAssignModal from './TyreAssignModal'
import { deleteTyreSystemApi } from '../../data/VehicleListData'
import { verifyPasswordApi } from '../../../DailyTrips/data'
import wheelImg from '../../../../assets/tyre/wheel1.png'

const TyreAlign = ({
  tyreImagePath = wheelImg,
  attachedTyres = [],
  id,
  category: propCategory,
  refetchData,
}) => {
  const { id: routeVehicleId } = useParams()
  const vehicleId = id || routeVehicleId
  const category = propCategory || attachedTyres[0]?.category || 'unknown'

  const formatDateToInput = (dateStr) => {
    if (!dateStr) return ''
    // If it's already in yyyy-MM-dd format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
    // Convert dd-MM-yyyy to yyyy-MM-dd
    const [dd, mm, yyyy] = dateStr.split('-')
    return `${yyyy}-${mm}-${dd}`
  }

  const [assignedTyres, setAssignedTyres] = useState({})
  const [rightWheels, setRightWheels] = useState([])
  const [leftWheels, setLeftWheels] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedTyreLabel, setSelectedTyreLabel] = useState('')
  const [isChangeMode, setIsChangeMode] = useState(false)
  const isHeavyVehicle = ['truck', 'bus', 'other'].includes(category?.toLowerCase())

  const isTyreAssigned = (label) => !!assignedTyres[label]

  // Initialize from backend
  useEffect(() => {
    const initialAssignments = {}
    let maxRight = 2 // RI1, RI2 are static
    let maxLeft = 2 // LI1, LI2 are static

    if (attachedTyres && attachedTyres.length > 0) {
      attachedTyres.forEach((tyre) => {
        if (tyre.position) {
          const label = tyre.position.toUpperCase()
          initialAssignments[label] = {
            id: tyre.id, // add this
            category: tyre.category || '',
            tyreSerialNumber: tyre.tyreSerialNumber || '',
            installationDate: formatDateToInput(tyre.installationDate),
            originalDate: tyre.installationDate,
            position: tyre.position || 'N/A',
            brandName: tyre.brandName || 'N/A',
            tyreStatus: tyre.tyreStatus || 'N/A',
            vendorName: tyre.vendorName || 'N/A',
            location: tyre.location || 'N/A',
            tyreSize: tyre.tyreSize || 'N/A',
            amount: tyre.amount || 'N/A',
            paymentMode: tyre.paymentMode,
          }

          // Detect dynamic right wheels (e.g., RO3, RI3)
          if (label.startsWith('RO') || label.startsWith('RI')) {
            const num = parseInt(label.replace(/[^0-9]/g, ''), 10)
            if (num > maxRight) maxRight = num
          }

          // Detect dynamic left wheels (e.g., LI3, LO4)
          if (label.startsWith('LI') || label.startsWith('LO')) {
            const num = parseInt(label.replace(/[^0-9]/g, ''), 10)
            if (num > maxLeft) maxLeft = num
          }
        }
      })

      // Initialize count of dynamic wheels (subtract 2 for static RI1/RI2 & LI1/LI2)
      setRightWheels(Array(Math.max(maxRight - 2, 0)).fill({}))
      setLeftWheels(Array(Math.max(maxLeft - 2, 0)).fill({}))
      setAssignedTyres(initialAssignments)
    }
  }, [attachedTyres])

  const handleWheelClick = async (label) => {
    const assigned = assignedTyres[label]

    if (assigned) {
      let selectedAction = null

      await Swal.fire({
        title: `Tyre at ${label}`,
        icon: 'question',
        html: `
          <p class="text-muted mb-3" style="font-size: 14px;">Choose an option for this tyre:</p>
          <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
            <button id="swal-btn-change" type="button" class="btn btn-primary py-2 px-3 text-start d-flex align-items-center justify-content-between" style="border-radius: 8px;">
              <div>
                <div style="font-weight: 600; font-size: 14px;">🔄 Change Tyre</div>
                <div style="font-size: 12px; opacity: 0.9;">Install new / replacement tyre</div>
              </div>
              <span style="font-size: 18px;">➔</span>
            </button>
            <button id="swal-btn-edit" type="button" class="btn btn-light border py-2 px-3 text-start d-flex align-items-center justify-content-between" style="border-radius: 8px;">
              <div>
                <div style="font-weight: 600; font-size: 14px; color: #212529;">✏️ Edit Tyre Details</div>
                <div style="font-size: 12px; color: #6c757d;">Update existing tyre information</div>
              </div>
              <span style="font-size: 18px; color: #6c757d;">➔</span>
            </button>
            <button id="swal-btn-delete" type="button" class="btn btn-outline-danger py-2 px-3 text-start d-flex align-items-center justify-content-between" style="border-radius: 8px;">
              <div>
                <div style="font-weight: 600; font-size: 14px;">🗑️ Delete Tyre</div>
                <div style="font-size: 12px; opacity: 0.85;">Remove tyre from this position</div>
              </div>
              <span style="font-size: 18px;">➔</span>
            </button>
          </div>
        `,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#6c757d',
        didOpen: () => {
          document.getElementById('swal-btn-change')?.addEventListener('click', () => {
            selectedAction = 'change'
            Swal.close()
          })
          document.getElementById('swal-btn-edit')?.addEventListener('click', () => {
            selectedAction = 'edit'
            Swal.close()
          })
          document.getElementById('swal-btn-delete')?.addEventListener('click', () => {
            selectedAction = 'delete'
            Swal.close()
          })
        },
      })

      if (selectedAction === 'change') {
        setSelectedTyreLabel(label)
        setIsChangeMode(true)
        setShowModal(true)
      } else if (selectedAction === 'edit') {
        setSelectedTyreLabel(label)
        setIsChangeMode(false)
        setShowModal(true)
      } else if (selectedAction === 'delete') {
        const tyreDesc = `${assigned.brandName || 'Tyre'} (Position: ${label}, Sr: ${assigned.tyreSerialNumber || 'N/A'})`

        const confirmDelete = await Swal.fire({
          title: 'Are you sure?',
          html: `You are about to delete <strong>${tyreDesc}</strong>.<br/>This action will permanently erase the tyre record!`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#dc3545',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Yes, proceed to delete',
          cancelButtonText: 'Cancel',
        })

        if (!confirmDelete.isConfirmed) return

        const passwordResult = await Swal.fire({
          title: '<span style="color: #dc3545; font-weight: 700;">Security Authorization</span>',
          html: `
            <p class="mb-2">Enter your password to authorize permanent deletion of <strong>${tyreDesc}</strong>:</p>
            <div class="alert alert-danger py-2 px-3 text-start small mb-0" style="color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
              <strong>Warning:</strong> Once verified, this tyre will be permanently deleted and removed from ${label}.
            </div>
          `,
          icon: 'warning',
          input: 'password',
          inputPlaceholder: 'Enter your password...',
          inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off',
            'aria-label': 'Enter password',
          },
          showCancelButton: true,
          confirmButtonColor: '#dc3545',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Verify & Delete',
          cancelButtonText: 'Cancel',
          showLoaderOnConfirm: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          inputValidator: (value) => {
            if (!value || !value.trim()) {
              return 'Password is required!'
            }
          },
          preConfirm: async (password) => {
            const pass = password ? password.trim() : ''
            try {
              const res = await verifyPasswordApi(pass)
              if (res?.status === false || res?.success === false || res?.valid === false) {
                throw new Error(res?.message || res?.error || 'Password verification failed.')
              }

              await deleteTyreSystemApi(assigned.id)
              return true
            } catch (err) {
              const errorMessage =
                (Array.isArray(err.response?.data?.message)
                  ? err.response.data.message.join(', ')
                  : err.response?.data?.message) ||
                err.response?.data?.error ||
                (typeof err.response?.data === 'string' ? err.response.data : null) ||
                err.message ||
                'Verification or deletion failed. Please try again.'

              Swal.showValidationMessage(errorMessage)
              return false
            }
          },
        })

        if (passwordResult.isConfirmed) {
          await Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: `Tyre permanently removed from ${label}.`,
            timer: 1500,
            showConfirmButton: false,
          })
          window.location.reload()
        }
      }
    } else {
      // Show assign modal
      setSelectedTyreLabel(label)
      setIsChangeMode(false)
      setShowModal(true)
    }
  }

  const addRightWheel = () => setRightWheels([...rightWheels, {}])
  const removeRightWheel = () => {
    if (rightWheels.length > 0) setRightWheels(rightWheels.slice(0, -1))
  }

  const addLeftWheel = () => setLeftWheels([...leftWheels, {}])
  const removeLeftWheel = () => {
    if (leftWheels.length > 0) setLeftWheels(leftWheels.slice(0, -1))
  }

  const generateLabel = (label) => {
    return label.toUpperCase()
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', backgroundColor: 'white', padding: '1rem' }}>
        <div className="mt-vertical-text">FRONT</div>

        <div style={{ margin: '20px' }}>
          {/* RIGHT WHEELS */}
          <div className="mt-right-wheels" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', padding: '0 30px' }}>
              {['RI1'].map((label) => (
                <div
                  key={`right-static-${label}`}
                  className="mt-oneWheel"
                  style={{ alignSelf: 'end' }}
                >
                  <div className="mt-wheel-container">
                    <div
                      id={label}
                      onClick={() => handleWheelClick(label)}
                      className="mt-wheelRounded"
                    >
                      {isTyreAssigned(label) && (
                        <img src={tyreImagePath} alt="Tyre" className="mt-imgCircle" />
                      )}
                    </div>
                    <div className="mt-label-container">{label}</div>
                  </div>
                </div>
              ))}

              {isHeavyVehicle ? (
                <div className="d-flex flex-column align-items-center me-3">
                  <div className="mt-wheel-container">
                    <div
                      id="RO2"
                      onClick={() => handleWheelClick('RO2')}
                      className="mt-wheelRounded"
                    >
                      {isTyreAssigned('RO2') && (
                        <img src={tyreImagePath} alt="Tyre" className="mt-imgCircle" />
                      )}
                    </div>
                    <div className="mt-label-container">RO2</div>
                  </div>

                  <div className="mt-wheel-container mt-2">
                    <div
                      id="RI2"
                      onClick={() => handleWheelClick('RI2')}
                      className="mt-wheelRounded"
                    >
                      {isTyreAssigned('RI2') && (
                        <img src={tyreImagePath} alt="Tyre" className="mt-imgCircle" />
                      )}
                    </div>
                    <div className="mt-label-container">RI2</div>
                  </div>
                </div>
              ) : (
                <div className="mt-oneWheel" style={{ alignSelf: 'end' }}>
                  <div className="mt-wheel-container">
                    <div
                      id="RI2"
                      onClick={() => handleWheelClick('RI2')}
                      className="mt-wheelRounded"
                    >
                      {isTyreAssigned('RI2') && (
                        <img src={tyreImagePath} alt="Tyre" className="mt-imgCircle" />
                      )}
                    </div>
                    <div className="mt-label-container">RI2</div>
                  </div>
                </div>
              )}

              {/* Dynamic Right Wheels */}
              {rightWheels.map((_, index) => {
                const outerLabel = `RO${index + 3}`
                const innerLabel = `RI${index + 3}`
                return (
                  <div
                    key={`right-group-${index}`}
                    className="d-flex flex-column align-items-center me-3"
                  >
                    {/* Outer */}
                    <div className="mt-wheel-container">
                      <div
                        id={outerLabel}
                        onClick={() => handleWheelClick(outerLabel)}
                        className="mt-wheelRounded"
                      >
                        {isTyreAssigned(outerLabel) && (
                          <img src={tyreImagePath} alt="Tyre" className="mt-imgCircle" />
                        )}
                      </div>
                      <div className="mt-label-container">{generateLabel(outerLabel)}</div>
                    </div>

                    {/* Inner */}
                    <div className="mt-wheel-container mt-2">
                      <div
                        id={innerLabel}
                        onClick={() => handleWheelClick(innerLabel)}
                        className="mt-wheelRounded"
                      >
                        {isTyreAssigned(innerLabel) && (
                          <img src={tyreImagePath} alt="Tyre" className="mt-imgCircle" />
                        )}
                      </div>
                      <div className="mt-label-container">{generateLabel(innerLabel)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-button-container">
              <button className="btn btn-success mt-custom-button" onClick={addRightWheel}>
                ADD
              </button>
              <button className="btn btn-danger mt-custom-button" onClick={removeRightWheel}>
                REMOVE
              </button>
            </div>
          </div>

          {/* SEPARATOR */}
          <div
            style={{
              textAlign: 'center',
              margin: '10px 0',
              background: 'green',
              border: '5px solid green',
            }}
          />

          {/* LEFT WHEELS */}
          <div className="mt-left-wheels" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', padding: '0 30px' }}>
              {['LI1'].map((label) => (
                <div key={`left-static-${label}`} className="mt-oneWheel">
                  <div className="mt-wheel-container">
                    <div
                      id={label}
                      onClick={() => handleWheelClick(label)}
                      className="mt-wheelRounded"
                    >
                      {isTyreAssigned(label) && (
                        <img src={tyreImagePath} alt="Tyre" className="mt-imgCircle" />
                      )}
                    </div>
                    <div className="mt-label-container">{label}</div>
                  </div>
                </div>
              ))}

              {isHeavyVehicle ? (
                <div className="d-flex flex-column align-items-center me-3">
                  <div className="mt-wheel-container">
                    <div
                      id="LI2"
                      onClick={() => handleWheelClick('LI2')}
                      className="mt-wheelRounded"
                    >
                      {isTyreAssigned('LI2') && (
                        <img src={tyreImagePath} alt="Tyre" className="mt-imgCircle" />
                      )}
                    </div>
                    <div className="mt-label-container">LI2</div>
                  </div>

                  <div className="mt-wheel-container mt-2">
                    <div
                      id="LO2"
                      onClick={() => handleWheelClick('LO2')}
                      className="mt-wheelRounded"
                    >
                      {isTyreAssigned('LO2') && (
                        <img src={tyreImagePath} alt="Tyre" className="mt-imgCircle" />
                      )}
                    </div>
                    <div className="mt-label-container">LO2</div>
                  </div>
                </div>
              ) : (
                <div className="mt-oneWheel">
                  <div className="mt-wheel-container">
                    <div
                      id="LI2"
                      onClick={() => handleWheelClick('LI2')}
                      className="mt-wheelRounded"
                    >
                      {isTyreAssigned('LI2') && (
                        <img src={tyreImagePath} alt="Tyre" className="mt-imgCircle" />
                      )}
                    </div>
                    <div className="mt-label-container">LI2</div>
                  </div>
                </div>
              )}

              {/* Dynamic Left Wheels */}
              {leftWheels.map((_, index) => {
                const innerLabel = `LI${index + 3}`
                const outerLabel = `LO${index + 3}`
                return (
                  <div
                    key={`left-group-${index}`}
                    className="d-flex flex-column align-items-center me-3"
                  >
                    {/* Inner on top */}
                    <div className="mt-wheel-container">
                      <div
                        id={innerLabel}
                        onClick={() => handleWheelClick(innerLabel)}
                        className="mt-wheelRounded"
                      >
                        {isTyreAssigned(innerLabel) && (
                          <img src={tyreImagePath} alt="Tyre" className="mt-imgCircle" />
                        )}
                      </div>
                      <div className="mt-label-container">{generateLabel(innerLabel)}</div>
                    </div>

                    {/* Outer below */}
                    <div className="mt-wheel-container mt-2">
                      <div
                        id={outerLabel}
                        onClick={() => handleWheelClick(outerLabel)}
                        className="mt-wheelRounded"
                      >
                        {isTyreAssigned(outerLabel) && (
                          <img src={tyreImagePath} alt="Tyre" className="mt-imgCircle" />
                        )}
                      </div>
                      <div className="mt-label-container">{generateLabel(outerLabel)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-button-container">
              <button className="btn btn-success mt-custom-button" onClick={addLeftWheel}>
                ADD
              </button>
              <button className="btn btn-danger mt-custom-button" onClick={removeLeftWheel}>
                REMOVE
              </button>
            </div>
          </div>
        </div>

        <div className="mt-vertical-text">REAR</div>
      </div>

      <TyreAssignModal
        show={showModal}
        onClose={() => {
          setShowModal(false)
          setIsChangeMode(false)
        }}
        tyreLabel={selectedTyreLabel}
        vehicleId={vehicleId}
        category={category}
        refetchData={refetchData}
        initialData={assignedTyres[selectedTyreLabel] || null}
        isChange={isChangeMode}
        onAssign={(label) => {
          setAssignedTyres((prev) => ({ ...prev, [label]: true }))
          setShowModal(false)
          setIsChangeMode(false)
          Swal.fire('Assigned!', `Tyre assigned to ${label}`, 'success')
        }}
      />
    </div>
  )
}

export default TyreAlign
