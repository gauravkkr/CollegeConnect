const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/request-reset', authController.requestPasswordReset);
router.post('/verify-reset', authController.verifyOtpAndResetPassword);
=======
const { signup, login } = require('../controllers/authController');
const emailController = require('../controllers/emailController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', emailController.sendOtp);
router.post('/send-reset-link', emailController.sendResetLink);
>>>>>>> ebac23d5bb45d0f2f046f235d723170fc71027b7

module.exports = router;
