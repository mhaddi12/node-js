const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Verified token:", verified); // Log the verified token payload
    req.user = verified;
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Log the error for more insights
    return res.status(400).json({ error: "Invalid or expired token" });
  }
};
module.exports = authenticateToken;
