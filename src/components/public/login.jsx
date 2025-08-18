import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../redux/authSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ usernameOrEmail, password }));

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Login successful!');
    } else {
      const msg =
        result.payload?.errorMessage ||
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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Welcome Section */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-800 p-4 text-white">
        <div className="max-w-md mx-auto h-full flex flex-col justify-center">
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-1 text-5xl animate-bounce">✨</div>
            <h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              Welcome Back!
            </h1>
            <p className="text-xl text-emerald-100 leading-relaxed">
              Sign in to access your dashboard and continue your journey with us
            </p>
          </div>
          
          {/* Feature Cards */}
          <div className="space-y-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20 transform hover:scale-105 transition-transform duration-200">
              <h3 className="font-semibold mb-2 flex items-center">
                <span className="mr-2">🔒</span> Secure Access
              </h3>
              <p className="text-sm text-emerald-100">Your data is protected with enterprise-grade security</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20 transform hover:scale-105 transition-transform duration-200">
              <h3 className="font-semibold mb-2 flex items-center">
                <span className="mr-2">👥</span> Multi-Role Support
              </h3>
              <p className="text-sm text-emerald-100">Admin, Worker, and User dashboards tailored for you</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20 transform hover:scale-105 transition-transform duration-200">
              <h3 className="font-semibold mb-2 flex items-center">
                <span className="mr-2">⚡</span> Fast & Reliable
              </h3>
              <p className="text-sm text-emerald-100">Lightning-fast performance with 99.9% uptime</p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-10 bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
            <p className="italic text-emerald-100 mb-4">"This platform has transformed my daily workflow completely!"</p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500 mr-3"></div>
              <div>
                <p className="font-medium">Rathod Vijay</p>
                <p className="text-xs text-emerald-200">Operations Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Brand Section */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🔑</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-600 mt-2">Access your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username/Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">📧</span>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter your username or email"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  required
                />
              </div>
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
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                to="/forgot-password"
                className="text-emerald-600 hover:text-emerald-800 text-sm font-medium transition duration-200"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 focus:ring-4 focus:ring-emerald-300 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register"
                className="text-emerald-600 hover:text-emerald-800 font-semibold transition duration-200 hover:underline"
              >
                Create one here
              </Link>
            </p>
          </div>

          {/* Divider with Secure Message */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">🔐 Secure login powered by modern encryption</span>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white rounded-lg shadow-sm border">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-xs text-gray-600">Fast Login</div>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm border">
              <div className="text-2xl mb-1">🛡️</div>
              <div className="text-xs text-gray-600">Secure</div>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm border">
              <div className="text-2xl mb-1">📱</div>
              <div className="text-xs text-gray-600">Mobile Ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;