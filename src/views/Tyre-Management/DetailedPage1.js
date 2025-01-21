import React, { useState } from 'react'
import './TyreAssignment.css'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react'

const TyreManagement = () => {
  const initialTyrePositions = {
    right_outer_1: null,
    right_outer_2: null,
    right_outer_3: null,
    right_outer_4: null,
    right_outer_5: null,
    right_outer_6: null,
    right_inner_1: null,
    right_inner_2: null,
    right_inner_3: null,
    right_inner_4: null,
    right_inner_5: null,
    right_inner_6: null,
    left_inner_1: null,
    left_inner_2: null,
    left_inner_3: null,
    left_inner_4: null,
    left_inner_5: null,
    left_inner_6: null,
    left_outer_1: null,
    left_outer_2: null,
    left_outer_3: null,
    left_outer_4: null,
    left_outer_5: null,
    left_outer_6: null,
  }

  const [tyrePositions, setTyrePositions] = useState(initialTyrePositions)
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [selectedTyre, setSelectedTyre] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const tyreInventory = [
    {
      id: 1,
      SrNo: 'Tyre A',
      brand: 'Brand A',
      status: 'New',
      pressure: '32 psi',
      installationDate: '2024-01-01',
      buyingDate: '2024-01-01',
      treadDepth: '8mm',
      pattern: 'Radial',
    },
    {
      id: 2,
      SrNo: 'Tyre B',
      brand: 'Brand B',
      status: 'In Use',
      pressure: '30 psi',
      installationDate: '2023-12-15',
      buyingDate: '2023-12-10',
      treadDepth: '6mm',
      pattern: 'Bias Ply',
    },
    {
      id: 3,
      SrNo: 'Tyre C',
      brand: 'Brand B',
      status: 'In Use',
      pressure: '30 psi',
      installationDate: '2023-12-15',
      buyingDate: '2023-12-10',
      treadDepth: '6mm',
      pattern: 'Bias Ply',
    },
    {
      id: 4,
      SrNo: 'Tyre D',
      brand: 'Brand B',
      status: 'In Use',
      pressure: '30 psi',
      installationDate: '2023-12-15',
      buyingDate: '2023-12-10',
      treadDepth: '6mm',
      pattern: 'Bias Ply',
    },
    {
      id: 5,
      SrNo: 'Tyre E',
      brand: 'Brand B',
      status: 'In Use',
      pressure: '30 psi',
      installationDate: '2023-12-15',
      buyingDate: '2023-12-10',
      treadDepth: '6mm',
      pattern: 'Bias Ply',
    },
    {
      id: 6,
      SrNo: 'Tyre F',
      brand: 'Brand B',
      status: 'In Use',
      pressure: '30 psi',
      installationDate: '2023-12-15',
      buyingDate: '2023-12-10',
      treadDepth: '6mm',
      pattern: 'Bias Ply',
    },
    {
      id: 7,
      SrNo: 'Tyre G',
      brand: 'Brand B',
      status: 'In Use',
      pressure: '30 psi',
      installationDate: '2023-12-15',
      buyingDate: '2023-12-10',
      treadDepth: '6mm',
      pattern: 'Bias Ply',
    },
    // Add more tyres as necessary
  ]

  const handleAssignTyre = (position) => {
    setSelectedPosition(position)
    setShowForm(true)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (selectedTyre) {
      setTyrePositions({
        ...tyrePositions,
        [selectedPosition]: { ...selectedTyre, image: '/tyre1.png' },
      })
      setShowForm(false)
      setSelectedTyre(null)
    }
  }

  const getShortLabel = (position) => {
    const parts = position.split('_')
    const side = parts[0] === 'right' ? 'R' : 'L'
    const positionType = parts[1][0].toUpperCase() // 'O' for outer or 'I' for inner
    return `${side}${positionType}${parts[2]}`
  }

  const handleDetachTyre = (position) => {
    if (window.confirm(`Detach tyre from ${position}?`)) {
      setTyrePositions({ ...tyrePositions, [position]: null })
    }
  }

  const assignedTyres = Object.entries(tyrePositions).filter(([, value]) => value !== null)
  console.log("assigned tyres",assignedTyres)
  console.log("tyrepositions",tyrePositions);
  

  const TyreRow = ({ startIndex, endIndex }) => {
    const positions = Object.keys(tyrePositions).slice(startIndex, endIndex)
    return (
      <div className="tyre-row">
        {positions.map((position) => (
          <div
            key={position}
            className="tyre-wrapper"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <div
              className={`tyre-box ${tyrePositions[position] ? 'filled' : 'empty'}`}
              onClick={() =>
                tyrePositions[position] ? handleDetachTyre(position) : handleAssignTyre(position)
              }
              style={{ borderRadius: '50%' }}
            >
              {tyrePositions[position] ? (
                <>
                  <img
                    src={tyrePositions[position].image}
                    alt="Assigned Tyre"
                    className="tyre-image"
                    style={{ borderRadius: '50%' }}
                  />
                </>
              ) : null}
            </div>
            <div style={{ textAlign: 'left', paddingLeft: '5px' }}>
              <div className="label-container">{getShortLabel(position)}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="tyre-management-container">
      <div className="tyre-layout" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="vertical-text">FRONT</div>
        <div>
          <TyreRow startIndex={0} endIndex={6} />
          <TyreRow startIndex={6} endIndex={12} />
          <div className="separator" />
          <TyreRow startIndex={12} endIndex={18} />
          <TyreRow startIndex={18} endIndex={24} />
        </div>
        <div className="vertical-text">REAR</div>
      </div>

      <CModal visible={showForm} onClose={() => setShowForm(false)} alignment="center">
        <CModalHeader>
          <h5>Assign Tyre</h5>
        </CModalHeader>
        <CModalBody>
          <form id="tyreForm" onSubmit={handleFormSubmit}>
            <label htmlFor="tyreSelect">Select Tyre:</label>
            <select
              id="tyreSelect"
              value={selectedTyre?.id || ''}
              onChange={(e) =>
                setSelectedTyre(tyreInventory.find((tyre) => tyre.id === +e.target.value))
              }
              required
            >
              <option value="">-- Select a Tyre --</option>
              {tyreInventory.map((tyre) => (
                <option key={tyre.id} value={tyre.id}>
                  {tyre.SrNo} - {tyre.brand} - {tyre.status} - {tyre.treadDepth}
                </option>
              ))}
            </select>
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" type="submit" form="tyreForm">
            Assign Tyre
          </CButton>
          <CButton color="secondary" onClick={() => setShowForm(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      <CRow style={{ marginTop: '5rem' }}>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Assigned Tyres</strong>
            </CCardHeader>
            <CCardBody>
              <CTable bordered hover responsive striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Position</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Tyre Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Installation Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Buying Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Pressure</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Brand</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Tread Depth</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Pattern</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {assignedTyres.map(([position, tyre]) => (
                    <CTableRow key={position}>
                      <CTableDataCell>{position.replace(/_/g, ' ').toUpperCase()}</CTableDataCell>
                      <CTableDataCell>{tyre.SrNo}</CTableDataCell>
                      <CTableDataCell>{tyre.status}</CTableDataCell>
                      <CTableDataCell>{tyre.installationDate}</CTableDataCell>
                      <CTableDataCell>{tyre.buyingDate}</CTableDataCell>
                      <CTableDataCell>{tyre.pressure}</CTableDataCell>
                      <CTableDataCell>{tyre.brand}</CTableDataCell>
                      <CTableDataCell>{tyre.treadDepth}</CTableDataCell>
                      <CTableDataCell>{tyre.pattern}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default TyreManagement
