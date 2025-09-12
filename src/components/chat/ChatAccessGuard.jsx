import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ChatAccessGuard = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);

  // Check if user is authenticated
  if (!user || !token) {
    toast.info('Please login to access the chat feature');
    sessionStorage.setItem('redirectToChat', 'true');
    return <Navigate to="/login" replace />;
  }

  // Check if user account is active
  if (user.accountStatus && !user.accountStatus.isActive) {
    toast.error('Your account is inactive. Please contact an administrator.');
    return <Navigate to="/login" replace />;
  }

  // Check if user has chat access based on roles
  const userRoles = user.roles?.map(role => role.name) || [];
  const hasChatAccess = userRoles.some(role => 
    ['ROLE_NORMAL', 'ROLE_ADMIN', 'ROLE_WORKER'].includes(role)
  );

  if (!hasChatAccess) {
    toast.error('You do not have permission to access the chat feature');
    return <Navigate to="/" replace />;
  }

  // User has access - render the chat component
  return children;
};

export default ChatAccessGuard;
