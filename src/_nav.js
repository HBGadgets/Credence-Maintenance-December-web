import React from 'react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { LayoutDashboard, LucideClipboardList } from 'lucide-react'
import { LuMessageSquareQuote, LuReceiptText } from 'react-icons/lu'
import { PiUserListBold, PiWarehouseDuotone } from 'react-icons/pi'
import { HiOutlineTicket } from 'react-icons/hi2'
import { IoReceiptOutline } from 'react-icons/io5'
import { TbBuildingWarehouse } from 'react-icons/tb'

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
    icon: <PiUserListBold className="nav-icon" style={{ color: '#ec7426', marginRight: '10px' }} />,
    items: [
      {
        component: CNavItem,
        name: 'Drivers',
        to: '/DriverExp',
        permission: 'masters.driver',
      },
      {
        component: CNavItem,
        name: 'Vehicle',
        to: '/Vehicle',
        permission: 'masters.vehicle',
      },
      {
        component: CNavItem,
        name: 'Trips',
        to: '/Trip',
        permission: 'masters.trip',
      },
      {
        component: CNavItem,
        name: 'Company Name',
        to: '/CompanyName',
        permission: 'masters.company',
      },
      {
        component: CNavItem,
        name: 'Material Owner',
        to: '/MaterialOwner',
        permission: 'masters.materialOwner',
      },
      {
        component: CNavItem,
        name: 'Employees',
        to: '/Worker',
        permission: 'masters.employee',
      },
      {
        component: CNavItem,
        name: 'Consignor',
        to: '/Consignor',
        permission: 'masters.consignor',
      },
      {
        component: CNavItem,
        name: 'Consignee',
        to: '/Consignee',
        permission: 'masters.consignee',
      },
      {
        component: CNavItem,
        name: 'Driver Attendence Mark',
        to: '/Attendence',
        permission: 'masters.attendance',
      },
      {
        component: CNavItem,
        name: 'Drivers Leave Requests',
        to: '/LeaveRequests',
        permission: 'masters.leave',
      },
    ],
  },

  // EXPENSES MANAGEMENT
  {
    component: CNavGroup,
    name: 'Reports ',
    icon: (
      <LucideClipboardList
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: 'All Drivers Attendence',
        to: '/AllDriverAttendence',
        permission: 'masters.attendance',
      },
      {
        component: CNavItem,
        name: 'Drivers Salary',
        to: '/Salary',
        permission: 'reports.salary',
      },
      {
        component: CNavItem,
        name: 'All Drivers Expenses',
        to: '/DriverExpenseBill',
        permission: 'reports.driverExp',
      },
      {
        component: CNavItem,
        name: 'All Vehicles Expenses',
        to: '/VehicleExpensesBill',
        permission: 'reports.vehicleExp',
      },
      {
        component: CNavItem,
        name: 'All Drivers Logbooks',
        to: '/AllDailyLogbook',
        permission: 'reports.dailyLog',
      },
      {
        component: CNavItem,
        name: 'All Vehicle Service Log',
        to: '/AllVehicleServicesData',
        permission: 'reports.serviceLog',
      },
      {
        component: CNavItem,
        name: 'All Vehicle Inpections',
        to: '/AllVehicleInpection',
        permission: 'reports.inspection',
      },
      {
        component: CNavItem,
        name: 'Daily Trips Reading',
        to: '/DailyTrips',
        permission: 'dailyTrips',
      },
    ],
  },

  // Good Recipt
  {
    component: CNavGroup,
    name: 'Good Recipts',
    icon: (
      <LuReceiptText
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: 'Good Recipt Rail',
        to: '/GrByRail',
        permission: 'goodReceipts.rail',
      },
      {
        component: CNavItem,
        name: 'Good Recipt Road',
        to: '/GrByRoad',
        permission: 'goodReceipts.road',
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
        name: 'Transport Pass Recipt',
        to: '/GodownLr',
        permission: 'transportPass.receipt',
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
        name: 'Product List',
        to: '/ProductList',
        permission: 'warehouse.product',
      },
      {
        component: CNavItem,
        name: 'Rail Head',
        to: '/RailHead',
        permission: 'warehouse.railHead',
      },
      {
        component: CNavItem,
        name: 'Warehouses Inventory',
        to: '/Godown',
        permission: 'warehouse.inventory',
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

  // Help and Supports
  {
    component: CNavGroup,
    name: 'Support',
    icon: (
      <HiOutlineTicket
        className="nav-icon"
        style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: 'Tickets Raised',
        to: '/RaiseTicket',
        permission: 'tickets.raise',
      },
      {
        component: CNavItem,
        name: 'Tickets Answered',
        to: '/AnsweredTicket',
        role: 'superadmin',
        permission: 'tickets.answer',
      },
      {
        component: CNavItem,
        name: 'Chat Box',
        to: '/ChatBot',
        permission: 'chat.read',
        icon: (
          <LuMessageSquareQuote
            className="nav-icon"
            style={{ color: '#ec7426', marginRight: '10px', fill: 'none', pointerEvents: 'none' }}
          />
        ),
      },
    ],
  },
]

export default _nav
