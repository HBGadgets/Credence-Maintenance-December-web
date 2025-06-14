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
  CFormText,
  CFormLabel,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilFile } from '@coreui/icons'
import Swal from 'sweetalert2'

const DocumentModal = ({ visible, onClose, onSubmit, loadingSubmit, initialData = {}, selectedDocument, type }) => {
  const [documents, setDocuments] = useState({
    Insurance: { issueDate: '', expiryDate: '', file: null },
    rc: { issueDate: '', expiryDate: '', file: null },
    puc: { issueDate: '', expiryDate: '', file: null },
    fitnessCertificate: { issueDate: '', expiryDate: '', file: null },
  })
  const [currentDocument, setCurrentDocument] = useState(selectedDocument || 'Insurance')
console.log("isloding", loadingSubmit);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setDocuments(prev => ({
        ...prev,
        ...initialData,
      }))
      if (selectedDocument) {
        setCurrentDocument(selectedDocument)
      }
    }
  }, [initialData, selectedDocument])

  const handleInputChange = (type, field, value) => {
    setDocuments(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }))
  }

  const handleFileChange = (type, file) => {
    setDocuments(prev => ({
      ...prev,
      [type]: { ...prev[type], file },
    }))
  }

  const handleSubmit = () => {
    if (!currentDocument) {
      Swal.fire('Error', 'No document type selected.', 'error')
      return
    }
    const documentData = documents[currentDocument]
    if (type === 'add' && !documentData.file) {
      Swal.fire('Error', 'No file selected for upload.', 'error')
      return
    }
    if (!documentData.issueDate || !documentData.expiryDate) {
      Swal.fire('Error', 'Please provide both issue and expiry dates.', 'error')
      return
    }
    onSubmit({ [currentDocument]: documentData })
  }

  return (
    <CModal visible={visible} onClose={onClose} alignment="center" size="lg">
      <CModalHeader>
        <h5>{type === 'edit' ? 'Edit Document' : 'Upload Vehicle Documents'}</h5>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <h6>Select Document Type</h6>
          <CRow className="mb-3">
            {Object.keys(documents).map(doc => (
              <CCol key={doc} md={3}>
                <CFormCheck
                  type="radio"
                  name="documentType"
                  id={doc}
                  label={doc.toUpperCase()}
                  checked={currentDocument === doc}
                  onChange={() => setCurrentDocument(doc)}
                  disabled={type === 'edit' && doc !== selectedDocument}
                />
              </CCol>
            ))}
          </CRow>
          {Object.keys(documents).map(doc => (
            <div
              key={doc}
              className={`mb-3 p-3 border rounded ${currentDocument === doc ? '' : 'd-none'}`}
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
                      onChange={e => handleInputChange(doc, 'issueDate', e.target.value)}
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
                      onChange={e => handleInputChange(doc, 'expiryDate', e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow className="mt-2">
                <CCol md={12}>
                  <CFormLabel>Upload Document (PDF or Image)</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilFile} />
                    </CInputGroupText>
                    <CFormInput
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={e => handleFileChange(doc, e.target.files[0])}
                    />
                  </CInputGroup>
                  <CFormText className="text-muted">Allowed formats: PDF, JPG, PNG, etc.</CFormText>
                </CCol>
              </CRow>
            </div>
          ))}
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleSubmit} disabled={loadingSubmit}>
          {loadingSubmit ? 'Processing...' : type === 'edit' ? 'Update Document' : 'Upload Document'}
        </CButton>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default DocumentModal