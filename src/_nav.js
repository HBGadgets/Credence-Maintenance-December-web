import React from 'react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { LayoutDashboard, UserRound, Handshake, ReceiptText, Car, Headset } from 'lucide-react'
import { MdOutlineSupervisorAccount, MdOutlineSupportAgent } from 'react-icons/md'


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
        name: 'Trips',
        to: '/Trip',
      },
      {
        component: CNavItem,
        name: 'All Drivers Logbooks',
        to: '/AllDailyLogbook',
      },
      {
        component: CNavItem,
        name: 'All Vehicle Service Log',
        to: '/AllVehicleServicesData',
      },
      {
        component: CNavItem,
        name: 'All Vehicle Inpections',
        to: '/AllVehicleInpection',
      },
      {
        component: CNavItem,
        name: 'Driver Attendence Mark',
        to: '/Attendence'
      },
      {
        component: CNavItem,
        name: 'Drivers Leave Requests',
        to: '/LeaveRequests',
      },
      // {
      //   component: CNavItem,
      //   name: 'Drivers Salary',
      //   to: '/Salary',
      // },

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
        name: 'All Drivers Expenses',
        to: '/DriverExpenseBill',
      },
      {
        component: CNavItem,
        name: 'All Vehicles Expenses',
        to: '/VehicleExpensesBill',
      },
      {
        component: CNavItem,
        name: 'Drivers Salary',
        to: '/Salary',
      },
      {
        component: CNavItem,
        name: 'LR',
        to: '/LR',
      },
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
    items: [,
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

  // Help and Supports
  {
    component: CNavGroup,
    name: 'Helps & Supports',
    icon: (
      <Headset
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
      />
    ),
    items: [,
      {
        component: CNavItem,
        name: 'Tickets Raised',
        to: '/HelpAndSupport',
      },
      {
        component: CNavItem,
        name: 'Chat Bot',
        to: '/ChatBot',
      },
    ],
  },



]

export default _nav
