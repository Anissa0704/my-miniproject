import React, { useState } from 'react';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { ShoppingCart, User, BookOpen } from 'lucide-react';

import Admin from './pages/Addmin'

import Home from './pages/Home';

import Cart from './pages/Cart';

import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import ManageCoupons from './pages/ManageCoupons';
import ManageOrders from './pages/ManageOrders';
import ProductDetail from './pages/ProductDetail';

import Checkout from './pages/Checkout';

function App() {

  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {

    setCartItems((prev) => {

      const exist = prev.find((item) => item.id === product.id);

      if (exist) {

        return prev.map((item) =>
item.id === product.id ? { ...item, qty: item.qty + 1 } : item

        );

      }

      return [...prev, { ...product, qty: 1 }];

    });

  };

  const updateQty = (id, amount) => {

    setCartItems((prev) =>

      prev.map((item) =>
item.id === id ? { ...item, qty: Math.max(1, item.qty + amount) } : item

      )

    );

  };

  const removeFromCart = (id) => {

    setCartItems((prev) => prev.filter((item) => item.id !== id));

  };

  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
<Router>
<div className="min-h-screen bg-gray-50 text-gray-800">
<nav className="bg-indigo-700 text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg">
<Link to="/" className="text-2xl font-bold flex items-center gap-2">
<BookOpen size={28} /> MeBook
</Link>
<div className="flex gap-6 items-center">
<Link to="/" className="hover:text-indigo-200 hidden md:block">หน้าแรก</Link>
{!(localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'owner') && (
<Link to="/cart" className="relative p-2 bg-indigo-800 rounded-full hover:bg-indigo-600 transition">
<ShoppingCart size={22} />
              {totalQty > 0 && (
<span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {totalQty}
</span>
              )}
</Link>
)}

{localStorage.getItem('token') ? (
  <>
    {(localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'owner') && (
      <div className="hidden md:flex bg-indigo-800 px-4 py-2 rounded-xl text-sm gap-4 items-center shadow-inner">
        <span className="text-indigo-300 uppercase tracking-widest text-[10px] font-black">Admin Panel:</span>
        <Link to="/admin" className="font-bold hover:text-white transition-colors">📦 จัดการหนังสือ</Link>
        <Link to="/admin/coupons" className="font-bold hover:text-white transition-colors">🎫 จัดการคูปอง</Link>
        <Link to="/admin/orders" className="font-bold hover:text-white transition-colors">📝 ตรวจออเดอร์</Link>
      </div>
    )}
    <Link to="/profile" className="flex items-center gap-2 font-bold hover:text-indigo-200">
      <User size={18} /> สวัสดี {localStorage.getItem('username') || 'Member'}
    </Link>
    <button 
      onClick={() => { localStorage.clear(); window.location.href = '/login'; }} 
      className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition">
      ออกจากระบบ
    </button>
  </>
) : (
  <Link to="/login" className="flex items-center gap-2 bg-white text-indigo-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-50 transition">
    <User size={18} /> เข้าสู่ระบบ
  </Link>
)}
</div>
</nav>
<main className="container mx-auto p-6">
<Routes>
<Route path="/admin" element={
  <ProtectedRoute roleRequired={["admin", "owner"]}>
    <Admin/>
  </ProtectedRoute>
} />
<Route path="/admin/coupons" element={
  <ProtectedRoute roleRequired={["admin", "owner"]}>
    <ManageCoupons/>
  </ProtectedRoute>
} />
<Route path="/admin/orders" element={
  <ProtectedRoute roleRequired={["admin", "owner"]}>
    <ManageOrders/>
  </ProtectedRoute>
} />
<Route path="/" element={<Home onAddToCart={addToCart} />} />
<Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} />} />
<Route path="/cart" element={<Cart cartItems={cartItems} updateQty={updateQty} removeFromCart={removeFromCart} />} />
<Route path="/checkout" element={<Checkout cartItems={cartItems} />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
<Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />
</Routes>
</main>
</div>
</Router>

  );

}

export default App;
 