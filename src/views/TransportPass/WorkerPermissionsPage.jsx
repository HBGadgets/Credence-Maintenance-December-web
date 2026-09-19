import React, { useState, useEffect, useMemo } from 'react'
import { Card, Button, Form, Tabs, Tab, Table, Badge } from 'react-bootstrap'
import { Shield, ArrowLeft, Check, Filter } from 'lucide-react'
import PermissionService from '../Services/Service'
import usePermissionStore from '../../store/permission'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getWorkerApi } from './data/data'
import LoaderBus from '../../components/Loader3/LoaderBus'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

const defaultPermissions = {
  masters: {
    driver: { create: false, read: false, update: false, delete: false },
    vehicle: { create: false, read: false, update: false, delete: false },
    trip: { create: false, read: false, update: false, delete: false },
    location: { create: false, read: false, update: false, delete: false },
    company: { create: false, read: false, update: false, delete: false },
    materialOwner: { create: false, read: false, update: false, delete: false },
    vendor: { create: false, read: false, update: false, delete: false },
    employee: { create: false, read: false, update: false, delete: false },
    consignor: { create: false, read: false, update: false, delete: false },
    consignee: { create: false, read: false, update: false, delete: false },
    transporter: { create: false, read: false, update: false, delete: false },
    commAgent: { create: false, read: false, update: false, delete: false },
    category: { create: false, read: false, update: false, delete: false },
    attendance: { create: false, read: false, update: false, delete: false },
    leave: { create: false, read: false, update: false, delete: false },
    zone: { create: false, read: false, update: false, delete: false },
    customer: { create: false, read: false, update: false, delete: false },
  },
  reports: {
    salary: { create: false, read: false, update: false, delete: false },
    driverExp: { create: false, read: false, update: false, delete: false },
    vehicleExp: { create: false, read: false, update: false, delete: false },
    dailyLog: { create: false, read: false, update: false, delete: false },
    serviceLog: { create: false, read: false, update: false, delete: false },
    inspection: { create: false, read: false, update: false, delete: false },
    vendorsRep: { create: false, read: false, update: false, delete: false },
    supervisorTPRep: { create: false, read: false, update: false, delete: false },
    tpTripLogs: { create: false, read: false, update: false, delete: false },
  },
  dailyTrips: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  goodReceipts: {
    rail: { create: false, read: false, update: false, delete: false },
    road: { create: false, read: false, update: false, delete: false },
  },
  dailyPass: {
    builty: { create: false, read: false, update: false, delete: false },
  },
  transportPass: {
    receipt: { create: false, read: false, update: false, delete: false },
    builty: { create: false, read: false, update: false, delete: false },
    dailyPassbuilty: { create: false, read: false, update: false, delete: false },
  },
  warehouse: {
    product: { create: false, read: false, update: false, delete: false },
    railHead: { create: false, read: false, update: false, delete: false },
    inventory: { create: false, read: false, update: false, delete: false },
    dailyproduct: { create: false, read: false, update: false, delete: false },
  },
  tickets: {
    raise: { create: false, read: false, update: false, delete: false },
    answer: { create: false, read: false, update: false, delete: false },
  },
  chat: {
    read: false,
  },
}

const defaultCustomPermissions = {}

// Module definitions available in this project
const MASTERS_MODULES = [
  { section: 'masters', item: 'driver', label: 'Drivers' },
  { section: 'masters', item: 'vehicle', label: 'Vehicles' },
  { section: 'masters', item: 'trip', label: 'Trips' },
  { section: 'masters', item: 'company', label: 'Company Name' },
  { section: 'masters', item: 'materialOwner', label: 'Material Owner' },
  // { section: 'masters', item: 'employee', label: 'Employees Details' },
  { section: 'masters', item: 'consignor', label: 'Consignor' },
  { section: 'masters', item: 'consignee', label: 'Consignee' },
  { section: 'masters', item: 'attendance', label: 'Driver Attendance Mark' },
  { section: 'masters', item: 'leave', label: 'Drivers Leave Requests' },
]

const REPORTS_MODULES = [
  { section: 'reports', item: 'salary', label: 'Drivers Salary' },
  { section: 'reports', item: 'driverExp', label: 'All Drivers Expenses Bill' },
  { section: 'reports', item: 'vehicleExp', label: 'All Vehicles Expenses Bill' },
  { section: 'reports', item: 'dailyLog', label: 'All Daily Logbook' },
  { section: 'reports', item: 'serviceLog', label: 'All Vehicle Services Data' },
  { section: 'reports', item: 'inspection', label: 'All Vehicle Inspection' },
]

