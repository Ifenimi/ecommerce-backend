const Product = require('../models/productModel');

exports.list = async (req, res, next) => {
  const products = await Product.find().populate('category','name');
  res.json(products);
};

exports.get = async (req, res, next) => {
  const prod = await Product.findById(req.params.id).populate('category','name');
  if (!prod) return res.status(404).json({ message: 'Not found' });
  res.json(prod);
};

exports.create = async (req, res, next) => {
  const { name, description, price, stock, category } = req.body;
  const images = (req.files || []).map(f => `/uploads/${f.filename}`);
  const product = await Product.create({ name, description, price, stock, category, images });
  res.status(201).json(product);
};

exports.update = async (req, res, next) => {
  const update = { ...req.body };
  if (req.files && req.files.length) update.images = (req.files || []).map(f => `/uploads/${f.filename}`);
  const updated = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json(updated);
};

exports.remove = async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
