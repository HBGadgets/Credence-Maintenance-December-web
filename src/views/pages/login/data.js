import axios from 'axios'
import Cookies from 'js-cookie'

export const LoginUser = async (data) => {
  try {
    // Try first login API: VITE_API_CREDENCE_BACKEND
    // Payload: { username, password }
    const { data: response } = await axios.post(
      `${import.meta.env.VITE_API_CREDENCE_BACKEND}/auth/login`,
      data,
    )
    return response
  } catch (error) {
    try {
      // If the first fails, try the worker login API: VITE_API_URL
      // Payload for worker login: { phone: username, password }
      const secondPayload = {
        phone: data.username,
        password: data.password,
      }
      const { data: response } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/worker/login`,
        secondPayload,
      )
      return response
    } catch (secondError) {
      // If both fail, throw the error
      throw secondError.response?.data || secondError || error.response?.data || error
    }
  }
}

export const fetchUserActiveStatus = async () => {
  const token = Cookies.get('crdnsMaintToken')

  if (!token) {
    return null
  }

  const backendUrl =
    import.meta.env.VITE_API_CREDENCE_BACKEND
  const endpoint = `${backendUrl.replace(/\/+$/, '')}/auth/user/active-status`
  const formattedToken = `Bearer ${token}`

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        authorization: formattedToken,
      },
    })

    if (!response.ok) {
      console.warn(`User active-status check returned status ${response.status}`)
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching user active status:', error)
    return null
  }
}

