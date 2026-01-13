import axios from "axios";
import { formatDateToDDMMYYYY } from "../../customhooks/useFormattedDate";

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


// warehouse profile by id

export const getWarehouseProfileApi = async ({ queryKey }) => {
    const [_key, { search, page, limit, id }] = queryKey

    if (!TOKEN) throw new Error('Authentication token not found')

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/warehouseproduct/get`,
        {
            params: {
                warehouseId: id,
                search: search || '',
                page,
                limit,
            },
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    )

    const formattedData = data.data.flatMap((item) =>
        item.products.map((product) => ({
            id: `${item._id}-${product._id}`,

            warehouseId: item.warehouseId?._id,
            wareHouseName: item.warehouseId?.wareHouseName || 'Unknown',
            location: item.warehouseId?.location || 'Unknown',

            productId: product.productId?._id,
            productName: product.productId?.name || 'Unknown',
            quantityMT: product.quantityMT,
            productTotalCountMT: product.productTotalCountMT,
        }))
    )

    return {
        data: formattedData,
        total: data.totalItems,
        totalPages: data.totalPages,
        page: data.page,
    }
}


// ----------------------------------------------------------------------------------------------------

// Product list section 


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
            _id: item._id,
            id: item._id,
            productName: item.name || 'Unknown',
            category: item.category || 'Unknown',
        })),
        total: data.total,
        totalPages: data.totalPages,
        page: data.page,
        hasMore: data.page < data.totalPages,
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


// ----------------------------------------------------------------------------------------------


//  inventory section

// get api for warehouse name droplist

export const getWarehouseListApi = async ({ search, page, limit }) => {
    if (!TOKEN) throw new Error("Authentication token not found");

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/warehouse/dropdown/list`,
        {
            params: {
                search: search || "",
                page,
                limit,
            },
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );

    return {
        data: data.data.map((item) => ({
            _id: item._id,
            id: item._id,
            wareHouseName: item.wareHouseName || "Unknown",
        })),
        total: data.total,
        totalPages: data.totalPages,
        page: data.page,
        hasMore: data.page < data.totalPages,
    };
};


//  get api for inventory and warehouse details

export const getInventoryProductListApi = async ({ queryKey }) => {

    const [_key, { search, page, limit }] = queryKey;


    if (!TOKEN) throw new Error("Authentication token not found");

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/warehouseproduct/get`,
        {
            params: {
                search: search || "",
                page,
                limit,
            },
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );

    return {
        data: data.data.flatMap(item =>
            item.products.map(p => ({
                _id: item._id,
                wareHouseName: item.warehouseId?.wareHouseName || "Unknown",
                location: item.warehouseId?.location || "",
                capacityKg: item.warehouseId?.capacityKg || "",
                totalQuantityKg: item.totalQuantityKg || " ",
                // product section
                productId: p.productId?._id,
                productName: p.productId?.name,
                quantityKg: p.quantityKg,
                bagSizeKg: p.bagSizeKg,
                totalBags: p.totalBags,
            }))
        ),

        total: data.totalItems,
        totalPages: data.totalPages,
        page: data.page,
    };
};


// POST Warehouse and product list
export const postInvenotryProductListApi = async (create) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/warehouseproduct/add`,
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

// PATCH Warehouse and productlist
export const patchInventoryProductListApi = async (id, data) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/warehouseproduct/update/${id}`,
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
export const deleteInventoryProductListApi = async (id) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/warehouseproduct/delete/${id}`,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Delete failed');
    }
};

// --------------------------------------------------------------------------------------------------

// Godown LR tp pass

