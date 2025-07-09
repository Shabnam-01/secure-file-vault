const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, access denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Scenario 1: Token contains username (new tokens)
    if (decoded.username) {
      req.user = {
        _id: decoded.id,
        username: decoded.username,
        email: decoded.email
      };
    } 
    // Scenario 2: Token only has ID (legacy tokens)
    else {
      const user = await User.findById(decoded.id).select("username email _id");
      if (!user) {
        return res.status(401).json({ msg: "User not found." });
      }
      req.user = user;
    }

   
    next();
    
  } catch (err) {
    console.error("JWT Error:", err);
    res.status(400).json({ msg: "Invalid token." });
  }
};

module.exports = authMiddleware;