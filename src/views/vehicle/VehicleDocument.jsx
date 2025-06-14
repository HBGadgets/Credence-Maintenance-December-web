import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CButton, CSpinner } from '@coreui/react'
import { FaRegFolderClosed, FaUpload } from 'react-icons/fa6'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import DocumentModal from '../components/DocumentModal'
import ViewDocumentModal from '../components/ViewDocumentModal'
import {
  getDocuments,
  uploadDocuments,
  editDocument,
  deleteDocumentAPI,
} from './data/VehicleListData'
import Swal from 'sweetalert2'
import { toast, ToastContainer } from 'react-toastify'

const VehicleDocuments = ({ Insurance, fitnessCertificate, rc, puc }) => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [modalType, setModalType] = useState(null)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [imageSrc, setImageSrc] = useState(null)
  const [documentData, setDocumentData] = useState({
    Insurance: { issueDate: '', expiryDate: '', file: null },
    rc: { issueDate: '', expiryDate: '', file: null },
    puc: { issueDate: '', expiryDate: '', file: null },
    fitnessCertificate: { issueDate: '', expiryDate: '', file: null },
  })
  const [loadingDocs, setLoadingDocs] = useState({})

  // React Query for fetching documents
  const { data: allDocuments = {}, isLoading } = useQuery({
    queryKey: ['vehicleDocuments', id],
    queryFn: async () => {
      const fields = ['Insurance', 'rc', 'puc', 'fitnessCertificate']
      const results = {}
      
      for (const field of fields) {
        const response = await getDocuments(id, field)
        results[field] = response || {}
      }
      
      return results
    },
    staleTime: 5 * 60 * 1000, 
  })

  // Mutations for document operations
  const uploadMutation = useMutation({
    mutationFn: ({ id, documents }) => uploadDocuments(id, documents),
    onSuccess: () => {
      toast.success('Document uploaded successfully!')
      queryClient.invalidateQueries(['vehicleDocuments', id])
      handleCloseModal()
    },
    onError: (error) => {
      console.error('Error uploading document:', error)
      toast.error('Failed to upload document.')
    }
  })

  const editMutation = useMutation({
    mutationFn: ({ id, formData }) => editDocument(id, formData),
    onSuccess: () => {
      toast.success('Document updated successfully!')
      queryClient.invalidateQueries(['vehicleDocuments', id])
      handleCloseModal()
    },
    onError: (error) => {
      console.error('Error editing document:', error)
      toast.error('Failed to update document.')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, fieldName }) => deleteDocumentAPI(id, fieldName),
    onSuccess: () => {
      toast.success('Document deleted successfully!')
      queryClient.invalidateQueries(['vehicleDocuments', id])
      setModalType(null)
    },
    onError: (error) => {
      console.error('Error deleting document:', error)
      toast.error('Failed to delete document.')
    }
  })

  const handleSaveChanges = async (documents) => {
    const documentType = Object.keys(documents)?.[0]
    const documentData = documents?.[documentType]

    if (!documentType || !documentData?.file) {
      toast.error('No file selected for upload.')
      return
    }

    uploadMutation.mutate({ id, documents: { [documentType]: documentData } })
  }

  const handleEditSubmit = async (documents) => {
    const documentType = Object.keys(documents)?.[0]
    const documentData = documents?.[documentType]

    if (!id) {
      toast.error('Vehicle ID is missing.')
      return
    }

    if (!documentType || !documentData) {
      toast.error('Invalid document data.')
      return
    }

    const formData = new FormData()
    formData.append(`documents[${documentType}][issueDate]`, documentData.issueDate)
    formData.append(`documents[${documentType}][expiryDate]`, documentData.expiryDate)

    const documentFieldMapping = {
      rc: 'rcImage',
      Insurance: 'insuranceImage',
      puc: 'pucImage',
      fitnessCertificate: 'fitnessCertificateImage',
    }

    const mappedFieldName = documentFieldMapping[documentType] || `${documentType}Image`

    if (documentData.file) {
      formData.append(mappedFieldName, documentData.file)
    }

    editMutation.mutate({ id, formData })
  }

  const handleEdit = (doc) => {
    if (!doc?.name) {
      console.error('Invalid document for editing.', doc)
      return
    }

    setSelectedDocument(doc.name)
    setDocumentData({
      [doc.name]: {
        issueDate: doc.issueDate || '',
        expiryDate: doc.expiryDate || '',
        file: doc.file || null,
      },
    })
    setModalType('edit')
  }

  const handleDelete = async (doc) => {
    if (!doc || !doc.name) {
      toast.error('Invalid document structure.')
      return
    }

    const fieldName = doc.name

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
      deleteMutation.mutate({ id, fieldName })
    }
  }

  const handleDownload = (doc) => {
    if (!doc || !doc.image) {
      toast.error('Failed to delete document.')
      return
    }

    const link = document.createElement('a')
    toast.success('Document downloaded successfully!')
    link.href = doc.image.imageBase64
    link.download = `${doc.name || 'document'}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openAddModal = () => {
    setSelectedDocument(null)
    setDocumentData({
      Insurance: { issueDate: '', expiryDate: '', file: null },
      rc: { issueDate: '', expiryDate: '', file: null },
      puc: { issueDate: '', expiryDate: '', file: null },
      fitnessCertificate: { issueDate: '', expiryDate: '', file: null },
    })
    setModalType('add')
  }

  const handleDocumentClick = async (field) => {
    setLoadingDocs((prev) => ({ ...prev, [field]: true }))

    try {
      const imageData = await getDocuments(id, field)
      if (imageData) {
        setImageSrc(imageData)
        setSelectedDocument({ name: field, image: imageData })
        setModalType('view')
      } else {
        toast.error(`No image data found for ${field}.`)
      }
    } catch (error) {
      toast.error('Error retrieving document.')
    } finally {
      setLoadingDocs((prev) => ({ ...prev, [field]: false }))
    }
  }

  const handleCloseModal = () => {
    setModalType(null)
    setDocumentData({
      Insurance: { issueDate: '', expiryDate: '', file: null },
      rc: { issueDate: '', expiryDate: '', file: null },
      puc: { issueDate: '', expiryDate: '', file: null },
      fitnessCertificate: { issueDate: '', expiryDate: '', file: null },
    })
  }

   const documentsList = [
    { name: 'Insurance', value: Insurance },
    { name: 'fitnessCertificate', value: fitnessCertificate },
    { name: 'rc', value: rc },
    { name: 'puc', value: puc },
  ].filter(doc => doc.value); 

  const hasDocuments = documentsList.some((doc) => doc.value)

  return (
    <div>
      <ToastContainer />

      <CCard className="shadow-sm border-0">
        <CCardHeader className="d-flex align-items-center bg-light fw-bold">
          <h5 className="text-black">📂 Documents</h5>
          <CButton
            className="ms-auto px-3 py-2"
            onClick={openAddModal}
            style={{ backgroundColor: '#0a2d63', color: '#fff' }}
          >
            <FaUpload className="me-2" /> Upload Documents
          </CButton>
        </CCardHeader>
        <CCardBody className="p-4">
          {isLoading ? (
            <div className="text-center">
              <CSpinner color="primary" />
            </div>
          ) : documentsList?.length > 0 ? (
            <div className="d-flex flex-wrap gap-4">
              {documentsList.map(
                (doc, index) =>
                  doc?.value && (
                    <div
                      key={index}
                      className="text-center p-3 rounded border document-card"
                      onClick={() => handleDocumentClick(doc.name)}
                      style={{
                        width: '120px',
                        cursor: 'pointer',
                        transition: '0.3s',
                      }}
                    >
                      {loadingDocs?.[doc.name] ? (
                        <CSpinner variant="grow" size={30} style={{ color: '#0a2d63' }} />
                      ) : (
                        <FaRegFolderClosed size={40} style={{ color: '#0a2d63' }} />
                      )}
                      <div className="mt-2 text-dark fw-bold small">{doc.name}</div>
                    </div>
                  ),
              )}
            </div>
          ) : (
            <p className="text-center text-muted">No documents found.</p>
          )}
        </CCardBody>
      </CCard>

      <style>
        {`
          .document-card:hover {
            background-color: #f8f9fa;
            transform: translateY(-3px);
          }
        `}
      </style>

      {/* Upload & Edit Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <DocumentModal
          visible={modalType === 'add' || modalType === 'edit'}
          onClose={handleCloseModal}
          onSubmit={modalType === 'add' ? handleSaveChanges : handleEditSubmit}
           loadingSubmit={modalType === 'add' ? uploadMutation.isPending : editMutation.isPending}
          type={modalType}
          initialData={documentData}
        />
      )}

      {/* View Document Modal */}
      {modalType === 'view' && selectedDocument && (
        <ViewDocumentModal
          visible={modalType === 'view'}
          onClose={() => setModalType(null)}
          document={selectedDocument}
          onEdit={() => handleEdit(selectedDocument)}
          onDelete={() => handleDelete(selectedDocument)}
          onDownload={() => handleDownload(selectedDocument)}
        />
      )}
    </div>
  )
}

export default VehicleDocuments