import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/Toast';
import { LanguageProvider } from './components/Language';
import LanguageToggle from './components/LanguageToggle';
import { AuthProvider, useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const queryClient = new QueryClient();

function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            QPick
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            {user && (
              <>
                <Link to="/cart" className="text-gray-600 hover:text-gray-900">
                  <ShoppingCart className="w-5 h-5" />
                </Link>
                <Link to="/orders" className="text-gray-600 hover:text-gray-900">
                  Orders
                </Link>
                {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
                  <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                    Admin
                  </Link>
                ) : (
                  <Link to="/user" className="text-gray-600 hover:text-gray-900">
                    Profile
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                Home
              </Link>
              {user && (
                <>
                  <Link to="/cart" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                    Cart
                  </Link>
                  <Link to="/orders" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                    Orders
                  </Link>
                  {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
                    <Link to="/admin" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                      Admin
                    </Link>
                  ) : (
                    <Link to="/user" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                      Profile
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              )}
              {!user && (
                <Link to="/login" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <div className="fixed top-4 left-4 z-[1001]"><LanguageToggle /></div>
              <AppContent />
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
