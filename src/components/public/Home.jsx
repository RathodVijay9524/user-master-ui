import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaTools,
  FaLaptopCode,
  FaMobileAlt,
  FaDatabase,
  FaArrowRight,
  FaRocket,
  FaShieldAlt,
  FaUsers,
  FaChartLine,
  FaCog,
  FaBrain,
  FaServer,
  FaCheckCircle,
  FaStar,
  FaQuoteLeft,
  FaPlay,
  FaDownload
} from 'react-icons/fa';

import './Home.css';

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fullSentence = 'Building the Future with Modern Technology';

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (isDeleting) {
        // Delete the current text
        setTypingText(prev => prev.substring(0, prev.length - 1));
        if (typingText === '') {
          setIsDeleting(false);
        }
      } else {
        // Type the next character
        setTypingText(prev => {
          if (prev === fullSentence) {
            // All text complete, wait then start deleting
            setTimeout(() => setIsDeleting(true), 3000);
            return prev;
          }
          return fullSentence.substring(0, prev.length + 1);
        });
      }
    }, isDeleting ? 30 : 150); // Faster when deleting

    return () => clearInterval(typingInterval);
  }, [typingText, isDeleting, fullSentence]);

  const services = [
    {
      icon: () => <FaLaptopCode className="service-icon" />,
      title: 'Full Stack Development',
      description: 'End-to-end web applications with React, Node.js, and modern frameworks.',
      color: '#4ea8de'
    },
    {
      icon: () => <FaBrain className="service-icon" />,
      title: 'AI & MCP Solutions',
      description: 'MCP Server with RAG, Spring AI, and Universal ChatBoat creation.',
      color: '#ff4c60'
    },
    {
      icon: () => <FaServer className="service-icon" />,
      title: 'Microservices Architecture',
      description: 'Scalable microservices with Kafka, Saga patterns, and event-driven design.',
      color: '#3deabf'
    },
    {
      icon: () => <FaShieldAlt className="service-icon" />,
      title: 'Enterprise Security',
      description: 'JWT authentication, Spring Security, and secure API development.',
      color: '#c084fc'
    }
  ];

  const features = [
    {
      icon: () => <FaRocket className="feature-icon" />,
      title: 'Lightning Fast',
      description: 'Optimized performance with modern technologies and best practices.'
    },
    {
      icon: () => <FaUsers className="feature-icon" />,
      title: 'User Centered',
      description: 'Intuitive design focused on exceptional user experience.'
    },
    {
      icon: () => <FaChartLine className="feature-icon" />,
      title: 'Scalable Solutions',
      description: 'Built to grow with your business needs and requirements.'
    },
    {
      icon: () => <FaCog className="feature-icon" />,
      title: 'Maintenance Free',
      description: 'Automated deployments and continuous monitoring.'
    }
  ];

  const stats = [
    { number: '4.5+', label: 'Years Experience' },
    { number: '50+', label: 'Projects Delivered' },
    { number: '100%', label: 'Client Satisfaction' },
    { number: '24/7', label: 'Support Available' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CTO, TechCorp',
      content: 'Vijay delivered an exceptional microservices solution that scaled perfectly with our growth. His expertise in Spring Boot and Kafka is outstanding.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager, StartupXYZ',
      content: 'The MCP Server with RAG implementation exceeded our expectations. The AI-powered features are game-changing for our business.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'CEO, InnovateLab',
      content: 'Professional, reliable, and incredibly skilled. Vijay transformed our legacy system into a modern, secure platform.',
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <FaStar className="badge-icon" />
            <span>Senior Software Engineer</span>
          </div>
          
          <div className="hero-title-container">
            <h1 className="hero-title">
              <span className="hero-typing-text">
                <span className="typing-words">
                  {typingText}
                </span>
                <span className="typing-cursor">|</span>
              </span>
            </h1>
          </div>
          
          <p className="hero-description">
            Experienced Software Engineer specializing in Java, Spring Boot, Microservices, 
            and cutting-edge AI solutions including MCP Server with RAG and Universal ChatBoat creation.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-buttons">
            <Link to="/portfolio" className="hero-btn portfolio-btn">
              <span className="btn-icon">👨‍💻</span>
              <span className="btn-text">View Portfolio</span>
            </Link>
            <Link to="/login" className="hero-btn login-btn">
              <span className="btn-icon">🔐</span>
              <span className="btn-text">Login</span>
            </Link>
            <Link to="/chat" className="hero-btn chat-btn">
              <span className="btn-icon">💬</span>
              <span className="btn-text">Chat Boat</span>
            </Link>
          </div>
          
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Our Solutions?</h2>
            <p>Cutting-edge technology meets exceptional user experience</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-container">
                  {feature.icon()}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="container">
          <div className="section-header">
            <h2>Our Expertise</h2>
            <p>Comprehensive solutions for modern businesses</p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card" style={{ '--service-color': service.color }}>
                <div className="service-icon-container">
                  {service.icon()}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-arrow">
                  <FaArrowRight />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Clients Say</h2>
            <p>Real feedback from satisfied customers</p>
          </div>
          <div className="testimonial-container">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <FaQuoteLeft className="quote-icon" />
                <p>{testimonials[currentTestimonial].content}</p>
                <div className="testimonial-rating">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <FaStar key={i} className="star" />
                  ))}
                </div>
              </div>
              <div className="testimonial-author">
                <h4>{testimonials[currentTestimonial].name}</h4>
                <p>{testimonials[currentTestimonial].role}</p>
              </div>
            </div>
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Business?</h2>
            <p>Let's build something amazing together. Get started with our professional development services.</p>
            <div className="cta-buttons-group">
              <Link to="/register" className="btn primary large">
                <FaDownload className="btn-icon" />
                Start Your Project
              </Link>
              <Link to="/portfolio" className="btn secondary large">
                <FaPlay className="btn-icon" />
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
