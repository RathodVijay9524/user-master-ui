import React, { useState, useEffect } from 'react';
import { 
  FaTachometerAlt, 
  FaUser, 
  FaUsers, 
  FaCog, 
  FaBox, 
  FaShoppingBag, 
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
  FaBars
} from 'react-icons/fa';

const Sidebar = ({ isOpen, isCollapsed, toggleSidebar, isMobile }) => {
  const [currentPath, setCurrentPath] = useState('/admin/dashboard');

  const menuItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { title: 'Users', path: '/admin/users', icon: <FaUsers /> },
    { title: 'Products', path: '/admin/products', icon: <FaBox /> },
    { title: 'Orders', path: '/admin/orders', icon: <FaShoppingBag /> },
    { title: 'Analytics', path: '/admin/analytics', icon: <FaChartBar /> },
    { title: 'Settings', path: '/admin/settings', icon: <FaCog /> },
  ];

  const handleMenuItemClick = (path, e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Menu item clicked:', path);
    setCurrentPath(path);
    
    // Close sidebar on mobile after clicking
    if (isMobile && isOpen) {
      toggleSidebar();
    }
  };

  const handleBackdropClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile && isOpen) {
      toggleSidebar();
    }
  };

  const handleToggleCollapse = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSidebar();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 998,
            cursor: 'pointer'
          }}
          onClick={handleBackdropClick}
        />
      )}
      
      <div
        style={{
          width: isCollapsed ? '70px' : '250px',
          height: '100vh',
          backgroundColor: '#2c3e50',
          color: '#ecf0f1',
          transition: 'all 0.3s ease',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
          overflowY: 'auto',
          transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            minHeight: '70px'
          }}
        >
          {!isCollapsed && <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: '#fff' }}>Admin Panel</h3>}
          <button
            onClick={handleToggleCollapse}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ecf0f1',
              fontSize: '1rem',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>
        
        {/* Menu */}
        <div style={{ flex: 1, padding: '15px 0' }}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={(e) => handleMenuItemClick(item.path, e)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: isCollapsed ? '15px 0' : '12px 20px',
                color: '#ecf0f1',
                textDecoration: 'none',
                margin: '5px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: currentPath === item.path ? '#3498db' : 'transparent',
                fontWeight: currentPath === item.path ? 500 : 'normal',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                transition: 'all 0.2s ease',
                position: 'relative',
                zIndex: 1000
              }}
              onMouseEnter={(e) => {
                if (currentPath !== item.path) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== item.path) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{
                fontSize: isCollapsed ? '1.4rem' : '1.2rem',
                marginRight: isCollapsed ? 0 : '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '24px'
              }}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.title}
                </span>
              )}
            </div>
          ))}
        </div>
        
        {/* Footer */}
        {!isCollapsed && (
          <div style={{
            padding: '15px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '6px'
            }}>
              <FaUser style={{
                fontSize: '1.5rem',
                marginRight: '10px',
                color: '#3498db'
              }} />
              <div style={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                <span style={{
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}>Admin User</span>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#bdc3c7',
                  marginTop: '2px'
                }}>Administrator</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Demo App Component
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar 
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      
      {/* Main content area */}
      <div style={{
        marginLeft: isMobile ? 0 : (sidebarCollapsed ? '70px' : '250px'),
        padding: '20px',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Mobile menu button */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            style={{
              position: 'fixed',
              top: '20px',
              left: '20px',
              zIndex: 1001,
              backgroundColor: '#2c3e50',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            <FaBars />
          </button>
        )}
        
        <div style={{ paddingTop: isMobile ? '60px' : '0' }}>
          <h1>Admin Dashboard</h1>
          <p>Click on the sidebar menu items to test navigation.</p>
          <p>Current viewport: <strong>{isMobile ? 'Mobile' : 'Desktop'}</strong></p>
          <p>Sidebar state: <strong>{isMobile ? (sidebarOpen ? 'Open' : 'Closed') : (sidebarCollapsed ? 'Collapsed' : 'Expanded')}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default App;