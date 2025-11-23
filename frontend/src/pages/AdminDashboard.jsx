import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  Users,
  CalendarCheck,
  ShoppingBag,
  Truck,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { userAPI, reservationAPI, takeawayAPI, deliveryAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, byRole: {} },
    reservations: { total: 0, byStatus: [] },
    takeaway: { total: 0, totalRevenue: 0, byStatus: [] },
    delivery: { total: 0, totalRevenue: 0, byStatus: [] },
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [usersRes, reservationsRes, takeawayRes, deliveryRes] =
        await Promise.all([
          userAPI.getStats(),
          reservationAPI.getStats(),
          takeawayAPI.getStats(),
          deliveryAPI.getStats(),
        ]);

      setStats({
        users: usersRes.data.data,
        reservations: reservationsRes.data.data,
        takeaway: takeawayRes.data.data,
        delivery: deliveryRes.data.data,
      });

      const [recentReservations, recentTakeaway, recentDelivery] =
        await Promise.all([
          reservationAPI.getAll({ sortBy: 'created_at', order: 'desc' }),
          takeawayAPI.getAll({ sortBy: 'created_at', order: 'desc' }),
          deliveryAPI.getAll({ sortBy: 'created_at', order: 'desc' }),
        ]);

      const allActivity = [
        ...recentReservations.data.data.slice(0, 3).map((r) => ({
          type: 'Reservation',
          customer: r.customer_name,
          time: r.created_at,
          status: r.status,
        })),
        ...recentTakeaway.data.data.slice(0, 3).map((t) => ({
          type: 'Takeaway',
          customer: t.customer_name,
          time: t.created_at,
          status: t.status,
        })),
        ...recentDelivery.data.data.slice(0, 3).map((d) => ({
          type: 'Delivery',
          customer: d.customer_name,
          time: d.created_at,
          status: d.status,
        })),
      ];

      allActivity.sort((a, b) => new Date(b.time) - new Date(a.time));
      setRecentActivity(allActivity.slice(0, 8));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.users.total,
      subtitle: `${stats.users.active} active`,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Reservations',
      value: stats.reservations.total,
      subtitle: 'All time',
      icon: CalendarCheck,
      color: 'bg-green-500',
    },
    {
      title: 'Takeaway Revenue',
      value: `$${stats.takeaway.totalRevenue.toFixed(2)}`,
      subtitle: `${stats.takeaway.total} orders`,
      icon: ShoppingBag,
      color: 'bg-orange-500',
    },
    {
      title: 'Delivery Revenue',
      value: `$${stats.delivery.totalRevenue.toFixed(2)}`,
      subtitle: `${stats.delivery.total} orders`,
      icon: Truck,
      color: 'bg-purple-500',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-gray-100 text-gray-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's your restaurant overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Activity
              </h2>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {activity.type === 'Reservation' && (
                          <CalendarCheck className="w-5 h-5 text-blue-600" />
                        )}
                        {activity.type === 'Takeaway' && (
                          <ShoppingBag className="w-5 h-5 text-orange-600" />
                        )}
                        {activity.type === 'Delivery' && (
                          <Truck className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {activity.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.customer}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Quick Stats</h2>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Users</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {stats.users.total}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Admin: {stats.users.byRole.admin || 0} | Staff:{' '}
                  {stats.users.byRole.staff || 0}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  $
                  {(
                    stats.takeaway.totalRevenue + stats.delivery.totalRevenue
                  ).toFixed(2)}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  From{' '}
                  {stats.takeaway.total + stats.delivery.total} orders
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">
                  Reservations
                </p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {stats.reservations.total}
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  All time bookings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
