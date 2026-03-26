import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BookPlus, Users, Tag, LogOut, Edit, Trash2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Import images from src/assets to map database URLs
import demonImg from '../assets/demon.jpg';
import dragonballImg from '../assets/dragonball.jpg';
import narutoImg from '../assets/naruto.jpg';
import onepieceImg from '../assets/onepiece.jpg';
import jujutsuImg from '../assets/jujutsu.jpg';
import titanImg from '../assets/titan.jpg';

const imageMap = {
  '/assets/demon.jpg': demonImg,
  'demonImg': demonImg,
  '/assets/dragonball.jpg': dragonballImg,
  'dragonballImg': dragonballImg,
  '/assets/naruto.jpg': narutoImg,
  'narutoImg': narutoImg,
  '/assets/onepiece.jpg': onepieceImg,
  'onepieceImg': onepieceImg,
  '/assets/jujutsu.jpg': jujutsuImg,
  'jujutsuImg': jujutsuImg,
  '/assets/titan.jpg': titanImg,
  'titanImg': titanImg,
};

const Admin = () => {
  // State สำหรับเก็บข้อมูลหนังสือทั้งหมดที่ดึงมาจากฐานข้อมูล
  const [adminBooks, setAdminBooks] = useState([]);
  
  // State ควบคุมลูกเล่นความสวยงาม เช่น สถานะ "กำลังโหลด..."
  const [loading, setLoading] = useState(true);
  
  // State ปิด/เปิด ฟอร์มกรอกข้อมูลหนังสือ
  const [showForm, setShowForm] = useState(false);
  
  // State จำว่าตอนนี้เรากำลัง "แก้ไข" หนังสือเล่มไหนอยู่ (ถ้าเป็น null แปลว่ากำลัง "เพิ่มเนื้อหาใหม่")
  const [editingId, setEditingId] = useState(null);
  
  // ------ State สำหรับเก็บข้อมูลในฟอร์มกรอกหนังสือ ------
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

  const navigate = useNavigate();

  // ฟังก์ชันสำหรับกดปุ่ม "ออกจากระบบ"
  const handleLogout = () => {
    localStorage.removeItem('token'); // ลบกุญแจยืนยันตัวตน
    localStorage.removeItem('role');  // ลบยศของ User
    navigate('/login');               // เด้งกลับไปหน้าเข้าสู่ระบบ
    window.dispatchEvent(new Event('storage')); // บอกให้เว็บรู้ว่ามีการอัปเดตข้อมูลนะ
  };

  // ฟังก์ชันดึงข้อมูลหนังสือทั้งหมดจากฐานข้อมูลหลังบ้านมาแสดง
  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/books');
      setAdminBooks(res.data); // เอาหนังสือที่ได้มาเก็บลงใน State ที่เตรียมไว้
      setLoading(false);       // ปิดสถานะ "กำลังโหลด..."
    } catch (err) {
      console.error('Error fetching books', err);
      setLoading(false);
    }
  };

  // useEffect จะทำงานแบบอัตโนมัติ "ทันทีที่หน้านี้ถูกเปิดขึ้นมาครั้งแรก"
  useEffect(() => {
    fetchBooks();
  }, []);

  // ตัวช่วยสร้างกุญแจสำหรับการร้องขอ API (แนบ Token ยืนยันว่าเราคือ Admin แน่ๆ)
  const getHeaders = () => {
    const token = localStorage.getItem('token');
    // รูปแบบที่ Backend ต้องการคือ { headers: { Authorization: "jwt_token..." } }
    return { headers: { Authorization: token } };
  };

  // ฟังก์ชันที่ทำงานอัตโนมัติเมื่อเรากดปุ่ม "บันทึกข้อมูล" ในฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรชเอง (พฤติกรรมดั้งเดิมของ HTML form)
    
    // จัดเตรียมข้อมูลทั้งหมดให้เป็นก้อน Object เดียวกัน
    const bookData = { title, price: Number(price), stock: Number(stock), category, image };
    
    try {
      if (editingId) {
        // ถ้าเป็นการแก้ไข (เพราะมี editingId) แวะไปที่ Route: PUT /api/books/:id
        await axios.put(`http://localhost:5000/api/books/${editingId}`, bookData, getHeaders());
      } else {
        // ถ้าไม่มี editingId (สร้างใหม่) แวะไปที่ Route: POST /api/books
        await axios.post('http://localhost:5000/api/books', bookData, getHeaders());
      }
      fetchBooks(); // ขออัปเดตข้อมูลตารางหลังบ้านใหม่เพื่อดูผลลัพธ์
      resetForm();  // ล้างค่าในช่องกรอกให้สะอาด
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      console.error(err);
    }
  };

  // ฟังก์ชันเตรียมข้อมูลเพื่อแก้ไขหนังสือ (คลายข้อมูลลงฟอร์ม)
  const handleEdit = (book) => {
    setEditingId(book._id);
    setTitle(book.title);
    setPrice(book.price);
    setStock(book.stock || 0);
    setCategory(book.category || '');
    setImage(book.image || '');
    setShowForm(true); // เด้งเปิดฟอร์มขึ้นมาโชว์
  };

  // ฟังก์ชันลบหนังสือออกจากระบบแบบถาวร
  const handleDelete = async (id) => {
    if (window.confirm('คุณต้องการลบหนังสือเล่มนี้หรือไม่? (ลบแล้วลบเลยนะ!)')) {
      try {
        await axios.delete(`http://localhost:5000/api/books/${id}`, getHeaders());
        fetchBooks(); // รีโหลดหน้าจออีกครั้ง
      } catch (err) {
        alert('ลบข้อมูลไม่สำเร็จ น่าจะเจอปัญหาทางเทคนิค');
        console.error(err);
      }
    }
  };

  // ฟังก์ชันล้างค่าทุกอย่างในช่องลมให้เป็นค่าเบื้องต้น
  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPrice('');
    setStock('');
    setCategory('');
    setImage('');
    setShowForm(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white p-6 rounded-2xl shadow-sm border h-fit sticky top-24">
        <h2 className="text-xl font-black text-indigo-700 mb-8 flex items-center gap-2">
          <LayoutDashboard /> ระบบหลังบ้าน
        </h2>
        <nav className="space-y-4">
          <Link to="/admin" className="flex items-center gap-3 w-full p-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold">
            <BookPlus size={20} /> จัดการหนังสือ
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
            <Users size={20} /> รายการสั่งซื้อ
          </Link>
          <Link to="/admin/coupons" className="flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
            <Tag size={20} /> จัดการคูปอง
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all mt-10">
            <LogOut size={20} /> ออกจากระบบ
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6 pb-20">
        
        {/* Dashboard Greeting */}
        <div className="mb-2">
          <h1 className="text-3xl font-black text-indigo-900">👋 สวัสดีแอดมิน</h1>
          <p className="text-gray-500 mt-2 font-medium">ยินดีต้อนรับเข้าสู่แดชบอร์ด ภาพรวมระบบร้านหนังสือออนไลน์ของคุณ</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-2xl text-white shadow-lg">
            <p className="opacity-80">จำนวนหนังสือทั้งหมด</p>
            <h3 className="text-3xl font-bold">{adminBooks.length} เล่ม</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-400">ออเดอร์ทั้งหมดในระบบ</p>
            <h3 className="text-3xl font-bold text-gray-800">ตรวจสอบที่เมนู</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-400">หนังสือใกล้หมด (น้อยกว่า 5)</p>
            <h3 className="text-3xl font-bold text-red-500">
              {adminBooks.filter(b => b.stock < 5).length} เล่ม
            </h3>
          </div>
        </div>

        {/* Book Form (Toggleable) */}
        {showForm && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4">{editingId ? 'แก้ไขหนังสือ' : 'เพิ่มหนังสือใหม่'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อหนังสือ</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border rounded-xl" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">หมวดหมู่</label>
                <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ราคา (บาท)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3 border rounded-xl" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">จำนวนสต็อก</label>
                <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full p-3 border rounded-xl" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">URL รูปภาพ</label>
                <input type="text" value={image} onChange={e => setImage(e.target.value)} className="w-full p-3 border rounded-xl" />
              </div>
              <div className="md:col-span-2 flex gap-3 mt-2">
                <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700">{editingId ? 'บันทึกการแก้ไข' : 'เพิ่มหนังสือ'}</button>
                <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200">ยกเลิก</button>
              </div>
            </form>
          </div>
        )}

        {/* ตารางจัดการสินค้า */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
            <h3 className="font-black text-lg text-gray-800">คลังสินค้าหนังสือ</h3>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md flex items-center gap-2">
                <BookPlus size={18} /> เพิ่มหนังสือใหม่
              </button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500 font-bold">กำลังโหลดข้อมูล...</div>
            ) : adminBooks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">ไม่มีข้อมูลหนังสือในระบบ</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-white border-b text-gray-500 text-xs uppercase font-black">
                  <tr>
                    <th className="p-4 w-16">#</th>
                    <th className="p-4">รูปภาพ</th>
                    <th className="p-4">ชื่อหนังสือ</th>
                    <th className="p-4">ราคา</th>
                    <th className="p-4">คงเหลือ</th>
                    <th className="p-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {adminBooks.map((book, index) => (
                    <tr key={book._id} className="hover:bg-indigo-50/30 transition-all group">
                      <td className="p-4 text-gray-400 font-bold">{index + 1}</td>
                      <td className="p-4">
                        <div className="w-12 h-16 bg-gray-100 rounded-lg overflow-hidden border">
                          {book.image ? (
                            <img src={imageMap[book.image] || book.image} alt={book.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-gray-800">{book.title}</td>
                      <td className="p-4 text-indigo-600 font-bold">{book.price} ฿</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${book.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                          {book.stock} เล่ม
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(book)} className="p-2 text-blue-500 hover:bg-blue-100 bg-blue-50 rounded-xl transition-colors">
                            <Edit size={18}/>
                          </button>
                          <button onClick={() => handleDelete(book._id)} className="p-2 text-red-500 hover:bg-red-100 bg-red-50 rounded-xl transition-colors">
                            <Trash2 size={18}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin; 