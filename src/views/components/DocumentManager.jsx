import { useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilPencil, cilTrash, cilZoom } from '@coreui/icons'
import { CCard, CCardBody, CCardHeader, CButton, CRow, CCol } from '@coreui/react'
import DocumentUploadButton from './DocumentUploadButton'

const DocumentManager = () => {
  const [documents, setDocuments] = useState([])
  const [uploadModalVisible, setUploadModalVisible] = useState(false)

  const handleUpload = (newDocs) => {
    const formattedDocs = newDocs.map((doc, index) => ({
      ...doc,
      id: documents.length + index, // Assign unique ID
      file: {
        filename: doc.file?.name || 'Uploaded File',
        contentType: doc.file?.type || '',
        data: doc.file ? URL.createObjectURL(doc.file) : '', // Convert to previewable URL
      },
    }))

    setDocuments([...documents, ...formattedDocs])
  }

  const handleDelete = (docId) => {
    setDocuments(documents.filter((doc) => doc.id !== docId))
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
                        onClick={() => console.log('View:', doc)}
                      />
                      <CIcon
                        icon={cilCloudDownload}
                        size="sm"
                        className="text-success"
                        style={{ cursor: 'pointer' }}
                        onClick={() => console.log('Download:', doc)}
                      />
                      <CIcon
                        icon={cilPencil}
                        size="sm"
                        className="text-warning"
                        style={{ cursor: 'pointer' }}
                        onClick={() => console.log('Edit:', doc)}
                      />
                      <CIcon
                        icon={cilTrash}
                        size="sm"
                        className="text-danger"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDelete(doc.id)}
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
        onUpload={handleUpload}
      />
    </CCard>
  )
}

export default DocumentManager
