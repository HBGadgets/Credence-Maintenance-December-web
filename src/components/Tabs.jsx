import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Nav, Tab, Row, Col } from 'react-bootstrap'

function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(parseInt(k))}>
      <Row>
        <Col xs={12}>
          {/* Tab Headers */}
          <Nav variant="tabs" className="border-bottom">
            {tabs.map((tab, index) => (
              <Nav.Item key={index}>
                <Nav.Link
                  eventKey={index}
                  className="px-4 fw-medium"
                  style={{
                    color: activeTab === index ? '#0a58ca' : '#6c757d', // Dark blue for active
                    border: 'none',
                    borderBottom: activeTab === index ? '2px solid #0a58ca' : 'none', // Dark blue underline
                    marginBottom: '-1px',
                    padding: '12px 20px',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== index) {
                      e.currentTarget.style.color = '#0a58ca'
                      e.currentTarget.style.backgroundColor = '#f8f9fa'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== index) {
                      e.currentTarget.style.color = '#6c757d'
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  {tab.label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {/* Tab Content */}
          <Tab.Content className="mt-3">
            {tabs.map((tab, index) => (
              <Tab.Pane key={index} eventKey={index}>
                <div
                  className="border rounded mt-3"
                  style={{
                    paddingTop: '15px',
                    paddingBottom: '30px',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    backgroundColor: 'white',
                    minHeight: '200px',
                  }}
                >
                  {tab.content}
                </div>
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  )
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    }),
  ).isRequired,
}

export default Tabs
