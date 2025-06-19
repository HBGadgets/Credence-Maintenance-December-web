import axios from "axios";
import { formatDateToDDMMYYYY } from "../../customhooks/useFormattedDate";


// Global token variable
// const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhcnNoYWwiLCJpZCI6IjY3OWIyNmU5Y2UxOTAzYWMyMjdhNDQ0OSIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NzliMjZlOWNlMTkwM2FjMjI3YTQ0NDkiLCJlbWFpbCI6ImhhcnNoYWxAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxOTY3YjNlNjcxNDQ5ZWU0Y2Q5ZjZhODA2MzE1ZmFjMzpjMjdkM2JlNDNhZWRlODRlYjA1NDQxNGIwYzE4ZDY3OSIsInVzZXJuYW1lIjoiaGFyc2hhbCIsIm1vYmlsZSI6IjEyMzQ1Njc4OTAiLCJncm91cHNBc3NpZ25lZCI6WyI2NzliMjZiOWNlMTkwM2FjMjI3YTQ0MmYiXSwiY3JlYXRlZEJ5IjoiNjcxMzY1M2I2MTNjZjJkMmM1MzJlZDBlIiwic3RhdHVzIjoidHJ1ZSIsIm5vdGlmaWNhdGlvbiI6dHJ1ZSwiZGV2aWNlcyI6dHJ1ZSwiZHJpdmVyIjp0cnVlLCJncm91cHMiOnRydWUsImNhdGVnb3J5IjpmYWxzZSwibW9kZWwiOmZhbHNlLCJ1c2VycyI6dHJ1ZSwicmVwb3J0Ijp0cnVlLCJzdG9wIjp0cnVlLCJ0cmF2ZWwiOnRydWUsImdlb2ZlbmNlIjp0cnVlLCJnZW9mZW5jZVJlcG9ydCI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjpmYWxzZSwiZGlzdGFuY2UiOnRydWUsImhpc3RvcnkiOnRydWUsInNlbnNvciI6dHJ1ZSwiaWRsZSI6dHJ1ZSwiYWxlcnRzIjp0cnVlLCJ2ZWhpY2xlIjp0cnVlLCJkZXZpY2VsaW1pdCI6ZmFsc2UsImVudHJpZXNDb3VudCI6MCwiX192IjowLCJ0cmlwcyI6dHJ1ZX0sInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQxMzI4ODE3fQ.pjV3ADLMHpkalJNnh975EL-oiUUQ3aQ6xZv_ArXbxgg";

// const TT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhcnNoYWwiLCJpZCI6IjY3OWIyNmU5Y2UxOTAzYWMyMjdhNDQ0OSIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NzliMjZlOWNlMTkwM2FjMjI3YTQ0NDkiLCJlbWFpbCI6ImhhcnNoYWxAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxOTY3YjNlNjcxNDQ5ZWU0Y2Q5ZjZhODA2MzE1ZmFjMzpjMjdkM2JlNDNhZWRlODRlYjA1NDQxNGIwYzE4ZDY3OSIsInVzZXJuYW1lIjoiaGFyc2hhbCIsIm1vYmlsZSI6IjEyMzQ1Njc4OTAiLCJncm91cHNBc3NpZ25lZCI6WyI2NzliMjZiOWNlMTkwM2FjMjI3YTQ0MmYiXSwiY3JlYXRlZEJ5IjoiNjcxMzY1M2I2MTNjZjJkMmM1MzJlZDBlIiwic3RhdHVzIjoidHJ1ZSIsIm5vdGlmaWNhdGlvbiI6dHJ1ZSwiZGV2aWNlcyI6dHJ1ZSwiZHJpdmVyIjp0cnVlLCJncm91cHMiOnRydWUsImNhdGVnb3J5IjpmYWxzZSwibW9kZWwiOmZhbHNlLCJ1c2VycyI6dHJ1ZSwicmVwb3J0Ijp0cnVlLCJzdG9wIjp0cnVlLCJ0cmF2ZWwiOnRydWUsImdlb2ZlbmNlIjp0cnVlLCJnZW9mZW5jZVJlcG9ydCI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjpmYWxzZSwiZGlzdGFuY2UiOnRydWUsImhpc3RvcnkiOnRydWUsInNlbnNvciI6dHJ1ZSwiaWRsZSI6dHJ1ZSwiYWxlcnRzIjp0cnVlLCJ2ZWhpY2xlIjp0cnVlLCJkZXZpY2VsaW1pdCI6ZmFsc2UsImVudHJpZXNDb3VudCI6MCwiX192IjowLCJ0cmlwcyI6dHJ1ZX0sInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQxMTUzMTYyfQ.xsiU5Pz5T2_CNIooO_Uq1E01vjJYWCKXNDXCdTFMBdE"

