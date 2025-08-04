import React from 'react'
import PropTypes from 'prop-types'
import { IdCard, Mail, Phone } from 'lucide-react'
import { ToastContainer } from 'react-toastify'

function Profile({ filterData }) {
  const isAvailable = Boolean(filterData?.currentVehicleName)
  const badgeText = isAvailable ? 'Unavailable' : 'Available'

  return (
    <>
      <ToastContainer />

      <div className="d-flex flex-column flex-md-row shadow rounded p-3 gap-3">
        {/* Left Section - Image, Badge, and Name */}
        <div
          className="d-flex flex-column gap-3 justify-content-center align-items-center rounded"
          style={{
            backgroundColor: '#f3f3f3',
            width: '100%',
            maxWidth: '400px',
            padding: '1rem',
          }}
        >
          {/* Profile Image Container with Badge */}
          <div className="position-relative" style={{ width: '120px', height: '120px' }}>
            {/* Badge above image */}
            <span
              className={`badge position-absolute top-50 start-50 rounded-pill px-3 py-2 ${
                isAvailable ? 'bg-danger' : 'bg-success'
              } text-white`}
              style={{
                zIndex: 10,
                transform: 'translate(20%, 20%)', // move right and down
              }}
            >
              {badgeText}
            </span>

            {/* Profile Image */}
            <div
              className="rounded-circle border border-white border-5 shadow"
              style={{ width: '100%', height: '100%', overflow: 'hidden' }}
            >
              <img
                src={
                  filterData?.profileImage?.base64Data ||
                  `https://api.dicebear.com/9.x/shapes/svg?seed=${filterData?.name}`
                }
                alt="Driver Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>

          {/* Name */}
          <div className="text-center">
            <h5 className="mb-0 fw-bold">{filterData?.name}</h5>
            <small className="text-muted fw-semibold">Professional Driver</small>
          </div>
        </div>

        {/* Right Section - Info */}
        <div className="flex-grow-1 pt-3">
          <h6 className="fw-bold mb-3">Driver Information</h6>

          <div className="row g-3">
            {/* License Number */}
            <div className="col-12 col-md-6 d-flex align-items-start gap-3">
              <div
                className="p-2 d-flex align-items-center justify-content-center rounded"
                style={{ backgroundColor: 'rgba(13,110,253,0.1)' }}
              >
                <IdCard className="text-primary" />
              </div>
              <div>
                <div className="text-muted small fw-medium">License Number</div>
                <div className="fw-medium">{filterData?.licenseNumber}</div>
              </div>
            </div>

            {/* Aadhar Number */}
            <div className="col-12 col-md-6 d-flex align-items-start gap-3">
              <div
                className="p-2 d-flex align-items-center justify-content-center rounded"
                style={{ backgroundColor: 'rgba(13,110,253,0.1)' }}
              >
                <IdCard className="text-primary" />
              </div>
              <div>
                <div className="text-muted small fw-medium">Aadhar Number</div>
                <div className="fw-medium">{filterData?.aadharNumber}</div>
              </div>
            </div>

            {/* Email */}
            <div className="col-12 col-md-6 d-flex align-items-start gap-3">
              <div
                className="p-2 d-flex align-items-center justify-content-center rounded"
                style={{ backgroundColor: 'rgba(13,110,253,0.1)' }}
              >
                <Mail className="text-primary" />
              </div>
              <div>
                <div className="text-muted small fw-medium">Email</div>
                <div className="fw-medium">{filterData?.email}</div>
              </div>
            </div>

            {/* Contact Number */}
            <div className="col-12 col-md-6 d-flex align-items-start gap-3">
              <div
                className="p-2 d-flex align-items-center justify-content-center rounded"
                style={{ backgroundColor: 'rgba(13,110,253,0.1)' }}
              >
                <Phone className="text-primary" />
              </div>
              <div>
                <div className="text-muted small fw-medium">Contact Number</div>
                <div className="fw-medium">{filterData?.contactNumber}</div>
              </div>
            </div>
          </div>

          {/* Created Date anad vehicle name */}
          <hr />
          <div className="d-flex justify-content-end flex-column flex-md-row justify-content-md-between">
            <small>
              <b> Current Vehicle: {filterData?.currentVehicleName || 'N/A'} </b>
            </small>

            <small className="text-muted">
              ID Created on{' '}
              {filterData?.createdAt
                ? new Date(filterData.createdAt).toLocaleDateString('en-GB')
                : 'N/A'}
            </small>
          </div>
        </div>
      </div>
    </>
  )
}

Profile.propTypes = {
  filterData: PropTypes.object,
}

export default Profile
