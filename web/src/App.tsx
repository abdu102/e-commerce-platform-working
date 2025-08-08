import { BrowserRouter, Link, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import { useAuth } from './hooks/useAuth.tsx';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';

const queryClient = new QueryClient();

function ProtectedRoute({ children, requiredRole = 'USER' }: { children: React.ReactNode; requiredRole?: string }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  const roleHierarchy = { 'USER': 1, 'ADMIN': 2, 'SUPER_ADMIN': 3 };
  if (roleHierarchy[user.role as keyof typeof roleHierarchy] < roleHierarchy[requiredRole as keyof typeof roleHierarchy]) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
}

function App() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Q</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    QPick
                  </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                  <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Home
                  </Link>
                  <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Products
                  </Link>
                  {user && (
                    <>
                      <Link to="/orders" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                        Orders
                      </Link>
                      {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                        <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                          Admin
                        </Link>
                      )}
                    </>
                  )}
                </nav>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                  {/* Cart */}
                  <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </Link>

                  {/* User menu */}
                  {user ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">{user.name}</span>
                      <Link
                        to="/user"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Link
                        to="/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Register
                      </Link>
                    </div>
                  )}

                  {/* Mobile menu button */}
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Mobile Navigation */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden border-t border-gray-200 py-4"
                  >
                    <nav className="flex flex-col space-y-4">
                      <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                        Home
                      </Link>
                      <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                        Products
                      </Link>
                      {user && (
                        <>
                          <Link to="/orders" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                            Orders
                          </Link>
                          {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                            <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                              Admin
                            </Link>
                          )}
                        </>
                      )}
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path="/user" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminPage /></ProtectedRoute>} />
              </Routes>
            </AnimatePresence>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">QPick</h3>
                  <p className="text-gray-600 text-sm">
                    Your trusted source for premium technology products.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Categories</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><Link to="/products?category=smartphones" className="hover:text-blue-600 transition-colors">Smartphones</Link></li>
                    <li><Link to="/products?category=laptops" className="hover:text-blue-600 transition-colors">Laptops</Link></li>
                    <li><Link to="/products?category=tablets" className="hover:text-blue-600 transition-colors">Tablets</Link></li>
                    <li><Link to="/products?category=headphones" className="hover:text-blue-600 transition-colors">Headphones</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Shipping Info</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Returns</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">FAQ</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Connect</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Twitter</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Facebook</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Instagram</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">LinkedIn</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
                © {new Date().getFullYear()} QPick. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
