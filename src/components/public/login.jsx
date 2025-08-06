import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../redux/authSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ usernameOrEmail, password }));

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Login successful!');
      // user will be available via Redux state
    } else {
      const msg =
      result.payload?.errorMessage || // ✅ correct
      result.payload?.message || 
      'Login failed';
    toast.error(msg);
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      const roles = user.roles.map((r) => r.name);

      if (roles.includes('ROLE_ADMIN')) {
        navigate('/admin/dashboard');
      } else if (roles.includes('ROLE_WORKER')) {
        navigate('/worker/dashboard');
      } else if (roles.includes('ROLE_NORMAL')) {
        navigate('/user/dashboard');
      } else {
        toast.error('No valid role found!');
      }
    }
  }, [user, navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="card-title text-center mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username or Email:</label>
                <input
                  type="text"
                  className="form-control"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block mt-3" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className="mt-4 text-center">
              Don’t have an account? <Link to="/register">Register here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
