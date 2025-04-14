import React, { useState } from 'react'
import UpdateCompanyModal from './component/UpdateCompanyInfo'
import CompanyProfileCard from './component/CompanyProfileCard'

const ProfileSection = () => {
  const [modalVisible, setModalVisible] = useState(false)

  const [companyData, setCompanyData] = useState({
    name: 'TechCorp Solutions',
    address: '123 Business Park, Tech Street, Bangalore 560001',
    gstin: '29ABCDE1234F1Z5',
    officeNumber: '080-12345678',
    mobileNumber: '+91 98765 43210',
    website: 'www.techcorp.com',
  })

  const handleUpdate = (updated) => {
    setCompanyData(updated)
    setModalVisible(false)
  }

  return (
    <>
      <CompanyProfileCard company={companyData} onEdit={() => setModalVisible(true)} />

      <UpdateCompanyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        initialData={companyData}
        onSave={handleUpdate}
      />
    </>
  )
}

export default ProfileSection
