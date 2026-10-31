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