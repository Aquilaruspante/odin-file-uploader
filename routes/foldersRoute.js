const { Router } = require('express');
const folderControllers = require('../controllers/folderControllers');
const { folderValidator } = require('../validator');
const fileRouter = require('./fileRoute');

const router = new Router();

router.use('/:id/files', fileRouter);

router.get('/new', folderControllers.folderCreateGet);

router.get('/:id', folderControllers.folderGet);

router.post('/', folderValidator,  folderControllers.folderCreatePost);

module.exports = router;