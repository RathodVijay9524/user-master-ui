import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Hero = ({ onNavigate }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Simple particle animation
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(78, 168, 222, ${particle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <section id="hero" className="hero-section">
      {/* Animated Background */}
      <canvas ref={canvasRef} className="particles-canvas" />
      
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-image" variants={itemVariants}>
          <div className="image-container">
            <img src="/genralimages/Generated Image August 31, 2025 - 11_57PM.jpeg" alt="Vijay Rathod - Full Stack Developer" />
            <div className="image-glow"></div>
            <div className="image-overlay-gradient"></div>
            <div className="hero-floating-particles">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
              <div className="particle particle-4"></div>
              <div className="particle particle-5"></div>
            </div>
          </div>
        </motion.div>

        <motion.div className="hero-text" variants={itemVariants}>
            <motion.h1 
              className="hero-title"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <span className="greeting">Hello, I'm</span>
              <span className="name">Vijay Rathod</span>
              <span className="title-text">
                <span className="typing-text">Senior Software Engineer</span>
              </span>
            </motion.h1>

          <motion.p 
            className="hero-description"
            variants={itemVariants}
          >
            Experienced Software Engineer with 4.5+ years in Java 8, Spring Boot, Microservices, 
            Angular, and React. Expert in MCP Server with RAG, Spring AI, and Universal ChatBoat creation.
          </motion.p>

          <motion.div 
            className="hero-buttons"
            variants={itemVariants}
          >
            <motion.button
              className="btn-primary"
              onClick={() => onNavigate('projects')}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(78, 168, 222, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-rocket"></i>
              View My Work
            </motion.button>
            
            <motion.button
              className="btn-secondary"
              onClick={() => onNavigate('contact')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-envelope"></i>
              Get In Touch
            </motion.button>
          </motion.div>

          <motion.div 
            className="hero-stats"
            variants={itemVariants}
          >
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Client Satisfaction</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => onNavigate('about')}
      >
        <div className="scroll-arrow">
          <i className="fas fa-chevron-down"></i>
        </div>
        <span>Scroll Down</span>
      </motion.div>
    </section>
  );
};

export default Hero;
