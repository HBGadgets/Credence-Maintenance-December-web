import React, { useState, useEffect, useMemo } from 'react'
import { Card, Button, Form, Tabs, Tab, Table, Badge } from 'react-bootstrap'
import { Shield, ArrowLeft, Check, Filter } from 'lucide-react'
import PermissionService from '../Services/Service'
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
  { section: 'masters', item: 'employee', label: 'Employees Details' },
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

  // Fetch worker list if not passed via props and not employee login
  const { data: workerList = [], isLoading: isLoadingWorker } = useQuery({
    queryKey: ['workerList'],
    queryFn: getWorkerApi,
    staleTime: 1000 * 60 * 30,
    enabled: !workerProp && !isEmployeeLogin,
  })

  // Fetch permissions
  const { data: singleWorkerPermissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['workerPermissions', effectiveId],
    queryFn: () => {
      if (isEmployeeLogin) {
        return PermissionService.getAll()
      }
      return PermissionService.getByWorkerId(effectiveId)
    },
    enabled: Boolean(effectiveId),
    staleTime: 1000 * 60 * 5,
  })

  const worker = workerProp || (id ? workerList.find((w) => w.id === id) : null) || loggedInWorkerInfo

  const [permissions, setPermissions] = useState(defaultPermissions)
  const [customPermissions, setCustomPermissions] = useState(defaultCustomPermissions)
  const [isSaving, setIsSaving] = useState(false)

  // Show only accessible permissions: default true for employee login
  const [showOnlyAccessible, setShowOnlyAccessible] = useState(isEmployeeLogin)

  useEffect(() => {
    if (isEmployeeLogin) {
      setShowOnlyAccessible(true)
    }
  }, [isEmployeeLogin])

  // Initialize permissions when worker or fetched permissions change
  useEffect(() => {
    if (singleWorkerPermissions || worker) {
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

      const sourcePermissions = singleWorkerPermissions?.permissions || worker?.permissions
      const sourceCustomPermissions = singleWorkerPermissions?.customPermissions || worker?.customPermissions

      setPermissions(deepMerge(defaultPermissions, sourcePermissions))
      setCustomPermissions(deepMerge(defaultCustomPermissions, sourceCustomPermissions))
    }
  }, [worker, singleWorkerPermissions])

  // Helper to check if a permission item has any access
  const hasAccess = (section, item) => {
    const targetObj = item ? permissions[section]?.[item] : permissions[section]
    if (!targetObj) return false
    return Boolean(targetObj.read || targetObj.create || targetObj.update || targetObj.delete)
  }

  const handleCheckboxChange = (section, item, action, isCustom = false) => {
    if (isEmployeeLogin) return // Read-only for employee

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

  const handleSelectAll = (section, isCustom = false, value = true) => {
    if (isEmployeeLogin) return
    if (isCustom) {
      setCustomPermissions((prev) => {
        const updated = {}
        Object.keys(prev).forEach((key) => {
          updated[key] = { create: value, read: value, update: value, delete: value }
        })
        return updated
      })
    } else {
      setPermissions((prev) => {
        const updated = { ...prev }
        if (section === 'masters' || section === 'reports') {
          const updatedSection = {}
          Object.keys(prev[section]).forEach((key) => {
            updatedSection[key] = { create: value, read: value, update: value, delete: value }
          })
          updated[section] = updatedSection
        } else {
          if (typeof prev[section] === 'object' && prev[section] !== null) {
            const updatedSection = {}
            Object.keys(prev[section]).forEach((key) => {
              if (typeof prev[section][key] === 'object' && prev[section][key] !== null) {
                updatedSection[key] = { create: value, read: value, update: value, delete: value }
              } else {
                updatedSection[key] = value
              }
            })
            updated[section] = updatedSection
          }
        }
        return updated
      })
    }
  }

  const handleSelectAllOperational = (value = true) => {
    if (isEmployeeLogin) return
    setPermissions((prev) => {
      const updated = { ...prev }
      updated.dailyTrips = { create: value, read: value, update: value, delete: value }
      if (prev.goodReceipts) {
        const updatedGR = {}
        Object.keys(prev.goodReceipts).forEach((key) => {
          updatedGR[key] = { create: value, read: value, update: value, delete: value }
        })
        updated.goodReceipts = updatedGR
      }
      if (prev.transportPass) {
        const updatedTP = {}
        Object.keys(prev.transportPass).forEach((key) => {
          updatedTP[key] = { create: value, read: value, update: value, delete: value }
        })
        updated.transportPass = updatedTP
      }
      if (prev.warehouse) {
        const updatedWH = {}
        Object.keys(prev.warehouse).forEach((key) => {
          updatedWH[key] = { create: value, read: value, update: value, delete: value }
        })
        updated.warehouse = updatedWH
      }
      return updated
    })
  }

  const handleSelectAllSupport = (value = true) => {
    if (isEmployeeLogin) return
    setPermissions((prev) => {
      const updated = { ...prev }
      updated.tickets = {
        raise: { create: value, read: value, update: value, delete: value },
        answer: { create: value, read: value, update: value, delete: value },
      }
      updated.chat = { read: value }
      return updated
    })
  }

  const handleGrantAdminAccess = (value = true) => {
    if (isEmployeeLogin) return
    setPermissions((prev) => {
      const updated = { ...prev }
      Object.keys(prev).forEach((sectionKey) => {
        const section = prev[sectionKey]
        if (sectionKey === 'chat') {
          updated[sectionKey] = { read: value }
        } else if (sectionKey === 'dailyTrips') {
          updated[sectionKey] = { create: value, read: value, update: value, delete: value }
        } else if (typeof section === 'object' && section !== null) {
          const updatedSection = {}
          Object.keys(section).forEach((itemKey) => {
            if (typeof section[itemKey] === 'object' && section[itemKey] !== null) {
              updatedSection[itemKey] = { create: value, read: value, update: value, delete: value }
            } else {
              updatedSection[itemKey] = value
            }
          })
          updated[sectionKey] = updatedSection
        }
      })
      return updated
    })

    setCustomPermissions((prev) => {
      const updated = {}
      Object.keys(prev || {}).forEach((key) => {
        updated[key] = { create: value, read: value, update: value, delete: value }
      })
      return updated
    })
  }

  const handleClose = () => {
    if (onCloseProp) {
      onCloseProp()
    } else {
      navigate('/Worker')
    }
  }

  const handleSave = async () => {
    if (!effectiveId) return
    setIsSaving(true)
    try {
      const payload = {
        workerId: effectiveId,
        permissions,
        customPermissions,
      }
      await PermissionService.addOrUpdatePermissions(payload)
      toast.success(`Permissions updated successfully for ${worker?.name || 'employee'}!`)
      if (onSaveSuccessProp) {
        onSaveSuccessProp()
      } else {
        queryClient.invalidateQueries(['workerList'])
      }
      handleClose()
    } catch (error) {
      console.error('Error saving permissions:', error)
      toast.error(error.message || 'Failed to update permissions')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRowSelectAll = (section, item, isCustom, value) => {
    if (isEmployeeLogin) return
    const updater = (prev) => {
      if (isCustom) {
        const currentItem = prev[section] || {}
        const updatedItem = {}
        Object.keys(currentItem).forEach((action) => {
          updatedItem[action] = value
        })
        return {
          ...prev,
          [section]: updatedItem,
        }
      } else {
        if (item === null) {
          const currentItem = prev[section] || {}
          const updatedItem = {}
          Object.keys(currentItem).forEach((action) => {
            updatedItem[action] = value
          })
          return {
            ...prev,
            [section]: updatedItem,
          }
        } else {
          const currentSection = prev[section] || {}
          const currentItem = currentSection[item] || {}
          const updatedItem = {}
          Object.keys(currentItem).forEach((action) => {
            updatedItem[action] = value
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

  const renderPermissionRow = (section, label, item = null, isCustom = false) => {
    const currentData = isCustom ? customPermissions : permissions
    const targetObj = item ? currentData[section]?.[item] : currentData[section]

    if (!targetObj) return null

    const hasRead = targetObj.read !== undefined
    const hasCreate = targetObj.create !== undefined
    const hasUpdate = targetObj.update !== undefined
    const hasDelete = targetObj.delete !== undefined

    const isAllChecked =
      (!hasRead || targetObj.read) &&
      (!hasCreate || targetObj.create) &&
      (!hasUpdate || targetObj.update) &&
      (!hasDelete || targetObj.delete)

    return (
      <tr key={item || section} className="align-middle">
        <td className="fw-semibold text-secondary" style={{ fontSize: '0.9rem', width: isEmployeeLogin ? '40%' : '30%' }}>
          {label}
        </td>

        {/* 'All' checkbox column only shown in admin/edit mode */}
        {!isEmployeeLogin && (
          <td className="text-center" style={{ backgroundColor: '#f8fafc', width: '10%' }}>
            <Form.Check
              type="checkbox"
              checked={isAllChecked}
              onChange={(e) => handleRowSelectAll(section, item, isCustom, e.target.checked)}
            />
          </td>
        )}

        {/* Read */}
        <td className="text-center">
          {hasRead ? (
            isEmployeeLogin ? (
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
                checked={targetObj.read}
                onChange={() => handleCheckboxChange(section, item, 'read', isCustom)}
              />
            )
          ) : null}
        </td>

        {/* Create */}
        <td className="text-center">
          {hasCreate ? (
            isEmployeeLogin ? (
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
                checked={targetObj.create}
                onChange={() => handleCheckboxChange(section, item, 'create', isCustom)}
              />
            )
          ) : null}
        </td>

        {/* Update */}
        <td className="text-center">
          {hasUpdate ? (
            isEmployeeLogin ? (
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
                checked={targetObj.update}
                onChange={() => handleCheckboxChange(section, item, 'update', isCustom)}
              />
            )
          ) : null}
        </td>

        {/* Delete */}
        <td className="text-center">
          {hasDelete ? (
            isEmployeeLogin ? (
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
                checked={targetObj.delete}
                onChange={() => handleCheckboxChange(section, item, 'delete', isCustom)}
              />
            )
          ) : null}
        </td>
      </tr>
    )
  }

  // Filter modules based on showOnlyAccessible
  const getVisibleModules = (modules) => {
    if (showOnlyAccessible) {
      return modules.filter((m) => hasAccess(m.section, m.item))
    }
    return modules
  }

  const visibleMasters = getVisibleModules(MASTERS_MODULES)
  const visibleReports = getVisibleModules(REPORTS_MODULES)
  const visibleOperational = getVisibleModules(OPERATIONAL_MODULES)
  const visibleSupport = getVisibleModules(SUPPORT_MODULES)

  const mastersCount = MASTERS_MODULES.filter((m) => hasAccess(m.section, m.item)).length
  const reportsCount = REPORTS_MODULES.filter((m) => hasAccess(m.section, m.item)).length
  const operationalCount = OPERATIONAL_MODULES.filter((m) => hasAccess(m.section, m.item)).length
  const supportCount = SUPPORT_MODULES.filter((m) => hasAccess(m.section, m.item)).length
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

  if (!worker && !isEmployeeLogin) {
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

  const displayName = worker?.name || loggedInWorkerInfo?.name || 'Employee'

  return (
    <Card className="shadow mb-4 borderless-bottom">
      <Card.Header className="d-flex align-items-center justify-content-between bg-white py-3">
        <div className="d-flex align-items-center gap-2">
          {!isEmployeeLogin && (
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
            {isEmployeeLogin ? `My Assigned Permissions (${displayName})` : `Manage Permissions for ${displayName}`}
          </h5>
          {isEmployeeLogin && (
            <Badge bg="success" className="ms-2 px-2 py-1 fw-normal">
              Active Access ({totalAccessibleCount} Modules)
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

          {!isEmployeeLogin ? (
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
        {/* Quick Actions for Admin */}
        {!isEmployeeLogin && (
          <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded border">
            <span className="text-dark fw-bold" style={{ fontSize: '0.9rem' }}>Quick Actions:</span>
            <div className="d-flex gap-2">
              <Button size="sm" variant="success" className="text-white" onClick={() => handleGrantAdminAccess(true)}>
                Grant Admin Access (Select All)
              </Button>
              <Button size="sm" variant="outline-danger" onClick={() => handleGrantAdminAccess(false)}>
                Clear All Access
              </Button>
            </div>
          </div>
        )}

        <Tabs defaultActiveKey="masters" className="mb-3 premium-tabs">
          {/* MASTERS */}
          <Tab eventKey="masters" title={`Masters (${mastersCount})`}>
            {!isEmployeeLogin && (
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
                    {!isEmployeeLogin && <th>All</th>}
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
                <p className="mb-0 fw-semibold">No permissions granted in Masters category.</p>
              </div>
            )}
          </Tab>

          {/* REPORTS */}
          <Tab eventKey="reports" title={`Reports (${reportsCount})`}>
            {!isEmployeeLogin && (
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
                    {!isEmployeeLogin && <th>All</th>}
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
                <p className="mb-0 fw-semibold">No permissions granted in Reports category.</p>
              </div>
            )}
          </Tab>

          {/* OPERATIONAL */}
          <Tab eventKey="operational" title={`Operational Modules (${operationalCount})`}>
            {!isEmployeeLogin && (
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
                    {!isEmployeeLogin && <th>All</th>}
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
                <p className="mb-0 fw-semibold">No permissions granted in Operational Modules category.</p>
              </div>
            )}
          </Tab>

          {/* SUPPORT & CHAT */}
          <Tab eventKey="support" title={`Support & Chat (${supportCount})`}>
            {!isEmployeeLogin && (
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
                    {!isEmployeeLogin && <th>All</th>}
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
                <p className="mb-0 fw-semibold">No permissions granted in Support & Chat category.</p>
              </div>
            )}
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  )
}

export default WorkerPermissionsPage
