import React, { useState } from 'react';
import {
  Building2,
  Users,
  Truck,
  Clock,
  PhoneCall,
  BarChart3,
  MapPin,
  Mail,
  User,
  Battery,
  Pencil,
  X,
  DollarSign,
  Wallet,
  TrendingUp,
  Wrench,
  Fuel,
  UserCheck,
  Building,
} from 'lucide-react';
 import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton,CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CContainer } from '@coreui/react';
 import CIcon from '@coreui/icons-react';
 import { cilBuilding, cilPencil, cilUser, cilMap, cilPhone, cilEnvelopeClosed, cilCalendar,  } from '@coreui/icons';

const BranchDetails=()=>{

  const [isEditing, setIsEditing] = useState(false);
  const [branchInfo, setBranchInfo] = useState({
    name: "Downtown Fleet Center",
    id: "BRC-001",
    address: "123 Fleet Street, Downtown",
    city: "Chicago, IL 60601",
    phone: "(312) 555-0123",
    email: "downtown@fleetmanager.com",
    manager: "Sarah Johnson",
    operatingHours: "Mon-Fri: 6:00 AM - 10:00 PM",
    establishedDate: "2020-03-15"
  });

  const [editForm, setEditForm] = useState(branchInfo);

  const stats = {
    totalVehicles: 45,
    availableVehicles: 32,
    inMaintenance: 5,
    totalStaff: 28,
    activeDrivers: 22,
    utilizationRate: 85,
    satisfactionScore: 4.8,
  };



  const vehicles= [
    { id: 'VH001', type: 'Truck', model: 'Ford F-150', status: 'available', lastService: '2024-02-15', mileage: 45000, fuelLevel: 75 },
    { id: 'VH002', type: 'Van', model: 'Mercedes Sprinter', status: 'in-use', lastService: '2024-02-10', mileage: 62000, fuelLevel: 45 },
    { id: 'VH003', type: 'Truck', model: 'Chevrolet Silverado', status: 'maintenance', lastService: '2024-01-20', mileage: 78000, fuelLevel: 30 },
    { id: 'VH004', type: 'Van', model: 'Ford Transit', status: 'available', lastService: '2024-02-18', mileage: 35000, fuelLevel: 90 },
    { id: 'VH005', type: 'Truck', model: 'RAM 1500', status: 'in-use', lastService: '2024-02-05', mileage: 52000, fuelLevel: 60 },
  ];

  const drivers=[
    { id: 'DR001', name: 'John Smith', status: 'active', license: 'CDL-A', currentVehicle: 'VH002', tripCount: 128, rating: 4.9 },
    { id: 'DR002', name: 'Maria Garcia', status: 'active', license: 'CDL-A', currentVehicle: 'VH005', tripCount: 95, rating: 4.7 },
    { id: 'DR003', name: 'David Chen', status: 'off-duty', license: 'CDL-B', currentVehicle: null, tripCount: 156, rating: 4.8 },
    { id: 'DR004', name: 'Lisa Johnson', status: 'on-leave', license: 'CDL-A', currentVehicle: null, tripCount: 82, rating: 4.6 },
    { id: 'DR005', name: 'James Wilson', status: 'active', license: 'CDL-B', currentVehicle: null, tripCount: 110, rating: 4.9 },
  ];

  const financials = {
    totalBudget: 1200000,
    expenditures: {
      vehicleMaintenance: 180000,
      fuel: 240000,
      driverSalaries: 420000,
      operational: 160000,
    },
    revenue: 1450000,
    profit: 450000,
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'in-use':
      case 'off-duty':
        return 'text-blue-600 bg-blue-50';
      case 'maintenance':
      case 'on-leave':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBranchInfo(editForm);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div >
 
   
        
          
          {/* Header */}
{/* Header */}
<div className="p-4" style={{ background: 'linear-gradient(to right, #007bff, #0056b3)' }}>
  <CRow className="align-items-center justify-content-between">
    <CCol xs="12" md="6" className="d-flex align-items-center">
      <CIcon icon={cilBuilding} size="lg" className="text-white me-3" />
      <div>
        <h1 className="text-white">{branchInfo.name}</h1>
        <p className="text-white-50">Branch ID: {branchInfo.id}</p>
      </div>
    </CCol>
    <CCol xs="12" md="6" className="text-end d-flex justify-content-end align-items-center">
      {/* <CButton
        color="info"
        variant="outline"
        className="me-3"
        onClick={() => setIsEditing(true)}
      >
        <CIcon icon={cilPencil} className="me-2" />
        Edit Branch
      </CButton> */}
      <div className="text-white text-end me-3">
        <p className="text-white-50 mb-0">Branch Manager</p>
        <p className="fw-bold mb-0">{branchInfo.manager}</p>
      </div>
      <CIcon icon={cilUser} size="lg" className="text-white" />
    </CCol>
  </CRow>
</div>

{/* Details Section */}
<div className="p-4 ">
  <CRow className="g-4">
    <CCol xs="12" md="3" className="d-flex align-items-center">
      <CIcon icon={cilMap} size="lg" className="text-primary me-3" />
      <div>
        <p className="text-muted mb-1">Address</p>
        <p className="fw-bold mb-0">{branchInfo.address}</p>
        <p className="fw-bold mb-0">{branchInfo.city}</p>
      </div>
    </CCol>
    <CCol xs="12" md="3" className="d-flex align-items-center">
      <CIcon icon={cilPhone} size="lg" className="text-primary me-3" />
      <div>
        <p className="text-muted mb-1">Phone</p>
        <p className="fw-bold mb-0">{branchInfo.phone}</p>
      </div>
    </CCol>
    <CCol xs="12" md="3" className="d-flex align-items-center">
      <CIcon icon={cilEnvelopeClosed} size="lg" className="text-primary me-3" />
      <div>
        <p className="text-muted mb-1">Email</p>
        <p className="fw-bold mb-0">{branchInfo.email}</p>
      </div>
    </CCol>
    <CCol xs="12" md="3" className="d-flex align-items-center">
      <CIcon icon={cilCalendar} size="lg" className="text-primary me-3" />
      <div>
        <p className="text-muted mb-1">Established</p>
        <p className="fw-bold mb-0">{new Date(branchInfo.establishedDate).toLocaleDateString()}</p>
      </div>
    </CCol>
  </CRow>
</div>



          {/* Edit Modal */}
{isEditing && (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 50,
    }}
  >
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '40rem',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Edit Branch Information</h2>
        <button
          onClick={() => setIsEditing(false)}
          style={{
            color: '#6b7280',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => (e.target.style.color = '#374151')}
          onMouseOut={(e) => (e.target.style.color = '#6b7280')}
        >
          <X style={{ height: '1.5rem', width: '1.5rem' }} />
        </button>
      </div>
      <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            { label: 'Branch Name', name: 'name', type: 'text', value: editForm.name },
            { label: 'Branch ID', name: 'id', type: 'text', value: editForm.id },
            { label: 'Address', name: 'address', type: 'text', value: editForm.address },
            { label: 'City', name: 'city', type: 'text', value: editForm.city },
            { label: 'Phone', name: 'phone', type: 'tel', value: editForm.phone },
            { label: 'Email', name: 'email', type: 'email', value: editForm.email },
            { label: 'Manager', name: 'manager', type: 'text', value: editForm.manager },
            {
              label: 'Operating Hours',
              name: 'operatingHours',
              type: 'text',
              value: editForm.operatingHours,
            },
            {
              label: 'Establishment Date',
              name: 'establishedDate',
              type: 'date',
              value: editForm.establishedDate,
            },
          ].map(({ label, name, type, value }) => (
            <div key={name}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem',
                }}
              >
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={value}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  outline: 'none',
                }}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
          }}
        >
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              color: '#374151',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#f9fafb')}
            onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#2563eb')}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}

          {/* Stats Grid */}
