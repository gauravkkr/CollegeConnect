const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/request-reset', authController.requestPasswordReset);
router.post('/verify-reset', authController.verifyOtpAndResetPassword);

module.exports = router;
