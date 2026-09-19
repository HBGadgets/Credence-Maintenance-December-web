import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getSupervisorsApi } from './data/supervisorMasterData'
import SupervisorPermissionsModal from './SupervisorPermissionsModal'
import LoaderBus from '../../components/Loader3/LoaderBus'

const SupervisorPermissionsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: supervisorList = [], isLoading } = useQuery({
    queryKey: ['supervisorMasterList'],
    queryFn: getSupervisorsApi,
    staleTime: 1000 * 60 * 10,
  })

  const supervisor = supervisorList.find((s) => s.id === id) || { id, name: 'Supervisor' }

  if (isLoading) {
    return <LoaderBus />
  }

  return (
    <SupervisorPermissionsModal
      visible={true}
      supervisor={supervisor}
      onClose={() => navigate('/SupervisorMaster')}
      onSuccess={() => navigate('/SupervisorMaster')}
    />
  )
}

export default SupervisorPermissionsPage
