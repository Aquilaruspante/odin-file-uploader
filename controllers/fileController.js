const db = require('../db/queries');

exports.fileCreateGet = function fileCreateGet(req, res) {
    const { id } = req.params;

    res.render('new-file', { id });
};

exports.fileCreatePost = async function fileCreatePost(req, res, next) {
    const { id } = req.params;
    const { originalname, size } = req.file;

    await db.fileCreate(id, originalname, size);

    req.session.messages = { type: 'succes', message: 'File uploaded succesfully!' };
    return req.session.save(err => {
        if (err) next(err);
        res.redirect(`/folders/${id}`);
    });
};