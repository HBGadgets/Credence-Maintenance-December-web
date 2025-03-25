/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { driverProfile } from '../../data/drivers'
import '../styles.css'
import { IdCard, Mail, Phone } from 'lucide-react'

function Profile({ filterData }) {
  const isAvailable = Boolean(filterData?.currentVehicleName)
  const badgeText = isAvailable ? 'Available' : 'Unavailable'

  return (
    <>
      <div className="d-flex shadow rounded">
        <div
          className="d-flex flex-column gap-3 justify-content-center align-items-center rounded-start"
          style={{ backgroundColor: '#f3f3f3', width: '400px', height: '250px' }}
        >
          <div className="rounded-circle border border-white border-5 d-inline-block shadow">
            <img
              className="profile-img"
              src={
                filterData?.profileImage?.base64Data ||
                `https://api.dicebear.com/9.x/shapes/svg?seed=${filterData?.name}`
              }
              alt="Driver Profile Image"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          </div>
          <div className="d-flex flex-column align-item-center justify-content-center">
            <div>
              <span style={{ fontSize: '21px' }}>
                <strong>{filterData?.name}</strong>
              </span>
            </div>
            <div>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ fontSize: '13px', color: '#71717a', fontWeight: '600' }}
              >
                Professional Driver
              </span>
            </div>
          </div>
        </div>
        {/* Badge */}
        <div>
          <span
            className={`position-relative btn text-white rounded-pill d-flex justify-content-center align-items-center badgeStyle ${
              isAvailable ? 'btn-success' : 'btn-danger'
            }`}
          >
            {badgeText}
          </span>
        </div>
        {/* Driver Information */}
        <div className="pt-3">
          <div>
            <span style={{ fontWeight: '700' }}>Driver Information</span>
          </div>
          <div className="row g-3 mt-2">
            <div className="col-12 col-md-6 d-flex align-items-center gap-3">
              <div className="px-2 py-1 rounded bg-primary bg-opacity-10 d-flex justify-content-center align-items-center">
                <i className="text-primary">
                  <IdCard />
                </i>
              </div>
              <div className="lh-md d-flex flex-column">
                <span className="text-muted small fw-medium">License Number</span>
                <span className="fw-medium">09876543</span>
              </div>
            </div>

            <div className="col-12 col-md-6 d-flex align-items-start gap-3">
              <div className="px-2 py-1 rounded bg-primary bg-opacity-10 d-flex justify-content-center align-items-center">
                <i className="text-primary">
                  <IdCard />
                </i>
              </div>
              <div className="lh-md d-flex flex-column">
                <span className="text-muted small fw-medium">Aadhar Number</span>
                <span className="fw-medium">123456789087</span>
              </div>
            </div>

            <div className="col-12 col-md-6 d-flex align-items-start gap-3">
              <div className="px-2 py-1 rounded bg-primary bg-opacity-10 d-flex justify-content-center align-items-center">
                <i className="text-primary">
                  <Mail />
                </i>
              </div>
              <div className="lh-md d-flex flex-column">
                <span className="text-muted small fw-medium">Email</span>
                <span className="fw-medium">piyush.doe@example.com</span>
              </div>
            </div>

            <div className="col-12 col-md-6 d-flex align-items-start gap-3">
              <div className="px-2 py-1 rounded bg-primary bg-opacity-10 d-flex justify-content-center align-items-center">
                <i className="text-primary">
                  <Phone />
                </i>
              </div>
              <div className="lh-md d-flex flex-column">
                <span className="text-muted small fw-medium">Contact Number</span>
                <span className="fw-medium">12345678990</span>
              </div>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-end">
            <span className="text-muted" style={{ fontSize: '13px' }}>
              {' '}
              ID Created on {new Date(filterData?.createdAt).toLocaleDateString('en-GB')}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

Profile.propTypes = {
  filterData: PropTypes.array,
}
export default Profile
