import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { LayoutDashboard, UserRound, Handshake, ReceiptText } from 'lucide-react'
import { MdOutlineSupervisorAccount } from 'react-icons/md'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <LayoutDashboard className="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Maintenance',
  },

  // DRIVERS
  {
    component: CNavGroup,
    name: 'Drivers',
    to: '/Drivers',
    icon: <UserRound className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Log Book',
        to: '/LogBook',
      },
      {
        component: CNavItem,
        name: 'Expense',
        to: '/DriverExpense',
      },
      {
        component: CNavItem,
        name: 'Cash',
        to: '/Cash',
      },
      // {
      //   component: CNavItem,
      //   name: 'Carousel',
      //   to: '/base/carousels',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Collapse',
      //   to: '/base/collapses',
      // },
      // {
      //   component: CNavItem,
      //   name: 'List group',
      //   to: '/base/list-groups',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Navs & Tabs',
      //   to: '/base/navs',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Pagination',
      //   to: '/base/paginations',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Placeholders',
      //   to: '/base/placeholders',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Popovers',
      //   to: '/base/popovers',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Progress',
      //   to: '/base/progress',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Spinners',
      //   to: '/base/spinners',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Tables',
      //   to: '/base/tables',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Tabs',
      //   to: '/base/tabs',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Tooltips',
      //   to: '/base/tooltips',
      // },
    ],
  },

  // SUPERVISOR
  {
    component: CNavGroup,
    name: 'Supervisor',
    to: '/buttons',
    icon: <MdOutlineSupervisorAccount size={30} className="nav-icon" />,
    items: [
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
        name: 'Sub details',
        to: '/SubDetails',
      },
    ],
  },

  // EXPENSES MANAGEMENT
  {
    component: CNavGroup,
    name: 'Expenses Management',
    icon: <ReceiptText className="nav-icon" />,
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
    icon: <Handshake className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Breakdown Assistance',
        to: '/BreakdownAssis',
      },
      {
        component: CNavItem,
        name: 'Repair and Service',
        to: '/RepairServices',
      },
    ],
  },

  // {
  //   component: CNavItem,
  //   name: 'Road Side Assistance',
  //   to: '/RoadSideAssistance',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
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
