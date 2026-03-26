const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// 🟢 ฟังก์ชัน "สมัครสมาชิกใหม่"
// รับข้อมูล username, email, password มาตรวจสอบว่ามีซ้ำไหม ถ้าผ่านก็จะรหัสผ่านให้ปลอดภัย (Hashed) แล้วบันทึกลงฐานข้อมูล
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !username || !password) return res.status(400).json({ msg: "Please enter all fields" });

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ msg: "Username or Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hash });
    await user.save();
    res.json({ msg: "สมัครสำเร็จ" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 🔵 ฟังก์ชัน "เข้าสู่ระบบ (Login)"
// รับ username (หรือ email) และรหัสผ่าน เช็คว่าตรงกับในฐานข้อมูลไหม ถ้าตรงจะแจก "กุญแจ (Token)" ให้เอาไปใช้ยืนยันตัวตน
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const cleanInput = username.trim();
    const regex = new RegExp(`^${cleanInput}$`, "i");
    const user = await User.findOne({ $or: [{ username: regex }, { email: regex }] });
    if (!user) return res.status(400).json({ msg: "ไม่พบ user นี้ในระบบ กรุณาสมัครสมาชิกก่อน" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "รหัสผิด" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: '1d' }
    );
    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// 🟡 ฟังก์ชัน "ลืมรหัสผ่าน" (จำลองการส่งอีเมล)
// สร้าง Token สุ่มจำเพาะขึ้นมา ผูกกับไอดี User แล้วจำลองการส่งเข้าอีเมลเพื่อให้ลูกค้านำไปตั้งรหัสใหม่
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "ไม่พบอีเมลนี้ในระบบ" });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    console.log(`\n=== MOCK EMAIL SENT ===`);
    console.log(`To: ${email}`);
    console.log(`Reset Token: ${resetToken}`);
    console.log(`(Use this token to reset your password via the frontend)`);
    console.log(`=======================\n`);

    res.json({ msg: "ลิงก์รีเซ็ตรหัสผ่านถูกส่ง (จำลองดูใน Terminal)" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// 🟠 ฟังก์ชัน "ตั้งรหัสผ่านใหม่" (หลังจากกดลิงก์ในอีเมล)
// ตรวจสอบ Token ว่าถููกต้องและหมดอายุหรือยัง (ปกติหมดภายใน 10 นาที) ถ้ายังไม่หมดอายุก็จะอัปเดตรหัสผ่านใหม่ให้เลย
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ msg: "Token ล่าช้าหรือไม่ถูกต้อง" });

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ msg: "รีเซ็ตรหัสผ่านสำเร็จ" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// 👤 ฟังก์ชัน "ขอดูข้อมูลส่วนตัว" 
// ดึงข้อมูล User ขึ้นมาแสดงบนเว็บ (เช่น หน้าโปรไฟล์) ยกเว้นพวกรหัสผ่านที่ถูกปิดบังไว้ไม่ส่งไปหน้าบ้าน
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -resetPasswordToken -resetPasswordExpire");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✏️ ฟังก์ชัน "แก้ไขโปรไฟล์"
// นำข้อมูลที่อยู่ (address) และเบอร์โทร (phone) ไปอัปเดตทับข้อมูลเดิมในหน้าโปรไฟล์
exports.updateProfile = async (req, res) => {
  try {
    const { address, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { address, phone }, { new: true }).select("-password");
    res.json({ msg: "อัปเดตข้อมูลสำเร็จ", user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
}; 