import axios from 'axios'
import { formatDateToDDMMYYYY } from '../../customhooks/useFormattedDate'
import { useFormattedTime } from '../../customhooks/useFormattedTime'
import { useSplitTimeDate } from '../../customhooks/useSplitTimeDate'

// Global token variable
// const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhcnNoYWwiLCJpZCI6IjY3OWIyNmU5Y2UxOTAzYWMyMjdhNDQ0OSIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NzliMjZlOWNlMTkwM2FjMjI3YTQ0NDkiLCJlbWFpbCI6ImhhcnNoYWxAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxOTY3YjNlNjcxNDQ5ZWU0Y2Q5ZjZhODA2MzE1ZmFjMzpjMjdkM2JlNDNhZWRlODRlYjA1NDQxNGIwYzE4ZDY3OSIsInVzZXJuYW1lIjoiaGFyc2hhbCIsIm1vYmlsZSI6IjEyMzQ1Njc4OTAiLCJncm91cHNBc3NpZ25lZCI6WyI2NzliMjZiOWNlMTkwM2FjMjI3YTQ0MmYiXSwiY3JlYXRlZEJ5IjoiNjcxMzY1M2I2MTNjZjJkMmM1MzJlZDBlIiwic3RhdHVzIjoidHJ1ZSIsIm5vdGlmaWNhdGlvbiI6dHJ1ZSwiZGV2aWNlcyI6dHJ1ZSwiZHJpdmVyIjp0cnVlLCJncm91cHMiOnRydWUsImNhdGVnb3J5IjpmYWxzZSwibW9kZWwiOmZhbHNlLCJ1c2VycyI6dHJ1ZSwicmVwb3J0Ijp0cnVlLCJzdG9wIjp0cnVlLCJ0cmF2ZWwiOnRydWUsImdlb2ZlbmNlIjp0cnVlLCJnZW9mZW5jZVJlcG9ydCI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjpmYWxzZSwiZGlzdGFuY2UiOnRydWUsImhpc3RvcnkiOnRydWUsInNlbnNvciI6dHJ1ZSwiaWRsZSI6dHJ1ZSwiYWxlcnRzIjp0cnVlLCJ2ZWhpY2xlIjp0cnVlLCJkZXZpY2VsaW1pdCI6ZmFsc2UsImVudHJpZXNDb3VudCI6MCwiX192IjowLCJ0cmlwcyI6dHJ1ZX0sInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQxMzI4ODE3fQ.pjV3ADLMHpkalJNnh975EL-oiUUQ3aQ6xZv_ArXbxgg";

// const TT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhcnNoYWwiLCJpZCI6IjY3OWIyNmU5Y2UxOTAzYWMyMjdhNDQ0OSIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NzliMjZlOWNlMTkwM2FjMjI3YTQ0NDkiLCJlbWFpbCI6ImhhcnNoYWxAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxOTY3YjNlNjcxNDQ5ZWU0Y2Q5ZjZhODA2MzE1ZmFjMzpjMjdkM2JlNDNhZWRlODRlYjA1NDQxNGIwYzE4ZDY3OSIsInVzZXJuYW1lIjoiaGFyc2hhbCIsIm1vYmlsZSI6IjEyMzQ1Njc4OTAiLCJncm91cHNBc3NpZ25lZCI6WyI2NzliMjZiOWNlMTkwM2FjMjI3YTQ0MmYiXSwiY3JlYXRlZEJ5IjoiNjcxMzY1M2I2MTNjZjJkMmM1MzJlZDBlIiwic3RhdHVzIjoidHJ1ZSIsIm5vdGlmaWNhdGlvbiI6dHJ1ZSwiZGV2aWNlcyI6dHJ1ZSwiZHJpdmVyIjp0cnVlLCJncm91cHMiOnRydWUsImNhdGVnb3J5IjpmYWxzZSwibW9kZWwiOmZhbHNlLCJ1c2VycyI6dHJ1ZSwicmVwb3J0Ijp0cnVlLCJzdG9wIjp0cnVlLCJ0cmF2ZWwiOnRydWUsImdlb2ZlbmNlIjp0cnVlLCJnZW9mZW5jZVJlcG9ydCI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjpmYWxzZSwiZGlzdGFuY2UiOnRydWUsImhpc3RvcnkiOnRydWUsInNlbnNvciI6dHJ1ZSwiaWRsZSI6dHJ1ZSwiYWxlcnRzIjp0cnVlLCJ2ZWhpY2xlIjp0cnVlLCJkZXZpY2VsaW1pdCI6ZmFsc2UsImVudHJpZXNDb3VudCI6MCwiX192IjowLCJ0cmlwcyI6dHJ1ZX0sInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQxMTUzMTYyfQ.xsiU5Pz5T2_CNIooO_Uq1E01vjJYWCKXNDXCdTFMBdE"

