import axios from 'axios'
import Cookies from 'js-cookie'

const getAuthToken = () => {
  return (
    sessionStorage.getItem('crdnsMaintToken') ||
    localStorage.getItem('crdnsMaintToken') ||
    Cookies.get('crdnsMaintToken')
  )
}

const getHeaders = () => {
  const token = getAuthToken()
  return {
    Authorization: `Bearer ${token}`,
  }
}

// GET School Dropdown from VTS Credence Backend
export const getSchoolDropdownApi = async () => {
  const token = getAuthToken()
  if (!token) throw new Error('Authentication token not found')

  const backendUrl =
    import.meta.env.VITE_API_CREDENCE_BACKEND || 'https://vts.credencetracker.com/backend'
  const cleanUrl = backendUrl.replace(/\/+$/, '')

  try {
    const { data: response } = await axios.get(`${cleanUrl}/api/school/dropdown`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json, text/plain, */*',
      },
    })

    const schools = Array.isArray(response) ? response : response?.data || []
    return schools.map((school) => ({
      value: school._id,
      label: school.schoolName || 'Unnamed School',
      id: school._id,
      schoolName: school.schoolName,
    }))
  } catch (error) {
    console.error('Error fetching school dropdown:', error?.response?.data?.message || error.message)
    return []
  }
}

// GET Branch Dropdown from VTS Credence Backend by schoolId
export const getBranchDropdownApi = async (schoolId) => {
  if (!schoolId) return []

  const token = getAuthToken()
  if (!token) throw new Error('Authentication token not found')

  const backendUrl =
    import.meta.env.VITE_API_CREDENCE_BACKEND || 'https://vts.credencetracker.com/backend'
  const cleanUrl = backendUrl.replace(/\/+$/, '')

  try {
    const { data: response } = await axios.get(
      `${cleanUrl}/api/branch/dropdown?schoolId=${schoolId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json, text/plain, */*',
        },
      },
    )

    const branches = Array.isArray(response) ? response : response?.data || []
    return branches.map((branch) => ({
      value: branch._id,
      label: branch.branchName || 'Unnamed Branch',
      id: branch._id,
      branchName: branch.branchName,
    }))
  } catch (error) {
    console.error('Error fetching branch dropdown:', error?.response?.data?.message || error.message)
    return []
  }
}

// GET all supervisors/users via /supervisor-role/all-users?page=1&limit=10&search=city
export const getSupervisorsApi = async (params = {}) => {
  const token = getAuthToken()
  if (!token) throw new Error('Authentication token not found')

  const page = params?.page || 1
  const limit = params?.limit || 10
  const search = params?.search || ''

  try {
    const queryParams = new URLSearchParams()
    if (page) queryParams.append('page', page)
    if (limit) queryParams.append('limit', limit)
    if (search && search.toString().trim()) {
      queryParams.append('search', search.toString().trim())
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
    const cleanBaseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl

    const { data: resData } = await axios.get(
      `${cleanBaseUrl}/api/api/supervisor-role/all-users${queryString}`,
      {
        headers: getHeaders(),
      },
    )

    const rawList = Array.isArray(resData?.data)
      ? resData.data
      : Array.isArray(resData)
        ? resData
        : resData?.users || []

    const pagination = resData?.pagination || {
      total: rawList.length,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      totalPages: Math.ceil(rawList.length / (Number(limit) || 10)) || 1,
    }

    const mappedUsers = rawList.map((user) => {
      const id = user._id || user.id
      return {
        id,
        _id: id,
        name: user.name || user.username || 'Unnamed Supervisor',
        username: user.username || user.name || '',
        email: user.email || 'N/A',
        mobile: user.phone || user.mobile || 'N/A',
        phone: user.phone || user.mobile || 'N/A',
        role: user.role || 'Supervisor',
        status: user.status === 'false' || user.status === false ? 'Inactive' : 'Active',
        schoolId:
          user.schoolId ||
          user.school?._id ||
          (typeof user.school === 'string' ? user.school : '') ||
          '',
        schoolName:
          user.schoolName ||
          user.school?.schoolName ||
          (user.role === 'school' ? user.name : '') ||
          '',
        branchId:
          user.branchId ||
          user.branch?._id ||
          (typeof user.branch === 'string' ? user.branch : '') ||
          '',
        branchName:
          user.branchName ||
          user.branch?.branchName ||
          (user.role === 'branch' || user.role === 'branchGroup' ? user.name : '') ||
          '',
        createdAt: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString('en-GB')
          : 'N/A',
      }
    })

    // Attach pagination and users properties for complete flexibility
    mappedUsers.pagination = pagination
    mappedUsers.users = mappedUsers

    return mappedUsers
  } catch (error) {
    console.error('Error fetching supervisors:', error?.response?.data?.message || error.message)
    throw error
  }
}

// POST create supervisor
export const postSupervisorApi = async (formData) => {
  const token = getAuthToken()
  if (!token) throw new Error('Authentication token not found')

  try {
    const payload = {
      username: formData.name || formData.username,
      name: formData.name || formData.username,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
      role: 'supervisor',
      status: 'true',
    }

    if (formData.schoolId) {
      payload.schoolId = formData.schoolId
      payload.school = formData.schoolId
    }
    if (formData.schoolName) {
      payload.schoolName = formData.schoolName
    }
    if (formData.branchId) {
      payload.branchId = formData.branchId
      payload.branch = formData.branchId
    }
    if (formData.branchName) {
      payload.branchName = formData.branchName
    }

    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/user/create`,
      payload,
      { headers: getHeaders() },
    )
    return data
  } catch (error) {
    console.error('Error creating supervisor:', error?.response?.data?.message || error.message)
    throw new Error(error?.response?.data?.message || 'Failed to create supervisor')
  }
}

// PATCH update supervisor
export const patchSupervisorApi = async (id, formData) => {
  const token = getAuthToken()
  if (!token) throw new Error('Authentication token not found')

  try {
    const payload = {
      username: formData.name || formData.username,
      name: formData.name || formData.username,
      email: formData.email,
      mobile: formData.mobile,
    }
    if (formData.password) {
      payload.password = formData.password
    }
    if (formData.schoolId !== undefined) {
      payload.schoolId = formData.schoolId
      payload.school = formData.schoolId
    }
    if (formData.schoolName !== undefined) {
      payload.schoolName = formData.schoolName
    }
    if (formData.branchId !== undefined) {
      payload.branchId = formData.branchId
      payload.branch = formData.branchId
    }
    if (formData.branchName !== undefined) {
      payload.branchName = formData.branchName
    }

    const { data } = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/user/update/${id}`,
      payload,
      { headers: getHeaders() },
    )
    return data
  } catch (error) {
    console.error('Error updating supervisor:', error?.response?.data?.message || error.message)
    throw new Error(error?.response?.data?.message || 'Failed to update supervisor')
  }
}

// DELETE supervisor
export const deleteSupervisorApi = async (id) => {
  const token = getAuthToken()
  if (!token) throw new Error('Authentication token not found')

  try {
    const { data } = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/user/delete/${id}`,
      { headers: getHeaders() },
    )
    return data
  } catch (error) {
    console.error('Error deleting supervisor:', error?.response?.data?.message || error.message)
    throw new Error(error?.response?.data?.message || 'Failed to delete supervisor')
  }
}
