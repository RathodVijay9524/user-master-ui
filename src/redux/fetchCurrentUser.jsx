import axiosInstance from './axiosInstance';

const fetchCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/current-user'); // Adjust endpoint as necessary
    // console.log("Fetched current user - ", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export default fetchCurrentUser;