const TOKEN = sessionStorage.getItem('crdnsMaintToken') // Get token from cookie
const TT = sessionStorage.getItem('crdnsMaintToken') // Get token from cookie

// GET API Supervisor See Driver List all

export const getDriverListApi = async (userId = null, TOKEN) => {
  if (!TOKEN) throw new Error('Authentication token not found')

  const query = userId ? `?id=${userId}` : ''
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/attendance/get-remaining-attendence-of-drivers${query}`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    },
  )
  console.log('This all drivers list for today mark for present : ', data)

  return data?.data.map((driverlist) => ({
    id: driverlist._id,
    name: driverlist.name,
    contactNumber: driverlist.contactNumber,
    email: driverlist.email,
  }))
}

// Get API for Mark Attendance Fromm Supervisor.

export const markAttendanceBySupervisorApi = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/attendance/mark-by-supervisor/${id}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    )
    console.log('This is today marked present Driver list : ', response.data)
    return response.data
  } catch (error) {
    console.error('Error:', error.message?.data || error.message)
    throw error
  }
}

// --------------------------------------------------------------------------------------------------------------------

// GET API for Leave Request list for supervisor.

export const getLeaveResquestDriverApi = async (userId = null, TOKEN) => {
  if (!TOKEN) throw new Error('Authentication token not found')

  const query = userId ? `?id=${userId}` : ''
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/leave/get-leaves-for-approval${query}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    )
    console.log('This is leave request of Driver : ', response.data)
    return response.data
  } catch (error) {
    console.error('Error:', error.message?.data || error.message)
    throw error
  }
}

// PATCH API for Approved Leave Request.

export const updateLeaveRequestStatus = async (id, status) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/leave/update/${id}`,
      { status }, // Sending status as payload
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`, // Ensure you have the token available
          'Content-Type': 'application/json',
        },
      },
    )

    console.log('Leave Request Updated:', response.data)
    return response.data
  } catch (error) {
    console.error('Error updating leave request:', error.response?.data || error.message)
    throw error
  }
}

// -----------------------------------------------------------------------------------------------------------------------------------

//  GET API FOR Driver Salary List.
export const getDriverSalaryListApiByMonth = async (month) => {
  try {
    console.log(`Fetching Driver Salary List for month: ${month}`)

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/salary/get-by-month/${month}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    )

    if (!response.data || response.status !== 200) {
      throw new Error('Invalid response from server')
    }

    console.log('Driver Salary List:', response.data)
    return response.data
  } catch (error) {
    console.error('API Error:', error.response?.data?.message || error.message)
    return [] // Return an empty array to prevent crashes
  }
}

// POST API for Driver Salary.
export const postDriverSalaryApi = async (id, salaryData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/salary/create/${id}`,
      salaryData,
      {
        headers: {
          Authorization: `Bearer ${TT}`, // Make sure TT is your valid token
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.status === 201 || response.status === 200) {
      console.log('Driver Salary Created Successfully:', response.data)
      return response.data
    } else {
      throw new Error(`Unexpected response status: ${response.status}`)
    }
  } catch (error) {
    console.error('API Error:', error.response?.data?.message || error.message)

    // Properly throw the error to be caught in parent function
    const err = new Error(error.response?.data?.message || 'Failed to create salary')
    err.response = error.response // Attach the original response if needed
    throw err
  }
}

// DELETE API for Driver Salary.
export const deleteDriverSalaryApi = async (id) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/salary/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    })
  } catch (error) {
    console.error('Error:', error.message?.data || error.message)
    throw error
  }
}

