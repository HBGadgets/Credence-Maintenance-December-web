import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Vehicle List Table.

export const useVehicleListData = () => {
    const [vehicles, setVehicles] = useState([]);
    const [nameFilter, setNameFilter] = useState(null);
    const [modelFilter, setModelFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [filterOptions, setFilterOptions] = useState({ names: [], models: [], categories: [] });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/credence`);
                setVehicles(response.data.devices || []);
            } catch (error) {
                console.error("Error fetching vehicle data:", error);
            }
        };

        fetchData();
    }, []);

    // Generate unique filter options
    useEffect(() => {
        if (!Array.isArray(vehicles)) return;

        const uniqueNames = [...new Set(vehicles.map((v) => v.name))].map((name) => ({
            label: name,
            value: name,
        }));
        const uniqueModels = [...new Set(vehicles.map((v) => v.model))].map((model) => ({
            label: model,
            value: model,
        }));
        const uniqueCategories = [...new Set(vehicles.map((v) => v.category))].map((category) => ({
            label: category,
            value: category,
        }));

        setFilterOptions({
            names: uniqueNames,
            models: uniqueModels,
            categories: uniqueCategories,
        });

    }, [vehicles]);

    // 🔹 **Combine Filtering & Search in a Single Effect**
    useEffect(() => {
        if (!Array.isArray(vehicles)) {
            console.error('Vehicles is not an array:', vehicles);
            setFilteredVehicles([]);
            return;
        }

        let filtered = vehicles;

        // Apply dropdown filters
        if (nameFilter) {
            filtered = filtered.filter((v) => v.name === nameFilter.value);
        }
        if (modelFilter) {
            filtered = filtered.filter((v) => v.model === modelFilter.value);
        }
        if (categoryFilter) {
            filtered = filtered.filter((v) => v.category === categoryFilter.value);
        }

        // Apply search query filter
        if (searchQuery.trim() !== '') {
            const search = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (vehicle) =>
                    (vehicle.name && vehicle.name.toLowerCase().includes(search)) ||
                    (vehicle.model && vehicle.model.toLowerCase().includes(search)) ||
                    (vehicle.category && vehicle.category.toLowerCase().includes(search))
            );
        }

        console.log('Filtered Vehicles:', filtered);
        setFilteredVehicles(filtered);
    }, [nameFilter, modelFilter, categoryFilter, searchQuery, vehicles]);

    return {
        vehicles,
        filteredVehicles,
        filterOptions,
        nameFilter,
        modelFilter,
        categoryFilter,
        setNameFilter,
        setModelFilter,
        setCategoryFilter,
        searchQuery,
        setSearchQuery,
    };
};



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
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/credence`);
                console.log('Devices from credence:', response.data);
                setVehicles(response.data.devices || []);

                // Find the selected vehicle by ID
                const vehicleData = response.data.devices.find((v) => v._id === id);
                setSelectedVehicle(vehicleData || null);
                setFilteredLogs(vehicleData?.maintenanceLogs || []);
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


const API_URL = import.meta.env.VITE_API_URL;

export const getDocuments = async (id) => {
    try {
        return await axios.get(`${API_URL}/api/vehicle-documents/get/${id}`);
    } catch (error) {
        console.error("Error fetching documents:", error);
        throw error;
    }
};

export const uploadDocuments = async (id, formData) => {
    try {
        return await axios.post(
            `${API_URL}/api/vehicle-documents/add/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json"
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

