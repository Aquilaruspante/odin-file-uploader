const db = require('../db/queries');
const ExpressError = require('../ExpressError');
const { validationResult, matchedData } = require('express-validator');

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

exports.folderCreatePost = async function folderCreatePost(req, res, next) {
    const results = validationResult(req);

    if (results.isEmpty()) {
        const { name } = matchedData(req);

        const folder = await db.folderCreate(name, req.user.id);

        res.redirect(`/folders/${folder.id}`);
    } else {
        const errors = results.array();
        req.session.messages = { type: 'failure', message: errors[0].msg };
        return req.session.save(err => {
            if (err) next(err);
            res.redirect('/folders/new');
        });
    };
};