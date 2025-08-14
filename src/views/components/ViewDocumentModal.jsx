import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
} from '@coreui/react'
import {
  FaEye,
  FaDownload,
  FaEdit,
  FaTrash,
  FaTimes,
  FaFileImage,
  FaFilePdf,
  FaFile,
} from 'react-icons/fa'

const ViewDocumentModal = ({ visible, onClose, document, onEdit, onDelete, onDownload }) => {
  if (!document) {
    return null
  }
  console.log('this is document', document)

  const getFileIcon = () => {
    // Since the document prop doesn't include fileName, we'll infer the type from the image data
    if (document.image?.imageBase64) {
      // Assuming imageBase64 is an image (e.g., JPEG, PNG)
      return <FaFileImage className="text-primary" size={20} />
    }
    // If no imageBase64, assume it's a generic file (could be PDF or other)
    return <FaFile className="text-muted" size={20} />
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size'
    const kb = bytes / 1024
    const mb = kb / 1024
    return mb >= 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(2)} KB`
  }

  return (
    <CModal visible={visible} onClose={onClose} size="xl" keyboard={false}>
      <CModalHeader>
        <CModalTitle>
          <FaEye className="me-2" />
          View Document
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          {/* Document Preview Section */}
          <CCol lg={8}>
            <CCard className="h-100">
              <CCardBody className="p-0">
                <div
                  className="document-preview-container"
                  style={{
                    minHeight: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa',
                    position: 'relative',
                    borderRadius: '8px',
                  }}
                >
                  {document?.image?.imageBase64 ? (
                    <img
                      src={document?.image?.imageBase64}
                      alt={document?.name || 'Document'}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      {getFileIcon()}
                      <div className="mt-3">
                        <h6 className="text-muted">No preview available</h6>
                        <p className="text-muted small">
                          Document may be in a format that cannot be previewed
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Document Information Section */}
          <CCol lg={4}>
            <CCard className="h-100">
              <CCardBody>
                <h6 className="fw-bold mb-3 text-primary">Document Information</h6>

                <div className="mb-3">
                  <small className="text-muted text-uppercase fw-semibold">Company Name</small>
                  <div className="fw-medium">
                    {document?.image?.companyName || 'Unknown Company Name'}
                  </div>
                </div>

                {/* File Name and Icon (not available in current data, but added for future compatibility) */}
                <div className="mb-3">
                  <small className="text-muted text-uppercase fw-semibold">File Name</small>
                  <div className="fw-medium d-flex align-items-center">
                    {getFileIcon()}
                    <span className="ms-2">
                      {document?.fileName || `${document?.name || 'document'}`}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-muted text-uppercase fw-semibold">Issue Date</small>
                  <div className="fw-medium">{formatDate(document?.image?.issueDate)}</div>
                </div>

                <div className="mb-3">
                  <small className="text-muted text-uppercase fw-semibold">Expiry Date</small>
                  <div className="fw-medium">{formatDate(document?.image?.expiryDate)}</div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4">
                  <div className="d-grid gap-2">
                    {onDownload && (
                      <CButton
                        color="success"
                        variant="outline"
                        onClick={() => onDownload(document)}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <FaDownload className="me-2" />
                        Download
                      </CButton>
                    )}
                    {onEdit && (
                      <CButton
                        color="primary"
                        variant="outline"
                        onClick={() => onEdit(document)}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <FaEdit className="me-2" />
                        Edit
                      </CButton>
                    )}
                    {onDelete && (
                      <CButton
                        color="danger"
                        variant="outline"
                        onClick={() => onDelete(document)}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <FaTrash className="me-2" />
                        Delete
                      </CButton>
                    )}
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter className="bg-light">
        <CButton
          color="secondary"
          onClick={onClose}
          className="d-flex align-items-center justify-content-center"
        >
          <FaTimes className="me-2" />
          Close
        </CButton>
      </CModalFooter>
      <style>{`
        .document-preview-container {
          border-radius: 8px;
        }
        .modal-header.bg-primary {
          background: linear-gradient(135deg, #0a2d63, #1e4d8f);
        }
        .btn-outline-success, .btn-outline-primary, .btn-outline-danger {
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .btn-outline-success:hover {
          background-color: #28a745;
          color: white;
        }
        .btn-outline-primary:hover {
          background-color: #0a2d63;
          color: white;
        }
        .btn-outline-danger:hover {
          background-color: #dc3545;
          color: white;
        }
        .btn-secondary {
          transition: background-color 0.2s ease;
        }
        .btn-secondary:hover {
          background-color: #5c636a;
        }
      `}</style>
    </CModal>
  )
}

export default ViewDocumentModal
