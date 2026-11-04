const db = require('../db/queries');
const fileCategory = require('../utils/extractMimetype');

exports.fileCreateGet = function fileCreateGet(req, res) {
    const { id } = req.params;

    res.render('new-file', { id });
};

exports.fileCreatePost = async function fileCreatePost(req, res, next) {
    const { id } = req.params;
    const { originalname, size, mimetype, filename } = req.file;

    const category = fileCategory(mimetype);

    await db.fileCreate(id, originalname, size, category, filename);

    req.session.messages = { type: 'succes', message: 'File uploaded succesfully!' };
    return req.session.save(err => {
        if (err) next(err);
        res.redirect(`/folders/${id}`);
    });
};

exports.fileGet = async function fileGet(req, res) {
    const { id } = req.params;

    const file = await db.fileGetByid(id);

    res.render('file', { file });
};