import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import OrderTable from '../components/OrderTable';
import { Search, Plus, Filter, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { reservationAPI } from '../services/api';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationAPI.getAll({
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchTerm || undefined,
      });
      setReservations(response.data.data);
    } catch (error) {
      showMessage('error', 'Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await reservationAPI.updateStatus(id, newStatus);
      showMessage('success', 'Status updated successfully');
      fetchReservations();
    } catch (error) {
      showMessage('error', 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return;

    try {
      await reservationAPI.delete(id);
      showMessage('success', 'Reservation deleted successfully');
      fetchReservations();
    } catch (error) {
      showMessage('error', 'Failed to delete reservation');
    }
  };

  const handleView = (reservation) => {
    alert(JSON.stringify(reservation, null, 2));
  };

  const handleEdit = (reservation) => {
    alert('Edit functionality - Implement modal form');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReservations();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus]);

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.booking_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
            <p className="text-gray-600 mt-2">Manage restaurant reservations</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            New Reservation
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg flex items-center ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-3" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-3" />
            )}
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reservations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <OrderTable
              orders={filteredReservations}
              type="reservation"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reservations;
