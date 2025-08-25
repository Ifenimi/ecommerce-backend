const express = require('express');
const router = express.Router();
const upload = require('../middleware/fileUploadMiddleware');
const ctrl = require('../controllers/uploadController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth.protect, upload.array('files', 6), ctrl.uploadFiles);

module.exports = router;
