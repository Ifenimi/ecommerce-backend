const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const { sendOrderConfirmation } = require('../services/emailService');

exports.createOrder = async (req, res, next) => {
  try {
    let items = req.body.items; // optional: accept items directly
    if (!items) {
      // build from cart
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (!cart || !cart.items.length) return res.status(400).json({ message: 'Cart empty' });
      items = cart.items.map(i => ({ product: i.product._id, qty: i.qty }));
    }

    // validate products & compute total
    let total = 0;
    const orderItems = [];
    for (const it of items) {
      const p = await Product.findById(it.product);
      if (!p) return res.status(400).json({ message: `Product ${it.product} not found` });
      if (p.stock < it.qty) return res.status(400).json({ message: `Insufficient stock for ${p.name}` });
      orderItems.push({ product: p._id, qty: it.qty, price: p.price });
      total += p.price * it.qty;
    }

    // decrement stock
    for (const it of items) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.qty } });
    }

    const order = await Order.create({ user: req.user._id, items: orderItems, total });

    // Clear cart
    await Cart.findOneAndDelete({ user: req.user._id });

    // send order confirmation (stub)
    await sendOrderConfirmation(req.user.email, order);

    res.status(201).json(order);
  } catch (err) { next(err); }
};

exports.getOrders = async (req, res, next) => {
  if (req.user.role === 'admin') {
    const orders = await Order.find().populate('user','name email').populate('items.product','name price');
    return res.json(orders);
  }
  const orders = await Order.find({ user: req.user._id }).populate('items.product','name price');
  res.json(orders);
};

exports.updateStatus = async (req, res, next) => {
  const { status } = req.body;
  const o = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(o);
};