<div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',  }}>
  {/* Fleet Status */}
  <CCard style={{ flex: '1 1 calc(25% - 1rem)', minWidth: '250px' }}>
    <CCardHeader>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Fleet Status</h3>
        <Truck style={{ color: '#2563eb', width: '24px', height: '24px' }} />
      </div>
    </CCardHeader>
    <CCardBody>
      <div style={{ marginBottom: '0.5rem' }}>
        <span>Total Vehicles:</span>
        <span style={{ fontWeight: '600', float: 'right' }}>{stats.totalVehicles}</span>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <span>Available:</span>
        <span style={{ fontWeight: '600', color: '#16a34a', float: 'right' }}>{stats.availableVehicles}</span>
      </div>
      <div>
        <span>In Maintenance:</span>
        <span style={{ fontWeight: '600', color: '#facc15', float: 'right' }}>{stats.inMaintenance}</span>
      </div>
    </CCardBody>
  </CCard>

  {/* Staff Overview */}
  <CCard style={{ flex: '1 1 calc(25% - 1rem)', minWidth: '250px' }}>
    <CCardHeader>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Staff Overview</h3>
        <Users style={{ color: '#2563eb', width: '24px', height: '24px' }} />
      </div>
    </CCardHeader>
    <CCardBody>
      <div style={{ marginBottom: '0.5rem' }}>
        <span>Total Staff:</span>
        <span style={{ fontWeight: '600', float: 'right' }}>{stats.totalStaff}</span>
      </div>
      <div>
        <span>Active Drivers:</span>
        <span style={{ fontWeight: '600', float: 'right' }}>{stats.activeDrivers}</span>
      </div>
    </CCardBody>
  </CCard>

  {/* Performance */}
  <CCard style={{ flex: '1 1 calc(25% - 1rem)', minWidth: '250px' }}>
    <CCardHeader>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Performance</h3>
        <BarChart3 style={{ color: '#2563eb', width: '24px', height: '24px' }} />
      </div>
    </CCardHeader>
    <CCardBody>
      <div style={{ marginBottom: '0.5rem' }}>
        <span>Utilization Rate:</span>
        <span style={{ fontWeight: '600', float: 'right' }}>{stats.utilizationRate}%</span>
      </div>
      <div>
        <span>Satisfaction Score:</span>
        <span style={{ fontWeight: '600', float: 'right' }}>{stats.satisfactionScore}/5.0</span>
      </div>
    </CCardBody>
  </CCard>

  {/* Financial Overview */}
  <CCard style={{ flex: '1 1 calc(25% - 1rem)', minWidth: '250px' }}>
    <CCardHeader>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Financial Overview</h3>
        <DollarSign style={{ color: '#2563eb', width: '24px', height: '24px' }} />
      </div>
    </CCardHeader>
    <CCardBody>
      <div style={{ marginBottom: '0.5rem' }}>
        <span>Revenue:</span>
        <span style={{ fontWeight: '600', color: '#16a34a', float: 'right' }}>
          {formatCurrency(financials.revenue)}
        </span>
      </div>
      <div>
        <span>Profit:</span>
        <span
          style={{
            fontWeight: '600',
            color: financials.profit >= 0 ? '#16a34a' : '#dc2626',
            float: 'right',
          }}
        >
          {formatCurrency(financials.profit)}
        </span>
      </div>
    </CCardBody>
  </CCard>
