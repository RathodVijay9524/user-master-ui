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

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile && isOpen ? 'mobile-open' : ''}`}>
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
            onClick={isMobile ? toggleSidebar : undefined}
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
  );
};

export default Sidebar;