const OPERATIONAL_MODULES = [
  { section: 'dailyTrips', item: null, label: 'Daily Trips Reading' },
  { section: 'goodReceipts', item: 'rail', label: 'Good Receipts (Rail)' },
  { section: 'goodReceipts', item: 'road', label: 'Good Receipts (Road)' },
  { section: 'transportPass', item: 'receipt', label: 'Transport Pass (Receipt)' },
  { section: 'warehouse', item: 'product', label: 'Warehouse (Product List)' },
  { section: 'warehouse', item: 'railHead', label: 'Warehouse (Rail Head)' },
  { section: 'warehouse', item: 'inventory', label: 'Warehouse (Inventory)' },
]

const SUPPORT_MODULES = [
  { section: 'tickets', item: 'raise', label: 'Tickets (Raise)' },
  { section: 'tickets', item: 'answer', label: 'Tickets (Answer)' },
  { section: 'chat', item: null, label: 'Chat Box' },
]

const deepMerge = (target, source) => {
  if (!source) return target
  const merged = { ...target }
  Object.keys(target).forEach((key) => {
    if (source[key] !== undefined) {
      if (typeof target[key] === 'object' && target[key] !== null) {
        merged[key] = deepMerge(target[key], source[key])
      } else {
        merged[key] = source[key]
      }
    }
  })
  return merged
}

