import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
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

  const skills = [
    { name: 'Frontend Development', level: 95, color: '#4ea8de' },
    { name: 'Backend Development', level: 90, color: '#ff4c60' },
    { name: 'Database Design', level: 85, color: '#3deabf' },
    { name: 'Cloud Services', level: 80, color: '#c084fc' },
    { name: 'DevOps', level: 75, color: '#facc15' }
  ];

  return (
    <section id="about" className="about-section">
      <div className="container">
        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="about-text" variants={itemVariants}>
            <h2 className="section-title">
              <span className="title-number">01</span>
              About Me
            </h2>
            
            <div className="about-description">
            <p>
              I'm Vijay Rathod, an experienced Software Engineer with 4.5+ years of expertise 
              in Java 8, Spring Boot, Microservices, Angular, and React. I specialize in 
              building secure REST APIs, implementing JWT, Spring Security, and transaction 
              management for enterprise applications.
            </p>

            <p>
              With hands-on experience in event-driven architecture using Kafka, Saga patterns 
              (Orchestration & Choreography), and CQRS, I've worked with top clients like 
              Barclays, Infosys, IBM, and Accenture. I'm also an expert in MCP Server with RAG, 
              Spring AI, and Universal ChatBoat creation, bringing cutting-edge AI technologies 
              to enterprise solutions.
            </p>
            </div>

            <motion.div 
              className="about-highlights"
              variants={itemVariants}
            >
              <div className="highlight-item">
                <i className="fas fa-server"></i>
                <div>
                  <h4>MCP Server & RAG Expert</h4>
                  <p>Specialized in MCP Server with RAG and Spring AI implementation</p>
                </div>
              </div>
              
              <div className="highlight-item">
                <i className="fas fa-robot"></i>
                <div>
                  <h4>Universal ChatBoat Creation</h4>
                  <p>Expert in building AI-powered chat applications and bots</p>
                </div>
              </div>
              
              <div className="highlight-item">
                <i className="fas fa-microservices"></i>
                <div>
                  <h4>Microservices Architecture</h4>
                  <p>4.5+ years experience in event-driven microservices with Kafka</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div className="about-skills" variants={itemVariants}>
            <h3>Technical Skills</h3>
            <div className="skills-container">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  className="skill-item"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="skill-header">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percentage">{skill.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <motion.div
                      className="skill-progress"
                      style={{ backgroundColor: skill.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="about-image"
          variants={itemVariants}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="image-wrapper">
            <img src="/genralimages/Generated Image September 01, 2025 - 12_02AM.jpeg" alt="About Vijay Rathod" />
            <div className="image-overlay">
              <div className="overlay-content">
                <h4>Let's Work Together</h4>
                <p>Ready to bring your ideas to life</p>
              </div>
            </div>
            <div className="image-floating-elements">
              <div className="floating-element element-1"></div>
              <div className="floating-element element-2"></div>
              <div className="floating-element element-3"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
