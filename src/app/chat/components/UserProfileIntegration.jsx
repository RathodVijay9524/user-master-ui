import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaUserCog, FaSignOutAlt, FaHardHat } from 'react-icons/fa';
import { logout } from '../../../redux/authSlice';

const UserProfileIntegration = ({ onClose, theme }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(true); // Always show since it's a modal
  const dropdownRef = useRef(null);

  // Debug logging
  console.log('UserProfileIntegration - User data:', user);
  console.log('UserProfileIntegration - Theme:', theme);

  // Determine roles
  const hasAdminRole = user?.roles?.some((role) => role.name === 'ROLE_ADMIN');
  const hasWorkerRole = user?.roles?.some((role) => role.name === 'ROLE_WORKER');
  const hasUserRole = user?.roles?.some((role) => role.name === 'ROLE_NORMAL');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    onClose();
  };

  const navigateToProfile = () => {
    if (hasAdminRole) {
      navigate('/admin/profile');
    } else if (hasWorkerRole) {
      navigate('/worker/profile');
    } else if (hasUserRole) {
      navigate('/user/profile');
    }
    onClose();
  };

  const navigateToDashboard = () => {
    if (hasAdminRole) {
      navigate('/admin/dashboard');
    } else if (hasWorkerRole) {
      navigate('/worker/dashboard');
    } else if (hasUserRole) {
      navigate('/user/dashboard');
    }
    onClose();
  };

  const navigateToUserPanel = () => {
    navigate('/user/dashboard');
    onClose();
  };

  const navigateToWorkerPanel = () => {
    navigate('/worker/dashboard');
    onClose();
  };

  const navigateToAdminPanel = () => {
    navigate('/admin/dashboard');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div 
        className="rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 ease-out animate-slideUp"
        style={{ 
          backgroundColor: theme?.main || '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: theme?.border || '#e5e7eb' }}
        >
          <h2 
            className="text-lg font-bold flex items-center"
            style={{ color: theme?.text || '#1f2937' }}
          >
            <span 
              className="mr-2 text-xl"
              style={{ color: theme?.accent || '#ff9800' }}
            >
              👤
            </span>
            User Menu
          </h2>
          <button
            onClick={onClose}
            className="text-xl transition-all duration-200 hover:scale-110 hover:rotate-90"
            style={{ color: theme?.text || '#6b7280' }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* User Info */}
          <div 
            className="mb-4 pb-4 border-b"
            style={{ borderColor: theme?.border || '#e5e7eb' }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="text-3xl transition-all duration-300 hover:scale-110"
                style={{ color: theme?.accent || '#ff9800' }}
              >
                👤
              </div>
              <div className="flex-1">
                <div 
                  className="font-bold text-lg"
                  style={{ color: theme?.text || '#1f2937' }}
                >
                  {user?.username || 'User'}
                </div>
                <div 
                  className="text-sm opacity-75"
                  style={{ color: theme?.text || '#6b7280' }}
                >
                  {user?.email || 'user@example.com'}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items - Horizontal Layout */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
              className="text-center px-3 py-3 rounded-lg transition-all duration-200 flex flex-col items-center group hover:scale-[1.02] hover:shadow-md"
              style={{ 
                backgroundColor: theme?.bubble || '#f8fafc',
                color: theme?.text || '#1f2937'
              }}
              onClick={navigateToProfile}
            >
              <span 
                className="text-2xl mb-1 transition-all duration-200 group-hover:scale-110"
                style={{ color: theme?.accent || '#ff9800' }}
              >
                ⚙️
              </span>
              <span className="text-sm font-medium">My Profile</span>
            </button>

            <button 
              className="text-center px-3 py-3 rounded-lg transition-all duration-200 flex flex-col items-center group hover:scale-[1.02] hover:shadow-md"
              style={{ 
                backgroundColor: theme?.bubble || '#f8fafc',
                color: theme?.text || '#1f2937'
              }}
              onClick={navigateToUserPanel}
            >
              <span 
                className="text-2xl mb-1 transition-all duration-200 group-hover:scale-110"
                style={{ color: theme?.accent || '#ff9800' }}
              >
                👤
              </span>
              <span className="text-sm font-medium">User Panel</span>
            </button>

            {hasAdminRole && (
              <button 
                className="text-center px-3 py-3 rounded-lg transition-all duration-200 flex flex-col items-center group hover:scale-[1.02] hover:shadow-md"
                style={{ 
                  backgroundColor: theme?.bubble || '#f8fafc',
                  color: theme?.text || '#1f2937'
                }}
                onClick={navigateToAdminPanel}
              >
                <span 
                  className="text-2xl mb-1 transition-all duration-200 group-hover:scale-110"
                  style={{ color: theme?.accent || '#ff9800' }}
                >
                  👑
                </span>
                <span className="text-sm font-medium">Admin Panel</span>
              </button>
            )}

            {hasWorkerRole && (
              <button 
                className="text-center px-3 py-3 rounded-lg transition-all duration-200 flex flex-col items-center group hover:scale-[1.02] hover:shadow-md"
                style={{ 
                  backgroundColor: theme?.bubble || '#f8fafc',
                  color: theme?.text || '#1f2937'
                }}
                onClick={navigateToWorkerPanel}
              >
                <span 
                  className="text-2xl mb-1 transition-all duration-200 group-hover:scale-110"
                  style={{ color: theme?.accent || '#ff9800' }}
                >
                  🦺
                </span>
                <span className="text-sm font-medium">Worker Panel</span>
              </button>
            )}
          </div>

          {/* Divider */}
          <div 
            className="my-3 border-t"
            style={{ borderColor: theme?.border || '#e5e7eb' }}
          ></div>

          {/* Logout */}
          <button 
            className="w-full text-center px-3 py-3 rounded-lg transition-all duration-200 flex flex-col items-center group hover:scale-[1.02] hover:shadow-md"
            style={{ 
              backgroundColor: theme?.bubble || '#f8fafc',
              color: theme?.theme === 'dark' ? '#ef4444' : theme?.theme === 'green' ? '#dc2626' : '#ef4444'
            }}
            onClick={handleLogout}
          >
            <span className="text-2xl mb-1 transition-all duration-200 group-hover:scale-110">🚪</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserProfileIntegration;
