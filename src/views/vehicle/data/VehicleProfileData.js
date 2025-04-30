import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
