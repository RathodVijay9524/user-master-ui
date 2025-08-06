import React from 'react';
import { FaCode, FaUsers, FaRocket, FaHeart } from 'react-icons/fa';

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
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-800 text-white py-20 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-16 left-16 w-40 h-40 bg-white bg-opacity-10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-24 right-20 w-56 h-56 bg-blue-400 bg-opacity-20 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
            About Us
          </h1>
          <p className="text-xl text-emerald-100">
            Learn more about our team and the technology behind our platform
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Our Story Section */}
        <section className="mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-8">
              We are a passionate team of developers and designers dedicated to creating innovative solutions 
              that make a difference. Our platform was built with the goal of simplifying complex processes 
              and delivering exceptional user experiences.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Modern Technology */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition duration-200">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full">
                  <FaCode className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Modern Technology</h3>
                <p className="text-gray-600">Built with the latest web technologies for optimal performance</p>
              </div>
              
              {/* User-Centric */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition duration-200">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full">
                  <FaUsers className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">User-Centric</h3>
                <p className="text-gray-600">Designed with the end-user in mind for maximum usability</p>
              </div>
              
              {/* Fast & Reliable */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition duration-200">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full">
                  <FaRocket className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast & Reliable</h3>
                <p className="text-gray-600">Optimized for speed and reliability</p>
              </div>
              
              {/* Made with Love */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition duration-200">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full">
                  <FaHeart className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Made with Love</h3>
                <p className="text-gray-600">Passionately developed by our dedicated team</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-200 text-center"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-emerald-100">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-emerald-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Frontend */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Frontend</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  React.js
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  Redux
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  React Router
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  Tailwind CSS
                </li>
              </ul>
            </div>
            
            {/* Backend */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Backend</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  Node.js
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  Express
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  MongoDB
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  RESTful API
                </li>
              </ul>
            </div>
            
            {/* DevOps */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">DevOps</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  Docker
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  AWS
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  GitHub Actions
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  CI/CD
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;