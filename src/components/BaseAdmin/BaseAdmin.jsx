import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import AdminNavbar from './navbar/AdminNavbar';
import Sidebar from '../common/Sidebar';
import './BaseAdmin.css';

const BaseAdmin = () => {
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

  // Toggle sidebar visibility (mobile)
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
    <div className={`admin-layout ${isMobile ? (isSidebarOpen ? 'mobile-sidebar-open' : '') : (isSidebarCollapsed ? 'sidebar-collapsed' : '')}`}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      
      {/* Backdrop for mobile */}
      {isMobile && isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={handleBackdropClick} />
      )}
      
      <div className="admin-content">
        {/* Top Navigation */}
        <AdminNavbar toggleSidebar={toggleSidebar} />
        
        {/* Main Content */}
        <main className="main-content">
          <div className="container-fluid">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="admin-footer">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center">
              <div>© {new Date().getFullYear()} Admin Panel. All rights reserved.</div>
              <div className="text-muted">v1.0.0</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BaseAdmin;
