import React from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
  const skillCategories = [
    {
      title: "Programming Languages",
      icon: "fas fa-code",
      color: "#4ea8de",
      skills: [
        { name: "Java 8", level: 95, icon: "fab fa-java" },
        { name: "Java", level: 90, icon: "fab fa-java" },
        { name: "WebFlux", level: 85, icon: "fas fa-bolt" },
        { name: "JavaScript", level: 88, icon: "fab fa-js-square" },
        { name: "TypeScript", level: 85, icon: "fab fa-js-square" },
        { name: "HTML5", level: 90, icon: "fab fa-html5" },
        { name: "CSS3", level: 88, icon: "fab fa-css3-alt" }
      ]
    },
    {
      title: "Frameworks & Technologies",
      icon: "fas fa-server",
      color: "#ff4c60",
      skills: [
        { name: "Spring Boot", level: 95, icon: "fas fa-leaf" },
        { name: "Spring Security", level: 90, icon: "fas fa-shield-alt" },
        { name: "Spring AOP", level: 85, icon: "fas fa-cogs" },
        { name: "Spring Data JPA", level: 90, icon: "fas fa-database" },
        { name: "Angular", level: 88, icon: "fab fa-angular" },
        { name: "React", level: 85, icon: "fab fa-react" },
        { name: "RxJS", level: 80, icon: "fas fa-sync" },
        { name: "NgRx", level: 75, icon: "fas fa-store" }
      ]
    },
    {
      title: "MCP Server & AI Technologies",
      icon: "fas fa-robot",
      color: "#3deabf",
      skills: [
        { name: "MCP Server", level: 95, icon: "fas fa-server" },
        { name: "RAG (Retrieval Augmented Generation)", level: 90, icon: "fas fa-brain" },
        { name: "Spring AI", level: 88, icon: "fas fa-ai" },
        { name: "Universal ChatBoat", level: 92, icon: "fas fa-comments" },
        { name: "AI Integration", level: 85, icon: "fas fa-robot" },
        { name: "Machine Learning", level: 80, icon: "fas fa-chart-line" },
        { name: "Natural Language Processing", level: 75, icon: "fas fa-language" }
      ]
    },
    {
      title: "Databases & DevOps",
      icon: "fas fa-database",
      color: "#c084fc",
      skills: [
        { name: "MySQL", level: 90, icon: "fas fa-database" },
        { name: "Oracle", level: 85, icon: "fas fa-database" },
        { name: "Redis", level: 80, icon: "fas fa-memory" },
        { name: "Maven", level: 90, icon: "fas fa-tools" },
        { name: "Git", level: 88, icon: "fab fa-git-alt" },
        { name: "Jenkins", level: 85, icon: "fab fa-jenkins" },
        { name: "Docker", level: 88, icon: "fab fa-docker" },
        { name: "Kubernetes", level: 80, icon: "fas fa-cube" }
      ]
    },
    {
      title: "Microservices & Event-Driven",
      icon: "fas fa-microservices",
      color: "#f59e0b",
      skills: [
        { name: "Microservices Architecture", level: 92, icon: "fas fa-cubes" },
        { name: "Kafka", level: 88, icon: "fas fa-stream" },
        { name: "Saga Patterns", level: 85, icon: "fas fa-project-diagram" },
        { name: "CQRS", level: 80, icon: "fas fa-sync-alt" },
        { name: "Event-Driven Architecture", level: 88, icon: "fas fa-bolt" },
        { name: "Eureka", level: 75, icon: "fas fa-search" },
        { name: "Zipkin", level: 70, icon: "fas fa-search-plus" },
        { name: "Sleuth", level: 75, icon: "fas fa-eye" }
      ]
    },
    {
      title: "Testing & Monitoring",
      icon: "fas fa-bug",
      color: "#ef4444",
      skills: [
        { name: "JUnit", level: 90, icon: "fas fa-vial" },
        { name: "Mockito", level: 85, icon: "fas fa-mock" },
        { name: "Postman", level: 88, icon: "fab fa-postman" },
        { name: "Insomnia", level: 80, icon: "fas fa-moon" },
        { name: "Log4j", level: 85, icon: "fas fa-file-alt" },
        { name: "Splunk", level: 75, icon: "fas fa-chart-bar" },
        { name: "Putty", level: 80, icon: "fas fa-terminal" },
        { name: "Boot Admin", level: 70, icon: "fas fa-tachometer-alt" }
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
          animate="visible"
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
                animate="visible"
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
                      animate="visible"
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
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1.5, delay: skillIndex * 0.1 }}
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
            animate="visible"
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
