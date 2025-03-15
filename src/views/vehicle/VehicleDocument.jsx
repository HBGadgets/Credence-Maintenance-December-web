// import React, { useState, useEffect } from 'react'
// import { useParams } from 'react-router-dom'
// import { CCard, CCardBody, CCardHeader, CButton } from '@coreui/react'
// import DocumentModal from '../components/DocumentModal'
// import ViewDocumentModal from '../components/ViewDocumentModal'
// import { getDocuments, uploadDocuments } from './data/VehicleListData'
// import { FaRegFolderClosed } from 'react-icons/fa6'
// import { deleteDocumentAPI } from './data/VehicleListData'
// import { editDocument } from './data/VehicleListData'

// const VehicleDocuments = ({ Insurance, fitnessCertificate , rc, puc}) => {
//   const { id } = useParams()
//   const [documents, setDocuments] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [modalType, setModalType] = useState(null)
//   const [selectedDocument, setSelectedDocument] = useState(null)
//   const [loadingSubmit, setLoadingSubmit] = useState(false) // Loader state
//   const [documentData, setDocumentData] = useState({
//     category: '',
//     issueDate: '',
//     expiryDate: '',
//     file: null,
//   })

//   useEffect(() => {
//     fetchDocuments()
//   }, [id])

//   const fetchDocuments = async () => {
//     setLoading(true)
//     try {
//       const response = await getDocuments(id)
//       setDocuments(response.data || [])
//     } catch (error) {
//       console.error('Error fetching documents:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSaveChanges = async () => {
//     setLoadingSubmit(true)
//     const formData = new FormData()
//     formData.append('category', documentData.category)
//     formData.append('issueDate', documentData.issueDate)
//     formData.append('expiryDate', documentData.expiryDate)
//     if (documentData.file) {
//       formData.append('file', documentData.file)
//     }

//     try {
//       if (modalType === 'add') {
//         await uploadDocuments(id, formData)
//       } else if (modalType === 'edit' && selectedDocument) {
//         await editDocument(id, selectedDocument._id, formData)
//       }
//       fetchDocuments()
//       setModalType(null)
//     } catch (error) {
//       console.error('Error processing document:', error)
//     } finally {
//       setLoadingSubmit(false)
//     }
//   }

//   const handleUpload = async () => {
//     setLoadingSubmit(true)
//     const formData = new FormData()
//     formData.append('category', documentData.category)
//     formData.append('issueDate', documentData.issueDate)
//     formData.append('expiryDate', documentData.expiryDate)
//     formData.append('file', documentData.file)

//     try {
//       await uploadDocuments(id, formData)
//       fetchDocuments()
//       setModalType(null)
//       resetForm() // ✅ Clear form after submission
//     } catch (error) {
//       console.error('Error uploading document:', error)
//     } finally {
//       setLoadingSubmit(false)
//     }
//   }

//   // ✅ Clear form when opening "Add Document"
//   const openAddModal = () => {
//     resetForm()
//     setModalType('add')
//   }

//   const handleEdit = (doc) => {
//     console.log('Editing document:', doc)
//     setSelectedDocument(doc)
//     setDocumentData({
//       category: doc.category,
//       issueDate: doc.issueDate,
//       expiryDate: doc.expiryDate,
//       file: null, // File can't be pre-filled
//     })
//     setModalType('edit')
//   }

//   const handleDelete = async (doc) => {
//     if (window.confirm(`Are you sure you want to delete ${doc.file.filename}?`)) {
//       try {
//         await deleteDocumentAPI(id, doc._id) // Call delete API
//         fetchDocuments() // Refresh the list after deletion
//         setModalType(null)
//       } catch (error) {
//         console.error('Error deleting document:', error)
//       }
//     }
//   }

//   const handleDownload = (doc) => {
//     if (doc?.file?.data) {
//       const link = document.createElement('a')
//       link.href = `data:${doc.file.contentType};base64,${doc.file.data}`
//       link.download = doc.file.filename
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//     } else {
//       console.error('No file data available for download')
//     }
//   }

//   // ✅ Reset form function
//   const resetForm = () => {
//     setDocumentData({
//       category: '',
//       issueDate: '',
//       expiryDate: '',
//       file: null,
//     })
//   }
//   const handleCloseModal = () => {
//     setModalType(null)
//     resetForm() // ✅ Reset form when modal closes
//   }

