// src/components/admin/RoleEditorModal.jsx

import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axiosInstance from "../../../redux/axiosInstance";
import { toast } from 'react-toastify'; // ✅ Toast import

const RoleEditorModal = ({ show, user, onClose, onSuccess }) => {
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && user) {
      fetchAvailableRoles();
      const currentRoleIds = user.roles?.map(role => role.id) || [];
      setSelectedRoles(new Set(currentRoleIds));
    }
  }, [show, user]);

  const fetchAvailableRoles = async () => {
    try {
      const response = await axiosInstance.get("/roles/active");
      setAvailableRoles(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch roles", error);
    }
  };

  const handleRoleChange = (roleId) => {
    setSelectedRoles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axiosInstance.put("/roles/replace", {
        userId: user.id,
        roleIds: Array.from(selectedRoles),
        action: "REPLACE"
      });
      setLoading(false);
      toast.success("Roles updated successfully ✅"); // ✅ success toast
      onSuccess?.();  // Refresh user list
      onClose();
    } catch (error) {
      console.error("Failed to assign roles", error);
      toast.error("Failed to update roles ❌"); // ❌ error toast
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>Manage Roles for {user?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {availableRoles.length === 0 ? (
          <Spinner animation="border" />
        ) : (
          <Form>
            {availableRoles.map(role => (
              <Form.Check
                key={role.id}
                type="checkbox"
                id={`role-${role.id}`}
                label={role.name.replace("ROLE_", "")}
                checked={selectedRoles.has(role.id)}
                onChange={() => handleRoleChange(role.id)}
              />
            ))}
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Save Roles"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RoleEditorModal;
