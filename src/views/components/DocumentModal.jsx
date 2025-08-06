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
import Select from 'react-select'

// List of insurance companies
const insuranceCompanies = [
  // --- General Insurance Companies (Vehicle Insurance Providers) ---
  'New India Assurance Co. Ltd.',
  'United India Insurance Co. Ltd.',
  'Oriental Insurance Co. Ltd.',
  'National Insurance Co. Ltd.',
  'SBI General Insurance Co. Ltd.',
  'ICICI Lombard General Insurance Co. Ltd.',
  'HDFC ERGO General Insurance Co. Ltd.',
  'Bajaj Allianz General Insurance Co. Ltd.',
  'Tata AIG General Insurance Co. Ltd.',
  'Reliance General Insurance Co. Ltd.',
  'Kotak Mahindra General Insurance Co. Ltd.',
  'Future Generali India Insurance Co. Ltd.',
  'IFFCO Tokio General Insurance Co. Ltd.',
  'Shriram General Insurance Co. Ltd.',
  'Universal Sompo General Insurance Co. Ltd.',
  'Cholamandalam MS General Insurance Co. Ltd.',
  'Liberty General Insurance Ltd.',
  'Magma HDI General Insurance Co. Ltd.',
  'Go Digit General Insurance Ltd.',
  'ACKO General Insurance Ltd.',
  'Navi General Insurance Ltd.',
  'Raheja QBE General Insurance Co. Ltd.',
  'Zuno General Insurance Ltd.',
  'Royal Sundaram General Insurance Co. Ltd.',
  'Aditya Birla General Insurance Co. Ltd.',
  'Zurich Kotak General Insurance Co. Ltd.',
  'ReliCoop General Insurance Ltd.',
  'Agrasen Insurance Co.',
  'Samasta General Insurance',
  'Kshema General Insurance Ltd.',
  'ManipalCigna Health Insurance (entering motor)',
  'Star Health and Allied Insurance (expanding to motor)',
  'Care Health Insurance Ltd.',
  'DHFL General Insurance',

  // --- Life Insurance Companies (IRDAI-registered, non-motor) ---
  'Life Insurance Corporation of India',
  'HDFC Life Insurance Co. Ltd.',
  'ICICI Prudential Life Insurance Co. Ltd.',
  'SBI Life Insurance Co. Ltd.',
  'Kotak Mahindra Life Insurance Co. Ltd.',
  'Bajaj Allianz Life Insurance Co. Ltd.',
  'Tata AIA Life Insurance Co. Ltd.',
  'Max Life Insurance Co. Ltd.',
  'PNB MetLife India Insurance Co. Ltd.',
  'Exide Life Insurance Co. Ltd.',
  'Aditya Birla Sun Life Insurance Co. Ltd.',
  'Reliance Nippon Life Insurance Co. Ltd.',
  'Aviva Life Insurance Co. India Ltd.',
  'Aegon Life Insurance Co. Ltd.',
  'Canara HSBC Life Insurance Co. Ltd.',
  'Shriram Life Insurance Co. Ltd.',
  'Sahara India Life Insurance Co. Ltd.',
  'Bharti AXA Life Insurance Co. Ltd.',
  'IndiaFirst Life Insurance Co. Ltd.',
  'Star Union Dai-ichi Life Insurance Co. Ltd.',
  'Future Generali India Life Insurance Co. Ltd.',
  'IDBI Federal Life Insurance Co. Ltd.',
  'Pramerica Life Insurance Co. Ltd.',
  'DHFL Pramerica Life Insurance Co. Ltd.',
  'Edelweiss Tokio Life Insurance Co. Ltd.',
  'Aviva Life Insurance Co. Ltd.',
  'Aegon Religare Life Insurance Co. Ltd.',
  'LIC Housing Finance Insurance Division',
  'Kotak Mahindra Old Mutual Life Insurance',
  'Reliance Life Insurance Co. Ltd.',
  'ICICI Prudential Pension Fund Management Co. Ltd.',
  'HDFC Pension Management Co. Ltd.',
  'Max Bupa Life Insurance Co. Ltd.',
  'Navi Life Insurance',
  'Sundaram Life Insurance',
  'Bandhan Life Insurance Co. Ltd.',
  'Shriram Life Insurance South',
  'Baroda Sun Life Insurance',
  'SBI Pension Funds Pvt. Ltd.',
  'YES Bank Life Insurance (JV)',
  'Unity Life Insurance Co. Ltd.',
  'Utkarsh Life Insurance',
  'India Shelter Life Insurance',
  'Samunnati Life Insurance',
  'Mahindra Life Insurance Co. Ltd.',
  'Disha Life Insurance',
  'Vistaar Life Insurance',
  'Unity General & Life Insurance',
  'Grameen Life Insurance Ltd.',
  'Karuna Life Insurance',
  'VimoSEWA Life Insurance',
  'Shakti Life Insurance',
  'Samriddhi Life Insurance',
  'Vishwas Life Insurance Ltd.',
  'Ayushman Life Insurance Co. Ltd.',
  'Aarogya Life Insurance',
  'Suraksha Life Insurance',
  'Sampoorn Life Insurance Ltd.',
  'JanaSakhi Life Insurance',
  'Muthoottu Mini Life Insurance',
  'Dvara KGFS Life Insurance',
  'Anandalok Life Insurance',
  'SEWA Life Insurance',
  'Karvy Life Insurance',
  'Bharat Life Insurance',
  'Gramin Jeevan Life Insurance',
  'Pragati Life Insurance Ltd.',
  'Other Insurance Company',
]

