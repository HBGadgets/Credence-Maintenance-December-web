// import React, { useState } from 'react'
// import {
//   CModal,
//   CModalHeader,
//   CModalBody,
//   CModalFooter,
//   CButton,
//   CForm,
//   CRow,
//   CCol,
//   CFormInput,
//   CInputGroup,
//   CInputGroupText,
//   CFormCheck,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import { cilCalendar, cilFile } from '@coreui/icons'

// const DocumentModal = ({ visible, onClose, onSubmit, loadingSubmit }) => {
//   const [selectedDocument, setSelectedDocument] = useState('insurance') // Default selection
//   const [documents, setDocuments] = useState({
//     insurance: { issueDate: '', expiryDate: '', file: null },
//     rc: { issueDate: '', expiryDate: '', file: null },
//     puc: { issueDate: '', expiryDate: '', file: null },
//     fitnessCertificate: { issueDate: '', expiryDate: '', file: null },
//   })

//   const handleInputChange = (type, field, value) => {
//     setDocuments((prev) => ({
//       ...prev,
//       [type]: { ...prev[type], [field]: value },
//     }))
//   }

//   const handleFileChange = (type, file) => {
//     setDocuments((prev) => ({
//       ...prev,
//       [type]: { ...prev[type], file },
//     }))
//   }

//   const handleSubmit = () => {
//     if (!selectedDocument) {
//       console.error('No document type selected.')
//       return
//     }

//     const documentData = documents[selectedDocument]

//     if (!documentData || !documentData.file) {
//       console.error('No file selected for upload.')
//       return
//     }

//     const selectedData = { [selectedDocument]: documentData } // Format correctly
//     console.log('Sending selected document:', selectedData)
//     onSubmit(selectedData)
//   }

//   const renderDocumentForm = (title, type) => (
//     <div className={`mb-3 p-3 border rounded ${selectedDocument === type ? '' : 'd-none'}`}>
//       <h6>{title}</h6>
//       <CRow>
//         <CCol md={6}>
//           <CInputGroup>
//             <CInputGroupText>
//               <CIcon icon={cilCalendar} />
//             </CInputGroupText>
//             <CFormInput
//               type="date"
//               value={documents[type].issueDate}
//               onChange={(e) => handleInputChange(type, 'issueDate', e.target.value)}
//             />
//           </CInputGroup>
//         </CCol>
//         <CCol md={6}>
//           <CInputGroup>
//             <CInputGroupText>
//               <CIcon icon={cilCalendar} />
//             </CInputGroupText>
//             <CFormInput
//               type="date"
//               value={documents[type].expiryDate}
//               onChange={(e) => handleInputChange(type, 'expiryDate', e.target.value)}
//             />
//           </CInputGroup>
//         </CCol>
//       </CRow>
//       <CRow className="mt-2">
//         <CCol md={12}>
//           <CInputGroup>
//             <CInputGroupText>
//               <CIcon icon={cilFile} />
//             </CInputGroupText>
//             <CFormInput
//               type="file"
//               accept="image/*, application/pdf"
//               onChange={(e) => handleFileChange(type, e.target.files[0])}
//             />
//           </CInputGroup>
//         </CCol>
//       </CRow>
//     </div>
//   )

//   return (
//     <CModal visible={visible} onClose={onClose} alignment="center" size="lg">
//       <CModalHeader>
//         <h5>Upload Vehicle Documents</h5>
//       </CModalHeader>
//       <CModalBody>
//         <CForm>
//           <h6>Select Document Type</h6>
//           <CRow className="mb-3">
//             {['insurance', 'rc', 'puc', 'fitnessCertificate'].map((doc) => (
//               <CCol key={doc} md={3}>
//                 <CFormCheck
//                   type="radio"
//                   name="documentType"
//                   id={doc}
//                   label={doc.toUpperCase()}
//                   checked={selectedDocument === doc}
//                   onChange={() => setSelectedDocument(doc)}
//                 />
//               </CCol>
//             ))}
//           </CRow>

