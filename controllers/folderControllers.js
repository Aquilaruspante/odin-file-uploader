const db = require('../db/queries');
const ExpressError = require('../ExpressError');
const { validationResult, matchedData } = require('express-validator');
const cloudinary = require('../config/cloudinary');

exports.folderGet = async function(req, res, next) {
    const { folderId } = req.params;

    console.log(folderId, parseInt(folderId));

    if (isNaN(parseInt(folderId))) return next(new ExpressError(400, 'Bad request!'));

    try {
        const folder = await db.folderGetById(parseInt(folderId));

        if (!folder) return next(new ExpressError(404, 'Folder not found!'));

        if (folder.userId === req.user.id) {
            res.render('folder', { folder });
        } else {
            const error = new ExpressError(404, 'Page not found!');
            next(error);
        };
    } catch (err) {
        console.log('this is an error', err);
        next(new ExpressError());
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

exports.folderDelete = async function(req, res, next) {
    const { folderId } = req.params;

    try {
        const folder = await db.folderGetById(parseInt(folderId));
        if (!folder) return next(new ExpressError(404, 'Folder not found!'));

        const results = await Promise.all(folder.files.map(file => cloudinary.uploader.destroy(file.publicId, { resource_type: file.resourceType })));
        
        results.forEach((r, i) => {
            if (results.result !== 'ok') console.warn('Cloudinary', folder.files[i].publicId, r.result);
        })

        await db.folderDeletebyId(parseInt(folderId));

        req.session.messages = { type: 'success', message: 'Folder succesfully deleted!' };
        return req.session.save(err => {
            if (err) return next(err);
            res.redirect('/');
        }) 
    } catch (err) {
        console.log(err);
        const error = new ExpressError();
        next(error);
    };
};

exports.folderShare = async function folderShare(req, res, next) {
    const { folderId } = req.params;

    const folder = await db.folderGetById(parseInt(folderId));

    res.render('share-form', { folder });
};