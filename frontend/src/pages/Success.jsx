import React from 'react';

import { Link } from 'react-router-dom';

const Success = () => {

  return (
<div className="text-center py-20">
<div className="text-6xl mb-4 text-green-500">✅</div>
<h1 className="text-3xl font-bold mb-2">สั่งซื้อสำเร็จ</h1>
<p className="text-gray-600 mb-8">เราได้รับหลักฐานการโอนเงินแล้ว กรุณารอสักครู่</p>
<Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-full">กลับไปหน้าหลัก</Link>
</div>

  );

};

export default Success;
 