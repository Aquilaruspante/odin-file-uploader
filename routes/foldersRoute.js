const { Router } = require('express');
const folderControllers = require('../controllers/folderControllers');
const { folderValidator } = require('../validator');
const fileRouter = require('./fileRoute');
const { isAuth, isFolderOwner } = require('../middleware');

const router = new Router();

router.use('/:folderId/files', isAuth, isFolderOwner, fileRouter);

router.get('/new', folderControllers.folderCreateGet);

router.get('/:id', isAuth, isFolderOwner, folderControllers.folderGet);

router.delete('/:id', isAuth, isFolderOwner, folderControllers.folderDelete);

router.post('/', isAuth, folderValidator,  folderControllers.folderCreatePost);

module.exports = router;