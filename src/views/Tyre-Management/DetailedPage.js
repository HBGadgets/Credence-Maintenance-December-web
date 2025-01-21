import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  CTableHeaderCell
} from "@coreui/react";


function DetailedPage() {
  const [leftWheels, setLeftWheels] = useState([]); // Additional wheel pairs for the left side
  const [rightWheels, setRightWheels] = useState([]); // Additional wheel pairs for the right side
  const [tyreInventory, setTyreInventory] = useState([
    {
      id: 1,
      SrNo: "Tyre A",
      brand: "MRF",
      status: "New",
      pressure: "32 psi",
      installationDate: "2024-01-01",
      purchaseDate: "2024-01-01",
      treadDepth: "8mm",
      pattern: "Radial",
      size:"277/12/12"
    },
    {
      id: 2,
      SrNo: "Tyre B",
      brand: "MRF",
      status: "In Use",
      pressure: "30 psi",
      installationDate: "2023-12-15",
      purchaseDate: "2023-12-10",
      treadDepth: "6mm",
      pattern: "Bias Ply",
      size:"277/12/12"
    },
    {
      id: 3,
      SrNo: "Tyre C",
      brand: "MRF",
      status: "In Use",
      pressure: "30 psi",
      installationDate: "2023-12-15",
      purchaseDate: "2023-12-10",
      treadDepth: "6mm",
      pattern: "Bias Ply",
      size:"277/12/12"
    },
    {
      id: 4,
      SrNo: "Tyre D",
      brand: "MRF",
      status: "In Use",
      pressure: "30 psi",
      installationDate: "2023-12-15",
      purchaseDate: "2023-12-10",
      treadDepth: "6mm",
      pattern: "Bias Ply",
      size:"277/12/12"
    },
    {
      id: 5,
      SrNo: "Tyre E",
      brand: "MRF",
      status: "In Use",
      pressure: "30 psi",
      installationDate: "2023-12-15",
      purchaseDate: "2023-12-10",
      treadDepth: "6mm",
      pattern: "Bias Ply",
      size:"277/12/12"
    },
    {
      id: 6,
      SrNo: "Tyre F",
      brand: "MRF",
      status: "In Use",
      pressure: "30 psi",
      installationDate: "2023-12-15",
      purchaseDate: "2023-12-10",
      treadDepth: "6mm",
      pattern: "Bias Ply",
      size:"277/12/12"
    },
    {
      id: 7,
      SrNo: "Tyre G",
      brand: "MRF",
      status: "In Use",
      pressure: "30 psi",
      installationDate: "2023-12-15",
      purchaseDate: "2023-12-10",
      treadDepth: "6mm",
      pattern: "Bias Ply",
      size:"277/12/12"
    },
    // Add more tyres as necessary
  ]); // Tyre Inventory
  const [assignedTyres, setAssignedTyres] = useState([]); // List of assigned tyres with positions
  const [selectedWheelId, setSelectedWheelId] = useState(null); // The ID of the wheel being assigned
  const [selectedTyreId, setSelectedTyreId] = useState(""); // The selected tyre ID
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const columns = [
    { label: 'Tyre ID', key: "id" },
    { label: 'Serial No.', key: "SrNo" },
    { label: 'Brand', key: "brand" },
    { label: 'Status', key: "status"},
    { label: 'Pressure', key: "pressure"},
    { label: 'Installation Date', key: "installationDate"},
    { label: 'Purchase Date', key: "purchaseDate"},
    { label: 'Tread Depth', key: "treadDepth"},
    { label: 'Pattern', key: "pattern" },
    { label: 'Size', key: "size" },

  ];

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category'); // Extract the category from query params
  const addLeftWheels = () => {
    setLeftWheels([...leftWheels, {}]);
  };

  const addRightWheels = () => {
    setRightWheels([...rightWheels, {}]);
  };
  const removeLastLeftWheel = () => {
    setLeftWheels(leftWheels.slice(0, -1));
  };

  const removeLastRightWheel = () => {
    setRightWheels(rightWheels.slice(0, -1));
  };

  // Open Modal for Assign Tyre
  const handleWheelClick = (id) => {
    setSelectedWheelId(id);
    setIsModalVisible(true);
  };

  // Assign Tyre to Wheel
  const handleAssignTyre = () => {
    if (!selectedTyreId) return alert("Please select a tyre.");
    if (assignedTyres.some((tyre) => tyre.position === selectedWheelId)) {
      return alert("A tyre is already assigned to this position.");
    }

    setAssignedTyres([
      ...assignedTyres,
      { position: selectedWheelId, tyreId: selectedTyreId },
    ]);
    console.log("assignedTyres",assignedTyres);
    
    setTyreInventory(tyreInventory.filter((t) => t.id !== selectedTyreId)); // Remove tyre from inventory
    setIsModalVisible(false);
    setSelectedTyreId("");
  };
  // assign zal asel tr image yeil
  const tyreImagePath = "/tyre1.png";
  const isTyreAssigned = (position) => {
    return assignedTyres.some((tyre) => tyre.position === position);
  };

  // Detach Tyre from Wheel
  const handleDetachTyre = (position) => {
    const tyreToDetach = assignedTyres.find(
      (tyre) => tyre.position === position
    );
    if (tyreToDetach) {
      // Remove tyre from assigned list and add it back to inventory
      setAssignedTyres(
        assignedTyres.filter((tyre) => tyre.position !== position)
      );
    }
  };
  const generateLabel = (id) => {
    // Split the id into parts using "-"
    const parts = id.split("-");

    if (parts.length === 3) {
      const [side, position, number] = parts;

      // Generate the label based on the id components
      const sideAbbr = side === "left" ? "L" : "R"; // Left -> L, Right -> R
      const positionAbbr = position === "inner" ? "I" : "O"; // Inner -> I, Outer -> O

      // Return the formatted label (e.g., LI1, RO1)
      return `${sideAbbr}${positionAbbr}${number}`;
    }
    return id; // Fallback if format doesn't match
  };

  return (
    <>
    <div style={{display:'flex', justifyContent:'center'}}>
      <div style={{ display: "flex", justifyContent: "center", backgroundColor:'white', paddingLeft:'1rem' , paddingRight:'1rem'}}>
        <div className="vertical-text"
        style={{
            writingMode: "vertical-rl", /* Text flows from bottom to top */
    transform: "rotate(180deg)",/* Flip the text to make it readable */
    color:"green",
    textAlign: "center",
    fontSize: "larger",
    fontWeight: "bold",
        }}
        >FRONT</div>
{category===("truck" || "bus") ?(
        <div style={{ margin: "20px" }}>
          {/* Right Wheels Section */}
          <div
            style={{
              display: "flex",
              paddingLeft: "30px",
              paddingRight: "30px",
            }}
            className="right-wheels"
          >
            <div style={{ display: "flex" }}>
              <div className="oneWheel" style={{ alignSelf: "end" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "6rem",
                  }}
                >
                  <div
                    id="right-inner-1"
                    onClick={() => handleWheelClick("right-inner-1")}
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      border: "1px dashed black",
                    }}
                  >
                    {isTyreAssigned("right-inner-1") ? (
                      <img
                        src={tyreImagePath}
                        alt="Tyre"
                        style={{ width: "100%", height: "100%", borderRadius:'50%' }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="label-container" style={{paddingLeft:'2px'}}>
                    {generateLabel("right-inner-1")}
                  </div>
                </div>
              </div>
              <div className="twowheeltogether">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "6rem",
                  }}
                >
                  <div
                    id="right-outer-2"
                    onClick={() => handleWheelClick("right-outer-2")}
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      border: "1px dashed black",
                      paddingLeft: "",
                    }}
                  >
                    {isTyreAssigned("right-outer-2") ? (
                      <img
                        src={tyreImagePath}
                        alt="Tyre"
                        style={{ width: "100%", height: "100%",borderRadius:'50%' }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="label-container" style={{paddingLeft:'2px'}}>
                    {generateLabel("right-outer-2")}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "6rem",
                  }}
                >
                  <div
                    id="right-inner-2"
                    onClick={() => handleWheelClick("right-inner-2")}
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      border: "1px dashed black",
                    }}
                  >
                    {isTyreAssigned("right-inner-2") ? (
                      <img
                        src={tyreImagePath}
                        alt="Tyre"
                        style={{ width: "100%", height: "100%", borderRadius:'50%' }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="label-container" style={{paddingLeft:'2px'}}>
                    {generateLabel("right-inner-2")}
                  </div>
                </div>
              </div>
              {/* Dynamically add grouped right wheels */}
              {rightWheels.map((_, index) => (
                <div className="twowheeltogether">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "6rem",
                    }}
                  >
                    <div
                      id={`right-outer-${index + 3}`}
                      onClick={() =>
                        handleWheelClick(`right-outer-${index + 3}`)
                      }
                      style={{
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        border: "1px dashed black",
                      }}
                    >
                      {isTyreAssigned(`right-outer-${index + 3}`) ? (
                        <img
                          src={tyreImagePath}
                          alt="Tyre"
                          style={{ width: "100%", height: "100%", borderRadius:'50%' }}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="label-container" style={{paddingLeft:'2px'}}>
                      {generateLabel(`right-outer-${index + 3}`)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "6rem",
                    }}
                  >
                    <div
                      id={`right-inner-${index + 3}`}
                      onClick={() =>
                        handleWheelClick(`right-inner-${index + 3}`)
                      }
                      style={{
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        border: "1px dashed black",
                      }}
                    >
                      {isTyreAssigned(`right-inner-${index + 3}`) ? (
                        <img
                          src={tyreImagePath}
                          alt="Tyre"
                          style={{ width: "100%", height: "100%", borderRadius:'50%' }}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="label-container" style={{paddingLeft:'2px'}}>
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
              textAlign: "center",
              margin: "10px 0",
              background: "green",
              border: "5px solid green",
            }}
          ></div>

          {/* Left Wheels Section */}
          <div
            style={{
              display: "flex",
              paddingLeft: "30px",
              paddingRight: "30px",
            }}
            className="left-wheels"
          >
            <div style={{ display: "flex" }}>
              <div className="oneWheel">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "6rem",
                  }}
                >
                  <div
                    id="left-inner-1"
                    onClick={() => handleWheelClick("left-inner-1")}
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      border: "1px dashed black",
                    }}
                  >
                    {isTyreAssigned("left-inner-1") ? (
                      <img
                        src={tyreImagePath}
                        alt="Tyre"
                        style={{ width: "100%", height: "100%", borderRadius:'50%' }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="label-container" style={{paddingLeft:'2px'}}>
                    {generateLabel("left-inner-1")}
                  </div>
                </div>
              </div>
              <div className="twowheeltogether">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "6rem",
                  }}
                >
                  <div
                    id="left-inner-2"
                    onClick={() => handleWheelClick("left-inner-2")}
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      border: "1px dashed black",
                    }}
                  >
                    {isTyreAssigned("left-inner-2") ? (
                      <img
                        src={tyreImagePath}
                        alt="Tyre"
                        style={{ width: "100%", height: "100%", borderRadius:'50%' }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="label-container" style={{paddingLeft:'2px'}}>
                    {generateLabel("left-inner-2")}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "6rem",
                  }}
                >
                  <div
                    id="left-outer-2"
                    onClick={() => handleWheelClick("left-outer-2")}
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      border: "1px dashed black",
                    }}
                  >
                    {isTyreAssigned("left-outer-2") ? (
                      <img
                        src={tyreImagePath}
                        alt="Tyre"
                        style={{ width: "100%", height: "100%", borderRadius:'50%' }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="label-container" style={{paddingLeft:'2px'}}>
                    {generateLabel("left-outer-2")}
                  </div>
                </div>
              </div>
              {/* Dynamically add grouped left wheels */}
              {leftWheels.map((_, index) => (
                <div className="twowheeltogether">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "6rem",
                    }}
                  >
                    <div
                      id={`left-inner-${index + 3}`}
                      onClick={() =>
                        handleWheelClick(`left-inner-${index + 3}`)
                      }
                      style={{
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        border: "1px dashed black",
                      }}
                    >
                      {isTyreAssigned(`left-inner-${index + 3}`) ? (
                        <img
                          src={tyreImagePath}
                          alt="Tyre"
                          style={{ width: "100%", height: "100%", borderRadius:'50%' }}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="label-container" style={{paddingLeft:'2px'}}>
                      {generateLabel(`left-inner-${index + 3}`)}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "6rem",
                    }}
                  >
                    <div
                      id={`left-outer-${index + 3}`}
                      onClick={() =>
                        handleWheelClick(`left-outer-${index + 3}`)
                      }
                      style={{
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        border: "1px dashed black",
                      }}
                    >
                      {isTyreAssigned(`left-outer-${index + 3}`) ? (
                        <img
                          src={tyreImagePath}
                          alt="Tyre"
                          style={{ width: "100%", height: "100%", borderRadius:'50%' }}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="label-container" style={{paddingLeft:'2px'}}>
                      {generateLabel(`left-outer-${index + 3}`)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
)
        :(
        <div style={{ margin: "20px" }}>
          {/* Right Wheels Section */}
          <div
            style={{
              display: "flex",
              paddingLeft: "30px",
              // paddingRight: "30px",
            }}
            className="right-wheels"
          >
            <div style={{ display: "flex" }}>
              <div className="oneWheel" style={{ alignSelf: "end" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "6rem",
                  }}
                >
                  <div
                    id="right-inner-1"
                    onClick={() => handleWheelClick("right-inner-1")}
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      border: "1px dashed black",
                    }}
                  >
                    {isTyreAssigned("right-inner-1") ? (
                      <img
                        src={tyreImagePath}
                        alt="Tyre"
                        style={{ width: "100%", height: "100%", borderRadius:'50%' }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="label-container" style={{paddingLeft:'2px'}}>
                    {generateLabel("right-inner-1")}
                  </div>
                </div>
              </div>
              <div className="oneWheel" style={{ alignSelf: "end" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "6rem",
                  }}
                >
                  <div
                    id="right-inner-2"
                    onClick={() => handleWheelClick("right-inner-2")}
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      border: "1px dashed black",
                    }}
                  >
                    {isTyreAssigned("right-inner-2") ? (
                      <img
                        src={tyreImagePath}
                        alt="Tyre"
                        style={{ width: "100%", height: "100%", borderRadius:'50%' }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="label-container" style={{paddingLeft:'2px'}}>
                    {generateLabel("right-inner-2")}
                  </div>
                </div>
              </div>
              
            
            </div>
          </div>

          {/* Seperator */}
          <div
            style={{
              textAlign: "center",
              margin: "10px 0",
              background: "green",
              border: "5px solid green",
            }}
          ></div>

          {/* Left Wheels Section */}
          <div
            style={{
              display: "flex",
              paddingLeft: "30px",
              // paddingRight: "30px",
            }}
            className="left-wheels"
          >
            <div style={{ display: "flex" }}>
              <div className="oneWheel">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "6rem",
                  }}
                >
                  <div
                    id="left-inner-1"
                    onClick={() => handleWheelClick("left-inner-1")}
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      border: "1px dashed black",
                    }}
                  >
                    {isTyreAssigned("left-inner-1") ? (
                      <img
                        src={tyreImagePath}
                        alt="Tyre"
                        style={{ width: "100%", height: "100%", borderRadius:'50%' }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="label-container" style={{paddingLeft:'2px'}}>
                    {generateLabel("left-inner-1")}
                  </div>
                </div>
              </div>
              <div className="oneWheel">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "6rem",
                  }}
                >
                  <div
                    id="left-inner-2"
                    onClick={() => handleWheelClick("left-inner-2")}
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      border: "1px dashed black",
                    }}
                  >
                    {isTyreAssigned("left-inner-2") ? (
                      <img
                        src={tyreImagePath}
                        alt="Tyre"
                        style={{ width: "100%", height: "100%", borderRadius:'50%' }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="label-container" style={{paddingLeft:'2px'}}>
                    {generateLabel("left-inner-2")}
                  </div>
                </div>
              </div>
             
              
            </div>
          </div>
        </div>)}
        <div className="vertical-text"
        style={{
            writingMode: "vertical-rl", /* Text flows from bottom to top */
    transform: "rotate(180deg)",/* Flip the text to make it readable */
    color:"green",
    textAlign: "center",
    fontSize: "larger",
    fontWeight: "bold",
        }}
        >REAR</div>
      </div>

      {category===("truck" || "bus")? 
            <div style={{display:'flex', flexDirection:'column', justifyContent:'center', gap:'0.2rem', backgroundColor:'white', paddingLeft:'1rem',paddingRight:'1rem', fontSize:'14px'}} >
       

            <CButton color="success"  onClick={addRightWheels}  style={{ fontSize: "small", fontWeight: "700", color: "white", padding: "4px"}}
            >
              ADD
            </CButton>
            <CButton
              color="danger"
              style={{marginBottom:'2rem', fontSize: "small", fontWeight: "700", color: "white", padding: "4px"}}
              onClick={removeLastRightWheel}
            >
              REMOVE
            </CButton>
            <CButton
              color="success"
              style={{ fontSize: "small", fontWeight: "700", color: "white", padding: "4px"}}
              onClick={addLeftWheels}
            >
              ADD
            </CButton>
    
            <CButton
             color="danger"
             style={{ fontSize: "small", fontWeight: "700", color: "white", padding: "4px"}}
    
              onClick={removeLastLeftWheel}
            >
              REMOVE
            </CButton>
          </div>
      : 
      ""}



    </div>



      {/* Modal for Assign Tyre */}
      <CModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} alignment="center">
        <CModalHeader>Assign Tyre</CModalHeader>
        <CModalBody>
          <p>
            Assign tyre to: <strong>{selectedWheelId}</strong>
          </p>
          <CFormSelect
            value={selectedTyreId}
            onChange={(e) => setSelectedTyreId(e.target.value)}
          >
            <option value="">Select Tyre</option>
            {tyreInventory.map((tyre) => (
              <option key={tyre.id} value={tyre.id}>
                {tyre.brand}-{tyre.SrNo}-{tyre.size}
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


      <CRow style={{marginTop:"1rem"}}>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Assigned Tyres</strong>
              
            </CCardHeader>
            <CCardBody>
              {assignedTyres.length === 0 ? (
                <p className="text-center">No Tyres available.</p>
              ) : (
                <CTable striped hover responsive bordered>
                  <CTableHead>
                    <CTableRow className='text-nowrap'>
                      <CTableHeaderCell className="text-center" scope="col">
                        SN
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" scope="col">
                        Position
                      </CTableHeaderCell>
                     
                      {columns.map((column, index) => (
              <CTableHeaderCell  key={index} className="text-center" scope="col">
                {column.label}
              </CTableHeaderCell>
            ))}
            <CTableHeaderCell className="text-center" scope="col">
           Actions
            </CTableHeaderCell>

                      
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                   
   

{assignedTyres.map((assigned, index) => {
              const tyreDetails = tyreInventory.find(
                (tyre) => tyre.id == assigned.tyreId
              ) || {
                SrNo: "Unknown",
                brand: "Unknown",
                pressure: "-",
                status: "-",
              };
              return(
                <CTableRow key={index} className="text-center">
                    <CTableDataCell scope="row">{index + 1}</CTableDataCell>
                    <CTableDataCell>{assigned.position}</CTableDataCell>
                    {
                        columns.map((column,index)=>
                            <CTableDataCell>{tyreDetails[column.key]}</CTableDataCell>
                    )
                    }
                    <CTableDataCell>
                    <CButton
                      color="danger"
                      size="sm"
                      style={{ fontSize: "small", fontWeight: "700", color: "white", padding: "4px"}}

                      onClick={() => handleDetachTyre(assigned.position)}
                    >
                      Detach
                    </CButton>
                    </CTableDataCell>
                </CTableRow>
            )
        })}
        
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>


    </>
  );
}

export default DetailedPage;
