const express = require('express');
const controller = require('../controller/user.controller');
const validateRegister =require('../../../validate/validate-register');
const validateLogin = require('../../../validate/validate-login');

const authMiddleware = require('../../../middleware/auth.middleware');
const router = express.Router();

router.post('/register',validateRegister, controller.register);
router.post('/login', validateLogin, controller.login);

router.post('/forgot/password',controller.forgot);
router.post('/password/otp',controller.checkOtp);
router.post('/password/reset', controller.resetPassword);

router.get('/detail',authMiddleware.requireAuth, controller.detail);

router.get('/list',authMiddleware.requireAuth, controller.list)

module.exports = router;