import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

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

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error("Error fetching book", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-xl font-bold">กำลังโหลดข้อมูล...</div>;
  if (!book) return <div className="text-center py-20 text-xl font-bold text-red-500">ไม่พบหนังสือที่ต้องการ</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-lg border border-gray-100">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-indigo-600 font-bold mb-6 hover:underline">
        <ArrowLeft size={20} /> กลับหน้ารายการ
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="flex justify-center">
          <img src={imageMap[book.image] || book.image} alt={book.title} className="w-full max-w-sm rounded-xl shadow-md object-cover" />
        </div>
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-4xl font-black text-indigo-900">{book.title}</h1>
          <p className="text-3xl font-bold text-green-600">{book.price} บาท</p>
          <div className="prose text-gray-700">
            <h3 className="font-bold text-lg mb-2 border-b pb-2">รายละเอียดสินค้า</h3>
            <p>{book.description || 'ไม่มีคำอธิบายเพิ่มเติมสำหรับหนังสือเล่มนี้ (สามารถให้แอดมินเพิ่มรายละเอียดได้ที่ระบบหลังบ้าน)'}</p>
          </div>

          <div className="pt-6 mt-auto border-t">
            <button
              onClick={() => {
                onAddToCart({ id: book._id, ...book });
                alert(`เพิ่ม ${book.title} ลงในตะกร้าแล้ว!`);
              }}
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-indigo-700 transition shadow-lg"
            >
              <ShoppingCart size={28} /> หยิบใส่ตะกร้า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
