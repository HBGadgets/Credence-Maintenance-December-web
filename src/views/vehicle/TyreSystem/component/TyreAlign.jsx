import React, { useEffect, useState } from 'react'
import './tyrealign.css'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import TyreAssignModal from './TyreAssignModal'
import { deleteTyreSystemApi } from '../../data/VehicleListData'
import wheelImg from '../../../../assets/tyre/wheel1.png'

const ManageTyre = ({ tyreImagePath = wheelImg, attachedTyres = [], id, refetchData }) => {
  const category = attachedTyres[0]?.category || 'unknown'

  const { id: vehicleId } = useParams()

  console.log('idzzz tyre', id)

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
  const isHeavyVehicle = ['truck', 'bus'].includes(category?.toLowerCase())

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
      const result = await Swal.fire({
        title: `Tyre already assigned to ${label}`,
        text: 'Do you want to edit or delete this tyre?',
        icon: 'question',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Edit',
        denyButtonText: 'Delete',
      })

      if (result.isConfirmed) {
        // Open edit modal
        setSelectedTyreLabel(label)
        setShowModal(true)
      } else if (result.isDenied) {
        const confirmDelete = await Swal.fire({
          title: 'Are you sure?',
          text: `This will delete the tyre assigned to ${label}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel',
        })

        if (confirmDelete.isConfirmed) {
          try {
            await deleteTyreSystemApi(assigned.id)
            Swal.fire('Deleted!', `Tyre removed from ${label}`, 'success')
            setAssignedTyres((prev) => {
              const updated = { ...prev }
              delete updated[label]
              return updated
            })
            refetchData()
          } catch (error) {
            Swal.fire('Error', 'Failed to delete tyre', 'error')
          }
        }
      }
    } else {
      // Show assign modal
      setSelectedTyreLabel(label)
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
        onClose={() => setShowModal(false)}
        tyreLabel={selectedTyreLabel}
        vehicleId={vehicleId}
        refetchData={refetchData}
        initialData={assignedTyres[selectedTyreLabel] || null}
        onAssign={(label) => {
          setAssignedTyres((prev) => ({ ...prev, [label]: true }))
          setShowModal(false)
          Swal.fire('Assigned!', `Tyre assigned to ${label}`, 'success')
          size = 'xl' // or 'lg', 'sm'
        }}
      />
    </div>
  )
}

export default ManageTyre
