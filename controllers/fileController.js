const db = require('../db/queries');
const fileCategory = require('../utils/extractMimetype');
const ExpressError = require('../ExpressError');

exports.fileCreateGet = function fileCreateGet(req, res) {
    const { folderId } = req.params;

    res.render('new-file', { folderId });
};

exports.fileCreatePost = async function fileCreatePost(req, res, next) {
    const { folderId } = req.params;
    const { originalname, size, mimetype, filename } = req.file;

    const category = fileCategory(mimetype);

    await db.fileCreate(folderId, originalname, size, category, filename);

    req.session.messages = { type: 'succes', message: 'File uploaded succesfully!' };
    return req.session.save(err => {
        if (err) next(err);
        res.redirect(`/folders/${id}`);
    });
};

exports.fileGet = async function fileGet(req, res, next) {
    const { id, folderId } = req.params;

    try {
        const file = await db.fileGetByid(id, folderId);
        if (file) {
            res.render('file', { file });
        } else {
            const error = new ExpressError(404, 'Page not found!');
            next(error);
        };
    } catch (e) {
        console.log(e);
        const error = new ExpressError(500, 'Internal Server Error!');
        next(error);
    };
};