import { useMemo } from "react";

export const useFormattedDateTime = (timeString) => {
    return useMemo(() => {
        if (!timeString) return "";

        const date = new Date(timeString);
        if (isNaN(date)) return "";

        // Format: DD/MM/YYYY HH:MM:SS (24-hour)
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }, [timeString]);
};