//   return (
//     <div>
//       <CCard>
//         <CCardHeader className="d-flex">
//           Documents
//           <CButton color="primary" className="ms-auto" onClick={() => setModalType('add')}>
//             Upload Documents
//           </CButton>
//         </CCardHeader>
//         <CCardBody>
//           {loading ? (
//             <p>Loading...</p>
//           ) : documents.length > 0 ? (
//             <ul
//               style={{
//                 listStyle: 'none',
//                 padding: 0,
//                 display: 'flex',
//                 gap: '15px',
//                 flexWrap: 'wrap',
//               }}
//             >
//               {documents.map((doc, index) => (
//                 <li
//                   key={index}
//                   style={{
//                     display: 'flex',
//                     flexDirection: 'column', // Stack icon and text vertically
//                     alignItems: 'center', // Center align them
//                     cursor: 'pointer',
//                   }}
//                   onClick={() => {
//                     setSelectedDocument(doc)
//                     setModalType('view')
//                   }}
//                 >
//                   <FaRegFolderClosed size={40} />
//                   <span style={{ color: 'black', marginTop: '5px' }}>{doc.category}</span>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No documents found</p>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Document Upload & Edit Modal */}
//       {(modalType === 'add' || modalType === 'edit') && (
//         <DocumentModal
//           visible={modalType === 'add' || modalType === 'edit'}
//           onClose={handleCloseModal} // Use a function to reset the form
//           onSubmit={handleSaveChanges}
//           documentData={documentData}
//           setDocumentData={setDocumentData}
//           type={modalType}
//           loadingSubmit={loadingSubmit}
//         />
//       )}

//       {/* View Document Modal */}
//       {modalType === 'view' && selectedDocument && (
//         <ViewDocumentModal
//           visible={modalType === 'view'}
//           onClose={() => setModalType(null)}
//           document={selectedDocument}
//           onEdit={() => handleEdit(selectedDocument)} // Pass document to edit
//           onDelete={() => handleDelete(selectedDocument)}
//           onDownload={() => handleDownload(selectedDocument)}
//         />
//       )}
//     </div>
//   )
// }

// export default VehicleDocuments

// import React, { useState, useEffect } from 'react'
// import { useParams } from 'react-router-dom'
// import { CCard, CCardBody, CCardHeader, CButton } from '@coreui/react'
// import DocumentModal from '../components/DocumentModal'
// import ViewDocumentModal from '../components/ViewDocumentModal'
// import { getDocuments, uploadDocuments } from './data/VehicleListData'
// import { FaRegFolderClosed } from 'react-icons/fa6'
// import { deleteDocumentAPI } from './data/VehicleListData'
// import { editDocument } from './data/VehicleListData'
// import Loader from '../../components/Loader/Loader'

// const VehicleDocuments = ({ Insurance, fitnessCertificate, rc, puc }) => {
//   const { id } = useParams()
//   const [documents, setDocuments] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [modalType, setModalType] = useState(null)
//   const [selectedDocument, setSelectedDocument] = useState(null)
//   const [loadingSubmit, setLoadingSubmit] = useState(false) // Loader state
//   const [imageSrc, setImageSrc] = useState(null) // Add this state
//   const [documentData, setDocumentData] = useState({
//     category: '',
//     issueDate: '',
//     expiryDate: '',
//     file: null,
//   })

//   useEffect(() => {
//     fetchDocuments()
//   }, [id])

//   const fetchDocuments = async () => {
//     setLoading(true)
//     try {
//       const response = await getDocuments(id)
//       if (response && response.data) {
//         setDocuments(response.data)
//       } else {
//         setDocuments([]) // ✅ Prevents setting `null`
//       }
//     } catch (error) {
//       console.error('Error fetching documents:', error)
//       setDocuments([]) // ✅ Ensures `documents` is always an array
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Handle Save code submit Doc
//   const handleSaveChanges = async () => {
//     if (documentData.length === 0 || documentData.some((doc) => !doc.category)) {
//       alert('Please fill in all required fields.')
//       return
//     }

//     setLoadingSubmit(true)

//     try {
//       await uploadDocuments(id, documentData) // Pass the whole array
//       fetchDocuments()
//       handleCloseModal()
//     } catch (error) {
//       console.error('Error uploading document:', error)
//     } finally {
//       setLoadingSubmit(false)
//     }
//   }

