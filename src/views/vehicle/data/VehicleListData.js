import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie'
import { useSplitTimeDate } from "../../customhooks/useSplitTimeDate";


// Global token variable
// const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhcnNoYWwiLCJpZCI6IjY3OWIyNmU5Y2UxOTAzYWMyMjdhNDQ0OSIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NzliMjZlOWNlMTkwM2FjMjI3YTQ0NDkiLCJlbWFpbCI6ImhhcnNoYWxAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxOTY3YjNlNjcxNDQ5ZWU0Y2Q5ZjZhODA2MzE1ZmFjMzpjMjdkM2JlNDNhZWRlODRlYjA1NDQxNGIwYzE4ZDY3OSIsInVzZXJuYW1lIjoiaGFyc2hhbCIsIm1vYmlsZSI6IjEyMzQ1Njc4OTAiLCJncm91cHNBc3NpZ25lZCI6WyI2NzliMjZiOWNlMTkwM2FjMjI3YTQ0MmYiXSwiY3JlYXRlZEJ5IjoiNjcxMzY1M2I2MTNjZjJkMmM1MzJlZDBlIiwic3RhdHVzIjoidHJ1ZSIsIm5vdGlmaWNhdGlvbiI6dHJ1ZSwiZGV2aWNlcyI6dHJ1ZSwiZHJpdmVyIjp0cnVlLCJncm91cHMiOnRydWUsImNhdGVnb3J5IjpmYWxzZSwibW9kZWwiOmZhbHNlLCJ1c2VycyI6dHJ1ZSwicmVwb3J0Ijp0cnVlLCJzdG9wIjp0cnVlLCJ0cmF2ZWwiOnRydWUsImdlb2ZlbmNlIjp0cnVlLCJnZW9mZW5jZVJlcG9ydCI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjpmYWxzZSwiZGlzdGFuY2UiOnRydWUsImhpc3RvcnkiOnRydWUsInNlbnNvciI6dHJ1ZSwiaWRsZSI6dHJ1ZSwiYWxlcnRzIjp0cnVlLCJ2ZWhpY2xlIjp0cnVlLCJkZXZpY2VsaW1pdCI6ZmFsc2UsImVudHJpZXNDb3VudCI6MCwiX192IjowLCJ0cmlwcyI6dHJ1ZX0sInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQxMzI4ODE3fQ.pjV3ADLMHpkalJNnh975EL-oiUUQ3aQ6xZv_ArXbxgg";
const TOKEN = sessionStorage.getItem('crdnsMaintToken') // Get token from cookie


// Vehicle List Table.

