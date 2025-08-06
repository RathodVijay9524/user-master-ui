import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../redux/axiosInstance';
import checkAvailability from '../../service/user-service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [showPassword, setShowPassword] = useState(false);

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
      const message = response.data?.message || 'Registered successfully!';
      toast.success(message);
      handleReset();
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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Community Section */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-800 p-8 text-white">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 text-5xl animate-bounce">🚀</div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              Join Our Community!
            </h1>
            <p className="text-xl text-emerald-100 leading-relaxed">
              Create your account and unlock access to amazing features and opportunities
            </p>
          </div>
          
          {/* Feature Cards */}
          <div className="space-y-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20 transform hover:scale-105 transition-transform duration-200">
              <h3 className="font-semibold mb-2 flex items-center">
                <span className="mr-2">🎯</span> Instant Setup
              </h3>
              <p className="text-sm text-emerald-100">Get started in minutes with our streamlined registration process</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20 transform hover:scale-105 transition-transform duration-200">
              <h3 className="font-semibold mb-2 flex items-center">
                <span className="mr-2">🔐</span> Secure & Private
              </h3>
              <p className="text-sm text-emerald-100">Your information is protected with bank-level encryption</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20 transform hover:scale-105 transition-transform duration-200">
              <h3 className="font-semibold mb-2 flex items-center">
                <span className="mr-2">🌟</span> Premium Features
              </h3>
              <p className="text-sm text-emerald-100">Access exclusive tools and features designed for success</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20 transform hover:scale-105 transition-transform duration-200">
              <h3 className="font-semibold mb-2 flex items-center">
                <span className="mr-2">👥</span> Community Support
              </h3>
              <p className="text-sm text-emerald-100">Join thousands of users in our vibrant community</p>
            </div>
          </div>

          {/* Testimonials or Stats */}
          <div className="mt-10 bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
            <p className="italic text-emerald-100 mb-4">"This platform transformed my workflow completely!"</p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500 mr-3"></div>
              <div>
                <p className="font-medium">Vijay Rathod</p>
                <p className="text-xs text-emerald-200">Product Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">📝</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Join us today</p>
          </div>

          {/* Registration Form */}
          <div className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">👤</span>
                </div>
                <input
                  type="text"
                  name="name"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter your full name"
                  value={user.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">@</span>
                </div>
                <input
                  type="text"
                  name="username"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Choose a username"
                  value={user.username}
                  onChange={handleChange}
                  onBlur={checkUsernameAvailability}
                  required
                />
              </div>
              {usernameAvailable === false && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">❌</span>Username already exists
                </p>
              )}
              {usernameAvailable === true && (
                <p className="text-green-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">✅</span>Username is available
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">📧</span>
                </div>
                <input
                  type="email"
                  name="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter your email address"
                  value={user.email}
                  onChange={handleChange}
                  onBlur={checkEmailAvailability}
                  required
                />
              </div>
              {emailAvailable === false && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">❌</span>Email already exists
                </p>
              )}
              {emailAvailable === true && (
                <p className="text-green-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">✅</span>Email is available
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">🔒</span>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Create a strong password"
                  value={user.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-gray-400 hover:text-gray-600 transition-colors text-lg">
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </button>
              </div>
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">📱</span>
                </div>
                <input
                  type="tel"
                  name="phoNo"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter your phone number"
                  value={user.phoNo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 focus:ring-4 focus:ring-emerald-300 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">🚀</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 sm:flex-none px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 transition duration-200 shadow-sm hover:shadow-md"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login"
                className="text-emerald-600 hover:text-emerald-800 font-semibold transition duration-200 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Terms Notice */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;