const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ msg: "No token provided" });
  
  try {
    const decoded = jwt.verify(token.split(" ")[1] || token, "secret123");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid Token" });
  }
};

exports.isOwner = (req, res, next) => {
  if (req.user.role !== "owner" && req.user.role !== "admin") {
    return res.status(403).json({ msg: "Require Owner or Admin Role" });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Require Admin Role" });
  }
  next();
}; 