import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ImMeter } from 'react-icons/im'
import { BiTrip } from 'react-icons/bi'
import { LucideDroplets } from 'lucide-react'
import { RiMoneyRupeeCircleLine } from 'react-icons/ri'
import DateRangePicker from '../../components/DateRangePicker'
import FuelAnalayis from './components/FuelAnalayis'
import { Card } from 'react-bootstrap'
import FuelRecords from './components/FuelTable'
import FuelCards from './components/FuelCards'
import { useQuery } from '@tanstack/react-query'
import { getFuelSystemData } from '../data/VehicleListData'
import LoaderBus from '../../../components/Loader3/LoaderBus'

const Fuelsystem = () => {
  const { id } = useParams()
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  // fetch api
  const {
    data: fuelData = {
      name: '',
      averageFuelEfficiency: '0',
      totalDistance: 0,
      totalFuelConsumption: 0,
      totalFuelExpense: 0,
      dailyRecords: [],
    },
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['fuelSystemData', id, selectedMonth],
    queryFn: () => getFuelSystemData(id, selectedMonth),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(id && selectedMonth),
    retry: 1,
    refetchOnWindowFocus: false,
  })

  // auto-refetch when month changes
  useEffect(() => {
    if (id && selectedMonth) {
      refetch()
    }
  }, [selectedMonth])

  const {
    name = 'N/A',
    averageFuelEfficiency = '0',
    totalDistance = 0,
    totalFuelConsumption = 0,
    totalFuelExpense = 0,
    dailyRecords = [],
  } = fuelData || {}

  return (
    <>
      <div>
        {/* Header Row */}
        <div className="row mb-3">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <span className="fw-bold fs-4">Vehicle Name: {name}</span>
            <div style={{ width: '250px' }}>
              <DateRangePicker
                value={selectedMonth}
                label={false}
                onMonthChange={setSelectedMonth}
              />
            </div>
          </div>
        </div>

        {/* Loading or Error State */}
        {isFetching && (
          <div>
            <LoaderBus />
          </div>
        )}

        {isError && (
          <div className="text-center my-3 text-danger fw-semibold">
            ❌ Failed to load data: {error?.message}
          </div>
        )}

        {/* No Data State */}
        {!isFetching && dailyRecords.length === 0 && (
          <div className="mt-4 text-center text-muted fw-semibold">
            🚫 No fuel data available for {selectedMonth}
          </div>
        )}

        {/* Main Content */}
        {!isFetching && dailyRecords.length > 0 && (
          <>
            {/* Card Row */}
            <div className="row mt-4">
              <div className="col-md-3">
                <FuelCards
                  title="Fuel Efficiency"
                  value={parseFloat(averageFuelEfficiency || 0).toFixed(2)}
                  unit="km/L"
                  icon={ImMeter}
                  iconColor="#0d6efd"
                />
              </div>
              <div className="col-md-3">
                <FuelCards
                  title="Estimated Range"
                  value={(
                    parseFloat(averageFuelEfficiency || 0) * parseFloat(totalFuelConsumption || 0)
                  ).toFixed(0)}
                  unit="km"
                  icon={BiTrip}
                  iconColor="#f40adb"
                />
              </div>
              <div className="col-md-3">
                <FuelCards
                  title="Fuel Consumption"
                  value={totalFuelConsumption}
                  unit="L"
                  icon={LucideDroplets}
                  iconColor="#04fe3e"
                />
              </div>
              <div className="col-md-3">
                <FuelCards
                  title="Fuel Expenses"
                  value={totalFuelExpense}
                  unit="₹"
                  icon={RiMoneyRupeeCircleLine}
                  iconColor="#e69513"
                />
              </div>
            </div>

            {/* Fuel Analytics */}
            <div className="mt-4">
              <Card className="border-1">
                <Card.Header className="bg-secondary text-white fw-semibold">
                  Fuel Analytics Overview
                </Card.Header>
                <Card.Body>
                  <FuelAnalayis records={dailyRecords} />
                </Card.Body>
              </Card>
            </div>

            {/* Fuel Records Table */}
            <FuelRecords records={dailyRecords} />
          </>
        )}
      </div>
    </>
  )
}

export default Fuelsystem
