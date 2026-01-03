import axios from "axios";
const TOKEN = sessionStorage.getItem('crdnsMaintToken') // Get token from cookie


// get consigner

export const getConsigneeApi = async ({ queryKey }) => {
    const [_key, { search, page, limit }] = queryKey;

    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/consignee/get`,
        {
            params: {
                search: search || '',
                page,
                limit
            },
            headers: { Authorization: `Bearer ${TOKEN}` }
        }
    );

    // The API response has { count, consignees } structure
    return {
        data: data.consignees.map((item) => ({
            id: item._id,
            name: item.name || "Unknown",
            address: item.address || "Unknown",
        })),
        total: data.count || 0,
        totalPages: Math.ceil((data.count || 0) / limit) || 1,
        page: page
    };
};

// Post Consignee
export const postConsigneeApi = async (create) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/consignee/create`,
            create,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create consignee');
    }
};

// PATCH Consignee
export const patchConsigneeApi = async (id, data) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/consignee/update/${id}`,
            data,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Update failed');
    }
};

// DELETE Consignee
export const deleteConsigneeApi = async (id) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/consignee/delete/${id}`,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Delete failed');
    }
};

// ----------------------------------------------------------------------------------------------------------------

// Consignor

// get Consignor

export const getConsignorApi = async ({ queryKey }) => {
    const [_key, { search, page, limit }] = queryKey;

    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/consignor/get`,
        {
            params: {
                search: search || '',
                page,
                limit
            },
            headers: { Authorization: `Bearer ${TOKEN}` }
        }
    );

    // The API response has { count, Consignor } structure
    return {
        data: data.consignors.map((item) => ({
            id: item._id,
            name: item.name || "Unknown",
            address: item.address || "Unknown",
        })),
        total: data.count || 0,
        totalPages: Math.ceil((data.count || 0) / limit) || 1,
        page: page
    };
};

// Post Consignor
export const postConsignorApi = async (create) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/consignor/create`,
            create,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create Consignor');
    }
};

// PATCH Consignor
export const patchConsignorApi = async (id, data) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/consignor/update/${id}`,
            data,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Update failed');
    }
};

// DELETE Consignor
export const deleteConsignorApi = async (id) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/consignor/delete/${id}`,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Delete failed');
    }
};





