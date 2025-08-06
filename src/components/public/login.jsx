import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, fetchUserData, setUser } from '../../redux/authSlice';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(login({ usernameOrEmail, password }));

      if (result.meta.requestStatus === 'fulfilled') {
        await dispatch(fetchUserData());

        const user = result.payload && result.payload.data && result.payload.data.user;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage

          const userRoles = user.roles.map(role => role.name);
          console.log('User roles:', userRoles);

          if (userRoles.includes('ROLE_ADMIN')) {
            navigate('/admin');
          } else if (userRoles.includes('ROLE_WORKER')) {
            navigate('/worker');
          } else if (userRoles.includes('ROLE_NORMAL')) {
            navigate('/user');
          } else {
            console.error('No matching role found.');
          }
        }
      } else {
        console.error('Login failed:', result.error.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }
  }, [dispatch]);

  const handleForgotPassword = () => {
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="card-title text-center mb-4">Login</h2>
            {error && <p className="text-danger">{error.errorMessage}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username or Email:</label>
                <input
                  type="text"
                  className="form-control"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block mt-3" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <button className="btn btn-link mt-3 p-0 text-left" onClick={handleForgotPassword}>
              Forgot Password?
            </button>

            <div className="mt-4 text-center">
              Dont have an account? <Link to="/">Register here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
