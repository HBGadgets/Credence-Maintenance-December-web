import React from 'react'

const HeaderInpection = ({ inspection }) => {
  const {
    driverName,
    vehicleName,
    category,
    startLocation,
    endLocation,
    inpectionPass,
    inpectionFail,
    status,
    items = {},
  } = inspection

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">🧾 Inspection Details</h2>
        <p className="text-muted">
          Detailed inspection report for <strong>{driverName}</strong>
        </p>
      </div>

      <div className="cardmont shadow-sm border border-secondary border-1 rounded-4">
        <div className="cardmont-body p-4">
          <h5 className="fw-semibold mb-2">🔍 Inspection Overview</h5>
          <p className="text-muted mb-3">Basic information about this inspection record.</p>

          <div className="row gy-4">
            <div className="col-md-3">
              <div className="bg-light p-3 rounded-3 shadow-sm h-100">
                <h6 className="text-uppercase text-muted small">Driver</h6>
                <div className="fw-medium">{driverName}</div>
                <small className="text-muted">Professional Driver</small>
              </div>
            </div>

            <div className="col-md-3">
              <div className="bg-light p-3 rounded-3 shadow-sm h-100">
                <h6 className="text-uppercase text-muted small">Vehicle</h6>
                <div className="fw-medium">{vehicleName}</div>
                <small className="text-muted">{category}</small>
              </div>
            </div>

            <div className="col-md-3">
              <div className="bg-light p-3 rounded-3 shadow-sm h-100">
                <h6 className="text-uppercase text-muted small">Trip Route</h6>
                <div className="fw-medium">
                  {startLocation && endLocation ? `${startLocation} → ${endLocation}` : 'N/A'}
                </div>
                <span
                  className={`badge rounded-pill mt-2 bg-${status === 'in-progress' ? 'warning' : 'secondary'}`}
                >
                  {status}
                </span>
              </div>
            </div>

            <div className="col-md-3">
              <div className="bg-light p-3 rounded-3 shadow-sm h-100">
                <h6 className="text-uppercase text-muted small">Inspection Summary</h6>
                <div className="mb-1">
                  ✅ <strong>{inpectionPass}</strong> Pass Inspection <br />❌{' '}
                  <strong>{inpectionFail}</strong> Fail Inspection
                </div>
                <small className="text-muted">Total Inspections: {Object.keys(items).length}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderInpection
