const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [
    {
      title: { type: String, required: true },
      price: { type: Number, required: true },
      qty: { type: Number, required: true },
      img: { type: String },
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
    }
  ],
  shippingAddress: {
    address: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'Bank Transfer'
  },
  paymentResult: {
    slipUrl: { type: String }, // Path to the uploaded slip image
    status: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' }
  },
  itemsPrice: { type: Number, required: true, default: 0.0 },
  discountPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