export const fetchVehicles = async () => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found')

        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/vehicle/get-all`, {
            headers: { Authorization: `Bearer ${TOKEN}` },
        })

        const vehicles = data.devices // adjust according to actual response

        console.log("vehicles", vehicles)
        return vehicles.map((vehicle) => ({
            name: vehicle.name || 'N/A',
            model: vehicle.model || 'N/A',
            category: vehicle.category || 'N/A',
            id: vehicle._id || 'N/A',
        }))
    } catch (error) {
        console.error(error)
        throw error
    }

}





// -----------------------------------------------------------------------------------------------------
// Vehicle Profile Section

import { useQuery } from '@tanstack/react-query'


export const useVehicleProfileData = () => {
    const { id } = useParams()

    return useQuery({
        queryKey: ['vehicles', id],
        queryFn: async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/vehicle/get/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                }
            )

            const data = response.data
            console.log("this is response ", data)

            if (!data || !data.vehicleDocument || !data.device) {
                throw new Error('Invalid vehicle data structure')
            }

            const vehicleDocument = data.vehicleDocument
            const device = data.device
            console.log("vehicleDocument:", vehicleDocument)
            console.log("device:", device)

            return {
                vehicleDocument,
                device,
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!id, // Ensure query runs only if id exists
    })
}

// -----------------------------------------------------------------------------------------------------


// Vehcile Document locker

// Get API Document

export const getAllDocuments = async (id) => {
    try {
        const token = TOKEN // Replace with actual token source if needed

        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/vehicle/get/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        console.log("api response", response.data);

        // This returns exactly what backend sends — no transformation
        return response.data
    } catch (error) {
        console.error('Error fetching document flags:', error)
        return {}
    }
}




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
        date: useSplitTimeDate(vehiclelogs.date) || 'N/A',
        originalDate: vehiclelogs.date,
        driverName: vehiclelogs.driverName || 'N/A',
        shopName: vehiclelogs.vendor || 'N/A',
        expenseType: vehiclelogs.expenseType || 'N/A',
        description: vehiclelogs.description || 'N/A',
        location: vehiclelogs.location || 'N/A',
        lat: vehiclelogs.lat || 'No latitude',
        long: vehiclelogs.long || 'No longitude',
        amount: vehiclelogs.amount || 'N/A',
        paymentMode: vehiclelogs.paymentMode || 'N/A',
        billImg: vehiclelogs.billImg || 'N/A',
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
        date: useSplitTimeDate(vehicleTrips.date) || 'N/A',
        originalDate: vehicleTrips.date,
        driverName: vehicleTrips.driverId?.name || 'N/A',
        vehicleName: vehicleTrips.vehicleName || 'N/A',
        startLocation: vehicleTrips.startLocation || 'N/A',
        endLocation: vehicleTrips.endLocation || 'N/A',
        budgetAllocated: vehicleTrips.budgetAllocated || 'N/A',
        spentAmount: vehicleTrips.spentAmount || 'N/A',
        status: vehicleTrips.status || 'N/A',
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
            date: useSplitTimeDate(vehicleSubTrips.date),
            startLocation: vehicleSubTrips.startLocation,
            endLocation: vehicleSubTrips.endLocation,
            status: vehicleSubTrips.status,
        }));
    } else {
        console.error("Expected 'subtrip' to be an array:", data);
        return [];
    }
};


// ---------------------------------------------------------------------------------------- 

//Fuel System get api

// export const getFuelSystemData = async (id, month) => {
//     try {
//         console.log(`Fetching Driver Fuel List for month: ${month}`);

//         const response = await axios.get(
//             `http://104.251.218.102:7000/api/fuelsys/get-fuelsystem-data/${id}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${TOKEN}`,
//                 },
//             }
//         );
//         if (!response.data || response.status !== 200) {
//             throw new Error("Invalid response from server");
//         }

//         console.log("Fuel System List:", response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching fuel system data:', error);
//         throw error;
//     }
// };


export const getFuelSystemData = async (id, month) => {
    if (!TOKEN) throw new Error('Authentication token not found')

    try {
        console.log(`Fetching Driver Fuel List for month: ${month}`)

        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/fuelsys/get-fuelsystem-data/${id}?month=${month}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        )

        const data = response.data
        console.log("Raw Fuel System Data:", data)

        if (!Array.isArray(data?.distancedata)) {
            console.error("Expected 'distancedata' to be an array:", data)
            return {
                averageFuelEfficiency: '0',
                totalDistance: 0,
                totalFuelConsumption: 0,
                totalFuelExpense: 0,
                dailyRecords: [],
            }
        }

        const dailyRecords = data.distancedata.map((entry) => ({
            // date: useSplitTimeDate(entry.createdAt),
            // date: entry.createdAt.split('T')[0],
            date: useSplitTimeDate(entry.createdAt),


            distance: entry.distance,
            dailyFuelConsumption: entry.dailyFuelConsumption,
            fuelExpenses: entry.fuelExpenses?.map(exp => ({
                amount: exp.amount,
                date: useSplitTimeDate(exp.date),
            })) || [],
        }))

        return {
            name: data.name,
            averageFuelEfficiency: data.averageFuelEfficiency,
            totalDistance: data.totalDistance,
            totalFuelConsumption: data.totalFuelConsumption,
            totalFuelExpense: data.totalFuelExpense,
            dailyRecords,
        }

    } catch (error) {
        console.error('Error fetching fuel system data:', error)
        throw error
    }
}

