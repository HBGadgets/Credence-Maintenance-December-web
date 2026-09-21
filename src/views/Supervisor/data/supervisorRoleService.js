import axios from 'axios'

const getAuthToken = () => {
  return sessionStorage.getItem('crdnsMaintToken')
}

const getHeaders = () => {
  const token = getAuthToken()
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

const getBaseUrl = () => {
  let url = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
  if (url.endsWith('/api')) {
    url = url.slice(0, -4)
  }
  return url
}

/**
 * Robust API helper that sends requests to `${baseUrl}/api${cleanEndpoint}`,
 * with automatic fallback to `${baseUrl}${cleanEndpoint}` if a 404 occurs.
 */
const apiCall = async (method, endpoint, data = null) => {
  const token = getAuthToken()
  if (!token) throw new Error('Authentication token not found. Please log in again.')

  const baseUrl = getBaseUrl()
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  if (cleanEndpoint.startsWith('/api/')) {
    cleanEndpoint = cleanEndpoint.slice(4)
  }
  const primaryUrl = `${baseUrl}/api/api${cleanEndpoint}`

  try {
    const res = await axios({
      method,
      url: primaryUrl,
      data,
      headers: getHeaders(),
    })
    return res.data
  } catch (err) {
    const msg = err.response?.data?.message || err.message || 'Request failed'
    throw new Error(msg)
  }
}

// 1. Assign or Update Supervisor Permissions
// POST /supervisor-role/add/permissions (Access Level: superadmin only)
export const addOrUpdateSupervisorPermissions = async (
  supervisorIdOrPayload,
  maybePermissions,
  maybeCategoryName,
  maybeCustomPermissions,
) => {
  let payload = {}

  if (supervisorIdOrPayload && typeof supervisorIdOrPayload === 'object') {
    payload = {
      supervisorId: supervisorIdOrPayload.supervisorId,
      permissions: supervisorIdOrPayload.permissions,
    }
    if (
      supervisorIdOrPayload.categoryName &&
      typeof supervisorIdOrPayload.categoryName === 'string' &&
      supervisorIdOrPayload.categoryName.trim()
    ) {
      payload.categoryName = supervisorIdOrPayload.categoryName.trim()
    }
    if (
      supervisorIdOrPayload.customPermissions &&
      typeof supervisorIdOrPayload.customPermissions === 'object' &&
      Object.keys(supervisorIdOrPayload.customPermissions).length > 0
    ) {
      payload.customPermissions = supervisorIdOrPayload.customPermissions
    }
  } else {
    payload = {
      supervisorId: supervisorIdOrPayload,
      permissions: maybePermissions,
    }
    if (
      maybeCategoryName &&
      typeof maybeCategoryName === 'string' &&
      maybeCategoryName.trim()
    ) {
      payload.categoryName = maybeCategoryName.trim()
    }
    if (
      maybeCustomPermissions &&
      typeof maybeCustomPermissions === 'object' &&
      Object.keys(maybeCustomPermissions).length > 0
    ) {
      payload.customPermissions = maybeCustomPermissions
    }
  }

  return await apiCall('POST', '/supervisor-role/add/permissions', payload)
}

// 2. Get Permissions for a Specific Supervisor
// GET /supervisor-role/permissions-for-single-user/:supervisorId (Access Level: superadmin only)
export const getSupervisorPermissions = async (supervisorId) => {
  if (!supervisorId) throw new Error('Supervisor ID is required')
  return await apiCall('GET', `/supervisor-role/permissions-for-single-user/${supervisorId}`)
}

// 3. Get My Own Permissions
// GET /supervisor-role/permissions (Access Level: user / Supervisor)
export const getMySupervisorPermissions = async () => {
  return await apiCall('GET', '/supervisor-role/permissions')
}

// 4. Delete Supervisor Role / Permissions
// DELETE /supervisor-role/delete/permissions/:supervisorId (Access Level: superadmin only)
export const deleteSupervisorPermissions = async (supervisorId) => {
  if (!supervisorId) throw new Error('Supervisor ID is required')
  return await apiCall('DELETE', `/supervisor-role/delete/permissions/${supervisorId}`)
}

// 5. Get All Supervisors/Users with Pagination and Search
// GET /supervisor-role/all-users?page=1&limit=10&search=city
export const getAllSupervisorUsers = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const params = new URLSearchParams()
  if (page) params.append('page', page)
  if (limit) params.append('limit', limit)
  if (search && search.toString().trim()) {
    params.append('search', search.toString().trim())
  }

  const queryString = params.toString() ? `?${params.toString()}` : ''
  return await apiCall('GET', `/supervisor-role/all-users${queryString}`)
}

// Aliases
export const assignOrUpdateSupervisorPermissions = addOrUpdateSupervisorPermissions
export const getPermissionsForSingleSupervisor = getSupervisorPermissions
export const getMyPermissions = getMySupervisorPermissions
export const deleteSupervisorRole = deleteSupervisorPermissions
export const getAllSupervisors = getAllSupervisorUsers

export default {
  addOrUpdateSupervisorPermissions,
  assignOrUpdateSupervisorPermissions,
  getSupervisorPermissions,
  getPermissionsForSingleSupervisor,
  getMySupervisorPermissions,
  getMyPermissions,
  deleteSupervisorPermissions,
  deleteSupervisorRole,
  getAllSupervisorUsers,
  getAllSupervisors,
}
