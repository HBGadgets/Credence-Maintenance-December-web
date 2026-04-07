import axios from "axios";
const TOKEN = sessionStorage.getItem('crdnsMaintToken') // Get token from cookie


// get martial owner
export const getMartialOwnerApi = async ({ queryKey }) => {
    const [_key, { search, page, limit }] = queryKey;

    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/material/owner`,
        {
            params: {
                search: search || '',
                page,
                limit
            },
            headers: { Authorization: `Bearer ${TOKEN}` }
        }
    );

    // the api response
    return {
        data: data.data.map((item) => ({
            id: item._id,
            name: item.name || "Unknown",
            contactNumber: item.contactNumber || "Unknown",
            email: item.email || "Unknown",
            address: item.address || "Unknown",
            supervisorId: item.supervisorId || "Unknown",
        })),
        total: data.count || 0,
        totalPages: Math.ceil((data.count || 0) / limit) || 1,
        page: page
    };
}

// get martial owner
export const getMartialOwnerDropDownApi = async ({ queryKey }) => {
    const [_key, { search, page, limit }] = queryKey;

    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/material/owner/dropdown`,
        {
            params: {
                search: search || '',
                // page,
                // limit
            },
            headers: { Authorization: `Bearer ${TOKEN}` }
        }
    );

    // the api response
    return {
        data: data.data.map((item) => ({
            id: item._id,
            name: item.name || "Unknown",

        })),
        total: data.count || 0,
        totalPages: Math.ceil((data.count || 0) / limit) || 1,
        page: page
    };
}

// Post Material Owner
export const postMartialOwnerApi = async (create) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/material/owner`,
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

// PATCH Material Owner
export const patchMaterialOwnerApi = async (id, data) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/material/owner/${id}`,
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

// DELETE Material Owner
export const deleteMaterialOwnerApi = async (id) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/material/owner/${id}`,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Delete failed');
    }
};


