import axios from 'axios'
import Cookies from 'js-cookie'
import usePermissionStore from '../../store/permission'

class PermissionService {
  static getHeaders() {
    const token =
      sessionStorage.getItem('crdnsMaintToken') ||
      localStorage.getItem('crdnsMaintToken') ||
      Cookies.get('crdnsMaintToken')
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  static getBaseUrl() {
    return `${import.meta.env.VITE_API_URL}/api/worker-role/permissions`
  }

  // GET /worker-role/permissions
  static async getAll() {
    try {
      const response = await axios.get(this.getBaseUrl(), {
        headers: this.getHeaders(),
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch permissions')
    }
  }

  // GET /worker-role/permissions-for-single-user/:id
  static async getByWorkerId(workerId) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/worker-role/permissions-for-single-user/${workerId}`,
        {
          headers: this.getHeaders(),
        },
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch permissions')
    }
  }

  // POST /worker-role/add/permissions
  static async addOrUpdatePermissions(payload) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/worker-role/add/permissions`,
        payload,
        {
          headers: this.getHeaders(),
        },
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update permissions')
    }
  }

  static hasPermission(permissionPath, action = 'read') {
    const storedWorker = sessionStorage.getItem('workerInfo') || localStorage.getItem('workerInfo')
    if (!storedWorker) return true

    // Employees should never have access to employee management module
    if (permissionPath === 'masters.employee' || permissionPath.startsWith('masters.employee')) {
      return false
    }

    const permissions = usePermissionStore.getState().permissions
    if (!permissions) return false

    try {
      const parts = permissionPath.split('.')
      let current = permissions
      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part]
        } else {
          return false
        }
      }
      if (typeof current === 'object' && current !== null) {
        return !!current[action]
      }
      return !!current
    } catch (e) {
      console.error('Error checking permissions:', e)
      return false
    }
  }
}

export default PermissionService
