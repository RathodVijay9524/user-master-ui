import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaShoppingCart, 
  FaHeart, 
  FaHistory, 
  FaUser, 
  FaBell, 
  FaCreditCard,
  FaChevronLeft,
  FaChevronRight,
  FaHome
} from 'react-icons/fa';
import './UserSidebar.css';

const UserSidebar = ({ isOpen, isCollapsed, toggleSidebar, isMobile }) => {
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard', path: '/user/dashboard', icon: <FaTachometerAlt /> },
    { title: 'Super User', path: '/user/super-user', icon: <FaUser /> },
    { title: 'My Orders', path: '/user/orders', icon: <FaHistory /> },
    { title: 'Shopping Cart', path: '/user/cart', icon: <FaShoppingCart /> },
    { title: 'Wishlist', path: '/user/wishlist', icon: <FaHeart /> },
    { title: 'Profile', path: '/user/profile', icon: <FaUser /> },
    { title: 'Notifications', path: '/user/notifications', icon: <FaBell /> },
    { title: 'Payment Methods', path: '/user/payment-methods', icon: <FaCreditCard /> },
  ];

  const handleToggleCollapse = () => {
    toggleSidebar();
  };

  const handleSidebarClick = (e) => {
    // Prevent clicks inside the sidebar from bubbling to the backdrop
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
        className={`user-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile && isOpen ? 'mobile-open' : ''}`}
        style={isMobile && isOpen ? { zIndex: 1001, position: 'fixed', top: 0, left: 0, height: '100vh' } : {}}
        onClick={handleSidebarClick}
      >
      <div className="sidebar-header">
        {!isCollapsed && <h3>User Panel</h3>}
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
              if (window.innerWidth <= 992) {
                if (isMobile) {
                  toggleSidebar();
                }
              }
            }}
          >
            <span className="icon">{item.icon}</span>
            {!isCollapsed && <span className="text">{item.title}</span>}
          </Link>
        ))}
      </div>
      
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="user-info">
            <div className="user-name">User Account</div>
            <div className="user-role">Customer</div>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default UserSidebar;
