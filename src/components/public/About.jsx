import React from 'react';
import { FaCode, FaUsers, FaRocket, FaHeart } from 'react-icons/fa';
import './About.css';

const About = () => {
  const teamMembers = [
    {
      name: 'John Doe',
      role: 'Lead Developer',
      bio: 'Full-stack developer with 8+ years of experience in building scalable web applications.',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      name: 'Jane Smith',
      role: 'UI/UX Designer',
      bio: 'Passionate about creating beautiful and intuitive user experiences.',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      name: 'Alex Johnson',
      role: 'Backend Engineer',
      bio: 'Specializes in building robust and secure backend systems.',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    }
  ];

  return (
    <div className="about-page">
      <section className="page-header">
        <div className="container">
          <h1>About Us</h1>
          <p>Learn more about our team and the technology behind our platform</p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                We are a passionate team of developers and designers dedicated to creating innovative solutions 
                that make a difference. Our platform was built with the goal of simplifying complex processes 
                and delivering exceptional user experiences.
              </p>
              
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaCode />
                  </div>
                  <h3>Modern Technology</h3>
                  <p>Built with the latest web technologies for optimal performance</p>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaUsers />
                  </div>
                  <h3>User-Centric</h3>
                  <p>Designed with the end-user in mind for maximum usability</p>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaRocket />
                  </div>
                  <h3>Fast & Reliable</h3>
                  <p>Optimized for speed and reliability</p>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaHeart />
                  </div>
                  <h3>Made with Love</h3>
                  <p>Passionately developed by our dedicated team</p>
                </div>
              </div>
            </div>
          </div>

          <div className="team-section">
            <h2>Meet Our Team</h2>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-member">
                  <div className="member-avatar">
                    <img src={member.avatar} alt={member.name} />
                  </div>
                  <h3>{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-bio">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="tech-stack">
            <h2>Technology Stack</h2>
            <div className="tech-grid">
              <div className="tech-item">
                <h3>Frontend</h3>
                <ul>
                  <li>React.js</li>
                  <li>Redux</li>
                  <li>React Router</li>
                  <li>Styled Components</li>
                </ul>
              </div>
              
              <div className="tech-item">
                <h3>Backend</h3>
                <ul>
                  <li>Node.js</li>
                  <li>Express</li>
                  <li>MongoDB</li>
                  <li>RESTful API</li>
                </ul>
              </div>
              
              <div className="tech-item">
                <h3>DevOps</h3>
                <ul>
                  <li>Docker</li>
                  <li>AWS</li>
                  <li>GitHub Actions</li>
                  <li>CI/CD</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
