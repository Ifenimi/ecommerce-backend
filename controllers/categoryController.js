const Category = require('../models/categoryModel');

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Category exists' });
    const cat = await Category.create({ name });
    res.status(201).json(cat);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  const cats = await Category.find();
  res.json(cats);
};