//   // Clear form when opening "Add Document"
//   const openAddModal = () => {
//     setDocumentData({
//       category: '',
//       issueDate: '',
//       expiryDate: '',
//       file: null,
//     })
//     setSelectedDocument(null)
//     setModalType('add')
//   }

//   const handleEdit = (doc) => {
//     console.log('Editing document:', doc)
//     setSelectedDocument(doc)
//     setDocumentData({
//       category: doc.category,
//       issueDate: doc.issueDate,
//       expiryDate: doc.expiryDate,
//       file: null, // File can't be pre-filled
//     })
//     setModalType('edit')
//   }

//   const handleDelete = async (doc) => {
//     if (window.confirm(`Are you sure you want to delete ${doc.file.filename}?`)) {
//       try {
//         await deleteDocumentAPI(id, doc._id) // Call delete API
//         fetchDocuments() // Refresh the list after deletion
//         setModalType(null)
//       } catch (error) {
//         console.error('Error deleting document:', error)
//       }
//     }
//   }

//   const handleDownload = (doc) => {
//     if (doc?.file?.data) {
//       const link = document.createElement('a')
//       link.href = `data:${doc.file.contentType};base64,${doc.file.data}`
//       link.download = doc.file.filename
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//     } else {
//       console.error('No file data available for download')
//     }
//   }

//   // ✅ Reset form function
//   const resetForm = () => {
//     setDocumentData({
//       category: '',
//       issueDate: '',
//       expiryDate: '',
//       file: null,
//     })
//   }
//   const handleCloseModal = () => {
//     setModalType(null)
//     resetForm() // ✅ Reset form when modal closes
//   }

//   const documents1 = [
//     { name: 'Insurance', value: Insurance },
//     { name: 'fitnessCertificate', value: fitnessCertificate },
//     { name: 'rc', value: rc },
//     { name: 'puc', value: puc },
//   ]

//   const hasDocuments = documents1.some((doc) => doc.value) // Check if any document exists

//   // handle document view open
//   const handleDocumentClick = async (field) => {
//     setLoading(true)
//     try {
//       const imageData = await getDocuments(id, field)
//       if (imageData) {
//         setImageSrc(imageData)
//         setSelectedDocument({ name: field, image: imageData }) // Store document name & image
//         setModalType('view') // Open modal after fetching
//       } else {
//         console.error('No image data found for this document.')
//       }
//     } catch (error) {
//       console.error('Error fetching document:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div>
//       <CCard>
//         <CCardHeader className="d-flex">
//           Documents
//           <CButton color="primary" className="ms-auto" onClick={() => setModalType('add')}>
//             Upload Documents
//           </CButton>
//         </CCardHeader>
//         <CCardBody>
//           {loading ? (
//             <div
//               style={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//               }}
//             >
//               <Loader />
//             </div>
//           ) : hasDocuments ? (
//             <ul
//               style={{
//                 display: 'flex',
//                 gap: '20px',
//                 listStyle: 'none',
//                 padding: 0,
//               }}
//             >
//               {documents1.map(
//                 (doc, index) =>
//                   doc.value && (
//                     <li
//                       key={index}
//                       style={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         cursor: 'pointer',
//                       }}
//                       onClick={() => handleDocumentClick(doc.name)}
//                     >
//                       <FaRegFolderClosed size={40} />
//                       <span style={{ color: 'black', marginTop: '5px' }}>
//                         <strong>{doc.name}</strong> {doc.value || 'Not Available'}
//                       </span>
//                     </li>
//                   ),
//               )}
//             </ul>
//           ) : (
//             <p style={{ justifyContent: 'center', textAlign: 'center' }}>No documents found.</p>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Document Upload & Edit Modal */}
//       {(modalType === 'add' || modalType === 'edit') && (
//         <DocumentModal
//           visible={modalType === 'add' || modalType === 'edit'}
//           onClose={handleCloseModal} // Use a function to reset the form
//           onSubmit={handleSaveChanges}
//           documentData={documentData}
//           setDocumentData={setDocumentData}
//           type={modalType}
//           loadingSubmit={loadingSubmit}
//         />
//       )}

//       {/* View Document Modal */}
//       {modalType === 'view' && selectedDocument && (
//         <ViewDocumentModal
//           visible={modalType === 'view'}
//           onClose={() => setModalType(null)}
//           document={selectedDocument}
//           onEdit={() => handleEdit(selectedDocument)} // Pass document to edit
//           onDelete={() => handleDelete(selectedDocument)}
//           onDownload={() => handleDownload(selectedDocument)}
//         />
//       )}
//     </div>
//   )
// }

