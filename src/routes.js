import { element } from 'prop-types'
import React from 'react'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))


// Vehicle
const Vehicle = React.lazy(() => import('./views/vehicle/Vehicle.jsx'))
const VehicleProfile = React.lazy(() => import('./components/VehicleProfile.jsx'))
import VehicleMaintenanceLogModal from './components/modals/VehicleMaintenanceLogModal.jsx'
import VehicleTripModal from './components/modals/VehicleTripModal.jsx'


// Supervisor
const Trip = React.lazy(() => import('./views/Supervisor/trip/Trip.jsx'))
const VehicleExpenses = React.lazy(() => import('./views/Supervisor/vehicle-expenses/VehicleExpenses.js'))
const LeaveRequests = React.lazy(() => import('./views/Supervisor/leave-request/LeaveRequests.jsx'))
const VehicleDriverBills = React.lazy(() => import('./views/Supervisor/billing/VehicleDriverBills.js'))
const ComDetails = React.lazy(() => import('./views/Supervisor/company-details/ComDetails.js'))
const SelectedCompDetails = React.lazy(() => import('./views/Supervisor/company-details/SelectedCompDetails.js'))
const BranchDetails = React.lazy(() => import('./views/Supervisor/company-details/BranchDetails.js'))

// Expenses Management
const PurchaseParts = React.lazy(() => import('./views/Expenses-Management/purchase-parts/PurchacePartsBill.js'))
const DriverExpenses = React.lazy(() => import('./views/Expenses-Management/driver-expenses/DriverExpensesBill.js'))
const VehicleExpensesBill = React.lazy(() => import('./views/Expenses-Management/vehicle-expenses/VehicleExpensesBill.js'))
const Bills = React.lazy(() => import('./views/Expenses-Management/bill-expenses/Bills.js'))
const Invoice = React.lazy(() => import('./views/Expenses-Management/accounts/Invoice.js'))
const LR = React.lazy(() => import('./views/Expenses-Management/LR/Lr.jsx'))
const ShowDriverExpenseDoc = React.lazy(() => import('./views/Expenses-Management/driver-expenses/showDoc.js'))

// Tyre Management
const TyreInventory = React.lazy(() => import('./views/Tyre-Management/TyreInventory.js'))
const DetailedPage = React.lazy(() => import('./views/Tyre-Management/DetailedPage.js'))
const TyreShowDoc = React.lazy(() => import('./views/Tyre-Management/TyreShowDoc.js'))

// Road Side Assistance
const ExpenseSheet = React.lazy(() => import('./views/road-side-assistance/expense-sheet/total-expenses/TotalExpenses.js'))
const BudgetAllocation = React.lazy(() => import('./views/road-side-assistance/expense-sheet/budget-allocation/BudgetAllocation.jsx'))

// Help and Support
const HelpAndSupport = React.lazy(() => import('./views/pages/help-&-support/HelpAndSupport.js'))

// DriverExperts
const DriverExp = React.lazy(() => import('./views/DriverExpert/DriverExp.js'))
const DriverProfile = React.lazy(() => import('./views/DriverExpert/DriverProfile.js'))
const AttendanceDetails = React.lazy(() => import('./views/DriverExpert/components/attendance/AttendanceDetails.js'))


const routes = [
  // Dashboard
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  /**VEHICLE */
  { path: '/Vehicle', name: 'Vahicle', element: Vehicle },
  { path: 'VehicleProfile/:id', name: 'VehicleProfile', element: VehicleProfile },
  { path: 'VehicleProfile/:id/maintenancelog', name: 'Maintenanace Log', element: VehicleMaintenanceLogModal },
  { path: 'VehicleProfile/:id/tripinfo', name: 'Trip Info', element: VehicleTripModal },
  { path: 'VehicleProfile/:id/tyredetails', name: 'Detailed Page', element: DetailedPage },

  /**SUPERVISOR */

  { path: '/Trip', name: 'Trip', element: Trip },
  { path: '/VehicleExpenses', name: 'Vehicle Expenses', element: VehicleExpenses },
  { path: '/VehicleDriverBills', name: 'Vehicle Driver Bills', element: VehicleDriverBills },
  { path: '/ComDetails', name: 'Company Details', element: ComDetails },
  { path: '/LeaveRequests', name: 'Leave Requests', element: LeaveRequests },
  { path: '/ComDetails/:id', name: 'Selected Company', element: SelectedCompDetails },
  { path: '/ComDetails/:id/branch-details/:id', name: 'Branch Details', element: BranchDetails },

  /**EXPENSES MANAGEMENT */

  { path: '/PurchacePartsBill', name: 'Purchase Parts', element: PurchaseParts },
  { path: '/DriverExpenseBill', name: 'Driver Expenses', element: DriverExpenses },
  { path: '/VehicleExpensesBill', name: 'Vehicle Expenses', element: VehicleExpensesBill },
  { path: '/Bills', name: 'Bills', element: Bills },
  { path: '/Invoice', name: 'Invoice', element: Invoice },
  { path: '/LR', name: 'LR', element: LR },
  { path: '/DriverExpenseBill/:id/documents', name: 'Show Driver Expense Documents', element: ShowDriverExpenseDoc },

  /*Tyre Management*/
  { path: '/Inventory', name: 'Tyre Inventory', element: TyreInventory },
  { path: 'Inventory/:id', name: 'Tyre Show Doc', element: TyreShowDoc },

  /**ROAD SIDE ASSISTANCE */
  { path: '/TotalExpenses', name: 'Total Expenses', element: ExpenseSheet },
  { path: '/BudgetAllocation', name: 'Budget Allocation', element: BudgetAllocation },

  /**HELP AND SUPPORT */
  { path: '/HelpAndSupport', name: 'Help And Support', element: HelpAndSupport },

  //  /**DRIVER EXPERTS */
  { path: '/DriverExp', name: 'DriverExperts', element: DriverExp },
  { path: '/DriverExp/:id', name: 'Driver Profile', element: DriverProfile },
  { path: '/DriverExp/:id/attendance', name: 'Driver Attendance', element: AttendanceDetails },

]

export default routes
