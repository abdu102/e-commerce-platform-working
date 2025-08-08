import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number; // dollars from backend mapper
    imageUrl: string;
    stock: number;
  };
  quantity: number;
}

interface CartResponse {
  items: CartItem[];
  total: number; // dollars
}

export default function CartPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  const { data: cartData, isLoading } = useQuery<CartResponse>({
    queryKey: ['cart'],
    queryFn: async () => (await axios.get('/api/cart')).data,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      axios.put(`/api/cart/${itemId}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: number) => axios.delete(`/api/cart/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(itemId);
    try {
      await updateQuantityMutation.mutateAsync({ itemId, quantity: newQuantity });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeItemMutation.mutateAsync(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const items = cartData?.items || [];
  const total = cartData?.total || 0;
  const itemCount = items.length;

  const buyAll = async () => {
    if (items.length === 0) return;
    // Redirect to checkout page instead of directly creating order
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">{itemCount} items</div>
              <div className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</div>
            </div>
          </div>
        </motion.div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item: CartItem, index: number) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{item.product.name}</h3>
                        <p className="text-gray-600 text-sm">Stock: {item.product.stock} available</p>
                        <div className="text-xl font-bold text-gray-900 mt-2">${item.product.price.toFixed(2)}</div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1 || isUpdating === item.id} className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 text-lg font-medium">
                            {isUpdating === item.id ? (
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock || isUpdating === item.id} className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleRemoveItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Subtotal for {item.quantity} item{item.quantity > 1 ? 's' : ''}</span>
                        <span className="text-lg font-bold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Order Summary */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${(total * 0.08).toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${(total * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={buyAll} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl mt-6 transition-all duration-200">
                  Buy All Now
                </motion.button>

                <div className="mt-4 text-center">
                  <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <ShoppingBag className="w-24 h-24 mx-auto" />
      </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Looks like you haven't added any items to your cart yet. Start shopping to see some amazing products!</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200">
              Start Shopping
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}