// PATCH API for Driver Salary.

export const patchDriverSalaryApi = async (id, updatedData) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/salary/update/${id}`,
      updatedData, // Only changed fields
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.status === 201 || response.status === 200) {
      return response.data
    } else {
      throw new Error(`Unexpected response status: ${response.status}`)
    }
  } catch (error) {
    console.error('API Error:', error.response?.data?.message || error.message)
    throw error
  }
}

// --------------------------------------------------------------------------------------------------------------------------------

// GET API for Trip List.
export const getTripListApi = async (userId = null, token) => {
  if (!token) throw new Error('Authentication token not found')

  const query = userId ? `?id=${userId}` : ''
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/trips/get${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date))

  return sortedData.map((TripsList) => {
    const startKM =
      typeof TripsList.startOdometerReading === 'number'
        ? TripsList.startOdometerReading.toFixed(2)
        : 'Trip In-Progress'

    const endKM =
      typeof TripsList.endOdometerReading === 'number'
        ? TripsList.endOdometerReading.toFixed(2)
        : 'Trip In-Progress'

    return {
      id: TripsList._id,
      orginalDate: TripsList.date,
      date: formatDateToDDMMYYYY(TripsList.date),
      transportMode: TripsList.transportMode || 'N/A',
      clientName: TripsList.clientName || 'N/A',
      clientNumber: TripsList.clientNumber || 'N/A',
      companyName: TripsList.companyName || 'N/A',
      driverName: TripsList?.driverId?.name || 'N/A',
      vehicleName: TripsList.vehicleName || 'N/A',
      startLocation: TripsList.startLocation || 'N/A',
      startOdometerReading: startKM,
      endLocation: TripsList.endLocation || 'N/A',
      endOdometerReading: endKM,
      driverCheckIn: TripsList.driverCheckIn ? 'Yes' : 'No',
      coastPerKm: TripsList.coastPerKm || '0',
      clientAdvance: TripsList.clientAdvance || '0',
      budgetAllocated: TripsList.budgetAllocated || '0',
      subTripBudgetAllocated: TripsList.subTripBudgetAllocated || '0',
      supervisorId: TripsList.supervisorId,
      spentAmount: TripsList.spentAmount || '0',
      materialType: TripsList.materialType || 'Not Assign',
      status: TripsList.status,
      updatedAt: TripsList.updatedAt,
    }
  })
}

// POST API for Trip.

export const postTripApi = async (tripData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/trips/create`,
      tripData,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.status === 201 || response.status === 200) {
      return response.data
    } else {
      throw new Error(`Unexpected response status: ${response.status}`)
    }
  } catch (error) {
    console.error('API Error:', error.response?.data?.message || error.message)
    throw error
  }
}

// PATCH API for Trip List by ID.

export const patchTripApi = async (id, update) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/trips/update/${id}`,
      update,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    )
    console.log('This is Trip Update List by ID : ', response.data)
    return response.data
  } catch (error) {
    console.error('Error:', error.message?.data || error.message)
    throw error
  }
}

// DELETE API for Trip List by ID.

export const deleteTripApi = async (id) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/trips/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    })
    console.log('This is Trip Delete List by ID : ', response.data)
    return response.data
  } catch (error) {
    console.error('Error:', error.message?.data || error.message)
    throw error
  }
}

// ---------------------------------------------------------------------------

// Duty Slip Api

export const getDutySlipApi = async (id) => {
  try {
    if (!TOKEN) throw new Error('Authentication token not found')

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/trips/get-dutySlip-by-trip-id/${id}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    )
    return res.data
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}

// ---------------------------------------------------------------------------------------------

// SubTripList

export const getSubTripsApi = async (id) => {
  if (!TOKEN) throw new Error('Authentication token not found')

  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/trips/get-trip-analytics-by-trip-id/${id}`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    },
  )

  const mainTrip = data.trips
  const subTrips = data.subtrip || []

  return {
    mainTrip: {
      id: mainTrip._id,
      driverName: mainTrip?.driverId?.name || '',
      vehicleName: mainTrip.vehicleName,
      startLocation: mainTrip.startLocation,
      endLocation: mainTrip.endLocation,
      date: formatDateToDDMMYYYY(mainTrip.date),
      budgetAllocated: mainTrip.budgetAllocated,
      spentAmount: mainTrip.spentAmount,
      status: mainTrip.status,
      materialType: mainTrip.materialType,
    },
    subTrips: subTrips.map((sub) => ({
      id: sub._id,
      startLocation: sub.startLocation,
      endLocation: sub.endLocation,
      companyName: sub.companyName || '',
      materialType: sub.materialType || '',
      date: formatDateToDDMMYYYY(sub.date),
      orginalDate: sub.date,
      budgetAllocated: sub.budgetAllocated,
      status: sub.status,
    })),
  }
}

