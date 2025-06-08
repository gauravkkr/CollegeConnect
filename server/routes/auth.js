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

router.post('/signup', signup);
router.post('/login', login);
>>>>>>> parent of ebac23d (added dark mode feature)

module.exports = router;
