import axios from "axios";
import { ReceiptIcon } from "lucide-react";
import { formatDateToDDMMYYYY } from "../../customhooks/useFormattedDate";

// Global token variable
// const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhcnNoYWwiLCJpZCI6IjY3OWIyNmU5Y2UxOTAzYWMyMjdhNDQ0OSIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NzliMjZlOWNlMTkwM2FjMjI3YTQ0NDkiLCJlbWFpbCI6ImhhcnNoYWxAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxOTY3YjNlNjcxNDQ5ZWU0Y2Q5ZjZhODA2MzE1ZmFjMzpjMjdkM2JlNDNhZWRlODRlYjA1NDQxNGIwYzE4ZDY3OSIsInVzZXJuYW1lIjoiaGFyc2hhbCIsIm1vYmlsZSI6IjEyMzQ1Njc4OTAiLCJncm91cHNBc3NpZ25lZCI6WyI2NzliMjZiOWNlMTkwM2FjMjI3YTQ0MmYiXSwiY3JlYXRlZEJ5IjoiNjcxMzY1M2I2MTNjZjJkMmM1MzJlZDBlIiwic3RhdHVzIjoidHJ1ZSIsIm5vdGlmaWNhdGlvbiI6dHJ1ZSwiZGV2aWNlcyI6dHJ1ZSwiZHJpdmVyIjp0cnVlLCJncm91cHMiOnRydWUsImNhdGVnb3J5IjpmYWxzZSwibW9kZWwiOmZhbHNlLCJ1c2VycyI6dHJ1ZSwicmVwb3J0Ijp0cnVlLCJzdG9wIjp0cnVlLCJ0cmF2ZWwiOnRydWUsImdlb2ZlbmNlIjp0cnVlLCJnZW9mZW5jZVJlcG9ydCI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjpmYWxzZSwiZGlzdGFuY2UiOnRydWUsImhpc3RvcnkiOnRydWUsInNlbnNvciI6dHJ1ZSwiaWRsZSI6dHJ1ZSwiYWxlcnRzIjp0cnVlLCJ2ZWhpY2xlIjp0cnVlLCJkZXZpY2VsaW1pdCI6ZmFsc2UsImVudHJpZXNDb3VudCI6MCwiX192IjowLCJ0cmlwcyI6dHJ1ZX0sInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQxMzI4ODE3fQ.pjV3ADLMHpkalJNnh975EL-oiUUQ3aQ6xZv_ArXbxgg";
const TOKEN = sessionStorage.getItem('crdnsMaintToken') // Get token from cookie


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
        supervisor: driverExpenseList.driverId?.supervisor || "Unknown",
        currentVehicleName: driverExpenseList.driverId?.currentVehicleName || "N/A",
        shopName: driverExpenseList.shopName || "Unknown",
        location: driverExpenseList.location || "Unknown",
        lat: driverExpenseList.lat || 'No latitude',
        long: driverExpenseList.long || 'No longitude',
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

// Post for all Driver expense
export const postDriverExpenseApi = async (driverexpenseData) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/driverExpense/create`,
            driverexpenseData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        )

        if (response.status === 201 || response.status === 200) {
            console.log('Driver Expense Created Successfully:', response.data)
            return response.data
        } else {
            throw new Error(`Unexpected response status: ${response.status}`)
        }
    } catch (error) {
        console.error('API Error:', error.response?.data?.message || error.message)

        // Properly throw the error to be caught in parent function
        const err = new Error(
            error.response?.data?.message || 'Failed to create expense'
        )
        err.response = error.response // Attach the original response if needed
        throw err
    }
}


// Patch for all Driver

export const patchDriverExpenseApi = async (id, data) => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found')

        const { data: response } = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/driverExpense/update/${id}`,
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
        console.error('Update driver failed:', error, error.response?.data?.message || error.message)
        throw error
    }
}

// Delete driver expense

