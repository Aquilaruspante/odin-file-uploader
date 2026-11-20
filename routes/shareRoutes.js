const { Router } = require('express');
const shareController = require('../controllers/shareController');

const router = new Router();


router.get('/:shareId', shareController.shareFolderShow);

module.exports = router;