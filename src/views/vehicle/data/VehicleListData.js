import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDateToDDMMYYYY } from "../../customhooks/useFormattedDate";

// Global token variable
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhcnNoYWwiLCJpZCI6IjY3OWIyNmU5Y2UxOTAzYWMyMjdhNDQ0OSIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NzliMjZlOWNlMTkwM2FjMjI3YTQ0NDkiLCJlbWFpbCI6ImhhcnNoYWxAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxOTY3YjNlNjcxNDQ5ZWU0Y2Q5ZjZhODA2MzE1ZmFjMzpjMjdkM2JlNDNhZWRlODRlYjA1NDQxNGIwYzE4ZDY3OSIsInVzZXJuYW1lIjoiaGFyc2hhbCIsIm1vYmlsZSI6IjEyMzQ1Njc4OTAiLCJncm91cHNBc3NpZ25lZCI6WyI2NzliMjZiOWNlMTkwM2FjMjI3YTQ0MmYiXSwiY3JlYXRlZEJ5IjoiNjcxMzY1M2I2MTNjZjJkMmM1MzJlZDBlIiwic3RhdHVzIjoidHJ1ZSIsIm5vdGlmaWNhdGlvbiI6dHJ1ZSwiZGV2aWNlcyI6dHJ1ZSwiZHJpdmVyIjp0cnVlLCJncm91cHMiOnRydWUsImNhdGVnb3J5IjpmYWxzZSwibW9kZWwiOmZhbHNlLCJ1c2VycyI6dHJ1ZSwicmVwb3J0Ijp0cnVlLCJzdG9wIjp0cnVlLCJ0cmF2ZWwiOnRydWUsImdlb2ZlbmNlIjp0cnVlLCJnZW9mZW5jZVJlcG9ydCI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjpmYWxzZSwiZGlzdGFuY2UiOnRydWUsImhpc3RvcnkiOnRydWUsInNlbnNvciI6dHJ1ZSwiaWRsZSI6dHJ1ZSwiYWxlcnRzIjp0cnVlLCJ2ZWhpY2xlIjp0cnVlLCJkZXZpY2VsaW1pdCI6ZmFsc2UsImVudHJpZXNDb3VudCI6MCwiX192IjowLCJ0cmlwcyI6dHJ1ZX0sInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQxMzI4ODE3fQ.pjV3ADLMHpkalJNnh975EL-oiUUQ3aQ6xZv_ArXbxgg";


// Vehicle List Table.

