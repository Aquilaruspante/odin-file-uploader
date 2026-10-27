const { Router } = require('express');
const folderControllers = require('../controllers/folderControllers');

const router = new Router();

router.get('/:id', folderControllers.folderGet);

module.exports = router;