const ExpressError = require('./ExpressError');

exports.isNotAuth = function isAuth(req, res, next) {
    if (!req.isAuthenticated()) return next();

    res.redirect('/');
};

exports.isAuth = function isAuth(req, res, next) {
    if (req.isAuthenticated()) return next();

    const error = new ExpressError(401, 'Unauthorized!');
    next(error);
};

exports.fileNotNull = function fileNotNull(req, res, next) {
    const { folderId } = req.params;

    if (req.file) return next();

    req.session.messages = { type: 'failure', message: "File field can't be empty" };
    req.session.save(err => {
        if (err) return next(err);
        res.redirect(`/folders/${folderId}/files/new`);
    });
};