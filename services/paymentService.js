// Payment stub. Replace with Paystack/Stripe integration later.
const verifyPayment = async (paymentData) => {
  // Simulate success
  return { success: true, reference: paymentData.reference || 'demo-ref' };
};

module.exports = { verifyPayment };
