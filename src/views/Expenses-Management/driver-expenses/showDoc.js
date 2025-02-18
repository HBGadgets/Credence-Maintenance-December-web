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
  CModalFooter,
  CSpinner 
} from "@coreui/react";


const ViewDocuments = () => {
  const { id } = useParams();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); 

useEffect(() => {
  setLoading(true); // Set loading to true before fetching
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/driverExpense/${id}`)
    .then((response) => {
      console.log("Response:", response.data);
      setDocuments(response.data.documents || []); // Store documents
    })
    .catch((error) => {
      console.error("Error fetching documents:", error);
      setDocuments([]); // Set empty array if error occurs
    })
    .finally(() => {
      setLoading(false); // Set loading to false after fetching
    });
}, [id]);


  const openModal = (doc) => {
    setSelectedDocument(doc);
    setModalVisible(true);
  };

  return (
    <div>
      <h2>Uploaded Documents</h2>
      <CRow className="justify-content-center mt-4">
        {loading ? ( 
          <CCol md={6} className="text-center">
            <div className="d-flex flex-column align-items-center">
              <CSpinner color="primary" size="lg" className="mb-3" />
              <p className="fw-bold text-primary" style={{ fontSize: "18px" }}>
                Loading documents, please wait...
              </p>
            </div>
          </CCol>
        ) : documents && documents.length > 0 ? (
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
                      style={{ objectFit: "cover", borderRadius: "8px" }}
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
                      <p className="text-danger">PDF Preview not available. Click below to view.</p>
                    </object>
                  ) : (
                    <p className="text-muted">Unsupported file type</p>
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
          <CCol md={6} className="text-center">
            {/* <div className="border border-danger p-4 rounded bg-light"> */}
              <p className="fw-bold text-danger" style={{ fontSize: "18px", marginTop: '5rem' }}>
                No documents uploaded.
              </p>
            {/* </div> */}
          </CCol>
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
