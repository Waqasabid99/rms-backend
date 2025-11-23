# Restaurant Management System (RMS)

A comprehensive, production-ready Restaurant Management System with Role-Based Access Control (RBAC) built using React.js, Node.js, Express, and Supabase.

## Overview

This system provides a complete solution for managing restaurant operations including reservations, takeaway orders, delivery orders, and staff management. It features two distinct user roles with different levels of access:

- **Admin Role**: Full system access including user management, all order types, and analytics
- **Staff Role**: Limited access focused on order management and customer service

## Quick Start

### 1. Install Dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Start Backend Server

```bash
cd backend
npm run dev
```

Server runs on: `http://localhost:3000`

### 3. Start Frontend Application

```bash
cd frontend
npm run dev
```

Application runs on: `http://localhost:5173`

### 4. Login

**Admin Account:**
- Email: `admin@restaurant.com`
- Password: `Admin@123`

**Staff Account:**
- Email: `staff@restaurant.com`
- Password: `Staff@123`

## Features

### Admin Dashboard
- System overview with statistics
- User management (create, edit, delete users)
- All order types management
- Revenue tracking
- Real-time activity monitoring

### Staff Dashboard
- Order-focused interface
- Today's orders view
- Order status management
- Customer information access

### Order Management
- **Reservations**: Table booking with party size, preferences, dietary requirements
- **Takeaway Orders**: Order items, pickup time, status tracking
- **Delivery Orders**: Delivery address, items, delivery fee, status updates

### User Management (Admin Only)
- Create new users with role assignment
- Edit user details and permissions
- Activate/deactivate user accounts
- View user statistics

### Security Features
- JWT-based authentication
- Bcrypt password hashing
- Row Level Security (RLS) with Supabase
- Protected routes and API endpoints
- Automatic token expiration and refresh

## Technology Stack

### Frontend
- React.js 18 with Vite
- React Router v6 for navigation
- Zustand for state management
- Axios for API communication
- React Hook Form for forms
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Node.js & Express.js
- Supabase (PostgreSQL) for user management
- MongoDB for order management
- JWT for authentication
- Bcrypt for password encryption
- Swagger for API documentation

## Project Structure

```
restaurant-management-system/
├── backend/
│   ├── config/              # Database and service configurations
│   ├── controllers/         # Business logic
│   ├── middleware/          # Authentication and authorization
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── index.js            # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── store/          # Zustand stores
│   │   └── styles/         # CSS files
│   └── index.html
│
├── SETUP.md               # Detailed setup instructions
└── README.md              # This file
```

## API Documentation

Access Swagger documentation at: `http://localhost:3000/api-docs`

### Key Endpoints

**Authentication:**
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user
- `POST /api/auth/change-password` - Change password

**User Management (Admin Only):**
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Orders:**
- `GET /api/reservations` - List reservations
- `GET /api/takeaway` - List takeaway orders
- `GET /api/delivery` - List delivery orders
- `PATCH /api/{type}/:id/status` - Update order status

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
RESTAURANT_DB_URI=mongodb://localhost:27017/restaurant
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## Database Schema

### Supabase Tables (PostgreSQL)

**roles:**
- id (uuid, primary key)
- name (text, unique)
- description (text)
- created_at (timestamptz)

**users:**
- id (uuid, primary key)
- email (text, unique)
- password_hash (text)
- full_name (text)
- role_id (uuid, foreign key)
- phone (text)
- is_active (boolean)
- last_login (timestamptz)
- created_at (timestamptz)
- updated_at (timestamptz)

### MongoDB Collections (Legacy Orders)
- reservations
- takeaway_orders
- delivery_orders
- menu_items

## Development

### Running Tests
```bash
cd backend && npm test
cd frontend && npm test
```

### Building for Production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Security Best Practices

1. Change default admin/staff passwords immediately
2. Use strong JWT_SECRET in production
3. Enable HTTPS in production
4. Never commit .env files
5. Regularly update dependencies
6. Implement rate limiting for production
7. Monitor and log security events

## Troubleshooting

### Common Issues

**Backend won't start:**
- Verify all environment variables are set
- Check MongoDB connection
- Ensure Supabase credentials are correct

**Frontend can't connect to API:**
- Verify backend is running
- Check VITE_API_URL in .env
- Clear browser cache and localStorage

**Login fails:**
- Verify user credentials
- Check backend logs for errors
- Ensure database connection is active

### Debug Mode
```bash
DEBUG=* npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For detailed setup instructions, see [SETUP.md](./SETUP.md)

For API documentation, visit `http://localhost:3000/api-docs` when running the server

## Roadmap

- [ ] Add email notifications
- [ ] Implement real-time order updates with WebSockets
- [ ] Add reporting and analytics dashboard
- [ ] Mobile-responsive design improvements
- [ ] Add menu management interface
- [ ] Implement payment gateway integration
- [ ] Add customer loyalty program
- [ ] Multi-language support

## Credits

Built with modern web technologies and best practices for restaurant management.
