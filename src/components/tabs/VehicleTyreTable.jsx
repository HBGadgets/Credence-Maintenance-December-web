import React, { useState, useEffect } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
function VehicleTyreTable({vehicle}) {
      const Navigate= useNavigate();
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
      ]);

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

      const assignedTyres=[
        {position: 'left-inner-1', tyreId: '1'},
        {position: 'left-outer-1', tyreId: '2'},
        {position: 'right-inner-2', tyreId: '3'},
        {position: 'right-outer-2', tyreId: '4'}
    ]


    const handleViewClick=()=>{
        // <Link to={`/vehicle-details?category=${vehicle.category}`}>View More</Link>
Navigate(`/vehicle-details?category=${vehicle.category}`)
    }
  return (
    <>
    <CRow >
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
                        
                    </CTableRow>
                )
            })}


            
                      </CTableBody>
                    </CTable>
                  )}
                  <div className="d-flex justify-content-end">
                    
                <button className="btn btn-secondary" type="button" onClick={()=>handleViewClick()} >
                  View More
                </button>
              </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          
    </>
  )
}

export default VehicleTyreTable