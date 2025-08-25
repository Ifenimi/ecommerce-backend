const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const generateResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');

  user.resetPasswordToken = hashed;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
  await user.save({ validateBeforeSave: false });

  return { user, rawToken };
};

const validateResetToken = async (rawToken) => {
  const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() }
  });
  return user || null;
};

const setNewPassword = async (user, newPassword) => {
  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  return user;
};

module.exports = { generateResetToken, validateResetToken, setNewPassword };
