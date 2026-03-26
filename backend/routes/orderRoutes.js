const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isOwner } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer config for mock payment slips
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}_${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Images Only!');
    }
  }
});

router.post('/', verifyToken, upload.single('slip'), orderController.addOrderItems);
router.get('/myorders', verifyToken, orderController.getMyOrders);

// Owner / Admin routes
router.get('/', verifyToken, isOwner, orderController.getOrders);
router.put('/:id/pay', verifyToken, isOwner, orderController.updateOrderToPaid);

module.exports = router;
