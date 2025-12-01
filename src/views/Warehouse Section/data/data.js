import axios from "axios";

const TOKEN = sessionStorage.getItem('crdnsMaintToken') // Get token from cookie


// Get Warehouse (with search + pagination)
export const getWarehouseApi = async ({ queryKey }) => {
    const [_key, { search, page, limit }] = queryKey;

    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/warehouse/get`,
        {
            params: {
                search: search || '',
                page,
                limit
            },
            headers: { Authorization: `Bearer ${TOKEN}` }
        }
    );

    return {
        data: data.data.map((item) => ({
            id: item._id,
            wareHouseName: item.wareHouseName || "Unknown",
            location: item.location || "Unknown",
            capacityKg: item.capacityKg || 0
        })),
        total: data.total,
        totalPages: data.totalPages,
        page: data.page
    };
};


// POST Warehouse
export const postWarehouseApi = async (create) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/warehouse/add`,
            create,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create warehouse');
    }
};


// PATCH Warehouse
export const patchWarehouseApi = async (id, data) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/warehouse/update/${id}`,
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


// DELETE Warehouse
export const deleteWarehouseApi = async (id) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/warehouse/delete/${id}`,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Delete failed');
    }
};


// ----------------------------------------------------------------------------------------------------

// inventory section 


// Get Warehouse Product List (with search + pagination)
export const getInventoryApi = async ({ queryKey }) => {
    const [_key, { search, page, limit }] = queryKey;

    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/warehouse/product`,
        {
            params: {
                search: search || '',
                page,
                limit,
            },
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );

    return {
        data: data.data.map((item) => ({
            id: item._id,
            productName: item.name || 'Unknown',
            category: item.category || 'Unknown',
            weight: item.unit || 0, // 👈 FIXED: consistent with table key
        })),
        total: data.total,
        totalPages: data.totalPages,
        page: data.page,
    };
};


// POST Warehouse
export const postInvenotryApi = async (create) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/warehouse/product`,
            create,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create Inventory');
    }
};


// PATCH Warehouse
export const patchInventoryApi = async (id, data) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/warehouse/product/${id}`,
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


// DELETE Warehouse
export const deleteInventoryApi = async (id) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/warehouse/product/${id}`,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Delete failed');
    }
};


