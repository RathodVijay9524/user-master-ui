import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './PortfolioPage.css';

const Projects = () => {
  const [filter, setFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: "AI Chat Boat for All",
      description: "Universal AI chat application with multiple themes and electronic store integration using MCP Server. Features include voice recording, real-time messaging, and customizable chat interfaces.",
      image: "/projectimages/aichatboatforall.jpeg",
      technologies: ["React", "MCP Server", "AI Integration", "WebSocket", "Tailwind CSS"],
      category: "fullstack",
      liveUrl: "https://aichatboat-demo.com",
      githubUrl: "https://github.com/vijayrathod/aichatboat",
      featured: true
    },
    {
      id: 2,
      title: "Authentication & Security System",
      description: "Comprehensive authentication and security system with role-based access control, JWT tokens, and advanced security features. Built with modern security practices and user management.",
      image: "/projectimages/Authintivation and security.jpeg",
      technologies: ["React", "JWT", "Spring Boot", "PostgreSQL", "Security"],
      category: "fullstack",
      liveUrl: "https://auth-security-demo.com",
      githubUrl: "https://github.com/vijayrathod/auth-security",
      featured: true
    },
    {
      id: 3,
      title: "AI-Powered Shopping Experience",
      description: "Revolutionary e-commerce platform with AI-powered product recommendations, personalized shopping experience, and intelligent search capabilities. Features include smart product suggestions, virtual try-on, and automated customer support.",
      image: "/projectimages/AI-powered-shopping-experience.jpeg",
      technologies: ["AI/ML", "React", "Node.js", "Machine Learning", "E-commerce", "Recommendation Engine"],
      category: "ai",
      liveUrl: "https://ai-shopping-demo.com",
      githubUrl: "https://github.com/vijayrathod/ai-shopping-experience",
      featured: true
    },
    {
      id: 4,
      title: "Chat Boat Themes",
      description: "Multiple themed chat interfaces with customizable UI components. Features include dark/light themes, responsive design, and modern chat functionality.",
      image: "/projectimages/chatboattheme1.png",
      technologies: ["React", "CSS3", "JavaScript", "Responsive Design"],
      category: "frontend",
      liveUrl: "https://chatboat-themes-demo.com",
      githubUrl: "https://github.com/vijayrathod/chatboat-themes",
      featured: false
    },
    {
      id: 5,
      title: "Chat Boat with Electronic Store",
      description: "E-commerce integrated chat application using MCP Server. Features include product recommendations, order management, and AI-powered customer support.",
      image: "/projectimages/ChatBoatWithElectronicstoreusingMCPServer.jpeg",
      technologies: ["React", "MCP Server", "E-commerce", "AI", "Node.js"],
      category: "fullstack",
      liveUrl: "https://chatboat-store-demo.com",
      githubUrl: "https://github.com/vijayrathod/chatboat-store",
      featured: true
    },
    {
      id: 6,
      title: "Admin Dashboard",
      description: "Comprehensive admin dashboard with user management, analytics, and system monitoring. Features include real-time data visualization and administrative controls.",
      image: "/projectimages/Dashbaord.png",
      technologies: ["React", "Charts.js", "Admin Panel", "Data Visualization"],
      category: "frontend",
      liveUrl: "https://admin-dashboard-demo.com",
      githubUrl: "https://github.com/vijayrathod/admin-dashboard",
      featured: false
    },
    {
      id: 7,
      title: "Enhanced AI Coding Assistant",
      description: "Advanced AI-powered coding assistant with MCP Server integration. Features include code generation, debugging assistance, and intelligent code suggestions.",
      image: "/projectimages/enhanced-ai-coding-assistant-mcp-server.png",
      technologies: ["AI", "MCP Server", "Code Generation", "Machine Learning"],
      category: "ai",
      liveUrl: "https://ai-coding-assistant-demo.com",
      githubUrl: "https://github.com/vijayrathod/ai-coding-assistant",
      featured: true
    },
    {
      id: 8,
      title: "Hotel Ordering System",
      description: "Complete hotel ordering and management system with menu management, order tracking, and payment integration. Built for hospitality industry needs.",
      image: "/projectimages/Hotel-ordering.jpeg",
      technologies: ["React", "Node.js", "Payment Gateway", "Hotel Management"],
      category: "fullstack",
      liveUrl: "https://hotel-ordering-demo.com",
      githubUrl: "https://github.com/vijayrathod/hotel-ordering",
      featured: false
    },
    {
      id: 9,
      title: "Smart School Management",
      description: "Comprehensive school management system with student records, attendance tracking, grade management, and administrative features.",
      image: "/projectimages/smartSchollMgmt.jpeg",
      technologies: ["React", "School Management", "Database", "Administrative System"],
      category: "fullstack",
      liveUrl: "https://school-management-demo.com",
      githubUrl: "https://github.com/vijayrathod/school-management",
      featured: false
    },
    {
      id: 10,
      title: "Universal Chat Boat",
      description: "Universal chat application with multi-platform support, real-time messaging, and advanced chat features. Built for cross-platform communication.",
      image: "/projectimages/universal-chatboat.png",
      technologies: ["React", "WebSocket", "Real-time", "Cross-platform"],
      category: "frontend",
      liveUrl: "https://universal-chatboat-demo.com",
      githubUrl: "https://github.com/vijayrathod/universal-chatboat",
      featured: false
    }
  ];

  const categories = [
    { id: 'all', label: 'All Projects', count: projects.length },
    { id: 'frontend', label: 'Frontend', count: projects.filter(p => p.category === 'frontend').length },
    { id: 'backend', label: 'Backend', count: projects.filter(p => p.category === 'backend').length },
    { id: 'fullstack', label: 'Full Stack', count: projects.filter(p => p.category === 'fullstack').length },
    { id: 'ai', label: 'AI Projects', count: projects.filter(p => p.category === 'ai').length }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

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
    <section id="projects" className="projects-section">
      <div className="container">
        <motion.div
          className="projects-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title">
              <span className="title-number">05</span>
              Featured Projects
            </h2>
            <p className="section-subtitle">
              A showcase of my recent work and side projects
            </p>
          </motion.div>

          <motion.div className="project-filters" variants={itemVariants}>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`filter-btn ${filter === category.id ? 'active' : ''}`}
                onClick={() => setFilter(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.label}
                <span className="filter-count">({category.count})</span>
              </motion.button>
            ))}
          </motion.div>

          <div className="projects-grid">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className={`project-card ${project.featured ? 'featured' : ''}`}
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                }}
              >
                {project.featured && (
                  <div className="featured-badge">
                    <i className="fas fa-star"></i>
                    Featured
                  </div>
                )}

                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                  <div className="project-overlay">
                    <div className="project-links">
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link live"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className="fas fa-external-link-alt"></i>
                        Live Demo
                      </motion.a>
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link github"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className="fab fa-github"></i>
                        Code
                      </motion.a>
                    </div>
                  </div>
                </div>

                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  
                  <div className="project-technologies">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="projects-cta"
            variants={itemVariants}
          >
            <div className="cta-content">
              <h3>Interested in working together?</h3>
              <p>Let's discuss your next project and bring your ideas to life</p>
              <motion.button
                className="cta-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-envelope"></i>
                Get In Touch
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
