// Portfolio Service for managing portfolio data
export const portfolioService = {
  // Get personal information
  getPersonalInfo: () => {
    return {
      name: "Vijay Rathod",
      title: "Full Stack Developer",
      email: "vijayrathod@example.com",
      phone: "+91 (999) 123-4567",
      location: "Aurangabad, Maharashtra, India",
      bio: "I'm Vijay Rathod, a passionate Full Stack Developer with a strong educational background in Computer Science and Information Technology. I specialize in building responsive, scalable web applications using modern technologies and frameworks.",
      image: "/ai1.png",
      resume: "/resume.pdf"
    };
  },

  // Get skills data
  getSkills: () => {
    return {
      frontend: [
        { name: "React.js", level: 95, icon: "fab fa-react" },
        { name: "JavaScript", level: 90, icon: "fab fa-js-square" },
        { name: "TypeScript", level: 85, icon: "fab fa-js-square" },
        { name: "HTML5", level: 95, icon: "fab fa-html5" },
        { name: "CSS3", level: 90, icon: "fab fa-css3-alt" },
        { name: "Tailwind CSS", level: 88, icon: "fas fa-palette" },
        { name: "Bootstrap", level: 85, icon: "fab fa-bootstrap" },
        { name: "Vue.js", level: 80, icon: "fab fa-vuejs" }
      ],
      backend: [
        { name: "Node.js", level: 90, icon: "fab fa-node-js" },
        { name: "Express.js", level: 88, icon: "fas fa-code" },
        { name: "Python", level: 85, icon: "fab fa-python" },
        { name: "Java", level: 80, icon: "fab fa-java" },
        { name: "Spring Boot", level: 75, icon: "fas fa-leaf" },
        { name: "RESTful APIs", level: 92, icon: "fas fa-plug" },
        { name: "GraphQL", level: 70, icon: "fas fa-project-diagram" },
        { name: "Microservices", level: 75, icon: "fas fa-cubes" }
      ],
      database: [
        { name: "MongoDB", level: 85, icon: "fas fa-database" },
        { name: "PostgreSQL", level: 80, icon: "fas fa-database" },
        { name: "MySQL", level: 85, icon: "fas fa-database" },
        { name: "Redis", level: 75, icon: "fas fa-memory" },
        { name: "AWS", level: 80, icon: "fab fa-aws" },
        { name: "Docker", level: 85, icon: "fab fa-docker" },
        { name: "Kubernetes", level: 70, icon: "fas fa-cube" },
        { name: "Firebase", level: 75, icon: "fas fa-fire" }
      ],
      tools: [
        { name: "Git", level: 90, icon: "fab fa-git-alt" },
        { name: "GitHub", level: 88, icon: "fab fa-github" },
        { name: "VS Code", level: 95, icon: "fas fa-code" },
        { name: "Figma", level: 70, icon: "fab fa-figma" },
        { name: "Postman", level: 85, icon: "fas fa-paper-plane" },
        { name: "Jest", level: 80, icon: "fas fa-vial" },
        { name: "Webpack", level: 75, icon: "fas fa-cube" },
        { name: "Agile", level: 85, icon: "fas fa-tasks" }
      ]
    };
  },

  // Get experience data
  getExperience: () => {
    return [
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
  },

  // Get education data
  getEducation: () => {
    return [
      {
        id: 1,
        degree: "Master of Computer Science (MCS)",
        field: "Information Technology",
        institution: "Dr. Babasaheb Ambedkar University, Aurangabad",
        period: "2021 - 2024",
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
  },

  // Get projects data
  getProjects: () => {
    return [
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
        id: 4,
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
        id: 5,
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
        id: 6,
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
        id: 7,
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
        id: 8,
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
        id: 9,
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
  },

  // Get certifications data
  getCertifications: () => {
    return [
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
  },

  // Get social links
  getSocialLinks: () => {
    return [
      { icon: 'fab fa-github', url: 'https://github.com/vijay', label: 'GitHub' },
      { icon: 'fab fa-linkedin', url: 'https://linkedin.com/in/vijay', label: 'LinkedIn' },
      { icon: 'fab fa-twitter', url: 'https://twitter.com/vijay', label: 'Twitter' },
      { icon: 'fab fa-instagram', url: 'https://instagram.com/vijay', label: 'Instagram' }
    ];
  },

  // Get statistics
  getStats: () => {
    return {
      projects: 50,
      experience: 3,
      satisfaction: 100,
      clients: 25
    };
  }
};

export default portfolioService;
