import React from 'react'

const InpectionCards = ({ pass, fail, total, vehicleName }) => {
  const passPercent = ((pass / total) * 100).toFixed(1)
  const failPercent = ((fail / total) * 100).toFixed(1)

  return (
    <div className="row g-4">
      {/* Passed */}
      <div className="col-md-4">
        <div
          className="p-4 rounded-4 border shadow-sm"
          style={{ backgroundColor: '#e8fdf2', borderColor: '#b8f0d5' }}
        >
          <h2 className="text-success fw-bold mb-2">{pass}</h2>
          <p className="text-success fw-semibold mb-1">Items Passed in Inspection</p>
          <small className="fw-medium">{vehicleName}</small>
          <div className="mt-2">
            <small className="text-success">{passPercent}% of total</small>
          </div>
        </div>
      </div>

      {/* Failed */}
      <div className="col-md-4">
        <div
          className="p-4 rounded-4 border shadow-sm"
          style={{ backgroundColor: '#fff0f0', borderColor: '#f2c2c2' }}
        >
          <h2 className="text-danger fw-bold mb-2">{fail}</h2>
          <p className="text-danger fw-semibold mb-1">Items Failed in Inspection</p>
          <small className="fw-medium">{vehicleName}</small>
          <div className="mt-2">
            <small className="text-danger">{failPercent}% of total</small>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="col-md-4">
        <div
          className="p-4 rounded-4 border shadow-sm"
          style={{ backgroundColor: '#f9fbfd', borderColor: '#d6dee4' }}
        >
          <h2 className="text-dark fw-bold mb-2">{total}</h2>
          <p className="text-dark fw-semibold mb-1">Total Inspection Items</p>
          <small className="fw-medium">{vehicleName}</small>
          <div className="mt-2">
            <small className="text-muted">Complete inspection</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InpectionCards
