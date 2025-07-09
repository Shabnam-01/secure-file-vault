const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Signup failed", error: err.message });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    if (user.twoFAEnabled) {
      // user must verify TOTP code first
      return res.json({
        requires2FA: true,
        message: "2FA enabled - please enter code",
        userId: user._id
      });
    }

    

    // otherwise login normally
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, email, password } = req.body;

    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updates.password = hashed;
    }

    await User.findByIdAndUpdate(userId, updates);
    res.json({ success: true, msg: "Profile updated" });
  } catch (err) {
    console.error("Update error", err);
    res.status(500).json({ msg: "Failed to update profile" });
  }
};




exports.enable2FA = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ msg: "User not found" });

  const secret = speakeasy.generateSecret({ length: 20 });

  // ❌ Don't save yet
  // Just return to client
  const issuer = "SecureFileVault";
  const label = `${issuer}:${user.email}`;
  const otpauth_url = `otpauth://totp/${label}?secret=${secret.base32}&issuer=${issuer}`;

  // ✅ Temporarily send secret to client
  res.json({
    otpauth_url,
    base32: secret.base32,
    message: "Scan the QR with Google Authenticator or enter the secret manually"
  });
};





exports.verify2FALogin = async (req, res) => {
  const { userId, token } = req.body;

  if (!userId || !token) {
    return res.status(400).json({ message: "Missing userId or token" });
  }

  const user = await User.findById(userId);
  if (!user || !user.twoFAEnabled || !user.twoFASecret) {
    return res.status(400).json({ message: "Invalid user or 2FA not enabled" });
  }

  const verified = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: "base32",
    token,
    window: 1
  });

  if (!verified) {
    return res.status(400).json({ message: "Invalid 2FA code" });
  }

  const finalToken = jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    success: true,
    token: finalToken,
    user: { username: user.username, email: user.email }
  });
};


exports.verify2FASetup = async (req, res) => {
  const { token, tempSecret } = req.body;

  if (!tempSecret || !token) {
    return res.status(400).json({ message: "Missing tempSecret or token" });
  }

  const verified = speakeasy.totp.verify({
    secret: tempSecret,
    encoding: "base32",
    token,
    window: 1
  });

  if (!verified) {
    return res.status(400).json({ message: "Invalid 2FA code" });
  }

  const user = await User.findById(req.user._id);
  user.twoFASecret = tempSecret;
  user.twoFAEnabled = true;
  await user.save();

  res.json({ success: true, message: "2FA setup complete" });
};









// allow toggling
exports.updateTwoFA = async (req, res) => {
  try {
    const userId = req.user._id;
    const { enabled } = req.body;
    await User.findByIdAndUpdate(userId, { twoFAEnabled: enabled });
    res.json({ success: true, twoFAEnabled: enabled });
  } catch (err) {
    console.error("updateTwoFA error", err);
    res.status(500).json({ msg: "Server error" });
  }
};
