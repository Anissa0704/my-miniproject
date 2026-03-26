import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({ username: '', email: '', role: '', address: '', phone: '' });
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        setAddress(res.data.address || '');
        setPhone(res.data.phone || '');
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/auth/profile', { address, phone }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.msg);
      setProfile(res.data.user);
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">ข้อมูลส่วนตัว (Profile)</h2>
      
      {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">ชื่อผู้ใช้ (Username)</p>
          <p className="font-semibold text-lg">{profile.username}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">อีเมล (Email)</p>
          <p className="font-semibold text-lg">{profile.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">ระดับสิทธิ์ (Role)</p>
          <p className="font-semibold text-lg uppercase text-indigo-600">{profile.role}</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4 mt-6">แก้ไขข้อมูลติดต่อ</h3>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">เบอร์โทรศัพท์ (Phone)</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">ที่อยู่สำหรับจัดส่ง (Address)</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-2 rounded h-24 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          ></textarea>
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded font-bold hover:bg-indigo-700 transition">
          บันทึกการเปลี่ยนแปลง
        </button>
      </form>
    </div>
  );
};

export default Profile;