// --------------------------------------------------------------------

// Post Subtrip

export const postSubtripApi = async (id, subtripData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/subtrip/create?tripId=${id}`,
      subtripData,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.status === 201 || response.status === 200) {
      console.log('Sub trips Created Successfully:', response.data)
      return response.data
    } else {
      throw new Error(`Unexpected response status: ${response.status}`)
    }
  } catch (error) {
    console.error('API Error:', error.response?.data?.message || error.message)

    // Properly throw the error to be caught in parent function
    const err = new Error(error.response?.data?.message || 'Failed to create subtrip')
    err.response = error.response // Attach the original response if needed
    throw err
  }
}

// PATCH subtrip

export const patchSubtripApi = async (id, data) => {
  try {
    if (!TOKEN) throw new Error('Authentication token not found')

    const { data: response } = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/subtrip/update/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    )

    return response
  } catch (error) {
    console.error('Update subtrip failed:', error, error.response?.data?.message || error.message)
    throw error
  }
}

// Delete driver expense

export const deleteSubtripApi = async (id) => {
  try {
    if (!TOKEN) throw new Error('Authentication token not found')

    const { data } = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/subtrip/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    )

    return console.log('error', data.message)
  } catch (error) {
    throw error
  }
}

// ---------------------------------------------------------------------------------------------

// All DailyLog of drives get api

// export const getAllDriverDailyLogbookApi = async () => {
//     if (!TOKEN) throw new Error('Authentication token not found');

//     const { data } = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/dailylogs/get-all-daily-logs`,
//         {
//             headers: { Authorization: `Bearer ${TOKEN}` },
//         }
//     );

//     console.log("All Vehicle Expenses Data: ", data);

//     const response = data.data || [];
//     console.log("the response is : ", response);

//     // Map the response to desired format
//     return response.map((alldailylog) => ({
//         id: alldailylog._id,
//         originalDate: useSplitTimeDate(alldailylog.startDate) || "N/A",
//         driverName: alldailylog.driverId.name || "Unknown",
//         vehicleName: alldailylog.vehicleName || "N/A",
//         orignalstartDate: alldailylog.startDate,
//         orginalendDate: alldailylog.endDate,
//         startDate: useFormattedTime(alldailylog.startDate) || "Unknown",
//         endDate: useFormattedTime(alldailylog.endDate) || "Unknown",
//         logKM: alldailylog.logKM || "No description",
//         gpsKM: alldailylog.gpsKM || 'No',
//         duration: alldailylog.duration || 'No',
//         signatureId: alldailylog.signatureId || 'No',
//     }));
// };

export const getAllDriverDailyLogbookApi = async () => {
  if (!TOKEN) throw new Error('Authentication token not found')

  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/dailylogs/get-all-daily-logs`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
    },
  )

  console.log('All Vehicle Expenses Data: ', data)

  const response = data.data || []

  // Just return raw and computed-safe data (no hooks)
  return response.map((alldailylog) => ({
    id: alldailylog._id,
    driverName: alldailylog.driverId?.name || 'Unknown',
    supervisor: alldailylog.driverId?.supervisor || 'Unknown',
    vehicleName: alldailylog.vehicleName || 'N/A',
    originalDate: useSplitTimeDate(alldailylog.startDate) || 'N/A',
    startDate: useFormattedTime(alldailylog.startDate),
    endDate: useFormattedTime(alldailylog.endDate),
    logKM: alldailylog.logKM ?? 'No data',
    gpsKM: alldailylog.gpsKM ?? 'No data',
    duration: alldailylog.duration ?? 'No data',
    signatureId: alldailylog.signatureId ?? 'No',
  }))
}

// Post All dailylog of driver

export const postAllDriverDailyLogbookApi = async (id, alldailylogData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/dailylogs/create?driverId=${id}`,
      alldailylogData,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    if (response.status === 201 || response.status === 200) {
      console.log('Daily Log Created Successfully:', response.data)
      return response.data
    } else {
      throw new Error(`Unexpected response status: ${response.status}`)
    }
  } catch (error) {
    console.error('API Error:', error.response?.data?.message || error.message)

    // Properly throw the error to be caught in parent function
    const err = new Error(error.response?.data?.message || 'Failed to create daily log')
    err.response = error.response // Attach the original response if needed
    throw err
  }
}

