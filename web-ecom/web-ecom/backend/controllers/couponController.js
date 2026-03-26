const Coupon = require('../models/Coupon');

// Create a new coupon (Owner/Admin)
exports.createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expirationDate } = req.body;
    const coupon = new Coupon({ code, discountPercentage, expirationDate });
    await coupon.save();
    res.status(201).json({ msg: 'Coupon created successfully', coupon });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all coupons (Owner/Admin)
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete a coupon (Owner/Admin)
exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Coupon deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Toggle active status (Owner/Admin)
exports.toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ msg: 'Coupon not found' });
    
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json({ msg: 'Coupon status updated', coupon });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Validate a coupon (User during checkout)
exports.validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ msg: 'Invalid or inactive coupon code' });
    }
    
    if (new Date(coupon.expirationDate) < new Date()) {
      return res.status(400).json({ msg: 'Coupon has expired' });
    }

    res.json({ msg: 'Coupon applied', discountPercentage: coupon.discountPercentage });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
