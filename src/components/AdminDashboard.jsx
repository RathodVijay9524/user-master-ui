import React from 'react';
import { useSelector } from 'react-redux';
import { FaUsers, FaBox, FaShoppingBag, FaChartLine, FaCog, FaBell } from 'react-icons/fa';
import './AdminDashboard.css';
const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const stats = [
    { title: 'Total Users', value: '1,234', icon: <FaUsers />, color: '#3498db' },
    { title: 'Total Products', value: '567', icon: <FaBox />, color: '#e67e22' },
    { title: 'Total Orders', value: '890', icon: <FaShoppingBag />, color: '#2ecc71' },
    { title: 'Monthly Revenue', value: '$25,000', icon: <FaChartLine />, color: '#9b59b6' },
  ];

  const quickActions = [
    { title: 'Manage Users', path: '/admin/users', icon: <FaUsers /> },
    { title: 'Manage Products', path: '/admin/products', icon: <FaBox /> },
    { title: 'View Orders', path: '/admin/orders', icon: <FaShoppingBag /> },
    { title: 'Settings', path: '/admin/settings', icon: <FaCog /> },
  ];
  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Welcome, {user?.username || 'Admin'}!</h1>
        <p>Here is an overview of the platform statistics.</p>
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

export default AdminDashboard;
