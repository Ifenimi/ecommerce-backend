const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/adminMiddleware');
const upload = require('../middleware/fileUploadMiddleware');

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', auth.protect, authorize('admin'), upload.array('images', 5), ctrl.create);
router.put('/:id', auth.protect, authorize('admin'), upload.array('images', 5), ctrl.update);
router.delete('/:id', auth.protect, authorize('admin'), ctrl.remove);

module.exports = router;