// ------------------------------------------------------------------------------------- 

// Fetch Api For tyre system

// GET API Maintance Log
export const getTyreSystemApi = async (id) => {
    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tyre/vehicle/${id}`,
        {
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );

    console.log("Vehicle Expenses Data: ", data);

    return data.map((tyresystem) => ({
        id: tyresystem._id,
        installationDate: useSplitTimeDate(tyresystem.installationDate),
        vehicleName: tyresystem.vehicleName,
        originalDate: tyresystem.installationDate,
        category: tyresystem.category || 'N/A',
        position: tyresystem.position || 'N/A',
        tyreSerialNumber: tyresystem.tyreSerialNumber || 'N/A',
        brandName: tyresystem.brandName || 'N/A',
        tyreStatus: tyresystem.tyreStatus || 'N/A',
        vendorName: tyresystem.vendorName || "N/A",
        location: tyresystem.location || "N/A",
        lat: tyresystem.lat || 'No latitude',
        long: tyresystem.long || 'No longitude',
        tyreSize: tyresystem.tyreSize || "N/A",
        amount: tyresystem.amount || 'N/A',
        paymentMode: tyresystem.paymentMode || 'N/A',
        billImg: tyresystem.billImg,
    }));
};


// Post Tyre APi

export const postTyreSystemApi = async (tyresystemData) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/tyre/add`,
            tyresystemData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    // "Content-Type": "application/json",
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.status === 201 || response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error("API Error:", error.response?.data?.message || error.message);
        throw error;
    }
}

// Patch Tyre APi
export const updateDriver = async (id, data) => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found')

        const { data: response } = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/tyre/update/${id}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'multipart/form-data',
                },
            },
        )

        return response
    } catch (error) {
        console.error('Update driver failed:', error)
        alert(error.response?.data?.message || error.message)
        throw error
    }
}


// Delete Tyre APi
export const deleteTyreSystemApi = async (id) => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found')

        const { data } = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/tyre/delete/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            },
        )

        return console.log(data.message)
    } catch (error) {
        throw error
    }
}

//  get Image Api for Tyer expeses bill by id

export const getTyerSystemBillApi = async (billImg) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/tyre/bill-image/${billImg}`,
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

// ---------------------------------------------------------------------------------------- 

// Get inpection vehicle by id 

export const getInpectionVehicleIdApi = async (id) => {
    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/inspection/get-inspection/${id}`,
        {
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );

    console.log("All Vehicle Inspection Data: ", data);

    const response = data.data || [];

    const formatItem = (item) => {
        if (!item) return { status: "Unknown" };
        return {
            status: item.status ? "Pass" : "Fail",
            ...(item.status === false && {
                description: item.description || "No Issuse in this part",
                image: item.Image || null,
            }),
        };
    };

    return response.map((inspection) => {
        const items = {
            engineOil: formatItem(inspection.engineOil),
            acCollent: formatItem(inspection.acCollent),
            sparkPlug: formatItem(inspection.sparkPlug),
            airFilter: formatItem(inspection.airFilter),
            breakFluid: formatItem(inspection.breakFluid),
            transmissionFluid: formatItem(inspection.transmissionFluid),
            powerStairingFluid: formatItem(inspection.powerStairingFluid),
            windShieldWasherFluid: formatItem(inspection.windShieldWasherFluid),
            tyrePressure: formatItem(inspection.tyrePressure),
            tyreAlignment: formatItem(inspection.tyreAlignment),
            batteryCharge: formatItem(inspection.batteryCharge),
            wiperBlades: formatItem(inspection.wiperBlades),
            suspensionAndStairing: formatItem(inspection.suspensionAndStairing),
            underbody: formatItem(inspection.underbody),
            exaustSystem: formatItem(inspection.exaustSystem),
            warningLights: formatItem(inspection.warningLights),
            headLights: formatItem(inspection.headLights),
            indicator: formatItem(inspection.indicator),
        };

        // Count Pass/Fail
        const values = Object.values(items);
        const inspectionPass = values.filter((item) => item.status === "Pass").length;
        const inspectionFail = values.filter((item) => item.status === "Fail").length;

        return {
            id: inspection._id,
            vehicleId: inspection.vehicleId,
            vehicleName: inspection.vehicleDetails?.name || "Unknown",
            orignalDate: inspection.createdAt,
            date: useSplitTimeDate(inspection.createdAt),
            driverName: inspection.DriverId?.name || "Unknown",
            startLocation: inspection.tripId?.startLocation || "N/A",
            endLocation: inspection.tripId?.endLocation || "N/A",
            status: inspection.tripId?.status || "N/A",
            inpectionPass: inspectionPass,
            inpectionFail: inspectionFail,
            category: inspection.vehicleDetails?.category || "N/A",
            items, // raw item details (optional, if needed later)
        };
    });
};