// PATCH all dailylog of driver by ID

export const patchAllDriverDailyLogbookApi = async (id, data) => {
  try {
    if (!TOKEN) throw new Error('Authentication token not found')

    const { data: response } = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/dailylogs/update/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return response
  } catch (error) {
    console.error(
      'Update daily logs failed:',
      error,
      error.response?.data?.message || error.message,
    )
    throw error
  }
}

// Delete driver dailylog by ID

export const deleteAllDriverDailyLogbookApi = async (id) => {
  try {
    if (!TOKEN) throw new Error('Authentication token not found')

    const { data } = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/dailylogs/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    )

    return console.log('done', data.message)
  } catch (error) {
    throw error
  }
}

// view signature image
export const getAllDriverDailyLogbookSign = async (signatureId) => {
  try {
    if (!TOKEN) throw new Error('Authentication token not found')

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/dailylogs/get-signature-image/${signatureId}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    )
    return res.data
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}

// -----------------------------------------------------------------------------------------

// Get Api for All Vehicle Inpection List

export const getAllVehicleInpectionApi = async () => {
  if (!TOKEN) throw new Error('Authentication token not found')

  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/inspection/get-all-inspection`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
    },
  )

  console.log('All Vehicle Inspection Data: ', data)

  const response = data.data || []

  const formatItem = (item) => {
    if (!item) return { status: 'Unknown' }
    return {
      status: item.status ? 'Pass' : 'Fail',
      ...(item.status === false && {
        description: item.description || 'No Issuse in this part',
        image: item.Image || null,
      }),
    }
  }

  return response.map((inspection) => {
    const items = {
      engineOil: formatItem(inspection.engineOil),
      acCollent: formatItem(inspection.acCollent),
      sparkPlug: formatItem(inspection.sparkPlug),
      airFilter: formatItem(inspection.airFilter),
      breakFluid: formatItem(inspection.breakFluid),
      transmissionFluid: formatItem(inspection.transmissionFluid),
      powerStairingFluid: formatItem(inspection.powerStairingFluid),
      windShieldWasherFluid: formatItem(inspection.windShieldWasherFluid),
      tyrePressure: formatItem(inspection.tyrePressure),
      tyreAlignment: formatItem(inspection.tyreAlignment),
      batteryCharge: formatItem(inspection.batteryCharge),
      wiperBlades: formatItem(inspection.wiperBlades),
      suspensionAndStairing: formatItem(inspection.suspensionAndStairing),
      underbody: formatItem(inspection.underbody),
      exaustSystem: formatItem(inspection.exaustSystem),
      warningLights: formatItem(inspection.warningLights),
      headLights: formatItem(inspection.headLights),
      indicator: formatItem(inspection.indicator),
    }

    // Count Pass/Fail
    const values = Object.values(items)
    const inspectionPass = values.filter((item) => item.status === 'Pass').length
    const inspectionFail = values.filter((item) => item.status === 'Fail').length

    return {
      id: inspection._id,
      vehicleId: inspection.vehicleId,
      vehicleName: inspection.vehicleDetails?.name || 'Unknown',
      orignalDate: inspection.createdAt,
      date: useSplitTimeDate(inspection.createdAt),
      driverName: inspection.DriverId?.name || 'Unknown',
      supervisor: inspection.DriverId?.supervisor || 'Unknown',
      startLocation: inspection.tripId?.startLocation || 'N/A',
      endLocation: inspection.tripId?.endLocation || 'N/A',
      status: inspection.tripId?.status || 'N/A',
      inpectionPass: inspectionPass,
      inpectionFail: inspectionFail,
      category: inspection.vehicleDetails?.category || 'N/A',
      items, // raw item details (optional, if needed later)
    }
  })
}

// Post api for All vehicle inpection

export const postAllVehicleInpectionApi = async (vehicleId, formData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/inspection/add-inspection?vehicleId=${vehicleId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  if (response.status === 201 || response.status === 200) {
    console.log('Inspection Log Created Successfully:', response.data)
    return response.data
  } else {
    throw new Error(`Unexpected response status: ${response.status}`)
  }
}

//  Patch api for all vehicle inpection by inpectionId

export const patchAllVehicleInpectionApi = async (id, data) => {
  const { data: response } = await axios.patch(
    `${import.meta.env.VITE_API_URL}/api/inspection/edit-inspection/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  return response
}