export const getGodownTPApi = async ({ queryKey }) => {
    const [_key, { search, page, limit, consignorId, consigneeId, workerId }] = queryKey;

    if (!TOKEN) throw new Error('Authentication token not found');

    const params = {
        search: search || "",
        page,
        limit,
    };

    // Add consignorId filter if provided
    if (consignorId) {
        params.consignorId = consignorId;
    }

    // Add consigneeId filter if provided
    if (consigneeId) {
        params.consigneeId = consigneeId;
    }

    // worker
    if (workerId) {
        params.workerId = workerId;
    }

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/godown-lorry-receipt/get`,
        {
            params,
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );

    console.log("All Lorry Receipts Data: ", data);

    // return final mapped structure
    return {
        total: data.total,
        page: data.page,
        limit: data.limit,

        receipts: data.receipts.map((item) => ({
            id: item._id,
            date: formatDateToDDMMYYYY(item.date),
            originalDate: item.date,
            receiptNo: item.receiptNo,
            issuedBy: item.issuedBy,
            receivedBy: item.receivedBy,

            companyId: item.companyId?._id,
            companyName: item.companyId?.companyName,
            companyEmail: item.companyId?.email,
            companyAddress: item.companyId?.address,
            companymobileNumber: item.companyId?.mobileNumber,
            companyofficeNumber: item.companyId?.officeNumber,
            companygstNumber: item.companyId?.companyName,
            digitalSignatureId: item.companyId?.digitalSignatureId,

            consignorId: item.consignorId,
            consignorName: item.consignorName,
            consignorAddress: item.consignorAddress,
            consigneeId: item.consigneeId,
            consigneeName: item.consigneeName,
            consigneeAddress: item.consigneeAddress,


            workerId: item.workerId?._id,
            workerName: item.workerId?.name,

            customerName: item.customerName,
            customerAddress: item.customerAddress,
            startLocation: item.startLocation,
            endLocation: item.endLocation,

            vehicleId: item.vehicleId,
            vehicleName: item.vehicleName,

            driverId: item.driverId,
            driverName: item.driverName,
            supervisorId: item.supervisorId,

            acknowledgementImage: item.acknowledgementImage,

            products: item.products?.map((p) => ({
                warehouseId: p.warehouseId,
                warehouseName: p.warehouseName,
                productId: p.productId,
                productName: p.productName,
                quantityMT: p.quantityMT || "0",
                bagSize: p.bagSize || "0",
                totalBags: p.totalBags || "0",
                updatedQuantityMT: p.updatedQuantityMT || "0",
                id: p._id,
            })) || [],

            customerRate: item.customerRate || "0",
            totalAmount: item.totalAmount || "0",
            transporterRate: item.transporterRate || "0",
            totalTransporterAmount: item.totalTransporterAmount || "0",
            transporterRateOn: item.transporterRateOn || "0",
            customerRateOn: item.customerRateOn || "0",
            customerFreight: item.customerFreight || "0",
            transporterFreight: item.transporterFreight || "0",
            status: item.status,

        })),
    };
};

// post 
export const postGodownTPApi = async (create) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/godown-lorry-receipt/create`,
            create,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );

        return response.data;
    } catch (error) {
        // If server returns 500 internal error
        if (error.response?.status === 500) {
            throw new Error("Server Error (500): Please try again later.");
        }

        // Other API errors
        throw new Error(error.response?.data?.message || "Failed to create Inventory");
    }
};


// PATCH Warehouse and productlist
// export const patchGodownTPApi = async (id, data) => {
//     try {
//         const response = await axios.patch(
//             `${import.meta.env.VITE_API_URL}/api/godown-lorry-receipt/update/${id}`,
//             data,
//             {
//                 headers: { Authorization: `Bearer ${TOKEN}` },
//             }
//         );

//         return response.data;
//     } catch (error) {
//         throw new Error(error.response?.data?.message || 'Update failed');
//     }
// };

// Status update 

export const patchGodownTPStatusApi = async (id, data) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/godown-lorry-receipt/update-status/${id}`,
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
export const deleteGodownTPApi = async (id) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/godown-lorry-receipt/softdelete/${id}`,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Delete failed');
    }
};


// acknowledgementImage

export const patchAcknowledgementsApi = async (id, formData) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/godown-lorry-receipt/update-status/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        )
        return response.data
    } catch (error) {
        console.error("Error:", error.response?.data || error.message)
        throw error
    }
}

// ------------------------------------------------------------------------------------------------------ 

// Railhead Get Api 

export const getRailHeadApi = async ({ queryKey }) => {
    const [_key, { search, page, limit }] = queryKey

    if (!TOKEN) throw new Error('Authentication token not found')

    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/railhead/get`,
        {
            params: {
                search: search || '',
                page,
                limit,
            },
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    )

    // Check if response.data exists and has the expected structure
    if (!response.data) {
        throw new Error('No data received from API')
    }

    const apiData = response.data

    // Transform the data items
    const transformedData = Array.isArray(apiData.data)
        ? apiData.data.map((item) => ({
            id: item._id,
            createdAt: formatDateToDDMMYYYY(item.createdAt) || "--",
            productId: item.productId || "",
            productName: item.productName || 'Unknown',
            quantityMT: item.quantityMT || 0,

        }))
        : []

    return {
        data: transformedData,
        total: apiData.totalItems || apiData.total || 0,
        totalPages: apiData.totalPages || 1,
        page: apiData.page || 1,
    }
}

// PATCH Railhead inventory 
export const patchRailHeadApi = async (id, data) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/railhead/update/${id}`,
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

// ------------------------------------------------------------------------------------------------------------- 

