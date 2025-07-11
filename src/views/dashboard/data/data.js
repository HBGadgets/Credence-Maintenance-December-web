import axios from "axios"
const token = sessionStorage.getItem('crdnsMaintToken')

export const fetchDashboardData = async ( userId = null) => {
  try {
    const query = userId ? `?id=${userId}` : '';

    const { data, metadata} = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/dashboard/get-all-data${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
console.log(data);
console.log(metadata);
    return data;
  } catch (error) {
    alert(error?.response?.data?.message || error.message);
    throw error;
  }
};