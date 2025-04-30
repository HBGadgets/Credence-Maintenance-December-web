import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CFormSelect,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
} from '@coreui/react'
import "./CSSdetailedPage.css"
import { useParams } from 'react-router-dom'
import { vehicles } from '../vehicle/data/data'
import axios from 'axios'

function DetailedPage({ }) {
  const { id } = useParams() // this is deviceId
  const [leftWheels, setLeftWheels] = useState([]) // Additional wheel pairs for the left side
  const [rightWheels, setRightWheels] = useState([]) // Additional wheel pairs for the right side
  const [tyreInventory, setTyreInventory] = useState([]) // Tyre Inventory
  const [assignedTyres, setAssignedTyres] = useState([]) // List of assigned tyres with positions
  const [selectedWheelId, setSelectedWheelId] = useState(null) // The ID of the wheel being assigned
  const [selectedTyreId, setSelectedTyreId] = useState('') // The selected tyre ID
  const [isModalVisible, setIsModalVisible] = useState(false) // Modal visibility
  const [category, setCategory] = useState('bus')


  const fetchVehicle = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/credence/${id}`)
      console.log("response in fetchVehicle in detailedpage", response.data.device.category);
      setCategory(response.data.device.category?.toLowerCase() || "")
      // setCategory("truck")
    } catch (error) {
      console.error(error);
    }
  }

  const fetchTyres = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tyre`)
      console.log("tyre inventory mdhe he set hot ahe", response.data);
      setTyreInventory(response.data)
    } catch (error) {
      console.error('Error fetching tyres:', error)
    }
  }

  const fetchAssignedTyre = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/extendedVehicle/`, {
        params: { deviceId: id }
      });
      console.log("fetchAssignedTyre response", response.data);
      setAssignedTyres(response.data.data || []);
    } catch (error) {
      console.error('Error fetching assigned tyres:', error)
    }
  }

  useEffect(() => {
    fetchVehicle()
    fetchTyres()
    fetchAssignedTyre()
  }, [id])

  const initializeWheels = () => {
    let greatestNumber = 0;
    assignedTyres.forEach((assignment) => {
      // Use wheelPosition directly from the API response
      const match = assignment.wheelPosition.match(/(\d+)/);
      if (match) {
        const number = parseInt(match[0], 10);
        if (number > greatestNumber) {
          greatestNumber = number;
        }
      }
    });

    const emptySlots = greatestNumber - 2;
    if (emptySlots > 0) {
      setLeftWheels(Array(emptySlots).fill({}));
      setRightWheels(Array(emptySlots).fill({}));
    }
  };


  useEffect(() => {
    initializeWheels();
  }, []);

  const columns = [
    // { label: 'Tyre ID', key: '_id' },
    { label: 'Serial No.', key: 'SrNo' },
    { label: 'Brand', key: 'brand' },
    { label: 'Status', key: 'status' },
    { label: 'Pressure', key: 'pressure' },
    { label: 'Installation Date', key: 'installationDate' },
    { label: 'Purchase Date', key: 'purchaseDate' },
    { label: 'Tread Depth', key: 'treadDepth' },
    { label: 'Tread Pattern', key: 'treadPattern' },
    { label: 'Tread Construction', key: 'treadConstruction' },
    { label: 'Size', key: 'size' },
  ]

  const addLeftWheels = () => {
    setLeftWheels([...leftWheels, {}])
    console.log("leftwheels", leftWheels);

  }

  const addRightWheels = () => {
    setRightWheels([...rightWheels, {}])
    console.log("rightWheels", rightWheels);

  }
  const removeLastLeftWheel = () => {
    setLeftWheels(leftWheels.slice(0, -1))
  }

  const removeLastRightWheel = () => {
    setRightWheels(rightWheels.slice(0, -1))
  }

  const handleWheelClick = (id) => {
    setSelectedWheelId(id)
    setIsModalVisible(true)
  }

  // assign zal asel tr image yeil
  const tyreImagePath = '/tyre1.png'
  // const isTyreAssigned = (position) => {
  //   return assignedTyres.some((tyre) => tyre.position === position)
  // }
  const isTyreAssigned = (position) => {
    return Array.isArray(assignedTyres) ? assignedTyres.some((assignment) => assignment.wheelPosition === position) : false;
  };

  const handleAssignTyre = async () => {
    if (!selectedTyreId || !selectedWheelId) {
      alert('Please select a tyre and a wheel position.');
      return;
    }
    // Check if a tyre is already assigned to the selected wheel position
    if (assignedTyres?.some((assignment) => assignment.wheelPosition === selectedWheelId)) {
      alert('A tyre is already assigned to this position.');
      return;
    }

    try {
      // Prepare the payload to match the backend requirement
      const payload = {
        deviceId: id,                 // e.g., "679b2787ce1903ac227a453a"
        tyreId: selectedTyreId,         // e.g., "67a746e2535607f7d7cba379"
        wheelPosition: selectedWheelId, // e.g., "right-inner-2"
      };
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/extendedVehicle/assign-tyre`, payload);
      console.log("Tyre assigned successfully", response.data);

      // Assume the backend returns the new assignment in response.data.data
      // For example, { wheelPosition: "right-inner-2", tyre: { _id: "67a746e2535607f7d7cba379", serialNumber: "TYR12345", ... } }
      const newAssignment = response.data.data;

      // Update your local state with the new assignment (using the same structure as returned by the API)
      setAssignedTyres([...assignedTyres, newAssignment]);

      // Optionally, remove the assigned tyre from your inventory so it can't be reassigned
      // setTyreInventory(tyreInventory.filter((tyre) => tyre._id !== selectedTyreId));

      // Reset selections and close the modal
      setSelectedTyreId('');
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error:", error);
      // Check if there's a response from the server with a custom error message.
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  // Function to detach a tyre using the backend API
  const handleDetachTyre = async (wheelPosition) => {
    // Find the assignment for the given wheel position
    const assignment = assignedTyres.find((a) => a.wheelPosition === wheelPosition);
    if (!assignment) {
      alert("No tyre assigned at this position.");
      return;
    }

    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/extendedVehicle/detach-tyre`, {
        // For axios.delete, include the request body inside the "data" key of the config object.
        data: {
          deviceId: id,
          tyreId: assignment.tyre._id,
        },
      });
      console.log("Tyre detached successfully", response.data);

      // Remove the assignment from local state
      setAssignedTyres(assignedTyres.filter((a) => a.wheelPosition !== wheelPosition));

      // Optionally, you can add the detached tyre back to your tyreInventory if needed.

    } catch (error) {
      console.error("Error detaching tyre:", error);
      alert("Failed to detach tyre. Please try again.");
    }
  };
  const generateLabel = (id) => {
    // Split the id into parts using "-"
    const parts = id.split('-')

    if (parts.length === 3) {
      const [side, position, number] = parts

      // Generate the label based on the id components
      const sideAbbr = side === 'left' ? 'L' : 'R' // Left -> L, Right -> R
      const positionAbbr = position === 'inner' ? 'I' : 'O' // Inner -> I, Outer -> O

      // Return the formatted label (e.g., LI1, RO1)
      return `${sideAbbr}${positionAbbr}${number}`
    }
    return id // Fallback if format doesn't match
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'white',
            paddingLeft: '1rem',
            paddingRight: '1rem',
          }}
        >
          <div className="vertical-text"> FRONT </div>
          {['truck', 'bus'].includes(category) ? (
            <div style={{ margin: '20px' }}>
              {/* Right Wheels Section */}
              <div
                style={{
                  display: 'flex',
                  paddingLeft: '30px',
                  paddingRight: '30px',
                }}
                className="right-wheels"
              >
                <div style={{ display: 'flex' }}>
                  <div className="oneWheel" style={{ alignSelf: 'end' }}>
                    <div
                      className="wheel-container"
                    >
                      <div
                        id="right-inner-1"
                        onClick={() => handleWheelClick('right-inner-1')}
                        className='wheelRounded'
                      >
                        {isTyreAssigned('right-inner-1') ? (
                          <img
                            src={tyreImagePath}
                            alt="Tyre"
                            className='imgCircle'
                          />
                        ) : (
                          ''
                        )}
                      </div>
                      <div className="label-container" style={{ paddingLeft: '2px' }}>
                        {generateLabel('right-inner-1')}
                      </div>
                    </div>
                  </div>
                  <div className="twowheeltogether">
                    <div className='wheel-container'>
                      <div
                        id="right-outer-2"
                        onClick={() => handleWheelClick('right-outer-2')}
                        className='wheelRounded'
                      >
                        {isTyreAssigned('right-outer-2') ? (
                          <img
                            src={tyreImagePath}
                            alt="Tyre"
                            className='imgCircle'
                          />
                        ) : (
                          ''
                        )}
                      </div>
                      <div className="label-container" style={{ paddingLeft: '2px' }}>
                        {generateLabel('right-outer-2')}
                      </div>
                    </div>
                    <div
                      className="wheel-container"
                    >
                      <div
                        id="right-inner-2"
                        onClick={() => handleWheelClick('right-inner-2')}
                        className='wheelRounded'
                      >
                        {isTyreAssigned('right-inner-2') ? (
                          <img
                            src={tyreImagePath}
                            alt="Tyre"
                            className='imgCircle'
                          />
                        ) : (
                          ''
                        )}
                      </div>
                      <div className="label-container" style={{ paddingLeft: '2px' }}>
                        {generateLabel('right-inner-2')}
                      </div>
                    </div>
                  </div>
                  {/* Dynamically add grouped right wheels */}
                  {rightWheels.map((_, index) => (
                    <div className="twowheeltogether">
                      <div className='wheel-container'>
                        <div
                          id={`right-outer-${index + 3}`}
                          onClick={() => handleWheelClick(`right-outer-${index + 3}`)}
                          className='wheelRounded'
                        >
                          {isTyreAssigned(`right-outer-${index + 3}`) ? (
                            <img
                              src={tyreImagePath}
                              alt="Tyre"
                              className='imgCircle' />
                          ) : (
                            ''
                          )}
                        </div>
                        <div className="label-container" style={{ paddingLeft: '2px' }}>
                          {generateLabel(`right-outer-${index + 3}`)}
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '6rem',
                        }}
                      >
                        <div
                          id={`right-inner-${index + 3}`}
                          onClick={() => handleWheelClick(`right-inner-${index + 3}`)}
                          className='wheelRounded'
                        >
                          {isTyreAssigned(`right-inner-${index + 3}`) ? (
                            <img
                              src={tyreImagePath}
                              alt="Tyre"
                              className='imgCircle'
                            />
                          ) : (
                            ''
                          )}
                        </div>
                        <div className="label-container" style={{ paddingLeft: '2px' }}>
                          {generateLabel(`right-inner-${index + 3}`)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seperator */}
              <div
                style={{
                  textAlign: 'center',
                  margin: '10px 0',
                  background: 'green',
                  border: '5px solid green',
                }}
              ></div>

              {/* Left Wheels Section */}
              <div
                style={{
                  display: 'flex',
                  paddingLeft: '30px',
                  paddingRight: '30px',
                }}
                className="left-wheels"
              >
                <div style={{ display: 'flex' }}>
                  <div className="oneWheel">
                    <div
                      className="wheel-container"
                    >
                      <div
                        id="left-inner-1"
                        onClick={() => handleWheelClick('left-inner-1')}
                        className='wheelRounded'
                      >
                        {isTyreAssigned('left-inner-1') ? (
                          <img
                            src={tyreImagePath}
                            alt="Tyre"
                            className='imgCircle'
                          />
                        ) : (
                          ''
                        )}
                      </div>
                      <div className="label-container" style={{ paddingLeft: '2px' }}>
                        {generateLabel('left-inner-1')}
                      </div>
                    </div>
                  </div>
                  <div className="twowheeltogether">
                    <div
                      className="wheel-container"
                    >
                      <div
                        id="left-inner-2"
                        onClick={() => handleWheelClick('left-inner-2')}
                        className='wheelRounded'
                      >
                        {isTyreAssigned('left-inner-2') ? (
                          <img
                            src={tyreImagePath}
                            alt="Tyre"
                            className='imgCircle'
                          />
                        ) : (
                          ''
                        )}
                      </div>
                      <div className="label-container" style={{ paddingLeft: '2px' }}>
                        {generateLabel('left-inner-2')}
                      </div>
                    </div>

                    <div
                      className="wheel-container"
                    >
                      <div
                        id="left-outer-2"
                        onClick={() => handleWheelClick('left-outer-2')}
                        className='wheelRounded'
                      >
                        {isTyreAssigned('left-outer-2') ? (
                          <img
                            src={tyreImagePath}
                            alt="Tyre"
                            className='imgCircle'
                          />
                        ) : (
                          ''
                        )}
                      </div>
                      <div className="label-container" style={{ paddingLeft: '2px' }}>
                        {generateLabel('left-outer-2')}
                      </div>
                    </div>
                  </div>
                  {/* Dynamically add grouped left wheels */}
                  {leftWheels.map((_, index) => (
                    <div className="twowheeltogether">
                      <div className='wheel-container'>
                        <div
                          id={`left-inner-${index + 3}`}
                          onClick={() => handleWheelClick(`left-inner-${index + 3}`)}
                          className='wheelRounded'
                        >
                          {isTyreAssigned(`left-inner-${index + 3}`) ? (
                            <img
                              src={tyreImagePath}
                              alt="Tyre"
                              className='imgCircle'
                            />
                          ) : (
                            ''
                          )}
                        </div>
                        <div className="label-container" style={{ paddingLeft: '2px' }}>
                          {generateLabel(`left-inner-${index + 3}`)}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '6rem',
                        }}
                      >
                        <div
                          id={`left-outer-${index + 3}`}
                          onClick={() => handleWheelClick(`left-outer-${index + 3}`)}
                          className='wheelRounded'
                        >
                          {isTyreAssigned(`left-outer-${index + 3}`) ? (
                            <img
                              src={tyreImagePath}
                              alt="Tyre"
                              className='imgCircle'
                            />
                          ) : (
                            ''
                          )}
                        </div>
                        <div className="label-container" style={{ paddingLeft: '2px' }}>
                          {generateLabel(`left-outer-${index + 3}`)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : ["car", "taxi"].includes(category) ? (
            <div style={{ margin: '20px' }}>
              {/* Right Wheels Section */}
              <div
                style={{
                  display: 'flex',
                  paddingLeft: '30px',
                  // paddingRight: "30px",
                }}
                className="right-wheels"
              >
                <div style={{ display: 'flex' }}>
                  <div className="oneWheel" style={{ alignSelf: 'end' }}>
                    <div
                      className="wheel-container"
                    >
                      <div
                        id="right-inner-1"
                        onClick={() => handleWheelClick('right-inner-1')}
                        className='wheelRounded'
                      >
                        {isTyreAssigned('right-inner-1') ? (
                          <img
                            src={tyreImagePath}
                            alt="Tyre"
                            className='imgCircle'
                          />
                        ) : (
                          ''
                        )}
                      </div>
                      <div className="label-container" style={{ paddingLeft: '2px' }}>
                        {generateLabel('right-inner-1')}
                      </div>
                    </div>
                  </div>
                  <div className="oneWheel" style={{ alignSelf: 'end' }}>
                    <div
                      className="wheel-container"
                    >
                      <div
                        id="right-inner-2"
                        onClick={() => handleWheelClick('right-inner-2')}
                        className='wheelRounded'
                      >
                        {isTyreAssigned('right-inner-2') ? (
                          <img
                            src={tyreImagePath}
                            alt="Tyre"
                            className='imgCircle'
                          />
                        ) : (
                          ''
                        )}
                      </div>
                      <div className="label-container" style={{ paddingLeft: '2px' }}>
                        {generateLabel('right-inner-2')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seperator */}
              <div
                style={{
                  textAlign: 'center',
                  margin: '10px 0',
                  background: 'green',
                  border: '5px solid green',
                }}
              ></div>

              {/* Left Wheels Section */}
              <div
                style={{
                  display: 'flex',
                  paddingLeft: '30px',
                  // paddingRight: "30px",
                }}
                className="left-wheels"
              >
                <div style={{ display: 'flex' }}>
                  <div className="oneWheel">
                    <div
                      className="wheel-container"
                    >
                      <div
                        id="left-inner-1"
                        onClick={() => handleWheelClick('left-inner-1')}
                        className='wheelRounded'
                      >
                        {isTyreAssigned('left-inner-1') ? (
                          <img
                            src={tyreImagePath}
                            alt="Tyre"
                            className='imgCircle'
                          />
                        ) : (
                          ''
                        )}
                      </div>
                      <div className="label-container" style={{ paddingLeft: '2px' }}>
                        {generateLabel('left-inner-1')}
                      </div>
                    </div>
                  </div>
                  <div className="oneWheel">
                    <div
                      className="wheel-container"
                    >
                      <div
                        id="left-inner-2"
                        onClick={() => handleWheelClick('left-inner-2')}
                        className='wheelRounded'
                      >
                        {isTyreAssigned('left-inner-2') ? (
                          <img
                            src={tyreImagePath}
                            alt="Tyre"
                            className='imgCircle'
                          />
                        ) : (
                          ''
                        )}
                      </div>
                      <div className="label-container" style={{ paddingLeft: '2px' }}>
                        {generateLabel('left-inner-2')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ margin: '20px', display: 'flex' }}>
                {/* Right Wheels Section */}


                <div className="oneWheel" style={{ alignSelf: 'end' }}>
                  <div
                    className="wheel-container"
                  >
                    <div
                      id="front"
                      onClick={() => handleWheelClick('front')}
                      className='wheelRounded'
                    >
                      {isTyreAssigned('front') ? (
                        <img
                          src={tyreImagePath}
                          alt="Tyre"
                          className='imgCircle'
                        />
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="label-container" style={{ paddingLeft: '2px' }}>
                      {generateLabel('front')}
                    </div>
                  </div>
                </div>
                <div className="oneWheel" style={{ alignSelf: 'end' }}>
                  <div
                    className="wheel-container"
                  >
                    <div
                      id="back"
                      onClick={() => handleWheelClick('back')}
                      className='wheelRounded'
                    >
                      {isTyreAssigned('back') ? (
                        <img
                          src={tyreImagePath}
                          alt="Tyre"
                          className='imgCircle'
                        />
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="label-container" style={{ paddingLeft: '2px' }}>
                      {generateLabel('back')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="vertical-text"> REAR </div>
        </div>

        {['truck', 'bus'].includes(category) ? (
          <div
            className='button-container'
          >
            <CButton
              color="success"
              onClick={addRightWheels}
              className='custom-button'>
              ADD
            </CButton>
            <CButton
              color="danger"
              className='custom-button'
              style={{ marginBottom: '2rem', }}
              onClick={removeLastRightWheel}
            >
              REMOVE
            </CButton>
            <CButton
              color="success"
              className='custom-button'
              onClick={addLeftWheels}
            >
              ADD
            </CButton>

            <CButton
              color="danger"
              className='custom-button'
              onClick={removeLastLeftWheel}
            >
              REMOVE
            </CButton>
          </div>
        ) : (
          ''
        )}
      </div>

      {/* Modal for Assign Tyre */}
      <CModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} alignment="center">
        <CModalHeader>Assign Tyre</CModalHeader>
        <CModalBody>
          <p>
            Assign tyre to: <strong>{selectedWheelId}</strong>
          </p>
          <CFormSelect value={selectedTyreId} onChange={(e) => setSelectedTyreId(e.target.value)}>
            <option value="">Select Tyre</option>
            {tyreInventory.map((tyre) => (
              <option key={tyre._id} value={tyre._id}>
                {tyre.brand}-{tyre.SerialNumber}-{tyre.size}
              </option>
            ))}
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleAssignTyre}>
            Assign
          </CButton>
          <CButton color="secondary" onClick={() => setIsModalVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      <CRow style={{ marginTop: '1rem' }}>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Assigned Tyres</strong>
            </CCardHeader>
            <CCardBody>
              {assignedTyres?.length === 0 ? (
                <p className="text-center">No Tyres available.</p>
              ) : (
                <CTable striped hover responsive bordered>
                  <CTableHead>
                    <CTableRow className="text-nowrap">
                      <CTableHeaderCell className="text-center" scope="col">
                        SN
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" scope="col">
                        Position
                      </CTableHeaderCell>

                      {columns.map((column, index) => (
                        <CTableHeaderCell key={index} className="text-center" scope="col">
                          {column.label}
                        </CTableHeaderCell>
                      ))}
                      <CTableHeaderCell className="text-center" scope="col">
                        Actions
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  {/* <CTableBody>
                    {assignedTyres.map((assigned, index) => {
                      const tyreDetails = tyreInventory.find(
                        (tyre) => tyre.id == assigned.tyreId,
                      ) || {
                        SrNo: 'Unknown',
                        brand: 'Unknown',
                        pressure: '-',
                        status: '-',
                      }
                      return (
                        <CTableRow key={index} className="text-center">
                          <CTableDataCell scope="row">{index + 1}</CTableDataCell>
                          <CTableDataCell>{assigned.position}</CTableDataCell>
                          {columns.map((column, index) => (
                            <CTableDataCell>{tyreDetails[column.key]}</CTableDataCell>
                          ))}
                          <CTableDataCell>
                            <CButton
                              color="danger"
                              size="sm"
                              className='custom-button'
                              onClick={() => handleDetachTyre(assigned.position)}
                            >
                              Detach
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                  </CTableBody> */}
                  <CTableBody>
                    {assignedTyres?.map((assigned, index) => {
                      // Use the tyre details from the API response directly.
                      // If for some reason 'assigned.tyre' is missing, fall back to default values.
                      const tyreDetails = assigned.tyre || {
                        serialNumber: 'Unknown',
                        brand: 'Unknown',
                        pressure: '-',
                        status: '-',
                      };

                      return (
                        <CTableRow key={index} className="text-center">
                          <CTableDataCell scope="row">{index + 1}</CTableDataCell>
                          <CTableDataCell>{assigned.wheelPosition}</CTableDataCell>
                          {columns.map((column, idx) => (
                            <CTableDataCell key={idx}>

                              {tyreDetails[column.key]}
                            </CTableDataCell>
                          ))}
                          <CTableDataCell>
                            <CButton
                              color="danger"
                              size="sm"
                              className="custom-button"
                              onClick={() => handleDetachTyre(assigned.wheelPosition)}
                            >
                              Detach
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      );
                    })}
                  </CTableBody>

                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default DetailedPage
