import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import FuelCards from './components/Fuelcards'
import { ImMeter } from 'react-icons/im'
import { BiTrip } from 'react-icons/bi'
import { LucideDroplets } from 'lucide-react'
import { RiMoneyRupeeCircleLine } from 'react-icons/ri'
import DateRangePicker from '../../components/DateRangePicker'
import FuelAnalayis from './components/Fuelanalayis'
import { Card } from 'react-bootstrap'
import FuelRecords from './components/Fueltable'

const Fuelsystem = () => {
  const { id } = useParams()
  console.log(id)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  return (
    <>
      <div>
        {/* Header Row: ID on left, DateRangePicker on right */}
        <div className="row mb-3">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <span className="fw-bold fs-4">{id || 'N/A'}</span>
            <div style={{ width: '250px' }}>
              <DateRangePicker
                value={selectedMonth}
                label={false}
                onMonthChange={(newMonth) => {
                  if (newMonth !== selectedMonth) {
                    setSelectedMonth(newMonth)
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Card Row */}
        <div className="row mt-4">
          <div className="col-md-3">
            <FuelCards
              title="Fuel Efficiency"
              value={8.2}
              unit="km/L"
              icon={ImMeter}
              iconColor="#0d6efd"
            />
          </div>
          <div className="col-md-3">
            <FuelCards
              title="Estimated Range"
              value={3193}
              unit="km"
              icon={BiTrip}
              iconColor="#f40adb"
            />
          </div>
          <div className="col-md-3">
            <FuelCards
              title="Fuel Consumption"
              value={1162.2}
              unit="L"
              icon={LucideDroplets}
              iconColor="#04fe3e"
            />
          </div>
          <div className="col-md-3">
            <FuelCards
              title="Fuel Expenses"
              value={15000}
              unit="₹"
              icon={RiMoneyRupeeCircleLine}
              iconColor="#e69513"
            />
          </div>
        </div>
        <div className="mt-4">
          <Card className="border-1">
            <Card.Header className="bg-secondary text-white fw-semibold">
              Fuel Analytics Overview
            </Card.Header>
            <Card.Body>
              <FuelAnalayis />
            </Card.Body>
          </Card>
        </div>

        <FuelRecords />
      </div>
    </>
  )
}

export default Fuelsystem
