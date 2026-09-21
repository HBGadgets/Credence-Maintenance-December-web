import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import usePermissionStore from '../../store/permission'
import {
  addOrUpdateSupervisorPermissions,
  getSupervisorPermissions,
  getMySupervisorPermissions,
  deleteSupervisorPermissions,
} from '../Supervisor/data/supervisorRoleService'

class PermissionService {
  static getHeaders() {
    const token = sessionStorage.getItem('crdnsMaintToken')
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

  // Supervisor Role API Endpoints
  static async addOrUpdateSupervisorPermissions(payload) {
    return await addOrUpdateSupervisorPermissions(payload)
  }

  static async assignOrUpdateSupervisorPermissions(payload) {
    return await addOrUpdateSupervisorPermissions(payload)
  }

  static async getSupervisorPermissions(supervisorId) {
    return await getSupervisorPermissions(supervisorId)
  }

  static async getPermissionsForSingleSupervisor(supervisorId) {
    return await getSupervisorPermissions(supervisorId)
  }

  static async getMySupervisorPermissions() {
    const token = sessionStorage.getItem('crdnsMaintToken')

    let role = null
    try {
      if (token) {
        const decoded = jwtDecode(token)
        role = (decoded?.role || '').toString().toLowerCase().trim()
      }
    } catch {}

    if (role === 'superadmin' || role.includes('superadmin') || role === 'admin') {
      return null
    }

    return await getMySupervisorPermissions()
  }

  static async getMyPermissions() {
    return await this.getMySupervisorPermissions()
  }

  static async deleteSupervisorPermissions(supervisorId) {
    return await deleteSupervisorPermissions(supervisorId)
  }

  static async deleteSupervisorRole(supervisorId) {
    return await deleteSupervisorPermissions(supervisorId)
  }

  static hasPermission(permissionPath, action = 'read') {
    const token = sessionStorage.getItem('crdnsMaintToken')

    let role = null
    try {
      if (token) {
        const decoded = jwtDecode(token)
        role = (decoded?.role || '').toString().toLowerCase().trim()
      }
    } catch {}

    // Superadmin has full unrestricted access - do not check permissions for superadmin
    if (role === 'superadmin' || role.includes('superadmin') || role === 'admin') {
      return true
    }

    const storedWorker = sessionStorage.getItem('workerInfo')
    const permissions = usePermissionStore.getState().permissions

    // If neither worker nor restricted permissions exist, default to true
    if (!storedWorker && !permissions) return true

    // Employees should never have access to employee management module
    if (storedWorker && (permissionPath === 'masters.employee' || permissionPath.startsWith('masters.employee'))) {
      return false
    }

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
