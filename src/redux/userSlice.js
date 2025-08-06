// ✅ redux/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './axiosInstance';

// ✅ Fetch users with filters + pagination
export const fetchUsersWithFilter = createAsyncThunk(
  'users/fetchUsersWithFilter',
  async ({ pageNumber, pageSize, sortBy, sortDir, ...filters }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users/filter', {
        params: { pageNumber, pageSize, sortBy, sortDir, ...filters }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const softDeleteUser = createAsyncThunk(
  'users/softDeleteUser',
  async ({ userId, filters }, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      await dispatch(fetchUsersWithFilter(filters));
      return { userId }; // ✅ must return object for .unwrap()
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Soft delete failed');
    }
  }
);

export const restoreUser = createAsyncThunk(
  'users/restoreUser',
  async ({ userId, filters }, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.patch(`/users/${userId}/restore`);
      await dispatch(fetchUsersWithFilter(filters));
      return { userId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Restore failed');
    }
  }
);

export const permanentlyDeleteUser = createAsyncThunk(
  'users/permanentlyDeleteUser',
  async ({ userId, filters }, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.delete(`/users/${userId}/permanent`);
      await dispatch(fetchUsersWithFilter(filters));
      return { userId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Permanent delete failed');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'users/updateStatus',
  async ({ userId, status, pagination }, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.patch(`/users/${userId}/status`, null, {
        params: { isActive: status }
      });
      await dispatch(fetchUsersWithFilter(pagination));
      return { userId, status }; // ✅ must return to support unwrap
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error updating user status');
    }
  }
);

// 🚀 Assign or Replace Roles
export const updateUserRoles = createAsyncThunk(
  'users/updateUserRoles',
  async ({ userId, roleIds, action }, { rejectWithValue, dispatch, getState }) => {
    try {
      const payload = {
        userId,
        roleIds,
        action
      };
      const endpoint = action === 'REPLACE' ? '/roles/replace' : '/roles/assign';

      // 🔧 Proper HTTP method
      if (action === 'REPLACE') {
        await axiosInstance.put(endpoint, payload); // ✅ PUT for replace
      } else {
        await axiosInstance.post(endpoint, payload); // ✅ POST for assign
      }

      // Refresh user list
      const { filters, currentPage, pageSize } = getState().users;
      await dispatch(fetchUsersWithFilter({ ...filters, pageNumber: currentPage - 1, pageSize }));
      return { userId, roleIds }; // ✅ ensure return
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Role update failed');
    }
  }
);

export const removeUserRoles = createAsyncThunk(
  'users/removeUserRoles',
  async ({ userId, roleIds }, { rejectWithValue, dispatch, getState }) => {
    try {
      const payload = { userId, roleIds, action: "REMOVE" };
      await axiosInstance.post('/roles/remove', payload);

      const { filters, currentPage, pageSize } = getState().users;
      await dispatch(fetchUsersWithFilter({ ...filters, pageNumber: currentPage - 1, pageSize }));
      return { userId, roleIds };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Role remove failed');
    }
  }
);

// Add image upload thunk
export const uploadImage = createAsyncThunk('users/uploadImage', async (imageData, { rejectWithValue }) => {
  try {
    console.log('Creating FormData for image upload...');
    const formData = new FormData();
    formData.append('userImage', imageData);
    
    // Log form data contents
    for (let pair of formData.entries()) {
      console.log('FormData:', pair[0], pair[1]);
    }
    
    console.log('Making POST request to /users/image...');
    const response = await axiosInstance.post('/users/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('Upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    // Return more detailed error information
    return rejectWithValue({
      message: error.response?.data?.message || error.message || 'Upload failed',
      status: error.response?.status,
      data: error.response?.data
    });
  }
});

// Add image retrieval thunk
export const getUserImage = createAsyncThunk('users/getUserImage', async (userId, { rejectWithValue }) => {
  try {
    console.log('Fetching image for user ID:', userId);
    const response = await axiosInstance.get(`/users/image/${userId}`);
    console.log('Image fetch successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Image fetch failed:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    // Don't treat 404 or 401 as hard errors
    if (error.response?.status === 404) {
      console.log('User has no profile image (404)');
      return null;
    }
    
    if (error.response?.status === 401) {
      console.warn('Authentication failed for image retrieval (401) - user will see default avatar');
      return null;
    }
    
    return rejectWithValue({
      message: error.response?.data?.message || error.message || 'Failed to fetch image',
      status: error.response?.status,
      data: error.response?.data
    });
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    pageSize: 10,
    sortBy: 'name',
    sortDir: 'asc',
    filters: {
      isDeleted: false,
      isActive: true,
      keyword: ''
    },
    imageUploadLoading: false,
    imageUploadError: null,
    imageError: null
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.currentPage = 1;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersWithFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersWithFilter.fulfilled, (state, action) => {
        const payload = action.payload?.data || {};
        state.loading = false;
        state.users = payload.content || [];
        state.currentPage = (payload.pageable?.pageNumber || 0) + 1;
        state.totalPages = payload.totalPages || 1;
        state.totalUsers = payload.totalElements || 0;
      })
      .addCase(fetchUsersWithFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        const user = state.users.find(u => u.id === userId);
        if (user && user.accountStatus) {
          user.accountStatus.isActive = status;
        }
      })
      .addCase(uploadImage.pending, (state) => {
        state.imageUploadLoading = true;
        state.imageUploadError = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.imageUploadLoading = false;
        if (action.payload.success && action.payload.imageName) {
          state.imageUploadError = null;
        }
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.imageUploadLoading = false;
        state.imageUploadError = action.payload ? action.payload : { errorMessage: 'Image upload failed' };
      })
      .addCase(getUserImage.rejected, (state, action) => {
        state.imageError = action.payload ? action.payload : { errorMessage: 'Failed to get image' };
      });
  }
});

export const { setCurrentPage, setFilters, clearError, setPageSize } = userSlice.actions;
export default userSlice.reducer;
