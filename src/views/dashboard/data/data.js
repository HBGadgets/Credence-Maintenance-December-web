import axios from "axios"
const token = sessionStorage.getItem('crdnsMaintToken')

export const fetchDashboardData = async (userId = null) => {
  const token = sessionStorage.getItem('crdnsMaintToken')

  if (!token) throw new Error("Authentication token not found");
  try {
    const query = userId ? `?id=${userId}` : '';
    const { data, metadata } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/dashboard/get-all-data${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    alert(error?.response?.data?.message || error.message);
    throw error;
  }
};
