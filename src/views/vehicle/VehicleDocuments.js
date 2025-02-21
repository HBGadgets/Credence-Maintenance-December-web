import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilCalendar, cilFile, cilCameraControl, cilPencil, cilTrash, cilCloudDownload, cilZoom} from "@coreui/icons";
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
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText
} from "@coreui/react";

const VehicleDocuments = () => {
  const { id } = useParams();
  const [documents, setDocuments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [documentEntries, setDocumentEntries] = useState([
    { category: "", issueDate: "", expiryDate: "", file: null },
  ]);

  useEffect(() => {
    fetchDocuments();
  }, [id]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/extendedVehicle/vehicleDoc/${id}`);
      setDocuments(response.data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new empty document entry
  const addDocumentEntry = () => {
    setDocumentEntries([...documentEntries, { category: "", issueDate: "", expiryDate: "", file: null }]);
  };

  // Handle removing a document entry
  const removeDocumentEntry = (index) => {
    const updatedEntries = documentEntries.filter((_, i) => i !== index);
    setDocumentEntries(updatedEntries);
  };

  // Handle input change for each document entry
  const handleInputChange = (index, field, value) => {
    const updatedEntries = [...documentEntries];
    updatedEntries[index][field] = value;
    setDocumentEntries(updatedEntries);
  };

  // Handle file upload change
  const handleFileChange = (index, file) => {
    const updatedEntries = [...documentEntries];
    updatedEntries[index].file = file;
    setDocumentEntries(updatedEntries);
  };

  // Handle form submission
  const handleUpload = async () => {
    const formData = new FormData();
    documentEntries.forEach((entry, index) => {
      if (!entry.category || !entry.issueDate || !entry.expiryDate || !entry.file) {
        alert("Please fill all fields and select a file for each entry.");
        return;
      }
      formData.append("categories[]", entry.category);
      formData.append("issueDates[]", entry.issueDate);
      formData.append("expiryDates[]", entry.expiryDate);
      formData.append("files", entry.file);
    });
  
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/extendedVehicle/vehicleDoc/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchDocuments();
      setModalVisible(false);
      setDocumentEntries([{ category: "", issueDate: "", expiryDate: "", file: null }]); // Reset form
    } catch (error) {
      console.error("Error uploading documents:", error);
    }
  };

  const deleteDocument = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/extendedVehicle/vehicleDoc/${id}/${documentId}`);
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // Handle edit button click
  const handleEditClick = (doc) => {
    setSelectedDocument(doc);
    setEditModalVisible(true);
  };

  // Handle download
  const handleDownload = (doc) => {
    const link = document.createElement("a");
    link.href = `data:${doc.file.contentType};base64,${doc.file.data}`;
    link.download = doc.file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditDocument = async () => {
    if (!selectedDocument) return;
  
    // Create FormData to handle text and file updates
    const formData = new FormData();
    formData.append("category", selectedDocument.category);
    formData.append("issueDate", selectedDocument.issueDate);
    formData.append("expiryDate", selectedDocument.expiryDate);
    // If a new file is selected in the edit modal, include it.
    if (selectedDocument.newFile) {
      formData.append("file", selectedDocument.newFile);
    }
  
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/extendedVehicle/vehicleDoc/${id}/${selectedDocument._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      fetchDocuments(); // Refresh documents after update
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleViewClick = (doc) => {
    setSelectedDocument(doc);
    setViewModalVisible(true);
  };

  return (
    <div>
      <CCard>
        <CCardHeader className="d-flex">
          Documents
          <CButton color="primary" className="ms-auto" onClick={() => setModalVisible(true)}>
        Upload Documents
      </CButton>

        </CCardHeader>
        <CCardBody style={{marginTop:'-0.5rem'}}>
                {/* Display Uploaded Documents */}
                <CRow className="justify-content-center">
  {loading ? (
    <CCol md={6} className="text-center">
      <p className="fw-bold text-primary">Loading documents...</p>
    </CCol>
  ) : documents.length > 0 ? (
    <div className="row g-3 gap-3 mt-0">
      {documents.map((doc, index) => (
        <div
          key={index}
          className="col-auto text-center"
          style={{ width: "7rem", marginTop:'0rem' }}
        >
          {/* Document category with truncation */}
          <h6
            className="text-truncate"
            title={doc.category}
            style={{ marginBottom: "0.5rem", }}
          >
            {doc.category}
          </h6>

          {/* Preview Container with Shadow */}
          <div
            style={{
              width: "7rem",
              height: "7rem",
              borderRadius: "1rem",
              // boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.3)",
              border: "1px solid grey",
              overflow: "hidden",
              margin: "0 auto",
              marginBottom: "0.5rem",
              padding:'0.5rem'
            }}
          >
            {doc.file.contentType.startsWith("image/") ? (
              <img
                src={`data:${doc.file.contentType};base64,${doc.file.data}`}
                alt={doc.file.filename}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : doc.file.contentType === "application/pdf" ? (
              <object
                data={`data:${doc.file.contentType};base64,${doc.file.data}`}
                type="application/pdf"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <p className="text-danger">PDF preview not available.</p>
              </object>
            ) : (
              <p className="text-muted">Unsupported file type</p>
            )}
          </div>

          {/* Action Icons Container */}
          <div
            style={{
              width: "7rem",
              borderRadius: "0.5rem",
              padding: "0.25rem",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              margin: "0 auto",
              border: "1px solid rgba(10, 10, 10, 0.21)",
              boxShadow: "2px 2px 2px rgba(10, 10, 10, 0.2)",
            }}
          >
            <CIcon
              icon={cilZoom}
              size="sm"
              className="text-info"
              style={{ cursor: "pointer" }}
              onClick={() => handleViewClick(doc)}
            />
            <CIcon
              icon={cilCloudDownload}
              size="sm"
              className="text-success"
              style={{ cursor: "pointer" }}
              onClick={() => handleDownload(doc)}
            />
            <CIcon
              icon={cilPencil}
              size="sm"
              className="text-warning"
              style={{ cursor: "pointer" }}
              onClick={() => handleEditClick(doc)}
            />
            <CIcon
              icon={cilTrash}
              size="sm"
              className="text-danger"
              style={{ cursor: "pointer" }}
              onClick={() => deleteDocument(doc._id)}
            />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <CCol md={6} className="text-center">
      <p className="fw-bold text-danger">No documents uploaded.</p>
    </CCol>
  )}
</CRow>



        </CCardBody>
      </CCard>

      {/* Upload Documents Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} alignment="center" size="lg" >
        <CModalHeader>
          <h5>Upload Vehicle Documents</h5>
        </CModalHeader>
          <CModalBody>
            <CForm>
              {documentEntries.map((entry, index) => (
                <div key={index} className="mb-3 border p-3 rounded">
                  <CRow>
                    {/* Category Field */}
                    <CCol md={6}>
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilCameraControl} />
                        </CInputGroupText>
                      <CFormSelect
                        value={entry.category}
                        onChange={(e) => handleInputChange(index, "category", e.target.value)}
                      >
                        <option value="">Select Category</option>
                        <option value="PUC">PUC</option>
                        <option value="RC">RC</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Fitness Certificate">Fitness Certificate</option>
                      </CFormSelect>
                      </CInputGroup>
                    </CCol>

                    {/* Issue Date Field with Icon */}
                    <CCol md={6}>
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilCalendar} />
                        </CInputGroupText>
                        <CFormInput
                          type="text" // Change to text initially
                          onFocus={(e) => (e.target.type = "date")} // Convert to date on focus
                          onBlur={(e) => (e.target.value ? (e.target.type = "date") : (e.target.type = "text"))} // Revert if empty
                          value={entry.issueDate}
                          onChange={(e) => handleInputChange(index, "issueDate", e.target.value)}
                          placeholder="Issue Date"
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  <CRow className="mt-3">
                    {/* Expiry Date Field with Icon */}
                    <CCol md={6}>
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilCalendar} />
                        </CInputGroupText>
                        <CFormInput
                          type="text" // Change to text initially
                          onFocus={(e) => (e.target.type = "date")} // Convert to date on focus
                          onBlur={(e) => (e.target.value ? (e.target.type = "date") : (e.target.type = "text"))} // Revert if empty
                          value={entry.expiryDate}
                          onChange={(e) => handleInputChange(index, "expiryDate", e.target.value)}
                          placeholder="Expiry Date"
                        />
                      </CInputGroup>
                    </CCol>

                    {/* File Upload Field with Icon */}
                    <CCol md={6}>
                      <CInputGroup>
                      <CInputGroupText>
                          <CIcon icon={cilFile} />
                        </CInputGroupText>
                        <CFormInput
                          type="file"
                          accept="image/*, application/pdf"
                          onChange={(e) => handleFileChange(index, e.target.files[0])}
                          placeholder="Upload Document"
                        />
                        
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  <CButton color="danger" size="sm" className="mt-2" onClick={() => removeDocumentEntry(index)}>
                    Remove
                  </CButton>
                </div>
              ))}

              <CButton color="success" className="mt-2" onClick={addDocumentEntry}>
                + Add More Documents
              </CButton>
            </CForm>
          </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleUpload}>
            Upload
          </CButton>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

{/* Edit Document Modal */}
    <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} alignment="center">
      <CModalHeader>
        <h5>Edit Document</h5>
      </CModalHeader>
      <CModalBody>
        {selectedDocument && (
          <CForm>
            <CRow>
              <CCol md={6}>
                <CFormLabel>Category</CFormLabel>
                <CFormSelect
                  value={selectedDocument.category}
                  onChange={(e) =>
                    setSelectedDocument({ ...selectedDocument, category: e.target.value })
                  }
                >
                  <option value="PUC">PUC</option>
                  <option value="RC">RC</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Fitness Certificate">Fitness Certificate</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Issue Date</CFormLabel>
                <CFormInput
                  type="date"
                  value={selectedDocument.issueDate ? selectedDocument.issueDate.split("T")[0] : ""}
                  onChange={(e) =>
                    setSelectedDocument({ ...selectedDocument, issueDate: e.target.value })
                  }
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={6}>
                <CFormLabel>Expiry Date</CFormLabel>
                <CFormInput
                  type="date"
                  value={selectedDocument.expiryDate ? selectedDocument.expiryDate.split("T")[0] : ""}
                  onChange={(e) =>
                    setSelectedDocument({ ...selectedDocument, expiryDate: e.target.value })
                  }
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Upload New File</CFormLabel>
                <CFormInput
                  type="file"
                  accept="image/*, application/pdf"
                  onChange={(e) =>
                    setSelectedDocument({ ...selectedDocument, newFile: e.target.files[0] })
                  }
                />
              </CCol>
            </CRow>
          </CForm>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleEditDocument}>
          Save Changes
        </CButton>
        <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>

    <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)} size="lg">
        <CModalHeader>
          <h5>{selectedDocument?.file?.filename}</h5>
        </CModalHeader>
        <CModalBody className="text-center">
          {selectedDocument?.file?.contentType.startsWith("image/") ? (
            <img
              src={`data:${selectedDocument.file?.contentType};base64,${selectedDocument.file?.data}`} 
              alt={selectedDocument.file?.filename}
              width="100%"
            />
          ) : selectedDocument?.file?.contentType === "application/pdf" ? (
            <iframe
              src={`data:${selectedDocument.file?.contentType};base64,${selectedDocument.file?.data}`}
              width="100%"
              height="600px"
            ></iframe>
          ) : (
            <p>Unsupported file type</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default VehicleDocuments;