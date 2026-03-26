import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password
      });
      if (res.data.msg === 'สมัครสำเร็จ') {
        navigate('/login');
      } else {
        setError(res.data.msg || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl mt-10 border border-gray-100">
      <h2 className="text-3xl font-black text-center text-indigo-900 mb-8">สมัครสมาชิก</h2>
      {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-center font-bold text-sm">{error}</div>}
      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อผู้ใช้ (Username)</label>
          <input 
            type="text" 
            placeholder="ตั้งชื่อผู้ใช้งาน" 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">อีเมล (Email)</label>
          <input 
            type="email" 
            placeholder="example@mail.com" 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">รหัสผ่าน</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg">
          ลงทะเบียน
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-gray-600 font-bold">
        มีบัญชีอยู่แล้ว? <Link to="/login" className="text-indigo-600 hover:underline">เข้าสู่ระบบที่นี่</Link>
      </div>
    </div>
  );
};

export default Register;
