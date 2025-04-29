import axios from "axios";
import { ReceiptIcon } from "lucide-react";
import { formatDateToDDMMYYYY } from "../../customhooks/useFormattedDate";

// Global token variable
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhcnNoYWwiLCJpZCI6IjY3OWIyNmU5Y2UxOTAzYWMyMjdhNDQ0OSIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NzliMjZlOWNlMTkwM2FjMjI3YTQ0NDkiLCJlbWFpbCI6ImhhcnNoYWxAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxOTY3YjNlNjcxNDQ5ZWU0Y2Q5ZjZhODA2MzE1ZmFjMzpjMjdkM2JlNDNhZWRlODRlYjA1NDQxNGIwYzE4ZDY3OSIsInVzZXJuYW1lIjoiaGFyc2hhbCIsIm1vYmlsZSI6IjEyMzQ1Njc4OTAiLCJncm91cHNBc3NpZ25lZCI6WyI2NzliMjZiOWNlMTkwM2FjMjI3YTQ0MmYiXSwiY3JlYXRlZEJ5IjoiNjcxMzY1M2I2MTNjZjJkMmM1MzJlZDBlIiwic3RhdHVzIjoidHJ1ZSIsIm5vdGlmaWNhdGlvbiI6dHJ1ZSwiZGV2aWNlcyI6dHJ1ZSwiZHJpdmVyIjp0cnVlLCJncm91cHMiOnRydWUsImNhdGVnb3J5IjpmYWxzZSwibW9kZWwiOmZhbHNlLCJ1c2VycyI6dHJ1ZSwicmVwb3J0Ijp0cnVlLCJzdG9wIjp0cnVlLCJ0cmF2ZWwiOnRydWUsImdlb2ZlbmNlIjp0cnVlLCJnZW9mZW5jZVJlcG9ydCI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjpmYWxzZSwiZGlzdGFuY2UiOnRydWUsImhpc3RvcnkiOnRydWUsInNlbnNvciI6dHJ1ZSwiaWRsZSI6dHJ1ZSwiYWxlcnRzIjp0cnVlLCJ2ZWhpY2xlIjp0cnVlLCJkZXZpY2VsaW1pdCI6ZmFsc2UsImVudHJpZXNDb3VudCI6MCwiX192IjowLCJ0cmlwcyI6dHJ1ZX0sInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQxMzI4ODE3fQ.pjV3ADLMHpkalJNnh975EL-oiUUQ3aQ6xZv_ArXbxgg";


// GET API Supervisor See ALL Drivers Expesense List.

