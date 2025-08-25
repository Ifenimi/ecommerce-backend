const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/otpController');

router.post('/send', ctrl.send);
router.post('/verify', ctrl.verify);

module.exports = router;
