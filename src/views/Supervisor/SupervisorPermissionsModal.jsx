import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CSpinner,
  CBadge,
} from '@coreui/react'
import { Form, Table, Tabs, Tab } from 'react-bootstrap'
import { Shield, Trash2, Save, RotateCcw, CheckSquare, Square, Plus, X } from 'lucide-react'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import {
  getSupervisorPermissions,
  addOrUpdateSupervisorPermissions,
  deleteSupervisorPermissions,
} from './data/supervisorRoleService'

const defaultPermissionsTemplate = {
  masters: {
    driver: { create: false, read: false, update: false, delete: false },
    vehicle: { create: false, read: false, update: false, delete: false },
    trip: { create: false, read: false, update: false, delete: false },
    company: { create: false, read: false, update: false, delete: false },
    materialOwner: { create: false, read: false, update: false, delete: false },
    employee: { create: false, read: false, update: false, delete: false },
    consignor: { create: false, read: false, update: false, delete: false },
    consignee: { create: false, read: false, update: false, delete: false },
    attendance: { create: false, read: false, update: false, delete: false },
    leave: { create: false, read: false, update: false, delete: false },
  },
  reports: {
    salary: { create: false, read: false, update: false, delete: false },
    driverExp: { create: false, read: false, update: false, delete: false },
    vehicleExp: { create: false, read: false, update: false, delete: false },
    dailyLog: { create: false, read: false, update: false, delete: false },
    serviceLog: { create: false, read: false, update: false, delete: false },
    inspection: { create: false, read: false, update: false, delete: false },
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
  transportPass: {
    receipt: { create: false, read: false, update: false, delete: false },
  },
  warehouse: {
    product: { create: false, read: false, update: false, delete: false },
    railHead: { create: false, read: false, update: false, delete: false },
    inventory: { create: false, read: false, update: false, delete: false },
  },
  tickets: {
    raise: { create: false, read: false, update: false, delete: false },
    answer: { create: false, read: false, update: false, delete: false },
  },
  chat: {
    read: false,
  },
}

const MASTERS_CONFIG = [
  { section: 'masters', item: 'driver', label: 'Drivers' },
  { section: 'masters', item: 'vehicle', label: 'Vehicle' },
  { section: 'masters', item: 'trip', label: 'Trips' },
  { section: 'masters', item: 'company', label: 'Company Name' },
  { section: 'masters', item: 'materialOwner', label: 'Material Owner' },
  { section: 'masters', item: 'employee', label: 'Employees' },
  { section: 'masters', item: 'consignor', label: 'Consignor' },
  { section: 'masters', item: 'consignee', label: 'Consignee' },
  { section: 'masters', item: 'attendance', label: 'Driver Attendance Mark' },
  { section: 'masters', item: 'leave', label: 'Drivers Leave Requests' },
]

const REPORTS_CONFIG = [
  { section: 'reports', item: 'salary', label: 'Drivers Salary' },
  { section: 'reports', item: 'driverExp', label: 'All Drivers Expenses' },
  { section: 'reports', item: 'vehicleExp', label: 'All Vehicles Expenses' },
  { section: 'reports', item: 'dailyLog', label: 'All Drivers Logbooks' },
  { section: 'reports', item: 'serviceLog', label: 'All Vehicle Service Log' },
  { section: 'reports', item: 'inspection', label: 'All Vehicle Inspections' },
  { section: 'dailyTrips', item: null, label: 'Daily Trips Reading' },
]

const OPERATIONAL_CONFIG = [
  { section: 'goodReceipts', item: 'rail', label: 'Good Receipt Rail' },
  { section: 'goodReceipts', item: 'road', label: 'Good Receipt Road' },
  { section: 'transportPass', item: 'receipt', label: 'Transport Pass Receipt' },
  { section: 'warehouse', item: 'product', label: 'Warehouse (Product List)' },
  { section: 'warehouse', item: 'railHead', label: 'Warehouse (Rail Head)' },
  { section: 'warehouse', item: 'inventory', label: 'Warehouse (Inventory)' },
]

const SUPPORT_CONFIG = [
  { section: 'tickets', item: 'raise', label: 'Tickets Raised' },
  { section: 'tickets', item: 'answer', label: 'Tickets Answered' },
  { section: 'chat', item: null, label: 'Chat Box', singleRead: true },
]

const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

const deepMerge = (target, source) => {
  if (!source) return target
  const output = deepClone(target)
  Object.keys(source).forEach((key) => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(output[key] || {}, source[key])
    } else {
      output[key] = source[key]
    }
  })
  return output
}

