import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag, Trash2, CheckCircle, XCircle } from 'lucide-react';

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscount] = useState('');
  const [expirationDate, setDate] = useState('');

  const token = localStorage.getItem('token');

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/coupons', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoupons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/coupons', 
      { code, discountPercentage, expirationDate }, 
      { headers: { Authorization: `Bearer ${token}` } });
      fetchCoupons();
      setCode(''); setDiscount(''); setDate('');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error creating coupon');
    }
  };

  const handleDelete = async (id) => {
    try {
      if(window.confirm('ลบคูปองนี้?')) {
        await axios.delete(`http://localhost:5000/api/coupons/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCoupons();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/coupons/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-800">
        <Tag /> จัดการคูปองส่วนลด
      </h2>

      <form onSubmit={handleCreate} className="bg-gray-50 p-4 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">โค้ด (เช่น SUMMER20)</label>
          <input required value={code} onChange={e=>setCode(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">ส่วนลด (%)</label>
          <input type="number" min="1" max="100" required value={discountPercentage} onChange={e=>setDiscount(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">วันหมดอายุ</label>
          <input type="date" required value={expirationDate} onChange={e=>setDate(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <button type="submit" className="bg-indigo-600 text-white font-bold p-2 rounded hover:bg-indigo-700 transition">
          + สร้างคูปอง
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-50 text-indigo-900 border-b-2 border-indigo-200">
              <th className="p-3">โค้ดส่วนลด</th>
              <th className="p-3">ส่วนลด (%)</th>
              <th className="p-3">วันหมดอายุ</th>
              <th className="p-3 text-center">สถานะ</th>
              <th className="p-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 font-bold text-lg">{c.code}</td>
                <td className="p-3 text-green-600 font-bold">-{c.discountPercentage}%</td>
                <td className="p-3">{new Date(c.expirationDate).toLocaleDateString()}</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleToggle(c._id)} className={c.isActive ? "text-green-500 hover:text-green-700" : "text-gray-400 hover:text-gray-600"}>
                    {c.isActive ? <CheckCircle size={24} className="mx-auto" /> : <XCircle size={24} className="mx-auto" />}
                  </button>
                </td>
                <td className="p-3 text-center">
                  <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-lg">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && <tr><td colSpan="5" className="text-center p-6 text-gray-500">ไม่มีคูปองส่วนลดในระบบ</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCoupons;
