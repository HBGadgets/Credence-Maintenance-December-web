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
        profileImage: workerList.profileImage || "Unknown",
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
                    'Content-Type': 'multipart/form-data',

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

// Profile image

export const getWorkerProfileApi = async (profileImage) => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found')

        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/worker/get-profile-image/${profileImage}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            },
        )
        return res.data
    } catch (error) {
        console.error('Error:', error.response?.data || error.message)
        throw error
    }
}


// Company name get api

export const getCompanyNameApi = async () => {
    if (!TOKEN) throw new Error('Authentication token not found')

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/company/get-all`,
        {
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    )

    console.log('All Company Data: ', data)

    return data.map((company) => ({
        id: company._id,
        companyName: company.companyName || 'Unknown',
        email: company.email || 'Unknown',
        mobileNumber: company.mobileNumber || 'Unknown',
        officeNumber: company.officeNumber || 'Unknown',
        address: company.address || 'Unknown',
        gstNumber: company.gstNumber || 'Unknown',
        supervisor: company.supervisorId || 'Unknown',
        digitalSignatureId: company.digitalSignatureId || null,
    }))
}


// Post Api
export const postCompanyNameApi = async (companyData) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/company/create`,
            companyData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'multipart/form-data',

                },
            }
        );

        if (response.status === 201 || response.status === 200) {
            console.log("Company Created Successfully:", response.data);
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error("API Error:", error.response?.data?.message || error.message);

        // Wrap and throw so the parent can catch
        const err = new Error(
            error.response?.data?.message || "Failed to create company"
        );
        err.response = error.response;
        throw err;
    }
};

// Patch api

export const patchCompanyNameApi = async (id, data) => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found')

        const { data: response } = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/company/update/${id}`,
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

export const deleteCompanyNameApi = async (id) => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found')

        const { data } = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/company/delete/${id}`,
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


// Show Digital signature Images of All Drivers Expenses
export const getDigitalSignatureApi = async (digitalSignatureId) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/company/signatureimage/${digitalSignatureId}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        )
        console.log("This is Digital signature Image : ", response.data)
        return response.data // contains base64Data and contentType
    } catch (error) {
        console.error("Error:", error.response?.data || error.message)
        throw error
    }
}