// export default VehicleDocuments

// --------------------------------------------------------------------------------------------

// Main code you have used date 12/03/25

// import React, { useState, useEffect } from 'react'
// import { useParams } from 'react-router-dom'
// import { CCard, CCardBody, CCardHeader, CButton } from '@coreui/react'
// import DocumentModal from '../components/DocumentModal'
// import ViewDocumentModal from '../components/ViewDocumentModal'
// import { getDocuments, uploadDocuments } from './data/VehicleListData'
// import { FaRegFolderClosed } from 'react-icons/fa6'
// import { deleteDocumentAPI } from './data/VehicleListData'
// import { editDocument } from './data/VehicleListData'
// import Loader from '../../components/Loader/Loader'

// const VehicleDocuments = ({ Insurance, fitnessCertificate, rc, puc }) => {
//   const { id } = useParams()
//   const [documents, setDocuments] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [modalType, setModalType] = useState(null)
//   const [selectedDocument, setSelectedDocument] = useState(null)
//   const [loadingSubmit, setLoadingSubmit] = useState(false) // Loader state
//   const [imageSrc, setImageSrc] = useState(null) // Add this state
//   const [documentData, setDocumentData] = useState({
//     Insurance: { issueDate: '', expiryDate: '', file: null },
//     rc: { issueDate: '', expiryDate: '', file: null },
//     puc: { issueDate: '', expiryDate: '', file: null },
//     fitnessCertificate: { issueDate: '', expiryDate: '', file: null },
//   })

//   useEffect(() => {
//     fetchDocuments()
//   }, [id])

