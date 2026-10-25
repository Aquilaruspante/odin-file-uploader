exports.passwordMatch = function passwordMatch(req, res, next) {
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        req.session.messages = { type: 'failure', message: "Password doesn't match!"};
        req.session.save(err => {
            if (err) console.log(err);
            return res.redirect('/user/register');
        })
    } else {
        next();
    }
};

exports.isNotAuth = function isAuth(req, res, next) {
    if (!req.isAuthenticated()) return next();

    res.redirect('/');
};