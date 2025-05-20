import { element } from 'prop-types'
import React from 'react'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Vehicle
const Vehicle = React.lazy(() => import('./views/vehicle/Vehicle.jsx'))
const VehicleProfile = React.lazy(() => import('./views/vehicle/VehicleProfile.jsx'))
const VehicleExpenses = React.lazy(() => import('./views/vehicle/VehicleExpenses.jsx'))
const VehicleTrips = React.lazy(() => import('./views/vehicle/VehicleTrips.jsx'))
const ManageTyre = React.lazy(() => import('./views/vehicle/TyreSystem/ManageTyre.jsx'))

// import VehicleMaintenanceLogModal from './views/vehicle/modals/VehicleMaintenanceLogModal.jsx'
// import VehicleTripModal from './views/vehicle/modals/VehicleTripModal.jsx'

// Tyre Management
const TyreInventory = React.lazy(() => import('./views/Tyre-Management/TyreInventory.js'))
const DetailedPage = React.lazy(() => import('./views/Tyre-Management/DetailedPage.js'))
const TyreShowDoc = React.lazy(() => import('./views/Tyre-Management/TyreShowDoc.js'))

// Supervisor
const Trip = React.lazy(() => import('./views/Supervisor/trip/Trip.jsx'))
const SubTrips = React.lazy(() => import('./views/Supervisor/trip/componets/SubTripMain.jsx'))
const DriverSalary = React.lazy(() => import('./views/Supervisor/driver-salary/DriverSalary.jsx'))
const LeaveRequests = React.lazy(() => import('./views/Supervisor/leave-request/LeaveRequests.jsx'))
const CurrentAttendence = React.lazy(
  () => import('./views/Supervisor/attendence/CurrentAttendence.jsx'),
)
const ComDetails = React.lazy(() => import('./views/Supervisor/company-details/ComDetails.js'))
const SelectedCompDetails = React.lazy(
  () => import('./views/Supervisor/company-details/SelectedCompDetails.js'),
)
const BranchDetails = React.lazy(
  () => import('./views/Supervisor/company-details/BranchDetails.js'),
)

// Expenses Management
const PurchaseParts = React.lazy(
  () => import('./views/Expenses-Management/purchase-parts/PurchacePartsBill.js'),
)
const DriverExpenses = React.lazy(
  () => import('./views/Expenses-Management/driver-expenses/DriverExpensesBill.jsx'),
)
const VehicleExpensesBill = React.lazy(
  () => import('./views/Expenses-Management/vehicle-expenses/VehicleExpensesBill.jsx'),
)
const Bills = React.lazy(() => import('./views/Expenses-Management/bill-expenses/Bills.js'))
const Invoice = React.lazy(() => import('./views/Expenses-Management/accounts/Invoice.js'))
const LR = React.lazy(() => import('./views/Expenses-Management/LR/Lr.jsx'))
// const ShowDriverExpenseDoc = React.lazy(
//   () => import('./views/Expenses-Management/driver-expenses/showDoc.js'),
// )

// Road Side Assistance
const ExpenseSheet = React.lazy(
  () => import('./views/road-side-assistance/expense-sheet/total-expenses/TotalExpenses.js'),
)
const BudgetAllocation = React.lazy(
  () => import('./views/road-side-assistance/expense-sheet/budget-allocation/BudgetAllocation.jsx'),
)

// Help and Support
const HelpAndSupport = React.lazy(() => import('./views/pages/help-&-support/HelpAndSupport.js'))
const ChatBot = React.lazy(() => import('./views/pages/chatbot/ChatBot.js'))


// DriverExperts
const DriverExp = React.lazy(() => import('./views/DriverExpert/DriverExp.jsx'))
const DriverProfile = React.lazy(() => import('./views/DriverExpert/DriverProfile.jsx'))
const Attendance = React.lazy(
  () => import('./views/DriverExpert/components/attendance/Attendance.jsx'),
)

// Profile Section
const ProfileSection = React.lazy(() => import('./views/Profile/ProfileSection.jsx'))

const routes = [
  // Dashboard
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  /**VEHICLE */
  { path: '/Vehicle', name: 'Vehicles', element: Vehicle },
  { path: 'VehicleProfile/:id', name: 'VehicleProfile', element: VehicleProfile },
  { path: 'VehicleProfile/:id/VehicleExpenses', name: 'Vehicle Expenses', element: VehicleExpenses },
  { path: 'VehicleProfile/:id/VehicleTrips', name: 'Vehicle Trips', element: VehicleTrips },
  { path: 'VehicleProfile/:id/tyredetails', name: 'Detailed Page', element: DetailedPage },
  { path: 'VehicleProfile/:id/ManageTyre', name: 'Tyres System', element: ManageTyre },


  /**SUPERVISOR */

  { path: '/Trip', name: 'Trips', element: Trip },
  { path: '/SubTrips/:id', name: 'Sub Trips', element: SubTrips },
  { path: '/Salary', name: 'Drivers Salary', element: DriverSalary },
  { path: '/Attendence', name: 'Driver Attendence Mark', element: CurrentAttendence },
  { path: '/ComDetails', name: 'Company Details', element: ComDetails },
  { path: '/LeaveRequests', name: 'Leave Requests', element: LeaveRequests },
  { path: '/ComDetails/:id', name: 'Selected Company', element: SelectedCompDetails },
  { path: '/ComDetails/:id/branch-details/:id', name: 'Branch Details', element: BranchDetails },

  /**EXPENSES MANAGEMENT */

  { path: '/PurchacePartsBill', name: 'Purchase Parts', element: PurchaseParts },
  { path: '/DriverExpenseBill', name: 'All Drivers Expenses', element: DriverExpenses },
  { path: '/VehicleExpensesBill', name: 'All Vehicles Expenses', element: VehicleExpensesBill },
  { path: '/Bills', name: 'Bills', element: Bills },
  { path: '/Invoice', name: 'Invoice', element: Invoice },
  { path: '/LR', name: 'Lorry Recipt', element: LR },
  // {
  //   path: '/DriverExpenseBill/:id/documents',
  //   name: 'Show Driver Expense Documents',
  //   element: ShowDriverExpenseDoc,
  // },

  /*Tyre Management*/
  { path: '/Inventory', name: 'Tyre Inventory', element: TyreInventory },
  { path: 'Inventory/:id', name: 'Tyre Show Doc', element: TyreShowDoc },

  /**ROAD SIDE ASSISTANCE */
  { path: '/TotalExpenses', name: 'Total Expenses', element: ExpenseSheet },
  { path: '/BudgetAllocation', name: 'Budget Allocation', element: BudgetAllocation },

  /**HELP AND SUPPORT */
  { path: '/HelpAndSupport', name: 'Help And Support', element: HelpAndSupport },
  { path: '/ChatBot', name: 'Chat Bot', element: ChatBot },


  //  /**DRIVER EXPERTS */
  { path: '/DriverExp', name: 'DriverExperts', element: DriverExp },
  { path: '/DriverProfile/:id', name: 'Driver Profile', element: DriverProfile },
  { path: '/DriverAttendance/:id', name: 'Driver Attendance', element: Attendance },

  // Profile Section
  { path: '/ProfileSection', name: 'Profile', element: ProfileSection },


]

export default routes
