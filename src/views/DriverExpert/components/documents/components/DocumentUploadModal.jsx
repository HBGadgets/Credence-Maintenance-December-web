import React, { useState } from 'react';
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CSpinner,
  CAlert,
  CRow,
  CCol
} from '@coreui/react';
import { FaUpload, FaFile, FaTimes } from 'react-icons/fa';

const DocumentUploadModal = ({ 
  visible, 
  onClose, 
  onSubmit, 
  loadingSubmit = false
}) => {
  const [documentName, setDocumentName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid file type (JPEG, JPG, PNG, or PDF)');
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!documentName.trim()) {
      setError('Please enter a document name');
      return;
    }

    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    // Clear any previous errors
    setError('');

    // Prepare document data
    const documentData = {
      documentName: documentName.trim(),
      document: selectedFile
    };

    console.log('Submitting document data:', documentData);

    // Call the parent submit handler
    onSubmit(documentData);
  };

  const handleClose = () => {
    // Reset form state
    setDocumentName('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
    onClose();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
  };

  return (
    <CModal
      visible={visible}
      onClose={handleClose}
      size="lg"
      backdrop="static"
      keyboard={false}
    >
      <CModalHeader>
        <CModalTitle>
          <FaUpload className="me-2" />
          Upload Document
        </CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CForm>
          {error && (
            <CAlert color="danger" className="mb-3">
              {error}
            </CAlert>
          )}

          <CRow className="mb-3">
            <CCol>
              <CFormLabel htmlFor="documentName">
                Document Name <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                type="text"
                id="documentName"
                placeholder="Enter document name (e.g., Driving License, Passport, etc.)"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                disabled={loadingSubmit}
              />
              <small className="text-muted">
                Give your document a clear, descriptive name for easy identification
              </small>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol>
              <CFormLabel htmlFor="documentFile">
                Select File <span className="text-danger">*</span>
              </CFormLabel>
              
              {!selectedFile ? (
                <div className="upload-area">
                  <input
                    type="file"
                    id="documentFile"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    disabled={loadingSubmit}
                  />
                  <label 
                    htmlFor="documentFile" 
                    className="upload-label"
                    style={{
                      display: 'block',
                      padding: '2rem',
                      border: '2px dashed #ccc',
                      borderRadius: '8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    <FaUpload size={32} className="text-muted mb-2" />
                    <div className="text-muted">
                      <strong>Click to select file</strong> or drag and drop
                    </div>
                    <small className="text-muted">
                      Supported formats: JPEG, JPG, PNG, PDF (Max 5MB)
                    </small>
                  </label>
                </div>
              ) : (
                <div className="selected-file-preview">
                  <div 
                    className="file-preview-card"
                    style={{
                      border: '1px solid #dee2e6',
                      borderRadius: '8px',
                      padding: '1rem',
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <FaFile className="me-2 text-primary" size={20} />
                        <div>
                          <div className="fw-semibold">{selectedFile.name}</div>
                          <small className="text-muted">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </small>
                        </div>
                      </div>
                      <CButton
                        color="danger"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        disabled={loadingSubmit}
                      >
                        <FaTimes />
                      </CButton>
                    </div>

                    {previewUrl && (
                      <div className="mt-3">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '200px',
                            objectFit: 'contain',
                            borderRadius: '4px',
                            border: '1px solid #dee2e6'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <small className="text-muted">
                Upload clear, readable images or PDF files of your document
              </small>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>

      <CModalFooter>
        <CButton
          color="secondary"
          onClick={handleClose}
          disabled={loadingSubmit}
        >
          Cancel
        </CButton>
        <CButton
          color="primary"
          onClick={handleSubmit}
          disabled={loadingSubmit || !documentName.trim() || !selectedFile}
        >
          {loadingSubmit ? (
            <>
              <CSpinner size="sm" className="me-2" />
              Uploading...
            </>
          ) : (
            <>
              <FaUpload className="me-2" />
              Upload Document
            </>
          )}
        </CButton>
      </CModalFooter>

      <style jsx>{`
        .upload-label:hover {
          border-color: #007bff !important;
          background-color: #e7f3ff !important;
        }
        
        .upload-area input[type="file"] {
          opacity: 0;
          position: absolute;
          z-index: -1;
        }
      `}</style>
    </CModal>
  );
};

export default DocumentUploadModal;