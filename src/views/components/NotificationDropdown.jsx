import React from 'react'
import { Bell } from 'lucide-react'
import { CBadge, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'

const NotificationDropdown = ({ notifications, onClear, unreadCounts }) => {
  const totalUnread = Object.values(unreadCounts || {}).reduce((a, b) => a + b, 0)

  return (
    <>
      <style>
        {`
          .custom-hover:hover {
            background-color: #f8f9fa;
            color: #333;
            transition: background-color 0.3s ease, color 0.3s ease;
          }
        `}
      </style>

      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 fs-5 pe-0" caret={false}>
          <Bell color="white" className="mx-0" />
          {totalUnread > 0 && (
            <CBadge
              color="danger"
              shape="rounded-pill"
              className="position-absolute top-0 start-100 translate-middle"
              style={{ fontSize: '10px' }}
            >
              {totalUnread}
            </CBadge>
          )}
        </CDropdownToggle>

        <CDropdownMenu className="pt-2" placement="bottom-end" style={{ width: '400px' }}>
          <CDropdownItem
            className="custom-hover"
            onClick={onClear}
            style={{ fontSize: '12px', fontWeight: 'bold', color: 'red' }}
          >
            Clear Notifications
          </CDropdownItem>

          <hr style={{ margin: '0.5rem 0' }} />

          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <CDropdownItem
                key={index}
                className="custom-hover"
                style={{
                  fontSize: '12px',
                  width: '100%',
                  paddingInlineStart: '5px',
                  textWrap: 'wrap',
                  textOverflow: 'ellipsis',
                  cursor: 'pointer',
                  overflowWrap: 'break-word',
                }}
              >
                {notification.message}
              </CDropdownItem>
            ))
          ) : (
            <CDropdownItem style={{ textAlign: 'center', fontSize: '12px' }}>
              No Notification
            </CDropdownItem>
          )}
        </CDropdownMenu>
      </CDropdown>
    </>
  )
}

export default NotificationDropdown
