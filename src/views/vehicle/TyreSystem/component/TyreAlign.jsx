import React, { useState } from 'react'
import './tyrealign.css'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import TyreAssignModal from './TyreAssignModal'

const ManageTyre = ({
  category = 'car', // 'truck', 'bus', 'car', 'taxi'
  tyreImagePath = '/tyre1.png',
}) => {
  const { id } = useParams()
  console.log('idzzz tyre', id)

  const [assignedTyres, setAssignedTyres] = useState({})
  const [rightWheels, setRightWheels] = useState([])
  const [leftWheels, setLeftWheels] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedTyreLabel, setSelectedTyreLabel] = useState('')

  const isTyreAssigned = (label) => !!assignedTyres[label]

  // const handleWheelClick = async (label) => {
  //   if (assignedTyres[label]) {
  //     const result = await Swal.fire({
  //       title: 'Remove Tyre',
  //       text: `Tyre already assigned to ${label}. Do you want to remove it?`,
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonText: 'Yes, remove it!',
  //       cancelButtonText: 'Cancel',
  //     })
  //     if (result.isConfirmed) {
  //       setAssignedTyres((prev) => {
  //         const updated = { ...prev }
  //         delete updated[label]
  //         return updated
  //       })
  //       Swal.fire('Removed!', `Tyre removed from ${label}`, 'success')
  //     }
  //   } else {
  //     const result = await Swal.fire({
  //       title: 'Assign Tyre',
  //       text: `Do you want to assign a tyre to ${label}?`,
  //       icon: 'question',
  //       showCancelButton: true,
  //       confirmButtonText: 'Yes, assign it!',
  //       cancelButtonText: 'Cancel',
  //     })
  //     if (result.isConfirmed) {
  //       setAssignedTyres((prev) => ({
  //         ...prev,
  //         [label]: true,
  //       }))
  //       Swal.fire('Assigned!', `Tyre assigned to ${label}`, 'success')
  //     }
  //   }
  // }

  const handleWheelClick = async (label) => {
    if (assignedTyres[label]) {
      const result = await Swal.fire({
        title: 'Remove Tyre',
        text: `Tyre already assigned to ${label}. Do you want to remove it?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel',
      })

      if (result.isConfirmed) {
        setAssignedTyres((prev) => {
          const updated = { ...prev }
          delete updated[label]
          return updated
        })
        Swal.fire('Removed!', `Tyre removed from ${label}`, 'success')
      }
    } else {
      // show modal
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
              {['RI1', 'RI2'].map((label) => (
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
              {['LI1', 'LI2'].map((label) => (
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
