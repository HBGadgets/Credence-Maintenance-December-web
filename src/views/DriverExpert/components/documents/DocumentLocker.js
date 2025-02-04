import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FileText } from 'lucide-react'
import { CModal, CModalBody, CModalHeader, CModalTitle, CImage } from '@coreui/react'

const DocumentLocker = ({ initialDocuments = [], documents }) => {
  const [documentsList, setDocumentsList] = useState(initialDocuments)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [file, setFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [drivers, setDrivers] = useState([])

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(progress)
        },
      })

      const newDocument = response.data
      setDocumentsList((prevDocuments) => [...prevDocuments, newDocument])
      setShowUploadModal(false)
      setFile(null)
      setUploadProgress(0)
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const refreshDrivers = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/drivers`)
      .then((response) => {
        setDrivers(response.data)
      })
      .catch((error) => {
        console.error('Error fetching drivers:', error)
      })
  }

  useEffect(() => {
    refreshDrivers()
  }, [])

  const documentCards = [
    {
      title: 'Aadhar Card',
      image: documents.aadharImage,
      description: 'Government issued identification card',
    },
    {
      title: 'Driving License',
      image: documents.licenseImage,
      description: 'Commercial driving license',
    },
    {
      title: 'TP Pass',
      image: documents.tpPass,
      description: 'Transport permit pass',
    },
  ]

  return (
    <div className="mt-4">
      <h2 className="fs-4 fw-bold mb-4 text-primary">Document Locker</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {documentCards.map((doc) => (
          <div
            key={doc.title}
            className="col"
            onClick={() => setSelectedDoc(doc.image)}
            style={{ cursor: 'pointer' }}
          >
            <div
              className="card h-100 border-0 shadow-sm hover-shadow transition-transform"
              style={{
                transform: 'scale(1)',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <div className="card-body text-center">
                <div
                  className="d-flex align-items-center justify-content-center bg-light rounded-circle mb-3 mx-auto"
                  style={{
                    width: '60px',
                    height: '60px',
                  }}
                >
                  <FileText className="text-primary fs-4" />
                </div>
                <h5 className="card-title fw-semibold">{doc.title}</h5>
                <p className="card-text text-muted small">{doc.description}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="col" style={{ cursor: 'pointer' }}>
          <div
            className="card h-100 border-0 shadow-sm hover-shadow transition-transform"
            style={{
              transform: 'scale(1)',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
            onClick={() => setShowUploadModal(true)}
          >
            <div className="card-body text-center">
              <div
                className="d-flex align-items-center justify-content-center bg-light rounded-circle mb-3 mx-auto"
                style={{
                  width: '60px',
                  height: '60px',
                }}
              >
                <FileText className="text-primary fs-4" />
              </div>
              <h5 className="card-title fw-semibold">Add Document</h5>
              <p className="card-text text-muted small">Click to upload a new document</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Document Preview */}
      <CModal visible={!!selectedDoc} onClose={() => setSelectedDoc(null)} alignment="center">
        <CModalHeader closeButton>
          <CModalTitle>Document View</CModalTitle>
        </CModalHeader>
        <CModalBody className="d-flex align-items-center justify-content-center">
          {selectedDoc && (
            <img
              src={selectedDoc}
              alt="Document"
              className="img-fluid rounded shadow"
              style={{ maxHeight: '80vh', maxWidth: '100%' }}
            />
          )}
          {selectedDriver && (
            <CImage
              src={selectedDriver.profileImage || '/default-avatar.png'}
              alt={selectedDriver.name}
              className="img-thumbnail rounded-circle me-3"
              width="120"
              height="120"
            />
          )}
        </CModalBody>
      </CModal>

      {/* Modal for File Upload */}
      <CModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        alignment="center"
      >
        <CModalHeader closeButton>
          <CModalTitle>Upload New Document</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <input type="file" onChange={handleFileChange} />
          {file && (
            <div className="mt-3">
              <p>Selected File: {file.name}</p>
              <button
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={uploadProgress > 0 && uploadProgress < 100}
              >
                Upload
              </button>
              {uploadProgress > 0 && (
                <div className="progress mt-2">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${uploadProgress}%` }}
                    aria-valuenow={uploadProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {uploadProgress}%
                  </div>
                </div>
              )}
            </div>
          )}
        </CModalBody>
      </CModal>
    </div>
  )
}

export default DocumentLocker
