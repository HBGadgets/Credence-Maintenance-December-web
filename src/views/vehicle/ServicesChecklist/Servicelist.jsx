import React from 'react'
import { useParams } from 'react-router-dom'

const ServiceList = () => {
  const { id } = useParams()
  console.log(id)
  return (
    <div>
      ServiceList <span className="fw-bold fs-4">{id || 'N/A'}</span>
    </div>
  )
}

export default ServiceList