// export const useVehicleListData = () => {
//     const [vehicles, setVehicles] = useState([]);
//     const [nameFilter, setNameFilter] = useState(null);
//     const [modelFilter, setModelFilter] = useState(null);
//     const [categoryFilter, setCategoryFilter] = useState(null);
//     const [filteredVehicles, setFilteredVehicles] = useState([]);
//     const [filterOptions, setFilterOptions] = useState({ names: [], models: [], categories: [] });
//     const [searchQuery, setSearchQuery] = useState('');

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/credence`);
//                 setVehicles(response.data.devices || []);
//             } catch (error) {
//                 console.error("Error fetching vehicle data:", error);
//             }
//         };

//         fetchData();
//     }, []);

//     // Generate unique filter options
//     useEffect(() => {
//         if (!Array.isArray(vehicles)) return;

//         const uniqueNames = [...new Set(vehicles.map((v) => v.name))].map((name) => ({
//             label: name,
//             value: name,
//         }));
//         const uniqueModels = [...new Set(vehicles.map((v) => v.model))].map((model) => ({
//             label: model,
//             value: model,
//         }));
//         const uniqueCategories = [...new Set(vehicles.map((v) => v.category))].map((category) => ({
//             label: category,
//             value: category,
//         }));

//         setFilterOptions({
//             names: uniqueNames,
//             models: uniqueModels,
//             categories: uniqueCategories,
//         });

//     }, [vehicles]);

//     // 🔹 **Combine Filtering & Search in a Single Effect**
//     useEffect(() => {
//         if (!Array.isArray(vehicles)) {
//             console.error('Vehicles is not an array:', vehicles);
//             setFilteredVehicles([]);
//             return;
//         }

//         let filtered = vehicles;

//         // Apply dropdown filters
//         if (nameFilter) {
//             filtered = filtered.filter((v) => v.name === nameFilter.value);
//         }
//         if (modelFilter) {
//             filtered = filtered.filter((v) => v.model === modelFilter.value);
//         }
//         if (categoryFilter) {
//             filtered = filtered.filter((v) => v.category === categoryFilter.value);
//         }

//         // Apply search query filter
//         if (searchQuery.trim() !== '') {
//             const search = searchQuery.toLowerCase();
//             filtered = filtered.filter(
//                 (vehicle) =>
//                     (vehicle.name && vehicle.name.toLowerCase().includes(search)) ||
//                     (vehicle.model && vehicle.model.toLowerCase().includes(search)) ||
//                     (vehicle.category && vehicle.category.toLowerCase().includes(search))
//             );
//         }

//         console.log('Filtered Vehicles:', filtered);
//         setFilteredVehicles(filtered);
//     }, [nameFilter, modelFilter, categoryFilter, searchQuery, vehicles]);

//     return {
//         vehicles,
//         filteredVehicles,
//         filterOptions,
//         nameFilter,
//         modelFilter,
//         categoryFilter,
//         setNameFilter,
//         setModelFilter,
//         setCategoryFilter,
//         searchQuery,
//         setSearchQuery,
//     };
// };



// -----------------------------------------------------------------------------------------------------
// Vehicle Profile Section


export const useVehicleProfileData = () => {
    const { id } = useParams();
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [filteredLogs, setFilteredLogs] = useState([]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/vehicle/get/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${TOKEN}`,
                        },
                    }
                );

                console.log('Pavannnnnnnnnnnnnnnnnnnnnn:', response.data);

                const vehicleList = response.data ? response.data
                    : response.data.vehicles
                        ? [response.data.vehicles]
                        : [];

                setVehicles(vehicleList);
                setSelectedVehicle(vehicleList || null);
                setFilteredLogs(vehicleList?.maintenanceLogs || []);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };

        fetchVehicles();
    }, [id]);

    return { vehicles, selectedVehicle, filteredLogs };
};

// -----------------------------------------------------------------------------------------------------


// Vehcile Document locker

// Get API Document

// export const getDocuments = async (id, field) => {
//     try {
//         const response = await fetch(
//             `${import.meta.env.VITE_API_URL}/api/vehicle-documents/get?vehicleId=${id}&field=${field}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${TOKEN}`,
//                 },
//             }
//         );
//         const data = await response.json();
//         console.log("data for images ex and is", data)

//         if (data.vehicleDocument?.documents?.[field]?.image?.base64Data) {
//             return data.vehicleDocument.documents[field].image.base64Data;
//         }

//         return null;
//     } catch (error) {
//         console.error("Error fetching vehicle document:", error);
//         return null;
//     }
// };

// Get API Document
export const getDocuments = async (id, field) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/vehicle-documents/get?vehicleId=${id}&field=${field}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );

        const data = await response.json();
        console.log(`API Response for ${field}:`, data); // Full API response

        if (data.vehicleDocument?.documents?.[field]) {
            const document = data.vehicleDocument.documents[field];

            const documentDetails = {
                expiryDate: document.expiryDate || null,
                issueDate: document.issueDate || null,
                imageBase64: document.image?.base64Data || null, // Image Base64
                contentType: document.image?.contentType || null, // Image Content Type
            };

            console.log(`Formatted Document Data for ${field}:`, documentDetails);

            return documentDetails; // Return full document data including Base64
        }

        return {};
    } catch (error) {
        console.error("Error fetching vehicle document:", error);
        return {};
    }

};




