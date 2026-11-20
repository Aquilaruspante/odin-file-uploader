const { Router } = require('express');
const folderControllers = require('../controllers/folderControllers');
const shareController = require('../controllers/shareController');
const { folderValidator } = require('../validator');
const fileRouter = require('./fileRoute');
const { isAuth, isFolderOwner } = require('../middleware');

const router = new Router();

router.use('/:folderId/files', isAuth, isFolderOwner, fileRouter);

router.get('/new', folderControllers.folderCreateGet);

router.get('/:folderId/share', isAuth, isFolderOwner, folderControllers.folderShare);

router.post('/:folderId/share', isAuth, isFolderOwner, shareController.shareFolderCreate);

router.get('/:folderId/:shareFolderId', isAuth, isFolderOwner, shareController.folderShareGetLink);

router.get('/:folderId', isAuth, isFolderOwner, folderControllers.folderGet);

router.delete('/:folderId', isAuth, isFolderOwner, folderControllers.folderDelete);

router.post('/', isAuth, folderValidator,  folderControllers.folderCreatePost);

module.exports = router;