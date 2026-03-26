import React from 'react';

const ManageOrders = () => {

  const orders = [

    { id: 'ORD001', user: 'คุณสมชาย', total: 270, status: 'รอการตรวจสอบ', slip: 'view_slip.jpg' }

  ];

  return (
<div className="p-6">
<h1 className="text-2xl font-bold mb-4">รายการสั่งซื้อของลูกค้า</h1>
<table className="w-full bg-white rounded shadow">
<thead className="bg-gray-100">
<tr>
<th className="p-3 text-left">Order ID</th>
<th className="p-3 text-left">ลูกค้า</th>
<th className="p-3 text-left">ยอดรวม</th>
<th className="p-3 text-left">สลิป</th>
<th className="p-3 text-left">จัดการ</th>
</tr>
</thead>
<tbody>

          {orders.map(order => (
<tr key={order.id} className="border-t">
<td className="p-3">{order.id}</td>
<td className="p-3">{order.user}</td>
<td className="p-3">{order.total} บาท</td>
<td className="p-3 text-blue-600 underline cursor-pointer">ดูรูปสลิป</td>
<td className="p-3">
<button className="bg-green-500 text-white px-3 py-1 rounded text-sm">ยืนยันการโอน</button>
</td>
</tr>

          ))}
</tbody>
</table>
</div>

  );

};

export default ManageOrders;

 