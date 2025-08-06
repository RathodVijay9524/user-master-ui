import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import workerReducer from './workerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    workers: workerReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['users/fetchAllUsers/fulfilled', 
          'users/updateStatus/fulfilled',
          'workers/fetchWorkersWithFilter/fulfilled',
          'workers/updateWorkerStatus/fulfilled',
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['users.users', 'workers.workers'],
      },
    }),
});

export default store;