//   const fetchDocuments = async () => {
//     setLoading(true)
//     try {
//       const response = await getDocuments(id)
//       if (response && response.data) {
//         setDocuments(response.data)
//       } else {
//         setDocuments([]) //Prevents setting `null`
//       }
//     } catch (error) {
//       console.error('Error fetching documents:', error)
//       setDocuments([]) // Ensures `documents` is always an array
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSaveChanges = async (documents) => {
//     if (!documents || Object.keys(documents).length === 0) {
//       console.error('No document selected for upload.')
//       return
//     }

//     const documentType = Object.keys(documents)[0] // Get the selected document type
//     const documentData = documents[documentType] // Get the document details

//     if (!documentData || !documentData.file) {
//       console.error('No file selected for upload.')
//       return
//     }

//     console.log(`Uploading ${documentType}:`, documentData)

//     setLoadingSubmit(true)
//     try {
//       const formattedDocument = { [documentType]: documentData } // Keep API expected structure
//       await uploadDocuments(id, formattedDocument) // Pass structured data
//       fetchDocuments()
//       handleCloseModal()
//     } catch (error) {
//       console.error('Error uploading document:', error)
//     } finally {
//       setLoadingSubmit(false)
//     }
//   }

//   // Clear form when opening "Add Document"
//   const openAddModal = () => {
//     setDocumentData({
//       category: '',
//       issueDate: '',
//       expiryDate: '',
//       file: null,
//     })
//     setSelectedDocument(null)
//     setModalType('add')
//   }

//   const handleEdit = (doc) => {
//     if (!doc) {
//       console.error('No document provided for editing.')
//       return
//     }

//     console.log('Editing document:', doc)

//     setSelectedDocument(doc.category || '') // Ensure category exists

//     setDocumentData({
//       category: doc.category || '', // Default to empty if missing
//       issueDate: doc.issueDate || '', // Ensure issue date exists
//       expiryDate: doc.expiryDate || '', // Ensure expiry date exists
//       file: null, // File can't be pre-filled for security reasons
//     })

//     setModalType('edit')
//   }

//   const handleDelete = async (doc) => {
//     if (window.confirm(`Are you sure you want to delete ${doc.file.filename}?`)) {
//       try {
//         await deleteDocumentAPI(id, doc._id) // Call delete API
//         fetchDocuments() // Refresh the list after deletion
//         setModalType(null)
//       } catch (error) {
//         console.error('Error deleting document:', error)
//       }
//     }
//   }

//   const handleDownload = (doc) => {
//     if (doc?.file?.data) {
//       const link = document.createElement('a')
//       link.href = `data:${doc.file.contentType};base64,${doc.file.data}`
//       link.download = doc.file.filename
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//     } else {
//       console.error('No file data available for download')
//     }
//   }

//   //Reset form function
//   const resetForm = () => {
//     setDocumentData({
//       category: '',
//       issueDate: '',
//       expiryDate: '',
//       file: null,
//     })
//   }
//   const handleCloseModal = () => {
//     setModalType(null)
//     resetForm() // Reset form when modal closes
//   }

//   const documents1 = [
//     { name: 'Insurance', value: Insurance },
//     { name: 'fitnessCertificate', value: fitnessCertificate },
//     { name: 'rc', value: rc },
//     { name: 'puc', value: puc },
//   ]

//   const hasDocuments = documents1.some((doc) => doc.value) // Check if any document exists

//   // handle document view open
//   const handleDocumentClick = async (field) => {
//     setLoading(true)
//     try {
//       const imageData = await getDocuments(id, field)
//       if (imageData) {
//         setImageSrc(imageData)
//         setSelectedDocument({ name: field, image: imageData }) // Store document name & image
//         setModalType('view') // Open modal after fetching
//       } else {
//         console.error('No image data found for this document.')
//       }
//     } catch (error) {
//       console.error('Error fetching document:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div>
//       <CCard>
//         <CCardHeader className="d-flex">
//           Documents
//           <CButton color="primary" className="ms-auto" onClick={() => setModalType('add')}>
//             Upload Documents
//           </CButton>
//         </CCardHeader>
//         <CCardBody>
//           {loading ? (
//             <div
//               style={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//               }}
//             >
//               <Loader />
//             </div>
//           ) : hasDocuments ? (
//             <ul
//               style={{
//                 display: 'flex',
//                 gap: '20px',
//                 listStyle: 'none',
//                 padding: 0,
//               }}
//             >
//               {documents1.map(
//                 (doc, index) =>
//                   doc.value && (
//                     <li
//                       key={index}
//                       style={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         cursor: 'pointer',
//                       }}
//                       onClick={() => handleDocumentClick(doc.name)}
//                     >
//                       <FaRegFolderClosed size={40} />
//                       <span style={{ color: 'black', marginTop: '5px' }}>
//                         <strong>{doc.name}</strong> {doc.value || 'Not Available'}
//                       </span>
//                     </li>
//                   ),
//               )}
//             </ul>
//           ) : (
//             <p style={{ justifyContent: 'center', textAlign: 'center' }}>No documents found.</p>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Document Upload & Edit Modal */}
//       {(modalType === 'add' || modalType === 'edit') && (
//         <DocumentModal
//           visible={modalType === 'add' || modalType === 'edit'}
//           onClose={handleCloseModal}
//           onSubmit={handleSaveChanges} // Now expects structured data
//           loadingSubmit={loadingSubmit}
//           type={modalType}
//           documentData={documentData}
//           setDocumentData={setDocumentData}
//         />
//       )}

//       {/* View Document Modal */}
//       {modalType === 'view' && selectedDocument && (
//         <ViewDocumentModal
//           visible={modalType === 'view'}
//           onClose={() => setModalType(null)}
//           document={selectedDocument}
//           onEdit={() => handleEdit(selectedDocument)} // Pass document to edit
//           onDelete={() => handleDelete(selectedDocument)}
//           onDownload={() => handleDownload(selectedDocument)}
//         />
//       )}
//     </div>
//   )
// }

// export default VehicleDocuments

// ----------------------------------------------------------------------------------------

// experiment code

import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CButton } from '@coreui/react'
import { FaRegFolderClosed } from 'react-icons/fa6'
import DocumentModal from '../components/DocumentModal'
import ViewDocumentModal from '../components/ViewDocumentModal'
import Loader from '../../components/Loader/Loader'
import {
  getDocuments,
  uploadDocuments,
  editDocument,
  deleteDocumentAPI,
} from './data/VehicleListData'

