exports.uploadFiles = async (req, res, next) => {
  const files = (req.files || []).map(f => ({ originalname: f.originalname, path: `/uploads/${f.filename}` }));
  res.json({ files });
};

