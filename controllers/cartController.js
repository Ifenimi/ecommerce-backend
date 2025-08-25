const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

exports.getCart = async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json(cart || { items: [] });
};

exports.addItem = async (req, res, next) => {
  const { productId, qty = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: 'productId required' });

  const product = await Product.findById(productId);
  if (!product) return res.status(400).json({ message: 'Product not found' });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const idx = cart.items.findIndex(i => i.product.toString() === productId);
  if (idx > -1) cart.items[idx].qty += qty;
  else cart.items.push({ product: productId, qty });

  cart.updatedAt = Date.now();
  await cart.save();
  res.json(cart);
};

exports.updateItem = async (req, res, next) => {
  const { productId, qty } = req.body;
  if (!productId || typeof qty !== 'number') return res.status(400).json({ message: 'productId and qty required' });

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const idx = cart.items.findIndex(i => i.product.toString() === productId);
  if (idx === -1) return res.status(404).json({ message: 'Item not in cart' });

  if (qty <= 0) cart.items.splice(idx, 1);
  else cart.items[idx].qty = qty;

  cart.updatedAt = Date.now();
  await cart.save();
  res.json(cart);
};

exports.clearCart = async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ message: 'Cart cleared' });
};
