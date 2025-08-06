import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import UserNavbar from './navbar/UserNavbar';
import UserSidebar from './UserSidebar';
import Footer from './navbar/Footer';
import './BaseUser.css';

const BaseUser = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 992 });
  const location = useLocation();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Toggle sidebar visibility (mobile) or collapse (desktop)
  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  // Close sidebar when clicking outside on mobile
  const handleBackdropClick = (e) => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={`user-layout ${isMobile ? (isSidebarOpen ? 'mobile-sidebar-open' : '') : (isSidebarCollapsed ? 'sidebar-collapsed' : '')}`}>
      {/* Sidebar */}
      <UserSidebar 
        isOpen={isSidebarOpen} 
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      
      {/* Backdrop for mobile */}
      {isMobile && isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={handleBackdropClick} />
      )}
      
      <div className="user-content">
        {/* Top Navigation */}
        <UserNavbar toggleSidebar={toggleSidebar} />
        
        {/* Main Content */}
        <main className="main-content">
          <div className="container-fluid">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default BaseUser;
