const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/adminMiddleware');

router.post('/', auth.protect, ctrl.createOrder);
router.get('/', auth.protect, ctrl.getOrders);
router.put('/:id/status', auth.protect, authorize('admin'), ctrl.updateStatus);

module.exports = router;
