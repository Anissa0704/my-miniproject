const Order = require('../models/Order');

// ฟังก์ชันตอนที่ลูกค้ากด "สั่งซื้อสินค้า" (ระบบจะสร้างใบสั่งซื้อใหม่)
// สังเกตว่าเราใช้ multer ใน route เพื่อรองรับการอัปโหลด "สลิปโอนเงิน" ด้วย
exports.addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, itemsPrice, discountPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ msg: 'No order items' });
    }

    let slipUrl = null;
    if (req.file) {
      slipUrl = `/uploads/${req.file.filename}`;
    }

    const order = new Order({
      user: req.user.id,
      orderItems: JSON.parse(orderItems), // assuming FormData sends this as a string
      shippingAddress: JSON.parse(shippingAddress),
      paymentResult: {
        slipUrl: slipUrl,
        status: slipUrl ? 'Pending Verification' : 'Pending'
      },
      itemsPrice,
      discountPrice,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📦 ฟังก์ชันดึงประวัติการสั่งซื้อของ "ตัวเอง" (สำหรับลูกค้าทั่วไป)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📋 ฟังก์ชันดึงประวัติการสั่งซื้อ "ทั้งหมดในระบบ" (สำหรับคนที่เป็น Owner หรือ Admin เท่านั้น)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id username email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 💰 ฟังก์ชันอัปเดตสถานะออเดอร์เป็น "ชำระเงินแล้ว" (แอดมินใช้ตอนตรวจสลิปเสร็จ)
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult.status = 'Paid';
      order.isDelivered = req.body.isDelivered || order.isDelivered;
      if (order.isDelivered && !order.deliveredAt) {
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ msg: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
