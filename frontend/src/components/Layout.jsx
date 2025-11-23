import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ShoppingBag,
  Truck,
  Menu as MenuIcon,
  LogOut,
  X,
  ChevronDown,
  User,
  Settings,
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const navigation = [
    {
      name: 'Dashboard',
      href: isAdmin ? '/admin/dashboard' : '/staff/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'staff'],
    },
    {
      name: 'Reservations',
      href: isAdmin ? '/admin/reservations' : '/staff/reservations',
      icon: CalendarCheck,
      roles: ['admin', 'staff'],
    },
    {
      name: 'Takeaway Orders',
      href: isAdmin ? '/admin/takeaway' : '/staff/takeaway',
      icon: ShoppingBag,
      roles: ['admin', 'staff'],
    },
    {
      name: 'Delivery Orders',
      href: isAdmin ? '/admin/delivery' : '/staff/delivery',
      icon: Truck,
      roles: ['admin', 'staff'],
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: Users,
      roles: ['admin'],
    },
  ];

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">RMS</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{user?.full_name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <Link
                    to={isAdmin ? '/admin/profile' : '/staff/profile'}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : ''
        }`}
      >
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <MenuIcon className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full capitalize">
                {user?.role}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
