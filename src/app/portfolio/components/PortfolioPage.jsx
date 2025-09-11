import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import About from './About';
import Experience from './Experience';
import Skills from './Skills';
import Education from './Education';
import Projects from './Projects';
import Contact from './Contact';
import PortfolioNavbar from './PortfolioNavbar';
import Hero from './Hero';
import './PortfolioPage.css';

const PortfolioPage = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'experience', 'skills', 'education', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };


    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="portfolio-container">
      {/* Animated Background */}
      <div className="portfolio-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Navigation */}
      <PortfolioNavbar 
        activeSection={activeSection} 
        onNavigate={scrollToSection}
      />

      {/* Hero Section */}
      <Hero onNavigate={scrollToSection} />

      {/* About Section */}
      <About />

      {/* Experience Section */}
      <Experience />

      {/* Skills Section */}
      <Skills />

      {/* Education Section */}
      <Education />

      {/* Projects Section */}
      <Projects />

      {/* Contact Section */}
      <Contact />

      {/* Scroll to Top Button */}
      <motion.button
        className="scroll-to-top"
        onClick={() => scrollToSection('hero')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <i className="fas fa-arrow-up"></i>
      </motion.button>

    </div>
  );
};

export default PortfolioPage;
