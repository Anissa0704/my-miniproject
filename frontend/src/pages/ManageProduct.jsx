import React, { useState } from 'react';

const ManageProduct = () => {

  const [product, setProduct] = useState({ title: '', price: '', stock: '' });

  return (
<div className="p-6 bg-white shadow rounded-lg">
<h2 className="text-xl font-bold mb-4">จัดการสต็อกหนังสือ</h2>
<div className="space-y-4">
<input 

          type="text" placeholder="ชื่อหนังสือ" 

          className="w-full border p-2 rounded"

          onChange={(e) => setProduct({...product, title: e.target.value})}

        />
<div className="flex gap-4">
<input type="number" placeholder="ราคา" className="border p-2 rounded w-1/2" />
<input type="number" placeholder="จำนวนสต็อก" className="border p-2 rounded w-1/2" />
</div>
<button className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">

          บันทึกข้อมูลสินค้า
</button>
</div>
</div>

  );

};

export default ManageProduct;
 