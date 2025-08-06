import axiosInstance from "../redux/axiosInstance";


const checkAvailability = async (value) => {
  try {
    const response = await axiosInstance.post('/auth/register/check-availability', null, {
      params: {
        usernameOrEmail: value,  // Send as a query parameter
      },
    });

    console.log('Response from Backend:', response.data);
    return response.data.exists;  // Returns true if exists, false if available
  } catch (error) {
    console.error('Error checking availability:', error.response ? error.response.data : error.message);
    return false;  // Default to false if error occurs
  }
};



export default checkAvailability;
