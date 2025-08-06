// ✅ Updated UserManagement.jsx to integrate external RoleEditorModal
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, Spinner, Alert, Nav, Form, Row, Col } from 'react-bootstrap';
import RoleEditorModal from './RoleEditorModal'; // ✅ Imported the reusable RoleEditorModal
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

  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Active, 2: Deleted, 3: Expired
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ State for managing role modal visibility and selected user
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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
    if (roleName.includes('ADMIN')) return '#dc3545';
    if (roleName.includes('SUPER')) return '#ffc107';
    if (roleName.includes('WORKER')) return '#17a2b8';
    if (roleName.includes('NORMAL')) return '#6c757d';
    return '#007bff';
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1));
    dispatch(fetchUsersWithFilter({ ...filters, pageNumber: 0, pageSize: newSize }));
  };

  // ✅ Trigger role modal with user selected
  const openRoleModal = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  return (
    <div className="p-4">
      <h2>User Management</h2>

      {/* 🔍 Search and filters */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by name, email, or username"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col md="auto">
          <Form.Select value={pageSize} onChange={handlePageSizeChange}>
            {[3, 5, 10, 15, 20, 25].map(size => (
              <option key={size} value={size}>{size} per page</option>
            ))}
          </Form.Select>
        </Col>
        <Col className="d-flex align-items-center">
          <div className="ms-auto text-muted">
            Total Users: <strong>{totalUsers}</strong> | Page {currentPage} of {totalPages}
          </div>
        </Col>
      </Row>

      {/* 🔄 Tab navigation */}
      <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => handleTabChange(parseInt(k))} className="mb-3">
        <Nav.Item><Nav.Link eventKey={0}>All Users</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey={1}>Active Users</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey={2}>Deleted Users</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey={3}>Expired Users</Nav.Link></Nav.Item>
      </Nav>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* 📋 User Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Active</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.accountStatus?.isActive ? 'Yes' : 'No'}</td>
              <td>
                {user.roles?.map(role => (
                  <span
                    key={role.id}
                    style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      marginRight: '5px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#fff',
                      backgroundColor: getRoleColor(role.name),
                    }}
                  >
                    {role.name.replace('ROLE_', '')}
                  </span>
                ))}
              </td>
              <td>
               
                {/* ✅ Show Edit Roles only in All Users (0) or Active Users (1) tab */}
{(activeTab === 0 || activeTab === 1) && (
  <Button size="sm" variant="info" onClick={() => openRoleModal(user)} className="me-2">
    Edit Roles
  </Button>
)}

                {activeTab === 0 && (
                  <>
                    <Button size="sm" variant="warning" onClick={() => handleStatusToggle(user.id, user.accountStatus?.isActive)} className="me-2">
                      {user.accountStatus?.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleSoftDelete(user.id)}>
                      Soft Delete
                    </Button>
                  </>
                )}
                {activeTab === 1 && (
                  <Button size="sm" variant="danger" onClick={() => handleSoftDelete(user.id)}>
                    Soft Delete
                  </Button>
                )}
                {activeTab === 2 && (
                  <>
                    <Button size="sm" variant="success" onClick={() => handleRestore(user.id)} className="me-2">
                      Restore
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handlePermanentDelete(user.id)}>
                      Permanent Delete
                    </Button>
                  </>
                )}
                {activeTab === 3 && (
                  <Button size="sm" variant="success" onClick={() => handleStatusToggle(user.id, user.accountStatus?.isActive)}>
                    Activate
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 🔁 Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button variant="outline-primary" disabled={currentPage <= 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button variant="outline-primary" disabled={currentPage >= totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
      </div>

      {/* ✅ Role Editor Modal Component */}
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
    </div>
  );
};

export default UserManagement;
