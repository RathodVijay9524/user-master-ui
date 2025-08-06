import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../redux/axiosInstance';
import checkAvailability from '../../service/user-service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserRegistration = () => {
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phoNo: '',
  });

  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    if (name === 'username') setUsernameAvailable(null);
    if (name === 'email') setEmailAvailable(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/register/admin', user);
      setLoading(false);
      // Show backend success message in toast
      const message = response.data?.message || 'Registered successfully!';
      toast.success(message);
      handleReset(); // Clear the form after success
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Registration failed!';
      console.log("Error:", err.response?.data);
      toast.error(message);
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
    setUsernameAvailable(null);
    setEmailAvailable(null);
  };

  const checkUsernameAvailability = async () => {
    if (user.username) {
      const exists = await checkAvailability(user.username);
      setUsernameAvailable(!exists);
    }
  };

  const checkEmailAvailability = async () => {
    if (user.email) {
      const exists = await checkAvailability(user.email);
      setEmailAvailable(!exists);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="card-title text-center mb-4">User Registration</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  required
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
                  required
                />
                {usernameAvailable === false && (
                  <p className="text-danger">Username already exists.</p>
                )}
                {usernameAvailable === true && (
                  <p className="text-success">Username is available.</p>
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
                  required
                />
                {emailAvailable === false && (
                  <p className="text-danger">Email already exists.</p>
                )}
                {emailAvailable === true && (
                  <p className="text-success">Email is available.</p>
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
                  required
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
                  required
                />
              </div>

              <div className="d-flex justify-content-between">
                <button
                  type="submit"
                  className="btn btn-primary mt-3"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mt-3"
                  onClick={handleReset}
                >
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
