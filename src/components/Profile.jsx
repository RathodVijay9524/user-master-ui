import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { uploadImage, getUserImage } from '../redux/userSlice';
import { setUser } from '../redux/authSlice';
import axiosInstance from '../redux/axiosInstance';
import './Profile.css';
import { toast } from 'react-toastify';
import PasswordChangeModal from './public/pages/PasswordChangeModal'; // adjust path if needed


const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { imageUploadLoading, imageUploadError, imageError } = useSelector((state) => state.users);
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);


  // Load uploaded image URL from localStorage on component mount
  useEffect(() => {
    const savedImageUrl = localStorage.getItem('uploadedImageUrl');
    if (savedImageUrl) {
      setUploadedImageUrl(savedImageUrl);
    }
  }, []);

  // Fetch user data and image
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        console.log('Current user:', user);

        if (user && user.imageName) {
          console.log('Fetching user image for user ID:', user.id);
          try {
            await dispatch(getUserImage(user.id));
          } catch (imageError) {
            console.warn('Failed to fetch user image:', imageError);
            // Don't fail the entire component if image fetch fails
            // User will see default avatar instead
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user exists
    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user, dispatch]);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

    setPreviewImage(URL.createObjectURL(file));
    setProfileImage(file);

    try {
      console.log('Dispatching uploadImage...');
      const response = await dispatch(uploadImage(file)).unwrap();
      console.log('Upload response:', response);

      // Handle different response structures
      if (response && (response.success || response.data || response.message === 'Image uploaded successfully')) {
        toast.success('Profile image updated successfully');

        // Update user state with new image name
        if (response.imageName && user) {
          const updatedUser = { ...user, imageName: response.imageName };
          dispatch(setUser(updatedUser));
          // Also update localStorage
          localStorage.setItem('user', JSON.stringify(updatedUser));

          // Store the uploaded image URL for persistence (like UserManagement stores data)
          const imageUrl = `${axiosInstance.defaults.baseURL}/users/image/${user.id}?t=${Date.now()}`;
          setUploadedImageUrl(imageUrl);
          localStorage.setItem('uploadedImageUrl', imageUrl);
          localStorage.setItem('userImageName', response.imageName);
        }

        // Refresh user data to get updated image
        if (user?.id) {
          dispatch(getUserImage(user.id));
        }
      } else {
        throw new Error(response?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);

      // Clear preview on error
      setPreviewImage('');
      setProfileImage(null);

      // Handle different error types
      let errorMessage = 'Failed to upload profile image';

      // Check if it's the known backend Java error
      if (error.message && error.message.includes('CompletableFuture.get()')) {
        errorMessage = '⚠️ Backend server issue detected. The image was uploaded but couldn\'t be processed. Please contact the system administrator to fix the Java backend error.';
      } else if (error.status === 500) {
        errorMessage = '🔧 Server error occurred. The backend needs attention from a developer.';
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.errorMessage) {
        errorMessage = error.errorMessage;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast.error(errorMessage, {
        autoClose: 8000, // Show longer for backend errors
        position: 'top-center'
      });
    }
  };

  // Default user data
  const defaultUser = {
    name: 'New User',
    role: 'User',
    username: 'user',
    email: 'user@example.com',
    phoNo: 'Not set',
    about: 'Welcome! Please update your profile information.'
  };

  // Extract user roles
  const getUserRoles = () => {
    if (user?.roles && Array.isArray(user.roles) && user.roles.length > 0) {
      return user.roles.map(role => role.name.replace('ROLE_', '')).join(', ');
    }
    return user?.role || defaultUser.role;
  };

  // Get role color for styling
  const getRoleColor = (roleName) => {
    if (roleName.includes('ADMIN')) return '#dc3545';
    if (roleName.includes('SUPER')) return '#ffc107';
    if (roleName.includes('WORKER')) return '#17a2b8';
    if (roleName.includes('NORMAL')) return '#6c757d';
    return '#667eea';
  };

  // Generate default avatar with user initials
  const getDefaultAvatar = () => {
    const name = user?.name || defaultUser.name;
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return initials;
  };

  return (
    <div className="profile-container">
      {loading ? (
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      ) : (
        <>
          <div className="profile-header">
            <h2>User Profile</h2>
            <p className="profile-subtitle">Manage your account information</p>
          </div>

          <div className="profile-content">
            <div className="profile-info">
              <div className="profile-image-section">
                <div className="profile-image-container">
                  {previewImage || uploadedImageUrl || (user?.imageName) ? (
                    <img
                      src={previewImage || uploadedImageUrl || `${axiosInstance.defaults.baseURL}/users/image/${user.id}?t=${Date.now()}`}
                      alt="Profile"
                      className="profile-image"
                      onClick={() => fileInputRef.current.click()}
                      onError={(e) => {
                        console.warn('Image failed to load, showing default avatar');
                        // Clear the failed image URL from localStorage
                        localStorage.removeItem('uploadedImageUrl');
                        setUploadedImageUrl('');
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}

                  <div
                    className={`default-avatar ${previewImage || user?.imageName ? 'hidden' : ''}`}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <span className="avatar-initials">{getDefaultAvatar()}</span>
                  </div>

                  <div className="upload-overlay">
                    <span className="upload-text">Click to upload</span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />

                  {previewImage && (
                    <button
                      onClick={() => {
                        setPreviewImage('');
                        setProfileImage(null);
                      }}
                      className="remove-image-btn"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="profile-field">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="mt-4 px-4 py-2 bg-blue-200 text-white rounded hover:bg-blue-700 transition"
                  >
                    Change Password
                  </button>
                </div>
              </div>

          

              <div className="profile-details">
                <div className="profile-field">
                  <h3>👤 Full Name</h3>
                  <p>{user?.name || defaultUser.name}</p>
                </div>
                <div className="profile-field">
                  <h3>🎭 Role</h3>
                  <div>
                    {user?.roles && Array.isArray(user.roles) && user.roles.length > 0 ? (
                      user.roles.map((role, index) => (
                        <span
                          key={role.id || index}
                          style={{
                            background: getRoleColor(role.name),
                            color: 'white',
                            padding: '0.4rem 1rem',
                            borderRadius: '25px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            display: 'inline-block',
                            margin: '0 0.5rem 0.5rem 0',
                            textAlign: 'center',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {role.name.replace('ROLE_', '')}
                        </span>
                      ))
                    ) : (
                      <span style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '0.4rem 1rem',
                        borderRadius: '25px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        display: 'inline-block',
                        margin: '0',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {user?.role || defaultUser.role}
                      </span>
                    )}
                  </div>
                </div>
                <div className="profile-field">
                  <h3>🔑 Username</h3>
                  <p>{user?.username || defaultUser.username}</p>
                </div>
                <div className="profile-field">
                  <h3>📧 Email</h3>
                  <p>{user?.email || defaultUser.email}</p>
                </div>
                <div className="profile-field">
                  <h3>📱 Phone</h3>
                  <p>{user?.phoNo || defaultUser.phoNo}</p>
                </div>
                <div className="profile-field">
                  <h3>📝 About</h3>
                  <p>{user?.about || defaultUser.about}</p>
                </div>
               
              </div>
            </div>
          </div>
          {showPasswordModal && (
            <PasswordChangeModal
              show={showPasswordModal}
              onClose={() => setShowPasswordModal(false)}
              onSuccess={() => {
                // Optionally do something after successful password change
                toast.success('Password changed successfully!');
              }}
            />
          )}

        </>
      )}
    </div>

  );
};

export default Profile;
