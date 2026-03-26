import React, { useState } from 'react';
import axios from 'axios';
import { Trash2, Plus, Minus, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import demonImg from '../assets/demon.jpg';
import dragonballImg from '../assets/dragonball.jpg';
import narutoImg from '../assets/naruto.jpg';
import onepieceImg from '../assets/onepiece.jpg';
import jujutsuImg from '../assets/jujutsu.jpg';
import titanImg from '../assets/titan.jpg';

const imageMap = {
  '/assets/demon.jpg': demonImg,
  '/assets/dragonball.jpg': dragonballImg,
  '/assets/naruto.jpg': narutoImg,
  '/assets/onepiece.jpg': onepieceImg,
  '/assets/jujutsu.jpg': jujutsuImg,
  '/assets/titan.jpg': titanImg,
};

const Cart = ({ cartItems, updateQty, removeFromCart }) => {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const applyCoupon = async () => {
    if (!coupon.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/coupons/validate', { code: coupon }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const percent = res.data.discountPercentage;
      setDiscount(subtotal * (percent / 100));
      alert(`ใช้คูปองสำเร็จ! ได้ส่วนลด ${percent}%`);
    } catch (err) {
      alert(err.response?.data?.msg || 'คูปองไม่ถูกต้องหรือหมดอายุแล้ว');
      setDiscount(0);
    }
  };

  if (cartItems.length === 0) {
    return <div className="text-center py-20"><h2>ตะกร้าว่างจ้า ไปช้อปกันก่อนนะ</h2></div>;
  }

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold mb-4">ตะกร้าสินค้า</h2>
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center bg-white p-4 rounded-xl shadow-sm border">
            <img src={imageMap[item.image || item.img] || item.image || item.img} className="w-16 h-24 object-cover rounded-lg" alt="" />
<div className="ml-4 flex-1">
<h4 className="font-bold">{item.title}</h4>
<p className="text-indigo-600 font-bold">{item.price} บาท</p>
<div className="flex items-center mt-2 gap-4">
<div className="flex border rounded-lg bg-gray-50">
<button onClick={() => updateQty(item.id, -1)} className="p-1"><Minus size={16}/></button>
<span className="px-3 font-bold">{item.qty}</span>
<button onClick={() => updateQty(item.id, 1)} className="p-1"><Plus size={16}/></button>
</div>
<button onClick={() => removeFromCart(item.id)} className="text-red-400"><Trash2 size={20}/></button>
</div>
</div>
</div>

        ))}
</div>
<div className="bg-white p-6 rounded-2xl shadow-lg border h-fit">
<h3 className="font-bold mb-4">สรุปยอด</h3>
<div className="space-y-2 mb-4 border-b pb-4">
<div className="flex justify-between text-gray-600"><span>ยอดรวม</span><span>{subtotal} บาท</span></div>
<div className="flex justify-between text-green-600"><span>ส่วนลด</span><span>-{discount} บาท</span></div>
</div>
<div className="mb-4">
<div className="flex gap-2">
<input 

              type="text" placeholder="โค้ด MEBOOK10" 

              className="border p-2 rounded-lg w-full"

              onChange={(e) => setCoupon(e.target.value)}

            />
<button onClick={applyCoupon} className="bg-gray-800 text-white p-2 rounded-lg"><Ticket size={20}/></button>
</div>
</div>
<div className="flex justify-between text-xl font-bold text-indigo-900 mb-6">
<span>รวมทั้งสิ้น</span><span>{subtotal - discount} บาท</span>
</div>
<button 

          onClick={() => navigate('/checkout')}

          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg"
>

          ไปหน้าชำระเงิน
</button>
</div>
</div>

  );

};

export default Cart;
 