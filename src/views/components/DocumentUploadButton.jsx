import { useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilFile, cilCameraControl } from '@coreui/icons'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CRow,
  CCol,
  CFormSelect,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'

const DocumentUploadButton = ({ visible, onClose, onUpload }) => {
  const [documentEntries, setDocumentEntries] = useState([
    { category: '', issueDate: '', expiryDate: '', file: null },
  ])

  const addDocumentEntry = () => {
    setDocumentEntries([
      ...documentEntries,
      { category: '', issueDate: '', expiryDate: '', file: null },
    ])
  }

  const removeDocumentEntry = (index) => {
    setDocumentEntries(documentEntries.filter((_, i) => i !== index))
  }

  const handleInputChange = (index, field, value) => {
    const updatedEntries = [...documentEntries]
    updatedEntries[index][field] = value
    setDocumentEntries(updatedEntries)
  }

  const handleFileChange = (index, file) => {
    if (!file) return

    const updatedEntries = [...documentEntries]
    updatedEntries[index].file = file // ✅ Store file directly
    setDocumentEntries(updatedEntries)
  }

  const handleUpload = () => {
    onUpload(documentEntries)
    setDocumentEntries([{ category: '', issueDate: '', expiryDate: '', file: null }]) // Reset form
    onClose()
  }

  return (
    <CModal visible={visible} onClose={onClose} alignment="center" size="lg">
      <CModalHeader>
        <h5>Upload Documents</h5>
      </CModalHeader>
      <CModalBody>
        <CForm>
          {documentEntries.map((entry, index) => (
            <div key={index} className="mb-3 border p-3 rounded">
              <CRow>
                <CCol md={6}>
                  <label className="form-label">Category</label>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilCameraControl} />
                    </CInputGroupText>
                    <CFormSelect
                      value={entry.category}
                      onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                    >
                      <option value="">Select Category</option>
                      <option value="PUC">PUC</option>
                      <option value="RC">RC</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Fitness Certificate">Fitness Certificate</option>
                    </CFormSelect>
                  </CInputGroup>
                </CCol>
                <CCol md={6}>
                  <label className="form-label">Issue Date</label>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilCalendar} />
                    </CInputGroupText>
                    <CFormInput
                      type="date"
                      value={entry.issueDate}
                      onChange={(e) => handleInputChange(index, 'issueDate', e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <CRow className="mt-3">
                <CCol md={6}>
                  <label className="form-label">Expiry Date</label>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilCalendar} />
                    </CInputGroupText>
                    <CFormInput
                      type="date"
                      value={entry.expiryDate}
                      onChange={(e) => handleInputChange(index, 'expiryDate', e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={6}>
                  <label className="form-label">Upload File</label>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilFile} />
                    </CInputGroupText>
                    <CFormInput
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(index, e.target.files[0])}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              {entry.file && (
                <div className="mt-2 text-center">
                  <strong>Preview:</strong> {entry.file.name}
                </div>
              )}

              <CButton
                color="danger"
                size="sm"
                className="mt-2"
                onClick={() => removeDocumentEntry(index)}
              >
                Remove
              </CButton>
            </div>
          ))}

          <CButton color="success" className="mt-2" onClick={addDocumentEntry}>
            + Add More
          </CButton>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleUpload}>
          Upload
        </CButton>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default DocumentUploadButton
