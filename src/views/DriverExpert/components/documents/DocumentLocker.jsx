import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CSpinner,
  CRow,
  CCol,
} from '@coreui/react';
import { FaRegFolderClosed, FaUpload } from 'react-icons/fa6';
import DocumentUploadModal from './components/DocumentUploadModal';
import DocumentViewModal from './components/DocumentViewModal';
import Swal from 'sweetalert2';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDocuments, deleteDocumentAPI, uploadDocuments, getDocumentImage } from '../../data/drivers';

const DocumentLocker = ({ id }) => {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState({});
  const [modalType, setModalType] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const queryClient = useQueryClient();

  const { data: documentsData, isLoading: loading, error } = useQuery({
    queryKey: ['documents', id],
    queryFn: () => getDocuments(id),
    enabled: !!id,
    onError: (error) => {
      console.error('Error fetching documents:', error);
      Swal.fire('Error', 'Failed to fetch documents.', 'error');
    },
  });

  const documentsList = documentsData?.documents?.map((doc) => ({
    name: doc.documentName,
    displayName: doc.documentName,
    value: doc,
  })) || [];

  const handleUploadDocument = async (documentData) => {
    if (!documentData.documentName || !documentData.document) {
      Swal.fire('Missing Fields', 'Please provide both document name and file.', 'warning');
      return;
    }

    setLoadingSubmit(true);
    try {
      const formattedData = {
        documentName: documentData.documentName,
        document: documentData.document
      };
      await uploadDocuments(id, formattedData);
      Swal.fire('Uploaded', 'Document uploaded successfully!', 'success');
      queryClient.invalidateQueries(['documents', id]);
      setModalType(null);
    } catch (error) {
      console.error('Error uploading document:', error);
      Swal.fire('Error', 'Document upload failed.', 'error');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDelete = async (doc) => {
    if (!doc || !doc.id) {
      Swal.fire('Error', 'Invalid document structure.', 'error');
      console.error('Invalid document structure', doc);
      return;
    }

    const fieldName = doc.fileName;

    const result = await Swal.fire({
      title: `Delete ${fieldName}?`,
      text: 'Are you sure you want to delete this document? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await deleteDocumentAPI(doc.id);
        queryClient.invalidateQueries(['documents', id]);
        setModalType(null);
        Swal.fire('Deleted!', `${fieldName} was successfully deleted.`, 'success');
      } catch (error) {
        console.error('Error deleting document:', error.response?.data || error.message);
        Swal.fire('Error', `Failed to delete ${fieldName}.`, 'error');
      }
    }
  };

  const handleDownload = async (doc) => {
    if (!doc || !doc.id) {
      Swal.fire('Error', 'Invalid document structure.', 'error');
      console.error('Invalid document structure', doc);
      return;
    }

    try {
      const response = await getDocumentImage(doc.id);
      const base64String = response?.document?.image?.base64Data;
      const contentType = response?.document?.image?.contentType || 'image/jpeg';

      if (!base64String) {
        Swal.fire('Error', 'No image data found for document.', 'error');
        console.error('No image data found for document', doc);
        return;
      }

      const link = document.createElement('a');
      link.href = `data:${contentType};base64,${base64String}`;
      link.download = `${doc.name || 'document'}.${contentType.split('/')[1] || 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Swal.fire('Downloaded!', 'Document downloaded successfully.', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to download document.', 'error');
      console.error('Error downloading document:', error);
    }
  };

  const handleEdit = (doc) => {
    Swal.fire('Coming Soon', 'Edit functionality will be available soon!', 'info');
  };

  const openUploadModal = () => {
    setSelectedDocument(null);
    setModalType('upload');
  };

  const handleDocumentClick = (field) => {
    setLoadingDocs((prev) => ({ ...prev, [field]: true }));

    try {
      const doc = documentsList.find((d) => d.name === field);

      if (doc) {
        setSelectedDocument({
          id: doc.value._id,
          name: field,
          displayName: doc.displayName || field,
          fileName: `${field}.jpg`,
          uploadDate: new Date().toISOString(),
        });
        setModalType('view');
      } else {
        Swal.fire('Error', `No document data found for ${field}.`, 'error');
        console.error(`No document data found for ${field}.`);
      }
    } catch (error) {
      Swal.fire('Error', 'Error retrieving document.', 'error');
      console.error('Error processing document:', error);
    } finally {
      setLoadingDocs((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedDocument(null);
  };

  const hasDocuments = documentsList.length > 0;

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
              <CButton
                color="primary"
                variant="outline"
                onClick={openUploadModal}
              >
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

      {modalType === 'upload' && (
        <DocumentUploadModal
          visible={modalType === 'upload'}
          onClose={handleCloseModal}
          onSubmit={handleUploadDocument}
          loadingSubmit={loadingSubmit}
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
  );
};

export default DocumentLocker;
