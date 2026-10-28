const { Router } = require('express');
const { isNotAuth } = require('../middleware');
const userController = require('../controllers/userControllers');
const { loginValidator, registerValidator } = require('../validator');

const router = new Router();

router.get('/register', isNotAuth, userController.userCreateGet);

router.post('/register', isNotAuth, registerValidator,  userController.userCreatePost);

router.get('/login',isNotAuth, userController.loginGet);

router.post('/login', isNotAuth, loginValidator, userController.loginPost);

router.get('/logout', userController.logout);

module.exports = router;