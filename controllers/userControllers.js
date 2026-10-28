const bcrypt = require('bcrypt');
const passport = require('passport');
const { matchedData, validationResult } = require('express-validator');

const db = require('../db/queries');

exports.userCreateGet = function userCreateGet(req, res) {
    res.render('register')
}

exports.userCreatePost = function userCreatePost(req, res, next) {
    const results = validationResult(req);

    if (results.isEmpty()) {
        const { username, email, password } = matchedData(req);
        const saltRounds = 10;

        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                console.log(err);
                req.session.messages = { type: 'failure', message: 'Somethinge went wrong!' };
                req.session.save(err => {
                    if (err) return next(err);
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
                try {
                    const user = await db.userCreate(username, email, hash);
                    req.login(user, err => {
                        if (err) return next(err);
                        req.session.messages = { type: 'success', message: `Welcome ${username}`};
                        req.session.save(err => {
                            if (err) console.log(err);
                            res.redirect('/');
                        });
                    });
                } catch (err) {
                    return next(err);
                };
            });
        });
    } else {
        const errors = results.array();
        req.session.messages = { type: 'failure', message: errors[0].msg };
        return req.session.save(err => {
            if (err) return next(err);
            res.redirect('/users/register');
        });
    };
};

exports.loginGet = function loginGet(req, res) {
    res.render('login');
};

exports.loginPost = function loginPost(req, res, next) {
    const results = validationResult(req);

    if (results.isEmpty()) {
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
    } else {
        const errors = results.array();
        req.session.messages = { type: 'failure', message: errors[0].msg };
        return req.session.save(err => {
            if (err) return next(err);
            res.redirect('/users/login');
        });
    };
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