import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaTools,
  FaLaptopCode,
  FaMobileAlt,
  FaDatabase,
  FaArrowRight
} from 'react-icons/fa';

import './Home.css';

const Home = () => {
  const services = [
    {
      icon: () => <FaLaptopCode className="service-icon" />,
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies.'
    },
    {
      icon: () => <FaMobileAlt className="service-icon" />,
      title: 'Mobile Solutions',
      description: 'Cross-platform mobile applications for iOS and Android.'
    },
    {
      icon: () => <FaDatabase className="service-icon" />,
      title: 'Database Management',
      description: 'Efficient database solutions for your business needs.'
    },
    {
      icon: () => <FaTools className="service-icon" />,
      title: 'Maintenance & Support',
      description: 'Ongoing support and maintenance services.'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Platform</h1>
          <p>Transform your business with our innovative solutions</p>
        </div>

        {/* CTA Buttons */}
        <div className="cta-buttons">
          <Link to="/login" className="btn primary hover-effect">Login</Link>
          <Link to="/register" className="btn secondary hover-effect">Create Account</Link>
          <Link to="/chat" className="btn chat hover-effect">💬 Try AI Chat</Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon-container">
                {service.icon()}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Ready to get started?</h2>
        <p>Join thousands of satisfied customers today</p>
        <Link to="/register" className="btn primary large">
          Sign Up Now <FaArrowRight className="btn-icon" />
        </Link>
      </section>
    </div>
  );
};

export default Home;
