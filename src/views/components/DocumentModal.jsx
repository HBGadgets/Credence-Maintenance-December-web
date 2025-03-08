import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CRow,
  CCol,
  CFormSelect,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilFile, cilCameraControl } from '@coreui/icons'

const DocumentModal = ({
  visible,
  onClose,
  onSubmit,
  documentData,
  setDocumentData,
  type,
  loadingSubmit,
}) => {
  return (
    <CModal visible={visible} onClose={onClose} alignment="center" size="lg">
      <CModalHeader>
        <h5>{type === 'add' ? 'Upload Vehicle Documents' : 'Edit Document'}</h5>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CRow>
            <CCol md={6}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilCameraControl} />
                </CInputGroupText>
                <CFormSelect
                  value={documentData.category}
                  onChange={(e) => setDocumentData({ ...documentData, category: e.target.value })}
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
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilCalendar} />
                </CInputGroupText>
                <CFormInput
                  type="date"
                  value={documentData.issueDate}
                  onChange={(e) => setDocumentData({ ...documentData, issueDate: e.target.value })}
                  placeholder="Issue Date"
                />
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={6}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilCalendar} />
                </CInputGroupText>
                <CFormInput
                  type="date"
                  value={documentData.expiryDate}
                  onChange={(e) => setDocumentData({ ...documentData, expiryDate: e.target.value })}
                  placeholder="Expiry Date"
                />
              </CInputGroup>
            </CCol>
            <CCol md={6}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilFile} />
                </CInputGroupText>
                <CFormInput
                  type="file"
                  accept="image/*, application/pdf"
                  onChange={(e) => setDocumentData({ ...documentData, file: e.target.files[0] })}
                />
              </CInputGroup>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={onSubmit} disabled={loadingSubmit}>
          {loadingSubmit ? 'Processing...' : type === 'add' ? 'Upload' : 'Save Changes'}
        </CButton>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default DocumentModal
