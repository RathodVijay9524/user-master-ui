import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RoleEditorModal from './RoleEditorModal';
import UserDetailsModal from './UserDetailsModal';
import { toast } from 'react-toastify';

import {
  fetchUsersWithFilter,
  softDeleteUser,
  updateUserStatus,
  restoreUser,
  permanentlyDeleteUser,
  setFilters,
  setCurrentPage,
  setPageSize
} from '../../../redux/userSlice';

const UserManagement = () => {
  const dispatch = useDispatch();
  const {
    users,
    loading,
    error,
    currentPage,
    totalPages,
    totalUsers,
    pageSize,
    filters
  } = useSelector(state => state.users);

  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [viewedUser, setViewedUser] = useState(null);

  const tabs = [
    { id: 0, label: 'All Users', icon: '👥', color: 'blue' },
    { id: 1, label: 'Active', icon: '✅', color: 'green' },
    { id: 2, label: 'Deleted', icon: '❌', color: 'red' },
    { id: 3, label: 'Expired', icon: '⏰', color: 'orange' }
  ];

  // Static map of color classes so Tailwind can tree-shake correctly (avoid fully dynamic class names)
  const colorStyles = {
    blue: { border: 'border-blue-500', text: 'text-blue-600' },
    green: { border: 'border-green-500', text: 'text-green-600' },
    red: { border: 'border-red-500', text: 'text-red-600' },
    orange: { border: 'border-orange-500', text: 'text-orange-600' }
  };

  const buildFilters = (tabKey, keyword = '') => {
    let newFilters = { keyword };
    switch (tabKey) {
      case 1:
        newFilters.isDeleted = false;
        newFilters.isActive = true;
        break;
      case 2:
        newFilters.isDeleted = true;
        break;
      case 3:
        newFilters.isDeleted = false;
        newFilters.isActive = false;
        break;
      default:
        newFilters.isDeleted = false;
        break;
    }
    return newFilters;
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    const newFilters = buildFilters(key, searchTerm);
    dispatch(setFilters(newFilters));
    dispatch(setCurrentPage(1));
    dispatch(fetchUsersWithFilter({ ...newFilters, pageNumber: 0, pageSize }));
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    const newFilters = buildFilters(activeTab, keyword);
    dispatch(setFilters(newFilters));
    dispatch(setCurrentPage(1));
    dispatch(fetchUsersWithFilter({ ...newFilters, pageNumber: 0, pageSize }));
  };

  useEffect(() => {
    dispatch(fetchUsersWithFilter({ ...filters, pageNumber: currentPage - 1, pageSize }));
  }, [dispatch, filters, currentPage, pageSize]);

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await dispatch(updateUserStatus({
        userId,
        status: !currentStatus,
        pagination: { ...filters, pageNumber: currentPage - 1, pageSize }
      })).unwrap();
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error(`Status update failed: ${error}`);
    }
  };

  const handleSoftDelete = async (userId) => {
    try {
      await dispatch(softDeleteUser({ userId, filters: { ...filters, pageNumber: currentPage - 1, pageSize } })).unwrap();
      toast.success('User soft deleted');
    } catch (error) {
      toast.error(`Soft delete failed: ${error}`);
    }
  };

  const handleRestore = async (userId) => {
    try {
      await dispatch(restoreUser({ userId, filters: { ...filters, pageNumber: currentPage - 1, pageSize } })).unwrap();
      toast.success('User restored');
    } catch (error) {
      toast.error(`Restore failed: ${error}`);
    }
  };

  const handlePermanentDelete = async (userId) => {
    try {
      await dispatch(permanentlyDeleteUser({ userId, filters: { ...filters, pageNumber: currentPage - 1, pageSize } })).unwrap();
      toast.success('User permanently deleted');
    } catch (error) {
      toast.error(`Permanent delete failed: ${error}`);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
    }
  };

  const getRoleColor = (roleName) => {
    if (roleName.includes('ADMIN')) return 'bg-red-500';
    if (roleName.includes('SUPER')) return 'bg-yellow-500';
    if (roleName.includes('WORKER')) return 'bg-cyan-500';
    if (roleName.includes('NORMAL')) return 'bg-gray-500';
    return 'bg-blue-500';
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1));
    dispatch(fetchUsersWithFilter({ ...filters, pageNumber: 0, pageSize: newSize }));
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-0 md:px-6 py-6">
      <div className="w-full md:max-w-7xl md:mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="flex gap-4 items-center">
              {/* Page Size Selector */}
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[3, 5, 10, 15, 20, 25].map(size => (
                  <option key={size} value={size}>{size} per page</option>
                ))}
              </select>

              {/* Stats */}
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                <span className="font-medium text-gray-900">{totalUsers}</span> total users
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            {/* Horizontal scroll on mobile, no wrap, better touch targets */}
            <nav
              className="flex flex-nowrap gap-4 px-0 sm:px-6 overflow-x-auto scrollbar-thin scrollbar-none"
              role="tablist"
              aria-label="User tabs"
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const activeClasses = `${colorStyles[tab.color].border} ${colorStyles[tab.color].text}`;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      isActive
                        ? `${activeClasses}`
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-base sm:text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-red-400 text-lg">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>

                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.accountStatus?.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {user.accountStatus?.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {user.roles?.map(role => (
                            <span
                              key={role.id}
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-md text-white ${getRoleColor(role.name)}`}
                            >
                              {role.name.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {/* Edit Roles Button */}

                          {(activeTab === 0 || activeTab === 1) && (
                            <>
                              <button
                                onClick={() => openRoleModal(user)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                ✏️ Roles
                              </button>
                            </>
                          )}

                          {/* Tab-specific actions */}
                          {activeTab === 0 && (
                            <>
                              <button
                                onClick={() => handleStatusToggle(user.id, user.accountStatus?.isActive)}
                                className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${user.accountStatus?.isActive
                                  ? 'text-orange-700 bg-orange-100 hover:bg-orange-200 focus:ring-orange-500'
                                  : 'text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500'
                                  }`}
                              >
                                {user.accountStatus?.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                              </button>
                              <button
                                onClick={() => handleSoftDelete(user.id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                🗑️ Delete
                              </button>
                            </>
                          )}

                          {activeTab === 1 && (
                            <>
                              <button
                                onClick={() => {
                                  setViewedUser(user);
                                  setShowUserModal(true);
                                }}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                👁 View
                              </button>
                              <button
                                onClick={() => handleSoftDelete(user.id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                🗑️ Delete
                              </button>
                            </>
                          )}

                          {activeTab === 2 && (
                            <>
                              <button
                                onClick={() => handleRestore(user.id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                ↻ Restore
                              </button>
                              <button
                                onClick={() => handlePermanentDelete(user.id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                ❌ Permanent
                              </button>
                            </>
                          )}

                          {activeTab === 3 && (
                            <button
                              onClick={() => handleStatusToggle(user.id, user.accountStatus?.isActive)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              ▶️ Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="mr-1">←</span>
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <span className="ml-1">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Role Editor Modal */}
        {showRoleModal && selectedUser && (
          <RoleEditorModal
            show={showRoleModal}
            user={selectedUser}
            onClose={() => setShowRoleModal(false)}
            onSuccess={() => {
              dispatch(fetchUsersWithFilter({ ...filters, pageNumber: currentPage - 1, pageSize }));
            }}
          />
        )}
        {showUserModal && viewedUser && (
          <UserDetailsModal
            show={showUserModal}
            user={viewedUser}
            onClose={() => setShowUserModal(false)}
          />
        )}

      </div>
    </div>
  );
};

export default UserManagement;