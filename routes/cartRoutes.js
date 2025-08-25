const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/cartController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth.protect, ctrl.getCart);
router.post('/add', auth.protect, ctrl.addItem);
router.post('/update', auth.protect, ctrl.updateItem);
router.delete('/clear', auth.protect, ctrl.clearCart);

module.exports = router;
