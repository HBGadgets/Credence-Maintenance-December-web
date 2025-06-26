import React from 'react'
import { CheckCircle2 } from 'lucide-react'

const PassInpectionCard = ({ items = [] }) => {
  const passedItems = Object.entries(items)
    .filter(([_, value]) => value.status === 'Pass')
    .map(([key, value]) => ({
      key,
      description: value.description || 'No Issuse in this part',
    }))

  return (
    <div className="border rounded p-4 bg-white">
      <h5 className="text-success fw-bold mb-1">
        <CheckCircle2 size={18} className="me-1 mb-1" />
        Passed Items ({passedItems.length})
      </h5>
      <p className="text-muted mb-3" style={{ fontSize: '14px' }}>
        These items have been inspected and are in good working condition
      </p>

      <div className="row g-3">
        {passedItems.map((item, index) => (
          <div className="col-md-4" key={index}>
            <div
              className="p-3 rounded bg-success bg-opacity-10 border border-success d-flex flex-column justify-content-between"
              style={{ minHeight: '90px' }}
            >
              <div className="fw-semibold text-dark">{formatLabel(item.key)}</div>
              <div className="text-muted" style={{ fontSize: '14px' }}>
                {item.description}
              </div>
              <div className="mt-2">
                <span className="badge bg-success d-flex align-items-center gap-1">
                  <CheckCircle2 size={14} /> Passed
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Optional utility to format keys like "windShieldWasherFluid" => "Windshield Washer Fluid"
const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .replace('Stairing', 'Steering') // fix typos if needed

export default PassInpectionCard
