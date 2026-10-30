const { Router } = require('express');
const multer = require('multer');
const path = require('node:path');
const fileController = require('../controllers/fileController');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

const router = new Router({ mergeParams: true });

router.get('/new', fileController.fileCreateGet);

router.post('/', upload.single('file'),  fileController.fileCreatePost);

module.exports = router;