const WorkerPermissionsPage = ({ worker: workerProp, onClose: onCloseProp, onSaveSuccess: onSaveSuccessProp }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Identify whether logged-in user is an employee / worker
  const loggedInWorkerInfo = useMemo(() => {
    try {
      const stored = sessionStorage.getItem('workerInfo') || localStorage.getItem('workerInfo')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }, [])

  const tokenRole = useMemo(() => {
    const token =
      sessionStorage.getItem('crdnsMaintToken') ||
      localStorage.getItem('crdnsMaintToken') ||
      Cookies.get('crdnsMaintToken')
    if (!token) return null
    try {
      const decoded = jwtDecode(token)
      return decoded?.role || null
    } catch {
      return null
    }
  }, [])

  const isEmployeeLogin = Boolean(
    loggedInWorkerInfo || tokenRole === 'worker' || tokenRole === 'employee'
  )

  // Target worker ID: from route param, prop, or logged-in worker
  const effectiveId = id || workerProp?.id || loggedInWorkerInfo?.id

  // Self-view: employee viewing their own permissions (read-only)
  const isSelf = Boolean(
    isEmployeeLogin && (effectiveId === loggedInWorkerInfo?.id || (!id && !workerProp))
  )

  // Fetch logged-in employee's own permissions to know what they can grant
  const { data: myPermissionsResponse } = useQuery({
    queryKey: ['myPermissions'],
    queryFn: PermissionService.getAll,
    enabled: isEmployeeLogin,
    staleTime: 1000 * 60 * 5,
  })

  const storedPermissions = usePermissionStore((state) => state.permissions)
  const myPermissions = myPermissionsResponse?.permissions || storedPermissions || {}

  // Fetch worker list if not passed via props and not self-view
  const { data: workerList = [], isLoading: isLoadingWorker } = useQuery({
    queryKey: ['workerList'],
    queryFn: getWorkerApi,
    staleTime: 1000 * 60 * 30,
    enabled: !workerProp && !isSelf,
  })

  // Fetch target worker permissions
  const { data: singleWorkerPermissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['workerPermissions', effectiveId],
    queryFn: () => {
      if (isSelf) {
        return myPermissionsResponse || PermissionService.getAll()
      }
      return PermissionService.getByWorkerId(effectiveId)
    },
    enabled: Boolean(effectiveId),
    staleTime: 1000 * 60 * 5,
  })

  const targetWorker = workerProp || (id ? workerList.find((w) => w.id === id) : null) || (isSelf ? loggedInWorkerInfo : null)

  const [permissions, setPermissions] = useState(defaultPermissions)
  const [customPermissions, setCustomPermissions] = useState(defaultCustomPermissions)
  const [isSaving, setIsSaving] = useState(false)

  // Toggle for accessible-only view
  const [showOnlyAccessible, setShowOnlyAccessible] = useState(isEmployeeLogin)

  useEffect(() => {
    if (isEmployeeLogin) {
      setShowOnlyAccessible(true)
    }
  }, [isEmployeeLogin])

  // Initialize permissions when target worker's fetched permissions change
  useEffect(() => {
    if (singleWorkerPermissions || targetWorker) {
      const sourcePermissions = singleWorkerPermissions?.permissions || targetWorker?.permissions
      const sourceCustomPermissions = singleWorkerPermissions?.customPermissions || targetWorker?.customPermissions

      setPermissions(deepMerge(defaultPermissions, sourcePermissions))
      setCustomPermissions(deepMerge(defaultCustomPermissions, sourceCustomPermissions))
    }
  }, [targetWorker, singleWorkerPermissions])

  // Check if current user has access to a specific module
  const doesCurrentUserHaveModuleAccess = (section, item) => {
    if (!isEmployeeLogin) return true // Superadmin has full access

    if (section === 'chat') {
      return Boolean(myPermissions?.chat?.read)
    }

    if (item === null) {
      const targetObj = myPermissions?.[section]
      if (!targetObj) return false
      return Boolean(targetObj.read || targetObj.create || targetObj.update || targetObj.delete)
    }

    const targetObj = myPermissions?.[section]?.[item]
    if (!targetObj) return false
    return Boolean(targetObj.read || targetObj.create || targetObj.update || targetObj.delete)
  }

  // Check if current user can grant a specific action on a module
  const canCurrentUserGrant = (section, item, action) => {
    if (!isEmployeeLogin) return true // Superadmin can grant any action
    if (isSelf) return false // Self-view is read-only

    if (section === 'chat') {
      return Boolean(myPermissions?.chat?.read)
    }

    if (item === null) {
      return Boolean(myPermissions?.[section]?.[action])
    }

    return Boolean(myPermissions?.[section]?.[item]?.[action])
  }

  // Helper to check if a permission item has any active access (in the local state)
  const hasAccess = (section, item) => {
    const targetObj = item ? permissions[section]?.[item] : permissions[section]
    if (!targetObj) return false
    return Boolean(targetObj.read || targetObj.create || targetObj.update || targetObj.delete)
  }

  // Handle single checkbox toggle
  const handleCheckboxChange = (section, item, action, isCustom = false) => {
    if (isSelf) return
    if (isEmployeeLogin && !canCurrentUserGrant(section, item, action)) {
      toast.warning('You do not have permission to grant or modify this action.')
      return
    }

    if (isCustom) {
      setCustomPermissions((prev) => {
        const currentItem = prev[section] || { create: false, read: false, update: false, delete: false }
        return {
          ...prev,
          [section]: {
            ...currentItem,
            [action]: !currentItem[action],
          },
        }
      })
    } else {
      setPermissions((prev) => {
        if (item === null) {
          const currentItem = prev[section] || { create: false, read: false, update: false, delete: false }
          return {
            ...prev,
            [section]: {
              ...currentItem,
              [action]: !currentItem[action],
            },
          }
        } else {
          const currentSection = prev[section] || {}
          const currentItem = currentSection[item] || { create: false, read: false, update: false, delete: false }
          return {
            ...prev,
            [section]: {
              ...currentSection,
              [item]: {
                ...currentItem,
                [action]: !currentItem[action],
              },
            },
          }
        }
      })
    }
  }

  // Handle Select All for a tab section
  const handleSelectAll = (section, isCustom = false, value = true) => {
    if (isSelf) return
    setPermissions((prev) => {
      const updated = { ...prev }
      const currentSection = prev[section] || {}
      const updatedSection = { ...currentSection }
      Object.keys(currentSection).forEach((key) => {
        if (typeof currentSection[key] === 'object' && currentSection[key] !== null) {
          const updatedItem = { ...currentSection[key] }
          Object.keys(updatedItem).forEach((action) => {
            if (canCurrentUserGrant(section, key, action)) {
              updatedItem[action] = value
            }
          })
          updatedSection[key] = updatedItem
        }
      })
      updated[section] = updatedSection
      return updated
    })
  }

  // Handle Select All for Operational
  const handleSelectAllOperational = (value = true) => {
    if (isSelf) return
    setPermissions((prev) => {
      const updated = { ...prev }
      if (prev.dailyTrips) {
        const dt = { ...prev.dailyTrips }
        Object.keys(dt).forEach((act) => {
          if (canCurrentUserGrant('dailyTrips', null, act)) {
            dt[act] = value
          }
        })
        updated.dailyTrips = dt
      }
      ;['goodReceipts', 'transportPass', 'warehouse'].forEach((sec) => {
        if (prev[sec]) {
          const updatedSec = { ...prev[sec] }
          Object.keys(prev[sec]).forEach((key) => {
            if (typeof prev[sec][key] === 'object' && prev[sec][key] !== null) {
              const updatedItem = { ...prev[sec][key] }
              Object.keys(updatedItem).forEach((act) => {
                if (canCurrentUserGrant(sec, key, act)) {
                  updatedItem[act] = value
                }
              })
              updatedSec[key] = updatedItem
            }
          })
          updated[sec] = updatedSec
        }
      })
      return updated
    })
  }

  // Handle Select All for Support
  const handleSelectAllSupport = (value = true) => {
    if (isSelf) return
    setPermissions((prev) => {
      const updated = { ...prev }
      if (prev.tickets) {
        const updatedTickets = { ...prev.tickets }
        ;['raise', 'answer'].forEach((k) => {
          if (updatedTickets[k]) {
            const item = { ...updatedTickets[k] }
            Object.keys(item).forEach((act) => {
              if (canCurrentUserGrant('tickets', k, act)) {
                item[act] = value
              }
            })
            updatedTickets[k] = item
          }
        })
        updated.tickets = updatedTickets
      }
      if (canCurrentUserGrant('chat', null, 'read')) {
        updated.chat = { read: value }
      }
      return updated
    })
  }

  // Handle Grant Admin Access / Quick Action
  const handleGrantAdminAccess = (value = true) => {
    if (isSelf) return
    setPermissions((prev) => {
      const updated = { ...prev }
      // Masters
      if (prev.masters) {
        const updatedMasters = { ...prev.masters }
        Object.keys(updatedMasters).forEach((k) => {
          const item = { ...updatedMasters[k] }
          Object.keys(item).forEach((act) => {
            if (canCurrentUserGrant('masters', k, act)) {
              item[act] = value
            }
          })
          updatedMasters[k] = item
        })
        updated.masters = updatedMasters
      }
      // Reports
      if (prev.reports) {
        const updatedReports = { ...prev.reports }
        Object.keys(updatedReports).forEach((k) => {
          const item = { ...updatedReports[k] }
          Object.keys(item).forEach((act) => {
            if (canCurrentUserGrant('reports', k, act)) {
              item[act] = value
            }
          })
          updatedReports[k] = item
        })
        updated.reports = updatedReports
      }
      // Operational
      if (prev.dailyTrips) {
        const dt = { ...prev.dailyTrips }
        Object.keys(dt).forEach((act) => {
          if (canCurrentUserGrant('dailyTrips', null, act)) {
            dt[act] = value
          }
        })
        updated.dailyTrips = dt
      }
      ;['goodReceipts', 'transportPass', 'warehouse'].forEach((sec) => {
        if (prev[sec]) {
          const updatedSec = { ...prev[sec] }
          Object.keys(prev[sec]).forEach((k) => {
            if (typeof prev[sec][k] === 'object' && prev[sec][k] !== null) {
              const item = { ...prev[sec][k] }
              Object.keys(item).forEach((act) => {
                if (canCurrentUserGrant(sec, k, act)) {
                  item[act] = value
                }
              })
              updatedSec[k] = item
            }
          })
          updated[sec] = updatedSec
        }
      })
      // Support
      if (prev.tickets) {
        const updatedTickets = { ...prev.tickets }
        ;['raise', 'answer'].forEach((k) => {
          if (updatedTickets[k]) {
            const item = { ...updatedTickets[k] }
            Object.keys(item).forEach((act) => {
              if (canCurrentUserGrant('tickets', k, act)) {
                item[act] = value
              }
            })
            updatedTickets[k] = item
          }
        })
        updated.tickets = updatedTickets
      }
      if (canCurrentUserGrant('chat', null, 'read')) {
        updated.chat = { read: value }
      }
      return updated
    })
  }

  // Handle Row Select All
  const handleRowSelectAll = (section, item, isCustom, value) => {
    if (isSelf) return
    const updater = (prev) => {
      if (isCustom) {
        const currentItem = prev[section] || {}
        const updatedItem = { ...currentItem }
        Object.keys(currentItem).forEach((action) => {
          if (canCurrentUserGrant(section, item, action)) {
            updatedItem[action] = value
          }
        })
        return {
          ...prev,
          [section]: updatedItem,
        }
      } else {
        if (item === null) {
          const currentItem = prev[section] || {}
          const updatedItem = { ...currentItem }
          Object.keys(currentItem).forEach((action) => {
            if (canCurrentUserGrant(section, item, action)) {
              updatedItem[action] = value
            }
          })
          return {
            ...prev,
            [section]: updatedItem,
          }
        } else {
          const currentSection = prev[section] || {}
          const currentItem = currentSection[item] || {}
          const updatedItem = { ...currentItem }
          Object.keys(currentItem).forEach((action) => {
            if (canCurrentUserGrant(section, item, action)) {
              updatedItem[action] = value
            }
          })
          return {
            ...prev,
            [section]: {
              ...currentSection,
              [item]: updatedItem,
            },
          }
        }
      }
    }

    if (isCustom) {
      setCustomPermissions(updater)
    } else {
      setPermissions(updater)
    }
  }

  // Build safe permissions payload preserving ungrantable actions/modules from target worker's original permissions
  const buildPermissionsForSave = () => {
    if (!isEmployeeLogin) {
      return permissions
    }

    const original = deepMerge(defaultPermissions, singleWorkerPermissions?.permissions || targetWorker?.permissions || {})
    const result = JSON.parse(JSON.stringify(original))

    const applyGrantable = (sourceObj, targetObj, path = []) => {
      Object.keys(sourceObj).forEach((key) => {
        const currentPath = [...path, key]
        const sourceVal = sourceObj[key]
        if (typeof sourceVal === 'object' && sourceVal !== null) {
          if (!targetObj[key]) targetObj[key] = {}
          applyGrantable(sourceVal, targetObj[key], currentPath)
        } else {
          let section = currentPath[0]
          let item = null
          let action = null

          if (currentPath.length === 2) {
            action = currentPath[1]
          } else if (currentPath.length === 3) {
            item = currentPath[1]
            action = currentPath[2]
          }

          if (canCurrentUserGrant(section, item, action)) {
            targetObj[key] = sourceVal
          }
        }
      })
    }

    applyGrantable(permissions, result)
    return result
  }

  const handleClose = () => {
    if (onCloseProp) {
      onCloseProp()
    } else {
      navigate('/Worker')
    }
  }

  const handleSave = async () => {
    if (!effectiveId || isSelf) return
    setIsSaving(true)
    try {
      const finalPermissions = buildPermissionsForSave()
      const payload = {
        workerId: effectiveId,
        permissions: finalPermissions,
        customPermissions,
      }
      await PermissionService.addOrUpdatePermissions(payload)
      toast.success(`Permissions updated successfully for ${targetWorker?.name || 'employee'}!`)
      if (onSaveSuccessProp) {
        onSaveSuccessProp()
      } else {
        queryClient.invalidateQueries({ queryKey: ['workerList'] })
        queryClient.invalidateQueries({ queryKey: ['workerPermissions', effectiveId] })
      }
      handleClose()
    } catch (error) {
      console.error('Error saving permissions:', error)
      toast.error(error.message || 'Failed to update permissions')
    } finally {
      setIsSaving(false)
    }
  }

  const renderPermissionRow = (section, label, item = null, isCustom = false) => {
    const currentData = isCustom ? customPermissions : permissions
    const targetObj = item ? currentData[section]?.[item] : currentData[section]

    if (!targetObj) return null

    const hasRead = targetObj.read !== undefined
    const hasCreate = targetObj.create !== undefined
    const hasUpdate = targetObj.update !== undefined
    const hasDelete = targetObj.delete !== undefined

    // Calculate grantable actions for this row
    const grantableActions = ['read', 'create', 'update', 'delete'].filter((action) => {
      if (action === 'read' && !hasRead) return false
      if (action === 'create' && !hasCreate) return false
      if (action === 'update' && !hasUpdate) return false
      if (action === 'delete' && !hasDelete) return false
      return canCurrentUserGrant(section, item, action)
    })

    const isAllChecked =
      grantableActions.length > 0 &&
      grantableActions.every((action) => targetObj[action])

    const isRowDisabled = grantableActions.length === 0

    return (
      <tr key={item || section} className="align-middle">
        <td
          className="fw-semibold text-secondary"
          style={{ fontSize: '0.9rem', width: isSelf ? '40%' : '30%' }}
        >
          {label}
        </td>

        {/* 'All' checkbox column only shown in edit mode */}
        {!isSelf && (
          <td className="text-center" style={{ backgroundColor: '#f8fafc', width: '10%' }}>
            <Form.Check
              type="checkbox"
              checked={isAllChecked}
              disabled={isRowDisabled}
              title={isRowDisabled ? 'You do not have any permissions to grant for this module' : 'Toggle all your grantable permissions'}
              onChange={(e) => handleRowSelectAll(section, item, isCustom, e.target.checked)}
            />
          </td>
        )}

        {/* Read */}
        <td className="text-center">
          {hasRead ? (
            isSelf ? (
              targetObj.read ? (
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill fw-semibold">
                  <Check size={13} className="me-1" /> Allowed
                </span>
              ) : (
                <span className="text-muted opacity-50">—</span>
              )
            ) : (
              <Form.Check
                type="checkbox"
                checked={Boolean(targetObj.read)}
                disabled={!canCurrentUserGrant(section, item, 'read')}
                title={!canCurrentUserGrant(section, item, 'read') ? 'You do not have permission to grant Read access' : ''}
                onChange={() => handleCheckboxChange(section, item, 'read', isCustom)}
              />
            )
          ) : null}
        </td>

        {/* Create */}
        <td className="text-center">
          {hasCreate ? (
            isSelf ? (
              targetObj.create ? (
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-pill fw-semibold">
                  <Check size={13} className="me-1" /> Allowed
                </span>
              ) : (
                <span className="text-muted opacity-50">—</span>
              )
            ) : (
              <Form.Check
                type="checkbox"
                checked={Boolean(targetObj.create)}
                disabled={!canCurrentUserGrant(section, item, 'create')}
                title={!canCurrentUserGrant(section, item, 'create') ? 'You do not have permission to grant Create access' : ''}
                onChange={() => handleCheckboxChange(section, item, 'create', isCustom)}
              />
            )
          ) : null}
        </td>

        {/* Update */}
        <td className="text-center">
          {hasUpdate ? (
            isSelf ? (
              targetObj.update ? (
                <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 rounded-pill fw-semibold">
                  <Check size={13} className="me-1" /> Allowed
                </span>
              ) : (
                <span className="text-muted opacity-50">—</span>
              )
            ) : (
              <Form.Check
                type="checkbox"
                checked={Boolean(targetObj.update)}
                disabled={!canCurrentUserGrant(section, item, 'update')}
                title={!canCurrentUserGrant(section, item, 'update') ? 'You do not have permission to grant Update access' : ''}
                onChange={() => handleCheckboxChange(section, item, 'update', isCustom)}
              />
            )
          ) : null}
        </td>

        {/* Delete */}
        <td className="text-center">
          {hasDelete ? (
            isSelf ? (
              targetObj.delete ? (
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded-pill fw-semibold">
                  <Check size={13} className="me-1" /> Allowed
                </span>
              ) : (
                <span className="text-muted opacity-50">—</span>
              )
            ) : (
              <Form.Check
                type="checkbox"
                checked={Boolean(targetObj.delete)}
                disabled={!canCurrentUserGrant(section, item, 'delete')}
                title={!canCurrentUserGrant(section, item, 'delete') ? 'You do not have permission to grant Delete access' : ''}
                onChange={() => handleCheckboxChange(section, item, 'delete', isCustom)}
              />
            )
          ) : null}
        </td>
      </tr>
    )
  }

  // Filter modules based on accessibility
  const getVisibleModules = (modules) => {
    // For employee login, strictly only show modules the current employee has access to
    // and do not show employee module to employee
    if (isEmployeeLogin) {
      return modules.filter(
        (m) => m.item !== 'employee' && doesCurrentUserHaveModuleAccess(m.section, m.item)
      )
    }
    // For admin, filter if showOnlyAccessible toggle is active
    if (showOnlyAccessible) {
      return modules.filter((m) => hasAccess(m.section, m.item))
    }
    return modules
  }

  const visibleMasters = getVisibleModules(MASTERS_MODULES)
  const visibleReports = getVisibleModules(REPORTS_MODULES)
  const visibleOperational = getVisibleModules(OPERATIONAL_MODULES)
  const visibleSupport = getVisibleModules(SUPPORT_MODULES)

  const mastersCount = visibleMasters.length
  const reportsCount = visibleReports.length
  const operationalCount = visibleOperational.length
  const supportCount = visibleSupport.length
  const totalAccessibleCount = mastersCount + reportsCount + operationalCount + supportCount

  if (isLoadingWorker || isLoadingPermissions) {
    return (
      <Card className="shadow mb-4">
        <Card.Body className="text-center py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <LoaderBus />
        </Card.Body>
      </Card>
    )
  }

  if (!targetWorker && !isSelf) {
    return (
      <Card className="shadow mb-4">
        <Card.Body className="text-center py-5">
          <h5 className="text-danger">Employee not found</h5>
          <Button variant="outline-secondary" size="sm" onClick={() => navigate('/Worker')} className="mt-3">
            Back to Employees
          </Button>
        </Card.Body>
      </Card>
    )
  }

  const displayName = targetWorker?.name || loggedInWorkerInfo?.name || 'Employee'

  return (
    <Card className="shadow mb-4 borderless-bottom">
      <Card.Header className="d-flex align-items-center justify-content-between bg-white py-3">
        <div className="d-flex align-items-center gap-2">
          {!isSelf && (
            <>
              <Button variant="outline-secondary" size="sm" onClick={handleClose} className="d-flex align-items-center gap-1">
                <ArrowLeft size={16} />
                <span>Back to Employees</span>
              </Button>
              <div className="vr mx-2"></div>
            </>
          )}
          <Shield size={22} className="text-primary" />
          <h5 className="m-0 text-dark fw-bold">
            {isSelf
              ? `My Assigned Permissions (${displayName})`
              : `Manage Permissions for ${displayName}`}
          </h5>
          {isSelf && (
            <Badge bg="success" className="ms-2 px-2 py-1 fw-normal">
              Active Access ({totalAccessibleCount} Modules)
            </Badge>
          )}
          {isEmployeeLogin && !isSelf && (
            <Badge bg="info" className="ms-2 px-2 py-1 fw-normal">
              Delegated Access ({totalAccessibleCount} Grantable Modules)
            </Badge>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Admin toggle for accessible only vs all */}
          {!isEmployeeLogin && (
            <Button
              variant={showOnlyAccessible ? 'primary' : 'outline-secondary'}
              size="sm"
              className="d-flex align-items-center gap-1 me-2"
              onClick={() => setShowOnlyAccessible(!showOnlyAccessible)}
            >
              <Filter size={14} />
              <span>{showOnlyAccessible ? 'Showing: Accessible Only' : 'Show: Accessible Only'}</span>
            </Button>
          )}

          {!isSelf ? (
            <>
              <Button variant="secondary" size="sm" onClick={handleClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Permissions'}
              </Button>
            </>
          ) : (
            <span className="text-muted small">Read-Only View</span>
          )}
        </div>
      </Card.Header>

      <Card.Body>
        {/* Notice for employee delegating permissions */}
        {isEmployeeLogin && !isSelf && (
          <div className="alert alert-info py-2 px-3 mb-3 d-flex align-items-center gap-2 small">
            <Shield size={16} className="text-primary flex-shrink-0" />
            <div>
              <strong>Delegated Access Mode:</strong> You can only grant permissions for modules and actions you have access to. Modules and actions outside your permission scope are hidden or disabled.
            </div>
          </div>
        )}

        {/* Quick Actions in Edit Mode */}
        {!isSelf && (
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 p-3 bg-light rounded border gap-2">
            <span className="text-dark fw-bold" style={{ fontSize: '0.9rem' }}>
              {isEmployeeLogin ? 'Quick Actions (Your Accessible Modules):' : 'Quick Actions:'}
            </span>
            <div className="d-flex gap-2">
              <Button
                size="sm"
                variant="success"
                className="text-white"
                onClick={() => handleGrantAdminAccess(true)}
              >
                {isEmployeeLogin ? 'Grant All My Permissions' : 'Grant Admin Access (Select All)'}
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => handleGrantAdminAccess(false)}
              >
                {isEmployeeLogin ? 'Clear All My Permissions' : 'Clear All Access'}
              </Button>
            </div>
          </div>
        )}

        <Tabs defaultActiveKey="masters" className="mb-3 premium-tabs">
          {/* MASTERS */}
          <Tab eventKey="masters" title={`Masters (${mastersCount})`}>
            {!isSelf && visibleMasters.length > 0 && (
              <div className="d-flex justify-content-end gap-2 mb-2">
                <Button size="sm" variant="outline-primary" onClick={() => handleSelectAll('masters', false, true)}>
                  Select All
                </Button>
                <Button size="sm" variant="outline-secondary" onClick={() => handleSelectAll('masters', false, false)}>
                  Clear All
                </Button>
              </div>
            )}
            {visibleMasters.length > 0 ? (
              <Table responsive striped hover bordered size="sm">
                <thead className="table-light text-center">
                  <tr>
                    <th>Feature</th>
                    {!isSelf && <th>All</th>}
                    <th>Read</th>
                    <th>Create</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleMasters.map((m) => renderPermissionRow(m.section, m.label, m.item))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-4 text-muted bg-light rounded border border-dashed my-2">
                <Shield size={32} className="text-secondary opacity-50 mb-2 d-block mx-auto" />
                <p className="mb-0 fw-semibold">
                  {isEmployeeLogin
                    ? 'You do not have access to grant permissions in the Masters category.'
                    : 'No permissions granted in Masters category.'}
                </p>
              </div>
            )}
          </Tab>

          {/* REPORTS */}
          <Tab eventKey="reports" title={`Reports (${reportsCount})`}>
            {!isSelf && visibleReports.length > 0 && (
              <div className="d-flex justify-content-end gap-2 mb-2">
                <Button size="sm" variant="outline-primary" onClick={() => handleSelectAll('reports', false, true)}>
                  Select All
                </Button>
                <Button size="sm" variant="outline-secondary" onClick={() => handleSelectAll('reports', false, false)}>
                  Clear All
                </Button>
              </div>
            )}
            {visibleReports.length > 0 ? (
              <Table responsive striped hover bordered size="sm">
                <thead className="table-light text-center">
                  <tr>
                    <th>Feature</th>
                    {!isSelf && <th>All</th>}
                    <th>Read</th>
                    <th>Create</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleReports.map((m) => renderPermissionRow(m.section, m.label, m.item))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-4 text-muted bg-light rounded border border-dashed my-2">
                <Shield size={32} className="text-secondary opacity-50 mb-2 d-block mx-auto" />
                <p className="mb-0 fw-semibold">
                  {isEmployeeLogin
                    ? 'You do not have access to grant permissions in the Reports category.'
                    : 'No permissions granted in Reports category.'}
                </p>
              </div>
            )}
          </Tab>

          {/* OPERATIONAL */}
          <Tab eventKey="operational" title={`Operational Modules (${operationalCount})`}>
            {!isSelf && visibleOperational.length > 0 && (
              <div className="d-flex justify-content-end gap-2 mb-2">
                <Button size="sm" variant="outline-primary" onClick={() => handleSelectAllOperational(true)}>
                  Select All
                </Button>
                <Button size="sm" variant="outline-secondary" onClick={() => handleSelectAllOperational(false)}>
                  Clear All
                </Button>
              </div>
            )}
            {visibleOperational.length > 0 ? (
              <Table responsive striped hover bordered size="sm">
                <thead className="table-light text-center">
                  <tr>
                    <th>Feature</th>
                    {!isSelf && <th>All</th>}
                    <th>Read</th>
                    <th>Create</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleOperational.map((m) => renderPermissionRow(m.section, m.label, m.item))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-4 text-muted bg-light rounded border border-dashed my-2">
                <Shield size={32} className="text-secondary opacity-50 mb-2 d-block mx-auto" />
                <p className="mb-0 fw-semibold">
                  {isEmployeeLogin
                    ? 'You do not have access to grant permissions in the Operational Modules category.'
                    : 'No permissions granted in Operational Modules category.'}
                </p>
              </div>
            )}
          </Tab>

          {/* SUPPORT & CHAT */}
          <Tab eventKey="support" title={`Support & Chat (${supportCount})`}>
            {!isSelf && visibleSupport.length > 0 && (
              <div className="d-flex justify-content-end gap-2 mb-2">
                <Button size="sm" variant="outline-primary" onClick={() => handleSelectAllSupport(true)}>
                  Select All
                </Button>
                <Button size="sm" variant="outline-secondary" onClick={() => handleSelectAllSupport(false)}>
                  Clear All
                </Button>
              </div>
            )}
            {visibleSupport.length > 0 ? (
              <Table responsive striped hover bordered size="sm">
                <thead className="table-light text-center">
                  <tr>
                    <th>Feature</th>
                    {!isSelf && <th>All</th>}
                    <th>Read</th>
                    <th>Create</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleSupport.map((m) => renderPermissionRow(m.section, m.label, m.item))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-4 text-muted bg-light rounded border border-dashed my-2">
                <Shield size={32} className="text-secondary opacity-50 mb-2 d-block mx-auto" />
                <p className="mb-0 fw-semibold">
                  {isEmployeeLogin
                    ? 'You do not have access to grant permissions in the Support & Chat category.'
                    : 'No permissions granted in Support & Chat category.'}
                </p>
              </div>
            )}
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  )
}

export default WorkerPermissionsPage