const insuranceOptions = insuranceCompanies.map((companyName) => ({
  value: companyName,
  label: companyName,
}))

const DocumentModal = ({
  visible,
  onClose,
  onSubmit,
  loadingSubmit,
  initialData = {},
  selectedDocument,
  type,
}) => {
  const [documents, setDocuments] = useState({
    Insurance: { issueDate: '', expiryDate: '', file: null, companyName: '' },
    rc: { issueDate: '', expiryDate: '', file: null, companyName: '' },
    puc: { issueDate: '', expiryDate: '', file: null, companyName: '' },
    fitnessCertificate: { issueDate: '', expiryDate: '', file: null, companyName: '' },
  })

  const [currentDocument, setCurrentDocument] = useState(selectedDocument || 'Insurance')

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setDocuments((prev) => {
        const updated = { ...prev }
        Object.keys(initialData).forEach((key) => {
          updated[key] = {
            ...prev[key],
            ...initialData[key],
          }
        })
        return updated
      })
    }

    if (selectedDocument) {
      setCurrentDocument(selectedDocument)
    }
  }, [initialData, selectedDocument])

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
    if (!currentDocument) {
      Swal.fire('Error', 'No document type selected.', 'error')
      return
    }

    const { file, issueDate, expiryDate, companyName } = documents[currentDocument]

    if (type === 'add' && !file) {
      Swal.fire('Error', 'No file selected for upload.', 'error')
      return
    }

    if (!issueDate || !expiryDate) {
      Swal.fire('Error', 'Please provide both issue and expiry dates.', 'error')
      return
    }

    if (!companyName || companyName === '') {
      Swal.fire('Error', 'Please provide company name.', 'error')
      return
    }

    const payload = {
      [currentDocument]: {
        file,
        issueDate,
        expiryDate,
        companyName,
      },
    }

    console.log('Final Payload:', payload)
    onSubmit(payload)
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
            {Object.keys(documents).map((doc) => (
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

          {Object.keys(documents).map((doc) => (
            <div
              key={doc}
              className={`mb-3 p-3 border rounded ${currentDocument === doc ? '' : 'd-none'}`}
            >
              <h6>{doc.toUpperCase()}</h6>

              {doc === 'Insurance' ? (
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel>Enter Company Name</CFormLabel>
                    <Select
                      options={insuranceOptions}
                      value={insuranceOptions.find(
                        (option) => option.value === documents[doc]?.companyName,
                      )}
                      onChange={(selectedOption) =>
                        handleInputChange(doc, 'companyName', selectedOption?.value || '')
                      }
                      placeholder="-- Select Company --"
                    />
                  </CCol>
                </CRow>
              ) : (
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel>Enter Company Name</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Enter Company Name"
                      value={documents[doc]?.companyName || ''}
                      onChange={(e) => handleInputChange(doc, 'companyName', e.target.value)}
                    />
                  </CCol>
                </CRow>
              )}

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
                  <CFormLabel>Upload Document (PDF or Image)</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilFile} />
                    </CInputGroupText>
                    <CFormInput
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(doc, e.target.files[0])}
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
          {loadingSubmit
            ? 'Processing...'
            : type === 'edit'
              ? 'Update Document'
              : 'Upload Document'}
        </CButton>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default DocumentModal
