# Restaurant Management System - Setup Guide

A comprehensive Role-Based Access Control (RBAC) system for restaurant management with Admin and Staff roles.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [User Credentials](#user-credentials)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)

## Features

### Admin Role (Full Access)
- View/manage all orders (reservation, takeaway, delivery)
- Create, edit, and delete orders
- Add, edit, and remove staff members
- View customer data and analytics
- Access to admin dashboard with system overview
- User management with role assignment

### Staff Role (Limited Access)
- View and manage orders only
- Create and edit customer information
- Access to staff dashboard with order-focused interface
- Cannot access staff management features

## Technology Stack

### Backend
- Node.js & Express.js
- Supabase (PostgreSQL database)
- JWT for authentication
- Bcrypt for password hashing
- MongoDB for existing order management (legacy)
- Swagger for API documentation

### Frontend
- React.js with Vite
- React Router for navigation
- Zustand for state management
- Axios for API communication
- React Hook Form for form handling
- Lucide React for icons
- Tailwind CSS for styling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account (database already provisioned)
- MongoDB instance (for legacy order data)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd restaurant-management-system
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# MongoDB Connection (Legacy Order System)
RESTAURANT_DB_URI=mongodb://localhost:27017/restaurant

# Supabase Configuration (User Management)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Firebase Configuration (if using Firebase auth)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key

# LiveKit Configuration (for video features)
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
```

### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## Database Setup

The Supabase database schema has been automatically created with the following tables:

### Tables Created
1. **roles** - Stores user roles (admin, staff)
2. **users** - Stores user accounts with role assignments

### Default Data
- **Roles**: Admin and Staff roles are pre-configured
- **Users**: Default admin and staff accounts are created

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:
- Users can view their own profile
- Admin users can manage all users
- Users can only update their own profile (role-locked)

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:3000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## User Credentials

### Admin Account
- **Email**: admin@restaurant.com
- **Password**: Admin@123
- **Access**: Full system access including user management

### Staff Account
- **Email**: staff@restaurant.com
- **Password**: Staff@123
- **Access**: Order management only (no user management)

**Important**: Change these default passwords immediately in production!

## API Documentation

### Swagger Documentation
Access API documentation at: `http://localhost:3000/api-docs`

### Key API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/change-password` - Change password

#### User Management (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - Get user statistics
- `GET /api/roles` - Get all roles

#### Reservations
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create reservation
- `PUT /api/reservations/:id` - Update reservation
- `PATCH /api/reservations/:id/status` - Update status
- `DELETE /api/reservations/:id` - Delete reservation

#### Takeaway Orders
- `GET /api/takeaway` - Get all takeaway orders
- `POST /api/takeaway` - Create takeaway order
- `PATCH /api/takeaway/:id/status` - Update status

#### Delivery Orders
- `GET /api/delivery` - Get all delivery orders
- `POST /api/delivery` - Create delivery order
- `PATCH /api/delivery/:id/status` - Update status

## Project Structure

```
restaurant-management-system/
├── backend/
│   ├── config/
│   │   ├── db.con.js              # MongoDB connection
│   │   ├── firebase.config.js     # Firebase configuration
│   │   └── supabase.config.js     # Supabase configuration
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── userController.js      # User management
│   │   ├── reservationController.js
│   │   ├── takeawayController.js
│   │   └── deliveryController.js
│   ├── middleware/
│   │   ├── auth.middleware.js     # Firebase auth
│   │   └── jwt.middleware.js      # JWT auth & RBAC
│   ├── models/                    # MongoDB models
│   ├── routes/
│   │   └── index.js               # API routes
│   └── index.js                   # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx         # Main layout with sidebar
│   │   │   ├── ProtectedRoute.jsx # Route protection
│   │   │   └── OrderTable.jsx     # Reusable order table
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── AdminDashboard.jsx # Admin dashboard
│   │   │   ├── StaffDashboard.jsx # Staff dashboard
│   │   │   ├── UserManagement.jsx # User CRUD
│   │   │   └── Reservations.jsx   # Reservation management
│   │   ├── services/
│   │   │   └── api.js             # API service layer
│   │   ├── store/
│   │   │   └── authStore.js       # Zustand auth store
│   │   ├── App.jsx                # Main app component
│   │   └── main.jsx               # Entry point
│   └── index.html
│
└── SETUP.md                        # This file
```

## Key Features Implementation

### Authentication Flow
1. User logs in with email/password
2. Backend validates credentials against Supabase users table
3. JWT token is generated and returned
4. Frontend stores token in localStorage
5. Token is included in all subsequent API requests
6. Middleware validates token and attaches user info to request

### Role-Based Access Control
1. User role is stored in JWT token
2. Protected routes check user role
3. Backend middleware `authorizeRole()` enforces permissions
4. Frontend conditionally renders UI based on role

### Security Features
- JWT-based authentication
- Bcrypt password hashing
- Row Level Security (RLS) on Supabase
- CORS configuration
- Helmet.js for security headers
- Protected API endpoints
- Token expiration (24 hours)
- Automatic logout on token expiration

## Development Tips

### Adding New Users
1. Login as admin (admin@restaurant.com)
2. Navigate to User Management
3. Click "Add User"
4. Fill in user details and select role
5. User can now login with provided credentials

### Testing RBAC
1. Login as admin - verify full access
2. Login as staff - verify limited access
3. Try accessing admin routes as staff - should redirect to unauthorized

### Customizing Roles
1. Add new roles to Supabase `roles` table
2. Update RLS policies as needed
3. Add role checks in middleware
4. Update frontend navigation based on new roles

## Troubleshooting

### Backend Issues
- **Database Connection Failed**: Verify Supabase credentials in .env
- **MongoDB Connection Failed**: Ensure MongoDB is running
- **Port Already in Use**: Change PORT in .env or kill existing process

### Frontend Issues
- **API Connection Failed**: Verify VITE_API_URL in .env
- **Login Failed**: Check backend is running and credentials are correct
- **Unauthorized Access**: Clear localStorage and login again

### Common Fixes
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear browser cache and localStorage
# Open DevTools > Application > Clear Storage

# Restart both servers
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use environment-specific database URLs
3. Configure proper CORS origins
4. Enable HTTPS
5. Set strong JWT_SECRET
6. Configure logging
7. Set up process manager (PM2)

### Frontend
1. Build for production: `npm run build`
2. Deploy dist folder to hosting service
3. Update VITE_API_URL to production API
4. Configure CDN if needed

## Security Best Practices

1. **Change Default Passwords**: Immediately change default admin/staff passwords
2. **Environment Variables**: Never commit .env files
3. **JWT Secret**: Use strong, random JWT_SECRET in production
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Consider adding rate limiting to API
6. **Input Validation**: Validate all user inputs
7. **SQL Injection**: Use parameterized queries (handled by Supabase)
8. **XSS Protection**: Sanitize user inputs (React handles by default)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation at `/api-docs`
3. Check console logs for errors
4. Verify environment variables are set correctly

## License

MIT License - See LICENSE file for details
