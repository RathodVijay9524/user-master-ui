import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt, FaUserCog, FaHardHat, FaComments } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import './WorkerNavbar.css';

const WorkerNavbar = ({ toggleSidebar }) => {
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Role checks for navigation switching
  const hasAdminRole = user?.roles?.some((r) => r.name === 'ROLE_ADMIN');
  const hasUserRole = user?.roles?.some((r) => r.name === 'ROLE_NORMAL');

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="worker-navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <FaBars />
        </button>
        <h2 className="navbar-title">Worker Dashboard</h2>
      </div>

      <div className="navbar-right">
        <div className="notifications">
          <button className="notification-btn" aria-label="Notifications">
            <FaBell />
            <span className="badge">2</span>
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
            <span className="username" style={{color : '#ff9800'}}>{user?.username || 'Worker'}</span>
          </button>

          {showDropdown && (
            <div className="dropdown-menu show" role="menu">
              <div className="dropdown-header">
                <FaUserCircle className="dropdown-avatar" />
                <div className="user-info">
                  <div className="user-name">{user?.username || 'Worker'}</div>
                  <div className="user-email">{user?.email || 'worker@example.com'}</div>
                </div>
              </div>
              <div className="dropdown-divider" />
              <button
                className="dropdown-item"
                onClick={() => {
                  navigate('/worker/profile');
                  setShowDropdown(false);
                }}
              >
                <FaUserCog className="dropdown-icon" /> My Profile
              </button>
              {hasUserRole && (
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate('/user');
                    setShowDropdown(false);
                  }}
                >
                  <FaUserCircle className="dropdown-icon" /> User Panel
                </button>
              )}
              {hasAdminRole && (
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate('/admin');
                    setShowDropdown(false);
                  }}
                >
                  <FaUserCog className="dropdown-icon" /> Admin Panel
                </button>
              )}
              <button
                className="dropdown-item"
                onClick={() => {
                  navigate('/chat');
                  setShowDropdown(false);
                }}
              >
                <FaComments className="dropdown-icon" /> Chat Boat
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="dropdown-icon" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
 

};

export default WorkerNavbar;