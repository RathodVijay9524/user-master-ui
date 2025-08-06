// ✅ redux/workerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './axiosInstance';

// ✅ Fetch workers with filters + pagination
export const fetchWorkersWithFilter = createAsyncThunk(
  'workers/fetchWorkersWithFilter',
  async ({ superUserId, pageNumber, pageSize, sortBy, sortDir, ...filters }, { rejectWithValue }) => {
    if (!superUserId) {
      return rejectWithValue("superUserId is required and cannot be undefined.");
    }

    try {
      const response = await axiosInstance.get(`/v1/workers/superuser/${superUserId}/advanced-filter`, {
        params: {
          page: pageNumber,
          size: pageSize,
          sortBy,
          sortDir,
          ...Object.fromEntries(Object.entries(filters).filter(([key, val]) => !(key === 'keyword' && !val)))
        }
      });
      return response.data;
    } catch (error) {
      console.error("❌ Fetch failed:", error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workers');
    }
  }
);


export const softDeleteWorker = createAsyncThunk(
  'workers/softDeleteWorker',
  async ({ workerId, filters }, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.delete(`/v1/workers/${workerId}`);
      await dispatch(fetchWorkersWithFilter(filters));
      return { workerId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Soft delete failed');
    }
  }
);

export const restoreWorker = createAsyncThunk(
  'workers/restoreWorker',
  async ({ workerId, filters }, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.patch(`/v1/workers/${workerId}/restore`);
      await dispatch(fetchWorkersWithFilter(filters));
      return { workerId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Restore failed');
    }
  }
);

export const permanentlyDeleteWorker = createAsyncThunk(
  'workers/permanentlyDeleteWorker',
  async ({ workerId, filters }, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.delete(`/v1/workers/${workerId}/permanent`);
      await dispatch(fetchWorkersWithFilter(filters));
      return { workerId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Permanent delete failed');
    }
  }
);

export const updateWorkerStatus = createAsyncThunk(
  'workers/updateWorkerStatus',
  async ({ workerId, status, pagination }, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.patch(`/v1/workers/${workerId}/status`, null, {
        params: { isActive: status }
      });
      await dispatch(fetchWorkersWithFilter(pagination));
      return { workerId, status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Status update failed');
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


const workerSlice = createSlice({
  name: 'workers',
  initialState: {
    workers: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalWorkers: 0,
    pageSize: 10,
    sortBy: 'createdOn',
    sortDir: 'desc',
    filters: {
      isDeleted: false,
      isActive: true,
      keyword: ''
    }
  },
  reducers: {
    setWorkerPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setWorkerFilters: (state, action) => {
      state.filters = action.payload;
      state.currentPage = 1;
    },
    setWorkerPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    clearWorkerError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkersWithFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkersWithFilter.fulfilled, (state, action) => {
        const payload = action.payload?.data || {};
        state.loading = false;
        state.workers = payload.content || [];
        state.currentPage = (payload.pageable?.pageNumber || 0) + 1;
        state.totalPages = payload.totalPages || 1;
        state.totalWorkers = payload.totalElements || 0;
      })
      .addCase(fetchWorkersWithFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch workers';
      })
      .addCase(updateWorkerStatus.fulfilled, (state, action) => {
        const { workerId, status } = action.payload;
        const worker = state.workers.find(w => w.id === workerId);
        if (worker && worker.accountStatus) {
          worker.accountStatus.isActive = status;
        }
      });
  }
});

export const {
  setWorkerPage,
  setWorkerFilters,
  clearWorkerError,
  setWorkerPageSize
} = workerSlice.actions;

export default workerSlice.reducer;
