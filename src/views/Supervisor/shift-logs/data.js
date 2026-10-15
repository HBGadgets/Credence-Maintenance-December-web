import axios from 'axios'
import Cookies from 'js-cookie'

const getToken = () => Cookies.get('crdnsMaintToken')

export const formatShiftDateTime = (isoString) => {
  if (!isoString) return 'N/A'
  try {
    const d = new Date(isoString)
    if (isNaN(d.getTime())) return isoString

    const pad = (n) => String(n).padStart(2, '0')
    const day = pad(d.getDate())
    const month = pad(d.getMonth() + 1)
    const year = d.getFullYear()
    let hours = d.getHours()
    const minutes = pad(d.getMinutes())
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12

    return `${day}/${month}/${year} ${pad(hours)}:${minutes} ${ampm}`
  } catch {
    return isoString
  }
}

export const computeDuration = (assignedAt, unassignedAt = null) => {
  if (!assignedAt) return '0m'
  try {
    const start = new Date(assignedAt).getTime()
    const end = unassignedAt ? new Date(unassignedAt).getTime() : Date.now()
    if (isNaN(start) || isNaN(end)) return '0m'

    const diffMinutes = Math.max(0, Math.floor((end - start) / (1000 * 60)))
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60

    if (hours === 0) return `${minutes}m`
    return `${hours}h ${minutes}m`
  } catch {
    return '0m'
  }
}

// GET Active Shift Logs API
export const getActiveShiftLogsApi = async () => {
  try {
    const authToken = getToken()
    if (!authToken) throw new Error('Authentication token not found')

    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
    const url = `${baseUrl}/api/shift-logs/active`

    let responseData = null

    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      responseData = data
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.msg ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        err?.message ||
        'Internal Server Error'

      console.error('Failed to fetch active shift logs from backend:', {
        status: err?.response?.status,
        data: err?.response?.data,
        message: serverMessage,
      })

      const error = new Error(serverMessage)
      error.status = err?.response?.status || 500
      error.response = err?.response
      throw error
    }

    const rawList = Array.isArray(responseData?.data)
      ? responseData.data
      : Array.isArray(responseData)
        ? responseData
        : []

    const transformedList = rawList.map((item) => {
      // Driver details
      const driverObj = typeof item.driverId === 'object' && item.driverId !== null ? item.driverId : {}
      const driverId = driverObj._id || item.driverId || ''
      const driverName = item.driverName || driverObj.name || 'N/A'
      const contactNumber = driverObj.contactNumber || item.contactNumber || 'N/A'
      const email = driverObj.email || item.email || ''
      const licenseNumber = driverObj.licenseNumber || ''

      // Vehicle details
      const vehicleObj = typeof item.vehicleId === 'object' && item.vehicleId !== null ? item.vehicleId : {}
      const vehicleId = vehicleObj._id || item.vehicleId || ''
      const vehicleName = item.vehicleName || vehicleObj.name || 'N/A'
      const vehicleCategory = vehicleObj.category || ''
      const vehicleModel = vehicleObj.model || ''
      const deviceId = vehicleObj.deviceId || ''
      const uniqueId = vehicleObj.uniqueId || ''

      // Live dynamic duration fallback if item.duration is '0m' or missing
      const liveDuration = computeDuration(item.assignedAt, item.unassignedAt)
      const duration = item.duration && item.duration !== '0m' ? item.duration : liveDuration

      return {
        id: item._id,
        _id: item._id,
        vehicleId,
        vehicleName,
        vehicleCategory,
        vehicleModel,
        deviceId,
        uniqueId,
        driverId,
        driverName,
        contactNumber,
        email,
        licenseNumber,
        assignedAt: item.assignedAt,
        assignedAtFormatted: formatShiftDateTime(item.assignedAt),
        unassignedAt: item.unassignedAt,
        status: (item.status || 'active').toLowerCase(),
        assignmentType: item.assignmentType || 'manual',
        duration,
        remarks: item.remarks || '',
        supervisor: item.supervisorId || item.supervisor || driverObj.supervisor || null,
        supervisorId: item.supervisorId || null,
        assignedBy: item.assignedBy || null,
        raw: item,
      }
    })

    return {
      success: responseData?.success ?? true,
      total: responseData?.total ?? transformedList.length,
      totalActive: responseData?.totalActive ?? responseData?.total ?? transformedList.length,
      currentPage: responseData?.currentPage ?? 1,
      limit: responseData?.limit ?? 10,
      totalPages: responseData?.totalPages ?? 1,
      hasNextPage: responseData?.hasNextPage ?? false,
      hasPrevPage: responseData?.hasPrevPage ?? false,
      data: transformedList,
    }
  } catch (error) {
    console.error('Failed to fetch active shift logs:', error)
    throw error
  }
}

