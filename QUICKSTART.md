# Quick Start Guide - Restaurant Management System

Get up and running in 5 minutes!

## Prerequisites

- Node.js v14+ installed
- MongoDB running (for order management)
- Supabase account (already configured)

## Step 1: Install Dependencies (2 minutes)

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Step 2: Start Backend (30 seconds)

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port http://localhost:3000 in development mode
Database connected successfully
```

## Step 3: Start Frontend (30 seconds)

Open a new terminal:

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## Step 4: Login (1 minute)

1. Open browser to `http://localhost:5173`
2. You'll see the login page

**Try Admin Access:**
- Email: `admin@restaurant.com`
- Password: `Admin@123`
- Click "Sign In"
- You'll be redirected to the Admin Dashboard

**Try Staff Access:**
- Logout (click user menu → Logout)
- Email: `staff@restaurant.com`
- Password: `Staff@123`
- You'll see the Staff Dashboard (limited features)

## Step 5: Explore Features

### As Admin:
1. **Dashboard**: View system statistics and recent activity
2. **User Management**: Click "User Management" in sidebar
   - Create a new user
   - Edit existing users
   - Manage roles
3. **Orders**: Access Reservations, Takeaway, Delivery
4. **Profile**: Update your profile settings

### As Staff:
1. **Dashboard**: View today's orders
2. **Orders**: Manage reservations and orders
3. **Limited Access**: No user management features

## API Documentation

Visit: `http://localhost:3000/api-docs`

## Test the System

### Create a New Staff User (as Admin)
1. Login as admin
2. Go to User Management
3. Click "Add User"
4. Fill in:
   - Full Name: "Test Staff"
   - Email: "test@restaurant.com"
   - Password: "Test123"
   - Phone: "+1234567892"
   - Role: "Staff"
5. Click "Create"
6. Logout and login with new credentials

### Manage Orders
1. Go to Reservations
2. View existing reservations
3. Update order status using dropdown
4. Search for specific orders
5. Filter by status

## Troubleshooting

### Backend Issues

**Port 3000 already in use:**
```bash
lsof -ti:3000 | xargs kill -9
```

**MongoDB connection failed:**
- Ensure MongoDB is running: `mongod`
- Check connection string in backend/.env

**Supabase connection failed:**
- Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env

### Frontend Issues

**API connection failed:**
- Verify backend is running on port 3000
- Check VITE_API_URL in frontend/.env

**Login fails with correct credentials:**
- Open browser console (F12)
- Check for CORS errors
- Verify backend is running
- Clear localStorage: `localStorage.clear()`

**Blank page after login:**
- Check browser console for errors
- Clear cache and reload (Ctrl+Shift+R)

### Quick Fixes

**Reset Everything:**
```bash
pkill -f node
cd backend && npm run dev &
cd ../frontend && npm run dev
```

**Clear Browser Data:**
1. Open DevTools (F12)
2. Application tab
3. Clear Storage
4. Reload page

## Next Steps

1. **Read Full Documentation**: See [SETUP.md](./SETUP.md) for detailed instructions
2. **Explore API**: Visit Swagger docs at http://localhost:3000/api-docs
3. **Customize**: Modify components in `frontend/src/`
4. **Extend Backend**: Add controllers in `backend/controllers/`

## Key Files to Know

```
backend/
├── .env                    # Backend configuration
├── index.js               # Server entry point
├── routes/index.js        # API routes
└── controllers/           # Business logic

frontend/
├── .env                   # Frontend configuration
├── src/App.jsx           # Main app with routing
├── src/pages/            # Page components
└── src/store/authStore.js # Authentication state
```

## Default Credentials

| Role  | Email                     | Password   |
|-------|---------------------------|------------|
| Admin | admin@restaurant.com      | Admin@123  |
| Staff | staff@restaurant.com      | Staff@123  |

**⚠️ Change these passwords in production!**

## Development Workflow

1. Make changes to code
2. Save files (hot reload automatic)
3. Test in browser
4. Check console for errors
5. Commit changes

## Production Deployment

See [SETUP.md](./SETUP.md) for production deployment instructions.

## Support

- **Full Setup**: [SETUP.md](./SETUP.md)
- **API Docs**: http://localhost:3000/api-docs
- **Issues**: Check troubleshooting section above

## Success Indicators

✅ Backend running on port 3000
✅ Frontend running on port 5173
✅ Can login as admin
✅ Can login as staff
✅ Admin sees User Management
✅ Staff doesn't see User Management
✅ Can view orders
✅ Can update order status

If all boxes checked - you're ready to go! 🎉
