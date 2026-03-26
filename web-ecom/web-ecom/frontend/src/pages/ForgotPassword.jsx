import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
      setMessage(res.data.msg);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error sending request');
      setMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-2xl font-bold mb-4 text-center">ลืมรหัสผ่าน</h2>
      {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">อีเมล (Email)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700 transition">
          ส่งลิงก์รีเซ็ตรหัสผ่าน
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link to="/login" className="text-indigo-600 hover:underline">กลับไปหน้าเข้าสู่ระบบ</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;