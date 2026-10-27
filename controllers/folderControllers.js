const db = require('../db/queries');
const ExpressError = require('../ExpressError');

exports.folderGet = async function(req, res, next) {
    const { id } = req.params;
    const folder = await db.folderGetById(parseInt(id));

    if (folder.userId === req.user.id) {
        res.render('folder', { folder });
    } else {
        const error = new ExpressError(404, 'Page not found!');
        next(error);
    };
};

exports.folderCreateGet = function folderCreateGet(req, res) {
    res.render('new-folder');
};

exports.folderCreatePost = async function folderCreatePost(req, res) {
    const { name } = req.body;

    const folder = await db.folderCreate(name, req.user.id);

    res.redirect(`/folders/${folder.id}`);
};