import React from 'react'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'
import './billshow.css'

const BillShow = ({ showModal, setShowModal, pdfBase64, modalTitle }) => {
  // Function to check if the base64 is an image
  const isImage = (base64) => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']
    return imageTypes.some((type) => base64?.startsWith(`data:${type}`))
  }

  // Function to check if the base64 is a PDF
  const isPDF = (base64) => {
    return base64?.startsWith('data:application/pdf')
  }

  return (
    <CModal
      visible={showModal}
      onClose={() => setShowModal(false)}
      size="lg"
      className="custom-modal"
    >
      <CModalHeader>
        <CModalTitle>{modalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody className="custom-modal-body">
        {pdfBase64 ? (
          <>
            {isPDF(pdfBase64) ? (
              <iframe
                title="Bill PDF"
                src={pdfBase64}
                style={{
                  width: '100%',
                  height: '500px',
                  border: 'none',
                }}
              />
            ) : isImage(pdfBase64) ? (
              <img
                src={pdfBase64}
                alt="Bill"
                style={{
                  width: '100%',
                  height: 'auto',
                  border: 'none',
                }}
              />
            ) : (
              <p>Unsupported file format.</p>
            )}
          </>
        ) : (
          <p>No bill available.</p>
        )}
      </CModalBody>
      <CModalFooter className="d-flex justify-content-between w-100">
        {pdfBase64 && (
          <a
            href={pdfBase64}
            download="driver_bill"
            className="btn btn-sm btn-success mb-3"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Bill
          </a>
        )}
        <CButton color="secondary" onClick={() => setShowModal(false)}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default BillShow
