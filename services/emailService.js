const { createOtp } = require('../services/otpService');
const sendMail = require("../utils/sendMail");

async function sendOtp(email) {
  
  const otp = await createOtp(email);
  await sendMail({
    to: email, subject: "Your OTP", text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`,
  });

  return otp;
}

async function sendOrderConfirmation(email, order) {
  const text = `Thanks for your order #${order._id}. Total: ${order.total}`;
  await sendMail({ to: email, subject: "Order confirmation", text });
}

const sendPasswordResetEmail = async (email, resetLink) => {
  const text = `You requested a password reset.\nUse this link within 10 minutes:\n${resetLink}`;
  await sendMail({ to: email, subject: 'Password Reset', text });
};

module.exports = { sendOtp, sendOrderConfirmation, sendPasswordResetEmail };