// Delete vehicle inpection by ID

export const deleteAllVehicleInpectionApi = async (id) => {
  try {
    if (!TOKEN) throw new Error('Authentication token not found')

    const { data } = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/inspection/delete-inspection/${id}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    )

    return console.log('done', data.message)
  } catch (error) {
    throw error
  }
}

// view inpection image
export const getAllFailInpectionImageApi = async (Image) => {
  try {
    if (!TOKEN) throw new Error('Authentication token not found')

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/inspection/inspection-image/${Image}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    )
    return res.data
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}

// --------------------------------------------------------------------------------------------------

//  Get all Vehicle Service odometer List section

export const getAllServiceHistoryApi = async () => {
  try {
    if (!TOKEN) throw new Error('Authentication token not found')

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/service/get-all-services`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
      },
    )

    console.log('All Vehicle Service History Raw Response:', response)

    const data = response.data?.data || []

    const mappedData = data.map((entry) => ({
      id: entry._id,
      vehicleId: entry.vehicleId?._id,
      driverName: entry.driverId?.name || 'N/A',
      supervisor: entry.driverId?.supervisor || 'N/A',
      currentVehicleName: entry.vehicleName || 'N/A',
      date: useSplitTimeDate(entry.date),
      originalDate: entry.date,
      serviceType: entry.serviceType || 'N/A',
      description: entry.description || 'N/A',
      amount: entry.amount || 'N/A',
      paymentMode: entry.paymentMode || 'N/A',
      odometer: entry.lastService || 'N/A',
      nextServiceKm: entry.nextServiceDue || 'N/A',
      location: entry.location || 'N/A',
      serviceImg: entry.serviceImg,
      tripStartLocation: entry.trip?.startLocation || 'N/A',
      tripEndLocation: entry.trip?.endLocation || 'N/A',
      tripStatus: entry.trip?.status || 'N/A',
      shopName: entry.vendor || 'N/A',
      coordinate: entry.coordinate || 'N/A',
    }))

    console.log('Mapped Vehicle Service History Data:', mappedData)

    return mappedData
  } catch (error) {
    console.error('Error fetching service history:', error.message)
    throw error
  }
}

// --------------------------------------------------------------------------------------

// Get all driver attendace api by month

export const getAllDriverAttendenceApi = async ({ queryKey }) => {
  const [_key, { search, page, limit, month, year }] = queryKey

  if (!TOKEN) throw new Error('Authentication token not found')

  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/report/driver-attendance-summary`,
    {
      params: {
        search: search || '',
        page,
        limit,
        month,
        year,
      },
      headers: { Authorization: `Bearer ${TOKEN}` },
    },
  )

  // The API response has { count, consignees } structure
  return {
    data: data.report.map((item) => ({
      id: item.driverId,
      presentCount: item.presentCount || '0',
      absentCount: item.absentCount || '0',
      leaveCount: item.leaveCount || '0',
      totalDays: item.totalDays || '0',
      driverName: item.driverName || '0',
    })),
    total: data.pagination?.totalRecords || 0,
    totalPages: data.pagination?.totalPages || 1,
    page: data.pagination?.currentPage || page,
  }
}
