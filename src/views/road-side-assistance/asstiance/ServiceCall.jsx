import React from 'react'

const ServiceCall = () => {
  return (
    <div className="d-flex justify-content-center align-items-center ">
      <div
        className="card shadow-lg p-4 border-0"
        style={{ maxWidth: '500px', animation: 'fadeIn 1.2s ease-in-out' }}
      >
        <div className="card-body text-center">
          <i
            className="bi bi-exclamation-triangle-fill text-warning"
            style={{ fontSize: '3rem' }}
          ></i>
          <h1 className="card-title mt-3 mb-2 text-dark fw-bold">Coming Soon</h1>
          <h5 className="text-muted mb-3">Roadside Assistance</h5>
          <p className="card-text text-secondary">
            We’re gearing up to bring you reliable roadside help — fast, safe, and always ready.
          </p>
          <button className="btn btn-warning mt-3" disabled>
            Launching Soon
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServiceCall
