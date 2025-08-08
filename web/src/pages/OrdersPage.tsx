import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => (await axios.get('/api/orders')).data,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load orders
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600">Place an order to see it listed here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order: any) => (
          <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Order #{order.id}</div>
                <div className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</div>
              </div>
              <div className="font-bold">${order.total.toFixed(2)}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


