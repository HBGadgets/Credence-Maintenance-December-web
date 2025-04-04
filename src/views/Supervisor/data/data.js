import axios from "axios";

// Global token variable
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhcnNoYWwiLCJpZCI6IjY3OWIyNmU5Y2UxOTAzYWMyMjdhNDQ0OSIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NzliMjZlOWNlMTkwM2FjMjI3YTQ0NDkiLCJlbWFpbCI6ImhhcnNoYWxAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxOTY3YjNlNjcxNDQ5ZWU0Y2Q5ZjZhODA2MzE1ZmFjMzpjMjdkM2JlNDNhZWRlODRlYjA1NDQxNGIwYzE4ZDY3OSIsInVzZXJuYW1lIjoiaGFyc2hhbCIsIm1vYmlsZSI6IjEyMzQ1Njc4OTAiLCJncm91cHNBc3NpZ25lZCI6WyI2NzliMjZiOWNlMTkwM2FjMjI3YTQ0MmYiXSwiY3JlYXRlZEJ5IjoiNjcxMzY1M2I2MTNjZjJkMmM1MzJlZDBlIiwic3RhdHVzIjoidHJ1ZSIsIm5vdGlmaWNhdGlvbiI6dHJ1ZSwiZGV2aWNlcyI6dHJ1ZSwiZHJpdmVyIjp0cnVlLCJncm91cHMiOnRydWUsImNhdGVnb3J5IjpmYWxzZSwibW9kZWwiOmZhbHNlLCJ1c2VycyI6dHJ1ZSwicmVwb3J0Ijp0cnVlLCJzdG9wIjp0cnVlLCJ0cmF2ZWwiOnRydWUsImdlb2ZlbmNlIjp0cnVlLCJnZW9mZW5jZVJlcG9ydCI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjpmYWxzZSwiZGlzdGFuY2UiOnRydWUsImhpc3RvcnkiOnRydWUsInNlbnNvciI6dHJ1ZSwiaWRsZSI6dHJ1ZSwiYWxlcnRzIjp0cnVlLCJ2ZWhpY2xlIjp0cnVlLCJkZXZpY2VsaW1pdCI6ZmFsc2UsImVudHJpZXNDb3VudCI6MCwiX192IjowLCJ0cmlwcyI6dHJ1ZX0sInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQxMzI4ODE3fQ.pjV3ADLMHpkalJNnh975EL-oiUUQ3aQ6xZv_ArXbxgg";


// GET API Supervisor See Driver List all

export const getDriverListApi = async (id) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/attendance/get-remaining-attendence-of-drivers`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );
        console.log("This all drivers list for today mark for present : ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error.message?.data || error.message);
        throw error;
    }
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

export const postDriverSalaryApi = async (id) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/salary/create/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                }
            }
        );

        if (response.status === 200) {
            console.log("Driver Salary Created Successfully:", response.data);
            return response.data;
        }
        throw new Error("Failed to create Driver Salary");

    } catch (error) {
        console.error("API Error:", error.response?.data?.message || error.message);
        return null; // Return null to indicate failure
    }
}




