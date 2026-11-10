const { Router } = require('express');
const multer = require('multer');
const path = require('node:path');
const fileController = require('../controllers/fileController');
const { fileNotNull } = require('../middleware');

const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

const router = new Router({ mergeParams: true });

router.get('/new', fileController.fileCreateGet);

router.post('/', upload.single('file'), fileNotNull,  fileController.fileCreatePost);

router.get('/:id/view', fileController.fileSend);

router.get('/:id', fileController.fileGet);

module.exports = router;