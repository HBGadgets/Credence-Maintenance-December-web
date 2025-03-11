import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getDocuments = async (id) => {
    try {
        return await axios.get(`${API_URL}/api/extendedVehicle/vehicleDoc/${id}`);
    } catch (error) {
        console.error("Error fetching documents:", error);
        throw error;
    }
};

export const uploadDocuments = async (id, formData) => {
    try {
        return await axios.post(
            `${API_URL}/api/extendedVehicle/vehicleDoc/${id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    } catch (error) {
        console.error("Error uploading documents:", error);
        throw error;
    }
};

export const editDocument = async (id, docId, formData) => {
    try {
        return await axios.put(
            `${API_URL}/api/extendedVehicle/vehicleDoc/${id}/${docId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
};

export const deleteDocumentAPI = async (id, docId) => {
    try {
        return await axios.delete(
            `${API_URL}/api/extendedVehicle/vehicleDoc/${id}/${docId}`
        );
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
};