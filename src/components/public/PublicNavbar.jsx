import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTools, FaPhone, FaUser, FaBars, FaTimes, FaInfoCircle } from 'react-icons/fa';
import './PublicNavbar.css';

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { title: 'Home', path: '/', icon: <FaHome /> },
    { title: 'Services', path: '/services', icon: <FaTools /> },
    { title: 'About', path: '/about', icon: <FaInfoCircle /> },
    { title: 'Contact', path: '/contact', icon: <FaPhone /> },
    { title: 'Login', path: '/login', icon: <FaUser /> }
  ];

  return (
    <nav className="public-navbar">
      <div className="public-nav-container">
        <Link to="/" className="public-nav-logo">
          YourLogo
        </Link>

        <div className="mobile-menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={isOpen ? 'public-nav-menu active' : 'public-nav-menu'}>
          {navItems.map((item, index) => (
            <li key={index} className="public-nav-item">
              <Link
                to={item.path}
                className={`public-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default PublicNavbar;
