import axios from 'axios'
import Cookies from 'js-cookie'
import { useSplitTimeDate } from '../../customhooks/useSplitTimeDate'
import { useFormattedTime } from '../../customhooks/useFormattedTime'
import { formatDateToDDMMYYYY } from '../../customhooks/useFormattedDate'


// const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoYXlzaHUiLCJpZCI6IjY3MTM2NTNiNjEzY2YyZDJjNTMyZWQwZSIsInVzZXJzIjpmYWxzZSwic3VwZXJhZG1pbiI6dHJ1ZSwidXNlciI6bnVsbCwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NDEzMzQ2NzN9.CWrHCFTim0n6wyw8ynx1B3eXL0jNpzGrCNEUVSwhpxs'
const token = sessionStorage.getItem('crdnsMaintToken') // Get token from cookie

export const addDriver = async (data) => {
  try {


    if (!token) throw new Error('Authentication token not found')

    const { data: response } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/drivers/create`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response
  } catch (error) {
    throw error
  }
}

export const fetchDrivers = async () => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/drivers/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return data.map((driver) => ({
      name: driver.name,
      contactNumber: driver.contactNumber,
      email: driver.email,
      password: driver.password,
      id: driver._id,
      supervisor: driver.supervisor,
    }))
  } catch (error) {
    alert(error.message)
    throw error
  }
}

export const fetchSupervisor = async () => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/get`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const users = Array.isArray(data) ? data : data.users || data.data || []

    return users.map((sup) => ({
      value: sup._id,
      label: sup.username || sup.name || 'Unnamed Supervisor',
    }))
  } catch (error) {
    console.log('Supervisor fetch error:', error.message)
    throw error
  }
}


export const deleteDriver = async (id) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/drivers/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return console.log(data.message)
  } catch (error) {
    throw error
  }
}

export const updateDriver = async (id, data) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data: response } = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/drivers/update/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return response
  } catch (error) {
    console.error('Update driver failed:', error)
    alert(error.response?.data?.message || error.message)
    throw error
  }
}

export const driverProfile = async (id) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/drivers/get/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data
  } catch (error) {
    alert(error.message)
    throw error
  }
}

export const driverAttendance = async (id, selectedMonth) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/attendance/get-attendence-month-wise?driverId=${id}&month=${selectedMonth}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return data
  } catch (error) {
    alert(error.message)
    throw error
  }
}

export const driverExpenses = async (id) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/driverExpense/get-driver-expense-by-driver-id/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return data.map((expenses) => ({
      id: expenses._id,
      originalDate: expenses.date,
      date: useSplitTimeDate(expenses.date),
      driverName: expenses.driverName,
      description: expenses.description,
      location: expenses.location,
      lat: expenses.lat || 'No latitude',
      long: expenses.long || 'No longitude',
      shopName: expenses.shopName,
      amount: expenses.amount,
      payment: expenses.paymentMode,
      billImg: expenses.billImg,
    }))
  } catch (error) {
    alert(error.message)
    throw error
  }
}

export const getDriverBillApi = async (billImg) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/driverExpense/bill-img/${billImg}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return res.data
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}

export const driverLogbook = async (id, month) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/dailylogs/get-daily-logs-month-wise?driverId=${id}&month=${month}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return data.map((logbook) => ({
      id: logbook._id,
      originalDate: useSplitTimeDate(logbook.startDate),
      driverName: logbook.driverId.name || 'Unknown Driver',
      vehicleName: logbook.vehicleName,
      startDate: useFormattedTime(logbook.startDate),
      orignalstartDate: logbook.startDate,
      orginalendDate: logbook.endDate,
      endDate: useFormattedTime(logbook.endDate),
      duration: logbook.duration,
      logKM: logbook.logKM,
      gpsKM: logbook.gpsKM,
      signatureId: logbook.signatureId,
    }))
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}

