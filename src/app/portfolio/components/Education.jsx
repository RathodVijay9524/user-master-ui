import React from 'react';
import { motion } from 'framer-motion';

const Education = () => {
  const educationData = [
    {
      id: 1,
      degree: "Master of Computer Science (MCS)",
      field: "Information Technology",
      institution: "Dr. BAMU University, Aurangabad",
      period: "2014",
      gpa: "6.1",
      description: "Specialized in Information Technology with focus on computer science fundamentals, software development, and modern technologies. Completed advanced coursework in programming, database management, and system design.",
      achievements: [
        "Completed comprehensive IT curriculum",
        "Developed strong foundation in programming languages",
        "Gained expertise in software development methodologies"
      ],
      courses: ["Programming Languages", "Database Management", "Software Engineering", "Information Systems", "Web Technologies"]
    },
    {
      id: 2,
      degree: "Bachelor of Computer Science (BCS)",
      field: "Computer Science",
      institution: "Dr. Babasaheb Ambedkar University, Aurangabad",
      period: "2018 - 2021",
      gpa: "78%",
      description: "Major in Computer Science with strong foundation in programming, data structures, algorithms, and software engineering. Developed practical skills in various programming languages and technologies.",
      achievements: [
        "Achieved 78% overall performance",
        "Completed multiple programming projects",
        "Gained hands-on experience in software development"
      ],
      courses: ["Data Structures", "Algorithms", "Programming Languages", "Database Systems", "Computer Networks", "Operating Systems"]
    },
    {
      id: 3,
      degree: "Higher Secondary (12th)",
      field: "Science",
      institution: "State Board of Maharashtra",
      period: "2018",
      gpa: "61%",
      description: "Completed 12th grade in Science stream, focusing on Mathematics, Physics, Chemistry, and Biology. Developed analytical and problem-solving skills that laid the foundation for computer science studies.",
      achievements: [
        "Completed Science stream curriculum",
        "Developed strong mathematical foundation",
        "Gained analytical thinking skills"
      ],
      courses: ["Mathematics", "Physics", "Chemistry", "Biology", "English"]
    },
    {
      id: 4,
      degree: "Secondary School (10th)",
      field: "General Studies",
      institution: "State Board of Maharashtra",
      period: "2016",
      gpa: "71%",
      description: "Completed 10th grade with good academic performance. Developed interest in mathematics and science, which led to pursuing computer science in higher education.",
      achievements: [
        "Achieved 71% overall performance",
        "Developed interest in mathematics and science",
        "Active in extracurricular activities"
      ],
      courses: ["Mathematics", "Science", "Social Studies", "English", "Marathi"]
    }
  ];

  const certifications = [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023",
      credential: "AWS-SAA-001"
    },
    {
      name: "Google Cloud Professional Developer",
      issuer: "Google Cloud",
      date: "2023",
      credential: "GCP-PD-001"
    },
    {
      name: "React Developer Certification",
      issuer: "Meta",
      date: "2022",
      credential: "META-REACT-001"
    },
    {
      name: "Node.js Developer Certification",
      issuer: "OpenJS Foundation",
      date: "2022",
      credential: "NODE-CERT-001"
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
    <section id="education" className="education-section">
      <div className="container">
        <motion.div
          className="education-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title">
              <span className="title-number">04</span>
              Education & Certifications
            </h2>
            <p className="section-subtitle">
              My academic journey and professional certifications
            </p>
          </motion.div>

          <div className="education-timeline">
            {educationData.map((edu, index) => (
              <motion.div
                key={edu.id}
                className={`education-item ${index % 2 === 0 ? 'left' : 'right'}`}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="education-content-card">
                  <div className="education-header">
                    <div className="degree-info">
                      <h3 className="degree">{edu.degree}</h3>
                      <h4 className="field">{edu.field}</h4>
                      <p className="institution">{edu.institution}</p>
                    </div>
                    <div className="education-meta">
                      <span className="period">{edu.period}</span>
                      <span className="gpa">GPA: {edu.gpa}</span>
                    </div>
                  </div>
                  
                  <p className="education-description">{edu.description}</p>
                  
                  <div className="education-details">
                    <div className="achievements">
                      <h5>Key Achievements:</h5>
                      <ul>
                        {edu.achievements.map((achievement, achIndex) => (
                          <motion.li 
                            key={achIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: achIndex * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ 
                              x: 10,
                              color: '#3deabf'
                            }}
                          >
                            {achievement}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="courses">
                      <h5>Relevant Courses:</h5>
                      <div className="course-tags">
                        {edu.courses.map((course, courseIndex) => (
                          <motion.span 
                            key={courseIndex} 
                            className="course-tag"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: courseIndex * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ 
                              scale: 1.1,
                              backgroundColor: '#3deabf',
                              color: '#0d1117'
                            }}
                          >
                            {course}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="timeline-marker">
                  <div className="marker-dot">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <div className="marker-line"></div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="certifications-section"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className="certifications-title">Professional Certifications</h3>
            <div className="certifications-grid">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  className="certification-card"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(78, 168, 222, 0.2)",
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="cert-icon">
                    <i className="fas fa-certificate"></i>
                  </div>
                  <div className="cert-info">
                    <h4 className="cert-name">{cert.name}</h4>
                    <p className="cert-issuer">{cert.issuer}</p>
                    <div className="cert-meta">
                      <span className="cert-date">{cert.date}</span>
                      <span className="cert-credential">{cert.credential}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
