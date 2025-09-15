
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import { initializeAxiosInstance } from './redux/axiosInstance.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'

// Initialize axios instance with correct base URL
initializeAxiosInstance();

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <App />
  </Provider>


)
