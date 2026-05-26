/* eslint-disable prettier/prettier */
import React from 'react'
import { CTab, CTabContent, CTabList, CTabPanel, CTabs } from '@coreui/react'
import PropTypes from 'prop-types'

function Tabs({ tabs }) {
  return (
    <CTabs activeItemKey="1">
      <CTabList variant="underline-border" className="text-center">
        {tabs.map((tab, index) => (
          <CTab
            key={index}
            aria-controls={`${tab.label}-tab-pane`}
            itemKey={(index + 1).toString()}
            className="px-4"
          >
            {tab.label}
          </CTab>
        ))}
      </CTabList>
      <CTabContent>
        {tabs.map((tab, index) => (
          <CTabPanel
            key={index}
            aria-labelledby={`${tab.label}-tab-pane`}
            itemKey={(index + 1).toString()}
            className="border mt-3 rounded"
            style={{ paddingTop: '15px', paddingBottom: '30px' }}
          >
            {tab.content}
          </CTabPanel>
        ))}
      </CTabContent>
    </CTabs>
  )
}

Tabs.propTypes = {
  tabs: PropTypes.array,
}

export default Tabs