// ----------------------------------------------------------------------------------------- 

//  Get Vehicle Service History By vehicle id

export const getVehicleServiceHistoryApi = async (id) => {
    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/service/get-services?vehicleId=${id}`,
        {
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );

    console.log("Raw Vehicle Service History Data: ", data);

    // Map service history data
    const serviceData = (data?.data || []).map((entry) => ({
        id: entry._id,
        vehicleId: entry.vehicleId,
        driverName: entry.driverId?.name || 'N/A',
        vehicleName: entry.vehicleName || 'N/A',
        date: useSplitTimeDate(entry.date),
        originalDate: entry.date,
        serviceType: entry.serviceType || 'N/A',
        description: entry.description || 'N/A',
        amount: entry.amount || 'N/A',
        paymentMode: entry.paymentMode || 'N/A',
        odometer: entry.lastService || 'N/A',
        vendor: entry.vendor || 'N/A',
        nextServiceKm: entry.nextServiceDue || 'N/A',
        location: entry.location || 'N/A',
        serviceImg: entry.serviceImg,
        createdAt: entry.createdAt
    }));

    console.log("dataaaaaaa", serviceData)

    // Extract odometer summary
    const odometerSummary = {
        currentOdometer: data.odometer?.currentOdometer || 0,
        nextServiceDue: data.odometer?.nextServiceDue || 0,
        lastService: data.odometer?.lastService || 0,
    };

    return {
        serviceData,
        odometerSummary,
    };
};

// Post Api For Vehicle Service History

export const postVehicleServiceApi = async (tyresystemData, id) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/service/create-service?vehicleId=${id}`,
            tyresystemData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    // "Content-Type": "application/json",
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.status === 201 || response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error("API Error:", error.response?.data?.message || error.message);
        throw error;
    }
}

// Delete Service API
export const deleteVehicleServiceApi = async (id) => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found');

        const { data } = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/service/delete-service/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );

        return data; // return instead of console.log
    } catch (error) {
        throw error;
    }
};

// Patch for vehicle Services
export const patchVehicleServiceApi = async (id, updateVehicleService) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/service/edit-services/${id}`,
            updateVehicleService,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.status === 201 || response.status === 200) {
            console.log("Updated LR data", response.data)
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error("API Error:", error.response?.data?.message || error.message);
        throw error;
    }
}

// Update odomete api

export const patchVehicleServiceOdometerApi = async (id, updateVehicleServiceOdometer) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/service/edit-odometer/${id}`,
            updateVehicleServiceOdometer,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        )

        if (response.status === 200 || response.status === 201) {
            console.log('Updated Odometer:', response.data)
            return response.data
        } else {
            throw new Error(`Unexpected response status: ${response.status}`)
        }
    } catch (error) {
        console.error('API Error:', error.response?.data?.message || error.message)
        throw error
    }
}

// View bill image

export const getVehicleServiceBillApi = async (serviceImg) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/service/get-service-image/${serviceImg}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        )
        console.log("This is Service Bill Image : ", response.data)
        return response.data // contains base64Data and contentType
    } catch (error) {
        console.error("Error:", error.response?.data || error.message)
        throw error
    }
}