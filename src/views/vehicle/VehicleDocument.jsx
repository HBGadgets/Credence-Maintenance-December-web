import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CButton } from '@coreui/react'
import DocumentModal from '../components/DocumentModal'
import ViewDocumentModal from '../components/ViewDocumentModal'
import { getDocuments, uploadDocuments } from './data/VehicleListData'
import { FaRegFolderClosed } from 'react-icons/fa6'
import { deleteDocumentAPI } from './data/VehicleListData'
import { editDocument } from './data/VehicleListData'

const VehicleDocuments = () => {
  const { id } = useParams()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalType, setModalType] = useState(null)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [loadingSubmit, setLoadingSubmit] = useState(false) // Loader state
  const [documentData, setDocumentData] = useState({
    category: '',
    issueDate: '',
    expiryDate: '',
    file: null,
  })

  useEffect(() => {
    fetchDocuments()
  }, [id])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const response = await getDocuments(id)
      setDocuments(response.data || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChanges = async () => {
    setLoadingSubmit(true)
    const formData = new FormData()
    formData.append('category', documentData.category)
    formData.append('issueDate', documentData.issueDate)
    formData.append('expiryDate', documentData.expiryDate)
    if (documentData.file) {
      formData.append('file', documentData.file)
    }

    try {
      if (modalType === 'add') {
        await uploadDocuments(id, formData)
      } else if (modalType === 'edit' && selectedDocument) {
        await editDocument(id, selectedDocument._id, formData)
      }
      fetchDocuments()
      setModalType(null)
    } catch (error) {
      console.error('Error processing document:', error)
    } finally {
      setLoadingSubmit(false)
    }
  }

  const handleUpload = async () => {
    setLoadingSubmit(true)
    const formData = new FormData()
    formData.append('category', documentData.category)
    formData.append('issueDate', documentData.issueDate)
    formData.append('expiryDate', documentData.expiryDate)
    formData.append('file', documentData.file)

    try {
      await uploadDocuments(id, formData)
      fetchDocuments()
      setModalType(null)
      resetForm() // ✅ Clear form after submission
    } catch (error) {
      console.error('Error uploading document:', error)
    } finally {
      setLoadingSubmit(false)
    }
  }

  // ✅ Clear form when opening "Add Document"
  const openAddModal = () => {
    resetForm()
    setModalType('add')
  }

  const handleEdit = (doc) => {
    console.log('Editing document:', doc)
    setSelectedDocument(doc)
    setDocumentData({
      category: doc.category,
      issueDate: doc.issueDate,
      expiryDate: doc.expiryDate,
      file: null, // File can't be pre-filled
    })
    setModalType('edit')
  }

  const handleDelete = async (doc) => {
    if (window.confirm(`Are you sure you want to delete ${doc.file.filename}?`)) {
      try {
        await deleteDocumentAPI(id, doc._id) // Call delete API
        fetchDocuments() // Refresh the list after deletion
        setModalType(null)
      } catch (error) {
        console.error('Error deleting document:', error)
      }
    }
  }

  const handleDownload = (doc) => {
    if (doc?.file?.data) {
      const link = document.createElement('a')
      link.href = `data:${doc.file.contentType};base64,${doc.file.data}`
      link.download = doc.file.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      console.error('No file data available for download')
    }
  }

  // ✅ Reset form function
  const resetForm = () => {
    setDocumentData({
      category: '',
      issueDate: '',
      expiryDate: '',
      file: null,
    })
  }
  const handleCloseModal = () => {
    setModalType(null)
    resetForm() // ✅ Reset form when modal closes
  }

  return (
    <div>
      <CCard>
        <CCardHeader className="d-flex">
          Documents
          <CButton color="primary" className="ms-auto" onClick={() => setModalType('add')}>
            Upload Documents
          </CButton>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <p>Loading...</p>
          ) : documents.length > 0 ? (
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap',
              }}
            >
              {documents.map((doc, index) => (
                <li
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column', // Stack icon and text vertically
                    alignItems: 'center', // Center align them
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedDocument(doc)
                    setModalType('view')
                  }}
                >
                  <FaRegFolderClosed size={40} />
                  <span style={{ color: 'black', marginTop: '5px' }}>{doc.category}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents found</p>
          )}
        </CCardBody>
      </CCard>

      {/* Document Upload & Edit Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <DocumentModal
          visible={modalType === 'add' || modalType === 'edit'}
          onClose={handleCloseModal} // Use a function to reset the form
          onSubmit={handleSaveChanges}
          documentData={documentData}
          setDocumentData={setDocumentData}
          type={modalType}
          loadingSubmit={loadingSubmit}
        />
      )}

      {/* View Document Modal */}
      {modalType === 'view' && selectedDocument && (
        <ViewDocumentModal
          visible={modalType === 'view'}
          onClose={() => setModalType(null)}
          document={selectedDocument}
          onEdit={() => handleEdit(selectedDocument)} // Pass document to edit
          onDelete={() => handleDelete(selectedDocument)}
          onDownload={() => handleDownload(selectedDocument)}
        />
      )}
    </div>
  )
}

export default VehicleDocuments