export const deleteDriverExpenseApi = async (id) => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found')

        const { data } = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/driverExpense/delete/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            },
        )

        return console.log("error", data.message)
    } catch (error) {
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
        supervisor: vehicleExpenseList.driverId?.supervisor || "Unknown",
        currentVehicleName: vehicleExpenseList.vehicleName || "N/A",
        shopName: vehicleExpenseList.vendor || "Unknown",
        expenseType: vehicleExpenseList.expenseType || "Unknown",
        description: vehicleExpenseList.description || "No description",
        location: vehicleExpenseList.location || 'No location',
        lat: vehicleExpenseList.lat || 'No latitude',
        long: vehicleExpenseList.long || 'No Longitude',
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


// Post for all Vehicle expense
export const postVehicleExpenseApi = async (vehicleexpenseData) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/vehicleExpense/create`,
            vehicleexpenseData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        )

        if (response.status === 201 || response.status === 200) {
            console.log('Vehicle Expense Created Successfully:', response.data)
            return response.data
        } else {
            throw new Error(`Unexpected response status: ${response.status}`)
        }
    } catch (error) {
        console.error('API Error:', error.response?.data?.message || error.message)

        // Properly throw the error to be caught in parent function
        const err = new Error(
            error.response?.data?.message || 'Failed to create expense'
        )
        err.response = error.response // Attach the original response if needed
        throw err
    }
}

// Patch for all Driver

export const patchVehicleExpenseApi = async (id, data) => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found')

        const { data: response } = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/vehicleExpense/update/${id}`,
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
        console.error('Update vehicle expense failed:', error, error.response?.data?.message || error.message)
        throw error
    }
}

// Delete driver expense

export const deleteVehicleExpenseApi = async (id) => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found')

        const { data } = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/vehicleExpense/delete/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            },
        )

        return console.log("error", data.message)
    } catch (error) {
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
        supervisorId: lorryReciptList.supervisorId || "Supervisor ID",
        supervisorName: lorryReciptList.supervisorName || "Supervisor",
        workerName: lorryReciptList?.workerId.name || "No Worker Found",
        workerId: lorryReciptList?.workerId._id || "No Worker Found",
        companyName: lorryReciptList.companyName || "Unknown",
        companyAddress: lorryReciptList.companyAddress || "Unknown",
        companyEmail: lorryReciptList.companyEmail || "Unknown",
        gstIn: lorryReciptList.gstIn || "Unknown",
        companyOfficeNumber: lorryReciptList.companyOfficeNumber || "Unknown",
        companyMobileNumber: lorryReciptList.companyMobileNumber || "Unknown",
        lorryNumber: lorryReciptList.lorryNumber || "Unknown",
        vehicleName: lorryReciptList.vehicleName || "Unknown",
        vehicleId: lorryReciptList.vehicleId || "Unknown",
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
        driverId: lorryReciptList.driverId?._id || "N/A",
        supervisor: lorryReciptList.driverId?.supervisor || "N/A",
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

// ----------------------------------------------------------------------------------- 

// Get Api for all today expense of driver and vehicle

export const getAllTodayExpesesListApi = async () => {
    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vehicleExpense/get-today-expense-of-vehicle-and-driver`,
        {
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );

    console.log("All Today Expenses Data: ", data);

    return data.map((todayExpense) => ({
        id: todayExpense._id,
        originalDate: todayExpense.date,
        date: formatDateToDDMMYYYY(todayExpense.date),
        driverName: todayExpense.driverId?.name || "Unknown",
        supervisor: todayExpense.driverId?.supervisor || "Unknown",
        currentVehicleName: todayExpense.vehicleName || "N/A",
        shopName: todayExpense.vendor || todayExpense.shopName || "Unknown",
        expenseType: todayExpense.expenseType || "No Vehicle Expense",
        description: todayExpense.description || "No description",
        location: todayExpense.location || 'No location',
        lat: todayExpense.lat || 'No latitude',
        long: todayExpense.long || 'No Longitude',
        amount: todayExpense.amount || 0,
        paymentMode: todayExpense.paymentMode || "Unknown",
        billImg: todayExpense.billImg || "No Bill",
    }));
};
