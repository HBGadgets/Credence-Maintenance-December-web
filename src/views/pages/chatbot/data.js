import axios from "axios";

export const fetchChatApi = async (receiverId) => {
    try {
        const token = sessionStorage.getItem("crdnsMaintToken");
        if (!token) throw new Error("Authentication token not found");

        const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/message/chat?senderId=${receiverId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        // Always return the messages array
        return Array.isArray(data?.messages) ? data.messages : [];
    } catch (error) {
        console.error("Error fetching chat:", error);
        alert(error.message);
        return [];
    }
};
