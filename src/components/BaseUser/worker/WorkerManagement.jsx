import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, Spinner, Alert, Nav, Form, Row, Col } from 'react-bootstrap';
import RoleEditorModal from '../../BaseAdmin/user/RoleEditorModal';
import { toast } from 'react-toastify';
import {
  fetchWorkersWithFilter,
  softDeleteWorker,
  restoreWorker,
  permanentlyDeleteWorker,
  updateWorkerStatus,
  setWorkerFilters,
  setWorkerPageSize,
  setWorkerPage
} from '../../../redux/workerSlice';

const WorkerManagement = () => {
  const dispatch = useDispatch();

  const {
    workers,
    loading,
    error,
    currentPage,
    totalPages,
    totalWorkers,
    pageSize,
    filters
  } = useSelector(state => state.workers);

  const user = useSelector(state => state.auth.user);

  const sortBy = 'createdOn';
  const sortDir = 'desc';

  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

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
    dispatch(setWorkerFilters(newFilters));
    dispatch(setWorkerPage(1));
    if (user?.id) {
      dispatch(fetchWorkersWithFilter({
        superUserId: user.id,
        pageNumber: 0,
        pageSize,
        sortBy,
        sortDir,
        ...newFilters
      }));
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    const newFilters = buildFilters(activeTab, keyword);
    dispatch(setWorkerFilters(newFilters));
    dispatch(setWorkerPage(1));
    if (user?.id) {
      dispatch(fetchWorkersWithFilter({
        superUserId: user.id,
        pageNumber: 0,
        pageSize,
        sortBy,
        sortDir,
        ...newFilters
      }));
    }
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWorkersWithFilter({
        superUserId: user.id,
        pageNumber: currentPage - 1,
        pageSize,
        sortBy,
        sortDir,
        ...filters
      }));
    } else {
      console.warn("🚨 superUserId is undefined. Skipping fetch.");
    }
  }, [dispatch, user?.id, currentPage, pageSize, sortBy, sortDir, filters]);

  const handleStatusToggle = async (workerId, currentStatus) => {
    try {
      await dispatch(updateWorkerStatus({
        workerId,
        status: !currentStatus,
        pagination: {
          superUserId: user.id,
          pageNumber: currentPage - 1,
          pageSize,
          sortBy,
          sortDir,
          ...filters
        }
      })).unwrap();
      toast.success(`Worker ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Status update failed');
    }
  };

  const handleSoftDelete = async (workerId) => {
    try {
      await dispatch(softDeleteWorker({
        workerId,
        filters: {
          superUserId: user.id,
          pageNumber: currentPage - 1,
          pageSize,
          sortBy,
          sortDir,
          ...filters
        }
      })).unwrap();
      toast.success('Worker soft deleted');
    } catch {
      toast.error('Soft delete failed');
    }
  };

  const handleRestore = async (workerId) => {
    try {
      await dispatch(restoreWorker({
        workerId,
        filters: {
          superUserId: user.id,
          pageNumber: currentPage - 1,
          pageSize,
          sortBy,
          sortDir,
          ...filters
        }
      })).unwrap();
      toast.success('Worker restored');
    } catch {
      toast.error('Restore failed');
    }
  };

  const handlePermanentDelete = async (workerId) => {
    try {
      await dispatch(permanentlyDeleteWorker({
        workerId,
        filters: {
          superUserId: user.id,
          pageNumber: currentPage - 1,
          pageSize,
          sortBy,
          sortDir,
          ...filters
        }
      })).unwrap();
      toast.success('Worker permanently deleted');
    } catch {
      toast.error('Permanent delete failed');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(setWorkerPage(newPage));
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    dispatch(setWorkerPageSize(newSize));
    dispatch(setWorkerPage(1));
    if (user?.id) {
      dispatch(fetchWorkersWithFilter({
        superUserId: user.id,
        pageNumber: 0,
        pageSize: newSize,
        sortBy,
        sortDir,
        ...filters
      }));
    }
  };

  const openRoleModal = (worker) => {
    setSelectedWorker(worker);
    setShowRoleModal(true);
  };

  const getRoleStyle = (roleName) => {
    switch (roleName) {
      case 'ROLE_SUPER_USER':
        return { backgroundColor: '#dc3545', color: 'white', padding: '3px 8px', borderRadius: '5px', marginRight: '4px' }; // red
      case 'ROLE_ADMIN':
        return { backgroundColor: '#0d6efd', color: 'white', padding: '3px 8px', borderRadius: '5px', marginRight: '4px' }; // blue
      case 'ROLE_WORKER':
        return { backgroundColor: '#198754', color: 'white', padding: '3px 8px', borderRadius: '5px', marginRight: '4px' }; // green
      case 'ROLE_NORMAL':
        return { backgroundColor: '#6c757d', color: 'white', padding: '3px 8px', borderRadius: '5px', marginRight: '4px' }; // gray
      default:
        return { backgroundColor: '#343a40', color: 'white', padding: '3px 8px', borderRadius: '5px', marginRight: '4px' }; // dark
    }
  };


  return (
    <div className="p-4">
      <h2>Worker Management</h2>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by name/email/username/phone"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col md="auto">
          <Form.Select value={pageSize} onChange={handlePageSizeChange}>
            {[3, 5, 10, 15, 20].map(size => (
              <option key={size} value={size}>{size} per page</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => handleTabChange(parseInt(k))} className="mb-3">
        <Nav.Item><Nav.Link eventKey={0}>All</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey={1}>Active</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey={2}>Deleted</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey={3}>Expired</Nav.Link></Nav.Item>
      </Nav>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <Table bordered striped hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Roles</th> {/* ✅ Added */}
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workers.map(worker => (
            <tr key={worker.id}>
              <td>{worker.id}</td>
              <td>{worker.name}</td>
              <td>{worker.email}</td>
              <td>{worker.username}</td>
              <td>
              {worker.roles?.map(role => (
    <span key={role.id} style={getRoleStyle(role.name)}>
      {role.name.replace('ROLE_', '')}
    </span>
  ))}
              </td>
              <td>{worker.accountStatus?.isActive ? 'Yes' : 'No'}</td>
              <td>
                {(activeTab === 0 || activeTab === 1) && (
                  <Button size="sm" variant="info" onClick={() => openRoleModal(worker)} className="me-2">
                    Edit Roles
                  </Button>
                )}
                {activeTab === 0 && (
                  <>
                    <Button size="sm" variant="warning" onClick={() => handleStatusToggle(worker.id, worker.accountStatus?.isActive)} className="me-2">
                      {worker.accountStatus?.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleSoftDelete(worker.id)}>Soft Delete</Button>
                  </>
                )}
                {activeTab === 2 && (
                  <>
                    <Button size="sm" variant="success" onClick={() => handleRestore(worker.id)} className="me-2">Restore</Button>
                    <Button size="sm" variant="danger" onClick={() => handlePermanentDelete(worker.id)}>Permanent Delete</Button>
                  </>
                )}
                {activeTab === 3 && (
                  <Button size="sm" variant="success" onClick={() => handleStatusToggle(worker.id, worker.accountStatus?.isActive)}>
                    Activate
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center">
        <Button disabled={currentPage <= 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button disabled={currentPage >= totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
      </div>

      {showRoleModal && selectedWorker && (
        <RoleEditorModal
          show={showRoleModal}
          user={selectedWorker}
          onClose={() => setShowRoleModal(false)}
          onSuccess={() => {
            dispatch(fetchWorkersWithFilter({
              superUserId: user.id,
              pageNumber: currentPage - 1,
              pageSize,
              sortBy,
              sortDir,
              ...filters
            }));
          }}
        />
      )}
    </div>
  );
};

export default WorkerManagement;
