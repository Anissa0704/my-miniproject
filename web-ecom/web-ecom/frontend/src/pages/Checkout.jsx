import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Checkout = ({ cartItems }) => {
  const navigate = useNavigate();
  
  // State สำหรับเก็บข้อมูลที่อยู่และเบอร์โทร (ดึงมาจากโปรไฟล์เดิมถ้ามี)
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  
  // State สำหรับเก็บ "ไฟล์รูปภาพรูปสลิป" และ "รูปตัวอย่างสลิป" (พรีวิว)
  const [slipImage, setSlipImage] = useState(null);
  const [preview, setPreview] = useState(null);
  
  // State ป้องกันการกดปุ่ม "ยืนยันการสั่งซื้อ" รัวๆ
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect: ดึงข้อมูลที่อยู่ของ User มาเติมให้อัตโนมัติทันทีที่เข้าหน้านี้
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if(!token) return navigate('/login');
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddress(res.data.address || '');
        setPhone(res.data.phone || '');
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (cartItems.length === 0) {
    return <div className="text-center py-20 font-bold text-xl">ไม่มีสินค้าในตะกร้า</div>;
  }

  // คำนวณราคาสินค้ารวม (เอา ราคา * จำนวน ของแต่ละชิ้นมาบวกกัน)
  const itemsPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  
  // ส่วนลด (ถ้ามีระบบคูปองส่งต่อมาจากหน้า Cart ค่อยเอามาใส่ตรงนี้)
  const discountPrice = 0; 
  
  // ยอดชำระสุทธิ (ราคารวม - ส่วนลด)
  const totalPrice = itemsPrice - discountPrice;

  // ฟังก์ชันพรีวิวสลิป: ทำงานเมื่อผู้ใช้กดเลือกไฟล์สลิปโอนเงิน
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlipImage(file);                      // เก็บไฟล์จริงไว้เตรียมส่งให้ Backend
      setPreview(URL.createObjectURL(file));   // สร้าง URL จำลองเพื่อแสดงรูปภาพตัวอย่างให้ลูกค้าดู
    }
  };

  // ฟังก์ชันกดปุ่ม "ยืนยันการสั่งซื้อ"
  const submitOrder = async (e) => {
    e.preventDefault();
    if (!slipImage) return alert('กรุณาแนบภาพสลิปโอนเงิน เพื่อเป็นหลักฐานให้ร้านค้านะครับ');
    setIsSubmitting(true); // ล็อคปุ่มเบิ้ล

    // สร้างกล่องพัสดุ FormData (เพราะต้องแนบไฟล์รูปภาพส่งไปด้วย JSON ธรรมดาส่งรูปไม่ได้)
    const formData = new FormData();
    formData.append('orderItems', JSON.stringify(cartItems));
    formData.append('shippingAddress', JSON.stringify({ address, phone }));
    formData.append('itemsPrice', itemsPrice);
    formData.append('discountPrice', discountPrice);
    formData.append('totalPrice', totalPrice);
    formData.append('slip', slipImage); // แนบไฟล์สลิปตัวจริง!

    try {
      const token = localStorage.getItem('token');
      // ส่งข้อมูลไปที่หลังบ้าน Route: POST /api/orders
      await axios.post('http://localhost:5000/api/orders', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' // บอกแบล็คเอนด์ว่า "ฉันส่งไฟล์รูปไปด้วยนะจ๊ะ"
        }
      });
      alert('สั่งซื้อและส่งสลิปสำเร็จ! รอแอดมินใจดีกดยืนยันออเดอร์ให้นะครับ');
      window.location.href = "/"; // สั่งซื้อเสร็จ เด้งกลับไปหน้าแรก
    } catch (err) {
      alert(err.response?.data?.msg || 'พบปัญหาระหว่างสั่งซื้อ');
      setIsSubmitting(false); // ปลดล็อคปุ่ม
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border">
      <h2 className="text-3xl font-bold mb-6 text-indigo-900 border-b pb-4">ยืนยันการสั่งซื้อ</h2>
      
      <form onSubmit={submitOrder} className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold text-xl mb-4">ข้อมูลจัดส่ง (ดึงจากโปรไฟล์)</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-bold">ที่อยู่จัดส่ง</label>
            <textarea
              required value={address} onChange={(e) => setAddress(e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none" rows="3"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-bold">เบอร์โทรศัพท์</label>
            <input
              required type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <h3 className="font-bold text-xl mb-4 text-green-700">แนบสลิปการโอนเงิน (จำลอง)</h3>
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-500 mb-3">ธนาคารจำลอง: 123-4-56789-0 (ชื่อบัญชี ทดสอบ)</p>
            <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} className="mb-4 w-full" />
            {preview && <img src={preview} alt="Slip" className="max-h-48 mx-auto rounded-lg shadow-sm block" />}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border">
          <h3 className="font-bold text-xl mb-4">สรุปคำสั่งซื้อ</h3>
          <div className="space-y-4 mb-6">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.qty} x {item.title}</span>
                <span className="font-bold">{item.price * item.qty} บาท</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>ราคาสินค้า</span><span>{itemsPrice} บาท</span>
            </div>
            {discountPrice > 0 && (
              <div className="flex justify-between text-green-600">
                <span>ส่วนลดคูปอง</span><span>-{discountPrice} บาท</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-black text-indigo-900 mt-4">
              <span>ยอดชำระสุทธิ</span><span>{totalPrice} บาท</span>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full mt-8 flex justify-center items-center gap-2 py-4 rounded-xl font-bold text-lg text-white transition-all shadow-lg ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
          >
            <CheckCircle /> {isSubmitting ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;