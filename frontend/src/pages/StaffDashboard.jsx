import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  CalendarCheck,
  ShoppingBag,
  Truck,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { reservationAPI, takeawayAPI, deliveryAPI } from '../services/api';

const StaffDashboard = () => {
  const [stats, setStats] = useState({
    reservations: { total: 0, byStatus: [] },
    takeaway: { total: 0, totalRevenue: 0, byStatus: [] },
    delivery: { total: 0, totalRevenue: 0, byStatus: [] },
  });
  const [loading, setLoading] = useState(true);
  const [todayOrders, setTodayOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [reservationsRes, takeawayRes, deliveryRes] = await Promise.all([
        reservationAPI.getStats(),
        takeawayAPI.getStats(),
        deliveryAPI.getStats(),
      ]);

      setStats({
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

      const today = new Date().toDateString();
      const allOrders = [
        ...recentReservations.data.data
          .filter(
            (r) => new Date(r.created_at).toDateString() === today
          )
          .map((r) => ({
            type: 'Reservation',
            customer: r.customer_name,
            time: r.reservation_time,
            status: r.status,
            id: r.booking_id,
          })),
        ...recentTakeaway.data.data
          .filter(
            (t) => new Date(t.created_at).toDateString() === today
          )
          .map((t) => ({
            type: 'Takeaway',
            customer: t.customer_name,
            time: t.pickup_time,
            status: t.status,
            id: t.order_id,
          })),
        ...recentDelivery.data.data
          .filter(
            (d) => new Date(d.created_at).toDateString() === today
          )
          .map((d) => ({
            type: 'Delivery',
            customer: d.customer_name,
            time: d.delivery_time,
            status: d.status,
            id: d.order_id,
          })),
      ];

      allOrders.sort((a, b) => new Date(b.time) - new Date(a.time));
      setTodayOrders(allOrders);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Reservations',
      value: stats.reservations.total,
      subtitle: 'Total bookings',
      icon: CalendarCheck,
      color: 'bg-green-500',
    },
    {
      title: 'Takeaway Orders',
      value: stats.takeaway.total,
      subtitle: `$${stats.takeaway.totalRevenue.toFixed(2)} revenue`,
      icon: ShoppingBag,
      color: 'bg-orange-500',
    },
    {
      title: 'Delivery Orders',
      value: stats.delivery.total,
      subtitle: `$${stats.delivery.totalRevenue.toFixed(2)} revenue`,
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
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage orders and reservations efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Today's Orders</h2>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {todayOrders.length} orders
              </span>
            </div>
          </div>

          {todayOrders.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No orders for today yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayOrders.map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                      {order.type === 'Reservation' && (
                        <CalendarCheck className="w-5 h-5 text-green-600" />
                      )}
                      {order.type === 'Takeaway' && (
                        <ShoppingBag className="w-5 h-5 text-orange-600" />
                      )}
                      {order.type === 'Delivery' && (
                        <Truck className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.type} - {order.id}
                      </p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Reservation Status
            </h3>
            <div className="space-y-3">
              {stats.reservations.byStatus.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {status._id}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {status.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Takeaway Status
            </h3>
            <div className="space-y-3">
              {stats.takeaway.byStatus.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {status._id}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {status.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Delivery Status
            </h3>
            <div className="space-y-3">
              {stats.delivery.byStatus.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {status._id}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {status.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StaffDashboard;
