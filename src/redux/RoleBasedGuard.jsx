import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import fetchCurrentUser from './fetchCurrentUser';

const RoleBasedGuard = ({ children, requiredRole }) => {
  const { token } = useSelector(state => state.auth);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      if (token) {
        try {
          const userData = await fetchCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    getUserData();
  }, [token]);


  console.log('Required Role:', requiredRole);

  if (loading) {
    return <div>Loading...</div>;
  }

  const roleMatch = requiredRole && user?.roles.some(userRole => userRole.name === requiredRole);

  if (!token || !roleMatch) {
    localStorage.removeItem('jwtToken'); // Optionally remove token
    localStorage.removeItem('user');
    return <Navigate to="/login" />;
  }

  return children;
};

RoleBasedGuard.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string.isRequired,
};

export default RoleBasedGuard;
