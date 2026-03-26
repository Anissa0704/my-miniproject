const router = require('express').Router();
const couponController = require('../controllers/couponController');
const { verifyToken, isOwner } = require('../middleware/auth');

// Owner & Admin routes
router.post('/', verifyToken, isOwner, couponController.createCoupon);
router.get('/', verifyToken, isOwner, couponController.getCoupons);
router.delete('/:id', verifyToken, isOwner, couponController.deleteCoupon);
router.put('/:id/toggle', verifyToken, isOwner, couponController.toggleCoupon);

// User validation route
router.post('/validate', verifyToken, couponController.validateCoupon);

module.exports = router;
