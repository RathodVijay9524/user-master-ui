import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseAdmin from './components/BaseAdmin/BaseAdmin';
import BaseUser from './components/BaseUser/BaseUser';
import BaseWorker from './components/BaseWorker/BaseWorker';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import WorkerDashboard from './components/WorkerDashboard';
import Profile from './components/Profile';

import ActiveUser from './components/BaseAdmin/ActiveUser';
import UserManagement from './components/BaseAdmin/user/UserManagement';
import WorkerManagement from './components/BaseUser/worker/WorkerManagement';
import CurrentUser from './components/CurrentUser';
import Login from './components/public/login';
import { fetchUserData,setUser } from './redux/authSlice';
import RoleBasedGuard from './redux/RoleBasedGuard';
import Home from './components/public/Home';
import Services from './components/public/Services';
import Contact from './components/public/Contact';
import About from './components/public/About';
import UserRegistration from './components/public/UserRegistration';
import PublicNavbar from './components/public/PublicNavbar';
import Footer from './components/public/Footer';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ForgotPassword from './components/public/pages/ForgotPassword';
import ResetPassword from './components/public/pages/ResetPassword';
import NotFoundPage from './components/public/NotFoundPage ';
import VerifyAccount from './components/public/pages/VerifyAccount';

const App = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('jwtToken');
  
    if (storedToken) {
      if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser))); // Restore user from localStorage
      } else {
        dispatch(fetchUserData()); // Fallback to API if no user cached
      }
    }
  }, [dispatch]);

  const { loading } = useSelector((state) => state.auth);

if (loading) {
  return <div>Loading app...</div>; // You can replace with spinner
}



  return (
    <>
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RoleBasedGuard requiredRole="ROLE_ADMIN">
              <BaseAdmin />
            </RoleBasedGuard>
          }
        >
          <Route index element={<AdminDashboard />} /> {/* default page */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="current-user" element={<CurrentUser />} />
          <Route path="active-users" element={<ActiveUser />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <RoleBasedGuard requiredRole="ROLE_NORMAL">
              <BaseUser />
            </RoleBasedGuard>
          }
        >
          <Route index element={<UserDashboard />} /> {/* default page */}
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="super-user" element={<WorkerManagement />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Worker Routes */}
        <Route
          path="/worker"
          element={
            <RoleBasedGuard requiredRole="ROLE_WORKER">
              <BaseWorker />
            </RoleBasedGuard>
          }
        >
          <Route index element={<WorkerDashboard />} /> {/* default page */}
          <Route path="dashboard" element={<WorkerDashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <>
              <PublicNavbar />
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <PublicNavbar />
              <UserRegistration />
              <Footer />
            </>
          }
        />
        <Route
          path="/services"
          element={
            <>
              <PublicNavbar />
              <Services />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <PublicNavbar />
              <About />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <PublicNavbar />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route
          path="/"
          element={
            <>
              <PublicNavbar />
              <Home />
              <Footer />
            </>
          }
        />

<Route
          path="/forgot-password"
          element={
            <>
              <PublicNavbar />
              <ForgotPassword />
              <Footer />
            </>
          }
        />
        <Route
          path="/reset-password"
          element={
            <>
              <PublicNavbar />
              <ResetPassword />
              <Footer />
            </>
          }
        /><Route
        path="/verify"
        element={
          <>
            <PublicNavbar />
            <VerifyAccount />
            <Footer />
          </>
        }
      />
      
       

        {/* Catch-all Route */}
        <Route path="*" element={<NotFoundPage />} />
       
      </Routes>
    </Router>
     <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default App;