// GET Vehicle Shift Logs List API
export const getVehicleShiftLogsApi = async (params = {}) => {
  try {
    const authToken = getToken()
    if (!authToken) throw new Error('Authentication token not found')

    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
    const url = baseUrl.endsWith('/api')
      ? `${baseUrl}/shift-logs/vehicle/all`
      : `${baseUrl}/api/shift-logs/vehicle/all`

    // Clean params
    const queryParams = {}
    if (params.page !== undefined && params.page !== null) queryParams.page = params.page
    if (params.limit !== undefined && params.limit !== null) queryParams.limit = params.limit
    if (params.vehicleId) queryParams.vehicleId = params.vehicleId
    if (params.driverId) queryParams.driverId = params.driverId
    if (params.supervisorId) queryParams.supervisorId = params.supervisorId
    if (params.status && params.status !== 'all') queryParams.status = params.status
    if (params.search && params.search.trim()) queryParams.search = params.search.trim()
    if (params.month) queryParams.month = params.month
    if (params.year) queryParams.year = params.year
    if (params.startDate) queryParams.startDate = params.startDate
    if (params.endDate) queryParams.endDate = params.endDate

    const { data: responseData } = await axios.get(url, {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    const rawList = Array.isArray(responseData?.data)
      ? responseData.data
      : Array.isArray(responseData)
        ? responseData
        : []

    const transformedList = rawList.map((item) => {
      const driverObj = typeof item.driverId === 'object' && item.driverId !== null ? item.driverId : {}
      const driverId = driverObj._id || item.driverId || ''
      const driverName = item.driverName || driverObj.name || 'N/A'
      const contactNumber = driverObj.contactNumber || item.contactNumber || 'N/A'

      const vehicleObj = typeof item.vehicleId === 'object' && item.vehicleId !== null ? item.vehicleId : {}
      const vehicleId = vehicleObj._id || item.vehicleId || ''
      const vehicleName = item.vehicleName || vehicleObj.name || 'N/A'

      const liveDuration = computeDuration(item.assignedAt, item.unassignedAt)
      const duration = item.duration && item.duration !== '0m' ? item.duration : liveDuration

      return {
        id: item._id,
        _id: item._id,
        vehicleId,
        vehicleName,
        driverId,
        driverName,
        contactNumber,
        assignedAt: item.assignedAt,
        assignedAtFormatted: formatShiftDateTime(item.assignedAt),
        unassignedAt: item.unassignedAt,
        unassignedAtFormatted: formatShiftDateTime(item.unassignedAt),
        status: (item.status || 'completed').toLowerCase(),
        duration,
        remarks: item.remarks || '',
        assignmentType: item.assignmentType || 'manual',
        raw: item,
      }
    })

    return {
      success: responseData?.success ?? true,
      total:
        responseData?.total ??
        responseData?.totalRecords ??
        responseData?.count ??
        transformedList.length,
      activeCount: responseData?.activeCount ?? 0,
      completedCount: responseData?.completedCount ?? 0,
      currentPage: responseData?.currentPage ?? (params.page || 1),
      totalPages: responseData?.totalPages ?? 1,
      limit: responseData?.limit ?? (params.limit || 10),
      data: transformedList,
    }
  } catch (error) {
    const serverMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Failed to fetch vehicle shift logs'

    console.error('Failed to fetch vehicle shift logs:', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: serverMessage,
    })

    const err = new Error(serverMessage)
    err.status = error?.response?.status || 500
    err.response = error?.response
    throw err
  }
}

// GET Driver Shift Logs List API
export const getDriverShiftLogsApi = async (params = {}) => {
  try {
    const authToken = getToken()
    if (!authToken) throw new Error('Authentication token not found')

    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
    const url = baseUrl.endsWith('/api')
      ? `${baseUrl}/shift-logs/driver/all`
      : `${baseUrl}/api/shift-logs/driver/all`

    // Clean params
    const queryParams = {}
    if (params.page !== undefined && params.page !== null) queryParams.page = params.page
    if (params.limit !== undefined && params.limit !== null) queryParams.limit = params.limit
    if (params.driverId) queryParams.driverId = params.driverId
    if (params.vehicleId) queryParams.vehicleId = params.vehicleId
    if (params.supervisorId) queryParams.supervisorId = params.supervisorId
    if (params.status && params.status !== 'all') queryParams.status = params.status
    if (params.search && params.search.trim()) queryParams.search = params.search.trim()
    if (params.month) queryParams.month = params.month
    if (params.year) queryParams.year = params.year
    if (params.startDate) queryParams.startDate = params.startDate
    if (params.endDate) queryParams.endDate = params.endDate

    const { data: responseData } = await axios.get(url, {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    const rawList = Array.isArray(responseData?.data)
      ? responseData.data
      : Array.isArray(responseData)
        ? responseData
        : []

    const transformedList = rawList.map((item) => {
      const driverObj = typeof item.driverId === 'object' && item.driverId !== null ? item.driverId : {}
      const driverId = driverObj._id || item.driverId || ''
      const driverName = item.driverName || driverObj.name || 'N/A'
      const contactNumber = driverObj.contactNumber || item.contactNumber || 'N/A'
      const email = driverObj.email || item.email || ''
      const licenseNumber = driverObj.licenseNumber || item.licenseNumber || ''

      const vehicleObj = typeof item.vehicleId === 'object' && item.vehicleId !== null ? item.vehicleId : {}
      const vehicleId = vehicleObj._id || item.vehicleId || ''
      const vehicleName = item.vehicleName || vehicleObj.name || 'N/A'

      const liveDuration = computeDuration(item.assignedAt, item.unassignedAt)
      const duration = item.duration && item.duration !== '0m' ? item.duration : liveDuration

      return {
        id: item._id,
        _id: item._id,
        driverId,
        driverName,
        contactNumber,
        email,
        licenseNumber,
        vehicleId,
        vehicleName,
        assignedAt: item.assignedAt,
        assignedAtFormatted: formatShiftDateTime(item.assignedAt),
        unassignedAt: item.unassignedAt,
        unassignedAtFormatted: formatShiftDateTime(item.unassignedAt),
        status: (item.status || 'completed').toLowerCase(),
        duration,
        remarks: item.remarks || '',
        assignmentType: item.assignmentType || 'manual',
        raw: item,
      }
    })

    return {
      success: responseData?.success ?? true,
      total:
        responseData?.total ??
        responseData?.totalRecords ??
        responseData?.count ??
        transformedList.length,
      activeCount: responseData?.activeCount ?? 0,
      completedCount: responseData?.completedCount ?? 0,
      currentPage: responseData?.currentPage ?? (params.page || 1),
      totalPages: responseData?.totalPages ?? 1,
      limit: responseData?.limit ?? (params.limit || 10),
      data: transformedList,
    }
  } catch (error) {
    const serverMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Failed to fetch driver shift logs'

    console.error('Failed to fetch driver shift logs:', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: serverMessage,
    })

    const err = new Error(serverMessage)
    err.status = error?.response?.status || 500
    err.response = error?.response
    throw err
  }
}

// GET Driver Full Monthly Report API
export const getDriverFullReportApi = async (driverId, params = {}) => {
  try {
    if (!driverId) throw new Error('Driver ID is required to fetch full report')

    const authToken = getToken()
    if (!authToken) throw new Error('Authentication token not found')

    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
    const url = baseUrl.endsWith('/api')
      ? `${baseUrl}/shift-logs/driver/${driverId}`
      : `${baseUrl}/api/shift-logs/driver/${driverId}`

    const queryParams = {}
    if (params.month) queryParams.month = params.month
    if (params.year) queryParams.year = params.year
    if (params.startDate) queryParams.startDate = params.startDate
    if (params.endDate) queryParams.endDate = params.endDate

    const { data: responseData } = await axios.get(url, {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    return responseData
  } catch (error) {
    const serverMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Failed to fetch driver full report'

    console.error('Failed to fetch driver full report:', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: serverMessage,
    })

    const err = new Error(serverMessage)
    err.status = error?.response?.status || 500
    err.response = error?.response
    throw err
  }
}
