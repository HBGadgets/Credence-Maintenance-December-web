import axios from 'axios'
import Cookies from 'js-cookie'
import { formatDateToDDMMYYYY } from '../../customhooks/useFormattedDate'
const token = Cookies.get('crdnsMaintToken')

export const fetchDashboardData = async (userId = null) => {
  const token = Cookies.get('crdnsMaintToken')

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
  const token = Cookies.get('crdnsMaintToken')

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

// GET API for Daily Trip Logs / Delivery Trips
export const getDailyTripLogsApi = async (paramsOrContext = {}) => {
  let authToken = Cookies.get('crdnsMaintToken') || token
  let page = 1
  let limit = 10
  let search = ''
  let status = ''
  let supervisorId = ''
  let startDate = ''
  let endDate = ''

  if (paramsOrContext?.queryKey) {
    const [_key, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8] = paramsOrContext.queryKey
    if (typeof arg1 === 'object' && arg1 !== null) {
      if (arg1.token) authToken = arg1.token
      if (arg1.page) page = arg1.page
      if (arg1.limit) limit = arg1.limit
      if (arg1.search !== undefined) search = arg1.search
      if (arg1.status !== undefined) status = arg1.status
      if (arg1.supervisorId) supervisorId = arg1.supervisorId
      if (arg1.startDate) startDate = arg1.startDate
      if (arg1.endDate) endDate = arg1.endDate
    } else {
      if (arg1) authToken = arg1
      if (arg2) page = arg2
      if (arg3) limit = arg3
      if (arg4 !== undefined) search = arg4
      if (arg5) supervisorId = arg5
      if (arg6) startDate = arg6
      if (arg7) endDate = arg7
      if (arg8 !== undefined) status = arg8
    }
  } else if (typeof paramsOrContext === 'object' && paramsOrContext !== null) {
    if (paramsOrContext.token) authToken = paramsOrContext.token
    if (paramsOrContext.page) page = paramsOrContext.page
    if (paramsOrContext.limit) limit = paramsOrContext.limit
    if (paramsOrContext.search !== undefined) search = paramsOrContext.search
    if (paramsOrContext.status !== undefined) status = paramsOrContext.status
    if (paramsOrContext.supervisorId) supervisorId = paramsOrContext.supervisorId
    if (paramsOrContext.startDate) startDate = paramsOrContext.startDate
    if (paramsOrContext.endDate) endDate = paramsOrContext.endDate
  }

  if (!authToken) throw new Error('Authentication token not found')

  const queryParams = new URLSearchParams()
  queryParams.append('search', search || '')
  queryParams.append('status', status || '')
  queryParams.append('page', String(page || 1))
  queryParams.append('limit', String(limit === -1 ? 10000 : limit || 10))
  if (supervisorId) queryParams.append('supervisorId', supervisorId)
  if (startDate) queryParams.append('startDate', startDate)
  if (endDate) queryParams.append('endDate', endDate)

  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/daily/tripgetbydriver?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  )

  return data
}

// Get supervisor id
export const fetchAllAdmin = async (userId = null) => {
  const token = Cookies.get('crdnsMaintToken')

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
