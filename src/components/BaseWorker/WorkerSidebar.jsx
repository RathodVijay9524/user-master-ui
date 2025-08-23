import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaTasks,
  FaClock,
  FaTools,
  FaUserCog,
  FaChevronLeft,
  FaChevronRight,
  FaHardHat
} from 'react-icons/fa';
import './WorkerSidebar.css';

const WorkerSidebar = ({ isOpen, isCollapsed, toggleSidebar, isMobile }) => {
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard', path: '/worker/dashboard', icon: <FaTachometerAlt /> },
    { title: 'My Tasks', path: '/worker/tasks', icon: <FaTasks /> },
    { title: 'Time Tracking', path: '/worker/time-tracking', icon: <FaClock /> },
    { title: 'Tools', path: '/worker/tools', icon: <FaTools /> },
    { title: 'Profile', path: '/worker/profile', icon: <FaUserCog /> }
  ];

  const handleToggleCollapse = () => {
    toggleSidebar();
  };

  const handleSidebarClick = (e) => {
    e.stopPropagation();
  };

  const handleBackdropClick = () => {
    if (isMobile && isOpen) {
      toggleSidebar();
    }
  };

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="sidebar-backdrop"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 998 }}
          onClick={handleBackdropClick}
        />
      )}
      <div
        className={`worker-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile && isOpen ? 'mobile-open' : ''}`}
        style={isMobile && isOpen ? { zIndex: 1001, position: 'fixed', top: 0, left: 0, height: '100vh' } : {}}
        onClick={handleSidebarClick}
      >
        <div className="sidebar-header">
          {!isCollapsed && (
            <h3 className="d-flex align-items-center">
              <FaHardHat className="me-2" /> Worker Panel
            </h3>
          )}
          <button className="collapse-btn" onClick={handleToggleCollapse}>
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>
        <div className="sidebar-menu">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <span className="icon">{item.icon}</span>
              {!isCollapsed && <span className="text">{item.title}</span>}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default WorkerSidebar;
