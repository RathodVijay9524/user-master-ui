import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTools, FaPhone, FaUser, FaBars, FaTimes, FaInfoCircle } from 'react-icons/fa';
import logo from '../../assets/logo.png'

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const location = useLocation(); // useLocation for active nav

  const navItems = [
    { title: 'Home', path: '/', icon: <FaHome /> },
    { title: 'Services', path: '/services', icon: <FaTools /> },
    { title: 'About', path: '/about', icon: <FaInfoCircle /> },
    { title: 'Contact', path: '/contact', icon: <FaPhone /> },
    { title: 'Login', path: '/login', icon: <FaUser /> }
  ];



  const handleNavClick = () => {
    setIsOpen(false);
  };

  const styles = {
    navbar: {
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: '1000',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      transform: 'translateY(0)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    navContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '70px'
    },
  logo: {
  fontSize: '28px',
  fontWeight: 'bold',
  textDecoration: 'none',
  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',

  lineHeight: '1',    // fixes extra bottom spacing
  paddingTop: '4px',  // tiny adjustment
}
,
    mobileMenuIcon: {
      display: 'none',
      color: '#4b5563',
      fontSize: '24px',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      background: 'none',
      border: 'none'
    },
    navMenu: {
      display: 'flex',
      listStyle: 'none',
      margin: '0',
      padding: '0',
      gap: '4px',
      alignItems: 'center'
    },
    navMenuMobile: {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      borderRadius: '0 0 16px 16px',
      padding: '20px',
      gap: '8px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      borderTop: 'none'
    },
    navItem: {
      position: 'relative'
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 20px',
      color: '#4b5563',
      textDecoration: 'none',
      borderRadius: '12px',
      fontWeight: '500',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer'
    },
    navLinkMobile: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px 20px',
      color: '#374151',
      textDecoration: 'none',
      borderRadius: '12px',
      fontWeight: '500',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      width: '100%',
      cursor: 'pointer'
    },
    navLinkActive: {
      background: 'rgba(59, 130, 246, 0.1)',
      color: '#3b82f6',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(59, 130, 246, 0.2)'
    },
    navLinkActiveMobile: {
      background: 'rgba(59, 130, 246, 0.1)',
      color: '#3b82f6',
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
    },
    ctaButton: {
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '12px',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      border: 'none',
      cursor: 'pointer'
    },
    ctaButtonMobile: {
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '12px',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '16px',
      width: '100%',
      cursor: 'pointer'
    },
    desktopMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px'
    },
    notificationBar: {
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: 'white',
      textAlign: 'center',
      padding: '12px 0',
      fontSize: '14px',
      marginTop: '70px', // Add space for fixed navbar
      position: 'relative',
      zIndex: '999'
    },
    notificationContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px'
    },
    notificationLink: {
      color: 'white',
      textDecoration: 'underline',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    },
    demoContent: {
      padding: '40px 24px',
      maxWidth: '1200px',
      margin: '0 auto',
      lineHeight: '1.8'
    },
    demoSection: {
      marginBottom: '60px',
      padding: '40px',
      background: '#f8fafc',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    }
  };

  const hoverStyles = `
    <style>
      .nav-link:hover {
        background: rgba(59, 130, 246, 0.1) !important;
        transform: translateY(-2px);
        color: #3b82f6 !important;
      }
      
      .nav-link-mobile:hover {
        background: rgba(59, 130, 246, 0.08) !important;
        color: #3b82f6 !important;
      }
      
      .logo:hover {
        transform: scale(1.05);
      }
      
      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
        background: linear-gradient(135deg, #2563eb, #7c3aed) !important;
      }
      
      .mobile-menu-icon:hover {
        background: rgba(0, 0, 0, 0.05) !important;
        transform: scale(1.1);
      }
      
      .notification-link:hover {
        text-decoration: none !important;
        opacity: 0.9;
      }
      
      @media (max-width: 768px) {
        .mobile-menu-icon {
          display: block !important;
        }
        .desktop-menu {
          display: none !important;
        }
        .nav-menu {
          display: none !important;
        }
        .nav-menu.active {
          display: flex !important;
        }
      }
      
      @media (min-width: 769px) {
        .nav-menu-mobile {
          display: none !important;
        }
      }
    </style>
  `;

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: hoverStyles }} />
      
      {/* Fixed Sticky Navbar */}
      <nav style={styles.navbar} role="navigation" aria-label="Main Navigation">
        <div style={styles.navContainer}>
          {/* Logo */}
          <Link 
            to="/"
            style={styles.logo} 
            className="logo"
            aria-label="Home"
          >
           <img src={logo} alt="My Logo" width="150" />
          </Link>

          {/* Desktop Menu */}
          <div style={styles.desktopMenu} className="desktop-menu">
            <ul style={styles.navMenu}>
              {navItems.map((item, index) => (
                <li key={index} style={styles.navItem}>
                  <Link
                    to={item.path}
                    style={{
                      ...styles.navLink,
                      ...(location.pathname === item.path ? styles.navLinkActive : {})
                    }}
                    className="nav-link"
                    onClick={handleNavClick}
                    aria-current={location.pathname === item.path ? "page" : undefined}
                  >
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop CTA Button */}
            <Link 
              to="/register"
              style={styles.ctaButton}
              className="cta-button"
              aria-label="Get Started"
            >
              <span>Get Started</span>
              <span>🚀</span>
              <span style={{
                background: '#22c55e',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px',
                borderRadius: '6px',
                padding: '2px 8px',
                marginLeft: '8px'
              }}>Free</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            style={styles.mobileMenuIcon}
            className="mobile-menu-icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') setIsOpen(!isOpen);
            }}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div style={styles.navMenuMobile} id="mobile-menu" role="menu">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                style={{
                  ...styles.navLinkMobile,
                  ...(location.pathname === item.path ? styles.navLinkActiveMobile : {})
                }}
                className="nav-link-mobile"
                onClick={handleNavClick}
                aria-current={location.pathname === item.path ? "page" : undefined}
                role="menuitem"
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            ))}
            {/* Mobile CTA Button */}
            <Link 
              to="/register"
              style={styles.ctaButtonMobile}
              className="cta-button"
              onClick={handleNavClick}
              aria-label="Get Started"
              role="menuitem"
            >
              <span>Get Started</span>
              <span>🚀</span>
              <span style={{
                background: '#22c55e',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px',
                borderRadius: '6px',
                padding: '2px 8px',
                marginLeft: '8px'
              }}>Free</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Notification Bar (dismissible) */}
      {showNotification && (
        <div style={styles.notificationBar} role="status" aria-live="polite">
          <div style={styles.notificationContent}>
            <span>🎉</span>
            <span>New features available! Check out our latest updates.</span>
            <Link 
              to="/services"
              style={styles.notificationLink}
              className="notification-link"
            >
              Learn More
            </Link>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                marginLeft: '16px',
                fontSize: '18px',
                cursor: 'pointer'
              }}
              aria-label="Dismiss notification"
              onClick={() => setShowNotification(false)}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicNavbar;