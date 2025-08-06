import React from 'react';
import { useSelector } from 'react-redux';
import { FaShoppingCart, FaHeart, FaHistory, FaUser, FaBell, FaCreditCard } from 'react-icons/fa';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  
  const userData = {
    name: user?.username || 'User',
    email: user?.email || 'user@example.com',
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    }) : 'Member since signup'
  };

  const stats = [
    { title: 'Total Orders', value: '12', icon: <FaShoppingCart />, color: '#3498db' },
    { title: 'Wishlist Items', value: '5', icon: <FaHeart />, color: '#e74c3c' },
    { title: 'Pending Orders', value: '2', icon: <FaHistory />, color: '#f39c12' },
    { title: 'Account Balance', value: '$250.00', icon: <FaCreditCard />, color: '#27ae60' }
  ];

  const recentOrders = [
    { id: '#12345', date: '2024-07-28', status: 'Delivered', amount: '$99.99' },
    { id: '#12346', date: '2024-07-27', status: 'Processing', amount: '$149.99' },
    { id: '#12347', date: '2024-07-26', status: 'Shipped', amount: '$79.99' }
  ];

  return (
    <div className="user-dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {userData.name}!</h1>
          <p>Here's what's happening with your account today.</p>
        </div>
        <div className="user-info">
          <div className="info-item">
            <FaUser className="info-icon" />
            <span>{userData.email}</span>
          </div>
          <div className="info-item">
            <span>Member since: {userData.memberSince}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
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

      {/* Recent Orders Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <a href="/user/orders" className="view-all-link">View All Orders</a>
        </div>
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.date}</td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-actions">
          <a href="/user/profile" className="action-card">
            <FaUser />
            <span>Update Profile</span>
          </a>
          <a href="/user/cart" className="action-card">
            <FaShoppingCart />
            <span>View Cart</span>
          </a>
          <a href="/user/wishlist" className="action-card">
            <FaHeart />
            <span>Wishlist</span>
          </a>
          <a href="/user/notifications" className="action-card">
            <FaBell />
            <span>Notifications</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
