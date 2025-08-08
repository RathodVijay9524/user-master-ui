# Application Documentation - User Management System

## Overview
This is a comprehensive React-based user management application with role-based access control (RBAC) supporting three user types: Admin, User, and Worker. The application uses Redux Toolkit for state management and implements a sophisticated authentication and authorization system.

## Technology Stack
- **Frontend**: React 18 with Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router DOM
- **Authentication**: JWT tokens with role-based access
- **Backend**: RESTful API (Spring Boot assumed)

## Architecture Overview

### Application Structure
```
src/
├── redux/           # Redux store and slices
├── components/      # React components
├── service/         # API service layer
├── PrivateRoute.jsx # Route protection
├── RoleBasedGuard.jsx # Role-based access control
└── App.jsx         # Main application component
```

## Redux State Management

### Store Configuration (`src/redux/store.js`)
```javascript
store: {
  auth: authReducer,      // Authentication state
  users: userReducer,     // User management
  workers: workerReducer  // Worker management
}
```

### 1. Authentication Slice (`src/redux/authSlice.js`)

#### State Structure
```javascript
auth: {
  user: null,           // Current authenticated user
  token: null,          // JWT token
  loading: false,       // Loading state
  error: null          // Error messages
}
```

#### Key Actions
- `login`: Authenticates user credentials
- `fetchUserData`: Retrieves current user data
- `logout`: Clears authentication state

#### Authentication Flow
1. User submits credentials via login form
2. `login` async thunk dispatches API call to `/auth/login`
3. On success: JWT token and user data stored in localStorage
4. Token automatically attached to subsequent requests via axios interceptor
5. User roles determine accessible routes

### 2. User Slice (`src/redux/userSlice.js`)

#### State Structure
```javascript
users: {
  users: [],            // List of all users
  loading: false,       // Loading state
  error: null,         // Error messages
  currentPage: 1,      // Current pagination page
  totalPages: 1,       // Total pages available
  totalUsers: 0,       // Total user count
  pageSize: 10,        // Items per page
  sortBy: 'name',      // Sort field
  sortDir: 'asc',      // Sort direction
  filters: {           // Active filters
    isDeleted: false,
    isActive: true,
    keyword: ''
  }
}
```

#### Key Async Actions
- `fetchUsersWithFilter`: Retrieves paginated user list with filtering
- `softDeleteUser`: Soft deletes a user (marks as deleted)
- `restoreUser`: Restores a soft-deleted user
- `permanentlyDeleteUser`: Permanently removes user
- `updateUserStatus`: Activates/deactivates user account
- `updateUserRoles`: Assigns/replaces user roles
- `removeUserRoles`: Removes specific roles from user
- `uploadImage`: Handles user profile image upload
- `getUserImage`: Retrieves user profile image
- `changePassword`: Changes user password

### 3. Worker Slice (`src/redux/workerSlice.jsx`)

#### State Structure
```javascript
workers: {
  workers: [],         // List of workers
  loading: false,      // Loading state
  error: null,        // Error messages
  currentPage: 1,     // Current pagination page
  totalPages: 1,      // Total pages available
  totalWorkers: 0,    // Total worker count
  pageSize: 10,       // Items per page
  sortBy: 'createdOn', // Default sort field
  sortDir: 'desc',    // Default sort direction
  filters: {          // Active filters
    isDeleted: false,
    isActive: true,
    keyword: ''
  }
}
```

#### Key Async Actions
- `fetchWorkersWithFilter`: Retrieves paginated worker list
- `softDeleteWorker`: Soft deletes a worker
- `restoreWorker`: Restores a soft-deleted worker
- `permanentlyDeleteWorker`: Permanently removes worker
- `updateWorkerStatus`: Activates/deactivates worker account

## API Service Layer

### Axios Configuration (`src/redux/axiosInstance.js`)
- **Base URL**: `http://localhost:9091/api`
- **Request Interceptor**: Automatically adds JWT token to headers
- **Response Interceptor**: Handles 401 errors by redirecting to login

### API Endpoints

#### Authentication Endpoints
- `POST /auth/login` - User authentication
- `GET /auth/current-user` - Get current user data
- `PUT /auth/change-password` - Change user password

#### User Management Endpoints
- `GET /users/filter` - Get users with pagination and filters
- `DELETE /users/:id` - Soft delete user
- `DELETE /users/:id/permanent` - Permanent delete user
- `PATCH /users/:id/restore` - Restore soft-deleted user
- `PATCH /users/:id/status` - Update user status
- `POST /users/image` - Upload user profile image
- `GET /users/image/:userId` - Get user profile image

