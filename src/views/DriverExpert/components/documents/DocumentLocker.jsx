import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CButton, CSpinner, CRow, CCol } from '@coreui/react'
import { FaRegFolderClosed, FaUpload } from 'react-icons/fa6'
import DocumentUploadModal from './components/DocumentUploadModal'
import DocumentViewModal from './components/DocumentViewModal'
import Swal from 'sweetalert2'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getDocuments,
  deleteDocumentAPI,
  uploadDocuments,
  getDocumentImage,
  editDocument,
} from '../../data/drivers'

const DocumentLocker = ({ id }) => {
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [loadingDocs, setLoadingDocs] = useState({})
  const [modalType, setModalType] = useState(null)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [error, setError] = useState('')

  const queryClient = useQueryClient()

  // Show Swal alert when error changes
  useEffect(() => {
    if (error) {
      Swal.fire('Error', error, 'error')
      setError('') // Clear error after displaying
    }
  }, [error])

  const {
    data: documentsData,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ['documents', id],
    queryFn: () => getDocuments(id),
    enabled: !!id,
    onError: (error) => {
      console.error('Error fetching documents:', error)
      setError('Failed to fetch documents.')
    },
  })

  // React Query mutation for updating document
  const updateDocumentMutation = useMutation({
    mutationFn: ({ documentId, documentData }) => editDocument(documentId, documentData),
    onSuccess: (data) => {
      console.log('Document updated successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['documents', id] })
      setModalType(null) // Close modal
      setSelectedDocument(null) // Clear selected document
      Swal.fire('Success', data.message || 'Document updated successfully!', 'success')
    },
    onError: (error) => {
      console.error('Error updating document:', error)
      setError(error.message || 'Failed to update document')
    },
  })

  const documentsList =
    documentsData?.documents?.map((doc) => ({
      name: doc.documentName,
      displayName: doc.documentName,
      value: doc,
    })) || []

  const handleUploadDocument = async (documentData) => {
    if (!documentData.documentName || !documentData.document) {
      Swal.fire('Missing Fields', 'Please provide both document name and file.', 'warning')
      return
    }

    setLoadingSubmit(true)
    try {
      const formattedData = {
        documentName: documentData.documentName,
        document: documentData.document,
      }
      await uploadDocuments(id, formattedData)
      Swal.fire('Uploaded', 'Document uploaded successfully!', 'success')
      queryClient.invalidateQueries(['documents', id])
      setModalType(null)
    } catch (error) {
      console.error('Error uploading document:', error)
      setError(error.message || 'Document upload failed')
    } finally {
      setLoadingSubmit(false)
    }
  }

  const handleDelete = async (doc) => {
    if (!doc || !doc.id) {
      setError('Invalid document structure.')
      console.error('Invalid document structure', doc)
      return
    }

    const fieldName = doc.fileName

    const result = await Swal.fire({
      title: `Delete ${fieldName}?`,
      text: 'Are you sure you want to delete this document? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (result.isConfirmed) {
      try {
        await deleteDocumentAPI(doc.id)
        queryClient.invalidateQueries(['documents', id])
        setModalType(null)
        Swal.fire('Deleted!', `${fieldName} was successfully deleted.`, 'success')
      } catch (error) {
        console.error('Error deleting document:', error.response?.data || error.message)
        setError(`Failed to delete ${fieldName}.`)
      }
    }
  }

  const handleDownload = async (doc) => {
    if (!doc || !doc.id) {
      setError('Invalid document structure.')
      console.error('Invalid document structure', doc)
      return
    }

    try {
      const response = await getDocumentImage(doc.id)
      const base64String = response?.document?.image?.base64Data
      const contentType = response?.document?.image?.contentType || 'image/jpeg'

      if (!base64String) {
        setError('No image data found for document.')
        console.error('No image data found for document', doc)
        return
      }

      const link = document.createElement('a')
      link.href = `data:${contentType};base64,${base64String}`
      link.download = `${doc.name || 'document'}.${contentType.split('/')[1] || 'jpg'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      Swal.fire('Downloaded!', 'Document downloaded successfully.', 'success')
    } catch (error) {
      setError('Failed to download document.')
      console.error('Error downloading document:', error)
    }
  }

  const handleEdit = (doc) => {
    setSelectedDocument({
      id: doc.value?._id || doc.id, // Ensure correct ID
      documentName: doc.name || doc.displayName,
      documentUrl: doc.documentUrl || null,
    })
    console.log('Set selected document:', doc)
    setModalType('Edit')
  }

  const handleupdate = (documentData) => {
    console.log('Handle edit function executed')
    console.log('Document data:', documentData)

    if (!documentData.id) {
      setError('Document ID is missing')
      return
    }

    setLoadingSubmit(true)
    updateDocumentMutation.mutate(
      {
        documentId: documentData.id,
        documentData: {
          documentName: documentData.documentName,
          document: documentData.document || null, // Handle optional file
        },
      },
      {
        onSettled: () => {
          setLoadingSubmit(false) // Reset loading state
        },
      },
    )
  }

  const openUploadModal = () => {
    setSelectedDocument(null)
    setModalType('upload')
    setError('')
  }

  const handleDocumentClick = (field) => {
    setLoadingDocs((prev) => ({ ...prev, [field]: true }))

    try {
      const doc = documentsList.find((d) => d.name === field)

      if (doc) {
        setSelectedDocument({
          id: doc.value._id,
          name: field,
          displayName: doc.displayName || field,
          fileName: `${field}.jpg`,
          uploadDate: new Date().toISOString(),
        })
        setModalType('view')
      } else {
        setError(`No document data found for ${field}.`)
        console.error(`No document data found for ${field}.`)
      }
    } catch (error) {
      setError('Error retrieving document.')
      console.error('Error processing document:', error)
    } finally {
      setLoadingDocs((prev) => ({ ...prev, [field]: false }))
    }
  }

  const handleCloseModal = () => {
    setModalType(null)
    setSelectedDocument(null)
    setError('')
  }

  const hasDocuments = documentsList.length > 0

  return (
    <div>
      <CCard className="shadow-sm border-0">
        <CCardHeader className="d-flex align-items-center bg-light fw-bold">
          <h5 className="text-black mb-0">📂 Documents</h5>
          <CButton
            className="ms-auto px-3 py-2"
            onClick={openUploadModal}
            style={{ backgroundColor: '#0a2d63', color: '#fff' }}
          >
            <FaUpload className="me-2" /> Upload Documents
          </CButton>
        </CCardHeader>

        <CCardBody className="p-4">
          {loading ? (
            <div className="text-center">
              <CSpinner color="primary" />
              <p className="mt-2 text-muted">Loading documents...</p>
            </div>
          ) : hasDocuments ? (
            <CRow className="g-3">
              {documentsList.map((doc) => (
                <CCol key={doc.name} xs={6} sm={4} md={3} lg={2}>
                  <div
                    className="text-center p-3 rounded border document-card"
                    onClick={() => handleDocumentClick(doc.name)}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minHeight: '120px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {loadingDocs?.[doc.name] ? (
                      <CSpinner variant="grow" size="sm" style={{ color: '#0a2d63' }} />
                    ) : (
                      <FaRegFolderClosed size={40} style={{ color: '#0a2d63' }} />
                    )}
                    <div className="mt-2 text-dark fw-bold small text-center">
                      {doc.displayName}
                    </div>
                  </div>
                </CCol>
              ))}
            </CRow>
          ) : (
            <div className="text-center py-5">
              <FaRegFolderClosed size={60} className="text-muted mb-3" />
              <p className="text-muted mb-3">No documents uploaded yet</p>
              <CButton color="primary" variant="outline" onClick={openUploadModal}>
                <FaUpload className="me-2" />
                Upload Your First Document
              </CButton>
            </div>
          )}
        </CCardBody>
      </CCard>

      <style>
        {`
          .document-card:hover {
            background-color: #f8f9fa;
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
        `}
      </style>

      {modalType && (
        <DocumentUploadModal
          visible={modalType}
          onClose={handleCloseModal}
          selectedDocument={selectedDocument}
          onEdit={handleupdate}
          onSubmit={handleUploadDocument}
          loadingSubmit={loadingSubmit || updateDocumentMutation.isPending}
        />
      )}

      {modalType === 'view' && selectedDocument && (
        <DocumentViewModal
          visible={modalType === 'view'}
          onClose={handleCloseModal}
          document={selectedDocument}
          onEdit={handleEdit}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default DocumentLocker
