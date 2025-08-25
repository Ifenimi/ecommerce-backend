const { createOtp, verifyOtp } = require('../services/otpService');
const { sendOtp } = require('../services/emailService');

exports.send = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const raw = await createOtp(email);
    await sendOtp(email, raw);
    res.json({ message: 'OTP sent successfully.' });
  } catch (err) { next(err); }
};

exports.verify = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: 'Email and code required' });
    const ok = await verifyOtp(email, code);
    if (!ok) return res.status(400).json({ message: 'Invalid or expired OTP' });
    res.json({ message: 'OTP verified' });
  } catch (err) { next(err); }
};