#### Worker Management Endpoints
- `GET /v1/workers/superuser/:superUserId/advanced-filter` - Get workers with filters
- `DELETE /v1/workers/:id` - Soft delete worker
- `DELETE /v1/workers/:id/permanent` - Permanent delete worker
- `PATCH /v1/workers/:id/restore` - Restore soft-deleted worker
- `PATCH /v1/workers/:id/status` - Update worker status

#### Role Management Endpoints
- `POST /roles/assign` - Assign roles to user
- `PUT /roles/replace` - Replace user roles
- `POST /roles/remove` - Remove roles from user

## Routing and Access Control

### PrivateRoute Component (`src/PrivateRoute.jsx`)
Protects routes based on authentication status:
- Checks for valid JWT token
- Redirects to login if not authenticated
- Supports role-based access

### RoleBasedGuard Component (`src/redux/RoleBasedGuard.jsx`)
Provides role-based access control:
- Validates user roles against required roles
- Supports multiple role checking
- Provides fallback UI for unauthorized access

### Application Routing (`src/App.jsx`)
The application implements a sophisticated routing system with three main user interfaces:

#### 1. Admin Interface (`/admin/*`)
- **AdminDashboard**: Main admin dashboard
- **UserManagement**: Complete user CRUD operations
- **UserDetailsModal**: Detailed user information
- **RoleEditorModal**: Role management interface

#### 2. User Interface (`/user/*`)
- **UserDashboard**: User-specific dashboard
- **Profile**: User profile management
- **WorkerManagement**: Worker oversight (for users with worker management permissions)

#### 3. Worker Interface (`/worker/*`)
- **WorkerDashboard**: Worker-specific dashboard
- **Profile**: Worker profile management

#### 4. Public Interface (`/`)
- **Home**: Landing page
- **Login**: Authentication page
- **UserRegistration**: New user registration
- **ForgotPassword**: Password reset initiation
- **ResetPassword**: Password reset completion
- **VerifyAccount**: Email verification

## Data Flow Architecture

### Authentication Flow
```
1. User Login
   ↓
2. JWT Token Received
   ↓
3. Token Stored in localStorage
   ↓
4. Axios Interceptor Adds Token
   ↓
5. User Data Fetched
   ↓
6. Role-Based Routing Applied
```

### User Management Flow
```
1. Admin Accesses User Management
   ↓
2. fetchUsersWithFilter Dispatched
   ↓
3. API Call with Pagination/Filters
   ↓
4. User List Displayed
   ↓
5. CRUD Operations Available
   ↓
6. State Updated Automatically
```

### Worker Management Flow
```
1. Superuser Accesses Worker Management
   ↓
2. fetchWorkersWithFilter Dispatched
   ↓
3. API Call with Superuser ID
   ↓
4. Worker List Displayed
   ↓
5. CRUD Operations Available
   ↓
6. State Updated Automatically
```

## State Management Patterns

### Async Thunk Pattern
All async operations use Redux Toolkit's createAsyncThunk:
- Pending state handling
- Fulfilled state updates
- Error handling with rejectWithValue
- Automatic loading states

### Optimistic Updates
State updates occur optimistically:
- UI updates immediately
- API calls happen in background
- Rollback on error

### Pagination Pattern
Consistent pagination across all list operations:
- Server-side pagination
- Client-side state management
- Filter preservation across pages

## Security Features

### JWT Token Management
- Tokens stored in localStorage
- Automatic inclusion in API calls
- 401 error handling with redirect

### Role-Based Access Control
- Route-level protection
- Component-level authorization
- API-level permission checking

### Input Validation
- Form validation on client side
- Server-side validation
- Error handling with user feedback

## Error Handling

### Global Error Handling
- Axios interceptors for API errors
- Redux error states in slices
- User-friendly error messages

### Component-Level Error Handling
- Loading states
- Error boundaries
- Retry mechanisms

## Performance Optimizations

### Code Splitting
- Route-based code splitting
- Component lazy loading

### State Management
- Redux Toolkit's Immer for immutable updates
- Selective component re-rendering
- Optimized re-renders with React.memo

### API Optimization
- Pagination for large datasets
- Debounced search
- Caching strategies

## Development Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Backend API running on localhost:9091

### Installation
```bash
npm install
npm run dev
```

### Environment Variables
- Base API URL configured in axiosInstance.js
- No additional environment files required

## Testing Considerations

### Unit Testing
- Redux slice testing
- Component testing
- API mocking

### Integration Testing
- End-to-end user flows
- Authentication flows
- Role-based access testing

## Deployment Considerations

### Build Configuration
- Vite for optimized builds
- Environment-specific configurations
- Static asset optimization

### Production Considerations
- API URL configuration
- Security headers
- Error monitoring
- Performance monitoring
