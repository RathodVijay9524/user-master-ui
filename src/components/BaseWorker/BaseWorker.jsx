// src/components/BaseWorker/BaseWorker.js
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import WorkerNavbar from './navbar/WorkerNavbar';
import WorkerSidebar from './WorkerSidebar';
import Footer from './navbar/Footer';
import './BaseWorker.css';

const BaseWorker = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 992 });
  const location = useLocation();

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location.pathname, isMobile]);

  // Toggle sidebar visibility (mobile) or collapse (desktop)
  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };
  return (
    <div className={`worker-layout ${isMobile ? (isSidebarOpen ? 'mobile-sidebar-open' : '') : (isSidebarCollapsed ? 'sidebar-collapsed' : '')}`}>
      <WorkerSidebar 
        isOpen={isSidebarOpen} 
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      

      <div className="worker-content">
        <WorkerNavbar toggleSidebar={toggleSidebar} />
        <main className="main-content">
          <div className="container-fluid">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default BaseWorker;
