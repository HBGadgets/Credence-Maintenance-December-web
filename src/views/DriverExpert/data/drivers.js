export const drivers = Array.from({ length: 100 }, (_, index) => {
  const id = (index + 1).toString()
  const name = `Driver ${index + 1}`
  const contactNumber = `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`
  const email = `driver${index + 1}@example.com`
  const licenseNumber = `DL${Math.floor(10000000 + Math.random() * 90000000)}`
  const aadharNumber = `1234 5678 ${Math.floor(1000 + Math.random() * 9000)}`
  const password = '123456'
  const profileImage = `https://images.unsplash.com/photo-${Math.floor(1000000000 + Math.random() * 9000000000)}?w=400`
  const documents = {
    aadharCard: `https://images.unsplash.com/photo-${Math.floor(1000000000 + Math.random() * 9000000000)}?w=800`,
    drivingLicense: `https://images.unsplash.com/photo-${Math.floor(1000000000 + Math.random() * 9000000000)}?w=800`,
    tpPass: `https://images.unsplash.com/photo-${Math.floor(1000000000 + Math.random() * 9000000000)}?w=800`,
  }

  return {
    id,
    name,
    contactNumber,
    email,
    licenseNumber,
    aadharNumber,
    password,
    profileImage,
    documents,
  }
})
