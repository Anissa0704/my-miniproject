import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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

const Home = ({ onAddToCart }) => {
  const [books, setBooks] = useState([]);

  // React Hook: ทำงานแบบอัตโนมัติ 1 ครั้งถ้วน ตอนที่หน้าเว็บโหลดขึ้นมาเสร็จ
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // ขอข้อมูล "หนังสือทั้งหมด" จากฐานข้อมูลที่ตั้งอยู่บนพอร์ต 5000
        const res = await axios.get('http://localhost:5000/api/books');
        setBooks(res.data); // เอาหนังสือที่ได้มาเรียงรอไว้ในตัวแปร books
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {/* ใช้ map() เพื่อวนลูปหยิบหนังสือออกมาวาดทีละเล่ม (เหมือนเครื่องถ่ายเอกสาร) */}
      {books.map((book) => (
        <div key={book._id} className="bg-white p-4 rounded-xl shadow-md border hover:scale-105 transition-all flex flex-col justify-between">
          <Link to={`/product/${book._id}`}>
            {/* ระบบแปลงรูปภาพ: ถ้า URL ภาพตรงกับ imageMap ของเครื่องเรา ก็ใช้รูปในเครื่อง ถ้าไม่ตรงก็ใช้ URL นั้นตรงๆ */}
            <img src={imageMap[book.image] || book.image} className="w-full h-60 object-cover rounded-lg mb-4" alt={book.title} />
            <h3 className="font-bold text-lg hover:text-indigo-600 transition-colors cursor-pointer">{book.title}</h3>
          </Link>
          <p className="text-indigo-600 font-semibold mb-2">{book.price} บาท</p>
          <button 
            onClick={() => onAddToCart({ id: book._id, ...book })}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg mt-auto hover:bg-indigo-700 transition-colors"
          >
            เพิ่มลงตะกร้า
          </button>
        </div>
      ))}
    </div>
  );
};

export default Home; 