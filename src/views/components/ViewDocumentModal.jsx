import React from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilPencil, cilTrash } from '@coreui/icons'

const ViewDocumentModal = ({ visible, onClose, document, onEdit, onDelete, onDownload }) => {
  console.log('docxxxxxx', document)
  return (
    <CModal
      visible={visible}
      onClose={onClose}
      size="xl"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      // backdrop="static"
      centered
    >
      <CModalHeader>
        <h5>{document?.name || 'Document'}</h5> {/* Display document name */}
      </CModalHeader>
      <div
        style={{
          width: '7rem',
          borderRadius: '0.5rem',
          padding: '0.25rem',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          margin: '0 auto',
          marginTop: '10px',
          border: '1px solid rgba(10, 10, 10, 0.21)',
          boxShadow: '2px 2px 2px rgba(10, 10, 10, 0.2)',
        }}
      >
        <CIcon
          icon={cilCloudDownload}
          size="lg"
          className="text-success"
          onClick={() => onDownload(document)}
        />
        <CIcon
          icon={cilPencil}
          size="lg"
          className="text-warning"
          onClick={() => onEdit(document)}
        />
        <CIcon
          icon={cilTrash}
          size="lg"
          className="text-danger"
          onClick={() => onDelete(document)}
        />
      </div>
      <CModalBody className="text-center">
        {document?.image ? (
          <img src={document?.image} alt={document.file?.filename} width="100%" />
        ) : (
          <p>Unsupported file type</p>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ViewDocumentModal