// POST API Document
export const uploadDocuments = async (vehicleId, documents) => {
    if (!vehicleId || !documents || typeof documents !== "object") {
        console.error("Invalid parameters: vehicle ID or document data is missing.");
        return;
    }

    const formData = new FormData();
    formData.append("vehicleId", vehicleId);

    const documentType = Object.keys(documents)[0]; // Get the selected document type
    const documentData = documents[documentType]; // Get the document details

    if (!documentData || !documentData.file) {
        console.error("No document file selected for upload.");
        return;
    }

    // Map document type to the correct field name
    const documentFieldMapping = {
        rc: "rcImage",
        Insurance: "insuranceImage",
        puc: "pucImage",
        fitnessCertificate: "fitnessCertificateImage",
    };

    const mappedFieldName = documentFieldMapping[documentType] || documentType; // Default to original key if not mapped

    formData.append(`documents[${documentType}][issueDate]`, documentData.issueDate || "");
    formData.append(`documents[${documentType}][expiryDate]`, documentData.expiryDate || "");
    formData.append(mappedFieldName, documentData.file); // Append correct field name

    console.log("Uploading Document:", mappedFieldName);

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/vehicle-documents/add`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error uploading document:", error.response?.data || error.message);
        throw error;
    }
};


// PATCH API Document

export const editDocument = async (vehicleId, formData) => {
    if (!vehicleId || !formData) {
        console.error("Invalid parameters: Vehicle ID or document data is missing.");
        return;
    }

    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/vehicle-documents/update/${vehicleId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );
        console.log("Document updated successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating document:", error.response?.data || error.message);
        throw error;
    }
};


// DELETE API Document
export const deleteDocumentAPI = async (id, docId) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/vehicle-documents/delete-image?vehicleId=${id}&field=${docId}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`, // Ensure TOKEN is valid
                },
            }
        );

        console.log("Delete API Response:", response.data); // Debugging log
        return response.data; // Return the API response
    } catch (error) {
        console.error("Error deleting document:", error.response?.data || error.message);
        throw error;
    }
};


// -----------------------------------------------------------------------------------------------------

// Maintnaces Log Api

// GET API Maintance Log
export const maintenanceLogApi = async (id) => {
    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vehicleExpense/get-vehicle-expense-by-vehicle-id/${id}`,
        {
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );

    console.log("Vehicle Expenses Data: ", data);

    return data.map((vehiclelogs) => ({
        id: vehiclelogs._id,
        date: formatDateToDDMMYYYY(vehiclelogs.date),
        driverName: vehiclelogs.driverName || 'N/A',
        shopName: vehiclelogs.vendor,
        expenseType: vehiclelogs.expenseType,
        description: vehiclelogs.description,
        amount: vehiclelogs.amount,
        paymentMode: vehiclelogs.paymentMode,
        billImg: vehiclelogs.billImg,
    }));
};

//  get Image Api for vehicle expeses bill by id

export const getVehicleBillApi = async (billImg) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/vehicleExpense/bill-img/${billImg}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        )
        console.log("This is Driver Bill Image : ", response.data)
        return response.data // contains base64Data and contentType
    } catch (error) {
        console.error("Error:", error.response?.data || error.message)
        throw error
    }
}


// -----------------------------------------------------------------------------------------------------

// GET API for Vehcile Trip

export const getVehicleTripsByIdAPI = async (id) => {

    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/trips/get-trip-by-vehicle-id/${id}`,
        {
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );

    console.log("Vehicle Expenses Data: ", data);

    return data.map((vehicleTrips) => ({
        id: vehicleTrips._id,
        date: formatDateToDDMMYYYY(vehicleTrips.date),
        driverName: vehicleTrips.driverId?.name || 'N/A',
        vehicleName: vehicleTrips.vehicleName,
        startLocation: vehicleTrips.startLocation,
        endLocation: vehicleTrips.endLocation,
        budgetAllocated: vehicleTrips.budgetAllocated,
        spentAmount: vehicleTrips.spentAmount,
        status: vehicleTrips.status,
    }));

};

//  get Image Api for vehicle expeses bill by id

export const getVehicleSubTripApi = async (id) => {
    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/subtrip/get-subtrip-by-trip-id/${id}`,
        {
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );

    console.log("Raw Vehicle Sub Trips Data: ", data);

    if (Array.isArray(data.subtrip)) {
        return data.subtrip.map((vehicleSubTrips) => ({
            date: formatDateToDDMMYYYY(vehicleSubTrips.date),
            startLocation: vehicleSubTrips.startLocation,
            endLocation: vehicleSubTrips.endLocation,
            status: vehicleSubTrips.status,
        }));
    } else {
        console.error("Expected 'subtrip' to be an array:", data);
        return [];
    }
};





