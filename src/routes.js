import { element } from 'prop-types'
import React from 'react'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Vehicle
const Vehicle = React.lazy(() => import('./views/vehicle/Vehicle.jsx'))
const VehicleProfile = React.lazy(()=> import('./components/VehicleProfile.jsx'))
import VehicleMaintenanceLogModal from './components/modals/VehicleMaintenanceLogModal.jsx'
import VehicleTripModal from './components/modals/VehicleTripModal.jsx'


// Drivers
const DriversLogbook = React.lazy(() => import('./views/Driver/logbook/DriversLogBook.js'))
const Trips = React.lazy(() => import('./views/Driver/tripdetails/Trips.js'))
const DriverExpense = React.lazy(() => import('./views/Driver/expenses/DriverExpense.js'))
const Cash = React.lazy(() => import('./views/Driver/cash/Cash.js'))

// Supervisor
const Trip = React.lazy(() => import('./views/Supervisor/trip/Trip.jsx'))
const VehicleExpenses = React.lazy(
  () => import('./views/Supervisor/vehicle-expenses/VehicleExpenses.js'),
)
const LeaveRequests = React.lazy(() => import('./views/Supervisor/leave-request/LeaveRequests.jsx'))

const VehicleDriverBills = React.lazy(
  () => import('./views/Supervisor/billing/VehicleDriverBills.js'),
)
const ComDetails = React.lazy(() => import('./views/Supervisor/company-details/ComDetails.js'))
const SelectedCompDetails = React.lazy(() => import('./views/Supervisor/company-details/SelectedCompDetails.js'))
const BranchDetails = React.lazy(() => import('./views/Supervisor/company-details/BranchDetails.js'))

// Expenses Management
const PurchaseParts = React.lazy(
  () => import('./views/Expenses-Management/purchase-parts/PurchacePartsBill.js'),
)
const DriverExpenses = React.lazy(
  () => import('./views/Expenses-Management/driver-expenses/DriverExpensesBill.js'),
)
const VehicleExpensesBill = React.lazy(
  () => import('./views/Expenses-Management/vehicle-expenses/VehicleExpensesBill.js'),
)
const Bills = React.lazy(() => import('./views/Expenses-Management/bill-expenses/Bills.js'))
const Invoice = React.lazy(() => import('./views/Expenses-Management/accounts/Invoice.js'))
const LR = React.lazy(() => import('./views/Expenses-Management/LR/Lr.jsx'))
// const TyreDetails =React.lazy(()=> import('./views/Expenses-Management/driver-expenses/TyreDetails.js'))

// Tyre Management
const TyreInventory  = React.lazy(() => import('./views/Tyre-Management/TyreInventory.js'))
const DetailedPage = React.lazy(() => import('./views/Tyre-Management/DetailedPage.js'))
const TyreShowDoc = React.lazy(() => import('./views/Tyre-Management/TyreShowDoc.js'))

// Road Side Assistance
const ExpenseSheet = React.lazy(
  () => import('./views/road-side-assistance/expense-sheet/total-expenses/TotalExpenses.js'),
)
const BudgetAllocation = React.lazy(
  () => import('./views/road-side-assistance/expense-sheet/budget-allocation/BudgetAllocation.jsx'),
)

// Help and Support
const HelpAndSupport = React.lazy(() => import('./views/pages/help-&-support/HelpAndSupport.js'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

// DriverExperts
const DriverExp = React.lazy(() => import('./views/DriverExpert/DriverExp.js'))
const DriverProfile = React.lazy(() => import('./views/DriverExpert/DriverProfile.js'))
const AttendanceDetails = React.lazy(() => import('./views/DriverExpert/components/attendance/AttendanceDetails.js'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },

  /**VEHICLE */
  { path: '/Vehicle', name: 'Vahicle', element: Vehicle },
  {path: 'VehicleProfile/:id' , name: 'VehicleProfile', element: VehicleProfile},
  {path: 'VehicleProfile/:id/maintenancelog', name: 'Maintenanace Log', element: VehicleMaintenanceLogModal},
  {path: 'VehicleProfile/:id/tripinfo', name: 'Trip Info', element: VehicleTripModal},
  {path: 'VehicleProfile/:id/tyredetails',name: 'Detailed Page', element: DetailedPage},

  /**DRIVER */

  { path: '/DriversLogBook', name: 'Driver Logbook', element: DriversLogbook },
  { path: '/cash', name: 'Cash', element: Cash },
  { path: '/DriverExpense', name: 'Driver Expense', element: DriverExpense },
  { path: '/Trips', name: 'Trips', element: Trips },

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
