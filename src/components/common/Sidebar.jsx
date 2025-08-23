import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUser, 
  FaUsers, 
  FaCog, 
  FaBox, 
  FaShoppingBag, 
  FaChartBar,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen, isCollapsed, toggleSidebar, isMobile }) => {
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { title: 'Users', path: '/admin/users', icon: <FaUsers /> },
    { title: 'Products', path: '/admin/products', icon: <FaBox /> },
    { title: 'Orders', path: '/admin/orders', icon: <FaShoppingBag /> },
    { title: 'Analytics', path: '/admin/analytics', icon: <FaChartBar /> },
    { title: 'Settings', path: '/admin/settings', icon: <FaCog /> },
  ];

  const handleToggleCollapse = () => {
    toggleSidebar();
  };

  // Handle click on sidebar to prevent event bubbling (for mobile overlays)
  const handleSidebarClick = (e) => {
    e.stopPropagation();
  };

  // Optionally, handle backdrop click to close sidebar on mobile
  const handleBackdropClick = () => {
    if (isMobile && isOpen) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Backdrop for mobile sidebar */}
      {isMobile && isOpen && (
        <div
          className="sidebar-backdrop"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 998
          }}
          onClick={handleBackdropClick}
        />
      )}
      <div
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile && isOpen ? 'mobile-open' : ''}`}
        style={isMobile && isOpen ? { zIndex: 999, position: 'fixed', height: '100vh' } : {}}
        onClick={handleSidebarClick}
      >
        <div className="sidebar-header">
          {!isCollapsed && <h3>Admin Panel</h3>}
          <button className="collapse-btn" onClick={handleToggleCollapse}>
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>
        
        <div className="sidebar-menu">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => {
                if (isMobile) toggleSidebar();
              }}
            >
              <span className="icon">{item.icon}</span>
              {!isCollapsed && <span className="title">{item.title}</span>}
            </Link>
          ))}
        </div>
        
        {!isCollapsed && (
          <div className="sidebar-footer">
            <div className="user-info">
              <FaUser className="user-icon" />
              <div className="user-details">
                <span className="username">Admin User</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