</div>


          <div className="pt-4">
      <h3 className="mb-1">Detailed Financial Overview</h3>
      <CRow className="gy-4">
        {/* Budget and Revenue */}
        <CCol xs={12} md={6}>
          <CCard style={{height:'100%'}}>
            <CCardHeader>Total Budget & Revenue</CCardHeader>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <Wallet className="text-primary me-2" />
                  <span>Total Budget</span>
                </div>
                <strong>{formatCurrency(financials.totalBudget)}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <TrendingUp className="text-success me-2" />
                  <span>Total Revenue</span>
                </div>
                <strong className="text-success">
                  {formatCurrency(financials.revenue)}
                </strong>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Expenditures Breakdown */}
        <CCol xs={12} md={6}>
          <CCard>
            <CCardHeader>Expenditures Breakdown</CCardHeader>
            <CCardBody>
              {[
                {
                  label: 'Vehicle Maintenance',
                  icon: <Wrench className="text-secondary me-2" />,
                  value: financials.expenditures.vehicleMaintenance,
                },
                {
                  label: 'Fuel Costs',
                  icon: <Fuel className="text-secondary me-2" />,
                  value: financials.expenditures.fuel,
                },
                {
                  label: 'Driver Salaries',
                  icon: <UserCheck className="text-secondary me-2" />,
                  value: financials.expenditures.driverSalaries,
                },
                {
                  label: 'Operational Costs',
                  icon: <Building className="text-secondary me-2" />,
                  value: financials.expenditures.operational,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2"
                >
                  <div className="d-flex align-items-center">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span>{formatCurrency(item.value)}</span>
                </div>
              ))}
              <div className="d-flex justify-content-between align-items-center pt-2">
                <strong>Total Expenditures</strong>
                <strong className="text-danger">
                  {formatCurrency(
                    Object.values(financials.expenditures).reduce((a, b) => a + b, 0)
                  )}
                </strong>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Profit/Loss Statement */}
        <CCol xs={12}>
          <CCard>
            <CCardHeader>Profit/Loss Statement</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6}>
                  <CCard className="bg-success text-white">
                    <CCardBody className="d-flex justify-content-between align-items-center">
                      <div>
                        <div>Total Revenue</div>
                        <strong>{formatCurrency(financials.revenue)}</strong>
                      </div>
                      <TrendingUp />
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol xs={12} md={6}>
                  <CCard className="bg-danger text-white">
                    <CCardBody className="d-flex justify-content-between align-items-center">
                      <div>
                        <div>Total Expenditures</div>
                        <strong>{
                          formatCurrency(
                            Object.values(financials.expenditures).reduce((a, b) => a + b, 0)
                          )
                        }</strong>
                      </div>
                      <Wallet />
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              <CCard className="mt-4">
                <CCardBody className="d-flex justify-content-between align-items-center">
                  <div>Net Profit/Loss</div>
                  <strong
                    className={
                      financials.profit >= 0 ? 'text-success' : 'text-danger'
                    }
                  >
                    {formatCurrency(financials.profit)}
                  </strong>
                </CCardBody>
              </CCard>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>

          <div className="p-6 mt-4">
  <CCard>
    <CCardHeader>
      <h3 className="text-xl font-semibold">Fleet Vehicles</h3>
    </CCardHeader>
    <CCardBody>
      <div className="overflow-x-auto">
        <CTable className="min-w-full" responsive hover bordered striped >
          <CTableHead >
            <CTableRow>
              <CTableHeaderCell className="text-left text-xs font-medium text-muted">ID</CTableHeaderCell>
              <CTableHeaderCell className="text-left text-xs font-medium text-muted">Type/Model</CTableHeaderCell>
              <CTableHeaderCell className="text-left text-xs font-medium text-muted">Status</CTableHeaderCell>
              <CTableHeaderCell className="text-left text-xs font-medium text-muted">Last Service</CTableHeaderCell>
              <CTableHeaderCell className="text-left text-xs font-medium text-muted">Mileage</CTableHeaderCell>
              <CTableHeaderCell className="text-left text-xs font-medium text-muted">Fuel Level</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {vehicles.map((vehicle) => (
              <CTableRow key={vehicle.id}>
                <CTableDataCell className="text-sm font-medium ">{vehicle.id}</CTableDataCell>
                <CTableDataCell className="text-sm  text-nowrap">
                  <div>{vehicle.type}     {vehicle.model}</div>
                  {/* <div className="text-xs text-muted">{vehicle.model}</div> */}
                </CTableDataCell>
                <CTableDataCell>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </CTableDataCell>
                <CTableDataCell className="text-sm ">{vehicle.lastService}</CTableDataCell>
                <CTableDataCell className="text-sm ">{vehicle.mileage.toLocaleString()} mi</CTableDataCell>
                <CTableDataCell>
                  <div className="flex items-center">
                    <Battery className={`h-4 w-4 mr-2 ${vehicle.fuelLevel > 70 ? 'text-green-500' : vehicle.fuelLevel > 30 ? 'text-yellow-500' : 'text-red-500'}`} />
                    <span className="text-sm">{vehicle.fuelLevel}%</span>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
    </CCardBody>
  </CCard>
</div>


<div className="p-6 mt-4">
  <CCard>
    <CCardHeader>
      <h3 className="text-xl font-semibold">Drivers</h3>
    </CCardHeader>
    <CCardBody>
      <div className="overflow-x-auto">
        <CTable className="min-w-full" bordered responsive striped hover>
          <CTableHead >
            <CTableRow>
              <CTableHeaderCell className="text-left text-xs font-medium text-muted">ID</CTableHeaderCell>
              <CTableHeaderCell className="text-left text-xs font-medium text-muted">Name</CTableHeaderCell>
              <CTableHeaderCell className="text-left text-xs font-medium text-muted">Status</CTableHeaderCell>
              <CTableHeaderCell className="text-left text-xs font-medium text-muted">License</CTableHeaderCell>
              <CTableHeaderCell className="text-left text-xs font-medium text-muted">Current Vehicle</CTableHeaderCell>
              <CTableHeaderCell className="text-left text-xs font-medium text-muted">Trip Count</CTableHeaderCell>
              <CTableHeaderCell className="text-left text-xs font-medium text-muted">Rating</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {drivers.map((driver) => (
              <CTableRow key={driver.id}>
                <CTableDataCell className="text-sm font-medium">{driver.id}</CTableDataCell>
                <CTableDataCell className="text-sm">{driver.name}</CTableDataCell>
                <CTableDataCell>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(driver.status)}`}>
                    {driver.status}
                  </span>
                </CTableDataCell>
                <CTableDataCell className="text-sm ">{driver.license}</CTableDataCell>
                <CTableDataCell className="text-sm ">
                  {driver.currentVehicle || <span className="">-</span>}
                </CTableDataCell>
                <CTableDataCell className="text-sm">{driver.tripCount}</CTableDataCell>
                <CTableDataCell>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${driver.rating >= 4.5 ? 'text-success' : driver.rating >= 4.0 ? 'text-warning' : 'text-danger'}`}>
                      {driver.rating}
                    </span>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
    </CCardBody>
  </CCard>
</div>


</div>
  );

}
export default BranchDetails;