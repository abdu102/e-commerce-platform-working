import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Heart, Star, Filter } from 'lucide-react';

function BannerSlider() {
  const slides = [
    { id: 1, title: 'Summer Tech Sale', subtitle: 'Up to 40% off', color: 'from-pink-500 to-yellow-500' },
    { id: 2, title: 'Back to School', subtitle: 'Laptops and more', color: 'from-blue-500 to-purple-500' },
    { id: 3, title: 'Pro Accessories', subtitle: 'Gear for creators', color: 'from-emerald-500 to-cyan-500' },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, []);
  const s = slides[idx];
  return (
    <div className={`relative overflow-hidden rounded-2xl p-8 text-white bg-gradient-to-r ${s.color} shadow-lg mb-10`}>
      <div className="text-2xl md:text-3xl font-bold">{s.title}</div>
      <div className="opacity-90">{s.subtitle}</div>
      <div className="absolute inset-y-0 left-0 w-24 bg-white/10 blur-2xl -skew-x-12" />
      <div className="absolute bottom-3 right-4 flex gap-2">
        {slides.map((slide, i) => (
          <button key={slide.id} onClick={()=>setIdx(i)} className={`w-2.5 h-2.5 rounded-full ${i===idx?'bg-white':'bg-white/50'}`} aria-label={`Go to slide ${i+1}`} />
        ))}
      </div>
    </div>
  );
}
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: {
    id: number;
    name: string;
  };
  stock: number;
  specs: any;
}

interface Category {
  id: number;
  name: string;
  imageUrl: string;
  products: Product[];
}

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    searchParams.get('category') ? parseInt(searchParams.get('category')!) : null
  );
  const [showFilters, setShowFilters] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await axios.get(`${API_URL}/api/categories`)).data,
  });

  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sort, setSort] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  const queryClient = useQueryClient();
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchTerm, selectedCategory, priceMin, priceMax, onlyInStock, sort],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('categoryId', selectedCategory.toString());
      if (priceMin) params.append('minPrice', priceMin);
      if (priceMax) params.append('maxPrice', priceMax);
      if (onlyInStock) params.append('inStock', 'true');
      if (sort) params.append('sort', sort);
      return (await axios.get(`${API_URL}/api/products?${params}`)).data;
    },
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (selectedCategory) params.append('category', selectedCategory.toString());
    setSearchParams(params);
  }, [searchTerm, selectedCategory, setSearchParams]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const filteredProducts = products || [];

  // Wishlist
  const { data: wishlist } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => (await axios.get(`${API_URL}/api/wishlist`)).data,
    enabled: !!localStorage.getItem('token')
  });
  const toggleWishlist = useMutation({
    mutationFn: async (productId: number) => (await axios.post(`${API_URL}/api/wishlist/toggle`, { productId })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] })
  });
  const isWished = (pid: number) => Array.isArray(wishlist) && wishlist.some((w: any) => w.productId === pid);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Technology
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Find the latest gadgets and electronics at unbeatable prices
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg text-gray-900 bg-white rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BannerSlider />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories?.map((category: Category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(category.id)}
                className={`p-4 rounded-xl text-center transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg overflow-hidden">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Products Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {selectedCategory 
                ? categories?.find((c: any) => c.id === selectedCategory)?.name + ' Products'
                : 'All Products'
              }
            </h3>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="bg-white rounded-xl shadow-md p-4 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price min</label>
                <input value={priceMin} onChange={(e)=>setPriceMin(e.target.value)} type="number" step="0.01" className="w-full border rounded px-3 py-2" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price max</label>
                <input value={priceMax} onChange={(e)=>setPriceMax(e.target.value)} type="number" step="0.01" className="w-full border rounded px-3 py-2" placeholder="1000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort</label>
                <select value={sort} onChange={(e)=>setSort(e.target.value as any)} className="w-full border rounded px-3 py-2">
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={onlyInStock} onChange={(e)=>setOnlyInStock(e.target.checked)} className="rounded" />
                  Only in stock
                </label>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div
                  key={`products-${selectedCategory}-${searchTerm}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredProducts.map((product: Product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ y: -5 }}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                      role="button"
                    >
                      <div className="relative">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <button onClick={(e)=>{e.stopPropagation(); toggleWishlist.mutate(product.id);}} className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                          <Heart className={`w-4 h-4 ${isWished(product.id)?'text-red-500 fill-red-500':'text-gray-600'}`} />
                        </button>
                        {product.stock < 10 && product.stock > 0 && (
                          <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                            Only {product.stock} left
                          </span>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-blue-600 font-medium">
                            {product.category.name}
                          </span>
                          <div className="flex items-center text-yellow-400">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">4.5</span>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                          </span>
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} className="flex items-center space-x-1 bg-brand-600 hover:bg-brand-700 text-white px-3 py-2 rounded-lg transition-colors">
                            <ShoppingCart className="w-4 h-4" />
                            <span className="text-sm">View</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or browse all categories
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}