export const getAllDriverExpesesListApi = async () => {
    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/driverExpense/get`,
        {
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );

    console.log("Vehicle Expenses Data: ", data);

    return data.map((driverExpenseList) => ({
        id: driverExpenseList._id,
        date: formatDateToDDMMYYYY(driverExpenseList.date),
        originalDate: driverExpenseList.date,
        driverName: driverExpenseList.driverId?.name || "Unknown",
        currentVehicleName: driverExpenseList.driverId?.currentVehicleName || "N/A",
        shopName: driverExpenseList.shopName || "Unknown",
        location: driverExpenseList.location || "Unknown",
        description: driverExpenseList.description || "No description",
        amount: driverExpenseList.amount || 0,
        paymentMode: driverExpenseList.paymentMode || "Unknown",
        billImg: driverExpenseList.billImg || "No Bill",
    }));
}



// Show Bill Images of All Drivers Expenses
export const getDriverBillImageApi = async (billImgId) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/driverExpense/bill-img/${billImgId}`,
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



// ------------------------------------------------------------------------------------------------------------------

// GET API Supervisor See All Vehicles Expense List.

export const getAllVehicleExpesesListApi = async () => {

    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vehicleExpense/get`,
        {
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );

    console.log("All Vehicle Expenses Data: ", data);

    return data.map((vehicleExpenseList) => ({
        id: vehicleExpenseList._id,
        originalDate: vehicleExpenseList.date,
        date: formatDateToDDMMYYYY(vehicleExpenseList.date),
        driverName: vehicleExpenseList.driverId?.name || "Unknown",
        currentVehicleName: vehicleExpenseList.driverId?.currentVehicleName || "N/A",
        shopName: vehicleExpenseList.vendor || "Unknown",
        expenseType: vehicleExpenseList.expenseType || "Unknown",
        description: vehicleExpenseList.description || "No description",
        amount: vehicleExpenseList.amount || 0,
        paymentMode: vehicleExpenseList.paymentMode || "Unknown",
        billImg: vehicleExpenseList.billImg || "No Bill",
    }))
}


// Show Bill Images of All Drivers Expenses
export const getVehicleBillImageApi = async (billImgId) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/vehicleExpense/bill-img/${billImgId}`,
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

// ------------------------------------------------------------------------------------------------------------------------------- 

// Get API for Supervisor See Lorry report  

export const getLorryReciptApi = async () => {

    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/lorry-receipt/get-all-lorry-receipt`,
        {
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );

    console.log("All Lorry Recipts Data: ", data);

    return data.map((lorryReciptList) => ({
        id: lorryReciptList._id,
        date: formatDateToDDMMYYYY(lorryReciptList.date),
        originalDate: lorryReciptList.date,
        companyName: lorryReciptList.companyName || "Unknown",
        companyAddress: lorryReciptList.companyAddress || "Unknown",
        companyEmail: lorryReciptList.companyEmail || "Unknown",
        gstIn: lorryReciptList.gstIn || "Unknown",
        companyOfficeNumber: lorryReciptList.companyOfficeNumber || "Unknown",
        companyMobileNumber: lorryReciptList.companyMobileNumber || "Unknown",
        lorryNumber: lorryReciptList.lorryNumber || "Unknown",
        vehicleName: lorryReciptList.vehicleName || "Unknown",
        ownerName: lorryReciptList.ownerName || "Unknown",
        consignorName: lorryReciptList.consignorName || "Unknown",
        consignorAddress: lorryReciptList.consignorAddress || "Unknown",
        consigneeName: lorryReciptList.consigneeName || "Unknown",
        consigneeAddress: lorryReciptList.consigneeAddress || "Unknown",
        customerName: lorryReciptList.customerName || "Unknown",
        customerAddress: lorryReciptList.customerAddress || "Unknown",
        startLocation: lorryReciptList.from || lorryReciptList.startLocation || "Unknown",
        endLocation: lorryReciptList.to || lorryReciptList.endLocation || "Unknown",
        driverName: lorryReciptList.driverId?.name || "N/A",
        driverContact: lorryReciptList.driverId?.contactNumber || "N/A",
        containerNumber: lorryReciptList.containerNumber || "Unknown",
        sealNumber: lorryReciptList.sealNumber || "Unknown",
        itemName: lorryReciptList.itemName || "Unknown",
        itemQuantity: lorryReciptList.itemQuantity || "Unknown",
        itemUnit: lorryReciptList.itemUnit || "Unknown",
        itemWeight: lorryReciptList.itemWeight || "Unknown",
        itemcost: lorryReciptList.itemcost || "Unknown",
        customerRate: lorryReciptList.customerRate || "Unknown",
        totalAmount: lorryReciptList.totalAmount || "Unknown",
        transporterRate: lorryReciptList.transporterRate || "Unknown",
        totalTransporterAmount: lorryReciptList.totalTransporterAmount || "Unknown",
        transporterRateOn: lorryReciptList.transporterRateOn || "Unknown",
        customerRateOn: lorryReciptList.customerRateOn || "Unknown",
        customerFreight: lorryReciptList.customerFreight || "Unknown",
        transporterFreight: lorryReciptList.transporterFreight || "Unknown",
    }));
}


// POST API for Supervisor add Lorry recipt

export const postLorryReciptApi = async (lorryrecipt) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/lorry-receipt/create`,
            lorryrecipt,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status === 201 || response.status === 200) {
            console.log("post LR data", response.data)
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error("API Error:", error.response?.data?.message || error.message);
        throw error;
    }
}


// PATCH API for Supervisor edit lorry recipt

export const patchLorryReciptApi = async (id, updatelr) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/lorry-receipt/update/${id}`,
            updatelr,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
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


// DELETE API for Supervisor delete lorry Receipt  

export const deleteLorryReciptApi = async (id) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/lorry-receipt/delete/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );
        console.log("This is Lorry Recipt Delete List by ID : ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error.message?.data || error.message);
        throw error;
    }
}

