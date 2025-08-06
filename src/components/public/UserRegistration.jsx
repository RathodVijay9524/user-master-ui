import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../redux/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';
import checkAvailability from '../../service/user-service';

const UserRegistration = () => {
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phoNo: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(null); // Changed initial state to null
  const [emailAvailable, setEmailAvailable] = useState(null); // Changed initial state to null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    if (name === 'username') {
      setUsernameAvailable(null); // Reset availability state
    }
    if (name === 'email') {
      setEmailAvailable(null); // Reset availability state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/register/admin', user);  // Ensure correct endpoint
      setLoading(false);
      setSuccess(response.data);
      setError(null);
      handleReset();
    } catch (err) {
      setLoading(false);
      setError(err.response && err.response.data ? err.response.data : "Registration failed.");
      setSuccess(null);
    }
  };

  const handleReset = () => {
    setUser({
      name: '',
      username: '',
      email: '',
      password: '',
      phoNo: '',
    });
    setError(null);
    setSuccess(null);
    setUsernameAvailable(null);
    setEmailAvailable(null);
  };

  const checkUsernameAvailability = async () => {
    if (user.username) {
      console.log('Checking username availability:', user.username);
      const exists = await checkAvailability(user.username);
      console.log('Username exists:', exists);
      setUsernameAvailable(!exists); // Set to true if available, false if taken
    }
  };

  const checkEmailAvailability = async () => {
    if (user.email) {
      console.log('Checking email availability:', user.email);
      const exists = await checkAvailability(user.email);
      console.log('Email exists:', exists);
      setEmailAvailable(!exists); // Set to true if available, false if taken
    }
  };

  useEffect(() => {
    console.log('Username Available State:', usernameAvailable);
  }, [usernameAvailable]);

  useEffect(() => {
    console.log('Email Available State:', emailAvailable);
  }, [emailAvailable]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="card-title text-center mb-4">User Registration</h2>
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">{success.message}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  onBlur={checkUsernameAvailability}
                />
                {usernameAvailable === false && (
                  <p className="text-danger">
                    Username already exists! Choose another username.
                  </p>
                )}
                {usernameAvailable === true && (
                  <p className="text-success">
                    Username is available
                  </p>
                )}
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  onBlur={checkEmailAvailability}
                />
                {emailAvailable === false && (
                  <p className="text-danger">
                    Email already exists! Choose another email.
                  </p>
                )}
                {emailAvailable === true && (
                  <p className="text-success">
                    Email is available
                  </p>
                )}
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="text"
                  className="form-control"
                  name="phoNo"
                  value={user.phoNo}
                  onChange={handleChange}
                />
              </div>
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
                <button type="button" className="btn btn-secondary mt-3" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </form>
            <div className="mt-4 text-center">
              Already registered? <Link to="/login">Login here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
