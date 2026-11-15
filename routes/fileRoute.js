const { Router } = require('express');
const multer = require('multer');
const path = require('node:path');
const fileController = require('../controllers/fileController');
const { fileNotNull } = require('../middleware');

let upload;

if (process.env.STORAGE === 'local') {
    upload = multer({ dest: path.join(__dirname, '..', 'uploads') });
} else if (process.env.STORAGE === 'cloudinary') {
    const storage = multer.memoryStorage();
    upload = multer({ storage: storage });
};


const router = new Router({ mergeParams: true });

router.get('/new', fileController.fileCreateGet);

router.post('/', upload.single('file'), fileNotNull,  fileController.fileCreatePost);

router.get('/:id/view', fileController.fileSend);

router.get('/:id', fileController.fileGet);

router.delete('/:id', fileController.fileDelete);

module.exports = router;