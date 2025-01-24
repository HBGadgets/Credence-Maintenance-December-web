/* eslint-disable prettier/prettier */

// ##############################################################################################
// NOTE : import this file in dashboard and call the function fetchMaintenanceData.
// ##############################################################################################

const { default: axios } = require('axios')

// Extract the token from the URL
const urlParams = new URLSearchParams(window.location.search)
const token = urlParams.get('token')

if (token) {
  // Remove the token from the URL for security (avoids exposing it in browser history)
  window.history.replaceState({}, document.title, window.location.pathname)

  // send the token to the backend
  fetchMaintenanceData(token)
} else {
  console.log('Token not found in URL')
}

// send the token to the backend
const fetchMaintenanceData = async (token) => {
  try {
    const response = await axios.post(
      'https://credence-maintenance-backend.onrender.com/api/data',
      { token },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const data = response
    console.log(data)
  } catch (error) {
    console.log('Error: Fetching Data', error.message)
  }
}
