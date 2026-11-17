const { Router } = require('express');
const adminController = require('../controllers/adminController');

const router = new Router();

router.get('/', adminController.dashboard);

router.get('/users', adminController.usersGet);

router.get('/users/:userId', adminController.userGetById);

router.delete('/users/:userId', adminController.userDelete);

router.get('/files', adminController.filesGet);

router.get('/files/:fileId', adminController.fileGetById);

module.exports = router;