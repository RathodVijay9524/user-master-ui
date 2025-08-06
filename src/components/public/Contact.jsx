import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane, FaClock } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setStatus('Message sent successfully!');
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Clear success message after 5 seconds
    setTimeout(() => setStatus(''), 5000);
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="text-2xl text-emerald-600" />,
      title: 'Our Location',
      description: '123 Business Street, City, Country',
      link: 'https://maps.google.com'
    },
    {
      icon: <FaPhone className="text-2xl text-emerald-600" />,
      title: 'Phone Number',
      description: '+1 234 567 8900',
      link: 'tel:+12345678900'
    },
    {
      icon: <FaEnvelope className="text-2xl text-emerald-600" />,
      title: 'Email Address',
      description: 'info@example.com',
      link: 'mailto:info@example.com'
    },
    {
      icon: <FaClock className="text-2xl text-emerald-600" />,
      title: 'Working Hours',
      description: 'Mon - Fri: 9:00 - 18:00',
      link: ''
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
            Contact Us
          </h1>
          <p className="text-xl text-emerald-100">
            We'd love to hear from you. Get in touch with us today.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <section className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="block w-full pl-4 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition duration-200 bg-white shadow-sm hover:shadow-md"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full pl-4 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition duration-200 bg-white shadow-sm hover:shadow-md"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="block w-full pl-4 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition duration-200 bg-white shadow-sm hover:shadow-md"
                    placeholder="Enter subject"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="block w-full pl-4 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition duration-200 bg-white shadow-sm hover:shadow-md"
                    placeholder="Type your message here..."
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 focus:ring-4 focus:ring-emerald-300 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FaPaperPlane className="mr-2" /> Send Message
              </button>
              
              {/* Status Message */}
              {status && (
                <div className="mt-4 p-3 bg-emerald-100 text-emerald-800 rounded-lg text-center">
                  {status}
                </div>
              )}
            </form>
          </section>

          {/* Contact Info */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-200 border border-gray-100"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-emerald-50 rounded-full">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
                      {item.link ? (
                        <a 
                          href={item.link} 
                          className="text-gray-600 hover:text-emerald-600 transition-colors duration-200"
                        >
                          {item.description}
                        </a>
                      ) : (
                        <p className="text-gray-600">{item.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Section */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Location</h3>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe
                  title="Our Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425872426493!3d40.74076987932881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sMadison%20Square%20Garden!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;