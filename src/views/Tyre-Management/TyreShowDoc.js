import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
  CCard, 
  CCardBody, 
  CCardHeader, 
  CButton, 
  CRow, 
  CCol, 
  CModal, 
  CModalHeader, 
  CModalBody, 
  CModalFooter 
} from "@coreui/react";

const ViewDocuments = () => {
  const { id } = useParams();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/tyre/${id}`)
      .then((response) => {
        console.log("Response:", response.data);
        setDocuments(response.data.documents || []);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  }, [id]);

  const openModal = (doc) => {
    setSelectedDocument(doc);
    setModalVisible(true);
  };

  return (
    <div>
      <h2>Uploaded Documents</h2>
      <CRow>
        {documents.length > 0 ? (
          documents.map((doc, index) => (
            <CCol md={4} key={index} className="mb-3">
              <CCard className="shadow-sm h-100">
                <CCardHeader>{doc.filename}</CCardHeader>
                <CCardBody className="text-center">
                  {doc.contentType.startsWith("image/") ? (
                    <img
                      src={`data:${doc.contentType};base64,${doc.data}`} 
                      alt={doc.filename}
                      width="100%"
                      height="200"
                      style={{ objectFit: "cover" }}
                      onClick={() => openModal(doc)}
                      className="cursor-pointer"
                    />
                  ) : doc.contentType === "application/pdf" ? (
                    <object
                      data={`data:${doc.contentType};base64,${doc.data}`}
                      type="application/pdf"
                      width="100%"
                      height="200"
                      className="border"
                      onClick={() => openModal(doc)}
                    >
                      <p>PDF Preview not available. Click below to view.</p>
                    </object>
                  ) : (
                    <p>Unsupported file type</p>
                  )}
                </CCardBody>
                <div className="m-auto mb-2">
                <CButton color="primary" onClick={() => openModal(doc)}>
                  View
                </CButton>
                <CButton color="success" className="ms-2">
                  <a 
                    href={`data:${doc.contentType};base64,${doc.data}`} 
                    download={doc.filename} 
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Download
                  </a>
                </CButton>
                </div>
              </CCard>
            </CCol>
          ))
        ) : (
          <p>No documents uploaded.</p>
        )}
      </CRow>

      {/* Modal for Viewing Documents */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <CModalHeader>
          <h5>{selectedDocument?.filename}</h5>
        </CModalHeader>
        <CModalBody className="text-center">
          {selectedDocument?.contentType.startsWith("image/") ? (
            <img
              src={`data:${selectedDocument.contentType};base64,${selectedDocument.data}`} 
              alt={selectedDocument.filename}
              width="100%"
            />
          ) : selectedDocument?.contentType === "application/pdf" ? (
            <iframe
              src={`data:${selectedDocument.contentType};base64,${selectedDocument.data}`}
              width="100%"
              height="600px"
            ></iframe>
          ) : (
            <p>Unsupported file type</p>

)}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ViewDocuments;
