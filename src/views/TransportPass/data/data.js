import axios from "axios";

const TOKEN = sessionStorage.getItem('crdnsMaintToken') // Get token from cookie

// Get api for worker
export const getWorkerApi = async () => {
    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/worker/get-all`,
        {
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );

    console.log("All Workers Data: ", data);

    return data.workers.map((workerList) => ({
        id: workerList._id,
        name: workerList.name || "Unknown",
        email: workerList.email || "Unknown",
        phone: workerList.phone || "Unknown",
        password: workerList.password || "Unknown",
        supervisorName: workerList.supervisorName || "Unknown",
        supervisorId: workerList.supervisor || "Unknown",
    }))
}


// Post API for worker
export const postWorkerApi = async (workerData) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/worker/create`,
            workerData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );

        if (response.status === 201 || response.status === 200) {
            console.log("Worker Created Successfully:", response.data);
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error("API Error:", error.response?.data?.message || error.message);

        // Wrap and throw so the parent can catch
        const err = new Error(
            error.response?.data?.message || "Failed to create worker"
        );
        err.response = error.response;
        throw err;
    }
};

// Patch for all Driver

export const patchWorkerApi = async (id, data) => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found')

        const { data: response } = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/worker/update/${id}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
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

export const deleteWorkerApi = async (id) => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found')

        const { data } = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/worker/delete/${id}`,
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

