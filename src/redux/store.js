import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import workerReducer from './workerSlice';
import chatReducer from './chat/chatSlice';
import settingsReducer from './chat/settingsSlice';
import themeReducer from './chat/themeSlice';
import chatListReducer from './chat/chatListSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    workers: workerReducer,
    chat: chatReducer,
    settings: settingsReducer,
    theme: themeReducer,
    chatList: chatListReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['users/fetchAllUsers/fulfilled', 
          'users/updateStatus/fulfilled',
          'workers/fetchWorkersWithFilter/fulfilled',
          'workers/updateWorkerStatus/fulfilled',
          'chat/sendMessage/fulfilled',
          'settings/fetchProviders/fulfilled',
          'settings/fetchModelsForProvider/fulfilled',
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['users.users', 'workers.workers', 'chat.messages', 'settings.providers'],
      },
    }),
});

export default store;
