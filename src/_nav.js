import React from 'react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { LayoutDashboard, UserRound, Handshake, ReceiptText, Car } from 'lucide-react'
import { MdOutlineSupervisorAccount } from 'react-icons/md'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: (
      <LayoutDashboard
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
      />
    ),
  },
  {
    component: CNavTitle,
    name: 'Maintenance',
  },

  // VEHICLE

  {
    component: CNavItem,
    name: 'Vehicle',
    to: '/Vehicle',
    icon: (
      <Car
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
      />
    ),
  },

  // DRIVERS
  {
    component: CNavItem,
    name: 'Drivers',
    to: '/DriverExp',
    icon: (
      <UserRound
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
      />
    ),
  },
  //
  // {
  //   component: CNavGroup,
  //   name: 'Drivers',
  //   to: '/Drivers',
  //   icon: (
  // <UserRound
  //   className="nav-icon"
  //   style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
  // />
  //   ),
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Log Book',
  //       to: '/DriversLogBook',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Expense',
  //       to: '/DriverExpense',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Trips',
  //       to: '/Trips',
  //     },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Carousel',
  //     //   to: '/base/carousels',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Collapse',
  //     //   to: '/base/collapses',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'List group',
  //     //   to: '/base/list-groups',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Navs & Tabs',
  //     //   to: '/base/navs',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Pagination',
  //     //   to: '/base/paginations',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Placeholders',
  //     //   to: '/base/placeholders',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Popovers',
  //     //   to: '/base/popovers',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Progress',
  //     //   to: '/base/progress',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Spinners',
  //     //   to: '/base/spinners',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Tables',
  //     //   to: '/base/tables',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Tabs',
  //     //   to: '/base/tabs',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Tooltips',
  //     //   to: '/base/tooltips',
  //     // },
  //   ],
  // },

  // SUPERVISOR
  {
    component: CNavGroup,
    name: 'Supervisor',
    to: '/buttons',
    icon: (
      <MdOutlineSupervisorAccount
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px' }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: 'Trip',
        to: '/Trip',
      },
      {
        component: CNavItem,
        name: 'Leave Requests',
        to: '/LeaveRequests',
      },
      {
        component: CNavItem,
        name: 'Vehicle Expenses',
        to: '/VehicleExpenses',
      },
      {
        component: CNavItem,
        name: 'Bill of all Vehicles & Drivers',
        to: '/VehicleDriverBills',
      },
      {
        component: CNavItem,
        name: 'Company details',
        to: '/ComDetails',
      },
    ],
  },

  // EXPENSES MANAGEMENT
  {
    component: CNavGroup,
    name: 'Expenses Management',
    icon: (
      <ReceiptText
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: 'Purchase Parts',
        to: '/PurchacePartsBill',
      },
      {
        component: CNavItem,
        name: 'Driver Expenses',
        to: '/DriverExpenseBill',
      },
      {
        component: CNavItem,
        name: 'Vehicle Expenses',
        to: '/VehicleExpensesBill',
      },
      {
        component: CNavItem,
        name: 'Bill Expenses',
        to: '/Bills',
      },
      {
        component: CNavItem,
        name: 'Invoice',
        to: '/Invoice',
      },
      {
        component: CNavItem,
        name: 'LR',
        to: '/LR',
      },
      // {
      //   component: CNavItem,
      //   name: 'Input Group',
      //   to: '/forms/input-group',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Floating Labels',
      //   to: '/forms/floating-labels',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Layout',
      //   to: '/forms/layout',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Validation',
      //   to: '/forms/validation',
      // },
    ],
  },

  // ROAD SIDE ASSISTANCE
  {
    component: CNavGroup,
    name: 'Road Side Assistance',
    icon: (
      <Handshake
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
      />
    ),
    items: [
      // {
      //   component: CNavItem,
      //   name: 'Breakdown Assistance',
      //   to: '/BreakdownAssis',
      // },
      {
        component: CNavItem,
        name: 'Total Expenses',
        to: '/TotalExpenses',
      },
      {
        component: CNavItem,
        name: 'Budget Allocation',
        to: '/BudgetAllocation',
      },
    ],
  },

  // {
  //   component: CNavGroup,
  //   name: 'Expense Sheet',
  //   icon: (
  //     <ReceiptText
  //       className="nav-icon"
  //       style={{
  //         color: '#ec7426',
  //         marginRight: '10px',
  //         fill: 'none',
  //         pointerEvents: 'none',
  //       }}
  //     />
  //   ),
  //   items: [],
  // },

  // {
  //   component: CNavGroup,
  //   name: 'Notifications',
  //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Alerts',
  //       to: '/notifications/alerts',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Badges',
  //       to: '/notifications/badges',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Modal',
  //       to: '/notifications/modals',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Toasts',
  //       to: '/notifications/toasts',
  //     },
  //   ],
  // },
]

export default _nav
