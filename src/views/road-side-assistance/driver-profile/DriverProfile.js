/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'

import PropTypes from 'prop-types'
import { UserRound } from 'lucide-react'

const DriverProfile = ({ driverId }) => {
  return (
    <>
      <div
        className="d-flex gap-5 justify-content-center align-items-center rounded"
        style={{ width: 'full', height: '500px' }}
      >
        <div className="d-flex flex-column  gap-2">
          <img
            src="https://www.svgrepo.com/show/311063/person.svg"
            style={{ width: '200px' }}
            className="rounded"
          />
          <img
            src="https://sm.mashable.com/t/mashable_in/photo/default/driving-licence-home-delivery-1_56n1.1248.jpg"
            style={{ width: '200px' }}
            className="rounded"
          />
        </div>
        <div className="d-flex flex-column">
          <h3>Deriver Name</h3>
          <div className="d-flex align-items-center">
            <UserRound size={20} /> <span>{driverId}</span>
          </div>
          <CRow className="d-flex justify-content-center mt-4">
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardBody>
                  <CTable>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col"></CTableHeaderCell>
                        <CTableHeaderCell scope="col"></CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell className="text-center">Date of Birth</CTableDataCell>
                        <CTableDataCell className="text-center">12 December, 1980</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="text-center">Aadhaar ID</CTableDataCell>
                        <CTableDataCell className="text-center">01125532553</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="text-center">Phone Number</CTableDataCell>
                        <CTableDataCell className="text-center">+91 0123456789</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="text-center">Email Address</CTableDataCell>
                        <CTableDataCell className="text-center">
                          drivername@credence.com
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="text-center">Join Date</CTableDataCell>
                        <CTableDataCell className="text-center">06 December, 2023</CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </>
  )
}

DriverProfile.propTypes = {
  driverId: PropTypes.string.isRequired,
}

export default DriverProfile
