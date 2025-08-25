const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { signAccessToken } = require('../jwt/generateToken');
const { generateResetToken, validateResetToken, setNewPassword } = require('../services/passwordResetService');
const { sendPasswordResetEmail } = require('../services/emailService');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, isVerified } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, passwordHash, role: role || 'user', isVerified: isVerified || false });
    const token = signAccessToken({ id: user._id, role: user.role });

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signAccessToken({ id: user._id, role: user.role });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

exports.getProfile = async (req, res, next) => {
  const user = await User.findById(req.user._id).select('-passwordHash');
  res.json(user);
};

exports.updateProfile = async (req, res, next) => {
  const updates = {};
  if (req.body.name) updates.name = req.body.name;
  if (req.body.password) updates.passwordHash = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-passwordHash');
  res.json(user);
};





// POST /api/user/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const result = await generateResetToken(email);
    if (!result) return res.status(404).json({ message: 'User not found' });

    const { rawToken } = result;

    // Prefer FRONTEND_URL if you have a UI; fall back to API URL for Postman testing
    const base =
      process.env.FRONTEND_URL ||
      `${req.protocol}://${req.get('host')}`;
    // If pointing to frontend, route might look like: `${base}/reset-password/${rawToken}`
    const resetLink = `${base}/api/user/reset-password/${rawToken}`;

    await sendPasswordResetEmail(email, resetLink);

    // For development convenience you may expose resetLink (remove in prod)
    res.json({ message: 'Password reset link sent', resetLink });
  } catch (err) { next(err); }
};

// POST /api/user/reset-password/:token
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'New password is required' });

    const user = await validateResetToken(token);
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    await setNewPassword(user, password);

    // Auto-login after reset for better UX
    const jwtToken = signAccessToken({ id: user._id, role: user.role });

    res.json({ message: 'Password has been reset', token: jwtToken });
  } catch (err) { next(err); }
};