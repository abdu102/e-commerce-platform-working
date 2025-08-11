import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function WishlistPage() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const { data } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => (await axios.get(`${API_URL}/api/wishlist`)).data,
  });
  const items = data || [];
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-gray-600">No items in wishlist.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((w: any) => (
            <div key={w.id} onClick={()=>navigate(`/product/${w.productId}`)} className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition">
              <img src={w.product.imageUrl} alt={w.product.name} className="w-full h-44 object-cover rounded" />
              <div className="mt-3 font-semibold">{w.product.name}</div>
              <div className="text-sm text-gray-600">{w.product.category?.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


