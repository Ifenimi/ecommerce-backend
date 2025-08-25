const crypto = require('crypto');
const Otp = require('../models/otpModel');

const generateOTP = (len = 6) => {
  let otp = '';
  for (let i = 0; i < len; i++) otp += Math.floor(Math.random() * 10);
  return otp;
};

const createOtp = async (email) => {
  await Otp.deleteMany({ email }); // remove old OTPs for that email
  const raw = generateOTP(6);
  const codeHash = crypto.createHash('sha256').update(raw).digest('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await Otp.create({ email, codeHash, expiresAt, used: false });
  return raw;
};

const verifyOtp = async (email, raw) => {
  const hash = crypto.createHash('sha256').update(raw).digest('hex');

  const record = await Otp.findOne({
    email,
    codeHash: hash,
    used: false,
    expiresAt: { $gt: new Date() }
  });

  if (!record) return false;

  record.used = true;
  await record.save();
  return true;
};

module.exports = { createOtp, verifyOtp };
