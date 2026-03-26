import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ฟังก์ชันนี้ทำงานเมื่อผู้ใช้กดปุ่ม "เข้าสู่ระบบ"
  const handleLogin = async (e) => {
    e.preventDefault(); // กันไม่ให้หน้าเว็บรีเฟรชเอง
    try {
      // 1. ส่งข้อมูล username กับ password ไปให้รปภ. (Backend) ตรวจสอบ
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      // 2. ถ้า Backend ให้ผ่าน (แจก Token มา)
      if (res.data.token) {
        // แอบจด "กุญแจ (Token)", "ยศ (Role)", และ "ชื่อ (Username)" เก็บไว้ในกระเป๋าของเบราว์เซอร์ (LocalStorage)
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('username', res.data.username);

        // 3. ตรวจสอบยศ ถ้าเป็นคนดูแลร้าน ให้พาไปห้องเชือด (หลังบ้าน) ถ้าเป็นลูกค้าทั่วไป พาไปหน้าร้าน
        if (res.data.role === 'admin' || res.data.role === 'owner') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        // ตะโกนบอกทุกหน้าจอในเว็บว่า "ฉันล็อกอินเข้ามาระบบแล้วนะ! อัปเดตแถบเมนูด้านบนด่วน!"
        window.dispatchEvent(new Event('storage'));
      } else {
        setError(res.data.msg || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.error || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl mt-10 border border-gray-100">
      <h2 className="text-3xl font-black text-center text-indigo-900 mb-8">เข้าสู่ระบบ</h2>
      {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-center font-bold text-sm">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อผู้ใช้ หรือ อีเมล</label>
          <input 
            type="text" 
            placeholder="ชื่อผู้ใช้งานของคุณ" 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <div className="flex justify-between items-center">
          <Link to="/register" className="text-sm text-indigo-600 font-bold hover:underline">สมัครสมาชิกใหม่</Link>
          <Link to="/forgot-password" className="text-sm text-gray-500 hover:underline">ลืมรหัสผ่าน?</Link>
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg">
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
};

export default Login; 