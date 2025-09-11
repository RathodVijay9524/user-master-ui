import React from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: "fas fa-laptop-code",
      color: "#4ea8de",
      skills: [
        { name: "React.js", level: 95, icon: "fab fa-react" },
        { name: "JavaScript", level: 90, icon: "fab fa-js-square" },
        { name: "TypeScript", level: 85, icon: "fab fa-js-square" },
        { name: "HTML5", level: 95, icon: "fab fa-html5" },
        { name: "CSS3", level: 90, icon: "fab fa-css3-alt" },
        { name: "Tailwind CSS", level: 88, icon: "fas fa-palette" },
        { name: "Bootstrap", level: 85, icon: "fab fa-bootstrap" },
        { name: "Vue.js", level: 80, icon: "fab fa-vuejs" }
      ]
    },
    {
      title: "Backend Development",
      icon: "fas fa-server",
      color: "#ff4c60",
      skills: [
        { name: "Node.js", level: 90, icon: "fab fa-node-js" },
        { name: "Express.js", level: 88, icon: "fas fa-code" },
        { name: "Python", level: 85, icon: "fab fa-python" },
        { name: "Java", level: 80, icon: "fab fa-java" },
        { name: "Spring Boot", level: 75, icon: "fas fa-leaf" },
        { name: "RESTful APIs", level: 92, icon: "fas fa-plug" },
        { name: "GraphQL", level: 70, icon: "fas fa-project-diagram" },
        { name: "Microservices", level: 75, icon: "fas fa-cubes" }
      ]
    },
    {
      title: "Database & Cloud",
      icon: "fas fa-database",
      color: "#3deabf",
      skills: [
        { name: "MongoDB", level: 85, icon: "fas fa-database" },
        { name: "PostgreSQL", level: 80, icon: "fas fa-database" },
        { name: "MySQL", level: 85, icon: "fas fa-database" },
        { name: "Redis", level: 75, icon: "fas fa-memory" },
        { name: "AWS", level: 80, icon: "fab fa-aws" },
        { name: "Docker", level: 85, icon: "fab fa-docker" },
        { name: "Kubernetes", level: 70, icon: "fas fa-cube" },
        { name: "Firebase", level: 75, icon: "fas fa-fire" }
      ]
    },
    {
      title: "Tools & Others",
      icon: "fas fa-tools",
      color: "#c084fc",
      skills: [
        { name: "Git", level: 90, icon: "fab fa-git-alt" },
        { name: "GitHub", level: 88, icon: "fab fa-github" },
        { name: "VS Code", level: 95, icon: "fas fa-code" },
        { name: "Figma", level: 70, icon: "fab fa-figma" },
        { name: "Postman", level: 85, icon: "fas fa-paper-plane" },
        { name: "Jest", level: 80, icon: "fas fa-vial" },
        { name: "Webpack", level: 75, icon: "fas fa-cube" },
        { name: "Agile", level: 85, icon: "fas fa-tasks" }
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

  const categoryVariants = {
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

  const skillVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <motion.div
          className="skills-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="section-header" variants={categoryVariants}>
            <h2 className="section-title">
              <span className="title-number">03</span>
              Skills & Expertise
            </h2>
            <p className="section-subtitle">
              Technologies and tools I work with to create amazing digital experiences
            </p>
          </motion.div>

          <div className="skills-grid">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                className="skill-category"
                variants={categoryVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="category-header">
                  <div 
                    className="category-icon"
                    style={{ backgroundColor: category.color }}
                  >
                    <i className={category.icon}></i>
                  </div>
                  <h3 className="category-title">{category.title}</h3>
                </div>

                <div className="skills-list">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      className="skill-item"
                      variants={skillVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: skillIndex * 0.1 }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: `0 10px 30px ${category.color}20`
                      }}
                    >
                      <div className="skill-info">
                        <div className="skill-icon">
                          <i className={skill.icon}></i>
                        </div>
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                      
                      <div className="skill-bar">
                        <motion.div
                          className="skill-progress"
                          style={{ backgroundColor: category.color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1.5, delay: skillIndex * 0.1 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="skills-summary"
            variants={categoryVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="summary-card">
              <h3>Why Choose Me?</h3>
              <div className="summary-points">
                <div className="summary-point">
                  <i className="fas fa-check-circle"></i>
                  <span>3+ Years of Professional Experience</span>
                </div>
                <div className="summary-point">
                  <i className="fas fa-check-circle"></i>
                  <span>50+ Successful Projects Delivered</span>
                </div>
                <div className="summary-point">
                  <i className="fas fa-check-circle"></i>
                  <span>Continuous Learning & Growth</span>
                </div>
                <div className="summary-point">
                  <i className="fas fa-check-circle"></i>
                  <span>Client-Focused Approach</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