export const getDailyLogSign = async (signatureId) => {
  try {

    if (!token) throw new Error('Authentication token not found')

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/dailylogs/get-signature-image/${signatureId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return res.data
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}


// Post Subtrip

export const postDailyLogApi = async (id, dailylogData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/dailylogs/create/${id}`,
      dailylogData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
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
    const err = new Error(
      error.response?.data?.message || 'Failed to create daily log'
    )
    err.response = error.response // Attach the original response if needed
    throw err
  }
}


// PATCH subtrip

export const patchDailyLogApi = async (id, data) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data: response } = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/dailylogs/update/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return response
  } catch (error) {
    console.error('Update daily logs failed:', error, error.response?.data?.message || error.message)
    throw error
  }
}


// Delete driver expense

export const deleteDailyLogApi = async (id) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/dailylogs/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return console.log("done", data.message)
  } catch (error) {
    throw error
  }
}

// ------------------------------------------------------------------------------------ 



export const driverSalary = async (id) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/salary/get/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // console.log("all data salaray", response.data)

    return data.map((salary) => ({
      id: salary._id,
      driverId: salary.driverId,
      basicPay: salary.basicPay,
      overtime: salary.overtime,
      incentives: salary.incentives,
      deductions: salary.deductions,
      netPay: salary.netPay,
      createdAt: salary.createdAt,
      date: useSplitTimeDate(salary.date),
      originalDate: salary.date,
    }))
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}

export const driverTripDetails = async (id) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/trips/get-trip-by-driver-id/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return data.map((trip) => ({
      id: trip._id,
      vehicleName: trip.vehicleName,
      date: new Date(trip.date).toLocaleDateString('en-GB'),
      startLocation: trip.startLocation,
      endLocation: trip.endLocation,
      budgetAllocated: trip.budgetAllocated,
      spentAmount: trip.spentAmount,
      materialType: trip.materialType,
      status: trip.status,
    }))
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}
//------------------------------------driver document locker-------------------------------------

export const getDocuments = async (id) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/document-locker/get-all/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDocumentImage = async (id) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/document-locker/get-image-by-id/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const uploadDocuments = async (driverId, documentData) => {
  if (!driverId || !documentData || typeof documentData !== "object") {
    console.error("Invalid parameters: driver ID or document data is missing.");
    throw new Error("Invalid parameters: driver ID or document data is missing.");
  }

  const documentType = Object.keys(documentData)[0]; // Get the document type (e.g., "Aadhar Card")
  console.log("this is document data", documentData);

  const formData = new FormData();
  formData.append("driverId", driverId);
  formData.append("documentName", documentData.documentName);
  formData.append("document", documentData.document)
  console.log("Uploading Document:", documentType);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/document-locker/upload-document`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading document:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const editDocument = async (documentId, documentData) => {
  try {
    const formData = new FormData();
    if (documentData.documentName) {
      formData.append('documentName', documentData.documentName);
    }
    if (documentData.document) {
      formData.append('document', documentData.document); // File field matches backend expectation
    }

    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/document-locker/update/${documentId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const deleteDocumentAPI = async (id) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/document-locker/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const fetchDriverStatus = async () => {
  try {
    if (!token) throw new Error('Authentication token not found');

    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/drivers/get-driver/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const mapDriver = (driverStatus) => ({
      id: driverStatus._id,
      name: driverStatus.name,
      contactNumber: driverStatus.contactNumber,
      email: driverStatus.email ?? '',
      supervisor: driverStatus.supervisor,
    });

    return {
      available: data.availableDrivers.map(mapDriver),
      unavailable: data.unavailableDrivers.map(mapDriver),
    };
  } catch (error) {
    alert(error.message);
    throw error;
  }
};


export const fetchDriverAttendanceLocation = async () => {
  try {
    const token = sessionStorage.getItem('crdnsMaintToken');

    if (!token) throw new Error('Authentication token not found');

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/attendance/get-attendance-location`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = response.data?.attendanceLocations;

    if (!Array.isArray(data)) {
      throw new Error('Invalid API response: attendanceLocations must be an array');
    }

    const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return sortedData.map((attendanceLoc) => ({
      id: attendanceLoc._id,
      originalDate: attendanceLoc.createdAt,
      date: formatDateToDDMMYYYY(attendanceLoc.createdAt),
      name: attendanceLoc.driverId?.name || 'N/A',
      lat: attendanceLoc.lat || 'N/A',
      long: attendanceLoc.long || " ",
      coordinate: `${attendanceLoc.lat}, ${attendanceLoc.long}` || 'No Co-ordinate',
      status: attendanceLoc.status || 'N/A',
      supervisor: attendanceLoc.driverId?.supervisor || 'N/A',
      attendanceImageId: attendanceLoc.attendanceImageId,
    }));


  } catch (error) {
    alert(error.message);
    throw error;
  }
};


export const getAddressApi = async (latitude, longitude) => {
  try {
    const apiKey = 'zstIsERMom7VAfZNEAhP'; // Your MapTiler API Key
    const response = await axios.get(
      `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${apiKey}`
    );

    if (response.data?.features?.length > 0) {
      return response.data.features[0].place_name;
    } else {
      return 'Address not available';
    }
  } catch (error) {
    console.error('Geocoding Error:', error.message);
    return 'Address not available';
  }
};


export const getDriverLocationApi = async (attendanceImageId) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/attendance/get-attendance-img/${attendanceImageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return res.data
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}


