import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PortfolioNavbar = ({ activeSection, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'about', label: 'About', icon: 'fas fa-user' },
    { id: 'experience', label: 'Experience', icon: 'fas fa-briefcase' },
    { id: 'skills', label: 'Skills', icon: 'fas fa-code' },
    { id: 'education', label: 'Education', icon: 'fas fa-graduation-cap' },
    { id: 'projects', label: 'Projects', icon: 'fas fa-project-diagram' },
    { id: 'contact', label: 'Contact', icon: 'fas fa-envelope' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.nav 
      className="portfolio-navbar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="nav-container">
        <motion.div 
          className="nav-logo"
          whileHover={{ scale: 1.05 }}
        >
          <span className="logo-text">Vijay Rathod</span>
          <span className="logo-dot">.</span>
        </motion.div>

        {/* Desktop Navigation */}
        <ul className="nav-links desktop-nav">
          {navItems.map((item) => (
            <li key={item.id}>
              <motion.button
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </motion.button>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <motion.button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          whileTap={{ scale: 0.95 }}
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}
        initial={{ opacity: 0, x: '100%' }}
        animate={{ 
          opacity: isMobileMenuOpen ? 1 : 0,
          x: isMobileMenuOpen ? '0%' : '100%'
        }}
        transition={{ duration: 0.3 }}
      >
        <ul className="nav-links mobile-nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <motion.button
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </motion.button>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.nav>
  );
};

export default PortfolioNavbar;
