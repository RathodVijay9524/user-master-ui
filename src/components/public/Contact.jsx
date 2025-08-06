import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane, FaClock } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setStatus('Message sent successfully!');
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Clear success message after 5 seconds
    setTimeout(() => setStatus(''), 5000);
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="contact-icon" />,
      title: 'Our Location',
      description: '123 Business Street, City, Country',
      link: 'https://maps.google.com'
    },
    {
      icon: <FaPhone className="contact-icon" />,
      title: 'Phone Number',
      description: '+1 234 567 8900',
      link: 'tel:+12345678900'
    },
    {
      icon: <FaEnvelope className="contact-icon" />,
      title: 'Email Address',
      description: 'info@example.com',
      link: 'mailto:info@example.com'
    },
    {
      icon: <FaClock className="contact-icon" />,
      title: 'Working Hours',
      description: 'Mon - Fri: 9:00 - 18:00',
      link: ''
    }
  ];

  return (
    <div className="contact-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with us today.</p>
        </div>
      </section>

      <div className="contact-container">
        {/* Contact Form */}
        <section className="contact-form-section">
          <div className="container">
            <h2>Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Enter subject"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Type your message here..."
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                <FaPaperPlane className="btn-icon" /> Send Message
              </button>
              
              {status && <div className="form-status success">{status}</div>}
            </form>
          </div>
        </section>

        {/* Contact Info */}
        <section className="contact-info-section">
          <div className="container">
            <h2>Contact Information</h2>
            <div className="contact-info-grid">
              {contactInfo.map((item, index) => (
                <div key={index} className="contact-info-card">
                  <div className="contact-info-icon">
                    {item.icon}
                  </div>
                  <h3>{item.title}</h3>
                  {item.link ? (
                    <a href={item.link} className="contact-info-link">
                      {item.description}
                    </a>
                  ) : (
                    <p>{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container">
          <iframe
            title="Our Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425872426493!3d40.74076987932881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sMadison%20Square%20Garden!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Contact;
