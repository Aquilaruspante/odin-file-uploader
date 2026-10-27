const bcrypt = require('bcrypt');
const passport = require('passport');

const db = require('../db/queries');

exports.userCreateGet = function userCreateGet(req, res) {
    res.render('register')
}

exports.userCreatePost = function userCreatePost(req, res, next) {
    const { username, email, password } = req.body;
    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            console.log(err);
            req.session.messages = { type: 'failure', message: 'Somethinge went wrong!' };
            req.session.save(err => {
                if (err) console.log(err);
                return res.redirect('/users/register');
            });
        }
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                console.log(err);
                req.session.messages = { type: 'failure', message: 'Somethinge went wrong!' };
                req.session.save(err => {
                    if (err) console.log(err);
                    return res.redirect('/users/register');
                });
            }
            const user = await db.userCreate(username, email, hash);
            console.log('user', user);
            req.login(user, err => {
                if (err) return next(err);
                req.session.messages = { type: 'success', message: `Welcome ${username}`};
                req.session.save(err => {
                    if (err) console.log(err);
                    res.redirect('/');
                });
            });
        });
    });
};

exports.loginGet = function loginGet(req, res) {
    res.render('login');
};

exports.loginPost = function loginPost(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.session.messages = { type: 'failure', message: 'Wrong credentials!' };
            return req.session.save(err => {
                if (err) return next(err);
                res.redirect('/users/login');
            });
        };
        req.login(user, err => {
            if (err) return next(err);
            req.session.messages = { type: 'success', message: `Welcome ${user.username}` };
            req.session.save(err => {
                if (err) return next(err);
                res.redirect('/');
            });  
        });
    })(req, res, next);
};

exports.logout = function logout(req, res) {
    try {
        req.logout(err => {
        if (err) return next(err);
            req.session.messages = { type: 'success', message: 'Succesfully logged out!' };
            req.session.save(err => {
                if (err) return next(err);
                return res.redirect('/');
            })
        })
    } catch (err) {
        console.log(err);
        return next(err);
    };
};