import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import HeaderInpection from './HeaderInpection'
import InpectionCards from './InpectionCards'
import LoaderBus from '../../../../components/Loader3/LoaderBus'
import { getAllVehicleInpectionApi } from '../../data/data'
import InpectionTable from './InpectionTable'
import PassInpectionCard from './PassInpectionCard'
import { TokenContext } from '../../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'

const AnalayisInpection = () => {
  const { id } = useParams()
  const [inspection, setInspection] = useState(null)

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  useEffect(() => {
    if (!token) return // Don't fetch if token is not ready

    const fetchInspection = async () => {
      try {
        const data = await getAllVehicleInpectionApi(null, token)
        const result = data.find((item) => item.id === id)
        setInspection(result)
      } catch (err) {
        console.error('Error fetching inspection:', err)
      }
    }

    fetchInspection()
  }, [id, token]) // make sure useEffect re-runs if token becomes available

  if (!inspection) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <LoaderBus />
      </div>
    )
  }

  const { inpectionPass, inpectionFail, vehicleName, items = {} } = inspection

  return (
    <div>
      {/* Pass full inspection object to Header */}
      <HeaderInpection inspection={inspection} />

      <div className="mt-4">
        <InpectionCards
          pass={inpectionPass}
          fail={inpectionFail}
          total={Object.keys(items).length}
          vehicleName={vehicleName}
        />
      </div>

      <div className="mt-4">
        <PassInpectionCard items={inspection.items} />
      </div>

      <div className="mt-4">
        <InpectionTable />
      </div>
    </div>
  )
}

export default AnalayisInpection
