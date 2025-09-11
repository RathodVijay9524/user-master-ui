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
      title: "Senior Full Stack Developer",
      company: "Tech Solutions Inc.",
      period: "2023 - Present",
      location: "Remote",
      description: "Leading development of enterprise-grade web applications using React, Node.js, and cloud technologies. Mentoring junior developers and implementing best practices.",
      technologies: ["React", "Node.js", "AWS", "Docker", "MongoDB"],
      achievements: [
        "Improved application performance by 40%",
        "Led team of 5 developers",
        "Implemented CI/CD pipelines"
      ]
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "Digital Innovations",
      period: "2022 - 2023",
      location: "New York, NY",
      description: "Developed and maintained multiple client projects using modern web technologies. Collaborated with cross-functional teams to deliver high-quality solutions.",
      technologies: ["Vue.js", "Express.js", "PostgreSQL", "Redis"],
      achievements: [
        "Delivered 15+ successful projects",
        "Reduced bug reports by 60%",
        "Implemented automated testing"
      ]
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "WebCraft Studio",
      period: "2021 - 2022",
      location: "San Francisco, CA",
      description: "Specialized in creating responsive and interactive user interfaces. Worked closely with designers to implement pixel-perfect designs.",
      technologies: ["React", "TypeScript", "Sass", "Webpack"],
      achievements: [
        "Built 20+ responsive websites",
        "Improved user engagement by 35%",
        "Established coding standards"
      ]
    },
    {
      id: 4,
      title: "Junior Developer",
      company: "StartupHub",
      period: "2020 - 2021",
      location: "Austin, TX",
      description: "Started my professional journey building web applications and learning industry best practices. Contributed to various projects and gained valuable experience.",
      technologies: ["JavaScript", "HTML5", "CSS3", "jQuery"],
      achievements: [
        "Completed 10+ learning projects",
        "Contributed to open source",
        "Earned first professional certifications"
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
