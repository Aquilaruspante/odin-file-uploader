const ExpressError = require('./ExpressError');
const db = require('./db/queries');

exports.isNotAuth = function isAuth(req, res, next) {
    // che there is a not an authenticated user.
    if (!req.isAuthenticated()) return next();

    res.redirect('/');
};

exports.isAuth = function isAuth(req, res, next) {
    // check there is a user.
    if (req.isAuthenticated()) return next();

    const error = new ExpressError(401, 'Unauthorized!');
    next(error);
};

exports.fileNotNull = function fileNotNull(req, res, next) {
    // check file field is not null
    const { folderId } = req.params;

    if (req.file) return next();

    req.session.messages = { type: 'failure', message: "File field can't be empty" };
    req.session.save(err => {
        if (err) return next(err);
        res.redirect(`/folders/${folderId}/files/new`);
    });
};

exports.isFolderOwner = async function isFolderOwner(req, res, next) {
    const { folderId } = req.params;
    
    if (isNaN(parseInt(folderId))) return next(new ExpressError(400, 'Bad request!'));

    const folder = await db.folderGetById(parseInt(folderId));

    if (folder.userId === req.user.id) return next();

    res.redirect('/');
};

exports.isAdmin = async function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'ADMIN') return next();

    next(new ExpressError(404, 'Page not found'));
};