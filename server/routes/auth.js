const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const emailController = require('../controllers/emailController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', emailController.sendOtp);
router.post('/send-reset-link', emailController.sendResetLink);

module.exports = router;
