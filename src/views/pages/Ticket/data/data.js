import axios from "axios";
import { formatDateToDDMMYYYY } from "../../../customhooks/useFormattedDate";
import { useDateTime } from "../../../customhooks/useDateTime";

// Global token variable
const TOKEN = sessionStorage.getItem('crdnsMaintToken') // Get token from cookie


// GET API Supervisor See ALL Drivers Expesense List.

export const getAllRaiseTicektApi = async () => {
    if (!TOKEN) throw new Error('Authentication token not found');

    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/help-and-support/get-tickets`,
        {
            headers: { Authorization: `Bearer ${TOKEN}` },
        }
    );

    console.log("Raise Ticket Data: ", data);

    // FIX: Access the `tickets` array inside the response
    return data.tickets.map((raiseticket) => ({
        id: raiseticket._id,
        date: useDateTime(raiseticket.createdAt),
        originalDate: raiseticket.createdAt || raiseticket.updatedAt,
        updateDate: useDateTime(raiseticket.updatedAt),
        vehicleName: raiseticket.vehicle || "Not Assigned",
        driverName: raiseticket?.driver?.name || "Created by Supervisor",
        supervisor: raiseticket.supervisor || "Created by Superadmin",
        supervisorId: raiseticket.supervisorId || "Not Assigned",
        ticketType: raiseticket.ticketType || "Not Assigned",
        status: raiseticket.status || "Not Assigned",
        description: raiseticket.description || "Not Available",
        feedback: raiseticket.feedback || "Responding soon...",
    }));
}



// Post api

export const postRaiseTicketApi = async (raiseTicketData) => {
    console.log("AAAAAAA", raiseTicketData);
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/help-and-support/create`,
            raiseTicketData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        )

        if (response.status === 201 || response.status === 200) {
            console.log('Raise Ticket Created Successfully:', response.data)
            return response.data
        } else {
            throw new Error(`Unexpected response status: ${response.status}`)
        }
    } catch (error) {
        console.error('API Error:', error.response?.data?.message || error.message)

        // Properly throw the error to be caught in parent function
        const err = new Error(
            error.response?.data?.message || 'Failed to created raise ticket'
        )
        err.response = error.response // Attach the original response if needed
        throw err
    }
}


// patch api for superadmin

export const patchAnsweredTicketApi = async (id, data) => {
    try {
        if (!TOKEN) throw new Error('Authentication token not found')

        const { data: response } = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/help-and-support/update/${id}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            },
        )

        return response
    } catch (error) {
        console.error('Update Answered ticket failed:', error, error.response?.data?.message || error.message)
        throw error
    }
}


