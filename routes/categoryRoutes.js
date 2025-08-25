const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoryController');
const auth = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/adminMiddleware');

router.get('/', ctrl.list);
router.post('/', auth.protect, authorize('admin'), ctrl.create);

module.exports = router;
