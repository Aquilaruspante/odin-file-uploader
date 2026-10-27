const { Router } = require('express');
const folderControllers = require('../controllers/folderControllers');

const router = new Router();

router.get('/new', folderControllers.folderCreateGet);

router.get('/:id', folderControllers.folderGet);

router.post('/', folderControllers.folderCreatePost);

module.exports = router;