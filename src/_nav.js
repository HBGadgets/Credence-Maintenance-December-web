import React from 'react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { LayoutDashboard, LucideClipboardList } from 'lucide-react'
import { LuMessageSquareQuote } from "react-icons/lu";
import { PiUserListBold, PiWarehouseDuotone } from "react-icons/pi";
import { HiOutlineTicket } from "react-icons/hi2";
import { IoReceiptOutline } from "react-icons/io5";
import { LuChartSpline } from "react-icons/lu";
import { TbBuildingWarehouse } from "react-icons/tb";

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


  // SUPERVISOR
  {
    component: CNavGroup,
    name: 'Masters',
    to: '/buttons',
    icon: (
      <PiUserListBold
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px' }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: 'Drivers',
        to: '/DriverExp',
      },
      {
        component: CNavItem,
        name: 'Vehicle',
        to: '/Vehicle',
      },
      {
        component: CNavItem,
        name: 'Company Name',
        to: '/CompanyName',
      },
      {
        component: CNavItem,
        name: 'Trips',
        to: '/Trip',
      },
      {
        component: CNavItem,
        name: 'Employees Details',
        to: '/Worker',
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
    ],
  },

  // EXPENSES MANAGEMENT
  {
    component: CNavGroup,
    name: 'Reports Expenses',
    icon: (
      <LucideClipboardList
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: 'Drivers Salary',
        to: '/Salary',
      },
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
    ],
  },

  // Transport Pass
  {
    component: CNavGroup,
    name: 'Transport Pass',
    icon: (
      <IoReceiptOutline
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: 'TP Pass',
        to: '/LR',
      },
    ],
  },

  // Warehouse
  {
    component: CNavGroup,
    name: 'Warehouse Section',
    icon: (
      <TbBuildingWarehouse
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: 'Warehouses',
        to: '/Godown',
      },
      {
        component: CNavItem,
        name: 'Product List',
        to: '/ProductList',
      },
    ],
  },


  // ROAD SIDE ASSISTANCE
  // {
  //   component: CNavGroup,
  //   name: 'Road Side Assistance',
  //   icon: (
  //     <Handshake
  //       className="nav-icon"
  //       style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
  //     />
  //   ),
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Roadside Services',
  //       to: '/RoadSideAssistance',
  //     },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Total Expenses',
  //     //   to: '/TotalExpenses',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Budget Allocation',
  //     //   to: '/BudgetAllocation',
  //     // },
  //   ],
  // },

  //  Daily Trips KM
  {
    component: CNavGroup,
    name: 'Daily Trips Reading',
    icon: (
      <LuChartSpline
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: 'Daily Logs',
        to: '/DailyTrips',
      },
    ],
  },

  // Help and Supports
  {
    component: CNavGroup,
    name: 'Query Ticket',
    icon: (
      <HiOutlineTicket
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
      />
    ),
    items: [,
      {
        component: CNavItem,
        name: 'Tickets Raised',
        to: '/RaiseTicket',
      },
      {
        component: CNavItem,
        name: 'Tickets Answered',
        to: '/AnsweredTicket',
        role: 'superadmin',
      },
    ],
  },


  {
    component: CNavItem,
    name: 'Chat Box',
    to: '/ChatBot',
    icon: (
      <LuMessageSquareQuote
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
      />
    ),
  },


]

export default _nav
