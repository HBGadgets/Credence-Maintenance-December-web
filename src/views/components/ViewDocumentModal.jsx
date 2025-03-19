// import React from 'react'
// import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import { cilCloudDownload, cilPencil, cilTrash } from '@coreui/icons'

// const ViewDocumentModal = ({ visible, onClose, document, onEdit, onDelete, onDownload }) => {
//   console.log('docxxxxxx', document)

//   // Function to format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A' // Handle missing dates
//     const date = new Date(dateString)
//     return new Intl.DateTimeFormat('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: '2-digit',
//     }).format(date)
//   }

//   return (
//     <CModal
//       visible={visible}
//       onClose={onClose}
//       size="xl"
//       style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//       // backdrop="static"
//       centered
//     >
//       <CModalHeader className="d-flex flex-column align-items-center">
//         {/* Centered Heading */}
//         <h5 className="mb-2 text-center">{document?.name || 'Document'}</h5>

//         {/* Date Details - Centered */}
//         <div className="d-flex gap-2 align-items-center">
//           <h5>Issue Date: {formatDate(document?.image?.issueDate)}</h5>
//           <h5>Expiry Date: {formatDate(document?.image?.expiryDate)}</h5>
//         </div>
//       </CModalHeader>

//       <div
//         style={{
//           width: '7rem',
//           borderRadius: '0.5rem',
//           padding: '0.25rem',
//           display: 'flex',
//           justifyContent: 'space-around',
//           alignItems: 'center',
//           margin: '0 auto',
//           marginTop: '10px',
//           border: '1px solid rgba(10, 10, 10, 0.21)',
//           boxShadow: '2px 2px 2px rgba(10, 10, 10, 0.2)',
//         }}
//       >
//         <CIcon
//           icon={cilCloudDownload}
//           size="lg"
//           className="text-success"
//           onClick={() => onDownload(document)}
//         />
//         <CIcon
//           icon={cilPencil}
//           size="lg"
//           className="text-warning"
//           onClick={() => onEdit(document)}
//         />
//         <CIcon
//           icon={cilTrash}
//           size="lg"
//           className="text-danger"
//           onClick={() => onDelete(document)}
//         />
//       </div>
//       <CModalBody className="text-center">
//         {document?.image ? (
//           <img src={document?.image.imageBase64} alt={document.file?.filename} width="100%" />
//         ) : (
//           <p>Unsupported file type</p>
//         )}
//       </CModalBody>
//       <CModalFooter>
//         <CButton color="secondary" onClick={onClose}>
//           Close
//         </CButton>
//       </CModalFooter>
//     </CModal>
//   )
// }

// export default ViewDocumentModal

import React from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilPencil, cilTrash } from '@coreui/icons'

const ViewDocumentModal = ({ visible, onClose, document, onEdit, onDelete, onDownload }) => {
  console.log('Document Data:', document)

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(date)
  }

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      size="xl"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      centered
    >
      {/* Header */}
      <CModalHeader className="d-flex flex-column align-items-center">
        <h4 className="mb-2 fw-bold">{document?.name || 'Document'}</h4>
      </CModalHeader>

      {/* Document Details */}
      <CModalBody>
        {/* Date & Icons Container - Responsive */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
          {/* Left-Aligned Date Details */}
          <div className="text-start">
            <p className="mb-1">
              <strong>Issue Date:</strong> {formatDate(document?.image?.issueDate)}
            </p>
            <p className="mb-3">
              <strong>Expiry Date:</strong> {formatDate(document?.image?.expiryDate)}
            </p>
          </div>

          {/* Icons Row - Positioned Responsively */}
          <div
            className="d-flex gap-3 align-items-center justify-content-md-end justify-content-start mt-3 mt-md-0"
            style={{
              borderRadius: '0.5rem',
              padding: '0.5rem',
              border: '1px solid rgba(10, 10, 10, 0.21)',
              boxShadow: '2px 2px 2px rgba(10, 10, 10, 0.2)',
            }}
          >
            <CIcon
              icon={cilCloudDownload}
              size="lg"
              className="text-success cursor-pointer"
              onClick={() => onDownload(document)}
              style={{
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.2)'
                e.target.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)'
                e.target.style.boxShadow = 'none'
              }}
            />

            <CIcon
              icon={cilPencil}
              size="lg"
              className="text-warning cursor-pointer"
              onClick={() => onEdit(document)}
              style={{
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.2)'
                e.target.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)'
                e.target.style.boxShadow = 'none'
              }}
            />

            <CIcon
              icon={cilTrash}
              size="lg"
              className="text-danger cursor-pointer"
              onClick={() => onDelete(document)}
              style={{
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.2)'
                e.target.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
        </div>
        <hr />

        {/* Document Image */}
        {document?.image?.imageBase64 ? (
          <div className="text-center mt-3">
            <img
              src={document.image.imageBase64}
              alt={document.file?.filename || 'Document'}
              className="img-fluid rounded border"
              style={{ maxHeight: '300px', width: '100%', objectFit: 'contain' }}
            />
          </div>
        ) : (
          <p className="text-center text-muted mt-3">No image available</p>
        )}
      </CModalBody>

      {/* Actions */}
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ViewDocumentModal