const TOKEN = sessionStorage.getItem('crdnsMaintToken') // Get token from cookie
const TT = sessionStorage.getItem('crdnsMaintToken') // Get token from cookie


// GET API Supervisor See Driver List all

export const getDriverListApi = async (id) => {
    if (!TOKEN) throw new Error("Authentication token not found");

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/attendance/get-remaining-attendence-of-drivers`,
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        }
    );
    console.log("This all drivers list for today mark for present : ", data);

    return data.map((driverlist) => ({
        id: driverlist._id,
        name: driverlist.name,
        contactNumber: driverlist.contactNumber,
        email: driverlist.email,
    }));
}

// Get API for Mark Attendance Fromm Supervisor.

export const markAttendanceBySupervisorApi = async (id) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/attendance/mark-by-supervisor/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );
        console.log("This is today marked present Driver list : ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error.message?.data || error.message);
        throw error;
    }
}


// --------------------------------------------------------------------------------------------------------------------

// GET API for Leave Request list for supervisor.

export const getLeaveResquestDriverApi = async (id) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/leave/get-leaves-for-approval`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );
        console.log("This is leave request of Driver : ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error.message?.data || error.message);
        throw error;
    }
}

// PATCH API for Approved Leave Request.

export const updateLeaveRequestStatus = async (id, status) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/leave/update/${id}`,
            { status }, // Sending status as payload
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`, // Ensure you have the token available
                    'Content-Type': 'application/json',
                },
            }
        )

        console.log('Leave Request Updated:', response.data)
        return response.data
    } catch (error) {
        console.error('Error updating leave request:', error.response?.data || error.message)
        throw error
    }
}


// ----------------------------------------------------------------------------------------------------------------------------------- 

//  GET API FOR Driver Salary List.
export const getDriverSalaryListApiByMonth = async (month) => {
    try {
        console.log(`Fetching Driver Salary List for month: ${month}`);

        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/salary/get-by-month/${month}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );

        if (!response.data || response.status !== 200) {
            throw new Error("Invalid response from server");
        }

        console.log("Driver Salary List:", response.data);
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data?.message || error.message);
        return []; // Return an empty array to prevent crashes
    }
};


// POST API for Driver Salary.
export const postDriverSalaryApi = async (id, salaryData) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/salary/create/${id}`,
            salaryData,
            {
                headers: {
                    Authorization: `Bearer ${TT}`, // Make sure TT is your valid token
                    'Content-Type': 'application/json',
                },
            }
        )

        if (response.status === 201 || response.status === 200) {
            console.log('Driver Salary Created Successfully:', response.data)
            return response.data
        } else {
            throw new Error(`Unexpected response status: ${response.status}`)
        }
    } catch (error) {
        console.error('API Error:', error.response?.data?.message || error.message)

        // Properly throw the error to be caught in parent function
        const err = new Error(
            error.response?.data?.message || 'Failed to create salary'
        )
        err.response = error.response // Attach the original response if needed
        throw err
    }
}



// DELETE API for Driver Salary.
export const deleteDriverSalaryApi = async (id) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/salary/delete/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );
    } catch (error) {
        console.error("Error:", error.message?.data || error.message);
        throw error;
    }
}

// PATCH API for Driver Salary.

export const patchDriverSalaryApi = async (id, updatedData) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/salary/update/${id}`,
            updatedData, // Only changed fields
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
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
};


