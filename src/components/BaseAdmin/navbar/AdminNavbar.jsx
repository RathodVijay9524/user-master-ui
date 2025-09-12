import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt, FaCog, FaHardHat, FaComments } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../redux/axiosInstance';
import { getUserImage } from '../../../redux/userSlice';
import './AdminNavbar.css';

const AdminNavbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [showDropdown, setShowDropdown] = useState(false);
  const [userImageUrl, setUserImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch user image
  useEffect(() => {
    const fetchUserImage = async () => {
      if (!user?.id) return;
      setImageError(false);
      try {
        const result = await dispatch(getUserImage(user.id)).unwrap();
        if (result) {
          const imageUrl = `${axiosInstance.defaults.baseURL}/users/image/${user.id}?t=${Date.now()}`;
          setUserImageUrl(imageUrl);
        } else {
          setUserImageUrl('');
        }
      } catch (error) {
        console.warn('Failed to load user image:', error);
        setUserImageUrl('');
        setImageError(true);
      }
    };

    if (user?.id) {
      fetchUserImage();
    }
  }, [user, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        const userBtn = document.querySelector('.user-btn');
        if (userBtn && !userBtn.contains(event.target)) {
          setShowDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Determine roles
  const hasAdminRole = user?.roles?.some((role) => role.name === 'ROLE_ADMIN');
  const hasUserRole = user?.roles?.some((role) => role.name === 'ROLE_NORMAL');
  const hasWorkerRole = user?.roles?.some((role) => role.name === 'ROLE_WORKER');

  const showUserPanelLink = hasAdminRole && hasUserRole;
  const showWorkerPanelLink = hasAdminRole && hasWorkerRole;

  return (
    <nav className="admin-navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <FaBars />
        </button>
        <h2 className="navbar-title">Admin Dashboard</h2>
      </div>
      
      <div className="navbar-right">
        <div className="notifications">
          <button className="notification-btn" aria-label="Notifications">
            <FaBell />
            <span className="badge">3</span>
          </button>
        </div>
        
        <div className="user-menu" ref={dropdownRef}>
          <button 
            className="user-btn" 
            onClick={toggleDropdown}
            aria-expanded={showDropdown}
            aria-haspopup="true"
          >
            {userImageUrl && !imageError ? (
              <img 
                src={userImageUrl} 
                alt="User Avatar" 
                className="user-avatar-img"
                onError={() => setImageError(true)}
              />
            ) : (
              <FaUserCircle className="user-avatar" />
            )}
            <span className="username" style={{color :'#ff9800'}} >
              {user?.username || 'Admin User'}
            </span>
          </button>
          
          {showDropdown && (
            <div className="dropdown-menu show" role="menu">
              <div className="dropdown-header">
                {userImageUrl && !imageError ? (
                  <img 
                    src={userImageUrl} 
                    alt="User Avatar" 
                    className="dropdown-avatar-img"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <FaUserCircle className="dropdown-avatar" />
                )}
                <div className="user-info">
                  <div className="user-name">{user?.username || 'Admin User'}</div>
                  <div className="user-email">{user?.email || 'admin@example.com'}</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item"
                onClick={() => {
                  navigate('/admin/profile');
                  setShowDropdown(false);
                }}
              >
                <FaUserCircle className="dropdown-icon" />
                My Profile
              </button>
              {showUserPanelLink && (
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    navigate('/user/dashboard');
                    setShowDropdown(false);
                  }}
                >
                  <FaUserCircle className="dropdown-icon" />
                  User Panel
                </button>
              )}
              {showWorkerPanelLink && (
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    navigate('/worker');
                    setShowDropdown(false);
                  }}
                >
                  <FaHardHat className="dropdown-icon" />
                  Worker Panel
                </button>
              )}
              <button 
                className="dropdown-item"
                onClick={() => {
                  navigate('/chat');
                  setShowDropdown(false);
                }}
              >
                <FaComments className="dropdown-icon" />
                Chat Boat
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  navigate('/admin/settings');
                  setShowDropdown(false);
                }}
              >
                <FaCog className="dropdown-icon" />
                Settings
              </button>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item logout-btn" 
                onClick={handleLogout}
              >
                <FaSignOutAlt className="dropdown-icon" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
