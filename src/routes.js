import { element } from 'prop-types'
import React from 'react'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Vehicle
const Vehicle = React.lazy(() => import('./views/vehicle/Vehicle.jsx'))
const VehicleProfile = React.lazy(() => import('./views/vehicle/VehicleProfile.jsx'))
const VehicleExpenses = React.lazy(() => import('./views/vehicle/VehicleExpenses.jsx'))
const VehicleTrips = React.lazy(() => import('./views/vehicle/VehicleTrips.jsx'))
const ManageTyre = React.lazy(() => import('./views/vehicle/TyreSystem/ManageTyre.jsx'))
const Fuelsystem = React.lazy(() => import('./views/vehicle/FuelSystem/Fuelsystem.jsx'))
const Servicelist = React.lazy(() => import('./views/vehicle/ServicesChecklist/Servicelist.jsx'))
const InpectionList = React.lazy(() => import('./views/vehicle/VehicleInpection/InpectionList.jsx'))
const AllVehicleInpection = React.lazy(() => import('./views/Supervisor/vehicleinpections/AllVehicleInpection.jsx'))
const DocumentAlert = React.lazy(() => import('./views/vehicle/AlertDoc/DocumentAlert.jsx'))

// Supervisor
const Trip = React.lazy(() => import('./views/Supervisor/trip/Trip.jsx'))
const SubTrips = React.lazy(() => import('./views/Supervisor/trip/componets/SubTripMain.jsx'))
const DriverSalary = React.lazy(() => import('./views/Supervisor/driver-salary/DriverSalary.jsx'))
const LeaveRequests = React.lazy(() => import('./views/Supervisor/leave-request/LeaveRequests.jsx'))
const CurrentAttendence = React.lazy(
  () => import('./views/Supervisor/attendence/CurrentAttendence.jsx'),
)

const TableSubTrip = React.lazy(() => import('./views/Supervisor/trip/componets/TableSubTrip.jsx'))

const AllDailyLogbook = React.lazy(() => import('./views/Supervisor/alldailylog/AllDailyLogbook.jsx'))

const AnalayisInpection = React.lazy(() => import('./views/Supervisor/vehicleinpections/components/AnalayisInpection.jsx'))

const AllVehicleServicesData = React.lazy(() => import('./views/Supervisor/allvehicleserviceslist/AllVehicleServicesData.jsx'))

// Expenses Management

const DriverExpenses = React.lazy(
  () => import('./views/Expenses-Management/driver-expenses/DriverExpensesBill.jsx'),
)
const VehicleExpensesBill = React.lazy(
  () => import('./views/Expenses-Management/vehicle-expenses/VehicleExpensesBill.jsx'),
)
const LR = React.lazy(() => import('./views/Expenses-Management/LR/Lr.jsx'))


// Road Side Assistance
const ExpenseSheet = React.lazy(
  () => import('./views/road-side-assistance/expense-sheet/total-expenses/TotalExpenses.js'),
)
const BudgetAllocation = React.lazy(
  () => import('./views/road-side-assistance/expense-sheet/budget-allocation/BudgetAllocation.jsx'),
)

const ServiceCall = React.lazy(() => import('./views/road-side-assistance/asstiance/ServiceCall.jsx'))

const RoadSideAssistance = React.lazy(() => import('./views/road-side-assistance/roadside/RoadSideAssistance.jsx'))

// Help and Support
const HelpAndSupport = React.lazy(() => import('./views/pages/help-&-support/HelpAndSupport.js'))
const ChatBot = React.lazy(() => import('./views/pages/chatbot/ChatBot.js'))

// DriverExperts
const DriverExp = React.lazy(() => import('./views/DriverExpert/DriverExp.jsx'))
const DriverProfile = React.lazy(() => import('./views/DriverExpert/DriverProfile.jsx'))
const Attendance = React.lazy(
  () => import('./views/DriverExpert/components/attendance/Attendance.jsx'),
)

const ExpensesList = React.lazy(
  () => import('./views/DriverExpert/components/expenses/ExpensesList.jsx'),
)
const LogsDriver = React.lazy(
  () => import('./views/DriverExpert/components/logbook/LogsDriver.jsx'),
)
const TripLogs = React.lazy(() => import('./views/DriverExpert/components/trip/TripLogs.jsx'))
const ViewAllSalary = React.lazy(
  () => import('./views/DriverExpert/components/salary/ViewAllSalary.jsx'),
)

