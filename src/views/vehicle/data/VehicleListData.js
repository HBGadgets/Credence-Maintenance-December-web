import axios from "axios";
import { useEffect, useState } from "react";

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
