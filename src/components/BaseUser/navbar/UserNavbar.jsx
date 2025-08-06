import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt, FaUserCog, FaHardHat } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import './UserNavbar.css';

const UserNavbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const userData = {
    name: user?.username || 'User',
    email: user?.email || 'user@example.com'
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Check if the click is not on the user button
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

  // Determine roles
  const hasAdminRole = user?.roles?.some((role) => role.name === 'ROLE_ADMIN');
  const hasWorkerRole = user?.roles?.some((role) => role.name === 'ROLE_WORKER');

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="user-navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <FaBars />
        </button>
        <h2 className="navbar-title">User Dashboard</h2>
      </div>
      
      <div className="navbar-right">
        <div className="notifications">
          <button className="notification-btn" aria-label="Notifications">
            <FaBell />
            <span className="badge">5</span>
          </button>
        </div>
        
        <div className="user-menu" ref={dropdownRef}>
          <button 
            className="user-btn" 
            onClick={toggleDropdown}
            aria-expanded={showDropdown}
            aria-haspopup="true"
          >
            <FaUserCircle className="user-avatar" />
            <span className="username" style={{color : '#ff9800'}}>
              {userData.name}
            </span>
          </button>
          
          {showDropdown && (
            <div className="dropdown-menu show" role="menu">
              <div className="dropdown-header">
                <FaUserCircle className="dropdown-avatar" />
                <div className="user-info">
                  <div className="user-name">{userData.name}</div>
                  <div className="user-email">{userData.email}</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item"
                onClick={() => {
                  navigate('/user/profile');
                  setShowDropdown(false);
                }}
              >
                <FaUserCog className="dropdown-icon" />
                My Profile
              </button>
              {hasAdminRole && (
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    navigate('/admin');
                    setShowDropdown(false);
                  }}
                >
                  <FaUserCog className="dropdown-icon" />
                  Admin Panel
                </button>
              )}
              {hasWorkerRole && (
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

export default UserNavbar;