import React from 'react';
import { useSelector } from 'react-redux';
import { FaTools, FaListAlt, FaClock, FaCheckCircle, FaUser } from 'react-icons/fa';
import './WorkerDashboard.css';
const WorkerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const stats = [
    { title: 'Assigned Tasks', value: '24', icon: <FaListAlt />, color: '#ff9800' },
    { title: 'Completed Tasks', value: '18', icon: <FaCheckCircle />, color: '#4caf50' },
    { title: 'Pending Tasks', value: '6', icon: <FaClock />, color: '#f57c00' },
  ];

  const quickActions = [
    { title: 'My Tasks', path: '/worker/tasks', icon: <FaListAlt /> },
    { title: 'Profile', path: '/worker/profile', icon: <FaUser /> },
    { title: 'Notifications', path: '/worker/notifications', icon: <FaTools /> },
  ];
  return (
    <div className="worker-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Hello, {user?.username || 'Worker'}!</h1>
        <p>Here is your task overview.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-actions">
          {quickActions.map((action, idx) => (
            <a key={idx} href={action.path} className="action-card">
              {action.icon}
              <span>{action.title}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
