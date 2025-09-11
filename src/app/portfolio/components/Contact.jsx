import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      value: 'vijayrathod@example.com',
      link: 'mailto:vijayrathod@example.com'
    },
    {
      icon: 'fas fa-phone',
      title: 'Phone',
      value: '+91 (999) 123-4567',
      link: 'tel:+919991234567'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Location',
      value: 'Aurangabad, Maharashtra, India',
      link: '#'
    },
    {
      icon: 'fas fa-clock',
      title: 'Available',
      value: 'Mon - Fri, 9AM - 6PM IST',
      link: '#'
    }
  ];

  const socialLinks = [
    { icon: 'fab fa-github', url: 'https://github.com/vijayrathod', label: 'GitHub' },
    { icon: 'fab fa-linkedin', url: 'https://linkedin.com/in/vijayrathod', label: 'LinkedIn' },
    { icon: 'fab fa-twitter', url: 'https://twitter.com/vijayrathod', label: 'Twitter' },
    { icon: 'fab fa-instagram', url: 'https://instagram.com/vijayrathod', label: 'Instagram' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <motion.div
          className="contact-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title">
              <span className="title-number">06</span>
              Get In Touch
            </h2>
            <p className="section-subtitle">
              Ready to start your next project? Let's work together!
            </p>
          </motion.div>

          <div className="contact-grid">
            <motion.div 
              className="contact-info"
              variants={itemVariants}
            >
              <h3>Let's Connect</h3>
              <p>
                I'm always interested in new opportunities and exciting projects. 
                Whether you have a question or just want to say hi, I'll try my 
                best to get back to you!
              </p>

              <div className="contact-details">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.link}
                    className="contact-item"
                    whileHover={{ x: 10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="contact-icon">
                      <i className={info.icon}></i>
                    </div>
                    <div className="contact-text">
                      <h4>{info.title}</h4>
                      <p>{info.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              <div className="social-links">
                <h4>Follow Me</h4>
                <div className="social-icons">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={social.label}
                    >
                      <i className={social.icon}></i>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="contact-form-container"
              variants={itemVariants}
            >
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="What's this about?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    placeholder="Tell me about your project or idea..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Send Message
                    </>
                  )}
                </motion.button>

                {submitStatus === 'success' && (
                  <motion.div
                    className="success-message"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <i className="fas fa-check-circle"></i>
                    Message sent successfully! I'll get back to you soon.
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
