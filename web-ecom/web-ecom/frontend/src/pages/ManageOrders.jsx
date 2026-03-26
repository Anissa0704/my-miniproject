import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApprovePayment = async (id) => {
    if(!window.confirm('ยืนยันว่าได้รับยอดเงินแล้วใช่หรือไม่?')) return;
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error updating order');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-800">
        <Package /> จัดการคำสั่งซื้อ (Orders)
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-50 text-indigo-900 border-b-2 border-indigo-200">
              <th className="p-3">รหัส / วันที่</th>
              <th className="p-3">ลูกค้า / ที่อยู่</th>
              <th className="p-3">สินค้า</th>
              <th className="p-3">ยอดรวม</th>
              <th className="p-3 text-center">หลักฐาน (สลิป)</th>
              <th className="p-3 text-center">สถานะ</th>
              <th className="p-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 text-sm">
                  <div className="font-bold text-gray-700">{o._id.slice(-6)}</div>
                  <div className="text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="p-3 text-sm">
                  <div className="font-bold">{o.user?.username || 'Unknown'}</div>
                  <div className="text-gray-500">{o.shippingAddress?.phone}</div>
                </td>
                <td className="p-3 text-sm">
                  <ul className="list-disc pl-4">
                    {o.orderItems.map((item, idx) => (
                      <li key={idx}>{item.qty}x {item.title}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-3 font-bold text-indigo-600">
                  {o.totalPrice} ฿
                </td>
                <td className="p-3 text-center">
                  {o.paymentResult?.slipUrl ? (
                    <a href={`http://localhost:5000${o.paymentResult.slipUrl}`} target="_blank" rel="noreferrer" className="text-blue-500 underline text-sm font-bold">
                      ดูสลิปโอนเงิน
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">ไม่มีสลิป</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {o.isPaid ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-xs flex items-center gap-1 justify-center">
                      <CheckCircle size={14}/> Paid
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-bold text-xs flex items-center gap-1 justify-center">
                      <Clock size={14}/> Pending
                    </span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {!o.isPaid && o.paymentResult?.slipUrl && (
                    <button 
                      onClick={() => handleApprovePayment(o._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-green-700 transition">
                      ยืนยันยอดเงิน
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan="7" className="text-center p-6 text-gray-500">ไม่มีคำสั่งซื้อในระบบ</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
