import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaLock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const uid = params.get('uid');
  const token = params.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValidations, setPasswordValidations] = useState({
    hasMinLength: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [isLinkValid, setIsLinkValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Password validation check
  useEffect(() => {
    setPasswordValidations({
      hasMinLength: newPassword.length >= 8,
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    });
  }, [newPassword]);

  // Verify link on load
  useEffect(() => {
    const verifyLink = async () => {
      try {
        setIsLoading(true);
        await axios.get(`http://localhost:9091/api/v1/home/verify-pswd-link`, {
          params: { uid, code: token },
        });
        setIsLoading(false);
      } catch (error) {
        setIsLinkValid(false);
        toast.error('Invalid or expired reset link');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    if (uid && token) verifyLink();
  }, [uid, token, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`http://localhost:9091/api/v1/home/reset-password`, {
        uid,
        token,
        newPassword,
        confirmPassword,
      });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLinkValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Link</h2>
          <p className="text-gray-600 mb-6">The password reset link is invalid or has expired.</p>
          <p className="text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-emerald-600 hover:text-emerald-800 mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-emerald-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Reset Your Password</h2>
          <p className="text-gray-600 mt-2">Create a new password for your account</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                required
                minLength="8"
              />
            </div>
            
            {/* Password validation checklist */}
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <div className={`flex items-center ${passwordValidations.hasMinLength ? 'text-emerald-600' : ''}`}>
                <FaCheckCircle className="mr-2" />
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center ${passwordValidations.hasNumber ? 'text-emerald-600' : ''}`}>
                <FaCheckCircle className="mr-2" />
                <span>Contains a number</span>
              </div>
              <div className={`flex items-center ${passwordValidations.hasSpecialChar ? 'text-emerald-600' : ''}`}>
                <FaCheckCircle className="mr-2" />
                <span>Contains a special character</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || newPassword !== confirmPassword || !passwordValidations.hasMinLength || !passwordValidations.hasNumber || !passwordValidations.hasSpecialChar}
            className={`w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center ${
              isLoading || newPassword !== confirmPassword || !passwordValidations.hasMinLength || !passwordValidations.hasNumber || !passwordValidations.hasSpecialChar
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;