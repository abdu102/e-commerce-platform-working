import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Truck, Shield, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth.tsx';
import React from 'react';
import { useToast } from '../components/Toast';
import { useLanguage } from '../components/Language';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  images?: string[] | null;
  category?: {
    id: number;
    name: string;
  } | null;
  stock?: number | null;
  specs?: any;
  variants?: Array<{ id: number; color?: string; size?: string; stock: number; priceDelta?: number }>;
}

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useLanguage();
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => (await axios.get(`${API_URL}/api/products/${id}`)).data,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => (await axios.get(`${API_URL}/api/reviews/${id}`)).data,
  });

  const toggleWishlist = useMutation({
    mutationFn: async () => (await axios.post(`${API_URL}/api/wishlist/toggle`, { productId: Number(id) })).data,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['wishlist'] }); toast.success('Wishlist updated'); }
  });

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    setIsAddingToCart(true);
    try {
      await axios.post(`${API_URL}/api/cart`, {
        productId: (product as Product).id,
        quantity,
      });
      toast.success('Added to cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    navigate('/checkout', { state: { product, quantity } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <p className="text-gray-600 mb-4">Error: {(error as any)?.message || 'Product not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  const typedProduct = product as Product;

  let specs: Record<string, unknown> = {};
  try {
    specs = typeof typedProduct.specs === 'string'
      ? JSON.parse(typedProduct.specs)
      : (typedProduct.specs || {});
    if (specs && typeof specs !== 'object') specs = {};
  } catch {
    specs = {};
  }

  const categoryName = typedProduct.category?.name || 'Uncategorized';
  const priceNumber = typeof typedProduct.price === 'number' ? typedProduct.price : 0;
  const stockNumber = typeof typedProduct.stock === 'number' ? typedProduct.stock : 0;
  const gallery = (typedProduct.images && typedProduct.images.length > 0) 
    ? typedProduct.images 
    : [typedProduct.imageUrl || 'https://via.placeholder.com/600x600?text=No+Image'];
  const image = gallery[Math.min(selectedImage, gallery.length - 1)] as string;

  const variantOptions = {
    colors: Array.from(new Set((typedProduct.variants || []).map(v => v.color).filter(Boolean))) as string[],
    sizes: Array.from(new Set((typedProduct.variants || []).map(v => v.size).filter(Boolean))) as string[],
  };
  const matchedVariant = (typedProduct.variants || []).find(v => (selectedColor ? v.color === selectedColor : true) && (selectedSize ? v.size === selectedSize : true));
  const effectiveStock = matchedVariant ? matchedVariant.stock : (typedProduct.stock || 0);
  const effectivePrice = typeof typedProduct.price === 'number' ? typedProduct.price + ((matchedVariant?.priceDelta || 0) / 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg group relative">
              <img src={image as string} alt={typedProduct.name} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">Zoom</div>
            </div>
            
            {/* Additional images placeholder */}
            <div className="grid grid-cols-4 gap-4">
              {gallery.slice(0, 6).map((img, i) => (
                <div
                  key={i}
                  className={`aspect-square bg-white rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImage === i ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img as string} alt={`${typedProduct.name} ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category */}
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {categoryName}
              </span>
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="ml-2 text-sm text-gray-600">({(reviews as any)?.length || 0} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">{typedProduct.name}</h1>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900">
                ${effectivePrice.toFixed(2)}
              </span>
              {effectiveStock < 10 && effectiveStock > 0 && (
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                  Only {effectiveStock} left in stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">{typedProduct.description}</p>

            {/* Variant selectors */}
            {(variantOptions.colors.length > 0 || variantOptions.sizes.length > 0) && (
              <div className="space-y-3">
                {variantOptions.colors.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Color</div>
                    <div className="flex flex-wrap gap-2">
                      {variantOptions.colors.map((c) => (
                        <button key={c} onClick={()=>setSelectedColor(c)} className={`px-3 py-1.5 rounded-full border ${selectedColor===c?'border-blue-600 bg-blue-50':'border-gray-300'}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                )}
                {variantOptions.sizes.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Size</div>
                    <div className="flex flex-wrap gap-2">
                      {variantOptions.sizes.map((s) => (
                        <button key={s} onClick={()=>setSelectedSize(s)} className={`px-3 py-1.5 rounded-full border ${selectedSize===s?'border-blue-600 bg-blue-50':'border-gray-300'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${effectiveStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {effectiveStock > 0 ? `${effectiveStock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-lg font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(Math.max(1, effectiveStock), quantity + 1))}
                    disabled={quantity >= effectiveStock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">{effectiveStock} available</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                disabled={stockNumber === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now - ${(priceNumber * quantity).toFixed(2)}
              </motion.button>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={effectiveStock === 0 || isAddingToCart}
                  className="flex items-center justify-center space-x-2 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                  <span>Add to Cart</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleWishlist.mutate()}
                  className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </motion.button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Truck className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Free Shipping</div>
                  <div className="text-sm text-gray-600">On orders over $50</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Secure Payment</div>
                  <div className="text-sm text-gray-600">100% secure checkout</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 text-purple-600">🔄</div>
                <div>
                  <div className="font-medium text-gray-900">Easy Returns</div>
                  <div className="text-sm text-gray-600">30 day return policy</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        {specs && Object.keys(specs).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-900">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Q&A */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions & Answers</h2>
          <QnaSection productId={Number(id)} />
        </motion.div>

        {/* Reviews */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            {(reviews || []).map((r: any) => (
              <div key={r.id} className="border-b last:border-b-0 pb-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">{r.user?.name || 'User'}</div>
                  <div className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                </div>
                {r.comment && <div className="text-gray-700 mt-1">{r.comment}</div>}
                {r.photos && Array.isArray(r.photos) && r.photos.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {r.photos.map((p: string, i: number) => (
                      <img key={i} src={p} className="w-16 h-16 object-cover rounded" />
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* Write a review */}
            {user && (
              <ReviewForm productId={Number(id)} onSubmitted={()=>queryClient.invalidateQueries({ queryKey: ['reviews', id] })} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ReviewForm({ productId, onSubmitted }: { productId: number; onSubmitted: () => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const readers: Promise<string>[] = [];
    Array.from(files).slice(0, 4).forEach((file) => {
      readers.push(new Promise((res) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result as string);
        fr.readAsDataURL(file);
      }));
    });
    Promise.all(readers).then((imgs) => setPhotos(imgs));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/reviews`, { productId, rating, comment, photos });
      setRating(5);
      setComment('');
      setPhotos([]);
      onSubmitted();
    } catch (err) {
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 border-t pt-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm text-gray-700">Your Rating:</span>
        <div className="flex gap-1 text-yellow-500">
          {[1,2,3,4,5].map((n) => (
            <button type="button" key={n} onClick={()=>setRating(n)} className={n<=rating?'':'opacity-40'}>★</button>
          ))}
        </div>
      </div>
      <textarea value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Write your review..." className="w-full border rounded px-3 py-2 mb-2" />
      <input type="file" accept="image/*" multiple onChange={(e)=>handleFiles(e.target.files)} className="mb-2" />
      <div className="flex gap-2 mb-2">
        {photos.map((p, i)=> (<img key={i} src={p} className="w-16 h-16 object-cover rounded" />))}
      </div>
      <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">{submitting?'Submitting...':'Submit Review'}</button>
    </form>
  );
}

function QnaSection({ productId }: { productId: number }) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const { data, refetch } = useQuery({
    queryKey: ['qna', productId],
    queryFn: async () => (await axios.get(`${API_URL}/api/qna/${productId}`)).data,
  });
  const [question, setQuestion] = useState('');
  const ask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    await axios.post(`${API_URL}/api/qna/question`, { productId, content: question });
    setQuestion('');
    refetch();
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <form onSubmit={ask} className="flex gap-2">
        <input value={question} onChange={(e)=>setQuestion(e.target.value)} placeholder="Ask a question..." className="flex-1 border rounded px-3 py-2" />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Ask</button>
      </form>
      {(data || []).map((q: any) => (
        <div key={q.id} className="border-b last:border-b-0 pb-4">
          <div className="font-medium text-gray-900">{q.user?.name || 'User'}</div>
          <div className="text-gray-800">{q.content}</div>
          {q.answers?.length > 0 && (
            <div className="mt-2 space-y-1">
              {q.answers.map((a: any) => (
                <div key={a.id} className="text-sm text-gray-700"><span className="font-medium">{a.user?.name || 'User'}:</span> {a.content}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

