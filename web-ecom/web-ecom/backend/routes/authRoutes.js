const router = require("express").Router();
const auth = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/forgotpassword", auth.forgotPassword);
router.put("/resetpassword/:token", auth.resetPassword);

router.get("/profile", verifyToken, auth.getProfile);
router.put("/profile", verifyToken, auth.updateProfile);

module.exports = router; 