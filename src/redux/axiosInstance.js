import axios from 'axios';

// Function to check if development server is available
const checkDevServer = async () => {
  try {
    const response = await axios.get('http://localhost:9091/api/health', {
      timeout: 2000, // 2 second timeout
    });
    return response.status === 200;
  } catch (error) {
    console.log('Development server not available, falling back to production');
    return false;
  }
};

// Function to get the appropriate base URL
const getBaseURL = async () => {
  const isDevAvailable = await checkDevServer();
  return isDevAvailable 
    ? 'http://localhost:9091/api' 
    : 'https://api.codewithvijay.online/api';
};

// Create axios instance with dynamic base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:9091/api', // Default to dev, will be updated
});


// Request interceptor to add the JWT token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } 
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If development server is not available, switch to production
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      const currentBaseURL = axiosInstance.defaults.baseURL;
      if (currentBaseURL.includes('localhost')) {
        console.log('Development server unavailable, switching to production API');
        axiosInstance.defaults.baseURL = 'https://api.codewithvijay.online/api';
        
        // Retry the original request with production URL
        const originalRequest = error.config;
        originalRequest.baseURL = 'https://api.codewithvijay.online/api';
        return axiosInstance.request(originalRequest);
      }
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Function to initialize the axios instance with the correct base URL
export const initializeAxiosInstance = async () => {
  try {
    const baseURL = await getBaseURL();
    axiosInstance.defaults.baseURL = baseURL;
    console.log(`Axios instance initialized with base URL: ${baseURL}`);
  } catch (error) {
    console.error('Failed to initialize axios instance:', error);
    // Fallback to production
    axiosInstance.defaults.baseURL = 'https://api.codewithvijay.online/api';
  }
};

export default axiosInstance;
