import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.tsx';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  TrendingUp,
  DollarSign,
  UserCheck,
  Crown,
  X,
  Tags,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // dollars
  stock: number;
  imageUrl?: string;
  category: {
    id?: number;
    name: string;
  };
  specs?: any;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
}

interface OrderItem {
  id: number;
  product: { id: number; name: string };
  quantity: number;
  unitPrice: number; // dollars
}

interface Order {
  id: number;
  total: number; // dollars
  createdAt: string;
  status: string;
  address?: string;
  phone?: string;
  items: OrderItem[];
}

interface Category {
  id: number;
  name: string;
}

export default function AdminPage() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [createProductData, setCreateProductData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stock: '',
    imageUrl: '',
    specs: '',
  });
  const [productImageMode, setProductImageMode] = useState<'url' | 'file'>('url');
  const [productImagePreview, setProductImagePreview] = useState<string>('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingProductImageMode, setEditingProductImageMode] = useState<'url' | 'file'>('url');
  const [editingProductImagePreview, setEditingProductImagePreview] = useState<string>('');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => axios.delete(`${API_URL}/api/users/${userId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
  const createAdminMutation = useMutation({
    mutationFn: async ({ name, email, password }: { name: string; email: string; password: string }) => {
      // create user via register then elevate to ADMIN
      const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
      const createdUser = res.data.user;
      await axios.patch(`${API_URL}/api/users/${createdUser.id}/role`, { role: 'ADMIN' });
      return createdUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowCreateAdmin(false);
      setNewAdmin({ name: '', email: '', password: '' });
    },
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => (await axios.get(`${API_URL}/api/products`)).data,
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await axios.get(`${API_URL}/api/users`)).data,
    enabled: !!currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN'),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await axios.get(`${API_URL}/api/categories`)).data,
  });

  // Category create modal state
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [createCategoryData, setCreateCategoryData] = useState({
    name: '',
    imageUrl: '',
  });
  const [categoryImageMode, setCategoryImageMode] = useState<'url' | 'file'>('url');
  const [categoryImagePreview, setCategoryImagePreview] = useState<string>('');

  const ordersQueryKey = currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN' ? ['orders-all'] : ['orders'];
  const { data: orders } = useQuery({
    queryKey: ordersQueryKey,
    queryFn: async () => {
      if (currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN') {
        return (await axios.get(`${API_URL}/api/orders/all`)).data;
      }
      return (await axios.get(`${API_URL}/api/orders`)).data;
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: any) => axios.post(`${API_URL}/api/products`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowCreateProduct(false);
      setCreateProductData({ name: '', description: '', price: '', categoryId: '', stock: '', imageUrl: '', specs: '' });
      setProductImageMode('url');
      setProductImagePreview('');
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => axios.delete(`${API_URL}/api/products/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => axios.put(`${API_URL}/api/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingProduct(null);
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => axios.put(`${API_URL}/api/orders/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKey });
      setEditingOrder(null);
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: User['role'] }) => axios.patch(`${API_URL}/api/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  useEffect(() => {
    if (editingProduct) {
      const src = editingProduct.imageUrl || '';
      setEditingProductImagePreview(src);
      setEditingProductImageMode('url');
    } else {
      setEditingProductImagePreview('');
      setEditingProductImageMode('url');
    }
  }, [editingProduct]);

  const createCategoryMutation = useMutation({
    mutationFn: async (data: any) => axios.post(`${API_URL}/api/categories`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setShowCreateCategory(false);
      setCreateCategoryData({ name: '', imageUrl: '' });
      setCategoryImageMode('url');
      setCategoryImagePreview('');
    }
  });

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const specs = createProductData.specs ? JSON.parse(createProductData.specs) : {};
    await createProductMutation.mutateAsync({
      name: createProductData.name,
      description: createProductData.description,
      price: parseFloat(createProductData.price),
      categoryId: parseInt(createProductData.categoryId),
      stock: parseInt(createProductData.stock),
      imageUrl: createProductData.imageUrl,
      specs: JSON.stringify(specs),
    });
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCategoryMutation.mutateAsync({
      name: createCategoryData.name,
      imageUrl: createCategoryData.imageUrl || undefined,
    });
  };

  const handleProductFileChange = async (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCreateProductData(prev => ({ ...prev, imageUrl: result }));
      setProductImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryFileChange = async (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCreateCategoryData(prev => ({ ...prev, imageUrl: result }));
      setCategoryImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const stats = {
    totalProducts: products?.length || 0,
    totalUsers: users?.length || 0,
    totalOrders: orders?.length || 0,
    totalRevenue: orders?.reduce((sum: number, order: Order) => sum + order.total, 0) || 0,
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'categories', name: 'Categories', icon: Tags },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'orders', name: 'Orders', icon: ShoppingCart },
    ...(currentUser?.role === 'SUPER_ADMIN' ? [{ id: 'admins', name: 'Admins', icon: Users }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {currentUser?.name}!</p>
            </div>
            <div className="flex items-center space-x-2">
              {currentUser?.role === 'SUPER_ADMIN' && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  <Crown className="w-4 h-4" />
                  <span>Super Admin</span>
                </div>
              )}
              {currentUser?.role === 'ADMIN' && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <UserCheck className="w-4 h-4" />
                  <span>Admin</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
        </div>
      </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon as any;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Recent Orders</h3>
                    {orders?.slice(0, 5).map((order: Order) => (
                      <div key={order.id} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">Order #{order.id}</span>
                        <span className="text-sm font-medium">${order.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Low Stock Products</h3>
                    {products?.filter((p: Product) => p.stock < 10).slice(0, 5).map((product: Product) => (
                      <div key={product.id} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">{product.name}</span>
                        <span className="text-sm font-medium text-red-600">{product.stock} left</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Products Management</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateProduct(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </motion.button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products?.map((product: Product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {product.category.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${(product.price / 100).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              product.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-green-600 hover:text-green-900" onClick={() => setEditingProduct(product)}>
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => deleteProductMutation.mutate(product.id)} className="text-red-600 hover:text-red-900">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'categories' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Categories Management</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateCategory(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                  </motion.button>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="font-semibold text-blue-900">Quick Guide: Required Fields</div>
                  <div className="text-sm text-blue-800 mt-1">
                    <span className="font-medium">Category</span>: name (required), imageUrl (optional). 
                    <span className="font-medium ml-3">Product</span>: name, description, price, stock, category, image (URL or upload), specs (JSON optional).
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categories?.map((c: any) => (
                        <tr key={c.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                              {c.imageUrl ? (
                                <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{c.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Array.isArray(c.products) ? c.products.length : 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-gray-900">Users Management</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users?.map((user: User) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.role}
                              onChange={(e) => updateUserRoleMutation.mutate({ userId: user.id, role: e.target.value as User['role'] })}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                              disabled={currentUser?.role !== 'SUPER_ADMIN' || (user.role === 'SUPER_ADMIN' && user.id === currentUser?.id)}
                            >
                              <option value="USER">User</option>
                              <option value="ADMIN">Admin</option>
                              {currentUser?.role === 'SUPER_ADMIN' && <option value="SUPER_ADMIN">Super Admin</option>}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {currentUser?.role === 'SUPER_ADMIN' && (
                              <button 
                                onClick={() => {
                                  // Add edit user functionality here
                                  console.log('Edit user:', user);
                                }} 
                                className="text-green-600 hover:text-green-900 mr-2"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-gray-900">Orders Management</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders?.map((order: Order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-green-600 hover:text-green-900" onClick={() => setEditingOrder(order)}>
                              <Edit className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'admins' && currentUser?.role === 'SUPER_ADMIN' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Admins</h2>
                  <button onClick={() => setShowCreateAdmin(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Create Admin</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users?.filter((u: any) => u.role === 'ADMIN').map((u: any) => (
                        <tr key={u.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onClick={() => deleteUserMutation.mutate(u.id)} className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Create Product Modal */}
        {showCreateProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create New Product</h2>
                <button
                  onClick={() => setShowCreateProduct(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={createProductData.name}
                      onChange={(e) => setCreateProductData({ ...createProductData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      required
                      value={createProductData.categoryId}
                      onChange={(e) => setCreateProductData({ ...createProductData, categoryId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories?.map((category: Category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={createProductData.description}
                    onChange={(e) => setCreateProductData({ ...createProductData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={createProductData.price}
                      onChange={(e) => setCreateProductData({ ...createProductData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      required
                      value={createProductData.stock}
                      onChange={(e) => setCreateProductData({ ...createProductData, stock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                    <div className="flex items-center gap-2 mb-2">
                      <button type="button" onClick={() => setProductImageMode('url')} className={`px-3 py-1.5 rounded-md text-sm inline-flex items-center gap-1 ${productImageMode === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        <LinkIcon className="w-4 h-4" /> URL
                      </button>
                      <button type="button" onClick={() => setProductImageMode('file')} className={`px-3 py-1.5 rounded-md text-sm inline-flex items-center gap-1 ${productImageMode === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        <ImageIcon className="w-4 h-4" /> Upload
                      </button>
                    </div>
                    {productImageMode === 'url' ? (
                      <input
                        type="url"
                        placeholder="https://..."
                        value={createProductData.imageUrl}
                        onChange={(e) => {
                          setCreateProductData({ ...createProductData, imageUrl: e.target.value });
                          setProductImagePreview(e.target.value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProductFileChange(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                    {(productImagePreview || createProductData.imageUrl) && (
                      <div className="mt-2 w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                        <img src={productImagePreview || createProductData.imageUrl} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specifications (JSON)
                  </label>
                  <textarea
                    rows={4}
                    value={createProductData.specs}
                    onChange={(e) => setCreateProductData({ ...createProductData, specs: e.target.value })}
                    placeholder='{"Display": "6.1\"", "Chip": "A17 Pro", "Storage": "128GB"}'
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateProduct(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Create Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Create Category Modal */}
        {showCreateCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create New Category</h2>
                <button onClick={() => setShowCreateCategory(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                  <input
                    type="text"
                    required
                    value={createCategoryData.name}
                    onChange={(e) => setCreateCategoryData({ ...createCategoryData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
                  <div className="flex items-center gap-2 mb-2">
                    <button type="button" onClick={() => setCategoryImageMode('url')} className={`px-3 py-1.5 rounded-md text-sm inline-flex items-center gap-1 ${categoryImageMode === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                      <LinkIcon className="w-4 h-4" /> URL
                    </button>
                    <button type="button" onClick={() => setCategoryImageMode('file')} className={`px-3 py-1.5 rounded-md text-sm inline-flex items-center gap-1 ${categoryImageMode === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                      <ImageIcon className="w-4 h-4" /> Upload
                    </button>
                  </div>
                  {categoryImageMode === 'url' ? (
                    <input
                      type="url"
                      placeholder="https://..."
                      value={createCategoryData.imageUrl}
                      onChange={(e) => {
                        setCreateCategoryData({ ...createCategoryData, imageUrl: e.target.value });
                        setCategoryImagePreview(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCategoryFileChange(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                  {(categoryImagePreview || createCategoryData.imageUrl) && (
                    <div className="mt-2 w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                      <img src={categoryImagePreview || createCategoryData.imageUrl} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-2">
                  <button type="button" onClick={() => setShowCreateCategory(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Create</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
                <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = new FormData(e.target as HTMLFormElement);
                  const data: any = {
                    name: form.get('name') as string,
                    description: form.get('description') as string,
                    price: parseFloat(form.get('price') as string),
                    stock: parseInt(form.get('stock') as string),
                    imageUrl: (form.get('imageUrl') as string) || editingProductImagePreview || undefined,
                    categoryId: parseInt((form.get('categoryId') as string) || `${editingProduct.category?.id || ''}`) || undefined,
                  };
                  const specsText = form.get('specs') as string;
                  if (specsText) {
                    try { data.specs = JSON.parse(specsText); } catch {}
                  }
                  await updateProductMutation.mutateAsync({ id: editingProduct.id, data });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input name="name" defaultValue={editingProduct.name} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea name="description" defaultValue={editingProduct.description} className="w-full px-3 py-2 border rounded" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                    <input name="price" type="number" step="0.01" defaultValue={editingProduct.price} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                    <input name="stock" type="number" defaultValue={editingProduct.stock} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select name="categoryId" defaultValue={editingProduct.category?.id || ''} className="w-full px-3 py-2 border rounded">
                      <option value="">Keep current</option>
                      {categories?.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <div className="flex items-center gap-2 mb-2">
                    <button type="button" onClick={() => setEditingProductImageMode('url')} className={`px-3 py-1.5 rounded-md text-sm inline-flex items-center gap-1 ${editingProductImageMode === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                      <LinkIcon className="w-4 h-4" /> URL
                    </button>
                    <button type="button" onClick={() => setEditingProductImageMode('file')} className={`px-3 py-1.5 rounded-md text-sm inline-flex items-center gap-1 ${editingProductImageMode === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                      <ImageIcon className="w-4 h-4" /> Upload
                    </button>
                  </div>
                  {editingProductImageMode === 'url' ? (
                    <input name="imageUrl" type="url" defaultValue={editingProduct.imageUrl || ''} onChange={(e) => setEditingProductImagePreview(e.target.value)} className="w-full px-3 py-2 border rounded" />
                  ) : (
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => setEditingProductImagePreview(reader.result as string);
                      reader.readAsDataURL(file);
                    }} className="w-full px-3 py-2 border rounded" />
                  )}
                  {editingProductImagePreview && (
                    <div className="mt-2 w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                      <img src={editingProductImagePreview} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specifications (JSON)</label>
                  <textarea name="specs" defaultValue={editingProduct.specs ? JSON.stringify(editingProduct.specs, null, 2) : ''} className="w-full px-3 py-2 border rounded" placeholder='{"Display":"6.1\""}' />
                </div>
                <div className="flex justify-end space-x-4 pt-2">
                  <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Order Modal */}
        {editingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Order #{editingOrder.id}</h2>
                <button onClick={() => setEditingOrder(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = new FormData(e.target as HTMLFormElement);
                  const data: any = {
                    status: form.get('status') as string,
                    address: form.get('address') as string,
                    phone: form.get('phone') as string,
                  };
                  await updateOrderMutation.mutateAsync({ id: editingOrder.id, data });
                }}
                className="space-y-4"
              >
                <select name="status" defaultValue={editingOrder.status} className="w-full px-3 py-2 border rounded">
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELED">CANCELED</option>
                </select>
                <input name="address" defaultValue={editingOrder.address || ''} placeholder="Address" className="w-full px-3 py-2 border rounded" />
                <input name="phone" defaultValue={editingOrder.phone || ''} placeholder="Phone" className="w-full px-3 py-2 border rounded" />
                <div className="flex justify-end space-x-4 pt-2">
                  <button type="button" onClick={() => setEditingOrder(null)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showCreateAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create Admin</h2>
                <button onClick={() => setShowCreateAdmin(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await createAdminMutation.mutateAsync(newAdmin);
                }}
                className="space-y-4"
              >
                <input placeholder="Full name" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} className="w-full px-3 py-2 border rounded" />
                <input type="email" placeholder="Email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} className="w-full px-3 py-2 border rounded" />
                <input type="password" placeholder="Password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} className="w-full px-3 py-2 border rounded" />
                <div className="flex justify-end space-x-4 pt-2">
                  <button type="button" onClick={() => setShowCreateAdmin(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Create</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}


