import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  return (
    <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold text-brand-600">QPick</Link>
        <form onSubmit={(e)=>{e.preventDefault(); navigate(q?`/?q=${encodeURIComponent(q)}`:'/')}} className="flex-1">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search tech..." className="w-full border rounded-full px-4 py-2 bg-gray-50 focus:bg-white" />
        </form>
        <nav className="flex items-center gap-4">
          <Link to="/cart" className="text-sm hover:text-brand-600">Cart</Link>
          {user ? (
            <div className="flex items-center gap-3">
              {user.role !== 'USER' && <Link to="/admin" className="text-sm text-brand-600">Admin</Link>}
              <button onClick={logout} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="px-3 py-1 rounded bg-brand-600 text-white hover:bg-brand-700 text-sm">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}