const VehicleDocuments = ({ Insurance, fitnessCertificate, rc, puc }) => {
  const { id } = useParams()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [imageSrc, setImageSrc] = useState(null) // Add this state
  const [documentData, setDocumentData] = useState({
    Insurance: { issueDate: '', expiryDate: '', file: null },
    rc: { issueDate: '', expiryDate: '', file: null },
    puc: { issueDate: '', expiryDate: '', file: null },
    fitnessCertificate: { issueDate: '', expiryDate: '', file: null },
  })

  useEffect(() => {
    fetchDocuments()
  }, [id])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const response = await getDocuments(id)
      setDocuments(response?.data || []) // Ensure documents is always an array
    } catch (error) {
      console.error('Error fetching documents:', error)
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChanges = async (documents) => {
    const documentType = Object.keys(documents)?.[0]
    const documentData = documents?.[documentType]

    if (!documentType || !documentData?.file) {
      console.error('No file selected for upload.')
      return
    }

    setLoadingSubmit(true)
    try {
      await uploadDocuments(id, { [documentType]: documentData })
      window.location.reload()
      fetchDocuments()
      handleCloseModal()
    } catch (error) {
      console.error('Error uploading document:', error)
    } finally {
      setLoadingSubmit(false)
    }
  }

  const handleEditSubmit = async (documents) => {
    const documentType = Object.keys(documents)?.[0]
    const documentData = documents?.[documentType]

    if (!id) {
      console.error('Error: Vehicle ID is missing.')
      return
    }

    if (!documentType || !documentData) {
      console.error('Invalid document data.')
      return
    }

    setLoadingSubmit(true)
    try {
      const formData = new FormData()
      // formData.append('vehicleId', id)
      formData.append(`documents[${documentType}][issueDate]`, documentData.issueDate)
      formData.append(`documents[${documentType}][expiryDate]`, documentData.expiryDate)

      // Use document mapping to match the expected payload format
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

      await editDocument(id, formData) // Pass vehicleId separately
      fetchDocuments()
      handleCloseModal()
      window.location.reload()
    } catch (error) {
      console.error('Error editing document:', error)
    } finally {
      setLoadingSubmit(false)
    }
  }

  const handleEdit = (doc) => {
    if (!doc?.name) {
      console.error('Invalid document for editing.', doc)
      return
    }

    setSelectedDocument(doc.name)

    setDocumentData((prev) => ({
      ...prev,
      [doc.name]: {
        issueDate: doc.issueDate || '',
        expiryDate: doc.expiryDate || '',
        file: null, // User will select file
      },
    }))

    setModalType('edit')
  }

  const handleDelete = async (doc) => {
    if (!doc || !doc.name) {
      console.error('Invalid document structure', doc)
      return
    }

    const fieldName = doc.name // Example: "rc", "Insurance", etc.

    if (window.confirm(`Are you sure you want to delete the ${fieldName} document?`)) {
      try {
        const response = await deleteDocumentAPI(id, fieldName)
        window.location.reload()
        console.log('Document deleted successfully:', response)
        fetchDocuments()
        setModalType(null)
      } catch (error) {
        console.error('Error deleting document:', error.response?.data || error.message)
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
    setLoading(true)
    try {
      console.log(`Fetching document for field: ${field}`) // Debugging log
      const imageData = await getDocuments(id, field)

      console.log('Fetched Base64 Data:', imageData) // Log the base64 image

      if (imageData) {
        setImageSrc(imageData)
        setSelectedDocument({ name: field, image: imageData })
        setModalType('view')
      } else {
        console.error(`No image data found for ${field}.`)
      }
    } catch (error) {
      console.error('Error fetching document:', error)
    } finally {
      setLoading(false)
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
  ]

  const hasDocuments = documentsList.some((doc) => doc.value)

  return (
    <div>
      <CCard>
        <CCardHeader className="d-flex">
          Documents
          <CButton color="primary" className="ms-auto" onClick={openAddModal}>
            Upload Documents
          </CButton>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <Loader />
          ) : hasDocuments ? (
            <ul className="d-flex gap-3 list-unstyled">
              {documentsList.map(
                (doc, index) =>
                  doc.value && (
                    <li
                      key={index}
                      className="text-center"
                      onClick={() => handleDocumentClick(doc.name)}
                    >
                      <FaRegFolderClosed size={40} />
                      <div className="mt-1 text-black fw-bold">{doc.name}</div>
                    </li>
                  ),
              )}
            </ul>
          ) : (
            <p className="text-center">No documents found.</p>
          )}
        </CCardBody>
      </CCard>

      {/* Upload & Edit Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <DocumentModal
          visible={modalType === 'add' || modalType === 'edit'}
          onClose={handleCloseModal}
          onSubmit={modalType === 'add' ? handleSaveChanges : handleEditSubmit}
          loadingSubmit={loadingSubmit}
          type={modalType}
          documentData={documentData}
          setDocumentData={setDocumentData}
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
