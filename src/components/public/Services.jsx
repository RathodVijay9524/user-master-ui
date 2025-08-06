import React from 'react';
import { FaLaptopCode, FaMobileAlt, FaDatabase, FaServer, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: <FaLaptopCode className="service-icon" />,
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies like React, Node.js, and more.',
      features: ['Responsive Design', 'Single Page Applications', 'Progressive Web Apps']
    },
    {
      icon: <FaMobileAlt className="service-icon" />,
      title: 'Mobile Solutions',
      description: 'Cross-platform mobile applications for iOS and Android using React Native.',
      features: ['iOS & Android', 'Offline Support', 'Native Performance']
    },
    {
      icon: <FaDatabase className="service-icon" />,
      title: 'Database Management',
      description: 'Efficient database solutions including design, optimization, and maintenance.',
      features: ['SQL & NoSQL', 'Data Migration', 'Performance Tuning']
    },
    {
      icon: <FaServer className="service-icon" />,
      title: 'Cloud Services',
      description: 'Cloud infrastructure setup and management on AWS, Azure, or Google Cloud.',
      features: ['Cloud Migration', 'Serverless Architecture', 'Auto-scaling']
    },
    {
      icon: <FaChartLine className="service-icon" />,
      title: 'Business Intelligence',
      description: 'Data analysis and visualization to drive business decisions.',
      features: ['Data Analytics', 'Custom Dashboards', 'KPI Tracking']
    },
    {
      icon: <FaShieldAlt className="service-icon" />,
      title: 'Security Solutions',
      description: 'Comprehensive security assessment and implementation services.',
      features: ['Penetration Testing', 'Security Audits', 'Compliance']
    }
  ];

  return (
    <div className="services-page">
      <section className="page-header">
        <div className="container">
          <h1>Our Services</h1>
          <p>Comprehensive solutions tailored to your business needs</p>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon-container">
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, i) => (
                    <li key={i}>
                      <span className="feature-icon">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to start your project?</h2>
          <p>Contact us today to discuss how we can help you achieve your goals.</p>
          <a href="/contact" className="cta-button">Get in Touch</a>
        </div>
      </section>
    </div>
  );
};

export default Services;
