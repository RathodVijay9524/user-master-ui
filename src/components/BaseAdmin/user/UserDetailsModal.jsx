// components/UserDetailsModal.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getUserImage } from '../../../redux/userSlice'; // adjust path if needed
import axiosInstance from '../../../redux/axiosInstance';

const UserDetailsModal = ({ show, onClose, user }) => {
  const dispatch = useDispatch();
  const [userImageUrl, setUserImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchUserImage = async () => {
      if (!user?.id) return;
      
      setImageError(false);
      try {
        const result = await dispatch(getUserImage(user.id)).unwrap();
        if (result) {
          const imageUrl = `${axiosInstance.defaults.baseURL}/users/image/${user.id}?t=${Date.now()}`;
          setUserImageUrl(imageUrl);
        } else {
          setUserImageUrl('');
        }
      } catch (error) {
        console.warn('Failed to load user image:', error);
        setUserImageUrl('');
        setImageError(true);
      }
    };

    if (show && user?.id) {
      fetchUserImage();
    }
  }, [show, user, dispatch]);

  if (!show || !user) return null;

  const getDefaultAvatar = () => {
    const initials = (user?.name || 'User')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    return initials;
  };

  const handleImageError = () => {
    setImageError(true);
    setUserImageUrl('');
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
      : 'bg-rose-50 text-rose-700 border-rose-200';
  };

  const getRoleColor = (index) => {
    const colors = [
      'bg-blue-50 text-blue-700 border-blue-200',
      'bg-purple-50 text-purple-700 border-purple-200',
      'bg-indigo-50 text-indigo-700 border-indigo-200',
      'bg-cyan-50 text-cyan-700 border-cyan-200',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 pt-20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto mt-4">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-t-2xl border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-900 pr-10">User Profile</h2>
          <p className="text-gray-600 mt-1">Complete user information and details</p>
        </div>

        <div className="p-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              {userImageUrl && !imageError ? (
                <img
                  src={userImageUrl}
                  alt="User Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg ring-4 ring-gray-100"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-gray-100">
                  {getDefaultAvatar()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <div className={`w-4 h-4 rounded-full ${user.accountStatus?.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{user.name || 'Unknown User'}</h3>
            <p className="text-gray-600">{user.email || 'No email provided'}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h4>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Full Name</p>
                    <p className="text-gray-900">{user.name || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email Address</p>
                    <p className="text-gray-900 break-all">{user.email || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">User ID</p>
                    <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Roles */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Status & Permissions</h4>
              
              <div className="space-y-4">
                {/* Account Status */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Account Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(user.accountStatus?.isActive)}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${user.accountStatus?.isActive ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                    {user.accountStatus?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* User Roles */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Assigned Roles</p>
                  {user.roles?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role, index) => (
                        <span
                          key={role.id}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(index)}`}
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          {role.name.replace('ROLE_', '')}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-600 text-sm">No roles assigned</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;