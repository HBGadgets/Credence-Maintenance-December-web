import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

// const API_URL = import.meta.env.VITE_API_URL;

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
        if (data.vehicleDocument?.documents?.[field]?.image?.base64Data) {
            setImageSrc(data.vehicleDocument.documents[field].image.base64Data);
        }
        console.log("dsadasdaskd", data)
    } catch (error) {
        console.error("Error fetching vehicle document:", error);
    }
};

export const uploadDocuments = async (id, formData) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_URL}/api/vehicle-documents/add${id}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );
    } catch (error) {
        console.error("Error uploading documents:", error.response?.data || error.message);
        throw error;
    }
};


export const editDocument = async (id, docId, formData) => {
    try {
        return await axios.patch(
            `${API_URL}/api/vehicle-documents/update/${id}/${docId}`,
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
            `${API_URL}/api/vehicle-documents/delete-image?vehicleId=${id}/field=${docId}`
        );
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
};

// -----------------------------------------------------------------------------------------------------

