import React, { useEffect } from 'react'
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CSpinner,
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
import { useQuery } from '@tanstack/react-query'
import { getDocumentImage } from '../../../data/drivers'

const DocumentViewModal = ({
  visible,
  onClose,
  document,
  onEdit,
  onDelete,
  onDownload,
  loading = false,
}) => {
  if (!document) {
    return null
  }

  // Fetch the document image using React Query
  const {
    data: imageData,
    isLoading: imageLoading,
    error: imageError,
  } = useQuery({
    queryKey: ['documentImage', document.id],
    queryFn: () => getDocumentImage(document.id),
    enabled: visible && !!document.id,
  })

  // Create a URL for the Blob and clean it up
  const [imageSrc, setImageSrc] = React.useState(null)
  const [resolvedContentType, setResolvedContentType] = React.useState(null)

  useEffect(() => {
    if (imageData?.document?.image?.base64Data) {
      const base64String = imageData.document.image.base64Data

      let contentType = imageData.document.image.contentType
      console.log('Original content type from API:', contentType)

      if (!contentType && document.fileName) {
        const ext = document.fileName.toLowerCase().split('.').pop()
        switch (ext) {
          case 'pdf':
            contentType = 'application/pdf'
            break
          case 'png':
            contentType = 'image/png'
            break
          case 'jpg':
          case 'jpeg':
            contentType = 'image/jpeg'
            break
          case 'gif':
            contentType = 'image/gif'
            break
          default:
            contentType = 'application/octet-stream'
        }
      }

      if (!contentType) {
        contentType = 'application/octet-stream'
      }

      setResolvedContentType(contentType)

      if (base64String.startsWith('data:')) {
        setImageSrc(base64String)
      } else {
        setImageSrc(`data:${contentType};base64,${base64String}`)
      }
    } else {
      setImageSrc(null)
    }
  }, [imageData, document.fileName])

  console.log(imageData)
  console.log(document.fileName)

  console.log('this is image src', imageSrc)

  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFile />

    const extension = fileName.toLowerCase().split('.').pop()

    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-danger" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FaFileImage className="text-primary" />
      default:
        return <FaFile className="text-muted" />
    }
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

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`
    } else {
      return `${kb.toFixed(2)} KB`
    }
  }

  return (
    <CModal visible={visible} onClose={onClose} size="xl" backdrop="static" keyboard={false}>
      <CModalHeader>
        <CModalTitle>
          <FaEye className="me-2" />
          View Document
        </CModalTitle>
      </CModalHeader>

      <CModalBody>
        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <p className="mt-2 text-muted">Loading document...</p>
          </div>
        ) : (
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
                    }}
                  >
                    {imageLoading ? (
                      <div className="text-center">
                        <CSpinner color="primary" />
                        <p className="mt-2 text-muted">Loading image...</p>
                      </div>
                    ) : imageSrc ? (
                      <>
                        {imageSrc?.includes('application/pdf') ? (
                          <iframe
                            src={imageSrc}
                            title="PDF Preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              minHeight: '500px',
                              border: 'none',
                              objectFit: 'contain',
                              borderRadius: '4px',
                            }}
                          />
                        ) : (
                          <img
                            src={imageSrc}
                            alt={document.displayName || document.name}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain',
                              borderRadius: '4px',
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <div className="text-center">
                        {getFileIcon(document.fileName)}
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
                    <small className="text-muted text-uppercase fw-semibold">Name</small>
                    <div className="fw-medium">
                      {document.displayName || document.name || 'Unknown Document'}
                    </div>
                  </div>

                  {document.fileName && (
                    <div className="mb-3">
                      <small className="text-muted text-uppercase fw-semibold">File Name</small>
                      <div className="fw-medium d-flex align-items-center">
                        {getFileIcon(document.fileName)}
                        <span className="ms-2">
                          {/* Remove original extension and append new one directly */}
                          {document.fileName.replace(/\.[^/.]+$/, '')}
                          {resolvedContentType && `.${resolvedContentType.split('/')[1] || ''}`}
                        </span>
                      </div>
                    </div>
                  )}

                  {document.fileSize && (
                    <div className="mb-3">
                      <small className="text-muted text-uppercase fw-semibold">File Size</small>
                      <div className="fw-medium">{formatFileSize(document.fileSize)}</div>
                    </div>
                  )}

                  {document.issueDate && (
                    <div className="mb-3">
                      <small className="text-muted text-uppercase fw-semibold">Issue Date</small>
                      <div className="fw-medium">{formatDate(document.issueDate)}</div>
                    </div>
                  )}

                  {document.expiryDate && (
                    <div className="mb-3">
                      <small className="text-muted text-uppercase fw-semibold">Expiry Date</small>
                      <div className="fw-medium">{formatDate(document.expiryDate)}</div>
                    </div>
                  )}

                  {document.uploadDate && (
                    <div className="mb-3">
                      <small className="text-muted text-uppercase fw-semibold">Uploaded On</small>
                      <div className="fw-medium">{formatDate(document.uploadDate)}</div>
                    </div>
                  )}

                  {document.description && (
                    <div className="mb-3">
                      <small className="text-muted text-uppercase fw-semibold">Description</small>
                      <div className="fw-medium">{document.description}</div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-4">
                    <div className="d-grid gap-2">
                      {onDownload && (
                        <CButton
                          color="success"
                          variant="outline"
                          onClick={() => onDownload(document)}
                        >
                          <FaDownload className="me-2" />
                          Download
                        </CButton>
                      )}

                      {onEdit && (
                        <CButton color="primary" variant="outline" onClick={() => onEdit(document)}>
                          <FaEdit className="me-2" />
                          Edit
                        </CButton>
                      )}

                      {onDelete && (
                        <CButton
                          color="danger"
                          variant="outline"
                          onClick={() => onDelete(document)}
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
        )}
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          <FaTimes className="me-2" />
          Close
        </CButton>
      </CModalFooter>

      <style jsx>{`
        .document-preview-container {
          border-radius: 8px;
        }

        .document-preview-container img {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </CModal>
  )
}

export default DocumentViewModal
