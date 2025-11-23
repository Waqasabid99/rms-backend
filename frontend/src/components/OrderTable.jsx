import { useState } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';

const OrderTable = ({ orders, type, onEdit, onDelete, onView, onStatusChange }) => {
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

  const getStatusOptions = () => {
    if (type === 'reservation') {
      return ['pending', 'confirmed', 'cancelled', 'completed'];
    } else if (type === 'takeaway') {
      return ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    } else {
      return ['pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              {type === 'reservation' ? 'Party Size' : 'Items'}
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              {type === 'reservation' ? 'Time' : 'Total'}
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id || order.booking_id || order.order_id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-mono text-sm text-gray-600">
                {order.booking_id || order.order_id}
              </td>
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900">{order.customer_name}</p>
                  <p className="text-sm text-gray-500">{order.customer_email}</p>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600">
                {type === 'reservation'
                  ? order.party_size
                  : `${order.items?.length || 0} items`}
              </td>
              <td className="py-3 px-4 text-gray-600">
                {type === 'reservation'
                  ? formatDate(order.reservation_time)
                  : `$${order.total?.toFixed(2) || '0.00'}`}
              </td>
              <td className="py-3 px-4">
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.booking_id || order.order_id, e.target.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)} border-0 cursor-pointer`}
                >
                  {getStatusOptions().map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onView(order)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(order)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(order.booking_id || order.order_id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
