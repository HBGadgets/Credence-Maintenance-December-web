import React, { useState } from 'react'
import './tyrealign.css'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

const ManageTyre = ({
  category = 'car', // or 'bus', 'car', 'taxi'
  tyreImagePath = '/tyre1.png',
  rightWheels = [],
  leftWheels = [],
  generateLabel = () => '',
}) => {
  const { id } = useParams()
  console.log('idzzz tyre', id)

  // State to track tyre assignments
  const [assignedTyres, setAssignedTyres] = useState({})

  // Function to check if tyre is assigned
  const isTyreAssigned = (label) => !!assignedTyres[label]

  // Click handler to assign tyre if not already assigned
  const handleWheelClick = async (label) => {
    if (assignedTyres[label]) {
      // If already assigned, confirm removal
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
      // Confirm assignment
      const result = await Swal.fire({
        title: 'Assign Tyre',
        text: `Do you want to assign a tyre to ${label}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, assign it!',
        cancelButtonText: 'Cancel',
      })

      if (result.isConfirmed) {
        setAssignedTyres((prev) => ({
          ...prev,
          [label]: true,
        }))
        Swal.fire('Assigned!', `Tyre assigned to ${label}`, 'success')
      }
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'white',
          padding: '1rem',
        }}
      >
        <div className="mt-vertical-text">FRONT</div>
        {['truck', 'bus'].includes(category) ? (
          <div style={{ margin: '20px' }}>
            {/* Right Wheels */}
            <div className="mt-right-wheels" style={{ display: 'flex', padding: '0 30px' }}>
              <div style={{ display: 'flex' }}>
                {/* Static Right Wheels */}
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
                      <div className="mt-label-container" style={{ paddingLeft: '2px' }}>
                        {label}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Dynamic Right Wheels */}
                {rightWheels.map((_, index) => (
                  <div key={`right-group-${index}`} className="mt-twowheeltogether">
                    {['outer', 'inner'].map((side) => {
                      const label = `right-${side}-${index + 3}`
                      return (
                        <div
                          key={label}
                          className="mt-wheel-container"
                          style={{ width: '6rem', alignItems: 'center' }}
                        >
                          <div
                            id={label}
                            onClick={() => handleWheelClick(label)}
                            className="mt-wheelRounded"
                          >
                            {isTyreAssigned(label) && (
                              <img src={tyreImagePath} alt="Tyre" className="mt-imgCircle" />
                            )}
                          </div>
                          <div className="mt-label-container" style={{ paddingLeft: '2px' }}>
                            {generateLabel(label)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div
              style={{
                textAlign: 'center',
                margin: '10px 0',
                background: 'green',
                border: '5px solid green',
              }}
            />

            {/* Left Wheels */}
            <div className="mt-left-wheels" style={{ display: 'flex', padding: '0 30px' }}>
              <div style={{ display: 'flex' }}>
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
                      <div className="mt-label-container" style={{ paddingLeft: '2px' }}>
                        {label}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Dynamic Left Wheels */}
                {leftWheels.map((_, index) => (
                  <div key={`left-group-${index}`} className="mt-twowheeltogether">
                    {['inner', 'outer'].map((side) => {
                      const label = `left-${side}-${index + 3}`
                      return (
                        <div
                          key={label}
                          className="mt-wheel-container"
                          style={{ width: '6rem', alignItems: 'center' }}
                        >
                          <div
                            id={label}
                            onClick={() => handleWheelClick(label)}
                            className="mt-wheelRounded"
                          >
                            {isTyreAssigned(label) && (
                              <img src={tyreImagePath} alt="Tyre" className="mt-imgCircle" />
                            )}
                          </div>
                          <div className="mt-label-container" style={{ paddingLeft: '2px' }}>
                            {generateLabel(label)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : ['car', 'taxi'].includes(category) ? (
          <div style={{ margin: '20px' }}>
            <div className="mt-right-wheels" style={{ display: 'flex', paddingLeft: '30px' }}>
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
                    <div className="mt-label-container" style={{ paddingLeft: '2px' }}>
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                textAlign: 'center',
                margin: '10px 0',
                background: 'green',
                border: '5px solid green',
              }}
            />

            <div className="mt-left-wheels" style={{ display: 'flex', paddingLeft: '30px' }}>
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
                    <div className="mt-label-container" style={{ paddingLeft: '2px' }}>
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-vertical-text">REAR</div>
      </div>
    </div>
  )
}

export default ManageTyre
