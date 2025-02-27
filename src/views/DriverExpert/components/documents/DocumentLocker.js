import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FileText, PlusCircle } from 'lucide-react'
import { CModal, CModalBody, CModalHeader, CModalTitle, CButton, CForm, CFormInput, CFormTextarea } from '@coreui/react'

const DocumentLocker = ({ initialDocuments = [], documents = {} }) => {
  const [documentsList, setDocumentsList] = useState(initialDocuments)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDoc, setNewDoc] = useState({ title: '', description: '', file: null })

  const documentCards = [
    ...documentsList, // Include dynamically added documents
    {
      title: 'Aadhar Card',
      image: documents?.aadharImage,
      description: 'Government issued identification card',
    },
    {
      title: 'Driving License',
      image: documents?.licenseImage,
      description: 'Commercial driving license',
    },
  ]

  // Handle File Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setNewDoc({ ...newDoc, file })
  }

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newDoc.title || !newDoc.description || !newDoc.file) {
      alert('Please fill all fields and upload a file.')
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(newDoc.file)
    reader.onload = () => {
      const newDocument = {
        title: newDoc.title,
        description: newDoc.description,
        image: { base64Data: reader.result },
      }

      setDocumentsList([...documentsList, newDocument])
      setShowAddModal(false)
      setNewDoc({ title: '', description: '', file: null }) // Reset form
    }
  }

  return (
    <div className="mt-4 position-relative">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="fs-4 fw-bold text-primary">Document Locker</h2>
        <CButton color="primary" onClick={() => setShowAddModal(true)}>
          <PlusCircle className="me-2" size={18} /> New Document
        </CButton>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4 mt-3">
        {documentCards.map((doc, index) => (
          <div
            key={index}
            className="col"
            onClick={() => setSelectedDoc(doc.image)}
            style={{ cursor: 'pointer' }}
          >
            <div
              className="card h-100 border-0 shadow-sm hover-shadow transition-transform"
              style={{ transition: 'transform 0.3s' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div className="card-body text-center">
                <div
                  className="d-flex align-items-center justify-content-center bg-light rounded-circle mb-3 mx-auto"
                  style={{ width: '60px', height: '60px' }}
                >
                  <FileText className="text-primary fs-4" />
                </div>
                <h5 className="card-title fw-semibold">{doc.title}</h5>
                <p className="card-text text-muted small">{doc.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Document Preview */}
      <CModal visible={!!selectedDoc} onClose={() => setSelectedDoc(null)} alignment="center">
        <CModalHeader closeButton>
          <CModalTitle>Document View</CModalTitle>
        </CModalHeader>
        <CModalBody className="d-flex align-items-center justify-content-center">
          {selectedDoc && (
            <img
              src={selectedDoc.base64Data}
              alt="Document"
              className="img-fluid rounded shadow"
              style={{ maxHeight: '80vh', maxWidth: '100%' }}
            />
          )}
        </CModalBody>
      </CModal>

      {/* Modal for Adding a New Document */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)} alignment="center">
        <CModalHeader closeButton>
          <CModalTitle>Add New Document</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormInput
              type="text"
              placeholder="Document Title"
              className="mb-3"
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              required
            />
            <CFormTextarea
              placeholder="Document Description"
              className="mb-3"
              rows="3"
              value={newDoc.description}
              onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
              required
            />
            <CFormInput type="file" className="mb-3" onChange={handleFileChange} required />
            <CButton type="submit" color="success">
              Submit
            </CButton>
          </CForm>
        </CModalBody>
      </CModal>
    </div>
  )
}

export default DocumentLocker