// -------------------------------------------------------------------------------------------------------------------------------- 

// GET API for Trip List.
export const getTripListApi = async () => {

    if (!TOKEN) throw new Error("Authentication token not found");

    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/trips/get`,
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        }
    );
    console.log("This all drivers list for today mark for present : ", data);

    return data.map((TripsList) => ({
        id: TripsList._id,
        orginalDate: TripsList.date,
        date: formatDateToDDMMYYYY(TripsList.date),
        driverName: TripsList?.driverId.name,
        vehicleName: TripsList.vehicleName,
        startLocation: TripsList.startLocation,
        endLocation: TripsList.endLocation,
        budgetAllocated: TripsList.budgetAllocated,
        spentAmount: TripsList.spentAmount,
        materialType: TripsList.materialType,
        status: TripsList.status,
        updatedAt: TripsList.updatedAt,

    }));
}


// POST API for Trip.

export const postTripApi = async (tripData) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/trips/create`,
            tripData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
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


// PATCH API for Trip List by ID.

export const patchTripApi = async (id, update) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/trips/update/${id}`,
            update,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );
        console.log("This is Trip Update List by ID : ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error.message?.data || error.message);
        throw error;
    }
}


// DELETE API for Trip List by ID.

export const deleteTripApi = async (id) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/trips/delete/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );
        console.log("This is Trip Delete List by ID : ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error.message?.data || error.message);
        throw error;
    }
}


// SubTripList

export const getSubTripsApi = async (id) => {
    if (!TOKEN) throw new Error("Authentication token not found");

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/trips/get-trip-analytics-by-trip-id/${id}`,
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        }
    );

    const mainTrip = data.trips;
    const subTrips = data.subtrip || [];

    return {
        mainTrip: {
            id: mainTrip._id,
            driverName: mainTrip?.driverId?.name || "",
            vehicleName: mainTrip.vehicleName,
            startLocation: mainTrip.startLocation,
            endLocation: mainTrip.endLocation,
            date: formatDateToDDMMYYYY(mainTrip.date),
            budgetAllocated: mainTrip.budgetAllocated,
            spentAmount: mainTrip.spentAmount,
            status: mainTrip.status,
            materialType: mainTrip.materialType,
        },
        subTrips: subTrips.map((sub) => ({
            id: sub._id,
            startLocation: sub.startLocation,
            endLocation: sub.endLocation,
            companyName: sub.companyName || "",
            materialType: sub.materialType || "",
            date: formatDateToDDMMYYYY(sub.date),
            orginalDate: sub.date,
            budgetAllocated: sub.budgetAllocated,
            status: sub.status,
        })),
    };
};


// -------------------------------------------------------------------- 

// Post Subtrip

export const postSubtripApi = async (id, subtripData) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/subtrip/create?tripId=${id}`,
            subtripData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        )

        if (response.status === 201 || response.status === 200) {
            console.log('Sub trips Created Successfully:', response.data)
            return response.data
        } else {
            throw new Error(`Unexpected response status: ${response.status}`)
        }
    } catch (error) {
        console.error('API Error:', error.response?.data?.message || error.message)

        // Properly throw the error to be caught in parent function
        const err = new Error(
            error.response?.data?.message || 'Failed to create subtrip'
        )
        err.response = error.response // Attach the original response if needed
        throw err
    }
}



// PATCH subtrip

export const patchSubtripApi = async (id, data) => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found')

        const { data: response } = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/subtrip/update/${id}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
            },
        )

        return response
    } catch (error) {
        console.error('Update subtrip failed:', error, error.response?.data?.message || error.message)
        throw error
    }
}


// Delete driver expense

export const deleteSubtripApi = async (id) => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found')

        const { data } = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/subtrip/delete/${id}`,
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