const DriverStatus = React.lazy(() => import('./views/DriverExpert/components/status/DriverStatus.jsx'))

const DriverLocation = React.lazy(() => import('./views/DriverExpert/components/driverlocation/DriverLocation.jsx'))

// Profile Section
const ProfileSection = React.lazy(() => import('./views/Profile/ProfileSection.jsx'))

const routes = [
  // Dashboard
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  /**VEHICLE */
  { path: '/Vehicle', name: 'Vehicles', element: Vehicle },
  { path: 'VehicleProfile/:id', name: 'VehicleProfile', element: VehicleProfile },
  {
    path: 'VehicleProfile/:id/VehicleExpenses',
    name: 'Vehicle Expenses',
    element: VehicleExpenses,
  },
  { path: 'VehicleProfile/:id/VehicleTrips', name: 'Vehicle Trips', element: VehicleTrips },
  { path: 'VehicleProfile/:id/ManageTyre', name: 'Tyres System', element: ManageTyre },
  { path: 'VehicleProfile/:id/Fuelsystem', name: 'Fuel System', element: Fuelsystem },
  { path: 'VehicleProfile/:id/Servicelist', name: 'Service List', element: Servicelist },
  { path: 'VehicleProfile/:id/InpectionList', name: 'Vehicle Inpection', element: InpectionList },
  { path: '/DocumentAlert', name: 'Document Expering', element: DocumentAlert },

  /**SUPERVISOR */

  { path: '/Trip', name: 'Trips', element: Trip },
  { path: '/SubTrips/:id', name: 'Sub Trips', element: SubTrips },
  { path: '/Salary', name: 'Drivers Salary', element: DriverSalary },
  { path: '/Attendence', name: 'Driver Attendence Mark', element: CurrentAttendence },
  { path: '/LeaveRequests', name: 'Leave Requests', element: LeaveRequests },
  { path: '/TableSubTrip/:id', name: 'Sub Trips Table', element: TableSubTrip },
  { path: '/AllDailyLogbook', name: 'All Drives LogBooks', element: AllDailyLogbook },
  { path: '/AllVehicleInpection', name: 'All Vehicle Inpections', element: AllVehicleInpection },
  { path: '/AnalayisInpection/:id', name: 'All Analayis Vehicle Inpection', element: AnalayisInpection },
  { path: '/AllVehicleServicesData', name: 'All Vehicle Service Data', element: AllVehicleServicesData },

  /**EXPENSES MANAGEMENT */

  { path: '/DriverExpenseBill', name: 'All Drivers Expenses', element: DriverExpenses },
  { path: '/VehicleExpensesBill', name: 'All Vehicles Expenses', element: VehicleExpensesBill },
  { path: '/LR', name: 'Lorry Recipt', element: LR },


  /**ROAD SIDE ASSISTANCE */
  { path: '/TotalExpenses', name: 'Total Expenses', element: ExpenseSheet },
  { path: '/BudgetAllocation', name: 'Budget Allocation', element: BudgetAllocation },
  { path: '/RoadSideAssistance', name: 'Roadside Assistances Services', element: RoadSideAssistance },


  //new
  { path: '/ServiceCall', name: 'Roadside Assitance Services', element: ServiceCall },

  /**HELP AND SUPPORT */
  { path: '/HelpAndSupport', name: 'Help And Support', element: HelpAndSupport },
  { path: '/ChatBot', name: 'Chat Bot', element: ChatBot },

  //  /**DRIVER EXPERTS */
  { path: '/DriverExp', name: 'DriverExperts', element: DriverExp },
  { path: '/DriverProfile/:id', name: 'Driver Profile', element: DriverProfile },
  { path: '/DriverAttendance/:id', name: 'Driver Attendance', element: Attendance },
  { path: '/ExpensesList/:id', name: 'Driver Expenses', element: ExpensesList },
  { path: '/LogsDriver/:id', name: 'Logs Driver', element: LogsDriver },
  { path: '/TripLogs/:id', name: 'Trip Logs', element: TripLogs },
  { path: '/ViewAllSalary/:id', name: 'Salary', element: ViewAllSalary },
  { path: '/DriverStatus', name: 'Driver Status', element: DriverStatus },
  { path: '/DriverLocation', name: 'Driver Attendance Location', element: DriverLocation },

  // Profile Section
  { path: '/ProfileSection', name: 'Profile', element: ProfileSection },
]

export default routes
