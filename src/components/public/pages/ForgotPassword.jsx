import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../redux/axiosInstance';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.get(`/v1/home/send-email-reset`, {
        params: { email },
      });
      toast.success('Reset email sent. Check your inbox!');
      setEmailSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <Link
          to="/login"
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Login
        </Link>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="text-blue-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
          <p className="text-gray-600 mt-2">
            {emailSent
              ? "We've sent instructions to your email"
              : "Enter your email to reset your password"}
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSendResetEmail} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-4">
              <p>We've sent password reset instructions to <span className="font-semibold">{email}</span></p>
            </div>
            <p className="text-gray-600 mb-4">
              Didn't receive the email? Check your spam folder or
            </p>
            <button
              onClick={() => setEmailSent(false)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Try another email address
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Remember your password? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">Log in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