const SupervisorPermissionsModal = ({ visible, supervisor, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('masters')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [permissions, setPermissions] = useState(deepClone(defaultPermissionsTemplate))
  const [categoryName, setCategoryName] = useState('')
  const [customPermissions, setCustomPermissions] = useState({})
  const [newCustomModuleName, setNewCustomModuleName] = useState('')

  // Fetch supervisor's permissions when modal opens
  useEffect(() => {
    if (!visible || !supervisor?.id) return

    const loadPermissions = async () => {
      setIsLoading(true)
      try {
        const res = await getSupervisorPermissions(supervisor.id)
        if (res?.permissions) {
          setPermissions(deepMerge(defaultPermissionsTemplate, res.permissions))
        } else {
          setPermissions(deepClone(defaultPermissionsTemplate))
        }

        if (res?.categoryName) {
          setCategoryName(res.categoryName)
        } else {
          setCategoryName('')
        }

        if (res?.customPermissions) {
          setCustomPermissions(res.customPermissions)
        } else {
          setCustomPermissions({})
        }
      } catch (err) {
        // If supervisor has no permissions recorded yet, default to clean template
        console.warn('No existing permissions or fetch error:', err.message)
        setPermissions(deepClone(defaultPermissionsTemplate))
        setCategoryName('')
        setCustomPermissions({})
      } finally {
        setIsLoading(false)
      }
    }

    loadPermissions()
  }, [visible, supervisor?.id])

  // Count active permissions
  const countActivePermissions = useMemo(() => {
    let count = 0
    const countObj = (obj) => {
      if (!obj || typeof obj !== 'object') return
      Object.keys(obj).forEach((k) => {
        if (typeof obj[k] === 'boolean' && obj[k] === true) {
          count++
        } else if (typeof obj[k] === 'object') {
          countObj(obj[k])
        }
      })
    }
    countObj(permissions)
    countObj(customPermissions)
    return count
  }, [permissions, customPermissions])

  // Helper to toggle a specific action
  const toggleAction = (section, item, action) => {
    setPermissions((prev) => {
      const updated = deepClone(prev)
      if (item === null) {
        if (!updated[section]) updated[section] = {}
        updated[section][action] = !updated[section][action]
      } else {
        if (!updated[section]) updated[section] = {}
        if (!updated[section][item]) updated[section][item] = {}
        updated[section][item][action] = !updated[section][item][action]
      }
      return updated
    })
  }

  // Helper to toggle row-level select all
  const toggleRowSelectAll = (section, item, isAllSelected) => {
    const nextVal = !isAllSelected
    setPermissions((prev) => {
      const updated = deepClone(prev)
      if (item === null) {
        if (!updated[section]) updated[section] = {}
        if (section === 'chat') {
          updated.chat.read = nextVal
        } else {
          ;['create', 'read', 'update', 'delete'].forEach((act) => {
            updated[section][act] = nextVal
          })
        }
      } else {
        if (!updated[section]) updated[section] = {}
        if (!updated[section][item]) updated[section][item] = {}
        ;['create', 'read', 'update', 'delete'].forEach((act) => {
          updated[section][item][act] = nextVal
        })
      }
      return updated
    })
  }

  // Tab-level select/deselect all
  const handleTabSelectAll = (configList, value) => {
    setPermissions((prev) => {
      const updated = deepClone(prev)
      configList.forEach(({ section, item, singleRead }) => {
        if (item === null) {
          if (!updated[section]) updated[section] = {}
          if (singleRead) {
            updated[section].read = value
          } else {
            ;['create', 'read', 'update', 'delete'].forEach((act) => {
              updated[section][act] = value
            })
          }
        } else {
          if (!updated[section]) updated[section] = {}
          if (!updated[section][item]) updated[section][item] = {}
          ;['create', 'read', 'update', 'delete'].forEach((act) => {
            updated[section][item][act] = value
          })
        }
      })
      return updated
    })
  }

  // Global Grant All
  const handleGrantAll = () => {
    const grantObj = (obj) => {
      const updated = {}
      Object.keys(obj).forEach((k) => {
        if (typeof obj[k] === 'boolean') {
          updated[k] = true
        } else if (typeof obj[k] === 'object' && obj[k] !== null) {
          updated[k] = grantObj(obj[k])
        } else {
          updated[k] = obj[k]
        }
      })
      return updated
    }
    setPermissions(grantObj(defaultPermissionsTemplate))

    if (customPermissions && Object.keys(customPermissions).length > 0) {
      setCustomPermissions(grantObj(customPermissions))
    }
    toast.info('All permissions selected')
  }

  // Global Revoke All
  const handleRevokeAll = () => {
    setPermissions(deepClone(defaultPermissionsTemplate))
    const cleanCustom = {}
    Object.keys(customPermissions).forEach((k) => {
      cleanCustom[k] = { create: false, read: false, update: false, delete: false }
    })
    setCustomPermissions(cleanCustom)
    toast.info('All permissions cleared')
  }

  // Custom Permissions Handlers
  const handleAddCustomModule = () => {
    if (!newCustomModuleName.trim()) return
    const key = newCustomModuleName.trim().replace(/\s+/g, '_')
    if (customPermissions[key]) {
      toast.warning('This custom module already exists')
      return
    }
    setCustomPermissions((prev) => ({
      ...prev,
      [key]: { create: false, read: false, update: false, delete: false },
    }))
    setNewCustomModuleName('')
  }

  const handleRemoveCustomModule = (modKey) => {
    setCustomPermissions((prev) => {
      const updated = { ...prev }
      delete updated[modKey]
      return updated
    })
  }

  const toggleCustomAction = (modKey, action) => {
    setCustomPermissions((prev) => {
      const updated = { ...prev }
      const mod = updated[modKey] || { create: false, read: false, update: false, delete: false }
      updated[modKey] = {
        ...mod,
        [action]: !mod[action],
      }
      return updated
    })
  }

  // Save Permissions (Endpoint 1)
  const handleSave = async () => {
    if (!supervisor?.id) return
    setIsSaving(true)
    try {
      const payload = {
        supervisorId: supervisor.id,
        permissions,
        categoryName: categoryName.trim() || undefined,
        customPermissions:
          Object.keys(customPermissions).length > 0 ? customPermissions : undefined,
      }

      const res = await addOrUpdateSupervisorPermissions(payload)
      toast.success(res?.message || 'Permissions updated successfully!')
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to update supervisor permissions')
    } finally {
      setIsSaving(false)
    }
  }

  // Delete Supervisor Role / Permissions (Endpoint 4)
  const handleDeleteRole = () => {
    if (!supervisor?.id) return

    Swal.fire({
      title: 'Delete Supervisor Role?',
      html: `Are you sure you want to completely remove the role & permissions mapping for <b>${
        supervisor.name || 'this supervisor'
      }</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete Role',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsDeleting(true)
        try {
          const res = await deleteSupervisorPermissions(supervisor.id)
          toast.success(res?.message || 'Supervisor role deleted successfully')
          setPermissions(deepClone(defaultPermissionsTemplate))
          setCategoryName('')
          setCustomPermissions({})
          if (onSuccess) onSuccess()
          onClose()
        } catch (err) {
          toast.error(err.message || 'Failed to delete supervisor role')
        } finally {
          setIsDeleting(false)
        }
      }
    })
  }

  // Render Table for a list of module configurations
  const renderPermissionTable = (configList) => {
    return (
      <div className="table-responsive">
        <Table hover className="align-middle mb-0 text-nowrap" style={{ fontSize: '13.5px' }}>
          <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr>
              <th style={{ width: '38%', fontWeight: 600, color: '#475569' }}>Module Name</th>
              <th style={{ width: '14%', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                Select All
              </th>
              <th style={{ width: '12%', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                Create
              </th>
              <th style={{ width: '12%', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                Read
              </th>
              <th style={{ width: '12%', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                Update
              </th>
              <th style={{ width: '12%', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {configList.map((cfg) => {
              const { section, item, label, singleRead } = cfg
              const permObj = item === null ? permissions[section] || {} : permissions[section]?.[item] || {}

              const isCreate = Boolean(permObj.create)
              const isRead = Boolean(permObj.read)
              const isUpdate = Boolean(permObj.update)
              const isDelete = Boolean(permObj.delete)

              const isRowAllSelected = singleRead
                ? isRead
                : isCreate && isRead && isUpdate && isDelete

              return (
                <tr key={`${section}-${item || 'root'}`} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td className="fw-medium text-dark">{label}</td>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      className="d-inline-block"
                      checked={isRowAllSelected}
                      onChange={() => toggleRowSelectAll(section, item, isRowAllSelected)}
                    />
                  </td>
                  {singleRead ? (
                    <>
                      <td className="text-center text-muted">-</td>
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          className="d-inline-block"
                          checked={isRead}
                          onChange={() => toggleAction(section, item, 'read')}
                        />
                      </td>
                      <td className="text-center text-muted">-</td>
                      <td className="text-center text-muted">-</td>
                    </>
                  ) : (
                    <>
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          className="d-inline-block"
                          checked={isCreate}
                          onChange={() => toggleAction(section, item, 'create')}
                        />
                      </td>
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          className="d-inline-block"
                          checked={isRead}
                          onChange={() => toggleAction(section, item, 'read')}
                        />
                      </td>
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          className="d-inline-block"
                          checked={isUpdate}
                          onChange={() => toggleAction(section, item, 'update')}
                        />
                      </td>
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          className="d-inline-block"
                          checked={isDelete}
                          onChange={() => toggleAction(section, item, 'delete')}
                        />
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    )
  }

  return (
    <CModal
      size="xl"
      backdrop="static"
      visible={visible}
      onClose={onClose}
      alignment="center"
      scrollable
    >
      <CModalHeader closeButton style={{ borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }}>
        <CModalTitle className="d-flex align-items-center gap-2" style={{ fontSize: '18px', fontWeight: 600 }}>
          <Shield size={22} color="#ec7426" />
          <span>Supervisor Role & Permissions</span>
          {supervisor?.name && (
            <CBadge color="info" className="text-dark bg-opacity-25" style={{ fontSize: '13px' }}>
              {supervisor.name} {supervisor.mobile ? `(${supervisor.mobile})` : ''}
            </CBadge>
          )}
        </CModalTitle>
      </CModalHeader>

      <CModalBody style={{ padding: '20px 24px', minHeight: '420px' }}>
        {isLoading ? (
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '350px' }}>
            <CSpinner color="primary" />
            <span className="mt-2 text-muted" style={{ fontSize: '14px' }}>
              Loading supervisor permissions...
            </span>
          </div>
        ) : (
          <>
            {/* Quick Actions Bar */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 p-2 rounded bg-light border">
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted" style={{ fontSize: '13px', fontWeight: 500 }}>
                  Active Grants:
                </span>
                <span className="badge bg-primary" style={{ fontSize: '13px' }}>
                  {countActivePermissions}
                </span>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                  onClick={handleGrantAll}
                  style={{ fontSize: '12.5px' }}
                >
                  <CheckSquare size={14} />
                  <span>Grant Full Access</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                  onClick={handleRevokeAll}
                  style={{ fontSize: '12.5px' }}
                >
                  <Square size={14} />
                  <span>Revoke All</span>
                </button>
              </div>
            </div>

            {/* Permission Tabs */}
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3 custom-permission-tabs"
            >
              {/* 1. Masters Tab */}
              <Tab eventKey="masters" title="Masters">
                <div className="d-flex justify-content-end gap-2 mb-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-primary text-decoration-none p-0"
                    onClick={() => handleTabSelectAll(MASTERS_CONFIG, true)}
                    style={{ fontSize: '12.5px' }}
                  >
                    Select All Masters
                  </button>
                  <span className="text-muted">|</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-muted text-decoration-none p-0"
                    onClick={() => handleTabSelectAll(MASTERS_CONFIG, false)}
                    style={{ fontSize: '12.5px' }}
                  >
                    Clear Masters
                  </button>
                </div>
                {renderPermissionTable(MASTERS_CONFIG)}
              </Tab>

              {/* 2. Reports Tab */}
              <Tab eventKey="reports" title="Reports">
                <div className="d-flex justify-content-end gap-2 mb-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-primary text-decoration-none p-0"
                    onClick={() => handleTabSelectAll(REPORTS_CONFIG, true)}
                    style={{ fontSize: '12.5px' }}
                  >
                    Select All Reports
                  </button>
                  <span className="text-muted">|</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-muted text-decoration-none p-0"
                    onClick={() => handleTabSelectAll(REPORTS_CONFIG, false)}
                    style={{ fontSize: '12.5px' }}
                  >
                    Clear Reports
                  </button>
                </div>
                {renderPermissionTable(REPORTS_CONFIG)}
              </Tab>

              {/* 3. Operational Tab */}
              <Tab eventKey="operational" title="Operational">
                <div className="d-flex justify-content-end gap-2 mb-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-primary text-decoration-none p-0"
                    onClick={() => handleTabSelectAll(OPERATIONAL_CONFIG, true)}
                    style={{ fontSize: '12.5px' }}
                  >
                    Select All Operational
                  </button>
                  <span className="text-muted">|</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-muted text-decoration-none p-0"
                    onClick={() => handleTabSelectAll(OPERATIONAL_CONFIG, false)}
                    style={{ fontSize: '12.5px' }}
                  >
                    Clear Operational
                  </button>
                </div>
                {renderPermissionTable(OPERATIONAL_CONFIG)}
              </Tab>

              {/* 4. Support Tab */}
              <Tab eventKey="support" title="Support">
                <div className="d-flex justify-content-end gap-2 mb-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-primary text-decoration-none p-0"
                    onClick={() => handleTabSelectAll(SUPPORT_CONFIG, true)}
                    style={{ fontSize: '12.5px' }}
                  >
                    Select All Support
                  </button>
                  <span className="text-muted">|</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-muted text-decoration-none p-0"
                    onClick={() => handleTabSelectAll(SUPPORT_CONFIG, false)}
                    style={{ fontSize: '12.5px' }}
                  >
                    Clear Support
                  </button>
                </div>
                {renderPermissionTable(SUPPORT_CONFIG)}
              </Tab>

              {/* 5. Custom Category Tab */}
              <Tab eventKey="custom" title="Custom Permissions">
                <div className="p-3 border rounded bg-light mb-3">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ fontSize: '13.5px' }}>
                      Custom Category Name (Optional)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. SpecialOperations, RegionalOffice"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      style={{ fontSize: '13px' }}
                    />
                    <Form.Text className="text-muted" style={{ fontSize: '12px' }}>
                      Optionally assign a custom category group to this supervisor role.
                    </Form.Text>
                  </Form.Group>

                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Add new custom module name..."
                      value={newCustomModuleName}
                      onChange={(e) => setNewCustomModuleName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddCustomModule()
                        }
                      }}
                      style={{ fontSize: '13px' }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary d-flex align-items-center gap-1 text-nowrap"
                      onClick={handleAddCustomModule}
                      style={{ fontSize: '13px' }}
                    >
                      <Plus size={15} />
                      <span>Add Module</span>
                    </button>
                  </div>
                </div>

                {Object.keys(customPermissions).length === 0 ? (
                  <div className="text-center py-4 text-muted border rounded" style={{ fontSize: '13px' }}>
                    No custom module permissions added yet. Use the field above to add custom modules.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="align-middle mb-0 text-nowrap" style={{ fontSize: '13.5px' }}>
                      <thead style={{ backgroundColor: '#f8fafc' }}>
                        <tr>
                          <th style={{ width: '38%', fontWeight: 600, color: '#475569' }}>
                            Custom Module Name
                          </th>
                          <th style={{ width: '12%', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                            Create
                          </th>
                          <th style={{ width: '12%', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                            Read
                          </th>
                          <th style={{ width: '12%', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                            Update
                          </th>
                          <th style={{ width: '12%', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                            Delete
                          </th>
                          <th style={{ width: '14%', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(customPermissions).map(([modKey, modPerms]) => (
                          <tr key={modKey} style={{ borderBottom: '1px solid #edf2f7' }}>
                            <td className="fw-medium text-dark">{modKey}</td>
                            <td className="text-center">
                              <Form.Check
                                type="checkbox"
                                className="d-inline-block"
                                checked={Boolean(modPerms.create)}
                                onChange={() => toggleCustomAction(modKey, 'create')}
                              />
                            </td>
                            <td className="text-center">
                              <Form.Check
                                type="checkbox"
                                className="d-inline-block"
                                checked={Boolean(modPerms.read)}
                                onChange={() => toggleCustomAction(modKey, 'read')}
                              />
                            </td>
                            <td className="text-center">
                              <Form.Check
                                type="checkbox"
                                className="d-inline-block"
                                checked={Boolean(modPerms.update)}
                                onChange={() => toggleCustomAction(modKey, 'update')}
                              />
                            </td>
                            <td className="text-center">
                              <Form.Check
                                type="checkbox"
                                className="d-inline-block"
                                checked={Boolean(modPerms.delete)}
                                onChange={() => toggleCustomAction(modKey, 'delete')}
                              />
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger p-1"
                                onClick={() => handleRemoveCustomModule(modKey)}
                                title="Remove Module"
                              >
                                <X size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Tab>
            </Tabs>
          </>
        )}
      </CModalBody>

      <CModalFooter className="d-flex justify-content-between align-items-center" style={{ padding: '16px 24px', backgroundColor: '#f8fafc' }}>
        <div>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
            onClick={handleDeleteRole}
            disabled={isDeleting || isSaving || isLoading}
            style={{ fontSize: '13px' }}
          >
            <Trash2 size={15} />
            <span>{isDeleting ? 'Deleting...' : 'Delete / Reset Role'}</span>
          </button>
        </div>

        <div className="d-flex gap-2">
          <CButton
            color="secondary"
            variant="ghost"
            onClick={onClose}
            disabled={isSaving || isDeleting}
            style={{ fontSize: '13px' }}
          >
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={handleSave}
            disabled={isSaving || isDeleting || isLoading}
            className="d-flex align-items-center gap-1"
            style={{ backgroundColor: '#ec7426', borderColor: '#ec7426', fontSize: '13px' }}
          >
            {isSaving ? (
              <>
                <CSpinner size="sm" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Permissions</span>
              </>
            )}
          </CButton>
        </div>
      </CModalFooter>
    </CModal>
  )
}

SupervisorPermissionsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  supervisor: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
}

export default SupervisorPermissionsModal
