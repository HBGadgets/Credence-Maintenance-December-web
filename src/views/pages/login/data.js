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
      mode: 'cors',
      credentials: 'include',
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,mr;q=0.7',
        authorization: formattedToken,
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        priority: 'u=1, i',
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

