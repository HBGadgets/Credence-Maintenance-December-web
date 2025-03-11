import { CCard, CCardBody, CCardHeader, CButton, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilPencil, cilTrash, cilZoom } from '@coreui/icons'
import DocumentUploadButton from './DocumentUploadButton'
import { useState } from 'react'

const DocumentManager = ({ documents = [], onUpload, onDelete, onEdit, onView }) => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false)

  const handleDownload = (file) => {
    if (!file?.data) return
    const link = document.createElement('a')
    link.href = file.data
    link.download = file.filename || 'document'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <CCard>
      <CCardHeader className="d-flex">
        Documents
        <CButton color="primary" className="ms-auto" onClick={() => setUploadModalVisible(true)}>
          Upload Documents
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CRow className="justify-content-center">
          {documents.length > 0 ? (
            <div className="row g-3 gap-3 mt-0">
              {documents.map((doc) => {
                const { file } = doc
                const fileType = file?.contentType || ''

                return (
                  <div key={doc.id} className="col-auto text-center" style={{ width: '7rem' }}>
                    <h6 className="text-truncate" title={doc.category}>
                      {doc.category}
                    </h6>

                    <div
                      style={{
                        width: '7rem',
                        height: '7rem',
                        border: '1px solid grey',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Display Image or PDF Preview */}
                      {fileType.startsWith('image/') ? (
                        <img
                          src={file.data}
                          alt={file.filename}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : fileType === 'application/pdf' ? (
                        <object
                          data={file.data}
                          type="application/pdf"
                          style={{ width: '100%', height: '100%' }}
                        >
                          <p className="text-danger">PDF preview not available.</p>
                        </object>
                      ) : (
                        <p className="text-muted">Unsupported file type</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-around mt-2">
                      <CIcon
                        icon={cilZoom}
                        size="sm"
                        className="text-info"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onView && onView(doc)}
                      />
                      <CIcon
                        icon={cilCloudDownload}
                        size="sm"
                        className="text-success"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDownload(file)}
                      />
                      <CIcon
                        icon={cilPencil}
                        size="sm"
                        className="text-warning"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onEdit && onEdit(doc)}
                      />
                      <CIcon
                        icon={cilTrash}
                        size="sm"
                        className="text-danger"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onDelete && onDelete(doc.id)}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <CCol md={6} className="text-center">
              <p className="fw-bold text-danger">No documents uploaded.</p>
            </CCol>
          )}
        </CRow>
      </CCardBody>

      {/* Upload Modal */}
      <DocumentUploadButton
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        onUpload={onUpload}
      />
    </CCard>
  )
}

export default DocumentManager
