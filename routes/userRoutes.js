const { Router } = require('express');
const { passwordMatch, isNotAuth } = require('../middleware');
const userController = require('../controllers/userControllers');
const { use } = require('react');

const router = new Router();

router.get('/register', isNotAuth, userController.userCreateGet);

router.post('/register', isNotAuth, passwordMatch,  userController.userCreatePost);

router.get('/login',isNotAuth, userController.loginGet);

router.post('/login', isNotAuth, userController.loginPost);

router.get('/logout', userController.logout);

module.exports = router;