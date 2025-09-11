import React from 'react';
import { motion } from 'framer-motion';
import ImageCarousel from './ImageCarousel';
import './PortfolioPage.css';

const Experience = () => {
  // Experience images for carousel
  const experienceImages = [
    "/genralimages/Generated Image August 31, 2025 - 11_45PM (1).jpeg",
    "/genralimages/Generated Image August 31, 2025 - 11_51PM.jpeg",
    "/genralimages/Generated Image August 31, 2025 - 11_54PM.jpeg",
    "/genralimages/Generated Image August 31, 2025 - 11_56PM.jpeg",
    "/genralimages/Generated Image August 31, 2025 - 11_57PM.jpeg",
    "/genralimages/Generated Image September 01, 2025 - 12_02AM.jpeg",
    "/genralimages/Generated Image September 01, 2025 - 12_03AM.jpeg",
    "/genralimages/Generated Image September 01, 2025 - 12_09AM.jpeg",
    "/genralimages/Generated Image September 01, 2025 - 12_14AM.jpeg",
    "/genralimages/Generated Image September 01, 2025 - 12_20AM.jpeg",
    "/genralimages/Generated Image September 01, 2025 - 12_25AM.jpeg"
  ];

  const experiences = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Talent-Ployer (Payroll) | Client: Infosys | End Client: Barclays",
      period: "May 2024 - Present",
      location: "Pune, India",
      description: "Developing business banking applications and backend APIs using Java, Spring Boot, and React. Working on secure microservices architecture for financial services.",
      technologies: ["Java", "Spring Boot", "React", "Microservices", "JWT", "Spring Security"],
      achievements: [
        "Developed business banking applications and backend APIs",
        "Implemented secure microservices architecture",
        "Worked with top-tier financial client (Barclays)"
      ]
    },
    {
      id: 2,
      title: "Software Engineer",
      company: "Civica, Vadodara (Remote - Pune)",
      period: "May 2023 - May 2024",
      location: "Pune, India",
      description: "Built UI and backend APIs for Australian local government platform using Java, Spring Boot, and Angular. Implemented event-driven architecture with Kafka.",
      technologies: ["Java", "Spring Boot", "Angular", "Kafka", "Microservices", "Event-Driven Architecture"],
      achievements: [
        "Built UI and backend APIs for Australian local government platform",
        "Implemented event-driven architecture with Kafka",
        "Worked on international government projects"
      ]
    },
    {
      id: 3,
      title: "Software Engineer",
      company: "IBM, Pune (Payroll: Primus Globule)",
      period: "Dec 2022 - Feb 2023",
      location: "Pune, India",
      description: "Developed logistics microservices for Navistar's WMS platform using Java, Spring Boot, and Angular. Implemented Saga patterns and CQRS for scalable systems.",
      technologies: ["Java", "Spring Boot", "Angular", "Saga Patterns", "CQRS", "WMS"],
      achievements: [
        "Developed logistics microservices for Navistar's WMS platform",
        "Implemented Saga patterns (Orchestration & Choreography)",
        "Worked with enterprise logistics systems"
      ]
    },
    {
      id: 4,
      title: "Software Engineer",
      company: "Accenture, Pune (Payroll: Primus Globule)",
      period: "June 2021 - June 2022",
      location: "Pune, India",
      description: "Worked on secure microservices and enterprise UI development using Java, Spring Boot, and Angular. Implemented CI/CD pipelines and DevOps practices.",
      technologies: ["Java", "Spring Boot", "Angular", "CI/CD", "DevOps", "Enterprise Applications"],
      achievements: [
        "Worked on secure microservices and enterprise UI development",
        "Implemented CI/CD pipelines using Jenkins and Docker",
        "Gained experience in enterprise development practices"
      ]
    }
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
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="experience" className="experience-section">
      <div className="container">
        <motion.div
          className="experience-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title">
              <span className="title-number">02</span>
              Work Experience
            </h2>
            <p className="section-subtitle">
              My professional journey and the experiences that shaped my career
            </p>
          </motion.div>

          {/* Experience Images Carousel */}
          <motion.div 
            className="experience-carousel-container"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <ImageCarousel 
              images={experienceImages} 
              autoPlay={true} 
              interval={5000}
            />
          </motion.div>

          <div className="timeline-container">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                variants={itemVariants}
              >
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h3 className="job-title">{exp.title}</h3>
                    <div className="job-meta">
                      <span className="company">{exp.company}</span>
                      <span className="period">{exp.period}</span>
                      <span className="location">{exp.location}</span>
                    </div>
                  </div>
                  
                  <p className="job-description">{exp.description}</p>
                  
                  <div className="technologies">
                    <h4>Technologies Used:</h4>
                    <div className="tech-tags">
                      {exp.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="achievements">
                    <h4>Key Achievements:</h4>
                    <ul>
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  <div className="marker-line"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
