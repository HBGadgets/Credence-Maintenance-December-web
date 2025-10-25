import axios from "axios";
import { formatDateToDDMMYYYY } from "../customhooks/useFormattedDate";

// Global token (from session)
const TOKEN = sessionStorage.getItem("crdnsMaintToken");

// Get API trip reading
export const getAllDailyReadingApi = async ({
    search = "",
    startDate = "",
    endDate = "",
    status = "",
    page = 1,
    limit = 10,
}) => {
    try {
        if (!TOKEN) throw new Error("Authentication token not found");

        // Build params object conditionally
        const params = {
            search,
            status,
            page,
            limit,
        };

        // Only add dates if they have values
        if (startDate) {
            params.startDate = startDate;
        }
        if (endDate) {
            params.endDate = endDate;
        }

        console.log("📤 Sending to API:", params);

        const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/daily/tripgetbydriver`,
            {
                params,
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );

        console.log("📦 API Response (Daily Reading):", data);

        const formatDate = (dateString) => {
            if (!dateString) return "N/A";
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = String(date.getSeconds()).padStart(2, "0");
            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        };

        const transformedData = (data.data || []).map((item) => ({
            id: item._id,
            driverName: item.driverId?.name || "N/A",
            driverContact: item.driverId?.contactNumber || "N/A",
            vehicleNumber: item.driverId?.currentVehicleName || "N/A",
            odometerStart: item.odometerStart ?? "-",
            odometerEnd: item.odometerEnd ?? "-",
            totalDistance: item.totalDistance ?? "-",
            gpsKM: item.gpsKM ?? "-",
            startTime: formatDate(item.startTime) || "-",
            endTime: formatDate(item.endTime) || "-",
            createdAt: formatDateToDDMMYYYY(item.createdAt) || "-",
            driverId: item.driverId?._id || "",
            supervisorId: item.supervisorId || "--",
            status: item.status || "N/A",
        }));

        return {
            data: transformedData,
            total: data.total,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
        };
    } catch (error) {
        console.error("❌ Error fetching daily readings:", error);
        throw error.response?.data || { message: "Failed to fetch daily readings" };
    }
};




// Post for all Daily trips reading
export const postDailyReadingApi = async (id, dailyReadingData) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/daily/tripstartbydriver?driverId=${id}`,
            dailyReadingData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        )

        if (response.status === 201 || response.status === 200) {
            console.log('Trip Reading Created Successfully:', response.data)
            return response.data
        } else {
            throw new Error(`Unexpected response status: ${response.status}`)
        }
    } catch (error) {
        console.error('API Error:', error.response?.data?.message || error.message)

        // Properly throw the error to be caught in parent function
        const err = new Error(
            error.response?.data?.message || 'Failed to create trip reading'
        )
        err.response = error.response // Attach the original response if needed
        throw err
    }
}

// Patch for all Driver

export const patchDailyReadingApi = async (rowId, driverId, data) => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found')

        const { data: response } = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/daily/tripendbydriver/${rowId}?driverId=${driverId}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            },
        )

        return response
    } catch (error) {
        console.error('Update trip reading failed:', error, error.response?.data?.message || error.message)
        throw error
    }
}

