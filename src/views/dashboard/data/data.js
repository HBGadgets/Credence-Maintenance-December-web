import axios from 'axios'
import { formatDateToDDMMYYYY } from '../../customhooks/useFormattedDate'
const token = sessionStorage.getItem('crdnsMaintToken')

export const fetchDashboardData = async (userId = null) => {
  const token = sessionStorage.getItem('crdnsMaintToken')

  if (!token) throw new Error('Authentication token not found')
  try {
    const query = userId ? `?id=${userId}` : ''
    const { data, metadata } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/dashboard/get-all-data${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return data
  } catch (error) {
    // alert(error?.response?.data?.message || error.message);
    console.log('Error', error?.response?.data?.message || error.message)
    throw error
  }
}

// GET API for Trip List
export const getAllTripListApi = async (userId = null) => {
  const token = sessionStorage.getItem('crdnsMaintToken')

  if (!token) throw new Error('Authentication token not found')

  const query = userId ? `?id=${userId}` : ''
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/trips/get${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  console.log('All drivers list for today marked as present: ', data)

  // Sort data by date in descending order (latest date first)
  const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date))

  return sortedData.map((TripsList) => ({
    id: TripsList._id,
    orginalDate: TripsList.date,
    date: formatDateToDDMMYYYY(TripsList.date),
    driverName: TripsList?.driverId?.name || 'N/A',
    vehicleName: TripsList.vehicleName,
    startLocation: TripsList.startLocation,
    endLocation: TripsList.endLocation,
    budgetAllocated: TripsList.budgetAllocated,
    subTripBudgetAllocated: TripsList.subTripBudgetAllocated,
    supervisorId: TripsList.supervisorId,
    spentAmount: TripsList.spentAmount,
    materialType: TripsList.materialType,
    status: TripsList.status,
    updatedAt: TripsList.updatedAt,
  }))
}

// Get supervisor id
export const fetchAllAdmin = async (userId = null) => {
  const token = sessionStorage.getItem('crdnsMaintToken')

  if (!token) {
    throw new Error('Authentication token not found')
  }

  try {
    const query = userId ? `?id=${userId}` : ''

    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/get${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Normalize data to array
    const users = Array.isArray(data) ? data : data.users || data.data || []

    return users.map((sup) => ({
      value: sup._id,
      label: sup.username || sup.name || 'Unnamed User',
    }))
  } catch (error) {
    console.error('Supervisor fetch error:', error?.response?.data?.message || error.message)
    throw error
  }
}
