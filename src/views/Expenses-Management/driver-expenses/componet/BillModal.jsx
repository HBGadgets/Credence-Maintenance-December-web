import React from 'react'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'
import './bill.css'

const BillModal = ({ showModal, setShowModal, pdfBase64, modalTitle }) => {
  return (
    <CModal
      visible={showModal}
      onClose={() => setShowModal(false)}
      size="lg" // Large size for the modal
      className="custom-modal" // Custom class for further styling if needed
    >
      <CModalHeader>
        <CModalTitle>{modalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody className="custom-modal-body">
        {pdfBase64 ? (
          <>
            {modalTitle.includes('PDF') ? (
              // Render PDF in iframe with proper height
              <iframe
                title="Bill PDF"
                src={pdfBase64}
                style={{
                  width: '100%',
                  height: '500px', // Adjusted height
                  border: 'none',
                }}
              />
            ) : (
              // Render Image with automatic scaling
              <img
                src={pdfBase64}
                alt="Bill"
                style={{
                  width: '100%',
                  height: 'auto',
                  border: 'none',
                }}
              />
            )}
          </>
        ) : (
          <p>No bill available.</p>
        )}
      </CModalBody>
      <CModalFooter className="d-flex justify-content-between w-100">
        <a
          href={pdfBase64}
          download="driver_bill"
          className="btn btn-sm btn-success mb-3"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Bill
        </a>
        <CButton color="secondary" onClick={() => setShowModal(false)}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default BillModal