//           {renderDocumentForm('Insurance', 'insurance')}
//           {renderDocumentForm('RC', 'rc')}
//           {renderDocumentForm('PUC', 'puc')}
//           {renderDocumentForm('Fitness Certificate', 'fitnessCertificate')}
//         </CForm>
//       </CModalBody>
//       <CModalFooter>
//         <CButton color="primary" onClick={handleSubmit} disabled={loadingSubmit}>
//           {loadingSubmit ? 'Processing...' : 'Upload Document'}
//         </CButton>
//         <CButton color="secondary" onClick={onClose}>
//           Cancel
//         </CButton>
//       </CModalFooter>
//     </CModal>
//   )
// }

// export default DocumentModal
// -------------------------------------------------------------------------------

// experiment code

import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CRow,
  CCol,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilFile } from '@coreui/icons'

const DocumentModal = ({ visible, onClose, onSubmit, loadingSubmit, initialData = {} }) => {
  const [selectedDocument, setSelectedDocument] = useState('Insurance')
  const [documents, setDocuments] = useState({
    Insurance: { issueDate: '', expiryDate: '', file: null },
    rc: { issueDate: '', expiryDate: '', file: null },
    puc: { issueDate: '', expiryDate: '', file: null },
    fitnessCertificate: { issueDate: '', expiryDate: '', file: null },
  })

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setDocuments((prev) => ({
        ...prev,
        ...initialData,
      }))
      setSelectedDocument(Object.keys(initialData)[0])
    }
  }, [initialData])

  const handleInputChange = (type, field, value) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }))
  }

  const handleFileChange = (type, file) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: { ...prev[type], file },
    }))
  }

  const handleSubmit = () => {
    if (!selectedDocument) {
      toast.error('No document type selected.')
      console.error('No document type selected.')
      return
    }

    const documentData = documents[selectedDocument]

    if (!documentData || !documentData.file) {
      toast.error('No file selected for upload.')
      console.error('No file selected for upload.')
      return
    }

    if (!documentData.issueDate || !documentData.expiryDate) {
      toast.error('Please provide both issue and expiry dates.')
      console.error('Please provide both issue and expiry dates.')
      return
    }

    onSubmit({ [selectedDocument]: documentData })
  }

  return (
    <CModal visible={visible} onClose={onClose} alignment="center" size="lg">
      <CModalHeader>
        <h5>Upload Vehicle Documents</h5>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <h6>Select Document Type</h6>
          <CRow className="mb-3">
            {Object.keys(documents).map((doc) => (
              <CCol key={doc} md={3}>
                <CFormCheck
                  type="radio"
                  name="documentType"
                  id={doc}
                  label={doc.toUpperCase()}
                  checked={selectedDocument === doc}
                  onChange={() => setSelectedDocument(doc)}
                />
              </CCol>
            ))}
          </CRow>

          {Object.keys(documents).map((doc) => (
            <div
              key={doc}
              className={`mb-3 p-3 border rounded ${selectedDocument === doc ? '' : 'd-none'}`}
            >
              <h6>{doc.toUpperCase()}</h6>
              <CRow>
                <CCol md={6}>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilCalendar} />
                    </CInputGroupText>
                    <CFormInput
                      type="date"
                      value={documents[doc].issueDate}
                      onChange={(e) => handleInputChange(doc, 'issueDate', e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={6}>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilCalendar} />
                    </CInputGroupText>
                    <CFormInput
                      type="date"
                      value={documents[doc].expiryDate}
                      onChange={(e) => handleInputChange(doc, 'expiryDate', e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow className="mt-2">
                <CCol md={12}>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilFile} />
                    </CInputGroupText>
                    <CFormInput
                      type="file"
                      accept="image/*, application/pdf"
                      onChange={(e) => handleFileChange(doc, e.target.files[0])}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
            </div>
          ))}
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleSubmit} disabled={loadingSubmit}>
          {loadingSubmit ? 'Processing...' : 'Upload Document'}
        </CButton>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default DocumentModal
